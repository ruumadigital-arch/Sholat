# Memasang rekaman dari aplikasi perekam suara HP ke RuMa Shalat.
#
# Cara pakai (lihat juga halaman Naskah Rekaman):
#   1. Salin file rekaman dari HP ke satu folder di laptop, misalnya C:\Users\ASUS\Downloads\rekaman-A
#   2. Cek dulu pasangan nomor dan file (belum memasang apa pun):
#        powershell -ExecutionPolicy Bypass -File tools\pasang-rekaman-hp.ps1 -Folder "C:\Users\ASUS\Downloads\rekaman-A" -Bagian A -Coba
#   3. Kalau sudah benar, jalankan lagi tanpa -Coba.
#
# Pencocokan:
#   - File yang namanya diawali nomor naskah (mis. "A05.m4a", "K12 shalat isya.m4a") dipasang ke nomor itu.
#   - File lain diurutkan menurut nama (urutan rekaman di HP) dan dipasang berurutan mulai dari nomor -Mulai.
param(
  [Parameter(Mandatory = $true)][string]$Folder,
  [ValidateSet('A', 'K')][string]$Bagian = 'A',
  [int]$Mulai = 1,
  [switch]$Coba
)

$root  = Split-Path $PSScriptRoot -Parent
$audio = Join-Path $root 'public\audio'
$list  = Join-Path $audio 'daftar.json'

$naskah = Get-Content (Join-Path $PSScriptRoot 'naskah.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$items = [ordered]@{}
$naskah.PSObject.Properties | Where-Object { $_.Name -like "$Bagian*" } | ForEach-Object { $items[$_.Name] = $_.Value }
$nomor = @($items.Keys)

$ok    = '.m4a', '.mp3', '.aac', '.wav', '.ogg', '.opus', '.webm'
$tolak = '.amr', '.3gp', '.3ga'
$files = Get-ChildItem -LiteralPath $Folder -File | Where-Object { ($ok + $tolak) -contains $_.Extension.ToLower() }
$bad = $files | Where-Object { $tolak -contains $_.Extension.ToLower() }
if ($bad) {
  Write-Warning ("Format ini tidak bisa diputar di browser: " + (($bad | ForEach-Object Name) -join ', ') + ". Ubah pengaturan perekam HP ke M4A/MP3 lalu rekam ulang.")
  $files = $files | Where-Object { $ok -contains $_.Extension.ToLower() }
}
if (-not $files) { throw "Tidak ada file rekaman di $Folder" }

# urut alami: "Rekaman 2" sebelum "Rekaman 10"
$sorted = $files | Sort-Object { [regex]::Replace($_.Name, '\d+', { $args[0].Value.PadLeft(10, '0') }) }

$map = [ordered]@{}
$sisa = @()
foreach ($f in $sorted) {
  if ($f.BaseName -match "^(?i)$Bagian\s*0*(\d{1,3})(\D|$)") {
    $no = $Bagian.ToUpper() + ([int]$Matches[1]).ToString('00')
    if (-not $items.Contains($no)) { Write-Warning "$($f.Name): nomor $no tidak ada di naskah, dilewati."; continue }
    $map[$no] = $f
  } else { $sisa += $f }
}
$i = $Mulai - 1
foreach ($f in $sisa) {
  while ($i -lt $nomor.Count -and $map.Contains($nomor[$i])) { $i++ }
  if ($i -ge $nomor.Count) { throw "File lebih banyak daripada naskah yang tersisa (mulai dari $Bagian$('{0:00}' -f $Mulai)). Hapus rekaman yang gagal dulu." }
  $map[$nomor[$i]] = $f
  $i++
}

""
"Pasangan nomor naskah dan file:"
$map.Keys | Sort-Object | ForEach-Object {
  [pscustomobject]@{ Nomor = $_; Naskah = $items[$_][1]; File = $map[$_].Name }
} | Format-Table -AutoSize | Out-String -Width 200
$belum = $nomor | Where-Object { -not $map.Contains($_) }
if ($belum) { "Belum ada rekaman untuk: " + ($belum -join ', ') }

if ($Coba) { ""; "Mode coba: belum ada yang dipasang. Jalankan lagi tanpa -Coba kalau pasangannya sudah benar."; return }

$cur = [ordered]@{}
if (Test-Path $list) {
  (Get-Content $list -Raw -Encoding UTF8 | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $cur[$_.Name] = $_.Value }
}
foreach ($no in $map.Keys) {
  $key = $items[$no][0]
  $name = $key + $map[$no].Extension.ToLower()
  if ($cur.Contains($key) -and $cur[$key] -ne $name) { Remove-Item (Join-Path $audio $cur[$key]) -ErrorAction SilentlyContinue }
  Copy-Item -LiteralPath $map[$no].FullName -Destination (Join-Path $audio $name) -Force
  $cur[$key] = $name
}
$lines = $cur.Keys | Sort-Object | ForEach-Object { '  "' + $_ + '": "' + $cur[$_] + '"' }
[IO.File]::WriteAllText($list, "{`n" + ($lines -join ",`n") + "`n}`n", (New-Object Text.UTF8Encoding($false)))

# naikkan versi cache agar HP pengguna mengambil daftar suara terbaru
$sw = Join-Path $root 'public\sw.js'
$js = [IO.File]::ReadAllText($sw)
if ($js -match "ruma-shalat-v(\d+)") {
  $js = $js -replace "ruma-shalat-v\d+", ("ruma-shalat-v" + ([int]$Matches[1] + 1))
  [IO.File]::WriteAllText($sw, $js, (New-Object Text.UTF8Encoding($false)))
}
""
"$($map.Count) rekaman dipasang. Total suara terpasang: $($cur.Count)."
