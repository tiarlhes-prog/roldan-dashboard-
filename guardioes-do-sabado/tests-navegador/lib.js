/* Utilitários dos testes de navegador. Precisa de: Playwright (com Chromium), Python 3 e `npm ci` dentro de server/.
 * A cada execução gera uma versão de teste do jogo (com window.__GS) em uma pasta temporária e sobe o servidor REAL
 * (Express + SQLite em memória) com ela. Capturas de tela vão para <pasta temporária>/shots*. */
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { console.error('Faltou o Playwright. Instale com: npm i -g playwright && npx playwright install chromium'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..');                                   // guardioes-do-sabado/
if (!fs.existsSync(path.join(ROOT, 'server', 'node_modules'))) { console.error('Rode antes: cd server && npm ci'); process.exit(2); }
const { criarApp } = require(path.join(ROOT, 'server', 'src', 'app.js'));
const SP = fs.mkdtempSync(path.join(os.tmpdir(), 'gs-e2e-'));                // pasta de trabalho desta execução
execFileSync('python3', [path.join(ROOT, 'build.py'), '--server', path.join(SP, 'pub'), '--debug'], { stdio: 'ignore' });
console.log('Pasta de trabalho e capturas:', SP);

let ok = 0, bad = 0; const falhas = [];
const check = (cond, msg) => { if (cond) { ok++; console.log('  ✔', msg); } else { bad++; falhas.push(msg); console.log('  ✖ FALHOU:', msg); } };
const resumo = () => { console.log(`\n== ${ok} ok, ${bad} falhas`); if (bad) console.log(falhas.map(f => ' - ' + f).join('\n')); return bad; };
async function subir(extra = {}) {
  const inst = criarApp(Object.assign({ dbPath: ':memory:', adminUser: 'Líder', adminPassword: 'senha-do-lider-123', cookieSecure: false, bcryptCusto: 4,
    publicDir: path.join(SP, 'pub'), responsavel: 'Pr. Tiarlhes', contato: 'contato@exemplo.com',
    limites: { loginIp: 1000, loginPar: 1000, loginApelido: 1000, cadastroIp: 1000, senha: 1000, progresso: 10000, geral: 100000 } }, extra));
  const srv = await new Promise(r => { const s = inst.app.listen(0, '127.0.0.1', () => r(s)); });
  return { ...inst, base: 'http://127.0.0.1:' + srv.address().port, parar: async () => { await new Promise(r => srv.close(r)); inst.fechar(); } };
}
async function novoContexto(br, opts = {}) {
  const ctx = await br.newContext(Object.assign({ locale: 'pt-BR' }, opts));
  const pg = await ctx.newPage();
  pg.erros = [];
  pg.on('pageerror', e => pg.erros.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource.*(401|403|409|400|429)/.test(m.text())) pg.erros.push('console: ' + m.text()); });
  return { ctx, pg };
}
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36' };
module.exports = { chromium, ROOT, SP, check, resumo, subir, novoContexto, MOBILE, fs, path };
