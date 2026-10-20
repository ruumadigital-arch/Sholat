# Membuat gambar preview link (Open Graph) 1200x630 untuk WhatsApp/Facebook.
# Jalankan:  powershell -ExecutionPolicy Bypass -File tools\make-og.ps1
Add-Type -AssemblyName System.Drawing
$out = Join-Path (Split-Path $PSScriptRoot -Parent) 'public\icons\og-image.png'
function C($hex, $a = 255) { [System.Drawing.Color]::FromArgb($a, [System.Drawing.ColorTranslator]::FromHtml($hex)) }

$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'
$g.Clear((C '#FFF6E6'))
# lingkaran latar
$g.FillEllipse((New-Object System.Drawing.SolidBrush (C '#CFE9E3')), -160, 330, 520, 520)
$g.FillEllipse((New-Object System.Drawing.SolidBrush (C '#FDE3D4')), 900, -200, 480, 480)
$g.FillEllipse((New-Object System.Drawing.SolidBrush (C '#FCE7B5')), 1010, 430, 260, 260)

# maskot RuMa (skala 100 -> 330 px)
$state = $g.Save()
$g.TranslateTransform(90, 150); $g.ScaleTransform(3.3, 3.3)
$dark = New-Object System.Drawing.Pen (C '#1C5E57'), 4; $dark.LineJoin = 'Round'
$roof = [System.Drawing.PointF[]]@((New-Object System.Drawing.PointF 50, 8), (New-Object System.Drawing.PointF 92, 44), (New-Object System.Drawing.PointF 8, 44))
$g.FillPolygon((New-Object System.Drawing.SolidBrush (C '#2A8C80')), $roof); $g.DrawPolygon($dark, $roof)
$body = New-Object System.Drawing.Drawing2D.GraphicsPath; $r = 10
$body.AddArc(16, 42, 2 * $r, 2 * $r, 180, 90); $body.AddArc(84 - 2 * $r, 42, 2 * $r, 2 * $r, 270, 90)
$body.AddArc(84 - 2 * $r, 92 - 2 * $r, 2 * $r, 2 * $r, 0, 90); $body.AddArc(16, 92 - 2 * $r, 2 * $r, 2 * $r, 90, 90); $body.CloseFigure()
$g.FillPath([System.Drawing.Brushes]::White, $body); $g.DrawPath($dark, $body)
$ink = New-Object System.Drawing.SolidBrush (C '#2A2833')
$g.FillEllipse($ink, 32, 55, 10, 10); $g.FillEllipse($ink, 58, 55, 10, 10)
$g.FillEllipse([System.Drawing.Brushes]::White, 37.4, 56.4, 3.2, 3.2); $g.FillEllipse([System.Drawing.Brushes]::White, 63.4, 56.4, 3.2, 3.2)
$blush = New-Object System.Drawing.SolidBrush (C '#F9A383' 180)
$g.FillEllipse($blush, 22, 65, 10, 10); $g.FillEllipse($blush, 68, 65, 10, 10)
$smile = New-Object System.Drawing.Pen (C '#2A2833'), 4; $smile.StartCap = 'Round'; $smile.EndCap = 'Round'
$g.DrawBezier($smile, 40, 71, 46.6, 77, 53.4, 77, 60, 71)
$moon = New-Object System.Drawing.Drawing2D.GraphicsPath; $moon.AddEllipse(68, 4, 18, 18)
$cut = New-Object System.Drawing.Drawing2D.GraphicsPath; $cut.AddEllipse(74, 1, 16, 16)
$reg = New-Object System.Drawing.Region $moon; $reg.Exclude($cut)
$g.FillRegion((New-Object System.Drawing.SolidBrush (C '#F4B63C')), $reg)
$g.Restore($state)

# teks
$teal = New-Object System.Drawing.SolidBrush (C '#1C5E57')
$inkB = New-Object System.Drawing.SolidBrush (C '#2A2833')
$muted = New-Object System.Drawing.SolidBrush (C '#5E5B6B')
$g.DrawString('RuMa Shalat', (New-Object System.Drawing.Font 'Segoe UI', 76, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)), $teal, 500, 150)
$g.DrawString('Panduan shalat lengkap untuk anak', (New-Object System.Drawing.Font 'Segoe UI Semibold', 40, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)), $inkB, 504, 252)
$f3 = New-Object System.Drawing.Font 'Segoe UI Semibold', 30, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
$y = 340
foreach ($line in @('Wudhu, gerakan & bacaan bersuara', 'Praktik shalat 5 waktu', 'Kuis, doa harian & jadwal shalat')) {
  $g.FillEllipse((New-Object System.Drawing.SolidBrush (C '#F4B63C')), 506, $y + 12, 16, 16)
  $g.DrawString($line, $f3, $muted, 536, $y); $y += 52
}
# pita bawah
$g.FillRectangle((New-Object System.Drawing.SolidBrush (C '#2A8C80')), 0, 570, $W, 60)
$dot = [string][char]0x2022; $g.DrawString("Gratis  $dot  Bisa dipasang di HP  $dot  RuMa Digital", (New-Object System.Drawing.Font 'Segoe UI Semibold', 28, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)), [System.Drawing.Brushes]::White, 90, 581)

$g.Dispose(); $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
"OK -> $out"
