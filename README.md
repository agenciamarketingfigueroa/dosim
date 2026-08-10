# DoSim Confeitaria - Site Estático (GitHub Pages)

Projeto completo em **HTML, CSS e JavaScript puro** para a DoSim Confeitaria, com foco em:

- Catálogo com preços via `data/precos.json`
- Orçamento via WhatsApp com mensagens prontas
- Visual premium minimalista (fofo-adulto)
- Estrutura mobile-first, responsiva e acessível

## Estrutura de arquivos

```text
.
|-- assets/
|   |-- icons/
|   |   `-- favicon.svg
|   `-- img/
|       |-- dosim-banner1920x1080.svg
|       |-- logo-dosim.svg
|       |-- og-1200x630.svg
|       `-- [imagens dos produtos].svg
|-- css/
|   `-- styles.css
|-- data/
|   |-- custos-receitas.md
|   `-- precos.json
|-- js/
|   |-- contato.js
|   |-- main.js
|   |-- portfolio.js
|   `-- produtos.js
|-- contato.html
|-- corporativo.html
|-- encomendar.html
|-- gramatura.html
|-- index.html
|-- portfolio.html
|-- produtos.html
|-- sazonais.html
|-- 404.html
|-- robots.txt
|-- sitemap.xml
`-- README.md
```

## Rodar localmente

### Opção 1 (recomendada): Live Server (VS Code)

1. Instale a extensão **Live Server**.
2. Abra a pasta do projeto no VS Code.
3. Clique com botão direito em `index.html`.
4. Selecione **Open with Live Server**.

### Opção 2: servidor local simples

Se tiver Python instalado:

```bash
python -m http.server 5500
```

Depois acesse `http://localhost:5500`.

## Publicar no GitHub Pages

1. Faça commit e push dos arquivos para o GitHub.
2. No repositório, abra **Settings > Pages**.
3. Em **Source**, selecione:
   - Branch: `main` (ou sua branch principal)
   - Folder: `/ (root)`
4. Salve e aguarde o GitHub publicar.
5. O domínio de produção é `https://dosim.com.br/`.

## URLs públicas

O GitHub Pages entrega os arquivos `.html` também em URLs limpas. Use sempre os endereços sem extensão nos links,
metadados e divulgações, por exemplo: `/produtos`, `/gramatura` e `/contato`. As versões com `.html` permanecem
acessíveis por compatibilidade, mas os canonicals e o sitemap apontam para as URLs limpas.

## Como trocar as imagens

Substitua imagens mantendo os mesmos nomes de arquivo ou atualize os caminhos no HTML.

Tamanhos recomendados:

- `assets/img/dosim-banner1920x1080.svg` -> **1920x1080**
- `assets/img/og-1200x630.svg` -> **1200x630**
- imagens do portfólio -> preferencialmente **1200x1200**

Formatos recomendados para produção: `.jpg` ou `.webp` (foto) e `.svg` (arte vetorial/logo).

## Como atualizar os preços do catálogo

1. Abra `data/precos.json`.
2. Edite os campos dos itens:
   - `nome`
   - `unidades`
   - `precoVenda`
   - `descricao`
   - `destaque` (`true` ou `false`)
3. Salve o arquivo.
4. Recarregue a página `/produtos` para ver tabela e cards atualizados.

## Custos das receitas

A tabela de custos, suas premissas e os cálculos de referência estão em
`data/custos-receitas.md`.

## Frete calculado no carrinho

Ao escolher **Entrega**, o carrinho calcula uma estimativa pela rota e exige a confirmação do cálculo antes de abrir o pedido no WhatsApp. A regra fica no início de `js/main.js`, em `SHIPPING_RULES`.

- `origin`: coordenada pública de referência para a rota; o endereço interno da DoSim não deve ser incluído no site;
- `priceBands`: faixas provisórias de distância e preço, calibradas com cotações fora do horário de pico;
- `maximumRouteKm`: limite máximo da rota.

Faixas provisórias vigentes:

| Distância da rota | Frete |
| ---: | ---: |
| Até 2 km | R$ 7,00 |
| Até 5 km | R$ 8,00 |
| Até 8 km | R$ 11,00 |
| Até 12 km | R$ 14,00 |
| Até 16 km | R$ 21,50 |
| Até 20 km | R$ 27,00 |

Esses valores devem ser recalibrados depois da coleta em horário de pico. Para usar a origem exata sem expô-la no código público, o cálculo da rota deve ser movido para um serviço privado de backend.

O cálculo é uma estimativa exibida ao cliente e é incluído na mensagem de pedido do WhatsApp.

## Controle local de pedidos

A página `/pedidos` permite cadastrar manualmente nome do cliente, data de entrega, sabores e quantidades. Os pedidos recebem numeração sequencial automática e podem ser editados, concluídos, reabertos ou excluídos.

Os dados são armazenados no `localStorage` do navegador e não são sincronizados entre dispositivos. Use **Exportar backup** regularmente para evitar perda de dados caso o armazenamento do navegador seja apagado. A senha da página é apenas uma barreira visual em um site estático; autenticação realmente segura exige backend.

## Caixa e controle de vendas

A página `/caixa`, acessível pela área interna, registra vendas e saídas com data, categoria, forma de pagamento e valor. Nas vendas, também são informados o presenteável ou o sabor vendido por gramatura, o peso da embalagem (incluindo gramaturas personalizadas) e a quantidade. A aba **Dashboard** mostra vendas, despesas, resultado, ticket médio, produtos mais vendidos, evolução do faturamento e distribuição por forma de pagamento para o mês selecionado ou para todo o período. A tela também permite busca, filtros, edição e exclusão dos lançamentos.

Assim como os pedidos, o caixa usa apenas o `localStorage`. **Exportar sessão** gera um arquivo JSON com todos os lançamentos; **Importar sessão** restaura esse arquivo e substitui os dados locais do navegador atual. Exporte uma cópia com frequência e antes de trocar de dispositivo ou limpar os dados do navegador.

## WhatsApp e contatos oficiais no projeto

- WhatsApp: `https://wa.me/5531996154698`
- Instagram: `https://www.instagram.com/dosimconfeitaria/`
- Local exibido: **Contagem - MG**

## Checklist final de publicação

- [ ] Conferir textos e links das páginas
- [ ] Trocar placeholders pelas imagens finais
- [ ] Validar `data/precos.json` com os preços atuais
- [ ] Testar no mobile e desktop
- [ ] Testar formulários de WhatsApp (`encomendar` e `contato`)
- [ ] Verificar metadados SEO (title/description/OG)
- [ ] Publicar no GitHub Pages
- [ ] Testar a URL pública final
