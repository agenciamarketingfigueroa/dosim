$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$old = Join-Path (Split-Path -Parent $root) 'campanha-personalizados'
$items = @(Get-Content (Join-Path $root 'copys.txt') -Encoding UTF8 | Where-Object { $_.Trim() } | ForEach-Object {
    $parts = $_.Split('|'); @{ folder=$parts[0]; title=$parts[1].Split('~'); sub=$parts[2]; cta=$parts[3] }
})
$icon = [System.Drawing.Bitmap]::FromFile((Join-Path (Split-Path -Parent (Split-Path -Parent $root)) 'icons\dosim-app-icon-512.png'))
$logo = New-Object System.Drawing.Bitmap(410,110)
for ($y=0; $y -lt 110; $y++) { for ($x=0; $x -lt 410; $x++) {
    $p=$icon.GetPixel($x+50,$y+200); $darkness = 255 - [Math]::Min(255,[int](($p.R+$p.G+$p.B)/3));
    $alpha=[Math]::Max(0,[Math]::Min(255,[int](($darkness-25)*2.1))); $logo.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($alpha,250,245,236))
} }
$icon.Dispose()
$logoDark = New-Object System.Drawing.Bitmap(410,110)
for ($y=0; $y -lt 110; $y++) { for ($x=0; $x -lt 410; $x++) {
    $a=$logo.GetPixel($x,$y).A; $logoDark.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($a,73,48,34))
} }
$white = [System.Drawing.Color]::FromArgb(249,245,238)
$accent = [System.Drawing.Color]::FromArgb(225,174,124)
$coffee = [System.Drawing.Color]::FromArgb(55,34,25)
for ($i=0; $i -lt $items.Count; $i++) {
    $item=$items[$i]; $num='{0:D2}' -f ($i+1)
    $src=Join-Path $old ($item.folder + '\bases\' + $num + '-base.png')
    $dest=Join-Path $root $item.folder; New-Item -ItemType Directory -Force -Path $dest | Out-Null
    $img=[System.Drawing.Image]::FromFile($src)
    $canvas=New-Object System.Drawing.Bitmap(1080,1080)
    $g=[System.Drawing.Graphics]::FromImage($canvas)
    $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.DrawImage($img,0,0,1080,1080); $img.Dispose()
    $light = (($i % 3) -eq 2)
    $r=New-Object System.Drawing.Rectangle(0,0,1080,680)
    $gradient=New-Object System.Drawing.Drawing2D.LinearGradientBrush($r,[System.Drawing.Color]::Transparent,[System.Drawing.Color]::Transparent,90)
    $blend=New-Object System.Drawing.Drawing2D.ColorBlend
    if ($light) {
        $blend.Colors=@([System.Drawing.Color]::FromArgb(250,246,244,240),[System.Drawing.Color]::FromArgb(242,246,244,240),[System.Drawing.Color]::FromArgb(170,246,244,240),[System.Drawing.Color]::FromArgb(0,246,244,240))
    } else {
        $blend.Colors=@([System.Drawing.Color]::FromArgb(250,45,27,19),[System.Drawing.Color]::FromArgb(239,45,27,19),[System.Drawing.Color]::FromArgb(165,45,27,19),[System.Drawing.Color]::FromArgb(0,45,27,19))
    }
    $blend.Positions=@(0.0,0.43,0.72,1.0); $gradient.InterpolationColors=$blend
    $g.FillRectangle($gradient,$r); $gradient.Dispose()
    if ($light) { $g.DrawImage($logoDark,58,38,164,44) } else { $g.DrawImage($logo,58,38,164,44) }
    $headlineSize=78
    do {
        $font=New-Object System.Drawing.Font('Arial',$headlineSize,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
        $max=0; foreach ($line in $item.title) { $max=[Math]::Max($max,$g.MeasureString($line,$font).Width) }
        if ($max -gt 960) { $font.Dispose(); $headlineSize-=2 }
    } while ($max -gt 960 -and $headlineSize -gt 48)
    $brushWhite=New-Object System.Drawing.SolidBrush($white); $brushAccent=New-Object System.Drawing.SolidBrush($accent); $brushCoffee=New-Object System.Drawing.SolidBrush($coffee)
    $brushRust=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(153,85,46))
    $primary=if ($light) { $brushCoffee } else { $brushWhite }
    $emphasis=if ($light) { $brushRust } else { $brushAccent }
    $buttonFill=if ($light) { $brushCoffee } else { $brushAccent }
    $buttonInk=if ($light) { $brushWhite } else { $brushCoffee }
    $lineHeight=[int]($headlineSize*1.03); $y=120
    for ($j=0; $j -lt $item.title.Count; $j++) {
        $brush=if ($j -eq $item.title.Count-1) { $emphasis } else { $primary }
        $g.DrawString($item.title[$j],$font,$brush,53,$y); $y+=$lineHeight
    }
    $subFont=New-Object System.Drawing.Font('Arial',29,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString($item.sub,$subFont,$primary,58,($y+20))
    $buttonY=$y+87
    $buttonFont=New-Object System.Drawing.Font('Arial',24,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
    $buttonWidth=[int]($g.MeasureString($item.cta,$buttonFont).Width+85)
    $path=New-Object System.Drawing.Drawing2D.GraphicsPath
    $rect=New-Object System.Drawing.Rectangle(58,$buttonY,$buttonWidth,64); $d=64
    $path.AddArc($rect.X,$rect.Y,$d,$d,90,180); $path.AddArc(($rect.Right-$d),$rect.Y,$d,$d,270,180); $path.CloseFigure()
    $g.FillPath($buttonFill,$path); $path.Dispose()
    $g.DrawString($item.cta,$buttonFont,$buttonInk,86,($buttonY+17))
    $g.DrawString('>', $buttonFont,$buttonInk,($rect.Right-40),($buttonY+17))
    $g.Dispose(); $font.Dispose(); $subFont.Dispose(); $buttonFont.Dispose(); $brushWhite.Dispose(); $brushAccent.Dispose(); $brushCoffee.Dispose(); $brushRust.Dispose()
    $canvas.Save((Join-Path $dest "$num-criativo-v2.png"),[System.Drawing.Imaging.ImageFormat]::Png); $canvas.Dispose()
}
$logo.Dispose(); $logoDark.Dispose(); Write-Output "$($items.Count) criativos gerados"
