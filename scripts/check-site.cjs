/* Check public static pages, their assets and local links without a browser. */
const fs = require('node:fs');
const path = require('node:path');
const { routeSources } = require('./build-routes.cjs');
const root = path.resolve(__dirname, '..');
const pages = fs.readdirSync(root).filter(name=>name.endsWith('.html'));
pages.push('links/index.html','link/index.html');
for(const theme of require('../data/colecoes.json').themes)pages.push(`colecoes/${theme.id}/index.html`);
const errors=[];
for (const source of routeSources()) {
  const index = path.join(path.basename(source, '.html'), 'index.html');
  const entry = path.join(root, index);
  if (!fs.existsSync(entry) || !fs.readFileSync(entry).equals(fs.readFileSync(path.join(root, source)))) {
    errors.push(`${index}: missing or outdated; run node scripts/build-routes.cjs`);
  } else {
    pages.push(index);
  }
}
let references=0;
const decode = value => value.replaceAll('&amp;', '&');
function resolveLocal(url) {
  const pathname=decodeURIComponent(url.pathname);
  const local=path.resolve(root,'.'+pathname);
  if(!local.startsWith(root+path.sep)&&local!==root)throw Error('Path escapes site: '+pathname);
  if(fs.existsSync(local)&&fs.statSync(local).isDirectory())return path.join(local,'index.html');
  return local;
}
for(const page of pages){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)errors.push(`${page}: duplicate IDs`);
  if(!page.startsWith('link/')&&!html.includes('/css/cute.css'))errors.push(`${page}: missing theme`);
  for(const match of html.matchAll(/\b(?:href|src|data-image|data-photo-src)="([^"]+)"/g)){
    const value=decode(match[1]);
    if(!value||value==='#'||/^(data:|mailto:|tel:|javascript:)/.test(value))continue;
    const url=new URL(value,'https://dosim.com.br/'+page);
    if(url.origin!=='https://dosim.com.br')continue;
    references++;
    const target=resolveLocal(url);
    if(!fs.existsSync(target)){errors.push(`${page}: missing ${value}`);continue;}
    if(url.hash&&target.endsWith('.html')){
      const targetHtml=fs.readFileSync(target,'utf8');
      if(!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))errors.push(`${page}: missing anchor ${value}`);
    }
  }
}
if(errors.length)throw Error(errors.join('\n'));
console.log(`Verified ${pages.length} pages and ${references} local references.`);
module.exports={pages:pages.length,references};
