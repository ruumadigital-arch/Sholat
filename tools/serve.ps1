# Server lokal sederhana untuk mencoba aplikasi:  powershell -ExecutionPolicy Bypass -File tools\serve.ps1
# lalu buka http://localhost:8080
param([int]$Port = 8080)
$root = Join-Path (Split-Path $PSScriptRoot -Parent) 'public'
$mime = @{'.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.json'='application/json; charset=utf-8';
  '.webmanifest'='application/manifest+json'; '.png'='image/png'; '.svg'='image/svg+xml'; '.mp3'='audio/mpeg'; '.m4a'='audio/mp4'; '.txt'='text/plain; charset=utf-8'}
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "RuMa Shalat berjalan di http://localhost:$Port"
while ($l.IsListening) {
  $c = $l.GetContext()
  try {
    $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath)
    if ($p.EndsWith('/')) { $p += 'index.html' }
    $f = [IO.Path]::GetFullPath((Join-Path $root $p.TrimStart('/')))
    if ($f.StartsWith($root) -and (Test-Path $f -PathType Leaf)) {
      $b = [IO.File]::ReadAllBytes($f); $ext = [IO.Path]::GetExtension($f)
      $c.Response.ContentType = $(if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' })
      $c.Response.Headers.Add('Cache-Control', 'no-cache')
      $c.Response.OutputStream.Write($b, 0, $b.Length)
    } else { $c.Response.StatusCode = 404 }
  } catch { $c.Response.StatusCode = 500 }
  $c.Response.Close()
}
