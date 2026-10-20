// Ilustrasi & animasi gerakan shalat: anak tampak samping, menghadap kanan (= arah kiblat).
//
// Cara kerja:
// - Setiap pose ditulis sebagai titik target (pinggul, leher, kepala, tangan, pergelangan kaki).
//   Siku & lutut dihitung dengan inverse kinematics agar panjang tulang selalu sama.
// - Pose lalu diubah ke bentuk sudut sendi. Animasi memutar sendi (bukan menggeser titik),
//   jadi lengan & kaki tidak memanjang-memendek, dan gerakannya melengkung seperti manusia.
// - Perpindahan antar-kelompok (berdiri <-> lantai) lewat pose antara: menekuk lutut, berlutut,
//   lalu sujud (lutut lebih dulu, sesuai tuntunan madzhab Syafi'i).
// - Tubuh digambar dengan garis lengkung organik (bukan kapsul), diberi bayangan & cahaya.
// "N" = sisi dekat penonton (kanan tubuh), "F" = sisi jauh (kiri tubuh).

const LEN = {thigh: 36, shin: 34, upper: 25, fore: 22, foot: 15};
const FLOOR = 182;

// ---------- vektor ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const vlen = a => Math.hypot(a[0], a[1]);
const unit = a => { const l = vlen(a) || 1e-6; return [a[0] / l, a[1] / l]; };
const perp = a => [-a[1], a[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const dirDeg = d => [Math.cos(d * Math.PI / 180), Math.sin(d * Math.PI / 180)];
const dirRad = r => [Math.cos(r), Math.sin(r)];
const lerp = (a, b, t) => a + (b - a) * t;
const lerp2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const f1 = n => Math.round(n * 10) / 10;
const pt = p => `${f1(p[0])},${f1(p[1])}`;
const deg = r => r * 180 / Math.PI;

function ik(A, T, l1, l2, s) {
  const v = sub(T, A), u = unit(v);
  const d = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, vlen(v)));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  return add(add(A, mul(u, a)), mul(perp(u), s * h));
}

// ---------- pose (titik target) ----------
// Kaki tetap di tempat yang sama di sajadah (sekitar x=70); badan yang bergerak di atasnya.
const STAND = {hip: [70, 107], neck: [70, 62], head: [71, 48], aN: [71, 177.5], aF: [69, 177.5], fN: 4, fF: 3, bend: 1.5};
const DEF = {
  stand: {...STAND, hN: [71, 113], hF: [68, 112], hand: 'rest'},
  takbir: {...STAND, hN: [91, 53], hF: [88, 54], hand: 'palm'},
  sedekap: {...STAND, hN: [82, 91], hF: [80, 93], hand: 'fold'},
  ruku: {hip: [69, 107], neck: [114, 107], head: [128, 110], aN: [71, 177.5], aF: [69, 177.5], fN: 6, fF: 4, hN: [77, 141], hF: [74, 142], hand: 'grasp', bend: 0},
  // pose antara saat turun/bangun
  turun: {hip: [62, 138], neck: [76, 94], head: [83, 81], aN: [71, 176], aF: [68, 176], fN: 6, fF: 4, hN: [90, 146], hF: [87, 147], hand: 'rest', bend: 1},
  berlutut: {hip: [102, 136], neck: [104, 90], head: [106, 76], aN: [70, 168], aF: [67, 168], fN: 105, fF: 105, hN: [114, 140], hF: [111, 141], hand: 'thigh', bend: 1.5},
  sujud: {hip: [106, 136], neck: [146, 155], head: [153, 168], aN: [70, 168], aF: [67, 168], fN: 105, fF: 105, hN: [149, 180], hF: [145, 180], hand: 'flat', bend: -2},
  duduk: {hip: [71, 157], neck: [74, 112], head: [76, 98], aN: [68, 169], fN: 60, aF: [70, 176], fF: 178, hN: [96, 160], hF: [93, 161], hand: 'thigh', bend: 1.5},
  tawarruk: {hip: [68, 166], neck: [71, 121], head: [73, 107], aN: [69, 171], fN: 60, kF: [96, 178], aF: [80, 179], fF: 2, hN: [95, 165], hF: [92, 166], hand: 'thigh', handN: 'point', bend: 1.5},
};
DEF.tasyahud = {...DEF.duduk, handN: 'point'};
DEF.salamR = {...DEF.tawarruk, handN: 'thigh', turn: 1};
DEF.salamL = {...DEF.tawarruk, handN: 'thigh', turn: -1};

function build(d) {
  const p = {...d};
  p.sh = add(d.neck, mul(unit(sub(d.hip, d.neck)), 7));
  p.kN = d.kN || ik(d.hip, d.aN, LEN.thigh, LEN.shin, -1);
  p.kF = d.kF || ik(d.hip, d.aF, LEN.thigh, LEN.shin, -1);
  p.eN = ik(p.sh, d.hN, LEN.upper, LEN.fore, 1);
  p.eF = ik(p.sh, d.hF, LEN.upper, LEN.fore, 1);
  p.tN = add(d.aN, mul(dirDeg(d.fN), LEN.foot));
  p.tF = add(d.aF, mul(dirDeg(d.fF), LEN.foot));
  return p;
}

