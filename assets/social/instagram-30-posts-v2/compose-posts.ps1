$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cream = [System.Drawing.Color]::FromArgb(246, 244, 240)
$coffee = [System.Drawing.Color]::FromArgb(73, 47, 34)
$white = [System.Drawing.Color]::FromArgb(248, 246, 241)

$posts = @(
    @{ n='01'; base='01-mordida-tradicional-base.png'; slug='mordida-tradicional'; title="É de morder`ne dizer Sim."; sub='Sabor Tradicional'; side='left' },
    @{ n='02'; base='02-mordida-chocolate-base.png'; slug='mordida-chocolate'; title="Uma mordida.`nE pronto."; sub='Sabor Chocolate'; side='right' },
    @{ n='03'; base='03-mordida-ninho-base.png'; slug='mordida-ninho'; title="Recheado de`nvontade."; sub='Ninho com Nutella'; side='left' },
    @{ n='04'; base='04-mordida-canela-base.png'; slug='mordida-canela'; title='Canela que abraça.'; sub='A pausa ficou mais gostosa.'; side='left' },
    @{ n='05'; base='05-mordida-capuccino-base.png'; slug='mordida-capuccino'; title="Pausa boa.`nSabor melhor."; sub='Sabor Capuccino'; side='left' },
    @{ n='06'; base='06-mordida-ovomaltine-base.png'; slug='mordida-ovomaltine'; title="Crocância que`nconquista."; sub='Sabor Ovomaltine'; side='right' },
    @{ n='07'; base='07-quebra-tradicional-base.png'; slug='quebra-tradicional'; title='Ouviu daqui?'; sub='O clássico no ponto da crocância.'; side='left' },
    @{ n='08'; base='08-quebra-chocolate-base.png'; slug='quebra-chocolate'; title="Chocolate`nfaz crack."; sub='Quebra, morde, repete.'; side='left' },
    @{ n='09'; base='09-quebra-ninho-base.png'; slug='quebra-ninho'; title="Por fora, crocante.`nPor dentro, vontade."; sub='Ninho com Nutella'; side='left' },
    @{ n='10'; base='10-quebra-ovomaltine-base.png'; slug='quebra-ovomaltine'; title='Textura que fala.'; sub='Crocância em cada pedaço.'; side='left' },
    @{ n='11'; base='11-quebra-misto-base.png'; slug='quebra-misto'; title="Dois sabores.`nO mesmo Sim."; sub='Misto DoSim'; side='left' },
    @{ n='12'; base='12-migalhas-macro-base.png'; slug='migalhas-macro'; title="A crocância`nem detalhes."; sub='Feito artesanalmente'; side='left' },
    @{ n='13'; base='13-salgado-sucesso-base.png'; slug='salgado-sucesso'; title="O salgado que`nvirou sucesso."; sub='Biscoito salgado DoSim'; side='left' },
    @{ n='14'; base='14-salgado-mordida-base.png'; slug='salgado-mordida'; title="Nem todo carinho`nprecisa ser doce."; sub='Biscoito salgado'; side='left' },
    @{ n='15'; base='15-salgado-quebra-base.png'; slug='salgado-quebra'; title="Quebra. Escuta.`nMorde."; sub='Crocância de verdade'; side='left' },
    @{ n='16'; base='16-salgado-cafe-base.png'; slug='salgado-cafe'; title="Café mineiro`npede companhia."; sub='Nosso salgado chegou'; side='left' },
    @{ n='17'; base='17-salgado-compartilhar-base.png'; slug='salgado-compartilhar'; title="Feito para`ncompartilhar."; sub='Biscoito salgado'; side='left' },
    @{ n='18'; base='18-salgado-hora-base.png'; slug='salgado-hora'; title="Abriu o pacote,`nacabou a espera."; sub='É hora do salgado'; side='left' },
    @{ n='19'; base='19-salgado-detalhe-base.png'; slug='salgado-detalhe'; title="O sucesso mora`nnos detalhes."; sub='Dourado, crocante e cheio de sabor.'; side='left' },
    @{ n='20'; base='20-salgado-pedido-base.png'; slug='salgado-pedido'; title="Já sabe por que`né sucesso, né?"; sub='Peça o seu'; side='left' },
    @{ n='21'; base='21-personalizado-hero-base.png'; slug='personalizado-hero'; title="Sua ideia vira`nbiscoito."; sub='Personalizados DoSim'; side='left' },
    @{ n='22'; base='22-personalizado-iniciais-base.png'; slug='personalizado-iniciais'; title='Um detalhe só seu.'; sub='Para celebrar do seu jeito'; side='left' },
    @{ n='23'; base='23-personalizado-corporativo-base.png'; slug='personalizado-corporativo'; title="Sua marca,`nmais próxima."; sub='Brindes corporativos personalizados'; side='left' },
    @{ n='24'; base='24-personalizado-processo-base.png'; slug='personalizado-processo'; title="Do desenho`nà primeira fornada."; sub='Feito sob medida'; side='left' },
    @{ n='25'; base='25-personalizado-evento-base.png'; slug='personalizado-evento'; title="Lembrança que`nvira memória."; sub='Personalizados para eventos'; side='left' },
    @{ n='26'; base='26-personalizado-detalhe-base.png'; slug='personalizado-detalhe'; title="Sua marca`nem alto-relevo."; sub='Acabamento artesanal'; side='left' },
    @{ n='27'; base='27-presente-aproxima-base.png'; slug='presente-aproxima'; title="Um presente`nque aproxima."; sub='DoSim Corporativo'; side='left' },
    @{ n='28'; base='28-doce-salgado-base.png'; slug='doce-salgado'; title="Do doce`nao salgado."; sub='Tem um DoSim para cada momento.'; side='left' },
    @{ n='29'; base='29-mais-um-base.png'; slug='mais-um'; title="Tem momento`nque pede mais um."; sub='E mais uma conversa'; side='left' },
    @{ n='30'; base='30-proximo-sim-base.png'; slug='proximo-sim'; title="Seu próximo Sim`ncomeça aqui."; sub='DoSim Confeitaria'; side='left' }
)

