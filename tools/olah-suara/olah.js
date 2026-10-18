// Pengolah rekaman suara: buang dengung & desis, potong jeda awal/akhir, pertegas suara,
// samakan kekerasan suara (loudness), cegah suara pecah, lalu simpan sebagai MP3.
export const SR = 48000;
export const SETELAN = {
  hp: 80,                                  // buang dengung di bawah 80 Hz
  nr: {over: 2.5, floorDb: -24, rel: 0.06}, // pengurang noise (spectral gating)
  gate: {below: 30, range: 18, ratio: 3, hold: 0.12, rel: 0.15}, // redam napas & noise di sela kata
  trim: {pre: 0.12, post: 0.3, fadeIn: 0.015, fadeOut: 0.08},
  eq: [['peak', 250, 1.0, -2], ['peak', 3500, 0.9, 2.5], ['hshelf', 10000, 0.7071, 1.5]],
  comp: {thr: -24, ratio: 2.5, knee: 6, att: 0.006, rel: 0.12},
  target: -16,                             // LUFS, standar suara di HP
  ceiling: -1.0,                           // dBFS
  kbps: 96,
};

const db = v => 20 * Math.log10(Math.max(v, 1e-9));

// ---------- baca file ----------
export async function decode(buf) {
  const ctx = new OfflineAudioContext(1, 1, SR);
  const ab = await ctx.decodeAudioData(buf);
  const n = ab.length, out = new Float32Array(n);
  for (let c = 0; c < ab.numberOfChannels; c++) {
    const d = ab.getChannelData(c);
    for (let i = 0; i < n; i++) out[i] += d[i] / ab.numberOfChannels;
  }
  let mean = 0; for (const v of out) mean += v; mean /= n || 1;
  for (let i = 0; i < n; i++) out[i] -= mean;          // buang DC offset
  return out;
}

// ---------- filter ----------
function filt(x, b, a) {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i], o = b[0] * v + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
    x2 = x1; x1 = v; y2 = y1; y1 = o; y[i] = o;
  }
  return y;
}
export function biquad(x, type, f0, q, gainDb = 0) {
  const w = 2 * Math.PI * f0 / SR, cos = Math.cos(w), sin = Math.sin(w), alpha = sin / (2 * q), A = Math.pow(10, gainDb / 40);
  let b0, b1, b2, a0, a1, a2;
  if (type === 'hp') { b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = (1 + cos) / 2; a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha; }
  else if (type === 'peak') { b0 = 1 + alpha * A; b1 = -2 * cos; b2 = 1 - alpha * A; a0 = 1 + alpha / A; a1 = -2 * cos; a2 = 1 - alpha / A; }
  else { // hshelf
    const s = 2 * Math.sqrt(A) * alpha;
    b0 = A * ((A + 1) + (A - 1) * cos + s); b1 = -2 * A * ((A - 1) + (A + 1) * cos); b2 = A * ((A + 1) + (A - 1) * cos - s);
    a0 = (A + 1) - (A - 1) * cos + s; a1 = 2 * ((A - 1) - (A + 1) * cos); a2 = (A + 1) - (A - 1) * cos - s;
  }
  return filt(x, [b0 / a0, b1 / a0, b2 / a0], [1, a1 / a0, a2 / a0]);
}

