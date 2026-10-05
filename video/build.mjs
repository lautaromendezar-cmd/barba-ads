// Arma las variantes de video en src/<id>-<region>.html.
//   node build.mjs  →  después: sh render.sh v1-caba v2-interior …
// Mismo esquema que Desktop/Claude/ads/video: los <video> se escriben en el HTML
// (si se crean por script, el render no los ve) y render.sh copia cada variante a
// index.html, porque Hyperframes exige una sola raíz.
import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('src', { recursive: true });

const ENVIO = {
  caba: 'Envío sin cargo en CABA y Zona Norte',
  interior: 'Te lo llevamos sin cargo al expreso que elijas',
};
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const CAMION = `<svg viewBox="0 0 48 48" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 33.5V12.5h26.5v21"/><path d="M29 19.5h8.5l8 8.5v5.5H29"/><circle cx="13.5" cy="36.5" r="4"/><circle cx="36" cy="36.5" r="4"/><path d="M2.5 33.5h7M17.5 33.5h14.5"/></svg>`;

const HEAD = `<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
  @font-face { font-family: 'Cormorant Garamond'; font-weight: 600; src: url('assets/fonts/CormorantGaramond-600-latin.woff2') format('woff2'); }
  @font-face { font-family: 'Cormorant Garamond'; font-weight: 500; font-style: italic; src: url('assets/fonts/CormorantGaramond-500i-latin.woff2') format('woff2'); }
  @font-face { font-family: 'Montserrat'; font-weight: 400 800; src: url('assets/fonts/Montserrat-600-latin.woff2') format('woff2'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; background: #120c08; }
  :root { --negro: #120c08; --crema: #f3eadc; --oro: #d9b673; }
  body { color: var(--crema); font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; }
  #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: var(--negro); }
  .clip { position: absolute; inset: 0; }
  .full { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .velo { position: absolute; inset: 0; }
  .center { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
  .big { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 176px; line-height: .94; letter-spacing: -.01em; color: var(--crema); }
  .big em { font-style: italic; font-weight: 500; color: var(--oro); }
  .mid { font-size: 128px; }
  .line { display: block; overflow: hidden; padding: .02em .08em .12em; }
  .line > span { display: block; }
  .eyebrow { font-size: 26px; font-weight: 600; letter-spacing: .28em; text-transform: uppercase; color: var(--oro);
    display: flex; align-items: center; gap: 18px; }
  .eyebrow::before, .eyebrow::after { content: ''; width: 44px; height: 2px; background: var(--oro); }
  .sombra-txt { text-shadow: 0 4px 40px rgb(0 0 0 / .6); }
  /* el cierre: igual en las cuatro piezas */
  .fin .logo { height: 230px; width: auto; }
  .fin .big { margin-top: 70px; }
  .fin .sub { margin-top: 44px; font-size: 32px; font-weight: 500; line-height: 1.4; color: rgb(243 234 220 / .88); max-width: 820px; text-wrap: balance; }
  .fin .envio { margin-top: 40px; padding-top: 30px; border-top: 1px solid rgb(217 182 115 / .45); display: flex; gap: 18px; align-items: center;
    font-size: 30px; font-weight: 600; color: var(--oro); }
  .envio svg { width: 48px; height: 48px; stroke: var(--oro); fill: none; stroke-width: 1.8; flex: none; }
  .grano { position: absolute; inset: 0; pointer-events: none; opacity: .07; mix-blend-mode: overlay;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
</style>`;