// ---------- pose sebagai sudut sendi ----------
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
function toState(p) {
  const seg = {
    spine: [p.hip, p.neck], head: [p.neck, p.head],
    uaN: [p.sh, p.eN], faN: [p.eN, p.hN], uaF: [p.sh, p.eF], faF: [p.eF, p.hF],
    thN: [p.hip, p.kN], shN: [p.kN, p.aN], ftN: [p.aN, p.tN],
    thF: [p.hip, p.kF], shF: [p.kF, p.aF], ftF: [p.aF, p.tF],
  };
  const A = {}, L = {};
  for (const k in seg) { A[k] = ang(...seg[k]); L[k] = vlen(sub(seg[k][1], seg[k][0])); }
  return {hip: p.hip, A, L, bend: p.bend || 0, turn: p.turn || 0,
    handN: p.handN || p.hand || 'rest', handF: p.handF || p.hand || 'rest', blink: false};
}
// state -> titik-titik tubuh
function fk(s) {
  const {A, L} = s, at = (o, k) => add(o, mul(dirRad(A[k]), L[k]));
  const p = {hip: s.hip, bend: s.bend, turn: s.turn, handN: s.handN, handF: s.handF, blink: s.blink};
  p.neck = at(p.hip, 'spine'); p.head = at(p.neck, 'head');
  p.sh = add(p.neck, mul(unit(sub(p.hip, p.neck)), 7));
  p.eN = at(p.sh, 'uaN'); p.hN = at(p.eN, 'faN'); p.eF = at(p.sh, 'uaF'); p.hF = at(p.eF, 'faF');
  p.kN = at(p.hip, 'thN'); p.aN = at(p.kN, 'shN'); p.tN = at(p.aN, 'ftN');
  p.kF = at(p.hip, 'thF'); p.aF = at(p.kF, 'shF'); p.tF = at(p.aF, 'ftF');
  return p;
}
const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
function mix(a, b, t) {
  const A = {}, L = {};
  for (const k in a.A) { A[k] = a.A[k] + angDiff(a.A[k], b.A[k]) * t; L[k] = lerp(a.L[k], b.L[k], t); }
  return {hip: lerp2(a.hip, b.hip, t), A, L, bend: lerp(a.bend, b.bend, t), turn: lerp(a.turn, b.turn, t),
    handN: t < 0.5 ? a.handN : b.handN, handF: t < 0.5 ? a.handF : b.handF, blink: false};
}
const STATE = Object.fromEntries(Object.entries(DEF).map(([k, v]) => [k, toState(build(v))]));

export const POSE_NAMES = {
  stand: 'Berdiri', takbir: 'Takbiratul Ihram', sedekap: 'Bersedekap', ruku: 'Ruku', sujud: 'Sujud',
  duduk: 'Duduk di Antara Dua Sujud', tasyahud: 'Tasyahud Awal', tawarruk: 'Tasyahud Akhir', salamR: 'Salam ke Kanan', salamL: 'Salam ke Kiri',
  turun: 'Turun', berlutut: 'Berlutut',
};

// ---------- warna & bahan ----------
const SKIN = {base: '#E8B18C', shade: '#C98A63', edge: '#A46C4A', far: '#D8A07A', cheek: '#EE8F7A', hair: '#2A201C', hairHi: '#4A3A33', lip: '#B5625A', eye: '#2A2228'};
const KOKO = {base: '#3A9A8C', far: '#2C7F73', edge: '#1D584F', embro: '#F1E6C4'};
const MK = {fill: 'url(#rs-mk)', far: '#E6E1F3', edge: '#A59BCF', fold: '#CFC6E8', lace: '#E6A0BC'};
const LIGHT = unit([-0.55, -0.85]); // cahaya dari kiri atas

