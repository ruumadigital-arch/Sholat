// Ilustrasi gerakan shalat: anak tampak samping, menghadap kanan (= arah kiblat).
// Kerangka memakai panjang tulang tetap; siku & lutut dihitung dengan inverse kinematics
// sehingga proporsi tubuh tetap wajar di semua pose. "N" = sisi dekat penonton (kanan), "F" = sisi jauh (kiri).

const LEN = {thigh: 36, shin: 34, upper: 25, fore: 22, foot: 15};
const FLOOR = 182;

// ---------- vektor ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const vlen = a => Math.hypot(a[0], a[1]);
const unit = a => { const l = vlen(a) || 1e-6; return [a[0] / l, a[1] / l]; };
const perp = a => [-a[1], a[0]];
const dirDeg = d => [Math.cos(d * Math.PI / 180), Math.sin(d * Math.PI / 180)];
const f1 = n => Math.round(n * 10) / 10;
const pt = p => `${f1(p[0])},${f1(p[1])}`;

// 2 ruas: dari pangkal A ke ujung T, s = arah tekuk (+1 siku ke belakang, -1 lutut ke depan)
function ik(A, T, l1, l2, s) {
  const v = sub(T, A), u = unit(v);
  const d = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, vlen(v)));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  return add(add(A, mul(u, a)), mul(perp(u), s * h));
}

// ---------- pose (titik target) ----------
const BASE = {hip: [100, 107], neck: [100, 62], head: [101, 48], aN: [101, 176], aF: [98, 176], fN: 6, fF: 4};
const DEF = {
  stand: {...BASE, hN: [101, 113], hF: [98, 112]},
  takbir: {...BASE, hN: [121, 53], hF: [118, 54], palm: true},
  sedekap: {...BASE, hN: [112, 91], hF: [110, 93]},
  ruku: {hip: [86, 107], neck: [131, 107], head: [145, 110], aN: [88, 176], aF: [85, 176], fN: 6, fF: 4, hN: [95, 141], hF: [92, 142]},
  sujud: {hip: [84, 136], neck: [124, 155], head: [131, 168], aN: [48, 168], aF: [45, 168], fN: 105, fF: 105, hN: [127, 180], hF: [123, 180], flat: true},
  duduk: {hip: [91, 157], neck: [94, 112], head: [96, 98], aN: [88, 169], fN: 60, aF: [90, 176], fF: 178, hN: [116, 160], hF: [113, 161]},
  tawarruk: {hip: [88, 166], neck: [91, 121], head: [93, 107], aN: [89, 171], fN: 60, kF: [116, 178], aF: [100, 179], fF: 2, hN: [115, 165], hF: [112, 166], finger: true},
};
DEF.tasyahud = {...DEF.duduk, finger: true};
DEF.salamR = {...DEF.tawarruk, finger: false, look: 'right'};
DEF.salamL = {...DEF.tawarruk, finger: false, look: 'left'};

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
const P = Object.fromEntries(Object.entries(DEF).map(([k, v]) => [k, build(v)]));

export const POSE_NAMES = {
  stand: 'Berdiri', takbir: 'Takbiratul Ihram', sedekap: 'Bersedekap', ruku: 'Ruku', sujud: 'Sujud',
  duduk: 'Duduk di Antara Dua Sujud', tasyahud: 'Tasyahud Awal', tawarruk: 'Tasyahud Akhir', salamR: 'Salam ke Kanan', salamL: 'Salam ke Kiri',
};

// ---------- warna ----------
const SKIN = {base: '#E9B48E', shade: '#CC8F68', far: '#D9A27C', edge: '#A86E4C', cheek: '#EE8F7A', hair: '#2B211D', lip: '#B5655A'};
const C = {
  koko: '#3E9C8F', kokoFar: '#2F8074', kokoEdge: '#1F5C53', embro: '#F1E7C6',
  sarEdge: '#4E1F2B', peci: '#25232B', peciHi: '#4C4957',
  mk: 'url(#rs-mk)', mkEdge: '#ADA3D3', mkFold: '#D6CFEA', lace: '#E7A3BE',
};

