# Server alat Olah Suara (hanya untuk laptop sendiri).
# Jalankan:  powershell -ExecutionPolicy Bypass -File tools\olah-suara\server.ps1 -Masuk "C:\...\Rekaman 1" -Keluar "C:\...\Rekaman 1 olahan"
# lalu buka http://localhost:8090
param(
  [Parameter(Mandatory = $true)][string]$Masuk,
  [Parameter(Mandatory = $true)][string]$Keluar,
  [int]$Port = 8090
)
$alat = $PSScriptRoot
$app  = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) 'public'
New-Item -ItemType Directory -Force $Keluar | Out-Null
$mime = @{'.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.json'='application/json; charset=utf-8'; '.mp3'='audio/mpeg'}
$audioExt = '.m4a', '.mp4', '.mpeg', '.mp3', '.aac', '.wav', '.ogg', '.opus', '.webm'

$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Olah Suara berjalan di http://localhost:$Port"

function Send($c, [byte[]]$b, $type) {
  $c.Response.ContentType = $type
  $c.Response.Headers.Add('Cache-Control', 'no-store')
  $c.Response.OutputStream.Write($b, 0, $b.Length)
}
function SafeFile($dir, $name) {
  if ($name -notmatch '^[\w .()-]+$') { return $null }
  $f = [IO.Path]::GetFullPath((Join-Path $dir $name))
  if (-not $f.StartsWith([IO.Path]::GetFullPath($dir))) { return $null }
  return $f
}

while ($l.IsListening) {
  $c = $l.GetContext()
  try {
    $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath)
    if ($p -eq '/daftar') {
      $files = Get-ChildItem -LiteralPath $Masuk -File | Where-Object { $audioExt -contains $_.Extension.ToLower() } |
        Sort-Object { [regex]::Replace($_.Name, '\d+', { $args[0].Value.PadLeft(10, '0') }) } |
        ForEach-Object { @{ name = $_.Name; size = $_.Length } }
      Send $c ([Text.Encoding]::UTF8.GetBytes((ConvertTo-Json @($files) -Compress))) 'application/json; charset=utf-8'
    } elseif ($p.StartsWith('/mentah/')) {
      $f = SafeFile $Masuk $p.Substring(8)
      if ($f -and (Test-Path -LiteralPath $f)) { Send $c ([IO.File]::ReadAllBytes($f)) 'audio/mp4' } else { $c.Response.StatusCode = 404 }
    } elseif ($p.StartsWith('/hasil/')) {
      $f = SafeFile $Keluar $p.Substring(7)
      if ($c.Request.HttpMethod -eq 'POST' -and $f) {
        $fs = [IO.File]::Create($f); $c.Request.InputStream.CopyTo($fs); $fs.Close()
        Send $c ([Text.Encoding]::UTF8.GetBytes('ok')) 'text/plain'
      } elseif ($f -and (Test-Path -LiteralPath $f)) { Send $c ([IO.File]::ReadAllBytes($f)) 'audio/mpeg' } else { $c.Response.StatusCode = 404 }
    } else {
      # /app/... = file aplikasi RuMa Shalat, selain itu = file alat ini
      if ($p.StartsWith('/app/')) { $root = $app; $rel = $p.Substring(5) } else { $root = $alat; $rel = $p.TrimStart('/') }
      if ($rel -eq '') { $rel = 'index.html' }
      $f = [IO.Path]::GetFullPath((Join-Path $root $rel))
      if ($f.StartsWith([IO.Path]::GetFullPath($root)) -and (Test-Path -LiteralPath $f -PathType Leaf)) {
        $ext = [IO.Path]::GetExtension($f)
        Send $c ([IO.File]::ReadAllBytes($f)) $(if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' })
      } else { $c.Response.StatusCode = 404 }
    }
  } catch { $c.Response.StatusCode = 500 }
  $c.Response.Close()
}