function New-FittedImage([System.Drawing.Image]$source) {
    $targetW = 1080
    $targetH = 1350
    $targetRatio = $targetW / $targetH
    $sourceRatio = $source.Width / $source.Height
    if ($sourceRatio -gt $targetRatio) {
        $cropH = $source.Height
        $cropW = [int]($cropH * $targetRatio)
        $cropX = [int](($source.Width - $cropW) / 2)
        $cropY = 0
    } else {
        $cropW = $source.Width
        $cropH = [int]($cropW / $targetRatio)
        $cropX = 0
        $cropY = [int](($source.Height - $cropH) / 2)
    }
    $canvas = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $canvas.SetResolution(144, 144)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($source, (New-Object System.Drawing.Rectangle(0,0,$targetW,$targetH)), $cropX, $cropY, $cropW, $cropH, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    return $canvas
}

foreach ($post in $posts) {
    $inputPath = Join-Path $root $post.base
    $outputPath = Join-Path $root ("{0}-{1}.png" -f $post.n, $post.slug)
    $source = [System.Drawing.Image]::FromFile($inputPath)
    $canvas = New-FittedImage $source
    $source.Dispose()
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $overlayRect = New-Object System.Drawing.Rectangle(0, 0, 1080, 550)
    $overlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush($overlayRect, [System.Drawing.Color]::Transparent, [System.Drawing.Color]::Transparent, 90)
    $blend = New-Object System.Drawing.Drawing2D.ColorBlend
    $blend.Colors = @(
        [System.Drawing.Color]::FromArgb(242, 246, 244, 240),
        [System.Drawing.Color]::FromArgb(224, 246, 244, 240),
        [System.Drawing.Color]::FromArgb(0, 246, 244, 240)
    )
    $blend.Positions = @(0.0, 0.58, 1.0)
    $overlay.InterpolationColors = $blend
    $g.FillRectangle($overlay, $overlayRect)
    $overlay.Dispose()

    $x = if ($post.side -eq 'right') { 540 } else { 78 }
    $maxW = if ($post.side -eq 'right') { 465 } else { 850 }
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($coffee)), $x, 68, 54, 7)

    $eyebrowFont = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $titleFont = New-Object System.Drawing.Font('Georgia', 68, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $subFont = New-Object System.Drawing.Font('Arial', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brandFont = New-Object System.Drawing.Font('Arial', 17, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $coffeeBrush = New-Object System.Drawing.SolidBrush($coffee)
    $whiteBrush = New-Object System.Drawing.SolidBrush($white)
    $g.DrawString('DOSIM CONFEITARIA', $eyebrowFont, $coffeeBrush, $x, 92)
    $titleRect = New-Object System.Drawing.RectangleF($x, 132, $maxW, 225)
    $g.DrawString($post.title, $titleFont, $coffeeBrush, $titleRect)
    $g.DrawString($post.sub, $subFont, $coffeeBrush, $x, 378)

    $pillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(185, 73, 47, 34))
    $g.FillRectangle($pillBrush, 66, 1272, 186, 42)
    $g.DrawString('feito com cuidado', $brandFont, $whiteBrush, 82, 1282)

    $eyebrowFont.Dispose(); $titleFont.Dispose(); $subFont.Dispose(); $brandFont.Dispose()
    $coffeeBrush.Dispose(); $whiteBrush.Dispose(); $pillBrush.Dispose(); $g.Dispose()
    $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $canvas.Dispose()
}

$thumbW = 270
$thumbH = 338
$gridWidth = [int]($thumbW * 5)
$gridHeight = [int]($thumbH * 6)
$grid = New-Object System.Drawing.Bitmap($gridWidth, $gridHeight)
$gg = [System.Drawing.Graphics]::FromImage($grid)
$gg.Clear($cream)
$gg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
for ($i = 0; $i -lt $posts.Count; $i++) {
    $post = $posts[$i]
    $path = Join-Path $root ("{0}-{1}.png" -f $post.n, $post.slug)
    $img = [System.Drawing.Image]::FromFile($path)
    $col = $i % 5
    $row = [math]::Floor($i / 5)
    $gg.DrawImage($img, $col * $thumbW, $row * $thumbH, $thumbW, $thumbH)
    $img.Dispose()
}
$gg.Dispose()
$grid.Save((Join-Path $root 'preview-grid.jpg'), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$grid.Dispose()

Write-Output "30 posts finalizados em 1080 x 1350 e preview-grid.jpg criado."