// ---------- bentuk dasar ----------
// kapsul meruncing dari A (jari-jari rA) ke B (jari-jari rB)
function cap(A, B, rA, rB) {
  const u = unit(sub(B, A)), n = perp(u);
  const a1 = add(A, mul(n, rA)), b1 = add(B, mul(n, rB)), b2 = sub(B, mul(n, rB)), a2 = sub(A, mul(n, rA));
  return `M${pt(a1)}L${pt(b1)}A${rB},${rB} 0 0 0 ${pt(b2)}L${pt(a2)}A${rA},${rA} 0 0 0 ${pt(a1)}Z`;
}
// gabungan beberapa kapsul dengan satu garis tepi yang rapi
const solid = (d, fill, edge, w = 2.6) => `<path d="${d}" fill="${edge}" stroke="${edge}" stroke-width="${w}" stroke-linejoin="round"/><path d="${d}" fill="${fill}"/>`;

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

// ---------- bagian tubuh ----------
function foot(a, t, fill, edge) {
  const u = unit(sub(t, a)), n = perp(u), crease = sub(t, mul(u, 3.5));
  return solid(cap(a, t, 4.3, 3), fill, edge, 2) +
    `<path d="M${pt(crease)}l${f1(n[0] * 2.4)},${f1(n[1] * 2.4)}" stroke="${edge}" stroke-width="1" stroke-linecap="round" opacity=".55"/>`;
}

function hand(p, which, fill, edge) {
  const h = p['h' + which], e = p['e' + which], u = unit(sub(h, e)), n = perp(u);
  if (p.palm) {
    // telapak terbuka, jari ke atas, menghadap kiblat
    return solid(cap(add(h, [0, 3.5]), add(h, [0.6, -5.5]), 3.8, 3.2) + cap(add(h, [0.5, 1.5]), add(h, [4.2, -0.5]), 1.7, 1.5), fill, edge, 2) +
      `<path d="M${pt(add(h, [-1.2, -4]))}v3.2M${pt(add(h, [1, -4.3]))}v3.4" stroke="${edge}" stroke-width=".8" opacity=".5" stroke-linecap="round"/>`;
  }
  if (p.flat) {
    // telapak menempel lantai
    return solid(cap([h[0] - 4, FLOOR - 2.2], [h[0] + 5.5, FLOOR - 2], 2.6, 2.2), fill, edge, 2);
  }
  let d = cap(sub(h, mul(u, 1)), add(h, mul(u, 4)), 3.7, 3.2) + cap(h, add(add(h, mul(u, 2.5)), mul(n, -3.6)), 1.7, 1.5);
  if (p.finger && which === 'N') d += cap(add(h, mul(u, 3)), add(h, mul(u, 12)), 1.5, 1.3);
  return solid(d, fill, edge, 2);
}

function neckPart(p, fill, edge) {
  const ax = unit(sub(p.head, p.neck));
  return solid(cap(p.sh, sub(p.head, mul(ax, 7)), 4.8, 4.4), fill, edge, 2);
}

// kepala dalam koordinat lokal: depan = +x, atas = -y
const PROFILE = 'M-5,12.5C-12,9 -14,-4 -9,-10.5C-4,-15 7,-14.5 10.5,-8C11.8,-5.5 12,-3.5 12.2,-2C12.6,-1 14.6,1.4 14.6,2.2C14.6,3.2 13,3.4 12.2,3.6C12.8,5 12.6,6.2 12,7.2C12.2,8.5 11.4,10.5 9.5,11.5C6.5,13 3,13.2 1,13.6C-1,14 -3,13.5 -5,12.5Z';
const SIDE_FACE = `<path d="M6.1,-1.3Q7.7,-3 9.4,-1.5Q7.9,-0.1 6.1,-1.3Z" fill="#2A2833"/><circle cx="8.2" cy="-1.9" r=".55" fill="#fff"/>` +
  `<path d="M5.6,-4.7Q7.9,-6 10.2,-4.9" fill="none" stroke="${SKIN.hair}" stroke-width="1.3" stroke-linecap="round"/>` +
  `<path d="M10.4,7.5Q11.3,8.1 12,7.4" fill="none" stroke="${SKIN.lip}" stroke-width="1.2" stroke-linecap="round"/>` +
  `<circle cx="6.6" cy="4.4" r="2.6" fill="${SKIN.cheek}" opacity=".32"/>`;