// ---------- loudness (ITU-R BS.1770, 48 kHz) ----------
export function lufs(x) {
  const k = filt(filt(x, [1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585]),
    [1, -2, 1], [1, -1.99004745483398, 0.99007225036621]);
  const L = m => -0.691 + 10 * Math.log10(m + 1e-12);
  const blk = Math.round(0.4 * SR), hop = Math.round(0.1 * SR), z = [];
  for (let s = 0; s + blk <= k.length; s += hop) { let m = 0; for (let i = s; i < s + blk; i++) m += k[i] * k[i]; z.push(m / blk); }
  if (!z.length) { let m = 0; for (const v of k) m += v * v; return L(m / (k.length || 1)); }
  let g = z.filter(m => L(m) > -70);
  if (!g.length) return -70;
  const rel = L(g.reduce((s, m) => s + m, 0) / g.length) - 10;
  g = g.filter(m => L(m) > rel);
  return L(g.reduce((s, m) => s + m, 0) / g.length);
}
const gain = (x, dB) => { const k = Math.pow(10, dB / 20); const y = new Float32Array(x.length); for (let i = 0; i < x.length; i++) y[i] = x[i] * k; return y; };
export const peakDb = x => { let p = 0; for (const v of x) p = Math.max(p, Math.abs(v)); return db(p); };

// RMS per 20 ms (dBFS)
function frameDb(x, len = Math.round(0.02 * SR)) {
  const out = [];
  for (let s = 0; s < x.length; s += len) {
    let m = 0; const e = Math.min(x.length, s + len);
    for (let i = s; i < e; i++) m += x[i] * x[i];
    out.push(10 * Math.log10(m / Math.max(1, e - s) + 1e-12));
  }
  return out;
}
const pct = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
export const noiseDb = x => pct(frameDb(x), 0.1);

// ---------- FFT ----------
function makeFFT(N) {
  const rev = new Uint32Array(N), bits = Math.log2(N);
  for (let i = 0; i < N; i++) { let r = 0; for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b); rev[i] = r; }
  const cos = new Float64Array(N / 2), sin = new Float64Array(N / 2);
  for (let i = 0; i < N / 2; i++) { cos[i] = Math.cos(2 * Math.PI * i / N); sin[i] = -Math.sin(2 * Math.PI * i / N); }
  return (re, im, inv = false) => {
    for (let i = 0; i < N; i++) { const j = rev[i]; if (j > i) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
    for (let size = 2; size <= N; size <<= 1) {
      const half = size >> 1, step = N / size;
      for (let s = 0; s < N; s += size) {
        for (let k = 0; k < half; k++) {
          const wr = cos[k * step], wi = inv ? -sin[k * step] : sin[k * step];
          const a = s + k, b = a + half;
          const tr = re[b] * wr - im[b] * wi, ti = re[b] * wi + im[b] * wr;
          re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        }
      }
    }
    if (inv) for (let i = 0; i < N; i++) { re[i] /= N; im[i] /= N; }
  };
}

// ---------- pengurang noise (spectral gating) ----------
export function denoise(x, {over, floorDb, rel}) {
  const N = 2048, H = 512, B = N / 2 + 1, fft = makeFFT(N);
  const win = new Float64Array(N); for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N);
  const xp = new Float32Array(x.length + 2 * N); xp.set(x, N);
  const F = Math.floor((xp.length - N) / H) + 1;
  const RE = new Float32Array(F * B), IM = new Float32Array(F * B), energy = new Float64Array(F);
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let f = 0; f < F; f++) {
    for (let i = 0; i < N; i++) { re[i] = xp[f * H + i] * win[i]; im[i] = 0; }
    fft(re, im);
    let e = 0;
    for (let b = 0; b < B; b++) { RE[f * B + b] = re[b]; IM[f * B + b] = im[b]; e += re[b] * re[b] + im[b] * im[b]; }
    energy[f] = e;
  }
  // profil noise dari 12% frame paling sepi
  const order = [...energy.keys()].sort((a, b) => energy[a] - energy[b]);
  const quiet = order.slice(0, Math.max(6, Math.floor(F * 0.12)));
  const noise = new Float64Array(B);
  for (const f of quiet) for (let b = 0; b < B; b++) { const r = RE[f * B + b], i = IM[f * B + b]; noise[b] += (r * r + i * i) / quiet.length; }
  const floor = Math.pow(10, floorDb / 20), relK = Math.exp(-H / (SR * rel));
  const prev = new Float64Array(B).fill(1), g = new Float64Array(B), gs = new Float64Array(B);
  const out = new Float32Array(xp.length), wsum = new Float32Array(xp.length);
  for (let f = 0; f < F; f++) {
    for (let b = 0; b < B; b++) {
      const r = RE[f * B + b], i = IM[f * B + b], P = r * r + i * i;
      g[b] = Math.max(floor, Math.min(1, 1 - over * noise[b] / (P + 1e-20)));
    }
    for (let b = 0; b < B; b++) {
      const s = (g[Math.max(0, b - 1)] + g[b] + g[Math.min(B - 1, b + 1)]) / 3;
      gs[b] = s > prev[b] ? s : prev[b] * relK + s * (1 - relK);   // cepat naik, turun pelan: ekor suara tetap alami
      prev[b] = gs[b];
    }
    for (let b = 0; b < B; b++) { re[b] = RE[f * B + b] * gs[b]; im[b] = IM[f * B + b] * gs[b]; }
    for (let b = 1; b < N / 2; b++) { re[N - b] = re[b]; im[N - b] = -im[b]; }
    fft(re, im, true);
    for (let i = 0; i < N; i++) { out[f * H + i] += re[i] * win[i]; wsum[f * H + i] += win[i] * win[i]; }
  }
  const y = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) { const w = wsum[i + N]; y[i] = w > 1e-6 ? out[i + N] / w : 0; }
  return y;
}

