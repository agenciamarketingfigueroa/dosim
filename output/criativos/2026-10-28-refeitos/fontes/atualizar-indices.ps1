$ErrorActionPreference='Stop'
$root=Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$records=Get-Content -LiteralPath (Join-Path $root 'fontes/briefs-e-prompts.json') -Raw -Encoding UTF8 | ConvertFrom-Json
function ConvertTo-HtmlText([string]$s) { [System.Net.WebUtility]::HtmlEncode($s) }
$cards=foreach($r in $records){
    $path=$r.folder+'/'+$r.id+'.png'
    $headline=$r.headline.Replace("`n",' ')
    '<article data-theme="'+(ConvertTo-HtmlText $r.folder)+'" data-search="'+(ConvertTo-HtmlText ($r.id+' '+$r.label+' '+$headline).ToLowerInvariant())+'"><a class="preview" href="'+$path+'" target="_blank"><img loading="lazy" src="'+$path+'" alt="'+(ConvertTo-HtmlText $headline)+'"></a><div class="info"><strong>'+$r.id+'</strong><span>'+(ConvertTo-HtmlText $r.label)+'</span><a href="'+$path+'" download="'+$r.id+'.png">Baixar PNG</a></div><p>'+(ConvertTo-HtmlText $headline)+'</p></article>'
}
$htmlPath=Join-Path $root 'galeria.html'
$html=Get-Content -LiteralPath $htmlPath -Raw -Encoding UTF8
$html=[regex]::Replace($html,'(?s)<main>.*?</main>','<main>'+($cards -join "`n")+'</main>')
$html=$html.Replace('40 novos criativos','50 novos criativos').Replace('40 peças refeitas do zero','40 peças refeitas do zero + 10 de Natal').Replace('7 temas','8 temas').Replace('>40 criativos<','>50 criativos<')
if(-not $html.Contains('data-filter="08-natal"')){$html=$html.Replace('</div></section><main>','<button data-filter="08-natal">Natal</button></div></section><main>')}
[System.IO.File]::WriteAllText($htmlPath,$html,(New-Object System.Text.UTF8Encoding($false)))
$md=@'
# DoSim — 50 criativos

40 criativos refeitos do zero e 10 novos para a campanha de Natal. Todos em PNG quadrado, 1080 × 1080 pixels, numerados de DOS01 a DOS50 e organizados por tema.

Abra [galeria.html](galeria.html) para filtrar por tema, buscar e baixar cada peça.

## Organização

| Arquivos | Tema | Quantidade |
| --- | --- | --- |
| DOS01–DOS10 | Personalizados para negócios | 10 |
| DOS11–DOS15 | Halloween | 5 |
| DOS16–DOS20 | Aniversário infantil | 5 |
| DOS21–DOS25 | Adultos e empresas | 5 |
| DOS26–DOS30 | Batizado | 5 |
| DOS31–DOS35 | Chá revelação | 5 |
| DOS36–DOS40 | Chá de bebê | 5 |
| DOS41–DOS50 | Natal | 10 |

## Produção

Cada composição foi criada integralmente com a ferramenta integrada de geração de imagens: cena, biscoitos, tipografia, copy e chamada para ação. A exportação apenas ajusta a resolução para 1080 × 1080 pixels, sem recorte.

Referências de composição: DFV11, DFV12, DFV13, DFV14, DFV18 e DFV23, fornecidas pelo usuário. Referência dos biscoitos: fotografia extraída de assets/img/corporativo.svg do projeto DoSim. As cenas têm liberdade de ambientação, mantendo café, creme e caramelo nos destaques. Halloween usa laranja e roxo; chá revelação usa rosa e azul; Natal utiliza verde, vinho e luzes quentes.

Os produtos são mockups ilustrativos. Nomes, idades e logotipos de exemplo não representam pedidos reais. As artes não incluem preços ou condições comerciais não informadas.

Prompts completos: [fontes/briefs-e-prompts.json](fontes/briefs-e-prompts.json). Originais de geração em fontes/gerados; registros de exportação em fontes/registros. O arquivo fontes/verificacao.json registra dimensões e SHA256 de cada PNG final.

## Copys
'@
foreach($r in $records){$md+="`n`n### $($r.id) — $($r.label)`n`n**Título:** $($r.headline.Replace("`n",' '))`n`n**Complemento:** $($r.body)`n`n**Chamada:** $($r.cta)"}
[System.IO.File]::WriteAllText((Join-Path $root 'LEIA-ME.md'),$md,(New-Object System.Text.UTF8Encoding($false)))
Write-Output "$($records.Count) entries updated"
