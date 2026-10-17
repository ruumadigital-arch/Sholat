# Memasang rekaman suara hasil ekspor Studio Rekam ke aplikasi, supaya dipakai semua pengguna.
# Jalankan:  powershell -ExecutionPolicy Bypass -File tools\pasang-rekaman.ps1 "C:\path\rekaman-ruma-shalat-2026-10-17.zip"
param([Parameter(Mandatory = $true)][string]$Zip)

$root  = Split-Path $PSScriptRoot -Parent
$audio = Join-Path $root 'public\audio'
$list  = Join-Path $audio 'daftar.json'
$tmp   = Join-Path $env:TEMP ('ruma-rekaman-' + [guid]::NewGuid())

Expand-Archive -LiteralPath $Zip -DestinationPath $tmp
try {
  $new = Get-Content (Join-Path $tmp 'daftar.json') -Raw -Encoding UTF8 | ConvertFrom-Json
  $cur = [ordered]@{}
  if (Test-Path $list) {
    (Get-Content $list -Raw -Encoding UTF8 | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $cur[$_.Name] = $_.Value }
  }
  $n = 0
  foreach ($p in $new.PSObject.Properties) {
    $src = Join-Path $tmp $p.Value
    if (-not (Test-Path $src)) { Write-Warning "File $($p.Value) tidak ada di zip, dilewati."; continue }
    # hapus file lama bila rekaman yang sama sebelumnya berformat lain
    if ($cur.Contains($p.Name) -and $cur[$p.Name] -ne $p.Value) { Remove-Item (Join-Path $audio $cur[$p.Name]) -ErrorAction SilentlyContinue }
    Copy-Item $src (Join-Path $audio $p.Value) -Force
    $cur[$p.Name] = $p.Value
    $n++
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
  "$n rekaman dipasang. Total suara terpasang: $($cur.Count)."
} finally {
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
