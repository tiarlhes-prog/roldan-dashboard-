#!/usr/bin/env node
/* Gera os ícones do app (PNG) a partir do logo em SVG, com o Chromium do Playwright.
 *   node tools/gerar-icones.js            -> grava src/icons/*  (o build copia para server/public)
 * Rode de novo só se mudar o logo. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const DEFS = '<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5b94a"/><stop offset=".62" stop-color="#ff8a5c"/><stop offset="1" stop-color="#8f83ff"/></linearGradient></defs>';
const ART = '<path d="M10 31a14 14 0 0 1 28 0z" fill="#fff"/><path d="M8 35.5h32M13 40h22" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".9" fill="none"/>';
const svg = (inner, round) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${DEFS}<rect width="48" height="48"${round ? ' rx="10"' : ''} fill="url(#lg)"/>${inner}</svg>`;
const SVG_ICON = svg(ART, true);                                                        // ícone da aba (cantos arredondados)
const SVG_FULL = svg(ART, false);                                                       // PNGs "any": sangra até a borda
const SVG_MASK = svg(`<g transform="translate(24 24) scale(.7) translate(-24 -24)">${ART}</g>`, false);   // maskable: arte na zona segura (80%)

(async () => {
  const out = path.join(__dirname, '..', 'src', 'icons');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'icon.svg'), SVG_ICON);
  const br = await chromium.launch(), pg = await br.newPage();
  const shot = async (markup, size, file) => {
    await pg.setViewportSize({ width: size, height: size });
    await pg.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${markup}`);
    await pg.screenshot({ path: path.join(out, file), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
    console.log('✓', file, size + 'px');
  };
  await shot(SVG_FULL, 192, 'icon-192.png');
  await shot(SVG_FULL, 512, 'icon-512.png');
  await shot(SVG_MASK, 512, 'icon-maskable-512.png');
  await shot(SVG_FULL, 180, 'apple-touch-icon.png');
  await br.close();
})();