// ---------- potong jeda awal/akhir ----------
export function trim(x, {pre, post, fadeIn, fadeOut}) {
  const len = Math.round(0.02 * SR), d = frameDb(x, len);
  const sm = d.map((_, i) => { let s = 0, n = 0; for (let k = Math.max(0, i - 2); k <= Math.min(d.length - 1, i + 2); k++) { s += d[k]; n++; } return s / n; });
  const thr = Math.max(pct(sm, 0.1) + 12, pct(sm, 0.95) - 28);
  let a = sm.findIndex(v => v >= thr), b = sm.length - 1 - [...sm].reverse().findIndex(v => v >= thr);
  if (a < 0) { a = 0; b = sm.length - 1; }
  const s = Math.max(0, a * len - Math.round(pre * SR)), e = Math.min(x.length, (b + 1) * len + Math.round(post * SR));
  const y = x.slice(s, e), fi = Math.round(fadeIn * SR), fo = Math.round(fadeOut * SR);
  for (let i = 0; i < fi && i < y.length; i++) y[i] *= 0.5 - 0.5 * Math.cos(Math.PI * i / fi);
  for (let i = 0; i < fo && i < y.length; i++) y[y.length - 1 - i] *= 0.5 - 0.5 * Math.cos(Math.PI * i / fo);
  return {y, cutStart: s / SR, cutEnd: (x.length - e) / SR};
}

// ---------- noise gate halus (downward expander) ----------
// Bagian yang jauh lebih pelan dari suara bicara (napas, noise di sela kata) diredam bertahap.
// Terbuka cepat (3 ms) agar awal kata tidak terpotong, menutup pelan + hold agar ujung kata tetap utuh.
export function gate(x, {below, range, ratio, hold, rel}) {
  const thr = pct(frameDb(x), 0.95) - below;
  const aA = Math.exp(-1 / (0.002 * SR)), aR = Math.exp(-1 / (0.05 * SR));
  const gOpen = Math.exp(-1 / (0.003 * SR)), gClose = Math.exp(-1 / (rel * SR)), H = Math.round(hold * SR);
  const y = new Float32Array(x.length);
  let env = 0, held = 0, g = 0;
  for (let i = 0; i < x.length; i++) {
    const a = Math.abs(x[i]);
    env = a > env ? aA * env + (1 - aA) * a : aR * env + (1 - aR) * a;
    const lv = db(env);
    let target = 0;
    if (lv >= thr) held = H;
    else if (held > 0) held--;
    else target = Math.max(-range, (lv - thr) * (ratio - 1));
    g = target > g ? gOpen * g + (1 - gOpen) * target : gClose * g + (1 - gClose) * target;
    y[i] = x[i] * Math.pow(10, g / 20);
  }
  return y;
}

