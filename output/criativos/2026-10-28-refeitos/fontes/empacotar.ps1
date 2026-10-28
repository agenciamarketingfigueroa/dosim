param([switch]$Complete)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root=Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$records=Get-Content -LiteralPath (Join-Path $root 'fontes/briefs-e-prompts.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$available=@(); $checks=@()
foreach ($record in $records) {
    $file=Join-Path $root ($record.folder+'/'+$record.id+'.png')
    if (-not (Test-Path -LiteralPath $file)) { if ($Complete) { throw "Missing $($record.id)" }; continue }
    $img=[System.Drawing.Image]::FromFile($file)
    $valid=($img.Width -eq 1080 -and $img.Height -eq 1080)
    $checks+=@{id=$record.id;width=$img.Width;height=$img.Height;valid=$valid;sha256=(Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash}
    $img.Dispose(); if (-not $valid) { throw "Invalid dimensions: $file" }
    $available+=@{id=$record.id;folder=$record.folder;file=$file}
}
function New-Preview($items,$file,$columns=5) {
    if (-not $items.Count) { return }
    $cell=300; $footer=32; $rows=[int][Math]::Ceiling($items.Count/$columns)
    $canvas=New-Object System.Drawing.Bitmap(($columns*$cell),($rows*($cell+$footer)))
    $g=[System.Drawing.Graphics]::FromImage($canvas)
    $g.Clear([System.Drawing.Color]::FromArgb(246,244,240))
    $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $font=New-Object System.Drawing.Font('Arial',16,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
    $brush=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(73,48,34))
    for ($i=0;$i -lt $items.Count;$i++) {
        $x=($i%$columns)*$cell; $y=[int][Math]::Floor($i/$columns)*($cell+$footer)
        $img=[System.Drawing.Image]::FromFile($items[$i].file)
        $g.DrawImage($img,$x,$y,$cell,$cell);$img.Dispose()
        $g.DrawString($items[$i].id,$font,$brush,($x+12),($y+$cell+6))
    }
    $font.Dispose();$brush.Dispose();$g.Dispose();$canvas.Save($file,[System.Drawing.Imaging.ImageFormat]::Jpeg);$canvas.Dispose()
}
New-Preview $available (Join-Path $root 'preview-geral.jpg')
foreach ($folder in @($available.folder | Select-Object -Unique)) {
    $items=@($available | Where-Object { $_.folder -eq $folder })
    New-Preview $items (Join-Path $root ($folder+'/preview.jpg'))
}
$checks | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $root 'fontes/verificacao.json') -Encoding UTF8
if ($Complete) {
    if ($available.Count -ne 50) { throw 'Expected 50 creatives' }
    $zipPath=Join-Path $root 'DoSim-50-criativos-refeitos.zip'
    if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath }
    $zip=[System.IO.Compression.ZipFile]::Open($zipPath,[System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $files=@($available.file)
        $files+=@(Get-ChildItem -LiteralPath $root -Filter '*.jpg' | ForEach-Object {$_.FullName})
        $files+=@(Get-ChildItem -LiteralPath $root -Directory | Where-Object {$_.Name -ne 'fontes'} | ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Filter 'preview.jpg' } | ForEach-Object {$_.FullName})
        $files+=@(Join-Path $root 'galeria.html'; Join-Path $root 'LEIA-ME.md'; Join-Path $root 'fontes/briefs-e-prompts.json')
        foreach ($file in $files) {
            $relative=$file.Substring($root.Length+1).Replace('\','/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip,$file,$relative,[System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally { $zip.Dispose() }
}
Write-Output "$($available.Count) creatives verified"