const FRONT_FACE = `<ellipse cx="-4.2" cy="-0.6" rx="1.5" ry="1.9" fill="#2A2833"/><ellipse cx="4.2" cy="-0.6" rx="1.5" ry="1.9" fill="#2A2833"/>` +
  `<circle cx="-3.7" cy="-1.2" r=".5" fill="#fff"/><circle cx="4.7" cy="-1.2" r=".5" fill="#fff"/>` +
  `<path d="M-6.4,-4Q-4.2,-5.4 -2,-4.2M2,-4.2Q4.2,-5.4 6.4,-4" fill="none" stroke="${SKIN.hair}" stroke-width="1.2" stroke-linecap="round"/>` +
  `<path d="M-0.6,1.4Q0,3.6 1,3.4" fill="none" stroke="${SKIN.shade}" stroke-width="1" stroke-linecap="round"/>` +
  `<path d="M-3,6.6Q0,9 3,6.6" fill="none" stroke="${SKIN.lip}" stroke-width="1.3" stroke-linecap="round"/>` +
  `<circle cx="-6.2" cy="3.6" r="2.4" fill="${SKIN.cheek}" opacity=".32"/><circle cx="6.2" cy="3.6" r="2.4" fill="${SKIN.cheek}" opacity=".32"/>`;
const FACE_OVAL = 'M0,13.5C-7,13.5 -11.4,8 -11.4,0C-11.4,-8 -6.5,-13.4 0,-13.4C6.5,-13.4 11.4,-8 11.4,0C11.4,8 7,13.5 0,13.5Z';
const EARS = `<ellipse cx="-11.6" cy="1.6" rx="2.5" ry="3.5" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.2"/><ellipse cx="11.6" cy="1.6" rx="2.5" ry="3.5" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.2"/>`;

const headAngle = p => Math.atan2(p.head[1] - p.neck[1], p.head[0] - p.neck[0]) + Math.PI / 2;
const headXform = p => `translate(${pt(p.head)}) rotate(${f1(headAngle(p) * 180 / Math.PI)})`;
// titik global dari koordinat lokal kepala
function headPt(p, x, y) {
  const a = headAngle(p), c = Math.cos(a), s = Math.sin(a);
  return [p.head[0] + x * c - y * s, p.head[1] + x * s + y * c];
}

function headPutra(p) {
  const look = p.look || 'side';
  const peciSide = `<path d="M-11.8,-7C-4,-5.6 4,-5.6 10.8,-6.8L9.8,-16.8C3,-18.2 -4,-18.2 -10.6,-17Z" fill="${C.peci}"/><path d="M-9.6,-15.4C-3,-16.4 3,-16.4 8.6,-15.4" fill="none" stroke="${C.peciHi}" stroke-width="1"/>`;
  const peciFront = `<path d="M-11.6,-6.5C-4,-5 4,-5 11.6,-6.5L11,-16.6C4,-18 -4,-18 -11,-16.6Z" fill="${C.peci}"/><path d="M-9.6,-15C-3,-16 3,-16 9.6,-15" fill="none" stroke="${C.peciHi}" stroke-width="1"/>`;
  let g;
  if (look === 'right') {
    g = EARS + `<path d="${FACE_OVAL}" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.4"/>` +
      `<path d="M-11,-4C-11,-8 -10,-9 -8,-10L-8,-4.5ZM11,-4C11,-8 10,-9 8,-10L8,-4.5Z" fill="${SKIN.hair}"/>` + FRONT_FACE + peciFront;
  } else if (look === 'left') {
    g = EARS + `<path d="${FACE_OVAL}" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.4"/>` +
      `<path d="M-11.2,-2C-11.4,-9 -6,-13 0,-13C6,-13 11.4,-9 11.2,-2C10,4 6,7 0,7.5C-6,7 -10,4 -11.2,-2Z" fill="${SKIN.hair}"/>` + peciFront;
  } else {
    g = `<path d="${PROFILE}" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M-9,-10.4C-13,-6 -13.6,2 -10.2,6L-6.4,4.6C-8.4,0 -8,-5 -5,-8.6Z" fill="${SKIN.hair}"/>` +
      `<ellipse cx="-1.6" cy="1.6" rx="2.6" ry="3.7" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.2"/><path d="M-1.4,-0.4Q0,1.6 -1.6,3.4" fill="none" stroke="${SKIN.shade}" stroke-width="1"/>` +
      SIDE_FACE + peciSide;
  }
  return `<g transform="${headXform(p)}">${g}</g>`;
}

