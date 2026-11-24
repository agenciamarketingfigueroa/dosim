# Redesign da DoSim

A imagem aprovada de 1055 × 1491 px orientou a composição desktop. A implementação parte da revisão local `60bc18d`. O HTML da homepage pública consultado em 24 de novembro de 2026 coincidiu com o dessa revisão.

## Composição e implementação

A abertura divide a largura útil em aproximadamente 45% para o título e 55% para o produto. O papel creme recebe uma textura pequena e repetível. O xadrez, o passe-partout rosa, a moldura, a fita e o recorte das divisórias são camadas independentes. As flores, os utensílios, as etiquetas e os três passos usam traços vetoriais. Texto, links e etiquetas ficam nivelados.

A home está em `index.html`. O texto alternativo e os caminhos dos seis enquadramentos ficam junto de suas imagens, com arquivos WebP em `assets/img/`, `assets/home/` e `assets/collections/`. O navegador escolhe entre duas larguras na abertura. As demais imagens têm dimensões declaradas e carregamento sob demanda. O catálogo usa seu gerador existente em `scripts/build-collections.cjs` para manter cabeçalho e rodapé nas páginas geradas.

O tema público está em `css/papel.css`. Os seis tokens do briefing definem creme, marrom, texto, rosa, manteiga e xadrez. Os títulos usam preto e os botões principais usam creme sobre marrom. O logo vem do vetor oficial `assets/img/logo-escura-confeitaria.svg`. Fraunces e Manrope, já utilizadas pelo projeto, têm cópias locais com caracteres latinos, acentos do português e licenças SIL OFL em `assets/fonts/`.

Em telas pequenas, texto e foto se empilham, a galeria passa a duas colunas e as etapas ficam em uma lista vertical. O menu recolhível e o submenu Catálogo respondem ao teclado e a Escape. O fluxo guiado mantém seu cabeçalho compacto para que a pergunta e o botão de continuar permaneçam em destaque.

## Caminhos preservados

| Ação | Destino |
| --- | --- |
| Pedir orçamento nos três pontos da home | `/atendimento`, com resumo revisável antes do envio no WhatsApp |
| Ver mais inspirações | `/colecoes/`, com busca e filtros existentes |
| Aniversários, Chá de bebê e Casamentos | Coleções individuais em `/colecoes/` |
| Presentes corporativos | `/colecoes/brindes-e-recepcao/`, com orçamento específico do tema |
| Presentes e sabores | `/produtos` e `/gramatura`, com o carrinho existente |
| Personalizados | `/biscoitos-personalizados`, com primeiro pedido e reposição |
| Formulários | `/encomendar`, `/contato` e `/contato#detalhes` |
| Favoritos antigos da home | `#contato`, `#sabores`, `#corporativo` e `#mais-vendidos` encaminham às páginas correspondentes |

A galeria mostra bolo com velinhas, carrinho de bebê, alianças e o carimbo da marca. O rosa aparece na moldura e no papel sob a imagem. A seção de história usa um gesto de presentear. O banner de abertura usa o biscoito carimbado da DoSim com chocolate, xícara e doce de leite.

## Páginas do catálogo e atendimento

O caderno de fotos estende as cores e a tipografia da home em `css/caderno.css`. Nas vitrines, os retratos preservam os laços, as embalagens e os carimbos dos arquivos de produto. O portfólio permite filtrar e ampliar cada foto, inclusive pelo teclado. O atendimento ganha um par de fotos ao lado da ficha em telas largas. Em telas menores, a pergunta ocupa toda a largura.

Cada coleção apresenta um biscoito carimbado para o tema. Quem abre um tema também vê uma pequena sugestão de desenho junto dos motivos personalizáveis. Para atualizar a foto principal, edite `scripts/fotos-colecoes.cjs` e regenere as páginas.

## Prévia e verificação

Na raiz, execute `python3 scripts/previa.py` e abra `http://127.0.0.1:5500/`. O argumento opcional define outra porta. O servidor atende as URLs sem extensão e mantém documentos, receitas, campanhas-fonte e capturas fora das rotas de prévia.

O projeto é estático. Para regenerar as coleções, execute `node scripts/build-collections.cjs`. A checagem de referências é `node scripts/check-site.cjs` e os testes são `node --test tests/*.test.cjs`. Não há comandos configurados de lint ou TypeScript.

As capturas integrais da home em `capturas/` usam larguras de 1440, 1055, 768 e 390 px. As capturas das páginas internas mostram a primeira tela das vitrines e do atendimento. Também foi testada a largura de 320 px. A conferência em Chrome cobriu foco e Escape no menu, âncoras, consulta com tema, pesquisa, carrinho persistente, validações, resumo do orçamento e a diferença de tratamento do molde nos dois tipos de pedido. Os destinos externos foram interceptados antes da transmissão.

O contraste nominal calculado para texto preto sobre creme é 19,12:1. Creme sobre o botão marrom alcança 6,78:1.
