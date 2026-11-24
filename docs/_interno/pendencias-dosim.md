# Pendências antes da publicação

## Acervo e referências

A DoSim confirmou que os arquivos de produto em `assets/img/` representam seus biscoitos. Eles são a fonte das fotos na abertura da home, nos presentes, nos sabores por gramatura, no portfólio, nos personalizados e nas apresentações das coleções. Os WebPs derivados preservam as cores, os carimbos e as embalagens dos arquivos fornecidos.

Cada uma das 31 coleções mostra um carimbo associado ao tema. Dia do Cliente e Brindes e Recepção usam fotos de produto da DoSim. Sete temas aproveitam imagens dos anúncios e 22 exibem novas inspirações ilustrativas. Para trocar uma inspiração pela foto de uma encomenda, atualize a origem e a descrição em `scripts/fotos-colecoes.cjs` e regenere o catálogo.

## Cadastro comercial

- **Quarteto DoSim.** A home online e a revisão anterior do projeto mostram 6un e R$ 22,00. A página de presentes e o registro do Quarteto em `data/precos.json` indicam quatro unidades e R$ 12,00. A marca precisa confirmar a composição, o preço vigente e se há duas apresentações. O redesign retirou a vitrine divergente da home. O cadastro e os valores dos demais fluxos foram preservados.
- **Chocolate e Ninho com Nutella.** A home anterior mostrava apresentações de 150 g. A página por gramatura apresenta opções de 200 g, 300 g e 500 g. Confirmar a situação da apresentação antiga antes de promovê-la novamente.
- **Medidas dos personalizados.** A página apresenta 4, 5, 6 e 7 cm como tamanhos. O código usa 14,4 g como peso estimado para o padrão de 6 cm, com comentário sobre uma amostra de 5 cm e 10 g e a hipótese de espessura constante. Falta confirmar qual dimensão foi medida, a espessura da amostra e o peso real por formato. O redesign preserva as estimativas, as regras de molde e os preços existentes.

## Integrações e material interno

O atendimento e os links temáticos têm um destino de WhatsApp configurado. A validação verificou o número e o texto preparado no navegador. O recebimento de mensagens pela equipe fica fora do teste local.

A prévia serve apenas arquivos do site e os dados públicos necessários. O repositório também contém documentação de custos e receitas. Antes de uma futura publicação, conferir a lista de arquivos do artefato público, inclusive material legado. Esta tarefa não alterou hospedagem, permissões nem produção.