function headPutri(p) {
  const look = p.look || 'side';
  let g;
  if (look === 'right') {
    g = `<ellipse cx="0" cy="1" rx="9.4" ry="11" fill="${SKIN.base}" stroke="${C.lace}" stroke-width="2"/><g transform="translate(0,1.4) scale(.86)">${FRONT_FACE}</g>` +
      `<ellipse cx="0" cy="1" rx="10.8" ry="12.4" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="1.6 1.4"/>`;
  } else if (look === 'left') {
    g = `<path d="M-12,4C-9,9 9,9 12,4" fill="none" stroke="${C.mkFold}" stroke-width="1.4" stroke-linecap="round"/>`;
  } else {
    g = `<g clip-path="url(#rs-face)"><path d="${PROFILE}" fill="${SKIN.base}" stroke="${SKIN.edge}" stroke-width="1.4"/>${SIDE_FACE}</g>` +
      `<path d="M6,-10.5C-1,-10.5 -3.6,-4 -3.6,1.5C-3.6,7 -1,13.5 6,13.5" fill="none" stroke="${C.lace}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<path d="M6,-12.4C-3,-12.4 -5.6,-4 -5.6,1.5C-5.6,7 -3,15.4 6,15.4" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="1.6 1.4" stroke-linecap="round"/>`;
  }
  return `<g transform="${headXform(p)}">${g}</g>`;
}

function putra(p) {
  const wristN = sub(p.hN, mul(unit(sub(p.hN, p.eN)), 2.5)), wristF = sub(p.hF, mul(unit(sub(p.hF, p.eF)), 2.5));
  const spine = unit(sub(p.hip, p.neck)), front = [spine[1], -spine[0]];
  const hem = add(p.hip, mul(spine, 9));
  let g = '';
  // sisi jauh
  g += foot(p.aF, p.tF, SKIN.far, SKIN.edge);
  g += solid(cap(p.hip, p.kF, 10.5, 8.6) + cap(p.kF, p.aF, 8.6, 7.4), 'url(#rs-sarF)', C.sarEdge);
  g += solid(cap(p.sh, p.eF, 6, 5.2) + cap(p.eF, wristF, 5.2, 4.6), C.kokoFar, C.kokoEdge);
  g += hand(p, 'F', SKIN.far, SKIN.edge);
  // kaki dekat
  g += foot(p.aN, p.tN, SKIN.base, SKIN.edge);
  g += solid(cap(p.hip, p.kN, 10.5, 8.6) + cap(p.kN, p.aN, 8.6, 7.4), 'url(#rs-sar)', C.sarEdge);
  // leher, baju koko
  g += neckPart(p, SKIN.base, SKIN.edge);
  g += solid(cap(hem, p.sh, 14.5, 12.5), C.koko, C.kokoEdge);
  g += solid(cap(p.neck, add(p.neck, mul(spine, 3)), 5.6, 5.6), C.koko, C.kokoEdge, 2);
  const pl1 = add(add(p.sh, mul(front, 11)), mul(spine, -2)), pl2 = add(add(p.sh, mul(front, 12.5)), mul(spine, 20));
  g += `<path d="M${pt(pl1)}L${pt(pl2)}" stroke="${C.embro}" stroke-width="1.6" stroke-linecap="round"/>`;
  [0.3, 0.65, 1].forEach(k => { g += `<circle cx="${f1(pl1[0] + (pl2[0] - pl1[0]) * k)}" cy="${f1(pl1[1] + (pl2[1] - pl1[1]) * k)}" r="1.1" fill="${C.embro}" stroke="${C.kokoEdge}" stroke-width=".5"/>`; });
  g += `<path d="M${pt(add(add(hem, mul(front, -13)), mul(spine, 3)))}Q${pt(add(hem, mul(spine, 6)))} ${pt(add(add(hem, mul(front, 13)), mul(spine, 3)))}" fill="none" stroke="${C.kokoEdge}" stroke-width="1" opacity=".5"/>`;
  g += headPutra(p);
  // lengan dekat + manset
  g += solid(cap(p.sh, p.eN, 6, 5.2) + cap(p.eN, wristN, 5.2, 4.6), C.koko, C.kokoEdge);
  g += `<path d="M${pt(sub(wristN, mul(unit(sub(wristN, p.eN)), 3)))}L${pt(wristN)}" stroke="${C.embro}" stroke-width="5.4" opacity=".55"/>`;
  g += hand(p, 'N', SKIN.base, SKIN.edge);
  return g;
}

