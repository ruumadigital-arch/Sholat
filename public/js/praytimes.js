// Perhitungan jadwal shalat (algoritma astronomi PrayTimes) dengan kriteria Kemenag RI:
// Subuh: matahari -20°, Isya: -18°, Ashar: bayangan 1× (Syafi'i), ihtiyat +2 menit, Imsak = Subuh - 10 menit.

const D = Math.PI / 180;
const sin = d => Math.sin(d * D), cos = d => Math.cos(d * D), tan = d => Math.tan(d * D);
const asin = x => Math.asin(x) / D, acos = x => Math.acos(Math.max(-1, Math.min(1, x))) / D;
const atan2 = (y, x) => Math.atan2(y, x) / D, acot = x => Math.atan(1 / x) / D;
const fix = (a, b) => { a -= b * Math.floor(a / b); return a < 0 ? a + b : a; };

function julian(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}
function sun(jd) {
  const n = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * n, 360), q = fix(280.459 + 0.98564736 * n, 360);
  const L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360), e = 23.439 - 0.00000036 * n;
  const RA = fix(atan2(cos(e) * sin(L), cos(L)) / 15, 24);
  return {decl: asin(sin(e) * sin(L)), eqt: q / 15 - RA};
}

export function computeTimes(date, lat, lng, tz) {
  const jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lng / (15 * 24);
  const mid = t => fix(12 - sun(jd + t).eqt, 24);
  const at = (angle, t, ccw) => {
    const {decl} = sun(jd + t);
    const v = acos((-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat))) / 15;
    return mid(t) + (ccw ? -v : v);
  };
  const asr = t => { const {decl} = sun(jd + t); return at(-acot(1 + tan(Math.abs(lat - decl))), t); };
  let T = {subuh: 5, terbit: 6, dzuhur: 12, ashar: 13, maghrib: 18, isya: 18};
  for (let i = 0; i < 2; i++) {
    const f = k => T[k] / 24;
    T = {subuh: at(20, f('subuh'), true), terbit: at(0.833, f('terbit'), true), dzuhur: mid(f('dzuhur')),
         ashar: asr(f('ashar')), maghrib: at(0.833, f('maghrib')), isya: at(18, f('isya'))};
  }
  const adj = tz - lng / 15, ih = 2 / 60;
  const h = {
    subuh: T.subuh + adj + ih, terbit: T.terbit + adj - ih, dzuhur: T.dzuhur + adj + ih,
    ashar: T.ashar + adj + ih, maghrib: T.maghrib + adj + ih, isya: T.isya + adj + ih,
  };
  h.imsak = h.subuh - 10 / 60;
  h.dhuha = h.terbit + 20 / 60;
  // ubah ke objek Date (waktu lokal kota tsb. dinyatakan dalam menit sejak tengah malam)
  const out = {};
  for (const k in h) {
    const mins = Math.ceil(fix(h[k], 24) * 60 - 1e-6);
    out[k] = {mins, text: `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`};
  }
  return out;
}

export function qibla(lat, lng) {
  const kLat = 21.4225, kLng = 39.8262;
  const b = atan2(sin(kLng - lng), cos(lat) * tan(kLat) - sin(lat) * cos(kLng - lng));
  return fix(b, 360);
}

export const ORDER = ['imsak', 'subuh', 'terbit', 'dhuha', 'dzuhur', 'ashar', 'maghrib', 'isya'];
export const LABEL = {imsak: 'Imsak', subuh: 'Subuh', terbit: 'Terbit', dhuha: 'Dhuha', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya'};
export const WAJIB_KEYS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

// [nama, lintang, bujur, zona (jam dari UTC)]
export const CITIES = [
  ['Banda Aceh', 5.5483, 95.3238, 7], ['Medan', 3.5952, 98.6722, 7], ['Padang', -0.9471, 100.4172, 7], ['Pekanbaru', 0.5071, 101.4478, 7],
  ['Batam', 1.0456, 104.0305, 7], ['Jambi', -1.6101, 103.6131, 7], ['Palembang', -2.9761, 104.7754, 7], ['Bengkulu', -3.7928, 102.2608, 7],
  ['Bandar Lampung', -5.3971, 105.2668, 7], ['Pangkalpinang', -2.1291, 106.1090, 7], ['Serang', -6.1200, 106.1503, 7], ['Tangerang', -6.1783, 106.6319, 7],
  ['Jakarta', -6.2088, 106.8456, 7], ['Depok', -6.4025, 106.7942, 7], ['Bogor', -6.5971, 106.8060, 7], ['Bekasi', -6.2383, 106.9756, 7],
  ['Bandung', -6.9175, 107.6191, 7], ['Cirebon', -6.7320, 108.5523, 7], ['Tasikmalaya', -7.3274, 108.2207, 7], ['Purwokerto', -7.4245, 109.2396, 7],
  ['Semarang', -6.9667, 110.4167, 7], ['Yogyakarta', -7.7956, 110.3695, 7], ['Surakarta', -7.5755, 110.8243, 7], ['Kediri', -7.8480, 112.0178, 7],
  ['Malang', -7.9666, 112.6326, 7], ['Surabaya', -7.2575, 112.7521, 7], ['Jember', -8.1845, 113.6681, 7], ['Pontianak', -0.0263, 109.3425, 7],
  ['Palangka Raya', -2.2161, 113.9135, 7],
  ['Denpasar', -8.6705, 115.2126, 8], ['Mataram', -8.5833, 116.1167, 8], ['Kupang', -10.1772, 123.6070, 8], ['Banjarmasin', -3.3186, 114.5944, 8],
  ['Balikpapan', -1.2379, 116.8529, 8], ['Samarinda', -0.5022, 117.1536, 8], ['Tarakan', 3.3274, 117.5785, 8], ['Makassar', -5.1477, 119.4327, 8],
  ['Mamuju', -2.6748, 118.8885, 8], ['Palu', -0.8917, 119.8707, 8], ['Kendari', -3.9985, 122.5130, 8], ['Gorontalo', 0.5435, 123.0568, 8],
  ['Manado', 1.4748, 124.8421, 8],
  ['Ambon', -3.6954, 128.1814, 9], ['Ternate', 0.7893, 127.3813, 9], ['Sorong', -0.8762, 131.2558, 9], ['Manokwari', -0.8615, 134.0620, 9],
  ['Timika', -4.5468, 136.8883, 9], ['Jayapura', -2.5337, 140.7181, 9], ['Merauke', -8.4932, 140.4018, 9],
];
