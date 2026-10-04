// Penyimpanan progres anak di perangkat (localStorage), aman bila storage diblokir.
import {BADGES} from './content.js';

const KEY = 'ruma-shalat-v1';
const DEF = {
  name: '', gender: 'putra', reciter: 'Alafasy_128kbps', muted: false, rate: 0.8,
  city: 'Jakarta', geo: null, latin: true, arti: true,
  stars: 0, badges: {}, seen: {}, quiz: {}, kilat: 0, check: {}, practiced: {}, notif: false,
};

function load() {
  try { return {...DEF, ...JSON.parse(localStorage.getItem(KEY) || '{}')}; } catch { return {...DEF}; }
}
export const S = load();
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }

export const bus = new EventTarget();
const emit = (type, detail) => bus.dispatchEvent(new CustomEvent(type, {detail}));

export function addStars(n) {
  if (!n) return;
  S.stars = Math.max(0, S.stars + n);
  save(); emit('stars', S.stars);
  if (S.stars >= 50) award('bintang50');
  if (S.stars >= 150) award('bintang150');
  if (S.stars >= 300) award('bintang300');
}

export function award(k) {
  if (S.badges[k]) return false;
  S.badges[k] = Date.now();
  save(); emit('badge', BADGES.find(b => b.k === k));
  return true;
}

// sekali seumur progres: kembalikan true jika baru pertama kali
export function once(key) {
  if (S.seen[key]) return false;
  S.seen[key] = 1; save();
  return true;
}

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function streak() {
  let n = 0;
  const d = new Date();
  // hari ini belum lengkap tidak memutus rangkaian
  if (!isFull(dayKey(d))) d.setDate(d.getDate() - 1);
  while (isFull(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
export const isFull = k => Object.values(S.check[k] || {}).filter(Boolean).length >= 5;

export function resetAll() {
  const keep = {name: S.name, gender: S.gender, reciter: S.reciter, city: S.city, geo: S.geo, rate: S.rate};
  Object.keys(S).forEach(k => delete S[k]);
  Object.assign(S, {...DEF, ...keep});
  save(); emit('stars', S.stars);
}
