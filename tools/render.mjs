// Renderiza las placas: node tools/render.mjs [B1 B2 …] [--f=45|916] [--r=caba|interior]
// Salida: <PIEZA>/opcion-N/<PIEZA>-oN-<region>-<4x5|9x16>.png
// Además verifica la zona segura de 9:16 (nada de texto arriba de 269px ni abajo de 1536px)
// y que ningún texto se salga del cuadro.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const piezas = args.filter((a) => !a.startsWith('--'));
const TODAS = ['B1', 'B2', 'B3', 'B4', 'B5'];
const FORMATOS = { 45: { h: 1350, tag: '4x5' }, 916: { h: 1920, tag: '9x16' } };
const REGIONES = ['caba', 'interior'];

const url = pathToFileURL(path.resolve('templates/placa.html')).href;
const browser = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
let problemas = 0;

for (const p of piezas.length ? piezas : TODAS)
  for (const [f, { h, tag }] of Object.entries(FORMATOS)) {
    if (flags.f && flags.f !== f) continue;
    const page = await browser.newPage({ viewport: { width: 1080, height: h } });
    page.on('pageerror', (e) => console.log('  error en la página:', e.message));
    await page.goto(`${url}?p=${p}&o=1&f=${f}`);
    const n = await page.evaluate(() => window.OPTIONS || 1);
    for (let o = 1; o <= n; o++)
      for (const r of REGIONES) {
        if (flags.r && flags.r !== r) continue;
        await page.goto(`${url}?p=${p}&o=${o}&f=${f}&r=${r}`, { waitUntil: 'load' });
        await page.evaluate(() => window.READY);
        const fuera = await page.evaluate(({ f, h }) => {
          const malos = [];
          const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          while (w.nextNode()) {
            const t = w.currentNode;
            if (!t.textContent.trim()) continue;
            const rg = document.createRange();
            rg.selectNodeContents(t);
            for (const q of rg.getClientRects()) {
              if (!q.width) continue;
              const lim = f === '916' ? [269, 1536] : [40, h - 40];
              if (q.top < lim[0] || q.bottom > lim[1] || q.left < 40 || q.right > 1040)
                malos.push(`${t.textContent.trim().slice(0, 28)} [${Math.round(q.left)},${Math.round(q.top)}–${Math.round(q.right)},${Math.round(q.bottom)}]`);
            }
          }
          // el título no puede pisar el pie
          const a = document.querySelector('.copy').getBoundingClientRect();
          const b = document.querySelector('.pie').getBoundingClientRect();
          if (a.bottom > b.top - 30) malos.push(`el titular pisa el pie (${Math.round(a.bottom)} vs ${Math.round(b.top)})`);
          return malos;
        }, { f, h });
        const dir = path.resolve(p, `opcion-${o}`);
        mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${p}-o${o}-${r}-${tag}.png`) });
        console.log(`${p} opción ${o} ${r} ${tag}${fuera.length ? '  ⚠ ' + fuera.join(' | ') : ''}`);
        problemas += fuera.length;
      }
    await page.close();
  }
await browser.close();
console.log(problemas ? `\n${problemas} problema(s)` : '\nsin problemas de zona segura');
