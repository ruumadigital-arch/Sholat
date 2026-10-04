# Membuat public/js/quran.js dari teks Tanzil (quran-simple) + terjemahan Kemenag (id.indonesian)
# yang diambil dari api.alquran.cloud, digabung dengan transliterasi latin di tools/latin.txt.
# Jalankan:  powershell -ExecutionPolicy Bypass -File tools\build-quran.ps1
# Tambah -Fetch untuk mengunduh ulang teks dari API.
param([switch]$Fetch)

$root = Split-Path $PSScriptRoot -Parent
$src  = Join-Path $PSScriptRoot 'quran-src'
New-Item -ItemType Directory -Force $src | Out-Null

$surahs = @(
  @{n=1;   key='fatihah';  nama='Al-Fatihah';  ar='الفاتحة';  arti='Pembukaan';                 pesan='Induk Al-Qur''an. Wajib dibaca di setiap rakaat shalat.'},
  @{n=103; key='ashr';     nama="Al-'Ashr";    ar='العصر';    arti='Masa / Waktu';              pesan='Jangan sia-siakan waktu. Isi dengan iman, amal baik, dan saling menasihati.'},
  @{n=105; key='fil';      nama='Al-Fil';      ar='الفيل';    arti='Gajah';                     pesan='Allah melindungi Ka''bah dari pasukan bergajah dengan burung Ababil.'},
  @{n=106; key='quraisy';  nama='Quraisy';     ar='قريش';     arti='Suku Quraisy';              pesan='Bersyukurlah kepada Allah yang memberi makan dan rasa aman.'},
  @{n=107; key='maun';     nama="Al-Ma'un";    ar='الماعون';  arti='Barang yang Berguna';       pesan='Sayangi anak yatim, bantu orang miskin, dan jangan lalai dalam shalat.'},
  @{n=108; key='kautsar';  nama='Al-Kautsar';  ar='الكوثر';   arti='Nikmat yang Banyak';        pesan='Allah memberi nikmat yang banyak, maka shalat dan berkurbanlah.'},
  @{n=109; key='kafirun';  nama='Al-Kafirun';  ar='الكافرون'; arti='Orang-orang Kafir';         pesan='Untukmu agamamu, untukku agamaku. Kita teguh beribadah hanya kepada Allah.'},
  @{n=110; key='nashr';    nama='An-Nashr';    ar='النصر';    arti='Pertolongan';               pesan='Saat mendapat pertolongan dan kemenangan, bertasbih dan beristighfarlah.'},
  @{n=111; key='lahab';    nama='Al-Lahab';    ar='المسد';    arti='Gejolak Api';               pesan='Kisah Abu Lahab yang memusuhi Nabi. Kita harus menyayangi dan membela Nabi.'},
  @{n=112; key='ikhlas';   nama='Al-Ikhlas';   ar='الإخلاص';  arti='Memurnikan Keesaan Allah';  pesan='Allah itu Maha Esa dan tidak ada satu pun yang setara dengan-Nya.'},
  @{n=113; key='falaq';    nama='Al-Falaq';    ar='الفلق';    arti='Waktu Subuh';               pesan='Kita berlindung kepada Allah dari segala kejahatan.'},
  @{n=114; key='nas';      nama='An-Nas';      ar='الناس';    arti='Manusia';                   pesan='Kita berlindung kepada Allah dari bisikan jahat setan.'}
)

function Get-Json($name, $url) {
  $f = Join-Path $src $name
  if ($Fetch -or -not (Test-Path $f)) { curl.exe -s -o $f $url }
  return (Get-Content $f -Raw -Encoding UTF8) | ConvertFrom-Json
}
function Q($s) { '"' + (($s -replace '\\','\\') -replace '"','\"') + '"' }

$latin = @{}
Get-Content (Join-Path $PSScriptRoot 'latin.txt') -Encoding UTF8 | Where-Object { $_ -match '\|' } | ForEach-Object {
  $k, $v = $_ -split '\|', 2; $latin[$k.Trim()] = $v.Trim()
}

$basmalah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ '
$out = New-Object System.Collections.Generic.List[string]
$out.Add('// File ini dibuat otomatis oleh tools/build-quran.ps1 — jangan diedit manual.')
$out.Add('// Teks Arab: Tanzil (quran-simple), terjemahan: Kementerian Agama RI, via api.alquran.cloud.')
$out.Add('export const SURAH = [')
foreach ($s in $surahs) {
  $j = Get-Json "s$($s.n).json" "https://api.alquran.cloud/v1/surah/$($s.n)/editions/quran-simple,id.indonesian"
  $ar = $j.data[0].ayahs; $tr = $j.data[1].ayahs
  $ay = @()
  for ($i = 0; $i -lt $ar.Count; $i++) {
    $t = $ar[$i].text.Trim([char]0xFEFF).Trim()
    if ($s.n -ne 1 -and $i -eq 0 -and $t.StartsWith($basmalah)) { $t = $t.Substring($basmalah.Length) }
    $no = $ar[$i].numberInSurah
    $lat = $latin["$($s.n):$no"]
    if (-not $lat) { throw "Latin belum ada untuk $($s.n):$no" }
    $ay += "    {ar:$(Q $t),lat:$(Q $lat),id:$(Q $tr[$i].text)}"
  }
  $out.Add("  {n:$($s.n),key:$(Q $s.key),nama:$(Q $s.nama),ar:$(Q $s.ar),arti:$(Q $s.arti),pesan:$(Q $s.pesan),ayat:[")
  $out.Add(($ay -join ",`n"))
  $out.Add('  ]},')
}
$out.Add('];')

$k = Get-Json 'a2_255.json' 'https://api.alquran.cloud/v1/ayah/2:255/editions/quran-simple,id.indonesian'
$out.Add("export const AYAT_KURSI = {s:2,a:255,ar:$(Q $k.data[0].text.Trim()),lat:$(Q $latin['2:255']),id:$(Q $k.data[1].text)};")

$dest = Join-Path $root 'public\js\quran.js'
[System.IO.File]::WriteAllLines($dest, $out, (New-Object System.Text.UTF8Encoding($false)))
"OK -> $dest"