// ---------- kurva ----------
// Catmull-Rom -> Bezier melalui titik-titik (dimulai dari pts[0] yang sudah ada di path)
function crPath(pts) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return d;
}
function crPoint(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [0, 1].map(i => 0.5 * (2 * p1[i] + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}
const smooth = t => t * t * (3 - 2 * t);

// Bentuk anggota tubuh/kain organik: garis tengah melengkung melewati sendi J,
// tebal W di tiap sendi, B = tonjolan di tengah tiap ruas (otot/kain).
function tube(J, W, B = [], n = 7) {
  const c = [], w = [];
  for (let i = 0; i < J.length - 1; i++) {
    const p0 = J[i - 1] || J[i], p1 = J[i], p2 = J[i + 1], p3 = J[i + 2] || J[i + 1];
    for (let s = 0; s < n; s++) {
      const t = s / n;
      c.push(crPoint(p0, p1, p2, p3, t));
      w.push(lerp(W[i], W[i + 1], smooth(t)) + (B[i] || 0) * Math.sin(Math.PI * t));
    }
  }
  c.push(J[J.length - 1]); w.push(W[W.length - 1]);
  const N = c.map((_, i) => perp(unit(sub(c[Math.min(c.length - 1, i + 1)], c[Math.max(0, i - 1)]))));
  const side = k => c.map((p, i) => add(p, mul(N[i], k * w[i])));
  const Lp = side(1), Rp = side(-1), we = f1(w[w.length - 1]), ws = f1(w[0]);
  const d = `M${pt(Lp[0])}${crPath(Lp)}A${we},${we} 0 0 0 ${pt(Rp[Rp.length - 1])}${crPath([...Rp].reverse())}A${ws},${ws} 0 0 0 ${pt(Lp[0])}Z`;
  // sisi yang membelakangi cahaya diberi bayangan, sisi lain diberi kilau tipis
  const avg = unit(N.reduce((s, v) => add(s, v), [0, 0]));
  const sg = dot(avg, LIGHT) > 0 ? -1 : 1;
  const band = (a, b) => { const o = side(sg * a), q = side(sg * b); return `M${pt(o[0])}${crPath(o)}L${pt(q[q.length - 1])}${crPath([...q].reverse())}Z`; };
  return {d, shade: band(0.97, 0.12), light: band(-0.38, -0.8), c, w, N};
}
const solid = (d, fill, edge, sw = 1.6) => `<path d="${d}" fill="${fill}" stroke="${edge}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const shaded = (t, fill, edge, {shade = 0.17, light = 0.13, sw = 1.6} = {}) =>
  solid(t.d, fill, edge, sw) + `<path d="${t.shade}" fill="#000" opacity="${shade}"/><path d="${t.light}" fill="#fff" opacity="${light}"/>`;

// selubung cembung yang dibulatkan (untuk kain mukena)
function hull(points) {
  const p = points.map(q => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  const h = lo.slice(0, -1).concat(up.slice(0, -1));
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${pt(mid(h[h.length - 1], h[0]))}`;
  h.forEach((q, i) => { d += `Q${pt(q)} ${pt(mid(q, h[(i + 1) % h.length]))}`; });
  return d + 'Z';
}
const ring = (c, r, n = 10) => Array.from({length: n}, (_, i) => add(c, mul(dirDeg(i * 360 / n), r)));

// lipatan kain di sisi dalam tekukan sendi
function folds(A, B, C, w, color, n = 2) {
  const u1 = unit(sub(B, A)), u2 = unit(sub(C, B)), turn = u1[0] * u2[1] - u1[1] * u2[0];
  if (Math.abs(turn) < 0.12) return '';
  const inner = mul(unit(sub(u2, u1)), 1), side = turn > 0 ? 1 : -1;
  let g = '';
  for (let k = 0; k < n; k++) {
    const s = 2.2 + k * 2.6;
    const p1 = add(sub(B, mul(u1, s + 2)), mul(perp(u1), side * w * 0.55));
    const p2 = add(add(B, mul(inner, w * 0.15)), mul(sub(u2, u1), s * 0.5));
    const p3 = add(add(B, mul(u2, s + 2)), mul(perp(u2), side * w * 0.55));
    g += `<path d="M${pt(p1)}Q${pt(p2)} ${pt(p3)}" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round" opacity=".55"/>`;
  }
  return g;
}

// ---------- tangan & kaki ----------
const HAND = {
  rest: 'M0,-3.4C3,-4.2 7.5,-4 10,-2.6C12.2,-1.4 12.4,1.6 10.4,2.8C7.6,4.2 3,4.2 0.4,3.4C-1.4,2.6 -1.4,-2.6 0,-3.4Z',
  grasp: 'M0,-3.6C3,-4.4 7.4,-4.2 9.2,-2.4C10.8,-0.8 10.6,2.6 8.4,3.6C6,4.6 2.6,4.4 0.4,3.6C-1.4,2.8 -1.4,-2.8 0,-3.6Z',
  fist: 'M0,-3.6C3,-4.4 6.4,-4.2 7.8,-2.6C9,-1 8.8,2.4 7,3.4C5,4.4 2.4,4.2 0.4,3.6C-1.4,2.8 -1.4,-2.8 0,-3.6Z',
};
const THUMB = 'M1.6,-3C3.6,-6 6.6,-7 8,-5.6C8.8,-4.8 7.2,-3.8 5.2,-3.2Z';
function hand(p, which, fill, edge) {
  const h = p['h' + which], e = p['e' + which], style = which === 'N' ? p.handN : p.handF;
  const a = deg(ang(e, h));
  const shapeAt = (inner, x, y, r) => `<g transform="translate(${pt([x, y])}) rotate(${f1(r)})">${inner}</g>`;
  const P = (d, extra = '') => `<path d="${d}" fill="${fill}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"${extra}/>`;
  if (style === 'palm') {
    // telapak terbuka menghadap kiblat, jari ke atas (terlihat dari samping)
    return shapeAt(P('M-2.8,0.5C-3.3,-5 -2.9,-10 -1.4,-13.2C-0.4,-14.6 1.7,-14.4 2.3,-12.8C3.1,-9.6 3.3,-5 3.1,0.5Z') +
      P('M2.4,-4.2C5,-6.2 6.8,-6.2 7,-4.8C7,-3.8 5.2,-2.8 2.8,-2Z') +
      `<path d="M-0.9,-12.2V-5.5M1,-12.6V-5.8" stroke="${edge}" stroke-width=".6" opacity=".45"/>`, h[0], h[1], 0);
  }
  if (style === 'flat') {
    // telapak menempel lantai, jari ke depan
    return shapeAt(P('M-1.5,-3.2C3,-3.8 9,-3.2 12.6,-1.8C14.2,-1.1 14,0.6 12.4,0.9L-1,1.3C-2.7,1 -2.9,-2.6 -1.5,-3.2Z') +
      `<path d="M9.5,-1.6L5,-1.4M9.8,0.2L5,0.3" stroke="${edge}" stroke-width=".6" opacity=".45"/>`, h[0], FLOOR - 1.6, 0);
  }
  if (style === 'point') {
    // tangan menggenggam, jari telunjuk menunjuk (tasyahud)
    return shapeAt(P(HAND.fist) + P('M6.4,-3.4L15.6,-3C16.8,-2.9 16.8,-1.3 15.6,-1.2L7,-0.8Z') + P(THUMB), h[0], h[1], a);
  }
  const shape = style === 'grasp' ? HAND.grasp : HAND.rest;
  return shapeAt(P(shape) + P(THUMB) + `<path d="M9.8,-1.2L7.2,-1M10,0.8L7.4,1" stroke="${edge}" stroke-width=".6" opacity=".45"/>`, h[0], h[1], a);
}
function foot(a, t, fill, edge) {
  const r = deg(ang(a, t));
  return `<g transform="translate(${pt(a)}) rotate(${f1(r)})">` +
    `<path d="M-3.6,-2.6C-6,-1 -6.4,3 -3.8,4.6C0,5.2 7,5.4 11.4,5.2C14.8,5 16.6,3.6 15.6,1.6C14.8,0.2 12,-0.4 9,-1.4C5.6,-2.6 2.4,-4.6 -0.8,-4.6C-2,-4.6 -3,-3.6 -3.6,-2.6Z" fill="${fill}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"/>` +
    `<path d="M13.4,1.6L12.8,3.6M11,1.4L10.6,3.6" stroke="${edge}" stroke-width=".6" opacity=".5"/>` +
    `<path d="M-3,3.6C1,4.6 7,4.8 12,4.4" fill="none" stroke="#000" stroke-width="1.6" opacity=".1"/></g>`;
}

// ---------- kepala ----------
// koordinat lokal kepala: depan = +x, atas = -y
const PROFILE = 'M-4,12.8C-11.5,9.5 -14.2,-2 -10.5,-9.5C-6.5,-15.5 5,-15.8 9.8,-9.5C11.6,-7 12.3,-4.6 12.4,-2.4C12.6,-1.2 13.4,0.2 14.3,1.6C14.8,2.4 14.1,3.3 12.9,3.3C13.2,4.3 13.1,5.2 12.7,5.9C13,6.6 12.8,7.6 12.2,8.2C12.5,9.6 11.6,11.2 9.8,11.9C7.2,12.9 3.8,12.6 1.6,13.4C-0.5,14.2 -2.4,13.8 -4,12.8Z';
function sideFace(blink) {
  const eye = blink
    ? `<path d="M5.8,-1.2Q7.5,-0.2 9.3,-1.1" fill="none" stroke="${SKIN.eye}" stroke-width="1.1" stroke-linecap="round"/>`
    : `<path d="M5.9,-1.4Q7.6,-3.1 9.4,-1.6Q7.9,-0.2 5.9,-1.4Z" fill="#fff"/><circle cx="8.1" cy="-1.6" r="1.25" fill="${SKIN.eye}"/><circle cx="8.5" cy="-2" r=".42" fill="#fff"/>` +
      `<path d="M5.6,-1.6Q7.6,-3.6 9.7,-1.9" fill="none" stroke="${SKIN.eye}" stroke-width="1.05" stroke-linecap="round"/><path d="M9.5,-2L10.4,-2.6" stroke="${SKIN.eye}" stroke-width=".7" stroke-linecap="round"/>`;
  return eye +
    `<path d="M5.3,-4.9Q7.7,-6.2 10.1,-5.1" fill="none" stroke="${SKIN.hair}" stroke-width="1.25" stroke-linecap="round"/>` +
    `<path d="M12.6,2.9Q13.2,3.4 12.3,3.6" fill="none" stroke="${SKIN.edge}" stroke-width=".7" opacity=".7"/>` +
    `<path d="M10.8,6.9Q11.9,7.5 12.5,6.6" fill="none" stroke="${SKIN.lip}" stroke-width="1.1" stroke-linecap="round"/>` +
    `<circle cx="6.4" cy="4.4" r="2.8" fill="${SKIN.cheek}" opacity=".28"/>` +
    `<path d="M-1.2,10.5C2.5,12.2 6,12 9,11" fill="none" stroke="${SKIN.shade}" stroke-width="1.4" opacity=".35"/>`;
}
const EAR_SIDE = `<path d="M-3.6,-1.4C-1.4,-3.4 1.2,-1.6 0.9,1.8C0.7,4.6 -1.6,5.8 -3.2,4.6C-4.4,3.4 -4.8,0 -3.6,-1.4Z" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1"/><path d="M-2.2,0C-0.8,-0.6 0.2,1.6 -1.2,3" fill="none" stroke="${SKIN.shade}" stroke-width=".8"/>`;
function frontFace(blink) {
  const eye = x => blink
    ? `<path d="M${x - 1.8},-0.4Q${x},0.6 ${x + 1.8},-0.4" fill="none" stroke="${SKIN.eye}" stroke-width="1.1" stroke-linecap="round"/>`
    : `<ellipse cx="${x}" cy="-0.6" rx="1.7" ry="2" fill="${SKIN.eye}"/><circle cx="${x + 0.5}" cy="-1.2" r=".55" fill="#fff"/><path d="M${x - 2},-2.2Q${x},-3.4 ${x + 2},-2.2" fill="none" stroke="${SKIN.eye}" stroke-width=".9" stroke-linecap="round"/>`;
  return eye(-4.2) + eye(4.2) +
    `<path d="M-6.6,-4.4Q-4.3,-5.8 -2,-4.6M2,-4.6Q4.3,-5.8 6.6,-4.4" fill="none" stroke="${SKIN.hair}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="M-0.4,0.8Q0.4,3.4 1.2,3.6Q0.2,4.1 -0.8,3.8" fill="none" stroke="${SKIN.shade}" stroke-width=".9" stroke-linecap="round"/>` +
    `<path d="M-3,6.8Q0,9.2 3,6.8" fill="none" stroke="${SKIN.lip}" stroke-width="1.3" stroke-linecap="round"/>` +
    `<circle cx="-6.4" cy="3.8" r="2.4" fill="${SKIN.cheek}" opacity=".28"/><circle cx="6.4" cy="3.8" r="2.4" fill="${SKIN.cheek}" opacity=".28"/>`;
}
const FACE_OVAL = 'M0,13.4C-7,13.4 -11.4,8 -11.4,0C-11.4,-8.2 -6.5,-13.6 0,-13.6C6.5,-13.6 11.4,-8.2 11.4,0C11.4,8 7,13.4 0,13.4Z';
const EARS_FRONT = `<ellipse cx="-11.4" cy="1.4" rx="2.4" ry="3.6" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1"/><ellipse cx="11.4" cy="1.4" rx="2.4" ry="3.6" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1"/>`;
const PECI_SIDE = `<path d="M-12.4,-6.4C-4,-4.8 5,-4.8 11.2,-6.2L10.3,-16.6C3,-18 -4.5,-18 -11.3,-16.8Z" fill="url(#rs-peci)"/><path d="M-12.2,-7.4C-4,-5.9 5,-5.9 11.1,-7.2" fill="none" stroke="#D6AE4A" stroke-width="1"/><ellipse cx="-0.5" cy="-17.1" rx="10.8" ry="1.3" fill="#3A3743"/>`;
const PECI_FRONT = `<path d="M-11.8,-6.2C-4,-4.8 4,-4.8 11.8,-6.2L11,-16.8C4,-18.2 -4,-18.2 -11,-16.8Z" fill="url(#rs-peci)"/><path d="M-11.6,-7.2C-4,-5.8 4,-5.8 11.6,-7.2" fill="none" stroke="#D6AE4A" stroke-width="1"/>`;

const headAngle = p => Math.atan2(p.head[1] - p.neck[1], p.head[0] - p.neck[0]) + Math.PI / 2;
const headXform = p => `translate(${pt(p.head)}) rotate(${f1(deg(headAngle(p)))})`;
function headPt(p, x, y) {
  const a = headAngle(p), c = Math.cos(a), s = Math.sin(a);
  return [p.head[0] + x * c - y * s, p.head[1] + x * s + y * c];
}
const layer = (op, g) => op <= 0.01 ? '' : `<g opacity="${f1(Math.min(1, op) * 100) / 100}">${g}</g>`;

function headPutra(p) {
  const t = p.turn || 0, side = 1 - Math.abs(t);
  const sideG = `<path d="${PROFILE}" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.3" stroke-linejoin="round"/>` +
    `<path d="M-12.6,-6C-14,0 -12.8,5.6 -9.4,8.6C-8,6 -7.2,2 -7,-2C-5.6,-4.2 -3,-5.6 0,-6.3Z" fill="${SKIN.hair}"/>` +
    `<path d="M-11.6,-3.4C-12,0 -11.4,3 -10,5.2" fill="none" stroke="${SKIN.hairHi}" stroke-width=".8"/>` +
    `<path d="M2.4,-6.2C3,-4.6 3.2,-3 2.8,-1.6" fill="none" stroke="${SKIN.hair}" stroke-width="1.4" stroke-linecap="round"/>` +
    EAR_SIDE + sideFace(p.blink) + PECI_SIDE;
  const frontG = EARS_FRONT + `<path d="${FACE_OVAL}" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.3"/>` +
    `<path d="M-11,-4C-11,-8 -10,-9 -8,-10L-8,-4.6ZM11,-4C11,-8 10,-9 8,-10L8,-4.6Z" fill="${SKIN.hair}"/>` + frontFace(p.blink) + PECI_FRONT;
  const backG = EARS_FRONT + `<path d="${FACE_OVAL}" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.3"/>` +
    `<path d="M-11.2,-2C-11.4,-9 -6,-13 0,-13C6,-13 11.4,-9 11.2,-2C10,4.6 6,8 0,8.6C-6,8 -10,4.6 -11.2,-2Z" fill="${SKIN.hair}"/>` +
    `<path d="M-6,4C-3,6 3,6 6,4" fill="none" stroke="${SKIN.hairHi}" stroke-width=".8"/>` + PECI_FRONT;
  return `<g transform="${headXform(p)}">${layer(side, sideG)}${layer(t > 0 ? t : 0, frontG)}${layer(t < 0 ? -t : 0, backG)}</g>`;
}

function lace(cx, cy, rx, ry, a0, a1, n) {
  let g = '';
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180;
    g += `<circle cx="${f1(cx + Math.cos(a) * rx)}" cy="${f1(cy + Math.sin(a) * ry)}" r=".95" fill="#fff" stroke="${MK.lace}" stroke-width=".6"/>`;
  }
  return g;
}
function headPutri(p) {
  const t = p.turn || 0, side = 1 - Math.abs(t);
  const sideG = `<g clip-path="url(#rs-face)"><path d="${PROFILE}" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.3"/>${sideFace(p.blink)}</g>` +
    `<path d="M6.4,-10.6C-0.6,-10.6 -3.4,-4 -3.4,1.6C-3.4,7.2 -0.6,13.6 6.4,13.6" fill="none" stroke="${MK.lace}" stroke-width="2" stroke-linecap="round"/>` +
    lace(6.2, 1.5, 9.6, 12.1, 100, 260, 10);
  const frontG = `<ellipse cx="0" cy="1" rx="9.4" ry="11" fill="${SKIN.base}" stroke="${MK.lace}" stroke-width="2"/><g transform="translate(0,1.4) scale(.86)">${frontFace(p.blink)}</g>` +
    lace(0, 1, 10.6, 12.2, 0, 360, 22);
  const backG = `<path d="M-12,4C-9,9 9,9 12,4" fill="none" stroke="${MK.fold}" stroke-width="1.4" stroke-linecap="round"/>`;
  return `<g transform="${headXform(p)}">${layer(side, sideG)}${layer(t > 0 ? t : 0, frontG)}${layer(t < 0 ? -t : 0, backG)}</g>`;
}

