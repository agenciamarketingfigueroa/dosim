param([Parameter(Mandatory=$true)][string]$Id,[Parameter(Mandatory=$true)][string]$Source)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$fontes=Split-Path -Parent $MyInvocation.MyCommand.Path
$root=Split-Path -Parent $fontes
$records=Get-Content -LiteralPath (Join-Path $fontes 'briefs-e-prompts.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$record=$records | Where-Object { $_.id -eq $Id }
if (-not $record) { throw 'Unknown creative ID' }
$folder=Join-Path $root $record.folder
$raw=Join-Path $fontes 'gerados'
$logs=Join-Path $fontes 'registros'
New-Item -ItemType Directory -Force -Path $folder,$raw,$logs | Out-Null
$rawFile=Join-Path $raw ($Id+'.png')
Copy-Item -LiteralPath $Source -Destination $rawFile -Force
$image=[System.Drawing.Image]::FromFile($rawFile)
if ($image.Width -ne $image.Height) { $image.Dispose(); throw 'Generated creative is not square; regenerate without cropping' }
$sourceWidth=$image.Width
$target=Join-Path $folder ($Id+'.png')
$canvas=New-Object System.Drawing.Bitmap(1080,1080)
$canvas.SetResolution(96,96)
$g=[System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode=[System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($image,0,0,1080,1080)
$g.Dispose(); $image.Dispose()
$canvas.Save($target,[System.Drawing.Imaging.ImageFormat]::Png); $canvas.Dispose()
@{ id=$Id; source=$Source; originalSize=$sourceWidth; final=$target; finalWidth=1080; finalHeight=1080; method='Complete creative generated with built-in image generation; resized only for export' } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $logs ($Id+'.json')) -Encoding UTF8
Write-Output "$Id exported"