// Cierre común: logo, frase, bajada y envío. Entra en `t`.
function fin(id, t, dur, { l1, l2, sub }, r) {
  return {
    html: `<section id="${id}" class="clip center fin" data-start="${t}" data-duration="${dur}" data-track-index="3">
    <div class="velo" style="background:radial-gradient(90% 60% at 50% 45%, #2a1d13, #120c08 75%)"></div>
    <div class="center" style="position:relative">
      <img class="logo" id="${id}-logo" src="assets/logos/grupo-barba-claro.png" alt="Grupo Barba">
      <h1 class="big mid"><span class="line"><span id="${id}-a">${esc(l1)}</span></span><span class="line"><span id="${id}-b"><em>${esc(l2)}</em></span></span></h1>
      <p class="sub" id="${id}-sub">${esc(sub)}</p>
      <div class="envio" id="${id}-env">${CAMION}<span>${esc(ENVIO[r])}</span></div>
    </div>
  </section>`,
    js: `
  tl.fromTo('#${id}', { opacity: 0 }, { opacity: 1, duration: .45, ease: 'power2.out' }, ${t});
  tl.fromTo('#${id}-logo', { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .7, ease: 'power3.out' }, ${t} + .05);
  up('#${id}-a', ${t} + .3); up('#${id}-b', ${t} + .45);
  tl.fromTo('#${id}-sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, ${t} + .85);
  tl.fromTo('#${id}-env', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, ${t} + 1.05);`,
  };
}

function pagina(dur, cuerpo, js) {
  return `<!doctype html>
<html lang="es">
<head>
${HEAD}
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${dur}" data-width="1080" data-height="1920">
${cuerpo}
  <div class="grano"></div>
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  const up = (sel, at, d = .6) => tl.fromTo(sel, { yPercent: 115 }, { yPercent: 0, duration: d, ease: 'power4.out' }, at);
${js}
  window.__timelines['main'] = tl;
</script>
</body>
</html>
`;
}

/* ── V1 · Directo de bodega (tipografía cinética + fotos + botellas reales) ── */
const MARCAS = [
  ['Michel Rolland', 'rolland'],
  ['Yacochuya', 'yacochuya'],
  ['Codorníu', 'maria-codorniu'],
  ['Colomé', 'amalaya'],
  ['Rosell Boher', 'rosell-boher'],
  ['Cruzat', 'cruzat-premier'],
];
function v1(r) {
  const M0 = 4.5, STEP = .52, M1 = M0 + MARCAS.length * STEP + .15; // fin de la ráfaga de marcas
  const P0 = M1, F0 = P0 + 1.5, DUR = F0 + 3.4;
  const f = fin('s5', F0, DUR - F0, { l1: 'Pedinos', l2: 'la lista.', sub: 'Precios por caja, directo de bodega.' }, r);
  const cuerpo = `
  <section id="s1" class="clip center" data-start="0" data-duration="2.1" data-track-index="1">
    <div class="velo" style="background:radial-gradient(80% 55% at 50% 50%, #2a1d13, #120c08 75%)"></div>
    <h1 class="big" style="position:relative"><span class="line"><span id="s1a">Directo</span></span><span class="line"><span id="s1b"><em>de bodega.</em></span></span></h1>
  </section>

  <section id="s2" class="clip" data-start="2.1" data-duration="${M0 - 2.1}" data-track-index="1">
    <div class="clip" id="s2f1"><img class="full" id="s2i1" src="assets/gen/cajas.jpg"></div>
    <div class="clip" id="s2f2"><img class="full" id="s2i2" src="assets/gen/cava.jpg"></div>
    <div class="velo" style="background:linear-gradient(rgb(18 12 8 / .35), rgb(18 12 8 / .82) 42%, rgb(18 12 8 / .82) 62%, rgb(18 12 8 / .35))"></div>
    <div class="clip center"><h1 class="big mid sombra-txt"><span class="line"><span id="s2a">Sin</span></span><span class="line"><span id="s2b"><em>intermediarios.</em></span></span></h1></div>
  </section>

  <section id="s3" class="clip" data-start="${M0}" data-duration="${(M1 - M0).toFixed(2)}" data-track-index="1">
    <div class="velo" style="background:radial-gradient(70% 45% at 50% 62%, #3a2817, #120c08 80%)"></div>
    <div class="center" style="position:absolute;left:0;right:0;top:300px"><p class="eyebrow" id="s3e">Las bodegas que buscás</p></div>
    ${MARCAS.map(([n, b], i) => `<div class="marca" id="m${i}">
      <div class="center" style="position:absolute;left:0;right:0;top:390px"><h2 class="big mid" style="white-space:nowrap">${esc(n)}</h2></div>
      <div style="position:absolute;left:0;right:0;top:600px;display:flex;justify-content:center"><img src="assets/botellas/${b}.png" style="height:900px;filter:drop-shadow(0 30px 40px rgb(0 0 0 / .6))"></div>
    </div>`).join('\n    ')}
  </section>

  <section id="s4" class="clip center" data-start="${P0}" data-duration="1.5" data-track-index="1">
    <div class="velo" style="background:radial-gradient(80% 55% at 50% 50%, #2a1d13, #120c08 75%)"></div>
    <h1 class="big mid" style="position:relative"><span class="line"><span id="s4a">Precio de</span></span><span class="line"><span id="s4b"><em>distribuidora.</em></span></span></h1>
  </section>
  ${f.html}`;
  const js = `
  // 1 · Directo de bodega
  up('#s1a', .1); up('#s1b', .28);
  tl.fromTo('#s1 .big', { scale: 1 }, { scale: 1.06, duration: 2.1, ease: 'none' }, 0);
  // 2 · fotos con empuje y corte; el texto encima
  tl.fromTo('#s2i1', { scale: 1.12 }, { scale: 1, duration: 1.3, ease: 'none' }, 2.1);
  tl.fromTo('#s2f2', { opacity: 0 }, { opacity: 1, duration: .25 }, 3.3);
  tl.fromTo('#s2i2', { scale: 1.12 }, { scale: 1.02, duration: 1.3, ease: 'none' }, 3.3);
  up('#s2a', 2.25); up('#s2b', 2.4);
  // 3 · ráfaga de bodegas con la botella real
  tl.fromTo('#s3e', { opacity: 0 }, { opacity: 1, duration: .3 }, ${M0} + .05);
  ${MARCAS.map((_, i) => {
    const t = (M0 + i * STEP).toFixed(2);
    return `tl.fromTo('#m${i}', { opacity: 0 }, { opacity: 1, duration: .12 }, ${t});
  tl.fromTo('#m${i} h2', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .35, ease: 'power3.out' }, ${t});
  tl.fromTo('#m${i} img', { y: 140, opacity: 0 }, { y: 0, opacity: 1, duration: .42, ease: 'power3.out' }, ${t});
  ${i < MARCAS.length - 1 ? `tl.to('#m${i}', { opacity: 0, duration: .1 }, ${(M0 + (i + 1) * STEP - .02).toFixed(2)});` : ''}`;
  }).join('\n  ')}
  // 4 · Precio de distribuidora
  up('#s4a', ${P0} + .05, .5); up('#s4b', ${P0} + .18, .5);
  // 5 · cierre
  ${f.js}`;
  return { dur: DUR.toFixed(2), html: pagina(DUR.toFixed(2), cuerpo, js) };
}