// ---------- badan ----------
function torsoJoints(p) {
  const down = unit(sub(p.hip, p.neck)), front = [down[1], -down[0]], Ls = vlen(sub(p.hip, p.neck));
  const at = (k, f) => add(add(p.hip, mul(down, -k * Ls)), mul(front, f));
  return {down, front, J: [add(add(p.hip, mul(down, 7)), mul(front, 0.5)), p.hip, at(0.34, -0.2), at(0.68, 1.8 + p.bend), at(0.9, 0.9), add(p.neck, mul(down, 1.5))]};
}

function putra(p) {
  const wristN = sub(p.hN, mul(unit(sub(p.hN, p.eN)), 1)), wristF = sub(p.hF, mul(unit(sub(p.hF, p.eF)), 1));
  let g = '';
  // sisi jauh: kaki & lengan kiri
  g += foot(p.aF, p.tF, SKIN.far, SKIN.edge);
  const legF = tube([p.hip, p.kF, p.aF], [12, 9.2, 8.6], [1.4, 0.8]);
  g += shaded(legF, 'url(#rs-sarF)', '#4A1D29', {shade: 0.22});
  const armF = tube([p.sh, p.eF, wristF], [6.4, 5.1, 4.6], [0.6, 0.3]);
  g += shaded(armF, KOKO.far, KOKO.edge, {shade: 0.2, light: 0.08});
  g += hand(p, 'F', SKIN.far, SKIN.edge);
  // kaki dekat (sarung)
  g += foot(p.aN, p.tN, SKIN.base, SKIN.edge);
  const legN = tube([p.hip, p.kN, p.aN], [12.4, 9.6, 9], [1.6, 0.9]);
  g += shaded(legN, 'url(#rs-sar)', '#4A1D29');
  g += folds(p.hip, p.kN, p.aN, 9.6, '#3A1420', 3);
  // leher, baju koko
  const neckT = tube([add(p.neck, mul(unit(sub(p.hip, p.neck)), 4)), sub(p.head, mul(unit(sub(p.head, p.neck)), 8))], [4.6, 4.3]);
  g += shaded(neckT, SKIN.base, SKIN.edge, {shade: 0.22, light: 0.05});
  const {down, front, J} = torsoJoints(p);
  const torso = tube(J, [12.4, 11.8, 10.8, 12, 10.6, 6.8], [0, 0.2, 0.5, 0, 0]);
  g += shaded(torso, KOKO.base, KOKO.edge);
  // kerah, kancing & bordir, keliman bawah
  g += solid(tube([add(p.neck, mul(down, 4.5)), add(p.neck, mul(down, -0.5))], [6.2, 5.6]).d, KOKO.far, KOKO.edge, 1.2);
  const pl1 = add(add(p.neck, mul(down, 5)), mul(front, 6)), pl2 = add(J[3], mul(front, 11.2)), pl3 = add(J[2], mul(front, 10.2));
  g += `<path d="M${pt(pl1)}Q${pt(pl2)} ${pt(pl3)}" fill="none" stroke="${KOKO.embro}" stroke-width="1.5" stroke-linecap="round"/>`;
  [0.25, 0.55, 0.85].forEach(k => { const b = lerp2(pl1, lerp2(pl2, pl3, k), k); g += `<circle cx="${f1(b[0])}" cy="${f1(b[1])}" r="1" fill="${KOKO.embro}" stroke="${KOKO.edge}" stroke-width=".4"/>`; });
  const hm = J[0];
  g += `<path d="M${pt(add(add(hm, mul(front, -12)), mul(down, -1.5)))}Q${pt(add(hm, mul(down, 3)))} ${pt(add(add(hm, mul(front, 12)), mul(down, -1.5)))}" fill="none" stroke="${KOKO.embro}" stroke-width="1.1" opacity=".75"/>`;
  g += headPutra(p);
  // lengan dekat + manset
  const armN = tube([p.sh, p.eN, wristN], [6.6, 5.3, 4.8], [0.7, 0.35]);
  g += shaded(armN, KOKO.base, KOKO.edge);
  g += folds(p.sh, p.eN, wristN, 5.3, KOKO.edge, 2);
  const cuffA = sub(wristN, mul(unit(sub(wristN, p.eN)), 3.2));
  g += `<path d="M${pt(add(cuffA, mul(perp(unit(sub(wristN, p.eN))), 4.8)))}L${pt(sub(cuffA, mul(perp(unit(sub(wristN, p.eN))), 4.8)))}" stroke="${KOKO.embro}" stroke-width="1.3" stroke-linecap="round"/>`;
  g += hand(p, 'N', SKIN.base, SKIN.edge);
  return g;
}

