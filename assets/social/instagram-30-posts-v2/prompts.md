# Direção de geração e prompts

## Base compartilhada

```text
Use case: ads-marketing
Asset type: Instagram feed post background, exact portrait 4:5, final crop 1080 x 1350
Style/medium: photorealistic premium natural food campaign photography for DoSim, artisanal, warm and approachable
Lighting/mood: warm diffused daylight or studio light, intimate and tactile
Color palette: cream #f6f4f0, coffee brown #6f4e37, kraft and natural baked-cookie tones
Constraints: no generated typography; no watermark; believable adult anatomy and hands; authentic skin and food texture; faithful DoSim product appearance; safe margins for later copy
Avoid: staged stock-photo expressions, exaggerated bites, messy eating, extra fingers, plastic-looking food, pink bakery palette, clutter
```

## Variações por post

| Post | Cena gerada | Texto final |
|---|---|---|
| 01 | Mulher mordendo o biscoito tradicional em macro | “É de morder e dizer Sim.” |
| 02 | Homem negro mordendo o biscoito de chocolate | “Uma mordida. E pronto.” |
| 03 | Mulher provando Ninho com Nutella, recheio aparente | “Recheado de vontade.” |
| 04 | Mulher madura, canela, café e mordida | “Canela que abraça.” |
| 05 | Homem com capuccino e biscoito | “Pausa boa. Sabor melhor.” |
| 06 | Mulher mordendo Ovomaltine com migalha no ar | “Crocância que conquista.” |
| 07 | Duas mãos quebrando o tradicional | “Ouviu daqui?” |
| 08 | Duas mãos quebrando o chocolate | “Chocolate faz crack.” |
| 09 | Ninho com Nutella sendo aberto, recheio esticando | “Por fora, crocante. Por dentro, vontade.” |
| 10 | Quebra de Ovomaltine sobre madeira | “Textura que fala.” |
| 11 | Tradicional e chocolate quebrados na mesma cena | “Dois sabores. O mesmo Sim.” |
| 12 | Macro extremo da estrutura e das migalhas | “A crocância em detalhes.” |
| 13 | Pacote e abundância de biscoito salgado | “O salgado que virou sucesso.” |
| 14 | Mordida em close no biscoito salgado floral | “Nem todo carinho precisa ser doce.” |
| 15 | Biscoito salgado sendo quebrado | “Quebra. Escuta. Morde.” |
| 16 | Café mineiro com biscoito salgado | “Café mineiro pede companhia.” |
| 17 | Mãos compartilhando uma tábua de salgados | “Feito para compartilhar.” |
| 18 | Mãos abrindo o pacote salgado | “Abriu o pacote, acabou a espera.” |
| 19 | Macro do desenho floral e dos ingredientes | “O sucesso mora nos detalhes.” |
| 20 | Vários pacotes salgados prontos para entrega | “Já sabe por que é sucesso, né?” |
| 21 | Biscoitos personalizados dourado e chocolate | “Sua ideia vira biscoito.” |
| 22 | Caixa de biscoitos com iniciais personalizadas | “Um detalhe só seu.” |
| 23 | Caixa corporativa personalizada sendo entregue | “Sua marca, mais próxima.” |
| 24 | Produção artesanal com carimbo sob medida | “Do desenho à primeira fornada.” |
| 25 | Biscoito personalizado em mesa de evento | “Lembrança que vira memória.” |
| 26 | Macro do alto-relevo personalizado | “Sua marca em alto-relevo.” |
| 27 | Troca de caixa presenteável entre duas pessoas | “Um presente que aproxima.” |
| 28 | Mesa compartilhada com doces e salgados | “Do doce ao salgado.” |
| 29 | Duas amigas em pausa com café e salgados | “Tem momento que pede mais um.” |
| 30 | Brinde simbólico com três tipos de biscoito | “Seu próximo Sim começa aqui.” |

As bases foram geradas sem texto. A tipografia foi aplicada de forma determinística pelo arquivo `compose-posts.ps1`, preservando todos os acentos e a consistência entre as 30 peças.
