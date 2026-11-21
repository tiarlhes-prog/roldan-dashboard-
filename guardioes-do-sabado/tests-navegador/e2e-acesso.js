/* Fluxo completo da versão com login, no navegador (celular + computador): pedir acesso → líder libera → jogo → sincronização
 * só de números (respostas NÃO vão ao servidor) → ranking → configurações → sessão cai e volta → bloqueio.
 * Uso: node tests-navegador/e2e-acesso.js */
const { chromium, check, resumo, subir, novoContexto, MOBILE, SP, path } = require('./lib');
const shots = path.join(SP, 'shots'); require('fs').mkdirSync(shots, { recursive: true });
(async () => {
  const s = await subir();
  const br = await chromium.launch();
  const jovem = await novoContexto(br, MOBILE), lider = await novoContexto(br, { viewport: { width: 1366, height: 768 } });
  const J = jovem.pg, L = lider.pg;

  console.log('1) Portão de acesso (celular)');
  await J.goto(s.base + '/');
  await J.waitForSelector('#gate:not([hidden]) #fLogin', { timeout: 8000 });
  check(await J.evaluate(() => document.body.classList.contains('gated')), 'corpo marcado como "gated"');
  check(await J.evaluate(() => getComputedStyle(document.querySelector('.app')).visibility === 'hidden'), 'jogo escondido atrás do portão');
  check(await J.evaluate(() => document.querySelector('#app').hasAttribute('inert')), 'jogo inerte (foco/leitor de tela não entram)');
  await J.screenshot({ path: shots + '/01-login-390.png' });

  console.log('2) Cadastro');
  await J.click('[data-g="to-register"]');
  await J.waitForSelector('#fReg');
  await J.screenshot({ path: shots + '/02-register-390.png', fullPage: false });
  // validação do lado do navegador
  await J.click('#gSubmit');
  check(await J.locator('#gErr .note.bad').count() === 1, 'erro aparece ao enviar vazio');
  await J.fill('#rgUser', 'Davi_10'); await J.fill('#rgPass', 'Senha-forte-1'); await J.fill('#rgName', 'Davi Souza'); await J.fill('#rgGroup', 'Clube Sentinelas');
  await J.click('#rgAv button:nth-child(3)');
  await J.click('#gSubmit');
  check(await J.locator('#ckA.bad').count() === 1, 'caixas de aceite destacadas quando faltam');
  await J.check('#rgOk1'); await J.check('#rgOk2');
  await J.click('#gSubmit');
  await J.waitForSelector('#gateBody .steps', { timeout: 8000 });
  check((await J.textContent('#gateBody h2')).includes('Davi_10'), 'tela de espera cumprimenta pelo apelido');
  check((await J.textContent('#gateBody')).includes('Pr. Tiarlhes'), 'mostra o nome do responsável configurado');
  await J.screenshot({ path: shots + '/03-pending-390.png' });

  console.log('3) O líder vê o pedido e libera');
  await L.goto(s.base + '/');
  await L.waitForSelector('#fLogin');
  await L.fill('#lgUser', 'líder'); await L.fill('#lgPass', 'senha-do-lider-123'); await L.click('#gSubmit');
  await L.waitForSelector('.app:not([inert])', { timeout: 8000 });
  await L.waitForFunction(() => window.__GS && window.__GS.GAME_ON);
  check(await L.evaluate(() => window.__GS.ME.role === 'superadmin'), 'líder entrou com papel superadmin');
  await L.waitForSelector('#railAdm:not([hidden])');
  await L.waitForFunction(() => !document.querySelector('#railAdmDot').hidden);
  check((await L.textContent('#railAdmDot')) === '1', 'ponto vermelho no trilho mostra 1 pedido');
  await L.screenshot({ path: shots + '/04-lider-desktop.png' });
  await L.click('#railAdm');
  await L.waitForSelector('.adm-card');
  check((await L.textContent('.adm-card')).includes('Davi Souza'), 'painel mostra o nome real para o líder reconhecer');
  check(!(await L.textContent('.adm-card')).includes('Senha-forte'), 'painel não mostra senha');
  await L.screenshot({ path: shots + '/05-painel-lider-desktop.png' });
  await L.click('[data-act="adm-do"][data-op="aprovar"]');
  await L.waitForFunction(() => document.querySelector('#admBody .adm-empty'), null, { timeout: 8000 });
  check(true, 'pedido saiu da fila de pendentes depois de liberar');

  console.log('4) O jovem entra sozinho');
  await J.click('[data-g="check"]', { timeout: 2500 }).catch(() => {});   // se o sorteio de verificação automática já entrou, tudo bem
  await J.waitForFunction(() => window.__GS && window.__GS.GAME_ON, null, { timeout: 25000 });
  check(await J.evaluate(() => !document.body.classList.contains('gated')), 'portão fechou');
  check(await J.evaluate(() => window.__GS.S.user.name === 'Davi_10'), 'apelido da conta virou o nome no jogo');
  check(await J.evaluate(() => window.__GS.S.user.av === '😎' || window.__GS.S.user.av.length > 0), 'avatar da conta aplicado: ' + await J.evaluate(() => window.__GS.S.user.av));
  await J.waitForTimeout(1500);
  await J.screenshot({ path: shots + '/06-jogo-390.png' });

  console.log('5) Sincronização só de números');
  await J.evaluate(() => { const g = window.__GS; g.S.xp = 120; g.S.ch['boas-vindas'] = { i: 99, done: true, hist: [], sub: {} }; g.addXP(10); });
  await J.evaluate(() => window.__GS.syncNow());
  await J.waitForTimeout(300);
  const row = s.db.prepare("SELECT xp, done FROM gs_progress p JOIN gs_users u ON u.id = p.user_id WHERE u.apelido = 'Davi_10'").get();
  check(row && row.xp >= 130, 'XP chegou ao servidor: ' + (row && row.xp));
  check(row && JSON.parse(row.done).includes('boas-vindas'), 'canal concluído chegou ao servidor');
  // escreve uma resposta e confere que NÃO vai ao servidor
  const segredo = 'RESPOSTA-PRIVADA-' + Date.now();
  await J.evaluate(t => { const g = window.__GS; g.S.ans['teste'] = { t, p: 100, x: 10, ts: Date.now() }; g.S.week.diary = t; g.S.dec['d1'] = { t: 'x', conf: 50, f: { a: t } }; g.addXP(1); }, segredo);
  await J.evaluate(() => window.__GS.syncNow());
  await J.waitForTimeout(300);
  const dump = JSON.stringify(['gs_users', 'gs_progress', 'gs_sessions'].map(t => s.db.prepare('SELECT * FROM ' + t).all()));
  check(!dump.includes(segredo), 'texto da resposta NÃO está em nenhuma tabela do servidor');
  check(!(await J.evaluate(() => JSON.stringify(window.__GS.progressPayload()))).includes(segredo), 'payload de sincronização não contém respostas');

  console.log('6) Ranking (atalhos e canal)');
  check(await J.locator('.tb-rank').isVisible(), 'botão 🏆 visível no topo do celular');
  await J.click('.tb-rank');
  await J.waitForSelector('#rankboard .rk-row');
  check(await J.locator('#rankboard .rk-row.me').count() === 1, 'a própria linha aparece destacada');
  check(!(await J.textContent('#rankboard')).match(/Davi Souza|Clube Sentinelas/), 'ranking não revela nome real nem grupo');
  await J.screenshot({ path: shots + '/07-ranking-390.png' });
  await J.click('[data-act="rk-tab"][data-id="constancia"]');
  await J.waitForFunction(() => { const t = document.querySelector('#rankboard [aria-selected="true"]'); return t && t.textContent.includes('Constância') && document.querySelector('#rankboard .rk-row'); });
  check(true, 'aba Constância funciona');
  await J.click('[data-act="nav"]');
  await J.waitForSelector('.quick-nav .qn');
  check(await J.locator('.quick-nav .qn').first().isVisible(), 'gaveta de canais tem atalho "Ranking" no topo');
  await J.screenshot({ path: shots + '/08-gaveta-390.png' });
  await J.click('.shead-x');

  console.log('7) Configurações com conta');
  await J.click('#railMe, .tb-menu', { trial: true }).catch(() => {});
  await J.evaluate(() => document.querySelector('[data-act="nav"]').click());
  await J.click('.ub-btn[data-act="settings"]');
  await J.waitForSelector('.modal h2');
  check((await J.textContent('.modal')).includes('Davi_10'), 'configurações mostram a conta');
  check(await J.locator('[data-act="srv-vis"]').count() === 1, 'chave "aparecer no ranking" presente');
  await J.screenshot({ path: shots + '/09-config-390.png' });
  await J.click('[data-act="srv-vis"]');
  await J.waitForTimeout(500);
  check(s.db.prepare("SELECT mostrar_ranking m FROM gs_users WHERE apelido='Davi_10'").get().m === 0, 'esconder do ranking gravou no servidor');
  await J.click('[data-act="srv-vis"]');
  await J.waitForTimeout(400);
  check(s.db.prepare("SELECT mostrar_ranking m FROM gs_users WHERE apelido='Davi_10'").get().m === 1, 'voltar ao ranking gravou no servidor');
  await J.click('.m-x');

  console.log('8) Sessão cai no meio do jogo e ele volta de onde parou');
  s.db.prepare("DELETE FROM gs_sessions WHERE user_id = (SELECT id FROM gs_users WHERE apelido = 'Davi_10')").run();
  await J.evaluate(() => { window.__GS.addXP(5); });
  await J.evaluate(() => window.__GS.syncNow());
  await J.waitForSelector('#gate:not([hidden]) #fLogin', { timeout: 8000 });
  check((await J.textContent('#gateBody')).includes('sessão terminou'), 'aviso de sessão terminada');
  const xpAntes = await J.evaluate(() => window.__GS.S.xp);
  await J.fill('#lgUser', 'davi_10'); await J.fill('#lgPass', 'Senha-forte-1'); await J.click('#gSubmit');
  await J.waitForSelector('#gate', { state: 'hidden', timeout: 8000 });
  check(await J.evaluate(() => window.__GS.S.xp) === xpAntes, 'XP preservado depois de reentrar (sem recarregar)');

  console.log('9) Bloqueio pelo líder');
  const id = s.db.prepare("SELECT id FROM gs_users WHERE apelido='Davi_10'").get().id;
  const st = await L.evaluate(async id => (await fetch('/api/admin/usuarios/' + id + '/bloquear', { method: 'POST', headers: { 'X-GS': '1', 'Content-Type': 'application/json' }, body: '{}' })).status, id);
  check(st === 200, 'líder bloqueou o jovem (HTTP ' + st + ')');
  await J.evaluate(() => { window.__GS.addXP(5); });
  await J.evaluate(() => window.__GS.syncNow());
  await J.waitForSelector('#gate:not([hidden])', { timeout: 8000 });
  await J.fill('#lgUser', 'Davi_10'); await J.fill('#lgPass', 'Senha-forte-1'); await J.click('#gSubmit');
  await J.waitForFunction(() => document.querySelector('#gateBody h2') && document.querySelector('#gateBody h2').textContent.includes('suspenso'), null, { timeout: 8000 });
  check(true, 'jovem bloqueado vê "Acesso suspenso" com o contato');
  check((await J.textContent('#gateBody')).includes('contato@exemplo.com'), 'tela de bloqueio mostra o contato');
  await J.screenshot({ path: shots + '/10-bloqueado-390.png' });

  console.log('\nErros de JS/console capturados:');
  [...jovem.pg.erros, ...lider.pg.erros].forEach(e => console.log('  !', e));
  check(jovem.pg.erros.length === 0 && lider.pg.erros.length === 0, 'nenhum erro de JavaScript no navegador');
  await br.close(); await s.parar();
  process.exit(resumo() ? 1 : 0);
})().catch(e => { console.error('ERRO NO TESTE:', e); process.exit(2); });