function putri(p) {
  const down = unit(sub(p.hip, p.neck));
  const wristN = sub(p.hN, mul(unit(sub(p.hN, p.eN)), 3)), wristF = sub(p.hF, mul(unit(sub(p.hF, p.eF)), 3));
  let g = '';
  g += foot(p.aF, p.tF, SKIN.far, SKIN.edge);
  g += foot(p.aN, p.tN, SKIN.base, SKIN.edge);
  // bawahan mukena: rok panjang yang jatuh ke lantai
  const flare = a => [[a[0] - 12, Math.min(FLOOR - 1, a[1] + 3)], [a[0] + 11, Math.min(FLOOR - 1, a[1] + 3)]];
  const skirt = hull([...ring(p.hip, 12.5), ...ring(p.kN, 10.5), ...ring(p.kF, 10.5), ...ring(p.aN, 8.2), ...ring(p.aF, 8.2), ...flare(p.aN), ...flare(p.aF)]);
  g += solid(skirt, MK.fill, MK.edge, 1.8);
  g += `<path d="M${pt(add(p.hip, [3, 6]))}Q${pt(add(p.kN, [-2, 0]))} ${pt(add(p.aN, [-3, 1]))}M${pt(add(p.hip, [-5, 8]))}Q${pt(add(p.kF, [-6, 2]))} ${pt(add(p.aF, [-7, 2]))}" fill="none" stroke="${MK.fold}" stroke-width="1.2" stroke-linecap="round"/>`;
  // atasan mukena: menutup kepala, lengan, sampai paha
  const hood = Array.from({length: 14}, (_, i) => { const t = i * Math.PI / 7; return headPt(p, -3.2 + Math.cos(t) * 15.6, 0.5 + Math.sin(t) * 16.6); });
  const thighDir = unit(sub(p.kN, p.hip));
  const cape = hull([...hood, ...ring(p.sh, 11.5), ...ring(p.eN, 7.8, 8), ...ring(p.eF, 7.8, 8), ...ring(wristN, 6.2, 8), ...ring(wristF, 6.2, 8),
    ...ring(p.hip, 13.5), ...ring(add(p.hip, mul(thighDir, 16)), 10.5)]);
  g += solid(cape, MK.fill, MK.edge, 1.8);
  g += `<path d="${cape}" fill="url(#rs-mkShade)"/>`;
  g += `<path d="M${pt(p.sh)}Q${pt(add(p.eN, mul(down, 4)))} ${pt(wristN)}M${pt(add(p.sh, mul(down, 7)))}Q${pt(add(lerp2(p.sh, p.hip, 0.6), [3, 0]))} ${pt(add(p.hip, mul(thighDir, 13)))}M${pt(add(p.sh, [-6, 6]))}Q${pt(add(p.hip, [-9, -8]))} ${pt(add(p.hip, [-10, 6]))}" fill="none" stroke="${MK.fold}" stroke-width="1.2" stroke-linecap="round"/>`;
  g += headPutri(p);
  g += hand(p, 'F', SKIN.far, SKIN.edge);
  g += hand(p, 'N', SKIN.base, SKIN.edge);
  return g;
}