function putri(p) {
  const spine = unit(sub(p.hip, p.neck));
  const wristN = sub(p.hN, mul(unit(sub(p.hN, p.eN)), 3)), wristF = sub(p.hF, mul(unit(sub(p.hF, p.eF)), 3));
  let g = '';
  g += foot(p.aF, p.tF, SKIN.far, SKIN.edge);
  g += foot(p.aN, p.tN, SKIN.base, SKIN.edge);
  // bawahan mukena (rok panjang, melebar di bawah)
  const flare = a => [[a[0] - 12, Math.min(FLOOR - 1, a[1] + 3)], [a[0] + 11, Math.min(FLOOR - 1, a[1] + 3)]];
  const skirtPts = [...ring(p.hip, 12), ...ring(p.kN, 10.5), ...ring(p.kF, 10.5), ...ring(p.aN, 8), ...ring(p.aF, 8), ...flare(p.aN), ...flare(p.aF)];
  g += solid(hull(skirtPts), C.mk, C.mkEdge, 2.4);
  g += `<path d="M${pt(add(p.hip, [3, 6]))}Q${pt(add(p.kN, [-2, 0]))} ${pt(add(p.aN, [-3, 0]))}" fill="none" stroke="${C.mkFold}" stroke-width="1.3" stroke-linecap="round"/>`;
  // atasan mukena: menutup kepala, lengan, sampai paha
  const hood = Array.from({length: 12}, (_, i) => { const t = i * Math.PI / 6; return headPt(p, -3.5 + Math.cos(t) * 15.5, 0.5 + Math.sin(t) * 16.5); });
  const thighDir = unit(sub(p.kN, p.hip));
  const capePts = [...hood, ...ring(p.sh, 11), ...ring(p.eN, 7.5, 8), ...ring(p.eF, 7.5, 8), ...ring(wristN, 6, 8), ...ring(wristF, 6, 8),
    ...ring(p.hip, 13), ...ring(add(p.hip, mul(thighDir, 15)), 10)];
  g += solid(hull(capePts), C.mk, C.mkEdge, 2.4);
  g += `<path d="M${pt(p.sh)}Q${pt(add(p.eN, mul(spine, 4)))} ${pt(wristN)}M${pt(add(p.sh, mul(spine, 6)))}L${pt(add(p.hip, mul(thighDir, 12)))}" fill="none" stroke="${C.mkFold}" stroke-width="1.3" stroke-linecap="round"/>`;
  g += headPutri(p);
  g += hand(p, 'F', SKIN.far, SKIN.edge);
  g += hand(p, 'N', SKIN.base, SKIN.edge);
  return g;
}

