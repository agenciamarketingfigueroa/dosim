// Publica a mesma página nas duas formas aceitas pelo site: /nome/ e /nome.html.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

function routeSources() {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter(file => file.isFile() && file.name.endsWith('.html') &&
      file.name !== 'index.html' && file.name !== '404.html')
    .map(file => file.name);
}

function buildRoutes() {
  for (const source of routeSources()) {
    const directory = path.join(root, path.basename(source, '.html'));
    fs.mkdirSync(directory, { recursive: true });
    fs.copyFileSync(path.join(root, source), path.join(directory, 'index.html'));
  }
}

if (require.main === module) buildRoutes();
module.exports = { buildRoutes, routeSources };