const DEFS = `<defs>
  <pattern id="rs-sar" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#7E3646"/><rect width="10" height="3.2" fill="#9C4859"/><rect width="3.2" height="10" fill="#9C4859" opacity=".75"/><rect y="6.4" width="10" height=".8" fill="#E2B64E" opacity=".85"/><rect x="6.4" width=".8" height="10" fill="#E2B64E" opacity=".7"/></pattern>
  <pattern id="rs-sarF" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#682B39"/><rect width="10" height="3.2" fill="#803A49"/><rect width="3.2" height="10" fill="#803A49" opacity=".75"/><rect y="6.4" width="10" height=".8" fill="#B8913E" opacity=".7"/></pattern>
  <linearGradient id="rs-mk" x1="0" y1="35" x2="0" y2="185" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6E1F4"/></linearGradient>
  <linearGradient id="rs-mkShade" x1="30" y1="40" x2="170" y2="190" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".55" stop-color="#8E84BE" stop-opacity=".0"/><stop offset="1" stop-color="#8E84BE" stop-opacity=".16"/></linearGradient>
  <linearGradient id="rs-peci" x1="0" y1="-18" x2="0" y2="-5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4A4656"/><stop offset=".45" stop-color="#26232D"/><stop offset="1" stop-color="#1B1920"/></linearGradient>
  <clipPath id="rs-face"><ellipse cx="6.2" cy="1.5" rx="9.6" ry="12.1"/></clipPath>
  <filter id="rs-blur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="2.2"/></filter>
</defs>`;