/* ── V2/V3/V4 · clip de Seedance con texto encima + cierre ── */
function clipConTexto({ clip, eyebrow, l1, l2, chip, extra, cierre, velo }, r) {
  const L1 = [].concat(l1);
  const C = 6, DUR = C + 3.6;
  const f = fin('fin', C, DUR - C, cierre, r);
  const cuerpo = `
  <video id="clip" class="clip" src="assets/clips/${clip}.mp4" data-start="0" data-duration="${C + .5}" data-track-index="0" muted playsinline style="object-fit:cover;width:100%;height:100%"></video>
  <div class="velo" style="background:${velo || 'linear-gradient(rgb(18 12 8 / .94), rgb(18 12 8 / .84) 34%, rgb(18 12 8 / .35) 50%, rgb(18 12 8 / 0) 60%, rgb(18 12 8 / .45))'}"></div>
  <section id="txt" class="clip" data-start="0" data-duration="${C}" data-track-index="1">
    <div style="position:absolute;left:80px;right:80px;top:300px">
      <p class="eyebrow" id="t0" style="justify-content:flex-start">${esc(eyebrow)}</p>
      <h1 class="big mid sombra-txt" style="margin-top:28px;text-align:left">${L1.map((x, i) => `<span class="line"><span id="t1${i}">${esc(x)}</span></span>`).join('')}<span class="line"><span id="t2"><em>${esc(l2)}</em></span></span></h1>
      ${chip ? `<div id="t3" style="display:inline-flex;align-items:baseline;gap:16px;margin-top:36px;padding:18px 28px 20px;border:2px solid var(--oro);background:rgb(18 12 8 / .55)">
        <span style="font-size:28px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--oro)">${esc(chip[0])}</span>
        <b style="font-size:72px;font-weight:800;letter-spacing:-.02em;line-height:1">${esc(chip[1])}</b>
        <span style="font-size:28px;color:rgb(243 234 220 / .8)">${esc(chip[2])}</span></div>` : ''}
      ${extra ? `<p id="t4" class="sombra-txt" style="margin-top:30px;font-size:32px;font-weight:500;line-height:1.4;max-width:860px">${esc(extra)}</p>` : ''}
    </div>
  </section>
  ${f.html}`;
  const js = `
  tl.fromTo('#t0', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .5, ease: 'power3.out' }, .3);
  ${L1.map((_, i) => `up('#t1${i}', ${(.5 + i * .15).toFixed(2)}, .7);`).join(' ')} up('#t2', 1.6, .7);
  ${chip ? `tl.fromTo('#t3', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, 2.6);` : ''}
  ${extra ? `tl.fromTo('#t4', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, ${chip ? 3.1 : 2.6});` : ''}
  ${f.js}`;
  return { dur: DUR, html: pagina(DUR, cuerpo, js) };
}

