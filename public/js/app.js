import {R, DOA, WUDHU, FARDHU_WUDHU, SUNNAH_WUDHU, PEMBATAL_WUDHU, TAYAMUM, GERAKAN, BACAAN, WAJIB, SUNNAH,
  SYARAT_WAJIB, SYARAT_SAH, RUKUN, TUMAKNINAH, SUNNAH_ABAD, SUNNAH_HAIAT, PEMBATAL_SHALAT, SAHWI, DZIKIR, QUIZ, BADGES, quizKey} from './content.js';
import {makeZip} from './zip.js';
import {SURAH, AYAT_KURSI} from './quran.js';
import {poseSVG, animateTo} from './figure.js';
import {computeTimes, qibla, CITIES, ORDER, LABEL, WAJIB_KEYS} from './praytimes.js';
import {S, save, bus, addStars, award, once, dayKey, streak, isFull, resetAll} from './store.js';
import * as A from './audio.js';

// ---------- util ----------
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const arNum = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const view = $('#view');
let cleanup = [];
const onLeave = fn => cleanup.push(fn);

// ---------- header ----------
const starEl = $('#starCount'), muteBtn = $('#mute');
const paintStars = () => { starEl.textContent = S.stars; };
const paintMute = () => { muteBtn.textContent = S.muted ? '🔇' : '🔊'; muteBtn.setAttribute('aria-pressed', String(!S.muted)); };
paintStars(); paintMute();
bus.addEventListener('stars', () => { paintStars(); const p = $('.stars'); p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); });
bus.addEventListener('badge', e => badgeToast(e.detail));
document.addEventListener('ruma-mute', paintMute);
muteBtn.onclick = () => { S.muted = !S.muted; save(); paintMute(); if (S.muted) A.stop(); };
$('.stars').onclick = () => go('bintang');

function toast(html, ms = 2600) {
  const t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = html;
  document.body.append(t);
  setTimeout(() => t.classList.add('out'), ms);
  setTimeout(() => t.remove(), ms + 400);
}
function badgeToast(b) {
  if (!b) return;
  A.sfx('star'); confetti();
  toast(`<span class="tbig">${b.ic}</span><span><b>Lencana baru!</b><br>${esc(b.t)}</span>`, 3200);
}
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = $('#confetti'), cols = ['#2A8C80', '#F4B63C', '#E6573F', '#3F93BA', '#7C6BC4', '#C4577E'];
  for (let i = 0; i < 36; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + 'vw'; s.style.background = cols[i % cols.length];
    s.style.animationDelay = Math.random() * .4 + 's'; s.style.animationDuration = 1 + Math.random() * .8 + 's';
    box.append(s); setTimeout(() => s.remove(), 2400);
  }
}
function gain(n, why = '') {
  addStars(n); A.sfx('star');
  toast(`<span class="tbig">⭐</span><span><b>+${n} bintang</b>${why ? '<br>' + esc(why) : ''}</span>`);
}

// ---------- router ----------
const ROUTES = {};
const TITLE = {'': 'RuMa Shalat', wudhu: 'Wudhu', gerakan: 'Gerakan Shalat', bacaan: 'Bacaan Shalat', praktik: 'Ayo Praktik!', jenis: 'Jenis Shalat & Niat',
  rukun: 'Syarat & Rukun', doa: 'Doa Harian', dzikir: 'Dzikir & Tasbih', kuis: 'Kuis', jadwal: 'Jadwal & Checklist', bintang: 'Bintangku', ortu: 'Untuk Orang Tua', studio: 'Studio Rekam'};
const go = path => { location.hash = '#/' + path; };
function render() {
  A.stop();
  cleanup.forEach(fn => { try { fn(); } catch {} }); cleanup = [];
  const [r = '', ...args] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const fn = ROUTES[r] ? r : '';
  $('#title').textContent = TITLE[fn];
  document.body.dataset.route = fn || 'home';
  const back = $('#back');
  back.hidden = !fn;
  $('#logo').hidden = !!fn;
  back.onclick = () => (fn === 'studio' ? go('ortu/ok') : args.length && fn !== 'ortu' ? go(fn) : go(''));
  view.scrollTop = 0; window.scrollTo(0, 0);
  ROUTES[fn](...args);
}
addEventListener('hashchange', render);

// ---------- komponen ----------
function readingCard(id, {compact = false, count} = {}) {
  if (id === 'q:surat') return surahPicker();
  if (id.startsWith('q:')) return quranCard(id);
  const r = R[id];
  if (!r) return '';
  const n = count ?? r.n;
  return `<article class="rd${compact ? ' compact' : ''}" data-rid="${id}">
    <header><b>${esc(r.t)}</b>${n > 1 ? `<span class="badge">${n}×</span>` : ''}</header>
    <p class="ar" lang="ar" dir="rtl">${r.ar}</p>
    <p class="lat" data-reveal>${esc(r.lat)}</p>
    <p class="arti" data-reveal>${esc(r.arti)}</p>
    ${r.note ? `<p class="note">💡 ${esc(r.note)}</p>` : ''}
    <div class="acts"><button class="say" data-play="${id}">▶ Dengar</button><button class="say alt" data-arti="${id}">💬 Arti</button></div>
  </article>`;
}
function quranCard(id) {
  const k = id.slice(2);
  const s = k === 'kursi' ? {nama: 'Ayat Kursi', n: 2, ref: 'QS. Al-Baqarah: 255', ayat: [AYAT_KURSI], pesan: 'Ayat paling agung di dalam Al-Qur\'an. Dibaca setelah shalat dan sebelum tidur.'} : SURAH.find(x => x.key === k);
  if (!s) return '';
  const ref = s.ref || `QS. ${s.nama} (${s.n}) · ${s.ayat.length} ayat`;
  return `<article class="rd qr" data-rid="${id}">
    <header><b>${esc(s.nama)}</b><span class="badge soft">${esc(ref)}</span></header>
    ${s.pesan ? `<p class="note">🌱 ${esc(s.pesan)}</p>` : ''}
    <ol class="ayat">${s.ayat.map((a, i) => `<li data-ayah="${i}">
      <p class="ar" lang="ar" dir="rtl">${a.ar} <span class="ayn">${arNum(k === 'kursi' ? 255 : i + 1)}</span></p>
      <p class="lat" data-reveal>${esc(a.lat)}</p><p class="arti" data-reveal>${esc(a.id)}</p></li>`).join('')}</ol>
    <div class="acts"><button class="say" data-play="${id}">▶ Dengar murattal</button></div>
  </article>`;
}
function surahPicker() {
  const opts = SURAH.filter(s => s.n !== 1).map(s => `<option value="${s.key}">${esc(s.nama)} (${s.ayat.length} ayat)</option>`).join('');
  const k = S.seen.surah || 'ikhlas';
  return `<div class="pickwrap"><label class="pick">Pilih surat pendek: <select id="surahSel">${opts}</select></label>
    <div id="surahBox">${quranCard('q:' + k)}</div></div>`.replace(`value="${k}"`, `value="${k}" selected`);
}
function wireSurahPicker(root = view) {
  const sel = $('#surahSel', root);
  if (!sel) return;
  sel.onchange = () => { S.seen.surah = sel.value; save(); A.stop(); $('#surahBox', root).innerHTML = quranCard('q:' + sel.value); };
}
// tombol putar & arti — delegasi global
view.addEventListener('click', e => {
  const p = e.target.closest('[data-play]'), a = e.target.closest('[data-arti]'), rv = e.target.closest('[data-reveal]');
  if (p) {
    const key = p.dataset.play;
    if (A.playing() === key) return A.stop();
    const card = p.closest('.rd');
    A.play(key, {onAyah: i => { $$('[data-ayah]', card).forEach(li => li.classList.toggle('now', +li.dataset.ayah === i)); }})
      .then(() => card && $$('[data-ayah]', card).forEach(li => li.classList.remove('now')));
  } else if (a) {
    const key = a.dataset.arti;
    if (A.playing() === key + ':arti') return A.stop();
    A.play(key, {arti: true, tag: key + ':arti'});
  } else if (rv) rv.classList.add('shown');
});
A.onPlayState(key => {
  $$('[data-play]').forEach(b => {
    const on = b.dataset.play === key;
    b.classList.toggle('on', on);
    b.textContent = on ? '⏹ Berhenti' : (b.dataset.play.startsWith('q:') ? '▶ Dengar murattal' : '▶ Dengar');
  });
  $$('[data-arti]').forEach(b => { const on = key === b.dataset.arti + ':arti'; b.classList.toggle('on', on); b.textContent = on ? '⏹ Berhenti' : '💬 Arti'; });
});

function banner(ic, t, s, bg, fg = '#fff') {
  return `<div class="banner" style="background:${bg};color:${fg}"><span class="glyph">${ic}</span><div><b>${esc(t)}</b><span>${esc(s)}</span></div></div>`;
}
function tabs(id, list, active) {
  return `<div class="tabs" role="tablist" id="${id}">${list.map(([k, t]) => `<button role="tab" data-tab="${k}" aria-selected="${k === active}">${t}</button>`).join('')}</div>`;
}
function wireTabs(id, paint) {
  const el = $('#' + id);
  el.onclick = e => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    $$('[data-tab]', el).forEach(x => x.setAttribute('aria-selected', String(x === b)));
    A.stop(); A.sfx('tick'); paint(b.dataset.tab);
  };
}
const items = (list, numbered = true) => `<ol class="items${numbered ? '' : ' plain'}">${list.map(([ic, t, d]) =>
  `<li><span class="ic">${ic}</span><div><b>${esc(t)}</b>${d ? `<small>${esc(d)}</small>` : ''}</div></li>`).join('')}</ol>`;
