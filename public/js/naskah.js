// Daftar naskah rekaman suara Ayah/Bunda, bernomor A01.. (bacaan Arab) dan K01.. (soal kuis).
// Dipakai Studio Rekam, dan disalin ke tools/naskah.json untuk skrip tools/pasang-rekaman-hp.ps1.
// Bacaan yang lafaznya sama cukup direkam sekali (lihat ALIAS).
import {R, DOA, QUIZ, quizKey, ALIAS} from './content.js';

const GROUPS = [
  ['Bacaan shalat', ['takbir', 'iftitah', 'taawudz', 'aamiin', 'ruku', 'itidal1', 'itidal2', 'qunut', 'sujud', 'duduk', 'tasyahud', 'shalawat_awal', 'shalawat_ibrahim', 'doa_akhir', 'salam', 'sujud_sahwi', 'takbir_id']],
  ['Niat shalat', Object.keys(R).filter(k => k.startsWith('niat_') && !['niat_wudhu', 'niat_tayamum'].includes(k))],
  ['Wudhu & tayamum', ['basmalah', 'niat_wudhu', 'doa_wudhu', 'niat_tayamum']],
  ['Dzikir', ['istighfar', 'antassalam', 'tasbih', 'tahmid', 'tahlil']],
  ['Doa harian', DOA.map(d => d.id).filter(id => !(id in ALIAS))],
];
const LEVEL = {1: 'Mudah', 2: 'Sedang', 3: 'Sulit'};
const pad = n => String(n).padStart(2, '0');

export function naskahItems(set) {
  if (set === 'bacaan') {
    return GROUPS.flatMap(([group, ids]) => ids.map(key => ({key, group, t: R[key].t, r: R[key]})))
      .map((it, i) => ({...it, no: 'A' + pad(i + 1)}));
  }
  const seen = new Set(), out = [];
  for (const q of QUIZ) {
    const key = quizKey(q);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({key, group: 'Kuis ' + LEVEL[q.lv], t: q.q, q, no: 'K' + pad(out.length + 1)});
  }
  return out;
}
