/* Contas no navegador: recarregar em cada etapa, segundo aparelho, trocar de conta no mesmo navegador, trocar senha,
 * excluir a própria conta, tentativa de XSS e servidor fora do ar.
 * Uso: node tests-navegador/e2e-contas.js */
const { chromium, check, resumo, subir, novoContexto, MOBILE, ROOT } = require('./lib');
const bcrypt = require(ROOT + '/server/node_modules/bcryptjs');
const SENHA = 'Senha-forte-1';
function criarAtivo(s, apelido) {
  const t = new Date().toISOString(), chave = apelido.toLowerCase().replace(/[^a-z0-9]/g, '');
  const id = s.db.prepare("INSERT INTO gs_users (apelido, chave, senha_hash, nome, status, role, criado_em) VALUES (?,?,?,?,'ativo','jogador',?)").run(apelido, chave, bcrypt.hashSync(SENHA, 4), 'Nome de ' + apelido, t).lastInsertRowid;
  s.db.prepare('INSERT INTO gs_progress (user_id, atualizado_em) VALUES (?, ?)').run(id, t);
  return id;
}
const entrar = async (pg, user, senha = SENHA) => { await pg.fill('#lgUser', user); await pg.fill('#lgPass', senha); await pg.click('#gSubmit'); await pg.waitForFunction(() => window.__GS && window.__GS.GAME_ON, null, { timeout: 12000 }); };
(async () => {
  const s = await subir(); const br = await chromium.launch();
  const A = await novoContexto(br, MOBILE); const a = A.pg;

  console.log('1) Recarregar enquanto espera a liberação, e depois de liberado');
  await a.goto(s.base + '/'); await a.waitForSelector('#fLogin'); await a.click('[data-g="to-register"]'); await a.waitForSelector('#fReg');
  await a.fill('#rgUser', 'Pend_1'); await a.fill('#rgPass', SENHA); await a.fill('#rgName', 'Fulano Pendente'); await a.check('#rgOk1'); await a.check('#rgOk2'); await a.click('#gSubmit');
  await a.waitForSelector('#gateBody .steps');
  await a.reload(); await a.waitForSelector('#gateBody .steps');
  check((await a.textContent('#gateBody h2')).includes('Pend_1'), 'recarregar na espera volta para a tela de espera (a sessão persiste)');
  s.db.prepare("UPDATE gs_users SET status='ativo', aprovado_em=? WHERE apelido='Pend_1'").run(new Date().toISOString());
  await a.click('[data-g="check"]', { timeout: 3000 }).catch(() => {});
  await a.waitForFunction(() => window.__GS && window.__GS.GAME_ON, null, { timeout: 25000 });
  await a.reload(); await a.waitForFunction(() => window.__GS && window.__GS.GAME_ON, null, { timeout: 12000 });
  check(await a.evaluate(() => !document.body.classList.contains('gated') && window.__GS.S.user.name === 'Pend_1'), 'depois de liberado, recarregar entra direto no jogo');

  console.log('2) O progresso sobrevive ao recarregar e vai para outro aparelho');
  await a.evaluate(() => { const g = window.__GS; g.S.ch['boas-vindas'] = { i: 99, done: true, hist: [], sub: {} }; g.addXP(300); });
  await a.evaluate(() => window.__GS.syncNow()); await a.waitForTimeout(400);
  await a.reload(); await a.waitForFunction(() => window.__GS && window.__GS.GAME_ON);
  check(await a.evaluate(() => window.__GS.S.xp === 300 && window.__GS.isDone('boas-vindas')), 'XP e canal concluído persistem depois de recarregar');
  const B = await novoContexto(br, { viewport: { width: 1280, height: 800 } }); const b = B.pg;
  await b.goto(s.base + '/'); await b.waitForSelector('#fLogin'); await entrar(b, 'pend_1');
  check(await b.evaluate(() => window.__GS.S.xp >= 300 && window.__GS.isDone('boas-vindas') && window.__GS.unlocked(window.__GS.CHM['como-jogar'])), 'segundo aparelho recebe XP e canais concluídos da conta');
  await b.evaluate(() => window.__GS.openChannel('boas-vindas', { force: true })); await b.waitForTimeout(600);
  check((await b.textContent('#msgs')).includes('outro aparelho'), 'canal concluído em outro aparelho explica que as respostas ficaram lá');
  check(B.pg.erros.length === 0, 'segundo aparelho sem erros de JS ' + B.pg.erros.join(' / '));
  await B.ctx.close();

  console.log('3) Trocar de conta no mesmo navegador (aparelho compartilhado)');
  criarAtivo(s, 'Outro_2');
  await a.evaluate(() => { window.__GS.S.ans.segredo = { t: 'MEU-SEGREDO-DE-PEND1', p: 100, x: 1, ts: 1 }; window.__GS.addXP(1); });
  await a.waitForTimeout(400);
  await a.evaluate(() => document.querySelector('.ub-btn[data-act="settings"]').click());
  await a.waitForSelector('[data-act="srv-logout"]'); await a.click('[data-act="srv-logout"]');
  await a.waitForSelector('#fLogin'); await entrar(a, 'Outro_2');
  check(await a.evaluate(() => window.__GS.S.user.name === 'Outro_2' && window.__GS.S.xp === 0 && !JSON.stringify(window.__GS.S).includes('MEU-SEGREDO')), 'a segunda conta começa limpa: não vê nada da primeira');
  await a.waitForTimeout(600);                      // o jogo grava no aparelho ~120 ms depois de cada mudança
  const chaves = await a.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('guardioes-do-sabado:v2:u')));
  check(chaves.length === 2, 'cada conta tem o seu espaço no aparelho: ' + chaves.join(', '));

  console.log('4) Trocar a senha pelas configurações');
  await a.evaluate(() => document.querySelector('.ub-btn[data-act="settings"]').click());
  await a.waitForSelector('[data-act="srv-pw"]'); await a.click('[data-act="srv-pw"]');
  await a.fill('#pwOld', 'errada-errada'); await a.fill('#pwNew', 'Nova-senha-77'); await a.click('#fPw #gSubmit');
  await a.waitForSelector('#gErr .note.bad'); check(true, 'senha atual errada mostra erro');
  await a.fill('#pwOld', SENHA); await a.click('#fPw #gSubmit'); await a.waitForSelector('#pwBox .note.ok');
  const r = await fetch(s.base + '/api/login', { method: 'POST', headers: { 'X-GS': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ apelido: 'Outro_2', senha: 'Nova-senha-77' }) });
  check(r.status === 200, 'a nova senha já vale no servidor');

  console.log('5) Excluir a própria conta');
  await a.click('[data-act="srv-del"]'); await a.fill('#dlPass', 'Nova-senha-77'); await a.click('#fDelAcc #gSubmit');
  await a.waitForSelector('#fLogin', { timeout: 10000 });
  check(s.db.prepare("SELECT COUNT(*) n FROM gs_users WHERE apelido='Outro_2'").get().n === 0, 'conta apagada do servidor, e a tela volta ao login');
  await A.ctx.close();

  console.log('6) Tentativas de injeção de HTML/script');
  const X = await novoContexto(br, MOBILE); const x = X.pg;
  await x.goto(s.base + '/'); await x.click('[data-g="to-register"]'); await x.waitForSelector('#fReg');
  await x.fill('#rgUser', '"><img src=x onerror=window.__xss=1>'); await x.fill('#rgPass', SENHA); await x.fill('#rgName', 'Teste'); await x.check('#rgOk1'); await x.check('#rgOk2'); await x.click('#gSubmit');
  await x.waitForSelector('#gErr .note.bad'); check(true, 'apelido com HTML é recusado');
  await x.fill('#rgUser', 'Xss_ok'); await x.fill('#rgName', '<script>window.__xss=1</script>'); await x.click('#gSubmit');
  await x.waitForSelector('#gErr .note.bad'); check(await x.evaluate(() => !window.__xss), 'nome com <script> é recusado e nada executa');
  await x.fill('#rgName', 'Zé "Grande" & D\'Ávila'); await x.click('#gSubmit'); await x.waitForSelector('#gateBody .steps');
  const L = await novoContexto(br, { viewport: { width: 1280, height: 800 } }); const l = L.pg;
  await l.goto(s.base + '/'); await entrar(l, 'Líder', 'senha-do-lider-123');
  await l.click('#railAdm'); await l.waitForSelector('.adm-card');
  check((await l.textContent('.adm-card')).includes('Zé "Grande" & D\'Ávila'), 'nome com aspas, & e acento aparece certo (escapado) no painel do líder');
  check(await l.evaluate(() => !window.__xss), 'nada executou no painel do líder');
  await L.ctx.close(); await X.ctx.close();

  console.log('7) Servidor fora do ar na abertura');
  const O = await novoContexto(br, MOBILE); const o = O.pg;
  await o.route('**/api/**', r => r.abort());
  await o.goto(s.base + '/'); await o.waitForFunction(() => document.querySelector('#gateBody h2') && document.querySelector('#gateBody h2').textContent.includes('Sem conexão'), null, { timeout: 8000 });
  check(true, 'sem servidor: tela "Sem conexão" com botão de tentar de novo');
  await o.unroute('**/api/**'); await o.click('[data-g="retry"]'); await o.waitForSelector('#fLogin');
  check(true, 'ao voltar a rede, "Tentar de novo" leva ao login');
  await O.ctx.close();

  console.log('8) Salvar o cartão de compromisso (política de segurança do servidor ativa)');
  criarAtivo(s, 'Cartao_3');
  const C = await novoContexto(br, { viewport: { width: 1280, height: 800 }, acceptDownloads: true }); const c = C.pg;
  await c.goto(s.base + '/'); await c.waitForSelector('#fLogin'); await entrar(c, 'Cartao_3');
  await c.evaluate(() => { const g = window.__GS; g.S.pledge.decide = 'guardar o sábado com alegria'; g.S.pledge.why = 'porque confio em Deus'; g.openPledge(); });
  await c.waitForSelector('#pledgeCard');
  const [baixou] = await Promise.all([c.waitForEvent('download', { timeout: 8000 }).catch(() => null), c.click('[data-act="pledgepng"]')]);
  check(!!baixou && baixou.suggestedFilename() === 'compromisso-de-fe.jpg', 'o cartão baixa como compromisso-de-fe.jpg ' + (baixou ? '' : '(download não ocorreu)'));
  await C.ctx.close();

  // no cenário 7 as chamadas à API são bloqueadas de propósito; o Chromium registra isso como "ERR_FAILED" (esperado)
  const inesperados = [...A.pg.erros, ...X.pg.erros, ...O.pg.erros, ...C.pg.erros].filter(e => !/ERR_FAILED/.test(e));
  console.log('\nErros de JS inesperados:', inesperados.length); inesperados.forEach(e => console.log('  !', e));
  check(inesperados.length === 0, 'nenhum erro inesperado de JavaScript');
  await br.close(); await s.parar(); process.exit(resumo() ? 1 : 0);
})().catch(e => { console.error('ERRO NO TESTE:', e); process.exit(2); });
