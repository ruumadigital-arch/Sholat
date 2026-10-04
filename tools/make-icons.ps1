# Membuat ikon PNG aplikasi (192, 512, maskable) dari gambar maskot RuMa, memakai System.Drawing bawaan Windows.
# Jalankan:  powershell -ExecutionPolicy Bypass -File tools\make-icons.ps1
Add-Type -AssemblyName System.Drawing
$out = Join-Path (Split-Path $PSScriptRoot -Parent) 'public\icons'

function C($hex, $a = 255) { $c = [System.Drawing.ColorTranslator]::FromHtml($hex); [System.Drawing.Color]::FromArgb($a, $c) }

function Draw-Icon([int]$size, [string]$file, [double]$pad, [bool]$round) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'; $g.Clear([System.Drawing.Color]::Transparent)
  $bg = New-Object System.Drawing.SolidBrush (C '#FFF6E6')
  if ($round) {
    $r = $size * 0.22; $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $p.AddArc(0, 0, 2*$r, 2*$r, 180, 90); $p.AddArc($size-2*$r, 0, 2*$r, 2*$r, 270, 90)
    $p.AddArc($size-2*$r, $size-2*$r, 2*$r, 2*$r, 0, 90); $p.AddArc(0, $size-2*$r, 2*$r, 2*$r, 90, 90); $p.CloseFigure()
    $g.FillPath($bg, $p)
  } else { $g.FillRectangle($bg, 0, 0, $size, $size) }
  # maskot 100x100 -> area tengah
  $s = $size * (1 - 2*$pad) / 100; $o = $size * $pad
  $g.TranslateTransform([single]$o, [single]$o); $g.ScaleTransform([single]$s, [single]$s)
  $dark = New-Object System.Drawing.Pen (C '#1C5E57'), 4; $dark.LineJoin = 'Round'
  $roof = [System.Drawing.PointF[]]@((New-Object System.Drawing.PointF 50,8), (New-Object System.Drawing.PointF 92,44), (New-Object System.Drawing.PointF 8,44))
  $g.FillPolygon((New-Object System.Drawing.SolidBrush (C '#2A8C80')), $roof); $g.DrawPolygon($dark, $roof)
  $body = New-Object System.Drawing.Drawing2D.GraphicsPath; $rr = 10
  $body.AddArc(16, 42, 2*$rr, 2*$rr, 180, 90); $body.AddArc(84-2*$rr, 42, 2*$rr, 2*$rr, 270, 90)
  $body.AddArc(84-2*$rr, 92-2*$rr, 2*$rr, 2*$rr, 0, 90); $body.AddArc(16, 92-2*$rr, 2*$rr, 2*$rr, 90, 90); $body.CloseFigure()
  $g.FillPath([System.Drawing.Brushes]::White, $body); $g.DrawPath($dark, $body)
  $ink = New-Object System.Drawing.SolidBrush (C '#2A2833')
  $g.FillEllipse($ink, 32, 55, 10, 10); $g.FillEllipse($ink, 58, 55, 10, 10)
  $g.FillEllipse([System.Drawing.Brushes]::White, 37.4, 56.4, 3.2, 3.2); $g.FillEllipse([System.Drawing.Brushes]::White, 63.4, 56.4, 3.2, 3.2)
  $blush = New-Object System.Drawing.SolidBrush (C '#F9A383' 180)
  $g.FillEllipse($blush, 22, 65, 10, 10); $g.FillEllipse($blush, 68, 65, 10, 10)
  $smile = New-Object System.Drawing.Pen (C '#2A2833'), 4; $smile.StartCap = 'Round'; $smile.EndCap = 'Round'
  $g.DrawBezier($smile, 40, 71, 46.6, 77, 53.4, 77, 60, 71)
  # bulan sabit
  $moon = New-Object System.Drawing.Drawing2D.GraphicsPath
  $moon.AddEllipse(68, 4, 18, 18)
  $cut = New-Object System.Drawing.Drawing2D.GraphicsPath; $cut.AddEllipse(74, 1, 16, 16)
  $reg = New-Object System.Drawing.Region $moon; $reg.Exclude($cut)
  $g.FillRegion((New-Object System.Drawing.SolidBrush (C '#F4B63C')), $reg)
  $g.Dispose(); $bmp.Save((Join-Path $out $file), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}
Draw-Icon 192 'icon-192.png' 0.11 $true
Draw-Icon 512 'icon-512.png' 0.11 $true
Draw-Icon 512 'icon-maskable.png' 0.2 $false
"OK -> $out"
