// Suara: (1) rekaman orang tua di perangkat, (2) file audio/<id>.mp3 yang terdaftar di audio/daftar.json,
// (3) murattal Al-Qur'an dari EveryAyah, (4) suara bawaan HP (text-to-speech) sebagai cadangan.
import {R, ALIAS} from './content.js';
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
export async function allRecs() {
  const keys = await recKeys(), vals = await tx('readonly', s => s.getAll()).catch(() => []);
  return keys.map((key, i) => ({key, blob: vals[i]}));
}
export const clearRecs = () => tx('readwrite', s => s.clear());

// Format rekaman: utamakan AAC (.m4a) karena bisa diputar di semua HP, termasuk iPhone.
const MIMES = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
export const extOf = type => /mp4|m4a|aac/.test(type) ? 'm4a' : /ogg/.test(type) ? 'ogg' : /mpeg|mp3/.test(type) ? 'mp3' : /wav/.test(type) ? 'wav' : 'webm';

// Mikrofon dibuka sekali untuk satu sesi rekam; level() untuk indikator suara.
export async function openMic() {
  const stream = await navigator.mediaDevices.getUserMedia({audio: {echoCancellation: true, noiseSuppression: true, autoGainControl: true}});
  let ctx = null, an = null, buf = null;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    an = ctx.createAnalyser(); an.fftSize = 512; buf = new Uint8Array(an.fftSize);
    ctx.createMediaStreamSource(stream).connect(an);
  } catch {}
  return {
    level() {
      if (!an) return 0;
      an.getByteTimeDomainData(buf);
      let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v - 128));
      return m / 128;
    },
    record() {
      const type = MIMES.find(t => window.MediaRecorder?.isTypeSupported?.(t));
      const mr = new MediaRecorder(stream, type ? {mimeType: type} : undefined);
      const chunks = [];
      mr.ondataavailable = e => e.data.size && chunks.push(e.data);
      mr.start();
      return {
        stop: () => new Promise(res => {
          mr.onstop = () => res(new Blob(chunks, {type: (mr.mimeType || type || 'audio/webm').split(';')[0]}));
          mr.stop();
        }),
      };
    },
    close() { stream.getTracks().forEach(t => t.stop()); ctx?.close().catch(() => {}); },
  };
}

// ---------- file audio buatan sendiri ----------
let files = {};
const filesReady = fetch('audio/daftar.json').then(r => r.ok ? r.json() : {}).then(j => { files = j || {}; }).catch(() => {});
export const fileVoices = () => files;

// Berapa suara rekaman yang belum tersimpan di HP (0 bila HP tidak mendukung penyimpanan offline).
export async function offlineMissing() {
  await filesReady;
  if (!('serviceWorker' in navigator) || !('caches' in window)) return 0;
  let miss = 0;
  for (const f of new Set(Object.values(files))) {
    try { if (!(await caches.match('audio/' + f))) miss++; } catch { return 0; }
  }
  return miss;
}

// Simpan semua suara rekaman ke cache service worker agar bisa diputar tanpa internet.
export async function saveOffline(progress) {
  await filesReady;
  if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
    await Promise.race([new Promise(r => navigator.serviceWorker.addEventListener('controllerchange', r, {once: true})), new Promise(r => setTimeout(r, 4000))]);
  }
  const list = [...new Set(Object.values(files))];
  let ok = 0, failed = 0;
  for (let i = 0; i < list.length; i++) {
    try { const r = await fetch('audio/' + list[i]); if (r.ok) { await r.arrayBuffer(); ok++; } else failed++; } catch { failed++; }
    progress?.(i + 1, list.length);
  }
  return {ok, failed};
}

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
  cur.release?.();
  try { speechSynthesis.cancel(); } catch {}
  cur = null; notify();
}
export const playing = () => cur?.key || null;

// Satu elemen audio dipakai bersama dan "dibuka" pada sentuhan pertama. Di iPhone, elemen yang
// pernah diputar lewat sentuhan boleh diputar lagi walau ada jeda (misalnya menunggu file dimuat).
const player = new Audio();
player.preload = 'auto';
let unlocked = false;
const silence = (() => {
  const n = 800, b = new ArrayBuffer(44 + n), v = new DataView(b);
  const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([b], {type: 'audio/wav'}));
})();
function unlock() {
  if (unlocked) return;
  unlocked = true;
  if (player.src) return;
  player.src = silence;
  player.play().catch(() => { unlocked = false; });
}
addEventListener('pointerdown', unlock, {capture: true});
addEventListener('keydown', unlock, {capture: true});

function playUrl(url, sig) {
  return new Promise(res => {
    sig.el = player;
    sig.release = () => res(false);
    player.onended = () => res(true);
    player.onerror = () => res(false);
    player.src = url;
    player.play().catch(() => res(false));
  });
}

// Urutan potongan suara untuk satu bacaan.
async function sequence(key) {
  const rec = await getRec(key) || (ALIAS[key] && await getRec(ALIAS[key]));
  if (rec) return [{blob: rec}];
  await filesReady;
  const file = files[key] || files[ALIAS[key]];
  // file lokal diambil lewat fetch (bukan streaming) agar tersimpan di cache dan tetap bisa diputar offline;
  // ar/lat disertakan sebagai cadangan suara HP bila file gagal dimuat
  if (file) return [{local: 'audio/' + file, ar: R[key]?.ar, lat: R[key]?.lat}];
  if (key === 'q:kursi') return [{url: ayahUrl(2, 255), ar: AYAT_KURSI.ar, lat: AYAT_KURSI.lat, i: 0}];
  if (key.startsWith('q:')) {
    const k = key.slice(2), s = SURAH.find(x => x.key === k);
    if (!s) return [];
    return s.ayat.map((a, i) => ({url: ayahUrl(s.n, i + 1), ar: a.ar, lat: a.lat, i}));
  }
  const r = R[key];
  return r ? [{ar: r.ar, lat: r.lat}] : [];
}

// opts: repeat (n kali), onAyah(i) dipanggil saat ayat ke-i mulai, arti: membaca arti,
// fallback: teks bahasa Indonesia yang dibacakan suara HP bila belum ada rekaman (mis. soal kuis)
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
      let seq = (await sequence(key)).map(it => ({...it, say: opts.fallback}));
      if (!seq.length && opts.fallback) seq = [{say: opts.fallback}];
      for (let n = 0; n < (opts.repeat || 1) && !sig.stopped; n++) {
        for (const it of seq) {
          if (sig.stopped) break;
          if (it.i != null) opts.onAyah?.(it.i);
          let ok = false;
          let blob = it.blob;
          if (!blob && it.local) blob = await fetch(it.local).then(r => r.ok ? r.blob() : null).catch(() => null);
          if (sig.stopped) break;
          if (blob) {
            const url = URL.createObjectURL(blob);
            ok = await playUrl(url, sig);
            URL.revokeObjectURL(url);
          } else if (it.url) ok = await playUrl(it.url, sig);
          if (!ok && !sig.stopped) {
            if (it.ar) await speak(hasArabicVoice() ? it.ar : it.lat, hasArabicVoice() ? 'ar' : 'id', sig);
            else if (it.say) await speak(it.say, 'id', sig);
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
