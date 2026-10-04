// Suara: (1) rekaman orang tua di perangkat, (2) file audio/<id>.mp3 yang terdaftar di audio/daftar.json,
// (3) murattal Al-Qur'an dari EveryAyah, (4) suara bawaan HP (text-to-speech) sebagai cadangan.
import {R} from './content.js';
import {SURAH, AYAT_KURSI} from './quran.js';
import {S, save} from './store.js';

export const RECITERS = {
  Alafasy_128kbps: 'Syaikh Mishary Alafasy',
  Husary_128kbps: 'Syaikh Mahmoud Al-Husary',
  Minshawy_Murattal_128kbps: 'Syaikh Al-Minshawi',
};
const pad = n => String(n).padStart(3, '0');
const ayahUrl = (s, a) => `https://everyayah.com/data/${S.reciter}/${pad(s)}${pad(a)}.mp3`;

// ---------- rekaman (IndexedDB) ----------
let dbp;
function db() {
  dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open('ruma-shalat', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('rec');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function tx(mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction('rec', mode), st = t.objectStore('rec'), q = fn(st);
    t.oncomplete = () => res(q?.result);
    t.onerror = () => rej(t.error);
  });
}
export const getRec = id => tx('readonly', s => s.get(id)).catch(() => null);
export const saveRec = (id, blob) => tx('readwrite', s => s.put(blob, id));
export const delRec = id => tx('readwrite', s => s.delete(id));
export const recKeys = () => tx('readonly', s => s.getAllKeys()).catch(() => []);

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const mr = new MediaRecorder(stream);
  const chunks = [];
  mr.ondataavailable = e => e.data.size && chunks.push(e.data);
  mr.start();
  return {
    stop: () => new Promise(res => {
      mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); res(new Blob(chunks, {type: mr.mimeType || 'audio/webm'})); };
      mr.stop();
    }),
  };
}

// ---------- file audio buatan sendiri ----------
let files = {};
fetch('audio/daftar.json').then(r => r.ok ? r.json() : {}).then(j => { files = j || {}; }).catch(() => {});

// ---------- text-to-speech ----------
let voices = [];
const loadVoices = () => { try { voices = speechSynthesis.getVoices(); } catch {} };
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
const pick = code => {
  const c = voices.filter(v => (v.lang || '').replace('_', '-').toLowerCase().startsWith(code));
  return c.find(v => /Google|Natural|Online/i.test(v.name)) || c.find(v => v.localService) || c[0] || null;
};
export const hasArabicVoice = () => !!pick('ar');
export const hasTTS = () => 'speechSynthesis' in window;

function speakOnce(text, lang, signal) {
  return new Promise(res => {
    if (!hasTTS() || signal.stopped) return res();
    const u = new SpeechSynthesisUtterance(text);
    const v = pick(lang);
    u.lang = v?.lang || (lang === 'ar' ? 'ar-SA' : 'id-ID');
    if (v) u.voice = v;
    u.rate = lang === 'ar' ? S.rate : Math.min(1, S.rate + 0.1);
    u.onend = u.onerror = () => res();
    speechSynthesis.speak(u);
  });
}
async function speak(text, lang, signal) {
  // dipotong per kalimat agar tidak terputus di sebagian browser
  const parts = text.replace(/([،.;!?])\s+/g, '$1\n').split('\n').filter(Boolean);
  for (const p of parts) { if (signal.stopped) return; await speakOnce(p, lang, signal); }
}

// ---------- pemutar ----------
let cur = null;
const listeners = new Set();
export const onPlayState = fn => { listeners.add(fn); return () => listeners.delete(fn); };
const notify = () => listeners.forEach(fn => fn(cur?.key || null));

export function stop() {
  if (!cur) return;
  cur.stopped = true;
  cur.el?.pause();
  try { speechSynthesis.cancel(); } catch {}
  cur = null; notify();
}
export const playing = () => cur?.key || null;

function playUrl(url, sig) {
  return new Promise(res => {
    const a = new Audio(url);
    sig.el = a;
    a.onended = () => res(true);
    a.onerror = () => res(false);
    a.play().catch(() => res(false));
  });
}

// Urutan potongan suara untuk satu bacaan.
// bacaan yang lafaznya sama memakai rekaman yang sama
const ALIAS = {takbir2: 'takbir', takbir33: 'takbir', d_marah: 'taawudz', d_bersin: 'tahmid'};

async function sequence(key) {
  const rec = await getRec(key) || (ALIAS[key] && await getRec(ALIAS[key]));
  if (rec) return [{blob: rec}];
  const file = files[key] || files[ALIAS[key]];
  if (file) return [{url: 'audio/' + file}];
  if (key === 'q:kursi') return [{url: ayahUrl(2, 255), ar: AYAT_KURSI.ar, lat: AYAT_KURSI.lat, i: 0}];
  if (key.startsWith('q:')) {
    const k = key.slice(2), s = SURAH.find(x => x.key === k);
    if (!s) return [];
    return s.ayat.map((a, i) => ({url: ayahUrl(s.n, i + 1), ar: a.ar, lat: a.lat, i}));
  }
  const r = R[key];
  return r ? [{ar: r.ar, lat: r.lat}] : [];
}

// opts: repeat (n kali), onAyah(i) dipanggil saat ayat ke-i mulai, lang 'arti' untuk membaca arti
export async function play(key, opts = {}) {
  stop();
  if (S.muted) { S.muted = false; save(); document.dispatchEvent(new Event('ruma-mute')); }
  const sig = {key: opts.tag || key, stopped: false};
  cur = sig; notify();
  try {
    if (opts.arti) {
      const r = R[key];
      if (r) await speak(r.arti, 'id', sig);
    } else {
      const seq = await sequence(key);
      for (let n = 0; n < (opts.repeat || 1) && !sig.stopped; n++) {
        for (const it of seq) {
          if (sig.stopped) break;
          if (it.i != null) opts.onAyah?.(it.i);
          let ok = false;
          if (it.blob) ok = await playUrl(URL.createObjectURL(it.blob), sig);
          else if (it.url) ok = await playUrl(it.url, sig);
          if (!ok && !sig.stopped && it.ar) {
            if (hasArabicVoice()) await speak(it.ar, 'ar', sig);
            else await speak(it.lat, 'id', sig);
          }
        }
      }
    }
  } finally {
    if (cur === sig) { cur = null; notify(); }
  }
  return !sig.stopped;
}

export async function sayId(text, force = false) {
  if (S.muted && !force) return;
  stop();
  const sig = {key: 'say', stopped: false};
  cur = sig;
  await speak(text, 'id', sig);
  if (cur === sig) cur = null;
}

// ---------- efek suara ----------
let ac;
function tone(freq, t0, dur, type = 'sine', vol = 0.18) {
  ac ||= new (window.AudioContext || window.webkitAudioContext)();
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0;
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination);
  o.start(t); o.stop(t + dur + 0.05);
}
export function sfx(kind) {
  if (S.muted) return;
  try {
    if (kind === 'ok') { tone(660, 0, .15); tone(880, .12, .25); }
    else if (kind === 'no') { tone(220, 0, .25, 'triangle', .15); }
    else if (kind === 'star') { [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * .08, .25, 'sine', .12)); }
    else if (kind === 'tick') { tone(1200, 0, .05, 'square', .04); }
    else if (kind === 'bead') { tone(520, 0, .08, 'sine', .12); }
    else if (kind === 'adzan') { [523, 659, 784, 659, 523].forEach((f, i) => tone(f, i * .22, .3, 'sine', .14)); }
  } catch {}
}
