from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import shutil

ROOT = Path(__file__).parent
SOURCE = Path(r'C:\Users\Felipe\.codex\generated_images\01a18304-85f5-79e3-a6b3-5c24879c30ce')
GROUPS = [
 ('01-personalizados', [('Sua marca merece\num doce encontro.', 'Biscoitos personalizados para receber'), ('O cuidado começa\nna recepção.', 'Sua marca em cada detalhe'), ('Uma boa primeira\nimpressão é doce.', 'Biscoitos para o seu espaço'), ('Seu negócio em\nforma de presente.', 'Brindes personalizados para clientes'), ('Um gesto que\naproxima.', 'Surpreenda com a sua marca'), ('Reuniões ficam\nmais gostosas.', 'Personalize o café da sua empresa'), ('Receber bem é\numa arte.', 'Biscoitos para encantar seus clientes'), ('Sua marca,\num presente.', 'Biscoitos personalizados DoSim'), ('O detalhe que\nfaz lembrar.', 'Sua identidade marcada no biscoito'), ('Um carinho para\nquem chega.', 'Personalize a experiência de receber')]),
 ('02-halloween', [('Um Halloween\nde dar água na boca.', 'Biscoitos temáticos DoSim'), ('Um sustinho\nbem gostoso.', 'Fantasmas para adoçar a festa'), ('Uma dose de\nmagia e sabor.', 'Biscoitos para o Halloween'), ('O feitiço está\nno sabor.', 'Caldeirões e biscoitos de chocolate'), ('Gostosuras\npara celebrar.', 'Halloween com biscoitos personalizados')]),
 ('03-aniversario-infantil', [('Uma festinha\ncheia de encanto.', 'Biscoitos para a sua fazendinha'), ('Uma aventura\npara comemorar.', 'Biscoitos no tema safari'), ('Um abraço em\nforma de biscoito.', 'Ursinhos para celebrar'), ('Uma festa\ndinossauricamente doce.', 'Biscoitos para pequenos exploradores'), ('Um reino de\nbons momentos.', 'Biscoitos para a festa de princesa')]),
 ('04-aniversario-adulto-empresa', [('A vida merece\nser celebrada.', 'Biscoitos para aniversários'), ('Mais um ano.\nMais motivos para sorrir.', 'Um detalhe doce para a festa'), ('Uma conquista\npara compartilhar.', 'Biscoitos para aniversário de empresa'), ('Celebre quem\nfaz parte da história.', 'Brindes para a sua equipe e clientes'), ('O melhor da festa\nestá nos detalhes.', 'Biscoitos personalizados para celebrar')]),
 ('05-batizado', [('Um dia de fé,\num gesto de carinho.', 'Biscoitos personalizados para batizado'), ('Uma lembrança\ncheia de fé.', 'Biscoitos para um dia especial'), ('Para celebrar\numa bênção.', 'Detalhes doces para o batizado'), ('Um anjinho\nem cada detalhe.', 'Lembranças para o batizado'), ('Fé e carinho\npara compartilhar.', 'Biscoitos para presentear convidados')]),
 ('06-cha-revelacao', [('A espera também\nmerece ser doce.', 'Biscoitos para chá revelação'), ('Rosa ou azul?\nCelebre o amor.', 'Biscoitos personalizados DoSim'), ('Um ursinho,\nmil possibilidades.', 'Um chá revelação cheio de carinho'), ('Uma surpresa\npara compartilhar.', 'Biscoitos para chá revelação'), ('O amor já sabe\ncomo celebrar.', 'Rosa e azul em cada detalhe')]),
 ('07-cha-de-bebe', [('Um mundo de carinho\nestá chegando.', 'Biscoitos para chá de bebê'), ('Pequenos detalhes,\ngrande amor.', 'Biscoitos personalizados DoSim'), ('Uma chegada\npara celebrar.', 'Biscoitos para chá de bebê'), ('Doce espera,\ndoce lembrança.', 'Surpreenda seus convidados'), ('Feito para celebrar\no amor que cresce.', 'Biscoitos para um dia especial')]),
]

serif = r'C:\Windows\Fonts\georgia.ttf'
sans = r'C:\Windows\Fonts\arial.ttf'
bold = r'C:\Windows\Fonts\arialbd.ttf'
files = sorted(SOURCE.glob('exec-*.png'), key=lambda p: p.stat().st_ctime)
# The first file was a portrait test; all subsequent files belong to the square campaign.
files = files[1:]
index = 0
for group, items in GROUPS:
    folder = ROOT / group
    (folder / 'bases').mkdir(parents=True, exist_ok=True)
    for title, sub in items:
        if index >= len(files):
            break
        number = index + 1
        src = files[index]
        with Image.open(src) as original:
            im = ImageOps.fit(original.convert('RGB'), (1080,1080), method=Image.Resampling.LANCZ)
        im.save(folder / 'bases' / f'{number:02d}-base.png')
        # Editorial cream gradient reserves legible space without hiding the hero product.
        overlay = Image.new('RGBA', (1080,1080), (0,0,0,0))
        pixels = overlay.load()
        for y in range(440):
            alpha = int(239 * max(0, 1-y/440)**0.65)
            for x in range(1080): pixels[x,y] = (246,244,240,alpha)
        im = Image.alpha_composite(im.convert('RGBA'), overlay)
        d = ImageDraw.Draw(im)
        color = '#493022'
        d.rectangle((65,58,115,64), fill=color)
        d.text((65,75), 'DOSIM CONFEITARIA', font=ImageFont.truetype(bold, 21), fill=color)
        font = ImageFont.truetype(serif, 57 if max(map(len,title.split('\n'))) < 25 else 48)
        d.multiline_text((65,118), title, font=font, fill=color, spacing=3)
        d.text((65,294), sub, font=ImageFont.truetype(sans, 25), fill=color)
        im.convert('RGB').save(folder / f'{number:02d}-criativo.png', optimize=True)
        index += 1
print(f'{index} peças geradas')