const V = {
  v1,
  v2: (r) =>
    clipConTexto({
      clip: 'servir', eyebrow: 'Ofertas de octubre', l1: '¿Qué vino llevás', l2: 'este finde?',
      cierre: { l1: 'Pedinos', l2: 'la lista.', sub: 'Precios por caja, directo de bodega.' },
    }, r),
  v3: (r) =>
    clipConTexto({
      clip: 'espumante', eyebrow: 'Para las fiestas', l1: ['Espumantes', 'de bodega,'], l2: 'a precio mayorista.',
      velo: 'linear-gradient(rgb(18 12 8 / .94), rgb(18 12 8 / .86) 38%, rgb(18 12 8 / .35) 52%, rgb(18 12 8 / 0) 62%, rgb(18 12 8 / .4))',
      chip: ['Desde', '$6.800', 'la botella'], extra: 'María Codorníu, Amalaya, Rosell Boher y Cruzat.',
      cierre: { l1: 'Pedinos', l2: 'la lista.', sub: 'Espumantes por caja, directo de bodega.' },
    }, r),
  v4: (r) =>
    clipConTexto(r === 'caba'
      ? { clip: 'reparto', velo: 'linear-gradient(rgb(18 12 8 / .94), rgb(18 12 8 / .86) 40%, rgb(18 12 8 / .35) 55%, rgb(18 12 8 / 0) 64%, rgb(18 12 8 / .4))', eyebrow: 'Envíos', l1: 'Pedís la caja,', l2: 'te la llevamos.',
          extra: 'Sin cargo en CABA y Zona Norte. Otras zonas del AMBA, consultanos.',
          cierre: { l1: 'Directo', l2: 'de bodega.', sub: 'Vinos, espumantes y regalos empresariales, por caja.' } }
      : { clip: 'reparto', velo: 'linear-gradient(rgb(18 12 8 / .94), rgb(18 12 8 / .86) 40%, rgb(18 12 8 / .35) 55%, rgb(18 12 8 / 0) 64%, rgb(18 12 8 / .4))', eyebrow: 'Envíos a todo el país', l1: ['¿Estás', 'en el interior?'], l2: 'Te lo llevamos al expreso.',
          extra: 'Sin cargo hasta el expreso que elijas. Venta por caja, directo de bodega.',
          cierre: { l1: 'Directo', l2: 'de bodega.', sub: 'Vinos, espumantes y regalos empresariales, por caja.' } }, r),
};

for (const [id, fn] of Object.entries(V))
  for (const r of ['caba', 'interior']) {
    const { dur, html } = fn(r);
    writeFileSync(`src/${id}-${r}.html`, html);
    console.log(`src/${id}-${r}.html  ${dur}s`);
  }