const DEFS = `<defs>
  <pattern id="rs-sar" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#7E3646"/><rect width="10" height="3.2" fill="#9C4859"/><rect width="3.2" height="10" fill="#9C4859" opacity=".75"/><rect y="6.4" width="10" height=".8" fill="#E2B64E" opacity=".85"/><rect x="6.4" width=".8" height="10" fill="#E2B64E" opacity=".7"/></pattern>
  <pattern id="rs-sarF" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#682B39"/><rect width="10" height="3.2" fill="#803A49"/><rect width="3.2" height="10" fill="#803A49" opacity=".75"/><rect y="6.4" width="10" height=".8" fill="#B8913E" opacity=".7"/></pattern>
  <linearGradient id="rs-mk" x1="0" y1="35" x2="0" y2="185" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4DEF3"/></linearGradient>
  <clipPath id="rs-face"><ellipse cx="6" cy="1.5" rx="9.6" ry="12"/></clipPath>
</defs>`;

const MAT = `<ellipse cx="102" cy="187" rx="78" ry="5" fill="rgba(42,40,51,.10)"/>` +
  `<path d="M30,177L176,177L183,187L23,187Z" fill="#B23A48"/>` +
  `<path d="M36,178.6L170,178.6L175.6,185.4L30.4,185.4Z" fill="none" stroke="#F0C35A" stroke-width="1.1"/>` +
  `<path d="M44,182H158" stroke="#7E2433" stroke-width="2.2" stroke-dasharray="3 4"/>` +
  `<path d="M158,185.4V181.6Q164,177.8 170,181.6V185.4" fill="none" stroke="#F0C35A" stroke-width="1.1"/>` +
  `<path d="M23,187l-3,2.4M26,187l-3,2.4M183,187l3,2.4M180,187l3,2.4" stroke="#E9D8B4" stroke-width="1"/>`;

function render(p, gender) {
  const shadow = `<ellipse cx="${f1((p.hip[0] + p.aN[0]) / 2 + 6)}" cy="184" rx="34" ry="3.2" fill="rgba(42,40,51,.14)"/>`;
  return shadow + (gender === 'putri' ? putri(p) : putra(p));
}

export function poseSVG(pose, gender = 'putra', {mat = true, cls = '', label = ''} = {}) {
  const p = typeof pose === 'string' ? P[pose] : pose;
  return `<svg class="fig ${cls}" viewBox="14 22 182 172" role="img" aria-label="${label || POSE_NAMES[pose] || 'Gerakan shalat'}">${DEFS}${mat ? MAT : ''}${render(p, gender)}</svg>`;
}

// Animasi berpindah pose di dalam elemen wadah.
const anim = new WeakMap();
export function animateTo(el, pose, gender, opts = {}) {
  const to = P[pose];
  const prev = anim.get(el);
  const from = prev?.cur || to;
  if (prev?.raf) cancelAnimationFrame(prev.raf);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dur = reduce ? 0 : (opts.duration ?? 700);
  const state = {cur: from, raf: 0};
  anim.set(el, state);
  const t0 = performance.now();
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const step = now => {
    const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = ease(k);
    const cur = {};
    for (const key of new Set([...Object.keys(from), ...Object.keys(to)])) {
      const a = from[key], b = to[key];
      if (Array.isArray(a) && Array.isArray(b)) cur[key] = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e];
      else if (typeof a === 'number' && typeof b === 'number') cur[key] = a + (b - a) * e;
      else cur[key] = k < .5 ? a : b;
    }
    state.cur = cur;
    el.innerHTML = poseSVG(cur, gender, {label: POSE_NAMES[pose]});
    if (k < 1) state.raf = requestAnimationFrame(step);
    else state.cur = to;
  };
  state.raf = requestAnimationFrame(step);
  if (!dur) step(t0 + 1);
}
