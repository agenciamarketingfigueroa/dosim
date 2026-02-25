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
|       |-- hero-1600x900.svg
|       |-- logo-placeholder.svg
|       |-- og-1200x630.svg
|       |-- portfolio-01.svg
|       |-- portfolio-02.svg
|       |-- portfolio-03.svg
|       |-- portfolio-04.svg
|       |-- portfolio-05.svg
|       |-- portfolio-06.svg
|       |-- portfolio-07.svg
|       |-- portfolio-08.svg
|       |-- portfolio-09.svg
|       |-- portfolio-10.svg
|       |-- portfolio-11.svg
|       `-- portfolio-12.svg
|-- css/
|   `-- styles.css
|-- data/
|   `-- precos.json
|-- js/
|   |-- contato.js
|   |-- main.js
|   |-- portfolio.js
|   `-- produtos.js
|-- contato.html
|-- corporativo.html
|-- encomendar.html
|-- index.html
|-- portfolio.html
|-- produtos.html
|-- sazonais.html
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
5. A URL ficará no formato: `https://SEU-USUARIO.github.io/SEU-REPO/`.

## Como trocar as imagens

As imagens atuais são placeholders em SVG. Substitua mantendo os mesmos nomes de arquivo (ou atualize os caminhos no HTML).

Tamanhos recomendados:

- `assets/img/hero-1600x900.svg` -> **1600x900**
- `assets/img/og-1200x630.svg` -> **1200x630**
- `assets/img/logo-placeholder.svg` -> **360x360** (ou proporção de logo horizontal, ajustando no CSS)
- `assets/img/portfolio-01.svg` até `portfolio-12.svg` -> **1200x1200**

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
4. Recarregue a página `produtos.html` para ver tabela e cards atualizados.

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
