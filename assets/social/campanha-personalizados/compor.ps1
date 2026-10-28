$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceDir = 'C:\Users\Felipe\.codex\generated_images\01a18304-85f5-79e3-a6b3-5c24879c30ce'
$images = @(Get-ChildItem -LiteralPath $sourceDir -Filter 'exec-*.png' | Sort-Object CreationTime | Select-Object -Skip 1)
$lines = Get-Content -LiteralPath (Join-Path $root 'compor.py') -Encoding UTF8
$posts = @()
foreach ($line in $lines) {
    if ($line -notmatch "^ \('0[1-7]-") { continue }
    $values = [regex]::Matches($line, "'([^']*)'") | ForEach-Object { $_.Groups[1].Value }
    for ($i=1; $i -lt $values.Count; $i+=2) {
        $posts += @{ folder=$values[0]; title=$values[$i].Replace('\n', "`n"); sub=$values[$i+1] }
    }
}
$coffee = [System.Drawing.Color]::FromArgb(73,48,34)
$n = [Math]::Min($posts.Count, $images.Count)
for ($i=0; $i -lt $n; $i++) {
    $post = $posts[$i]
    $folder = Join-Path $root $post.folder
    $baseFolder = Join-Path $folder 'bases'
    New-Item -ItemType Directory -Force -Path $baseFolder | Out-Null
    $num = '{0:D2}' -f ($i+1)
    $source = [System.Drawing.Image]::FromFile($images[$i].FullName)
    $canvas = New-Object System.Drawing.Bitmap(1080,1080)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $side = [Math]::Min($source.Width,$source.Height)
    $g.DrawImage($source, (New-Object System.Drawing.Rectangle(0,0,1080,1080)), [int](($source.Width-$side)/2), [int](($source.Height-$side)/2), $side, $side, [System.Drawing.GraphicsUnit]::Pixel)
    $source.Dispose()
    $canvas.Save((Join-Path $baseFolder "$num-base.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $rect = New-Object System.Drawing.Rectangle(0,0,1080,430)
    $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::Transparent, [System.Drawing.Color]::Transparent, 90)
    $blend = New-Object System.Drawing.Drawing2D.ColorBlend
    $blend.Colors = @([System.Drawing.Color]::FromArgb(244,246,244,240), [System.Drawing.Color]::FromArgb(225,246,244,240), [System.Drawing.Color]::FromArgb(0,246,244,240))
    $blend.Positions = @(0.0,0.62,1.0)
    $gradient.InterpolationColors = $blend
    $g.FillRectangle($gradient,$rect)
    $gradient.Dispose()
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $brush = New-Object System.Drawing.SolidBrush($coffee)
    $g.FillRectangle($brush,65,57,50,6)
    $brand = New-Object System.Drawing.Font('Arial',20,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
    $title = New-Object System.Drawing.Font('Georgia',54,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
    $sub = New-Object System.Drawing.Font('Arial',24,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('DOSIM CONFEITARIA',$brand,$brush,65,73)
    $g.DrawString($post.title,$title,$brush,65,117)
    $g.DrawString($post.sub,$sub,$brush,65,290)
    $g.Dispose(); $brand.Dispose(); $title.Dispose(); $sub.Dispose(); $brush.Dispose()
    $canvas.Save((Join-Path $folder "$num-criativo.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $canvas.Dispose()
}
Write-Output "$n peças geradas"