const genderToggle = () => `<div class="seg" id="gsel" role="radiogroup" aria-label="Karakter">
  <button data-g="putra" aria-pressed="${S.gender === 'putra'}">👦 Putra</button><button data-g="putri" aria-pressed="${S.gender === 'putri'}">👧 Putri</button></div>`;
function wireGender(onChange) {
  $('#gsel').onclick = e => {
    const b = e.target.closest('[data-g]'); if (!b) return;
    S.gender = b.dataset.g; save();
    $$('#gsel [data-g]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    onChange();
  };
}
const MASCOT = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 L92 44 H8 Z" fill="#2A8C80" stroke="#1C5E57" stroke-width="4" stroke-linejoin="round"/>
<rect x="16" y="42" width="68" height="50" rx="10" fill="#fff" stroke="#1C5E57" stroke-width="4"/>
<circle cx="37" cy="60" r="5" fill="#2A2833"/><circle cx="63" cy="60" r="5" fill="#2A2833"/><circle cx="39" cy="58" r="1.6" fill="#fff"/><circle cx="65" cy="58" r="1.6" fill="#fff"/>
<path d="M40 71 Q50 80 60 71" fill="none" stroke="#2A2833" stroke-width="4" stroke-linecap="round"/>
<circle cx="27" cy="70" r="5" fill="#F9A383" opacity=".7"/><circle cx="73" cy="70" r="5" fill="#F9A383" opacity=".7"/>
<path d="M76 6 a9 9 0 1 0 9 13 a7 7 0 1 1 -9 -13Z" fill="#F4B63C" stroke="#1C5E57" stroke-width="2.5" stroke-linejoin="round"/></svg>`;

// ---------- lokasi & jadwal ----------
function place() {
  if (S.geo) return {name: 'Lokasi saya', lat: S.geo.lat, lng: S.geo.lng, tz: S.geo.tz};
  const c = CITIES.find(x => x[0] === S.city) || CITIES.find(x => x[0] === 'Jakarta');
  return {name: c[0], lat: c[1], lng: c[2], tz: c[3]};
}
function cityNow(tz) { const d = new Date(Date.now() + tz * 3600e3); return {y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), mins: d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60}; }
function todayTimes(pl = place()) {
  const n = cityNow(pl.tz);
  return {now: n, t: computeTimes(new Date(n.y, n.m, n.d), pl.lat, pl.lng, pl.tz)};
}
function nextPrayer() {
  const pl = place(), {now, t} = todayTimes(pl);
  for (const k of WAJIB_KEYS) if (t[k].mins > now.mins) return {k, at: t[k].text, left: t[k].mins - now.mins, pl};
  const n = cityNow(pl.tz), tm = computeTimes(new Date(n.y, n.m, n.d + 1), pl.lat, pl.lng, pl.tz);
  return {k: 'subuh', at: tm.subuh.text, left: 1440 - now.mins + tm.subuh.mins, pl, besok: true};
}
const fmtLeft = m => { m = Math.max(0, Math.ceil(m)); const h = Math.floor(m / 60), mm = m % 60; return h ? `${h} jam ${mm} menit` : `${mm} menit`; };

// pengingat waktu shalat selama aplikasi terbuka
let lastAlert = '';
setInterval(() => {
  const pl = place(), {now, t} = todayTimes(pl);
  for (const k of WAJIB_KEYS) {
    const id = dayKey() + k;
    if (now.mins >= t[k].mins && now.mins < t[k].mins + 1 && lastAlert !== id) {
      lastAlert = id;
      A.sfx('adzan');
      const msg = `Sudah masuk waktu ${LABEL[k]}! Yuk berwudhu lalu shalat 🕌`;
      toast(`<span class="tbig">🕌</span><span><b>${LABEL[k]} ${t[k].text}</b><br>Yuk berwudhu lalu shalat!</span>`, 8000);
      if (S.notif && document.hidden && 'Notification' in window && Notification.permission === 'granted')
        navigator.serviceWorker?.ready.then(r => r.showNotification('RuMa Shalat', {body: msg, icon: 'icons/icon-192.png', tag: id}));
    }
  }
}, 20000);

// =====================================================================
// BERANDA
// =====================================================================
const MODS = [
  {r: 'wudhu', t: 'Wudhu', s: 'Bersuci sebelum shalat', ic: '💧', bg: '#3F93BA'},
  {r: 'gerakan', t: 'Gerakan Shalat', s: 'Langkah demi langkah', fig: 'ruku', bg: '#2A8C80'},
  {r: 'bacaan', t: 'Bacaan Shalat', s: 'Arab, latin & arti', ic: '📖', bg: '#3E8A4F'},
  {r: 'praktik', t: 'Ayo Praktik!', s: 'Simulasi shalat lengkap', fig: 'sujud', bg: '#E6573F'},
  {r: 'jenis', t: 'Jenis Shalat & Niat', s: 'Wajib, sunnah, rakaat', ic: '🕌', bg: '#7C6BC4'},
  {r: 'rukun', t: 'Syarat & Rukun', s: 'Biar shalatnya sah', ic: '✅', bg: '#D9822B'},
  {r: 'doa', t: 'Doa Harian', s: `${DOA.length} doa sehari-hari`, ic: '🤲', bg: '#C4577E'},
  {r: 'dzikir', t: 'Dzikir & Tasbih', s: 'Setelah shalat', ic: '📿', bg: '#1C5E57'},
  {r: 'kuis', t: 'Kuis', s: 'Mudah, sedang, sulit', ic: '🎯', bg: '#F4B63C', fg: '#2A2833'},
  {r: 'jadwal', t: 'Jadwal & Checklist', s: 'Sudah shalat belum?', ic: '⏰', bg: '#3F93BA'},
];
ROUTES[''] = () => {
  const np = nextPrayer(), today = S.check[dayKey()] || {};
  const nm = S.name ? `, ${esc(S.name)}` : '';
  view.innerHTML = `
    <div class="hello">${MASCOT}<div><h1>Assalamu'alaikum${nm}!</h1><p>Yuk belajar shalat bareng RuMa 🌙</p></div></div>
    <button class="nextcard" data-go="jadwal">
      <span class="nx-ic">${({subuh: '🌅', dzuhur: '☀️', ashar: '🌤️', maghrib: '🌇', isya: '🌙'})[np.k]}</span>
      <span class="nx-tx"><small>${np.besok ? 'Besok' : 'Shalat berikutnya'} · ${esc(np.pl.name)}</small><b>${LABEL[np.k]} ${np.at}</b><small>${fmtLeft(np.left)} lagi</small></span>
      <span class="nx-dots" aria-label="Checklist hari ini">${WAJIB_KEYS.map(k => `<i class="${today[k] ? 'on' : ''}" title="${LABEL[k]}"></i>`).join('')}</span>
    </button>
    <div class="mods">${MODS.map(m => `<button class="mod" data-go="${m.r}" style="background:${m.bg};color:${m.fg || '#fff'}">
      <span class="glyph">${m.fig ? poseSVG(m.fig, S.gender, {mat: false, cls: 'mini'}) : m.ic}</span><span><b>${m.t}</b><small>${m.s}</small></span></button>`).join('')}</div>
    <div class="homefoot">
      <button class="modebtn" data-go="bintang"><span class="ic" style="background:#FCE7B5">⭐</span><span><b>Bintangku</b><small>${S.stars} bintang · ${Object.keys(S.badges).length}/${BADGES.length} lencana</small></span></button>
      <button class="modebtn" data-go="ortu"><span class="ic" style="background:#E3F4EF">👨‍👩‍👧</span><span><b>Untuk Orang Tua</b><small>Pengaturan, rekam suara & sumber materi</small></span></button>
    </div>`;
};
view.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) { A.sfx('tick'); go(g.dataset.go); } });

// =====================================================================
// WUDHU
// =====================================================================
ROUTES.wudhu = () => {
  view.innerHTML = banner('💧', 'Wudhu', 'Sebelum shalat, kita bersuci dulu', '#3F93BA') +
    tabs('wtab', [['langkah', 'Langkah'], ['fardhu', 'Fardhu & Sunnah'], ['batal', 'Pembatal'], ['tayamum', 'Tayamum']], 'langkah') + '<div id="wbody"></div>';
  let i = 0;
  const body = $('#wbody');
  const paintStep = () => {
    const s = WUDHU[i];
    body.innerHTML = `<div class="stage wstage">
        <div class="wic" aria-hidden="true">${s.ic}<span class="drops"><i></i><i></i><i></i></span></div>
        <div class="tags"><span class="badge ${s.hk.startsWith('Fardhu') ? 'red' : 'soft'}">${s.hk}</span>${s.n ? `<span class="badge">${s.n}×</span>` : ''}</div>
        <h3>${i + 1}. ${esc(s.t)}</h3><p>${esc(s.d)}</p>${s.tip ? `<p class="note">💡 ${esc(s.tip)}</p>` : ''}
      </div>
      ${stepNav(i, WUDHU.length)}
      ${(s.read || []).map(id => readingCard(id)).join('')}`;
    wireStepNav(body, d => { i += d; paintStep(); if (i === WUDHU.length - 1 && once('wudhu')) { award('wudhu'); gain(3, 'Hebat, kamu sudah tahu cara wudhu!'); } });
  };
  const paint = t => {
    if (t === 'langkah') return paintStep();
    if (t === 'fardhu') body.innerHTML = `<h3 class="sec">Fardhu wudhu (wajib) — ${FARDHU_WUDHU.length}</h3>${items(FARDHU_WUDHU)}
      <h3 class="sec">Sunnah wudhu</h3>${items(SUNNAH_WUDHU.map(([a, b]) => [a, b]), false)}`;
    if (t === 'batal') body.innerHTML = `<p class="lead">Wudhu menjadi batal kalau:</p>${items(PEMBATAL_WUDHU)}<p class="note">💡 Kalau wudhu batal, berwudhu lagi sebelum shalat.</p>`;
    if (t === 'tayamum') body.innerHTML = `<p class="lead">Tayamum adalah bersuci dengan debu sebagai pengganti wudhu, ketika:</p>
      <ul class="bullets">${TAYAMUM.kapan.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <h3 class="sec">Cara tayamum</h3>${items(TAYAMUM.langkah)}${readingCard('niat_tayamum')}<p class="note">💡 ${esc(TAYAMUM.note)}</p>`;
  };
  wireTabs('wtab', paint); paint('langkah');
};
function stepNav(i, n) {
  return `<div class="stepnav"><button class="round" data-step="-1" ${i === 0 ? 'disabled' : ''} aria-label="Sebelumnya">◀</button>
    <div class="dots">${Array.from({length: n}, (_, k) => `<i class="${k === i ? 'now' : k < i ? 'done' : ''}"></i>`).join('')}</div>
    <button class="round go" data-step="1" ${i === n - 1 ? 'disabled' : ''} aria-label="Berikutnya">▶</button></div>`;
}
function wireStepNav(root, fn) {
  $$('[data-step]', root).forEach(b => b.onclick = () => { A.stop(); A.sfx('tick'); fn(+b.dataset.step); });
}

// =====================================================================
// GERAKAN
// =====================================================================
ROUTES.gerakan = () => {
  let i = 0;
  view.innerHTML = genderToggle() + `<div class="stage figstage"><div id="fig"></div><span class="qib">Kiblat ➜</span></div><div id="gbody"></div>`;
  const fig = $('#fig');
  const paint = (anim = true) => {
    const g = GERAKAN[i];
    if (anim) animateTo(fig, g.pose, S.gender); else fig.innerHTML = poseSVG(g.pose, S.gender);
    $('#gbody').innerHTML = `<div class="gcap"><small>Gerakan ${i + 1} dari ${GERAKAN.length}</small><h3>${esc(g.t)}</h3><p>${esc(g.d)}</p>${g.tip ? `<p class="note">💡 ${esc(g.tip)}</p>` : ''}</div>
      ${stepNav(i, GERAKAN.length)}
      ${(g.read || []).map((id, k) => k === 0 ? readingCard(id) : `<details class="more"><summary>${esc(id.startsWith('q:') ? 'Al-Fatihah' : R[id].t)}</summary>${readingCard(id)}</details>`).join('')}`;
    wireStepNav($('#gbody'), d => {
      i += d; paint();
      if (i === GERAKAN.length - 1 && once('gerakan')) { award('gerakan'); gain(3, 'Kamu sudah mengenal semua gerakan!'); }
    });
  };
  wireGender(() => paint(false));
  fig.innerHTML = poseSVG(GERAKAN[0].pose, S.gender);
  paint(false);
};

// =====================================================================
// BACAAN
// =====================================================================
ROUTES.bacaan = () => {
  view.innerHTML = `<div class="hafal">
      <label><input type="checkbox" id="optLat" ${S.latin ? 'checked' : ''}> Tampilkan latin</label>
      <label><input type="checkbox" id="optArti" ${S.arti ? 'checked' : ''}> Tampilkan arti</label>
    </div>
    <p class="hint">🙈 Mode hafalan: matikan latin/arti, lalu ketuk tulisan yang tersembunyi untuk mengintip.</p>
    ${BACAAN.map(sec => `<h3 class="sec">${esc(sec.h)}</h3>${sec.ids.map(id => readingCard(id)).join('')}`).join('')}`;
  const apply = () => { document.body.classList.toggle('no-lat', !S.latin); document.body.classList.toggle('no-arti', !S.arti); $$('[data-reveal].shown').forEach(x => x.classList.remove('shown')); };
  $('#optLat').onchange = e => { S.latin = e.target.checked; save(); apply(); };
  $('#optArti').onchange = e => { S.arti = e.target.checked; save(); apply(); };
  apply(); wireSurahPicker();
  onLeave(() => document.body.classList.remove('no-lat', 'no-arti'));
};

// =====================================================================
// PRAKTIK SHALAT
// =====================================================================
const PRAK = [['subuh', 'Subuh', 2, '🌅'], ['dzuhur', 'Dzuhur', 4, '☀️'], ['ashar', 'Ashar', 4, '🌤️'], ['maghrib', 'Maghrib', 3, '🌇'], ['isya', 'Isya', 4, '🌙'], ['sunnah', 'Sunnah 2 rakaat', 2, '✨']];
function buildSteps(k, rk, s1, s2) {
  const st = [];
  const add = (rak, pose, t, read = [], extra = {}) => st.push({rak, pose, t, read, ...extra});
  const niat = k === 'sunnah' ? null : 'niat_' + k;
  for (let r = 1; r <= rk; r++) {
    if (r === 1) {
      add(r, 'stand', 'Berdiri menghadap kiblat & niat', niat ? [niat] : [], {hint: 'Niat di dalam hati. Lafaz niat boleh dibaca untuk membantu hati.'});
      add(r, 'takbir', 'Takbiratul ihram', ['takbir']);
      add(r, 'sedekap', 'Doa iftitah', ['iftitah']);
    } else {
      add(r, 'sedekap', `Berdiri ke rakaat ${r}`, ['takbir2'], {hint: 'Bangun sambil membaca "Allaahu akbar".'});
    }
    add(r, 'sedekap', 'Membaca Al-Fatihah', ['q:fatihah', 'aamiin']);
    if (r === 1 && s1) add(r, 'sedekap', 'Membaca surat pendek', ['q:' + s1]);
    if (r === 2 && s2) add(r, 'sedekap', 'Membaca surat pendek', ['q:' + s2]);
    add(r, 'takbir', 'Takbir untuk ruku', ['takbir2'], {short: true});
    add(r, 'ruku', 'Ruku', ['ruku'], {repeat: 3});
    add(r, 'stand', "I'tidal", ['itidal1', 'itidal2']);
    if (k === 'subuh' && r === 2) add(r, 'stand', 'Doa qunut', ['qunut'], {hint: "Sunnah dalam madzhab Syafi'i."});
    add(r, 'sujud', 'Sujud', ['sujud'], {repeat: 3, hint: 'Turun sujud sambil membaca "Allaahu akbar".'});
    add(r, 'duduk', 'Duduk di antara dua sujud', ['duduk']);
    add(r, 'sujud', 'Sujud kedua', ['sujud'], {repeat: 3});
    if (r === 2 && rk > 2) add(r, 'tasyahud', 'Tasyahud awal', ['tasyahud', 'shalawat_awal']);
    if (r === rk) {
      add(r, 'tawarruk', 'Tasyahud akhir', ['tasyahud', 'shalawat_ibrahim']);
      add(r, 'salamR', 'Salam ke kanan', ['salam']);
      add(r, 'salamL', 'Salam ke kiri', ['salam']);
    }
  }
  return st;
}
ROUTES.praktik = () => {
  const opts = SURAH.filter(s => s.n !== 1).map(s => `<option value="${s.key}">${esc(s.nama)}</option>`).join('');
  view.innerHTML = banner(poseSVG('takbir', S.gender, {mat: false, cls: 'mini'}), 'Ayo Praktik Shalat!', 'Ikuti gerakan dan bacaannya, ya', '#E6573F') + `
    <h3 class="sec">1. Pilih shalat</h3>
    <div class="pgrid">${PRAK.map(([k, t, rk, ic]) => `<button class="pbtn${S.practiced[k] ? ' done' : ''}" data-pk="${k}" aria-pressed="false"><span>${ic}</span><b>${t}</b><small>${rk} rakaat${S.practiced[k] ? ' · ✔' : ''}</small></button>`).join('')}</div>
    <h3 class="sec">2. Pilih karakter</h3>${genderToggle()}
    <h3 class="sec">3. Surat pendek</h3>
    <div class="row2"><label class="pick">Rakaat 1 <select id="s1">${opts}</select></label><label class="pick">Rakaat 2 <select id="s2">${opts}</select></label></div>
    <label class="switch"><input type="checkbox" id="auto" checked> <span>Lanjut otomatis setelah bacaan selesai</span></label>
    <button class="bigbtn" id="start" disabled>Pilih shalat dulu</button>`;
  $('#s1').value = 'kautsar'; $('#s2').value = 'ikhlas';
  let pick = null;
  $('.pgrid').onclick = e => {
    const b = e.target.closest('[data-pk]'); if (!b) return;
    pick = PRAK.find(p => p[0] === b.dataset.pk);
    $$('.pbtn').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    A.sfx('tick');
    const st = $('#start'); st.disabled = false; st.textContent = `▶ Mulai Shalat ${pick[1]}`;
  };
  wireGender(() => {});
  $('#start').onclick = () => player(pick, buildSteps(pick[0], pick[2], $('#s1').value, $('#s2').value), $('#auto').checked);
};
function player(pk, steps, autoInit) {
  let i = 0, auto = autoInit, alive = true, timer = 0, token = 0;
  view.innerHTML = `<div class="ptop"><span class="badge big" id="rak"></span><div class="pbar"><i id="pbar"></i></div><span class="pcount" id="pcount"></span></div>
    <div class="stage figstage"><div id="fig"></div><span class="qib">Kiblat ➜</span></div>
    <div class="pcap"><h3 id="ptitle"></h3><p id="phint" class="hint"></p></div>
    <div class="pctl"><button class="round" id="pprev" aria-label="Sebelumnya">⏮</button><button class="round big" id="pplay" aria-label="Putar atau jeda"></button><button class="round go" id="pnext" aria-label="Berikutnya">⏭</button></div>
    <div id="pread"></div>`;
  const fig = $('#fig');
  fig.innerHTML = poseSVG(steps[0].pose, S.gender);
  onLeave(() => { alive = false; clearTimeout(timer); });
  const paintPlay = () => { $('#pplay').textContent = auto ? '⏸' : '▶'; $('#pplay').classList.toggle('on', auto); };
  async function run() {
    clearTimeout(timer);
    const s = steps[i];
    if (!s) return finish();
    animateTo(fig, s.pose, S.gender);
    $('#rak').textContent = `Rakaat ${s.rak} / ${pk[2]}`;
    $('#pbar').style.width = `${(i + 1) / steps.length * 100}%`;
    $('#pcount').textContent = `${i + 1}/${steps.length}`;
    $('#ptitle').textContent = s.t;
    $('#phint').textContent = s.hint || '';
    $('#pread').innerHTML = s.read.map(id => readingCard(id, {compact: true, count: s.repeat})).join('');
    if (!auto) return;
    const my = ++token;
    const live = () => alive && auto && token === my;
    for (const id of s.read) {
      if (!live()) return;
      const card = $(`[data-rid="${CSS.escape(id)}"]`, view);
      card?.classList.add('live');
      if (S.muted) await new Promise(r => { timer = setTimeout(r, 1500 + (R[id]?.ar.length || 300) * 25); });
      else await A.play(id, {repeat: s.repeat || 1, onAyah: k => card && $$('[data-ayah]', card).forEach(li => li.classList.toggle('now', +li.dataset.ayah === k))});
      card?.classList.remove('live');
    }
    if (!s.read.length) await new Promise(r => { timer = setTimeout(r, 1800); });
    if (live()) timer = setTimeout(() => { if (live()) { i++; run(); } }, 700);
  }
  function finish() {
    A.stop(); confetti(); A.sfx('star');
    const first = !S.practiced[pk[0]];
    S.practiced[pk[0]] = Date.now(); save();
    award('praktik');
    if (['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].every(k => S.practiced[k])) award('praktik5');
    if (first) addStars(5); else addStars(1);
    view.innerHTML = `<div class="end"><div class="endfig">${poseSVG('salamR', S.gender)}</div><h3>Alhamdulillah!</h3>
      <p>Praktik shalat ${esc(pk[1])} selesai.<br>Kamu dapat <b>+${first ? 5 : 1} ⭐</b></p>
      <p class="note">🤲 Setelah shalat, jangan lupa berdzikir dan berdoa, ya.</p>
      <div class="row"><button class="pill" style="background:#1C5E57" data-go="dzikir">📿 Dzikir</button><button class="pill" style="background:#E6573F" id="again">🔁 Praktik lagi</button></div></div>`;
    $('#again').onclick = () => ROUTES.praktik();
  }
  $('#pnext').onclick = () => { A.stop(); i = Math.min(steps.length, i + 1); run(); };
  $('#pprev').onclick = () => { A.stop(); i = Math.max(0, i - 1); run(); };
  $('#pplay').onclick = () => { auto = !auto; paintPlay(); if (auto) run(); else { A.stop(); clearTimeout(timer); } };
  paintPlay(); run();
}

// =====================================================================
// JENIS SHALAT
// =====================================================================
const dotsRk = n => typeof n === 'number' ? `<span class="rkdots">${'●'.repeat(n)}</span>` : '';
function prayerItem(p, label) {
  const [num, unit] = String(p.rk).includes('takbir') ? [String(p.rk).split(' ')[0], 'takbir'] : [p.rk, 'rakaat'];
  return `<details class="pr"><summary><span class="pic">${p.ic}</span><span class="pt"><b>${esc(p.t)}</b><small>${label}</small></span>
      <span class="rk"><b>${num}</b><small>${unit}</small>${dotsRk(p.rk)}</span></summary>
    <div class="prb">
      <p><b>⏰ Waktu:</b> ${esc(p.waktu)}</p>
      ${p.baca ? `<p><b>🔈 Bacaan:</b> ${esc(p.baca)}</p>` : ''}
      ${p.hukum ? `<p><b>📌 Hukum:</b> ${esc(p.hukum)}</p>` : ''}
      ${p.note ? `<p class="note">💡 ${esc(p.note)}</p>` : ''}
      ${p.niat.map(id => readingCard(id)).join('')}
    </div></details>`;
}
ROUTES.jenis = () => {
  view.innerHTML = tabs('jtab', [['wajib', 'Shalat Wajib'], ['sunnah', 'Shalat Sunnah'], ['niat', 'Tentang Niat']], 'wajib') + '<div id="jbody"></div>';
  const body = $('#jbody');
  const paint = t => {
    if (t === 'wajib') {
      body.innerHTML = `<div class="sum17">${WAJIB.slice(0, 5).map(p => `<span><i>${p.ic}</i><b>${p.rk}</b><small>${p.t}</small></span>`).join('<em>+</em>')}<em>=</em><span class="tot"><b>17</b><small>rakaat</small></span></div>
        ${WAJIB.map(p => prayerItem(p, p.k === 'jumat' ? 'Wajib bagi laki-laki' : 'Shalat wajib')).join('')}`;
    } else if (t === 'sunnah') {
      body.innerHTML = `<p class="lead">Shalat sunnah tidak wajib, tapi pahalanya besar sekali. Yuk dibiasakan!</p>${SUNNAH.map(p => prayerItem(p, p.k === 'jenazah' ? 'Fardhu kifayah' : 'Shalat sunnah')).join('')}`;
    } else {
      body.innerHTML = `<div class="stage text">
        <h3>Niat itu di dalam hati 💭</h3>
        <p>Niat adalah keinginan di dalam hati untuk mengerjakan shalat tertentu karena Allah. Niat dilakukan bersamaan dengan takbiratul ihram.</p>
        <p>Dalam madzhab Syafi'i, membaca lafaz niat sebelum takbir hukumnya sunnah, untuk membantu hati. Sebagian ulama lain cukup berniat di hati saja.</p></div>
        <h3 class="sec">Kata-kata penting dalam lafaz niat</h3>
        ${items([['🕋', 'Mustaqbilal qiblati', 'Menghadap kiblat'], ['⏰', 'Adaa-an', 'Dikerjakan tepat pada waktunya'], ['🔁', 'Qadhaa-an', 'Mengganti shalat yang tertinggal'],
          ['🧍', "Ma'muuman", 'Sebagai makmum. Diletakkan sebelum "lillaahi ta\'aalaa"'], ['🧑‍🏫', 'Imaaman', 'Sebagai imam'],
          ['2️⃣', "Rak'ataini", 'Dua rakaat'], ['3️⃣', "Tsalaatsa raka'aatin", 'Tiga rakaat'], ['4️⃣', "Arba'a raka'aatin", 'Empat rakaat'],
          ['⬅️', 'Qabliyyatan', 'Sunnah sebelum shalat wajib'], ['➡️', "Ba'diyyatan", 'Sunnah sesudah shalat wajib']], false)}`;
    }
  };
  wireTabs('jtab', paint); paint('wajib');
};

// =====================================================================
// SYARAT & RUKUN
// =====================================================================
ROUTES.rukun = () => {
  view.innerHTML = tabs('rtab', [['wajib', 'Syarat Wajib'], ['sah', 'Syarat Sah'], ['rukun', 'Rukun'], ['sunnah', 'Sunnah'], ['batal', 'Pembatal']], 'rukun') + '<div id="rbody"></div>';
  const body = $('#rbody');
  const paint = t => {
    if (t === 'wajib') body.innerHTML = `<p class="lead">Syarat wajib: syarat yang membuat seseorang <b>wajib</b> shalat.</p>${items(SYARAT_WAJIB)}
      <p class="note">💡 Anak yang belum baligh belum wajib shalat. Tapi Rasulullah ﷺ menyuruh anak berlatih shalat sejak umur 7 tahun (HR. Abu Dawud). Yuk berlatih dari sekarang!</p>`;
    if (t === 'sah') body.innerHTML = `<p class="lead">Syarat sah: hal yang harus dipenuhi <b>sebelum</b> shalat supaya shalatnya sah.</p>${items(SYARAT_SAH)}`;
    if (t === 'rukun') body.innerHTML = `<p class="lead">Rukun: bagian <b>inti</b> shalat. Kalau ada yang tertinggal, shalatnya tidak sah. Ada ${RUKUN.length} rukun:</p>${items(RUKUN)}
      <p class="note">💡 ${esc(TUMAKNINAH)}</p>
      <h3 class="sec">Kalau lupa? Sujud sahwi</h3><div class="stage text"><p>${esc(SAHWI.apa)}</p><ul class="bullets">${SAHWI.sebab.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>${readingCard('sujud_sahwi')}`;
    if (t === 'sunnah') body.innerHTML = `<p class="lead">Sunnah shalat: kalau dikerjakan dapat pahala, kalau tertinggal shalat tetap sah.</p>
      <h3 class="sec">Sunnah ab'adh</h3><p class="hint">Kalau tertinggal, diganti dengan sujud sahwi.</p>${items(SUNNAH_ABAD.map(x => ['⭐', x]))}
      <h3 class="sec">Sunnah hai'at</h3><p class="hint">Kalau tertinggal, tidak perlu sujud sahwi.</p>${items(SUNNAH_HAIAT.map(x => ['✨', x]))}`;
    if (t === 'batal') body.innerHTML = `<p class="lead">Shalat menjadi batal kalau:</p>${items(PEMBATAL_SHALAT)}`;
    body.insertAdjacentHTML('beforeend', `<button class="bigbtn soft" data-go="kuis">🎯 Uji pemahamanmu di Kuis</button>`);
  };
  wireTabs('rtab', paint); paint('rukun');
};

// =====================================================================
// DOA HARIAN
// =====================================================================
ROUTES.doa = idx => {
  if (idx == null) {
    view.innerHTML = banner('🤲', 'Doa Harian', 'Doa untuk kegiatan sehari-hari', '#C4577E') +
      `<div class="dgrid">${DOA.map((d, i) => `<button class="dtile${S.seen['doa:' + d.id] ? ' seen' : ''}" data-go="doa/${i}"><span>${d.ic}</span><small>${esc(d.sit)}</small></button>`).join('')}</div>`;
    return;
  }
  const i = Math.max(0, Math.min(DOA.length - 1, +idx || 0)), d = DOA[i];
  if (once('doa:' + d.id)) {
    addStars(1);
    if (Object.keys(S.seen).filter(k => k.startsWith('doa:')).length >= 10) award('doa');
  }
  view.innerHTML = `<div class="doahead"><span>${d.ic}</span><div><small>Doa harian</small><h3>${esc(d.sit)}</h3></div></div>
    ${readingCard(d.id)}
    <div class="stepnav"><button class="round" data-go="doa/${(i + DOA.length - 1) % DOA.length}" aria-label="Doa sebelumnya">◀</button>
    <span class="hint">${i + 1} / ${DOA.length}</span><button class="round go" data-go="doa/${(i + 1) % DOA.length}" aria-label="Doa berikutnya">▶</button></div>`;
};

// =====================================================================
// DZIKIR & TASBIH
// =====================================================================
ROUTES.dzikir = () => {
  view.innerHTML = tabs('ztab', [['tasbih', 'Tasbih Digital'], ['urutan', 'Bacaan Dzikir']], 'tasbih') + '<div id="zbody"></div>';
  const body = $('#zbody');
  const PH = [['tasbih', 33], ['tahmid', 33], ['takbir33', 33], ['tahlil', 1]];
  let ph = 0, c = 0;
  const paintT = () => {
    const [id, n] = PH[ph] || [], r = R[id];
    if (!r) {
      body.innerHTML = `<div class="end"><div class="got">📿</div><h3>Masya Allah!</h3><p>Dzikir 33-33-33 selesai.</p><div class="row"><button class="pill" style="background:#1C5E57" id="tre">🔁 Ulangi</button></div></div>`;
      $('#tre').onclick = () => { ph = 0; c = 0; paintT(); };
      return;
    }
    const pct = c / n;
    body.innerHTML = `<div class="tphase">${PH.map(([k], j) => `<span class="${j < ph ? 'done' : j === ph ? 'now' : ''}">${esc(R[k].t)} ${PH[j][1] > 1 ? PH[j][1] + '×' : ''}</span>`).join('')}</div>
      <button class="tasbih" id="tap" aria-label="Ketuk untuk menghitung">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="none" stroke="#E3F4EF" stroke-width="10"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke="#2A8C80" stroke-width="10" stroke-linecap="round" stroke-dasharray="${339.3 * pct} 339.3" transform="rotate(-90 60 60)"/></svg>
        <span class="tin"><span class="ar" lang="ar">${r.ar}</span><b>${c}</b><small>dari ${n}</small></span>
      </button>
      <p class="tlat">${esc(r.lat)}</p><p class="hint center">${esc(r.arti)}</p>
      <div class="row center"><button class="pill" style="background:#6B6878" id="treset">↺ Ulang dari awal</button></div>`;
    $('#tap').onclick = () => {
      c++; A.sfx('bead'); navigator.vibrate?.(12);
      if (c >= n) {
        ph++; c = 0;
        if (ph >= PH.length) { award('tasbih'); if (once('tasbih:' + dayKey())) gain(3, 'Dzikir selesai!'); }
        else A.sfx('ok');
      }
      paintT();
    };
    $('#treset').onclick = () => { ph = 0; c = 0; paintT(); };
  };
  const paint = t => {
    if (t === 'tasbih') return paintT();
    body.innerHTML = `<p class="lead">Urutan dzikir setelah shalat fardhu:</p>${DZIKIR.map(z => readingCard(z.id, {count: z.n})).join('')}`;
  };
  wireTabs('ztab', paint); paint('tasbih');
};

// =====================================================================
// KUIS
// =====================================================================
const LV = {1: ['Mudah', '🟢', '4–6 tahun', '#3BA55C'], 2: ['Sedang', '🟡', '7–9 tahun', '#F4B63C'], 3: ['Sulit', '🔴', '10–12 tahun', '#E6573F']};
const PRAISE = ['Masya Allah, benar!', 'Hebat!', 'Pintar!', 'Betul sekali!', 'Keren!'];
ROUTES.kuis = mode => {
  if (mode === '1' || mode === '2' || mode === '3') return quiz(+mode);
  if (mode === 'kilat') return kilat();
  view.innerHTML = banner('🎯', 'Kuis Shalat', 'Jawab soalnya, kumpulkan bintang!', '#F4B63C', '#2A2833') +
    `<div class="modes">${[1, 2, 3].map(l => { const [t, ic, age, col] = LV[l], best = S.quiz[l] || 0; return `<button class="modebtn" data-go="kuis/${l}">
      <span class="ic" style="background:${col}22">${ic}</span><span><b>${t}</b><small>Cocok usia ${age} · 10 soal</small></span>
      <span class="best">${[1, 2, 3].map(k => `<i class="${k <= best ? 'on' : ''}">★</i>`).join('')}</span></button>`; }).join('')}
      <button class="modebtn" data-go="kuis/kilat"><span class="ic" style="background:#E5E0F6">⚡</span><span><b>Tantangan Kilat</b><small>60 detik, jawab sebanyak-banyaknya</small></span><span class="best num">${S.kilat || 0}</span></button>
    </div><p class="hint">Soal diacak setiap kali main. Kalau jawabannya salah, baca penjelasannya ya!</p>`;
};
function questionHTML(q) {
  let top = `<button class="sayq" data-sayq aria-label="Dengarkan soal">🔊</button><p class="qtext">${esc(q.q)}</p>`;
  if (q.pose) top = `<div class="qfig">${poseSVG(q.pose, S.gender)}</div>` + top;
  if (q.ar) top += `<p class="ar qar" lang="ar" dir="rtl">${q.ar}</p>`;
  if (q.order) {
    return `<div class="ask">${top}<p class="hint">Ketuk sesuai urutan yang benar.</p></div>
      <ol class="slots">${q.order.map((_, k) => `<li data-slot="${k}"><i>${k + 1}</i><span></span></li>`).join('')}</ol>
      <div class="chips">${shuffle(q.order.map((t, k) => [t, k])).map(([t, k]) => `<button class="chip" data-k="${k}">${esc(t)}</button>`).join('')}</div>`;
  }
  const opts = q.poses ? shuffle(q.poses.map((p, k) => [k, `<span class="ofig">${poseSVG(p, S.gender, {mat: false})}</span>`]))
    : shuffle(q.o.map((t, k) => [k, esc(t)]));
  const cls = q.poses ? 'opts figs' : q.num ? 'opts nums' : q.big ? 'opts bigs' : 'opts list';
  return `<div class="ask">${top}</div><div class="${cls}">${opts.map(([k, h]) => `<button class="opt" data-k="${k}">${h}</button>`).join('')}</div>`;
}
// pasang interaksi satu soal; cb(benar:boolean)
function wireQuestion(root, q, cb, {fast = false} = {}) {
  let done = false;
  const sq = $('[data-sayq]', root);
  if (sq) sq.onclick = () => {
    const opts = $$('.opt, .chip', root).map(b => b.textContent.replace(/[^\p{L}\p{N}\s'-]/gu, '').trim()).filter(Boolean);
    A.play(quizKey(q), {tag: 'soal', fallback: q.q.replace(/\.\.\.$/, '') + (opts.length ? '. ' + opts.join(', ') : '')});
  };
  const correctText = q.order ? q.order.join(' → ') : q.poses ? '' : q.o[0];
  const fb = ok => {
    done = true;
    A.sfx(ok ? 'ok' : 'no');
    if (fast) return cb(ok);
    const box = document.createElement('div');
    box.className = 'fb ' + (ok ? 'ok' : 'no');
    box.innerHTML = ok ? `<b>${PRAISE[Math.floor(Math.random() * PRAISE.length)]}</b>${q.ex ? `<p>${esc(q.ex)}</p>` : ''}`
      : `<b>Belum tepat 🙂</b>${correctText ? `<p>Jawaban benar: <b>${esc(correctText)}</b></p>` : ''}${q.ex ? `<p>${esc(q.ex)}</p>` : ''}`;
    box.insertAdjacentHTML('beforeend', `<button class="bigbtn" id="qnext">Lanjut ▶</button>`);
    root.append(box);
    box.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    $('#qnext', box).onclick = () => cb(ok);
  };
  if (q.order) {
    let pos = 0; const picked = [];
    $$('.chip', root).forEach(ch => ch.onclick = () => {
      if (done || ch.disabled) return;
      A.sfx('tick');
      const slot = $(`[data-slot="${pos}"]`, root);
      $('span', slot).textContent = ch.textContent; slot.classList.add('full');
      ch.disabled = true; picked.push(+ch.dataset.k); pos++;
      if (pos === q.order.length) {
        const ok = picked.every((k, j) => k === j);
        $$('[data-slot]', root).forEach((s, j) => s.classList.add(picked[j] === j ? 'right' : 'wrong'));
        fb(ok);
      }
    });
    return;
  }
  $$('.opt', root).forEach(b => b.onclick = () => {
    if (done) return;
    const ok = +b.dataset.k === 0;
    b.classList.add(ok ? 'right' : 'wrong');
    if (!ok) $(`.opt[data-k="0"]`, root).classList.add('right', 'reveal');
    fb(ok);
  });
}
function quiz(lv) {
  const pool = shuffle(QUIZ.filter(q => q.lv === lv));
  const qs = pool.slice(0, 10);
  let i = 0, score = 0;
  const paint = () => {
    if (i >= qs.length) return end();
    view.innerHTML = `<div class="qtop"><span class="badge" style="background:${LV[lv][3]};color:${lv === 2 ? '#2A2833' : '#fff'}">${LV[lv][1]} ${LV[lv][0]}</span>
      <div class="prog">${qs.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join('')}</div><span class="sc">✔ ${score}</span></div>
      <div id="qbox">${questionHTML(qs[i])}</div>`;
    wireQuestion($('#qbox'), qs[i], ok => { if (ok) score++; i++; paint(); });
    if (lv === 1 && !S.muted) A.play(quizKey(qs[i]), {tag: 'soal', fallback: qs[i].q.replace(/\.\.\.$/, '')});
  };
  const end = () => {
    const st = score >= 9 ? 3 : score >= 7 ? 2 : score >= 5 ? 1 : 0;
    const best = S.quiz[lv] || 0;
    if (st > best) { S.quiz[lv] = st; save(); }
    if (st === 3) award('kuis' + lv);
    addStars(score);
    if (st) confetti();
    A.sfx(st ? 'star' : 'no');
    view.innerHTML = `<div class="end"><div class="got">${[1, 2, 3].map(k => `<span class="${k <= st ? '' : 'off'}">⭐</span>`).join('')}</div>
      <h3>${st === 3 ? 'Masya Allah, sempurna!' : st ? 'Bagus sekali!' : 'Ayo coba lagi!'}</h3>
      <p>Benar ${score} dari ${qs.length} soal · +${score} ⭐</p>
      <div class="row"><button class="pill" style="background:#E6573F" data-go="kuis">🎯 Pilih level</button><button class="pill" style="background:#2A8C80" id="again">🔁 Main lagi</button></div></div>`;
    $('#again').onclick = () => quiz(lv);
  };
  paint();
}
function kilat() {
  const pool = shuffle(QUIZ.filter(q => q.lv >= 2 && !q.order));
  let i = 0, score = 0, left = 60, alive = true;
  view.innerHTML = `<div class="qtop"><span class="badge" style="background:#7C6BC4;color:#fff">⚡ Kilat</span><div class="timer"><i id="tbar"></i></div><span class="sc" id="tsc">✔ 0</span></div><div id="qbox"></div>`;
  const tick = setInterval(() => {
    left -= 1; $('#tbar') && ($('#tbar').style.width = `${left / 60 * 100}%`);
    if (left <= 10 && left > 0) A.sfx('tick');
    if (left <= 0) end();
  }, 1000);
  onLeave(() => { alive = false; clearInterval(tick); });
  const next = () => {
    if (!alive) return;
    const q = pool[i++ % pool.length];
    $('#qbox').innerHTML = questionHTML(q);
    wireQuestion($('#qbox'), q, ok => { if (ok) { score++; $('#tsc').textContent = '✔ ' + score; } setTimeout(next, ok ? 350 : 900); }, {fast: true});
  };
  const end = () => {
    if (!alive) return; alive = false; clearInterval(tick);
    const best = S.kilat || 0;
    if (score > best) { S.kilat = score; save(); }
    if (score >= 15) award('kilat');
    const st = Math.floor(score / 2); addStars(st);
    A.sfx('star'); confetti();
    view.innerHTML = `<div class="end"><div class="got">⚡</div><h3>${score} jawaban benar!</h3><p>${score > best ? 'Rekor baru! 🎉' : `Rekormu: ${best}`} · +${st} ⭐</p>
      <div class="row"><button class="pill" style="background:#E6573F" data-go="kuis">🎯 Pilih level</button><button class="pill" style="background:#7C6BC4" id="again">🔁 Main lagi</button></div></div>`;
    $('#again').onclick = () => kilat();
  };
  next();
}

// =====================================================================
// JADWAL & CHECKLIST
// =====================================================================
const PIC = {imsak: '🌌', subuh: '🌅', terbit: '🌄', dhuha: '🌞', dzuhur: '☀️', ashar: '🌤️', maghrib: '🌇', isya: '🌙'};
ROUTES.jadwal = () => {
  const pl = place();
  const cityOpts = CITIES.map(c => `<option${!S.geo && c[0] === S.city ? ' selected' : ''}>${esc(c[0])}</option>`).join('');
  view.innerHTML = `<div class="loc"><label class="pick">📍 <select id="city">${S.geo ? '<option selected>Lokasi saya</option>' : ''}${cityOpts}</select></label><button class="pill" style="background:#3F93BA" id="gps">Pakai lokasiku</button></div>
    <p class="hint center" id="dates"></p>
    <div class="nextbig" id="nextbig"></div>
    <div class="times" id="times"></div>
    <h3 class="sec">✅ Checklist shalat hari ini</h3><div class="check" id="check"></div>
    <h3 class="sec">📅 7 hari terakhir</h3><div class="week" id="week"></div>
    <h3 class="sec">🕋 Arah kiblat</h3><div class="qibla" id="qibla"></div>
    <label class="switch"><input type="checkbox" id="notif" ${S.notif ? 'checked' : ''}> <span>Bunyikan pengingat saat masuk waktu shalat (selama aplikasi terbuka)</span></label>
    <p class="hint">Jadwal dihitung dengan kriteria Kemenag RI (Subuh −20°, Isya −18°) dan bisa berbeda 1–2 menit dengan jadwal masjid setempat.</p>`;
  const d = new Date();
  let hij = '';
  try { hij = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {day: 'numeric', month: 'long', year: 'numeric'}).format(d); } catch {}
  $('#dates').textContent = d.toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}) + (hij ? ' · ' + hij.replace(/\s?(H|AH)$/, '') + ' H' : '');
  const paintTimes = () => {
    const {now, t} = todayTimes(pl), np = nextPrayer();
    $('#nextbig').innerHTML = `<span class="nb-ic">${PIC[np.k]}</span><div><small>${np.besok ? 'Besok' : 'Menuju'} ${LABEL[np.k]}</small><b>${np.at}</b><small>${fmtLeft(np.left)} lagi · ${esc(pl.name)}</small></div>`;
    $('#times').innerHTML = ORDER.map(k => `<div class="tm${k === np.k && !np.besok ? ' next' : ''}${now.mins >= t[k].mins ? ' past' : ''}${WAJIB_KEYS.includes(k) ? '' : ' minor'}"><span>${PIC[k]}</span><small>${LABEL[k]}</small><b>${t[k].text}</b></div>`).join('');
  };
  const paintCheck = () => {
    const k = dayKey(), c = S.check[k] || {};
    $('#check').innerHTML = WAJIB_KEYS.map(p => `<button class="ck${c[p] ? ' on' : ''}" data-p="${p}" aria-pressed="${!!c[p]}"><span>${c[p] ? '✅' : PIC[p]}</span><b>${LABEL[p]}</b><small>${c[p] ? 'Sudah' : 'Belum'}</small></button>`).join('');
    const days = Array.from({length: 7}, (_, j) => { const x = new Date(); x.setDate(x.getDate() - 6 + j); return x; });
    $('#week').innerHTML = `<div class="wk head"><span></span>${WAJIB_KEYS.map(p => `<small>${PIC[p]}</small>`).join('')}</div>` + days.map(x => {
      const dk = dayKey(x), cc = S.check[dk] || {};
      return `<div class="wk${dk === k ? ' today' : ''}"><span>${x.toLocaleDateString('id-ID', {weekday: 'short'})}</span>${WAJIB_KEYS.map(p => `<i class="${cc[p] ? 'on' : ''}"></i>`).join('')}</div>`;
    }).join('') + `<p class="streak">🔥 <b>${streak()}</b> hari lengkap berturut-turut</p>`;
  };
  $('#check').onclick = e => {
    const b = e.target.closest('[data-p]'); if (!b) return;
    const k = dayKey(), p = b.dataset.p;
    S.check[k] ||= {};
    if (S.check[k][p]) { delete S.check[k][p]; save(); addStars(-2); A.sfx('tick'); }
    else {
      const {now, t} = todayTimes(pl);
      if (now.mins < t[p].mins) { A.sfx('no'); return toast(`<span class="tbig">⏳</span><span>Belum masuk waktu ${LABEL[p]}, ya.<br>Waktunya pukul ${t[p].text}.</span>`); }
      S.check[k][p] = Date.now(); save(); gain(2, `Alhamdulillah, sudah shalat ${LABEL[p]}!`);
      if (isFull(k)) { award('lengkap'); confetti(); }
      const s = streak(); if (s >= 3) award('streak3'); if (s >= 7) award('streak7');
    }
    paintCheck();
  };
  // kiblat
  const qb = qibla(pl.lat, pl.lng);
  const dir = ['utara', 'timur laut', 'timur', 'tenggara', 'selatan', 'barat daya', 'barat', 'barat laut'][Math.round(qb / 45) % 8];
  $('#qibla').innerHTML = `<div class="compass" id="compass"><span class="n">U</span><div class="needle" id="needle" style="transform:rotate(${qb}deg)"><i>🕋</i></div></div>
    <div><b>${qb.toFixed(0)}°</b> dari arah utara (ke ${dir}).<p class="hint">Tanpa kompas: hadapkan HP ke utara, lalu putar sesuai panah. Di HP yang punya sensor, tekan tombol di bawah.</p>
    <button class="pill" style="background:#2A8C80" id="live">🧭 Kompas langsung</button></div>`;
  $('#live').onclick = async () => {
    const DOE = window.DeviceOrientationEvent;
    try { if (typeof DOE?.requestPermission === 'function' && await DOE.requestPermission() !== 'granted') throw 0; } catch { return toast('Sensor kompas tidak diizinkan.'); }
    let got = false;
    const h = e => {
      const head = e.webkitCompassHeading ?? (e.absolute || e.type === 'deviceorientationabsolute' ? 360 - e.alpha : null);
      if (head == null) return;
      got = true;
      $('#compass') && ($('#compass').style.transform = `rotate(${-head}deg)`);
    };
    addEventListener('deviceorientationabsolute', h); addEventListener('deviceorientation', h);
    onLeave(() => { removeEventListener('deviceorientationabsolute', h); removeEventListener('deviceorientation', h); });
    setTimeout(() => { if (!got) toast('HP ini belum punya sensor kompas 🙏'); }, 2500);
  };
  $('#city').onchange = e => { if (e.target.value === 'Lokasi saya') return; S.city = e.target.value; S.geo = null; save(); ROUTES.jadwal(); };
  $('#gps').onclick = () => {
    if (!navigator.geolocation) return toast('Lokasi tidak tersedia di perangkat ini.');
    navigator.geolocation.getCurrentPosition(p => {
      S.geo = {lat: p.coords.latitude, lng: p.coords.longitude, tz: -new Date().getTimezoneOffset() / 60}; save(); ROUTES.jadwal();
    }, () => toast('Izin lokasi ditolak. Pilih kota dari daftar, ya.'), {timeout: 10000});
  };
  $('#notif').onchange = async e => {
    S.notif = e.target.checked; save();
    if (S.notif && 'Notification' in window && Notification.permission === 'default') try { await Notification.requestPermission(); } catch {}
  };
  paintTimes(); paintCheck();
  const iv = setInterval(paintTimes, 30000); onLeave(() => clearInterval(iv));
};

// =====================================================================
// BINTANGKU
// =====================================================================
ROUTES.bintang = () => {
  const got = Object.keys(S.badges).length;
  view.innerHTML = `<div class="starhero"><span>⭐</span><b>${S.stars}</b><small>bintang terkumpul</small></div>
    <div class="stats"><span>🧎 Praktik: <b>${Object.keys(S.practiced).length}</b></span><span>🔥 Rangkaian: <b>${streak()}</b> hari</span><span>⚡ Kilat: <b>${S.kilat || 0}</b></span></div>
    <h3 class="sec">Lencana (${got}/${BADGES.length})</h3>
    <div class="badges">${BADGES.map(b => `<div class="bd${S.badges[b.k] ? ' on' : ''}"><span>${b.ic}</span><b>${esc(b.t)}</b><small>${esc(b.d)}</small></div>`).join('')}</div>
    <p class="hint center">Cara dapat bintang: selesaikan kuis, praktik shalat, buka doa baru, berdzikir, dan centang shalatmu setiap hari.</p>`;
};

// =====================================================================
// ORANG TUA
// =====================================================================
// naskah rekaman (bacaan yang lafaznya sama cukup direkam sekali, lihat A.ALIAS)
const REC_GROUPS = [
  ['Bacaan shalat', ['takbir', 'iftitah', 'taawudz', 'aamiin', 'ruku', 'itidal1', 'itidal2', 'qunut', 'sujud', 'duduk', 'tasyahud', 'shalawat_awal', 'shalawat_ibrahim', 'doa_akhir', 'salam', 'sujud_sahwi', 'takbir_id']],
  ['Niat shalat', Object.keys(R).filter(k => k.startsWith('niat_') && !['niat_wudhu', 'niat_tayamum'].includes(k))],
  ['Wudhu & tayamum', ['basmalah', 'niat_wudhu', 'doa_wudhu', 'niat_tayamum']],
  ['Dzikir', ['istighfar', 'antassalam', 'tasbih', 'tahmid', 'tahlil']],
  ['Doa harian', DOA.map(d => d.id).filter(id => !(id in A.ALIAS))],
];
function studioItems(set) {
  if (set === 'bacaan') return REC_GROUPS.flatMap(([g, ids]) => ids.map(key => ({key, group: g, t: R[key].t, r: R[key]})));
  const seen = new Set(), out = [];
  for (const q of QUIZ) {
    const key = quizKey(q);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({key, group: 'Kuis ' + LV[q.lv][0], t: q.q, q});
  }
  return out;
}
let gateOk = false;

ROUTES.ortu = unlocked => {
  if (unlocked !== 'ok') {
    const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 5);
    view.innerHTML = `<div class="stage text center"><h3>👨‍👩‍👧 Khusus Orang Tua</h3><p>Jawab dulu ya: berapa <b>${a} + ${b}</b>?</p>
      <input class="gate" id="gate" inputmode="numeric" autocomplete="off" aria-label="Jawaban"><button class="bigbtn" id="gok">Masuk</button></div>`;
    const ok = () => { if (+$('#gate').value === a + b) go('ortu/ok'); else { A.sfx('no'); $('#gate').value = ''; toast('Jawaban belum tepat 🙂'); } };
    $('#gok').onclick = ok; $('#gate').onkeydown = e => e.key === 'Enter' && ok(); $('#gate').focus();
    return;
  }
  gateOk = true;
  view.innerHTML = `
    <h3 class="sec">Profil anak</h3>
    <div class="stage text form">
      <label>Nama panggilan <input id="nm" maxlength="20" value="${esc(S.name)}" placeholder="mis. Aisyah"></label>
      <div><span class="lbl">Karakter</span>${genderToggle()}</div>
    </div>
    <h3 class="sec">🎙️ Suara Ayah/Bunda</h3>
    <button class="modebtn" data-go="studio"><span class="ic" style="background:#E5E0F6">🎙️</span>
      <span><b>Studio Rekam</b><small id="recsum">Rekam bacaan Arab & soal kuis dengan suaramu</small></span></button>
    <h3 class="sec">Suara lainnya</h3>
    <div class="stage text form">
      <label>Qari murattal Al-Qur'an <select id="qari">${Object.entries(A.RECITERS).map(([k, v]) => `<option value="${k}"${k === S.reciter ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
      <label>Kecepatan suara bawaan HP <input type="range" id="rate" min="0.5" max="1.1" step="0.05" value="${S.rate}"></label>
      <p class="hint">Suara bawaan HP dipakai untuk bacaan yang belum direkam dan untuk arti bahasa Indonesia.
      ${A.hasArabicVoice() ? '✅ HP ini punya suara bahasa Arab bawaan.' : '⚠️ HP ini tidak punya suara bahasa Arab bawaan, jadi yang dibacakan tulisan latinnya.'}
      Murattal Al-Qur'an diputar dari EveryAyah dan butuh internet.</p>
    </div>
    <h3 class="sec">Tentang materi</h3>
    <div class="stage text">
      <p>Materi RuMa Shalat disusun mengikuti tuntunan <b>madzhab Syafi'i</b> yang umum diajarkan di TPA dan sekolah di Indonesia (misalnya doa qunut Subuh dan 13 rukun shalat).</p>
      <p>📖 Teks Al-Qur'an: Tanzil (quran-simple). Terjemahan: Kementerian Agama RI. Murattal: EveryAyah.com.</p>
      <p>⏰ Jadwal shalat dihitung di perangkat dengan kriteria Kemenag RI.</p>
      <p class="note">🙏 Mohon dampingi anak saat belajar dan tanyakan kepada guru ngaji atau ustadz jika ada perbedaan dengan yang diajarkan di lingkungan Ayah/Bunda.</p>
    </div>
    <button class="bigbtn danger" id="reset">Hapus semua progres (bintang, lencana, checklist)</button>
    <p class="hint center">RuMa Shalat · RuMa Digital</p>`;
  $('#nm').oninput = e => { S.name = e.target.value.trim(); save(); };
  wireGender(() => {});
  $('#qari').onchange = e => { S.reciter = e.target.value; save(); };
  $('#rate').onchange = e => { S.rate = +e.target.value; save(); A.play('takbir2'); };
  $('#reset').onclick = () => { if (confirm('Yakin hapus semua bintang, lencana, kuis, dan checklist? Rekaman suara tidak ikut terhapus.')) { resetAll(); toast('Progres sudah dihapus.'); go(''); } };
  A.recKeys().then(keys => {
    const has = new Set(keys), n = set => studioItems(set).filter(it => has.has(it.key)).length;
    const el = $('#recsum');
    if (el && keys.length) el.textContent = `Bacaan Arab ${n('bacaan')}/${studioItems('bacaan').length} · Soal kuis ${n('kuis')}/${studioItems('kuis').length} sudah direkam`;
  });
};

// =====================================================================
// STUDIO REKAM
// =====================================================================
ROUTES.studio = async (set = 'bacaan') => {
  if (!gateOk) return go('ortu');
  if (set !== 'kuis') set = 'bacaan';
  const items = studioItems(set);
  const keys = new Set(await A.recKeys());
  let i = Math.max(0, items.findIndex(it => !keys.has(it.key)));
  let mic = null, rec = null, t0 = 0, raf = 0, alive = true, busy = false;
  view.innerHTML = banner('🎙️', 'Studio Rekam', 'Rekam suaramu, nanti semua anak mendengar suaramu', '#7C6BC4') +
    tabs('stab', [['bacaan', 'Bacaan Arab'], ['kuis', 'Soal Kuis']], set) + `
    <div class="sprog"><div class="pbar"><i id="sbar"></i></div><span id="scount"></span></div>
    <div class="stage studio" id="scard"></div>
    <div class="sctl">
      <button class="round" id="sprev" aria-label="Naskah sebelumnya">◀</button>
      <button class="recbig" id="srec" aria-label="Mulai merekam">●</button>
      <button class="round go" id="snext" aria-label="Naskah berikutnya">▶</button>
    </div>
    <div class="meter" aria-hidden="true"><i id="slevel"></i></div>
    <p class="hint center" id="shint"></p>
    <div class="row center">
      <button class="pill" style="background:#2A8C80" id="splay">▶ Dengar</button>
      <button class="pill" style="background:#6B6878" id="sdel">🗑 Hapus</button>
    </div>
    <label class="switch"><input type="checkbox" id="stodo" checked> <span>Setelah merekam, langsung lompat ke naskah yang belum direkam</span></label>
    <details class="more"><summary>Daftar semua naskah</summary><div class="slist" id="slist"></div></details>
    <h3 class="sec">📦 Kirim rekaman</h3>
    <div class="stage text">
      <p id="sstat"></p>
      <p class="hint">Rekaman tersimpan di perangkat ini dan langsung dipakai di sini. Supaya semua pengguna mendengar suaramu, ekspor jadi satu file .zip lalu kirimkan untuk dipasang ke aplikasi.</p>
      <div class="row"><button class="pill" style="background:#E6573F" id="sexp">⬇️ Ekspor .zip</button><button class="pill" style="background:#3F93BA" id="sshare" hidden>📤 Bagikan</button></div>
      <button class="bigbtn danger" id="sclear">Hapus semua rekaman di perangkat ini</button>
    </div>
    <p class="hint">Tips: rekam di ruangan yang tenang, jarak HP sekitar 20 cm dari mulut, baca pelan dan jelas.
      Di laptop: <b>Spasi</b> = rekam/berhenti, <b>← →</b> = pindah naskah, <b>Enter</b> = dengar.</p>`;
  wireTabs('stab', t => go('studio/' + t));

  const IDLE_HINT = 'Tekan tombol merah, tunggu sebentar, lalu mulai membaca. Tekan lagi untuk berhenti.';
  const paint = () => {
    const it = items[i], has = keys.has(it.key), done = items.filter(x => keys.has(x.key)).length;
    let body;
    if (it.q) {
      body = `<h3>Bacakan soal ini:</h3><p class="sq">${esc(it.q.q)}</p>` +
        (it.q.ar ? `<p class="hint">lalu baca tulisan Arab ini:</p><p class="ar sar" lang="ar" dir="rtl">${it.q.ar}</p>` : '') +
        `<p class="hint">Pilihan jawabannya tidak perlu dibaca.</p>`;
    } else {
      body = `<h3>${esc(it.t)}</h3><p class="ar sar" lang="ar" dir="rtl">${it.r.ar}</p><p class="lat">${esc(it.r.lat)}</p>` +
        (it.r.n > 1 ? `<p class="note">💡 Cukup baca 1 kali. Aplikasi akan mengulang sendiri saat dibutuhkan.</p>` : '');
    }
    $('#scard').innerHTML = `<div class="shead"><small>${esc(it.group)} · ${i + 1} / ${items.length}</small>
      <span class="badge ${has ? 'soft' : ''}">${has ? '✅ Sudah direkam' : '⚪ Belum'}</span></div>${body}`;
    $('#sbar').style.width = `${done / items.length * 100}%`;
    $('#scount').textContent = `${done}/${items.length}`;
    $('#splay').disabled = $('#sdel').disabled = !has;
    $('#sprev').disabled = i === 0; $('#snext').disabled = i === items.length - 1;
    $('#slist').innerHTML = items.map((x, k) => `<button class="sli${k === i ? ' now' : ''}" data-si="${k}">${keys.has(x.key) ? '✅' : '⚪'} ${esc(x.t)}</button>`).join('');
    paintStat();
  };
  const paintRec = () => {
    const b = $('#srec');
    b.classList.toggle('live', !!rec);
    b.textContent = rec ? '■' : '●';
    b.setAttribute('aria-label', rec ? 'Berhenti merekam' : 'Mulai merekam');
    if (!rec) { $('#slevel').style.width = '0'; $('#shint').textContent = IDLE_HINT; }
  };
  const paintStat = async () => {
    const all = await A.recKeys();
    const has = new Set(all), cnt = s => studioItems(s).filter(it => has.has(it.key)).length;
    $('#sstat').innerHTML = `<b>${all.length}</b> rekaman di perangkat ini · Bacaan Arab ${cnt('bacaan')}/${studioItems('bacaan').length} · Soal kuis ${cnt('kuis')}/${studioItems('kuis').length}`;
  };
  const move = k => {
    if (rec || busy) return;
    A.stop(); i = Math.max(0, Math.min(items.length - 1, k)); paint();
  };
  const nextTodo = () => {
    for (let k = 1; k <= items.length; k++) { const j = (i + k) % items.length; if (!keys.has(items[j].key)) return j; }
    return -1;
  };
  const toggle = async () => {
    if (busy) return;
    if (rec) {
      busy = true;
      const r = rec, secs = (performance.now() - t0) / 1000; rec = null; cancelAnimationFrame(raf);
      const blob = await r.stop();
      paintRec();
      if (secs < 0.6 || blob.size < 1500) { busy = false; return toast('Rekamannya terlalu pendek, coba lagi ya.'); }
      const key = items[i].key;
      await A.saveRec(key, blob); keys.add(key);
      paint();
      await A.play(key);
      busy = false;
      if (!alive) return;
      const j = $('#stodo').checked ? nextTodo() : -1;
      if (j >= 0) { i = j; paint(); }
      else if (keys.size && items.every(x => keys.has(x.key))) { confetti(); toast(`<span class="tbig">🎉</span><span><b>Semua naskah sudah direkam!</b><br>Sekarang ekspor .zip-nya.</span>`, 4000); }
      return;
    }
    try { A.stop(); mic ||= await A.openMic(); }
    catch { return toast('Mikrofon tidak bisa dipakai. Izinkan akses mikrofon di browser, ya.'); }
    rec = mic.record(); t0 = performance.now(); paintRec();
    const loop = () => {
      if (!rec) return;
      $('#slevel').style.width = Math.min(100, mic.level() * 180) + '%';
      $('#shint').textContent = `🔴 Merekam… ${((performance.now() - t0) / 1000).toFixed(1)} detik. Tekan ■ untuk berhenti.`;
      raf = requestAnimationFrame(loop);
    };
    loop();
  };
  $('#srec').onclick = toggle;
  $('#sprev').onclick = () => move(i - 1);
  $('#snext').onclick = () => move(i + 1);
  $('#splay').onclick = () => { if (!rec) A.play(items[i].key); };
  $('#sdel').onclick = async () => {
    if (rec || !confirm('Hapus rekaman naskah ini?')) return;
    await A.delRec(items[i].key); keys.delete(items[i].key); paint();
  };
  $('#slist').onclick = e => { const b = e.target.closest('[data-si]'); if (b) move(+b.dataset.si); };
  $('#sclear').onclick = async () => {
    if (rec || !confirm('Hapus SEMUA rekaman di perangkat ini? Ekspor dulu kalau belum.')) return;
    await A.clearRecs(); keys.clear(); paint(); toast('Semua rekaman dihapus.');
  };
  // ekspor
  const buildZip = async () => {
    const recs = await A.allRecs();
    if (!recs.length) { toast('Belum ada rekaman untuk diekspor.'); return null; }
    const map = {}, files = [];
    for (const {key, blob} of recs) {
      const name = `${key}.${A.extOf(blob.type)}`;
      map[key] = name;
      files.push({name, data: new Uint8Array(await blob.arrayBuffer())});
    }
    files.push({name: 'daftar.json', data: new TextEncoder().encode(JSON.stringify(map, null, 1))});
    return new File([makeZip(files)], `rekaman-ruma-shalat-${dayKey()}.zip`, {type: 'application/zip'});
  };
  $('#sexp').onclick = async () => {
    const f = await buildZip(); if (!f) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(f); a.download = f.name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(`<span class="tbig">📦</span><span><b>${f.name}</b><br>sudah diunduh.</span>`, 4000);
  };
  if (navigator.canShare?.({files: [new File([''], 'x.zip', {type: 'application/zip'})]})) {
    $('#sshare').hidden = false;
    $('#sshare').onclick = async () => {
      const f = await buildZip(); if (!f) return;
      try { await navigator.share({files: [f], title: 'Rekaman RuMa Shalat'}); } catch {}
    };
  }
  // pintasan keyboard (laptop)
  const onKey = e => {
    if (e.target.closest('input,select,textarea')) return;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowRight') move(i + 1);
    else if (e.key === 'ArrowLeft') move(i - 1);
    else if (e.key === 'Enter' && keys.has(items[i].key)) { e.preventDefault(); A.play(items[i].key); }
  };
  addEventListener('keydown', onKey);
  onLeave(() => {
    alive = false; removeEventListener('keydown', onKey); cancelAnimationFrame(raf);
    rec?.stop(); rec = null; mic?.close();
  });
  paint(); paintRec();
};

// ---------- mulai ----------
render();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