// ---------- kompresor & limiter ----------
export function compress(x, {thr, ratio, knee, att, rel}) {
  const aA = Math.exp(-1 / (att * SR)), aR = Math.exp(-1 / (rel * SR)), y = new Float32Array(x.length);
  let env = 0;
  for (let i = 0; i < x.length; i++) {
    const lv = Math.abs(x[i]);
    env = lv > env ? aA * env + (1 - aA) * lv : aR * env + (1 - aR) * lv;
    const o = db(env) - thr;
    let gr = 0;
    if (2 * o > knee) gr = (1 / ratio - 1) * o;
    else if (2 * Math.abs(o) <= knee) gr = (1 / ratio - 1) * Math.pow(o + knee / 2, 2) / (2 * knee);
    y[i] = x[i] * Math.pow(10, gr / 20);
  }
  return y;
}
export function limit(x, ceilDb, look = 0.003, rel = 0.05) {
  const c = Math.pow(10, ceilDb / 20), n = x.length, g = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = Math.abs(x[i]); g[i] = a > c ? c / a : 1; }
  const up = 1 / Math.round(look * SR);
  for (let i = n - 2; i >= 0; i--) g[i] = Math.min(g[i], g[i + 1] + up);
  const down = 1 / (rel * SR);
  for (let i = 1; i < n; i++) g[i] = Math.min(g[i], g[i - 1] + down);
  const y = new Float32Array(n);
  for (let i = 0; i < n; i++) y[i] = Math.max(-c, Math.min(c, x[i] * g[i]));
  return y;
}

// ---------- MP3 ----------
export function mp3(x, kbps) {
  const enc = new lamejs.Mp3Encoder(1, SR, kbps), s = new Int16Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const v = Math.max(-1, Math.min(1, x[i] + (Math.random() - Math.random()) / 32768));
    s[i] = v < 0 ? v * 32768 : v * 32767;
  }
  const parts = [];
  for (let i = 0; i < s.length; i += 1152) { const b = enc.encodeBuffer(s.subarray(i, i + 1152)); if (b.length) parts.push(new Uint8Array(b.buffer, b.byteOffset, b.length).slice()); }
  const e = enc.flush(); if (e.length) parts.push(new Uint8Array(e.buffer, e.byteOffset, e.length).slice());
  return new Blob(parts, {type: 'audio/mpeg'});
}

// ---------- rangkaian lengkap ----------
// noise dinyatakan relatif terhadap kekerasan suara bicara (makin negatif makin bersih)
export function process(raw, S = SETELAN) {
  const before = {dur: raw.length / SR, noise: noiseDb(raw) - lufs(raw), lufs: lufs(raw), peak: peakDb(raw)};
  let clip = 0; for (const v of raw) if (Math.abs(v) > 0.985) clip++;
  let x = biquad(biquad(raw, 'hp', S.hp, 0.5412), 'hp', S.hp, 1.3066);     // high-pass 4th order Butterworth
  x = denoise(x, S.nr);
  x = gate(x, S.gate);
  const cleanNoise = noiseDb(x) - lufs(x);
  const t = trim(x, S.trim); x = t.y;
  for (const [type, f, q, g] of S.eq) x = biquad(x, type, f, q, g);
  x = gain(x, -20 - lufs(x));
  x = compress(x, S.comp);
  x = gain(x, S.target - lufs(x));
  x = limit(x, S.ceiling);
  const after = {dur: x.length / SR, noise: cleanNoise, lufs: lufs(x), peak: peakDb(x)};
  return {x, before, after, clip, cutStart: t.cutStart, cutEnd: t.cutEnd};
}
