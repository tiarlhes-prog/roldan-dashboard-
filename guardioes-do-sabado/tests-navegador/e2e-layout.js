/* Layout em 8 tamanhos de tela (320 px a 1920 px, celular em pé e deitado, tablet, computador): sem rolagem lateral, alvos de toque
 * de pelo menos 40 px, topo que cabe, janelas que cabem, painel do líder e ranking com dados realistas.
 * Uso: node tests-navegador/e2e-layout.js */
/* Teste visual e de layout: vários tamanhos, dados realistas. Gera capturas em shots2/ e mede problemas. */
const { chromium, check, resumo, subir, novoContexto, SP, path, ROOT } = require('./lib');
const bcrypt = require(ROOT + '/server/node_modules/bcryptjs');
const shots = path.join(SP, 'shots2'); require('fs').mkdirSync(shots, { recursive: true });
const SIZES = [
  ['se-320', { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['android-360', { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['iphone-390', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['pixel-412', { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['land-844', { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['tablet-820', { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }],
  ['desk-1366', { viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 }],
  ['wide-1920', { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 }]
];
const NOMES = ['Rafa_10', 'Maria Clara', 'JoãoPedro', 'Ana_Luz', 'Lucas.S', 'Bia Santos', 'Thiago77', 'Gabi_Fé', 'Pedro H', 'Larissa', 'Davi_10', 'Esther'];
const AVS = ['🙂', '😎', '🦁', '🦅', '🌿', '🔥', '⭐', '🎧', '🎮', '📖', '🛡️', '🕊️'];
function semear(s) {
  const hash = bcrypt.hashSync('Senha-forte-1', 4), t = new Date().toISOString(), antigo = new Date(Date.now() - 60 * 86400e3).toISOString();
  const ins = s.db.prepare("INSERT INTO gs_users (apelido, chave, senha_hash, nome, grupo, avatar, status, role, mostrar_ranking, aceite_em, aceite_versao, criado_em, aprovado_em, ultimo_acesso) VALUES (?,?,?,?,?,?,?,'jogador',?,?,?,?,?,?)");
  const prog = s.db.prepare('INSERT INTO gs_progress (user_id, xp, done, badges, streak, semanas, atualizado_em) VALUES (?,?,?,?,?,?,?)');
  NOMES.forEach((n, i) => {
    const st = i < 9 ? 'ativo' : i === 9 ? 'ativo' : i === 10 ? 'pendente' : 'bloqueado';
    const id = ins.run(n, n.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, ''), hash, 'Nome Completo de ' + n, i % 2 ? 'Clube Sentinelas' : 'Igreja Central', AVS[i], st, 1, t, '2026-11-21', antigo, t, t).lastInsertRowid;
    prog.run(id, st === 'ativo' ? 3400 - i * 290 : 0, JSON.stringify(['boas-vindas', 'como-jogar', '1-criacao', '1-sinal'].slice(0, 1 + (i % 4))), '["f1"]', i % 5, Math.max(0, 8 - i), t);
  });
}
const overflowX = pg => pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, off: [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > window.innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.nav,.members,.chips,.adm-tabs,.scrim,#layer,.rail'); }).slice(0, 4).map(e => e.className + ':' + Math.round(e.getBoundingClientRect().right)) }));
const overflowIn = (pg, sel) => pg.evaluate(sel => {
  const box = document.querySelector(sel); if (!box) return ['(sem ' + sel + ')'];
  const R = box.getBoundingClientRect();
  return [...box.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > R.right + 1 && !e.closest('.adm-tabs,.chips,.avpick'); })
    .slice(0, 4).map(e => (e.className || e.tagName) + ' +' + Math.round(e.getBoundingClientRect().right - R.right) + 'px');
}, sel);
const tiny = pg => pg.evaluate(() => {
  if (!matchMedia('(pointer: coarse)').matches) return [];
  return [...document.querySelectorAll('button, a[href], input:not([type=checkbox]):not([type=hidden]), textarea')].filter(e => {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || e.closest('[hidden],[inert]') || e.disabled) return false;
    if (r.right < 0 || r.left > innerWidth) return false;       // fora da tela (gaveta fechada)
    if (e.classList.contains('lk')) return false;               // links em texto corrido
    return Math.min(r.width, r.height) < 40;
  }).slice(0, 6).map(e => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
});
(async () => {
  const s = await subir(); semear(s);
  const br = await chromium.launch();
  for (const [nome, opts] of SIZES) {
    console.log('\n### ' + nome);
    const mobile = opts.viewport.width < 761;
    const { pg } = await novoContexto(br, Object.assign({}, opts));
    // --- portão
    await pg.goto(s.base + '/'); await pg.waitForSelector('#fLogin'); await pg.waitForTimeout(350);
    let o = await overflowX(pg); check(o.sw <= o.iw, `login sem rolagem horizontal (${o.sw}/${o.iw}) ${o.off.join(',')}`);
    let t = await tiny(pg); check(t.length === 0, 'login: alvos de toque ≥40px ' + t.join(' | '));
    await pg.screenshot({ path: `${shots}/${nome}-1-login.png` });
    // --- entra como jovem liberado
    await pg.fill('#lgUser', 'Rafa_10'); await pg.fill('#lgPass', 'Senha-forte-1'); await pg.click('#gSubmit');
    await pg.waitForFunction(() => window.__GS && window.__GS.GAME_ON, null, { timeout: 12000 });
    await pg.waitForTimeout(1500);
    await pg.evaluate(() => { const g = window.__GS; g.addXP(40); });
    o = await overflowX(pg); check(o.sw <= o.iw, `jogo sem rolagem horizontal (${o.sw}/${o.iw}) ${o.off.join(',')}`);
    t = await tiny(pg); check(t.length === 0, 'jogo: alvos de toque ≥40px ' + t.join(' | '));
    const bar = await pg.evaluate(() => [...document.querySelectorAll('.topbar > *')].filter(e => e.offsetParent !== null).map(e => ({ c: e.className.split(' ')[0], r: Math.round(e.getBoundingClientRect().right), w: Math.round(e.getBoundingClientRect().width) })));
    check(bar.every(b => b.r <= opts.viewport.width), 'botões do topo cabem na largura: ' + bar.map(b => b.c + '@' + b.r).join(' '));
    const nm = await pg.evaluate(() => { const e = document.querySelector('.tb-name'); return Math.round(e.getBoundingClientRect().width) + 'px de largura p/ o nome, texto cortado=' + (e.scrollWidth > e.clientWidth); });
    console.log('    ', nm);
    await pg.screenshot({ path: `${shots}/${nome}-2-jogo.png` });
    // --- ranking
    await pg.click('.tb-rank'); await pg.waitForSelector('#rankboard .rk-row'); await pg.waitForTimeout(500);
    o = await overflowX(pg); check(o.sw <= o.iw, `ranking sem rolagem horizontal ${o.off.join(',')}`);
    check(await pg.evaluate(() => document.querySelectorAll('#rankboard .rk-row').length) >= 9, 'ranking lista os jovens ativos (≥9)');
    check(!(await pg.textContent('#rankboard')).match(/Nome Completo|Clube Sentinelas|Igreja Central/), 'ranking sem nome real/grupo');
    check(!(await pg.textContent('#rankboard')).match(/Esther|Davi_10/), 'bloqueados/pendentes fora do ranking');
    let ok2 = await overflowIn(pg, '#rankboard'); check(ok2.length === 0, 'ranking: nada estoura o quadro ' + ok2.join(' | '));
    await pg.screenshot({ path: `${shots}/${nome}-3-ranking.png` });
    // --- gaveta (celular)
    if (mobile) {
      await pg.click('[data-act="nav"]'); await pg.waitForTimeout(500);
      await pg.screenshot({ path: `${shots}/${nome}-4-gaveta.png` });
      await pg.click('.shead-x'); await pg.waitForTimeout(350);
      await pg.click('[data-act="mem"]'); await pg.waitForTimeout(500);
      await pg.screenshot({ path: `${shots}/${nome}-4b-membros.png` });
      await pg.click('.mem-x'); await pg.waitForTimeout(350);
    }
    // --- configurações (folha na base no celular)
    await pg.evaluate(() => window.__GS.openChannel('boas-vindas', { force: true }));
    await pg.evaluate(() => document.querySelector('.ub-btn[data-act="settings"]').click());
    await pg.waitForSelector('.modal h2'); await pg.waitForTimeout(450);
    const m = await pg.evaluate(() => { const r = document.querySelector('.modal').getBoundingClientRect(); return { b: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width) }; });
    check(m.b <= opts.viewport.height + 1 && m.w <= opts.viewport.width, `janela de configurações cabe na tela (${m.w}x${m.h}, base ${m.b})`);
    let oi = await overflowIn(pg, '.modal'); check(oi.length === 0, 'configurações: nada estoura a janela ' + oi.join(' | '));
    await pg.screenshot({ path: `${shots}/${nome}-5-config.png` });
    await pg.keyboard.press('Escape');
    check(pg.erros.length === 0, 'sem erros de JS: ' + pg.erros.join(' / '));
    await pg.context().close();

    // --- líder
    const L = await novoContexto(br, Object.assign({}, opts));
    await L.pg.goto(s.base + '/'); await L.pg.waitForSelector('#fLogin');
    await L.pg.fill('#lgUser', 'Líder'); await L.pg.fill('#lgPass', 'senha-do-lider-123'); await L.pg.click('#gSubmit');
    await L.pg.waitForFunction(() => window.__GS && window.__GS.GAME_ON, null, { timeout: 12000 });
    await L.pg.waitForTimeout(800);
    await L.pg.evaluate(() => { const b = document.querySelector('.tb-menu'); if (getComputedStyle(b).display !== 'none') { b.click(); } });
    await L.pg.waitForTimeout(450);
    const abrir = await L.pg.evaluate(() => { const q = [...document.querySelectorAll('[data-act="admin"]')].find(e => e.offsetParent !== null && e.getBoundingClientRect().right > 0); if (q) { q.click(); return true; } return false; });
    check(abrir, 'botão do painel do líder acessível');
    await L.pg.waitForSelector('.adm-card'); await L.pg.waitForTimeout(500);
    o = await overflowX(L.pg); check(o.sw <= o.iw, `painel sem rolagem horizontal ${o.off.join(',')}`);
    t = await tiny(L.pg); check(t.length === 0, 'painel: alvos de toque ≥40px ' + t.join(' | '));
    let oj = await overflowIn(L.pg, '.modal'); check(oj.length === 0, 'painel (pendentes): nada estoura a janela ' + oj.join(' | '));
    await L.pg.screenshot({ path: `${shots}/${nome}-6-painel-pendentes.png` });
    await L.pg.click('[data-act="adm-tab"][data-id="ativo"]'); await L.pg.waitForTimeout(300);
    oj = await overflowIn(L.pg, '.modal'); check(oj.length === 0, 'painel (ativos): nada estoura a janela ' + oj.join(' | '));
    await L.pg.screenshot({ path: `${shots}/${nome}-7-painel-ativos.png` });
    await L.pg.click('[data-act="adm-tab"][data-id="resumo"]'); await L.pg.waitForTimeout(300);
    await L.pg.screenshot({ path: `${shots}/${nome}-8-painel-resumo.png` });
    check(L.pg.erros.length === 0, 'líder sem erros de JS: ' + L.pg.erros.join(' / '));
    await L.ctx.close();
  }
  await br.close(); await s.parar();
  process.exit(resumo() ? 1 : 0);
})().catch(e => { console.error('ERRO NO TESTE:', e); process.exit(2); });