const MAT = `<path d="M30,177L176,177L183,187L23,187Z" fill="#B23A48"/>` +
  `<path d="M36,178.6L170,178.6L175.6,185.4L30.4,185.4Z" fill="none" stroke="#F0C35A" stroke-width="1.1"/>` +
  `<path d="M44,182H158" stroke="#7E2433" stroke-width="2.2" stroke-dasharray="3 4"/>` +
  `<path d="M158,185.4V181.6Q164,177.8 170,181.6V185.4" fill="none" stroke="#F0C35A" stroke-width="1.1"/>` +
  `<path d="M23,187l-3,2.4M26,187l-3,2.4M183,187l3,2.4M180,187l3,2.4" stroke="#E9D8B4" stroke-width="1"/>`;

function shadow(p) {
  const pts = [p.aN, p.aF, p.tN, p.tF, p.kN, p.kF, p.hip, p.hN, p.hF, p.head].filter(q => q[1] > FLOOR - 22);
  const xs = pts.map(q => q[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
  return `<ellipse cx="${f1((x0 + x1) / 2)}" cy="${FLOOR + 1.5}" rx="${f1((x1 - x0) / 2 + 14)}" ry="3.6" fill="rgba(42,30,40,.32)" filter="url(#rs-blur)"/>`;
}
const render = (p, gender) => shadow(p) + (gender === 'putri' ? putri(p) : putra(p));

function bounds(p) {
  const pts = [p.head, p.neck, p.hip, p.kN, p.kF, p.aN, p.aF, p.tN, p.tF, p.hN, p.hF, p.eN, p.eF];
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
  const x0 = Math.min(...xs) - 20, x1 = Math.max(...xs) + 20, y0 = Math.min(...ys) - 24, y1 = FLOOR + 8;
  const s = Math.max(x1 - x0, y1 - y0), cx = (x0 + x1) / 2;
  return `${f1(cx - s / 2)} ${f1(y1 - s)} ${f1(s)} ${f1(s)}`;
}

function svgFor(state, gender, {mat = true, cls = '', label = ''} = {}) {
  const p = fk(state);
  const vb = mat ? '14 22 182 172' : bounds(p);
  return `<svg class="fig ${cls}" viewBox="${vb}" role="img" aria-label="${label || 'Gerakan shalat'}">${DEFS}${mat ? MAT : ''}${render(p, gender)}</svg>`;
}

// Gambar diam satu pose (untuk kuis, beranda, dsb.). Tanpa sajadah, gambar dipusatkan otomatis.
export function poseSVG(pose, gender = 'putra', opts = {}) {
  return svgFor(STATE[pose] || STATE.stand, gender, {...opts, label: opts.label || POSE_NAMES[pose]});
}

// ---------- animasi ----------
const STANDING = new Set(['stand', 'takbir', 'sedekap', 'ruku', 'turun']);
function plan(from, to) {
  if (!from || from === to) return [to];
  const a = STANDING.has(from), b = STANDING.has(to);
  if (a && !b) return [...(from === 'ruku' ? ['stand'] : []), ...(from === 'turun' ? [] : ['turun']), ...(to === 'berlutut' ? [] : ['berlutut']), to];
  if (!a && b) return [...(from === 'berlutut' ? [] : ['berlutut']), ...(to === 'turun' ? [] : ['turun']), to];
  return [to];
}
function travel(a, b) {
  const pa = fk(a), pb = fk(b);
  return Math.max(...['head', 'hip', 'hN', 'hF', 'kN', 'aN'].map(k => vlen(sub(pa[k], pb[k]))));
}
const easeInOut = t => 0.5 - 0.5 * Math.cos(Math.PI * t);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const anim = new WeakMap();
// Animasi berpindah pose di dalam elemen wadah; setelah itu karakter bernapas & berkedip.
export function animateTo(el, pose, gender, opts = {}) {
  const prev = anim.get(el) || {};
  cancelAnimationFrame(prev.raf); clearTimeout(prev.idle);
  const target = STATE[pose] || STATE.stand;
  const st = {pose, gender, cur: prev.gender === gender ? prev.cur : null, raf: 0, idle: 0};
  anim.set(el, st);
  const label = POSE_NAMES[pose];
  const draw = s => { el.innerHTML = svgFor(s, gender, {label}); };

  const startIdle = () => {
    if (reduced()) return;
    const t0 = performance.now();
    let nextBlink = t0 + 2000 + Math.random() * 2500, blinkUntil = 0, last = 0;
    const loop = now => {
      if (!el.isConnected || anim.get(el) !== st) return;
      if (now - last > 60 && !document.hidden) {
        last = now;
        if (now > nextBlink) { blinkUntil = now + 140; nextBlink = now + 2800 + Math.random() * 3000; }
        const br = Math.sin((now - t0) / 4000 * 2 * Math.PI);
        const s = {...target, A: {...target.A, head: target.A.head + br * 0.012}, bend: target.bend + br * 0.7, blink: now < blinkUntil};
        draw(s);
      }
      st.raf = requestAnimationFrame(loop);
    };
    st.raf = requestAnimationFrame(loop);
  };

  if (opts.instant || !st.cur || reduced()) { st.cur = target; draw(target); startIdle(); return; }

  // susun jalur gerakan lewat pose antara
  const keys = plan(prev.pose, pose);
  const segs = [];
  let from = st.cur;
  for (const k of keys) {
    const to = STATE[k];
    const dur = Math.min(950, Math.max(320, 260 + travel(from, to) * 5.5)) * (opts.speed || 1);
    segs.push({from, to, dur}); from = to;
  }
  let i = 0, t0 = performance.now();
  const step = now => {
    if (!el.isConnected || anim.get(el) !== st) return;
    const sg = segs[i], k = Math.min(1, (now - t0) / sg.dur);
    st.cur = mix(sg.from, sg.to, easeInOut(k));
    draw(st.cur);
    if (k >= 1) {
      i++; t0 = now;
      if (i >= segs.length) { st.cur = target; startIdle(); return; }
    }
    st.raf = requestAnimationFrame(step);
  };
  st.raf = requestAnimationFrame(step);
}
