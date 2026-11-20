#!/usr/bin/env node
/* Confere as citações do jogo contra os textos-base em fontes/ e a integridade das referências.
 *
 *   node tools/verificar-citacoes.js                    -> relatório (sai com código 1 se houver pendência)
 *   node tools/verificar-citacoes.js --gravar-esperadas -> grava a lista atual de trechos fora das fontes
 *
 * O que ele checa:
 *  1. Todo trecho entre aspas “…” (e todo bloco de citação) deve existir, ignorando acentos, caixa e pontuação,
 *     em fontes/textos_do_folder.md ou em fontes/observancia-do-sabado-dsa-2023.txt. Reticências ([...] ou …) separam trechos.
 *  2. Trechos que NÃO estão nas fontes (versos bíblicos, falas dos personagens, rótulos do jogo) ficam em
 *     tools/citacoes-fora-das-fontes.json depois de revisados. Qualquer trecho novo fora da lista é apontado.
 *  3. Todo id usado em src/pins/rel/FAQ_SUGGEST/SEQ precisa existir.
 */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ESP = path.join(__dirname, 'citacoes-fora-das-fontes.json');
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const folder = fs.readFileSync(path.join(ROOT, 'fontes/textos_do_folder.md'), 'utf8');
const doc = fs.readFileSync(path.join(ROOT, 'fontes/observancia-do-sabado-dsa-2023.txt'), 'utf8');
const TEXT = ' ' + norm(folder) + ' ' + norm(doc) + ' ';

const code = ['content-a.js', 'content-b.js', 'faq.js'].map(f => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8')).join('\n') + '\n({CH, FAQ, SRC, FAQ_SUGGEST, SEQ})';
const D = vm.runInNewContext(code, {});

const esperadas = new Set(fs.existsSync(ESP) ? JSON.parse(fs.readFileSync(ESP, 'utf8')) : []);
let total = 0, ok = 0; const foraDasFontes = new Map();
const frags = q => String(q).split(/\[\.\.\.\]|…|\.\.\./).map(norm).filter(f => f.length >= 14);

function verificar(onde, q) {
  const fr = frags(q); if (!fr.length) return;
  total++;
  if (fr.every(f => TEXT.includes(f))) { ok++; return; }
  const chave = norm(q);
  if (!foraDasFontes.has(chave)) foraDasFontes.set(chave, { onde, q: String(q).slice(0, 120) });
}
function percorrer(v, p) {
  if (typeof v === 'string') { for (const m of v.matchAll(/“([^”]+)”/g)) verificar(p, m[1]); }
  else if (Array.isArray(v)) v.forEach((x, i) => percorrer(x, p + '[' + i + ']'));
  else if (v && typeof v === 'object' && !(v instanceof RegExp)) {
    for (const k of Object.keys(v)) { if (k === 'quote' && typeof v[k] === 'string') verificar(p + '.quote', v[k]); else percorrer(v[k], p + '.' + k); }
  }
}
D.CH.forEach(c => percorrer(c.steps, 'CH[' + c.id + ']'));
D.FAQ.forEach(f => percorrer(f.a, 'FAQ[' + f.id + ']'));

if (process.argv.includes('--gravar-esperadas')) {
  fs.writeFileSync(ESP, JSON.stringify([...foraDasFontes.keys()].sort(), null, 1) + '\n');
  console.log('Gravados', foraDasFontes.size, 'trechos esperados fora das fontes em', path.relative(ROOT, ESP));
  process.exit(0);
}

const ids = new Set(Object.keys(D.SRC)), problemas = [];
(function coletar(v, p, chave) {
  if (Array.isArray(v) && (chave === 'src' || chave === 'pins')) v.forEach(id => { if (!ids.has(id)) problemas.push(p + ' → fonte inexistente: ' + id); });
  else if (Array.isArray(v)) v.forEach((x, i) => coletar(x, p + '[' + i + ']', chave));
  else if (v && typeof v === 'object' && !(v instanceof RegExp)) for (const k of Object.keys(v)) coletar(v[k], p + '.' + k, k);
})(D.CH.map(c => ({ steps: c.steps, pins: c.pins })), 'CH', '');
const faqIds = new Set(D.FAQ.map(f => f.id));
D.FAQ.forEach(f => { (f.src || []).forEach(id => { if (!ids.has(id)) problemas.push('FAQ[' + f.id + '] fonte inexistente: ' + id); }); (f.rel || []).forEach(id => { if (!faqIds.has(id)) problemas.push('FAQ[' + f.id + '] relacionado inexistente: ' + id); }); });
D.FAQ_SUGGEST.forEach(id => { if (!faqIds.has(id)) problemas.push('FAQ_SUGGEST inexistente: ' + id); });
D.SEQ.forEach(id => { if (!D.CH.find(c => c.id === id)) problemas.push('SEQ com canal inexistente: ' + id); });

const novos = [...foraDasFontes.entries()].filter(([k]) => !esperadas.has(k));
console.log(`Trechos entre aspas: ${total} · batem com as fontes: ${ok} · fora das fontes (revisados): ${foraDasFontes.size - novos.length} · NOVOS fora das fontes: ${novos.length}`);
novos.forEach(([, v]) => console.log(`  ? ${v.onde}\n      “${v.q}”`));
console.log(problemas.length ? 'Integridade: ' + problemas.length + ' problema(s)\n  ' + problemas.join('\n  ') : 'Integridade: ok (fontes, relacionados, sugestões e sequência existem)');
if (novos.length) console.log('\nRevise os novos trechos. Se forem versos bíblicos, falas de personagens ou rótulos do jogo, rode com --gravar-esperadas.');
process.exit(novos.length || problemas.length ? 1 : 0);
