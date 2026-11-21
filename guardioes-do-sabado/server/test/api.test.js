'use strict';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const G = require('../src/gamedata');
const { criarApp } = require('../src/app');
const { iniciar, dadosCadastro, criarJovem, logarLider, SENHA_LIDER } = require('./helpers');

describe('cadastro e aprovação', () => {
  let srv; before(async () => { srv = await iniciar(); }); after(() => srv.parar());

  test('config pública traz responsável e contato do aviso de privacidade', async () => {
    const r = await srv.cliente().get('/api/config');
    assert.equal(r.status, 200);
    assert.equal(r.json.responsavel, 'Pr. Teste');
    assert.equal(r.json.contato, 'teste@exemplo.com');
    assert.ok(r.json.aceiteVersao);
  });

  test('cadastro valida apelido, senha, nome e consentimento', async () => {
    const c = srv.cliente();
    const casos = [
      [{ apelido: 'ab' }, 'apelido'],
      [{ apelido: 'com emoji 😀' }, 'apelido'],
      [{ apelido: '<script>x</script>' }, 'apelido'],
      [{ apelido: 'Neemias' }, 'apelido'],      // reservado
      [{ apelido: 'LÍDER' }, 'apelido'],        // reservado (e é o nome da conta do líder)
      [{ senha: '1234567' }, 'senha'],          // curta
      [{ senha: '12345678' }, 'senha'],         // fraca
      [{ senha: 'x'.repeat(80) }, 'senha'],     // longa demais para o bcrypt
      [{ nome: '' }, 'nome'],
      [{ nome: 'A<b>' }, 'nome'],
      [{ aceite: false }, 'aceite'],
      [{ responsavel: false }, 'aceite']
    ];
    for (const [parcial, campo] of casos) {
      const r = await c.post('/api/register', dadosCadastro('Davi Teste', parcial));
      assert.equal(r.status, 400, JSON.stringify(parcial) + ' → ' + r.texto);
      assert.equal(r.json.campo, campo, JSON.stringify(parcial));
    }
    const r = await c.post('/api/register', dadosCadastro('Davi Teste', { apelido: 'Davi Teste', senha: 'daviteste' }));
    assert.equal(r.status, 400, 'senha igual ao apelido deve ser recusada');
  });

  test('cadastro cria conta PENDENTE, abre sessão com cookie seguro e não devolve dados sensíveis', async () => {
    const c = srv.cliente();
    const r = await c.post('/api/register', dadosCadastro('Rafa_10'));
    assert.equal(r.status, 201);
    assert.equal(r.json.perfil.status, 'pendente');
    assert.equal(r.json.perfil.role, 'jogador');
    assert.deepEqual(Object.keys(r.json.perfil).sort(), ['apelido', 'avatar', 'id', 'mostrarRanking', 'role', 'status']);
    const sc = r.setCookie.find(x => x.startsWith('gs_sid='));
    assert.ok(sc, 'cookie de sessão');
    assert.match(sc, /HttpOnly/);
    assert.match(sc, /SameSite=Lax/);
    assert.match(sc, /Path=\//);
    assert.doesNotMatch(r.texto, /senha|hash|nome|Fulano/i);
  });

  test('pendente entra, vê o próprio estado, mas não acessa progresso nem ranking', async () => {
    const c = srv.cliente();
    await c.post('/api/register', dadosCadastro('Pendente1'));
    const me = await c.get('/api/me');
    assert.equal(me.status, 200);
    assert.equal(me.json.perfil.status, 'pendente');
    for (const [m, rota, corpo] of [['get', '/api/progress'], ['get', '/api/ranking'], ['put', '/api/progress', { xp: 0, semanas: 0, done: [], badges: [] }], ['put', '/api/me', { avatar: '🦁' }]]) {
      const r = await c[m](rota, corpo);
      assert.equal(r.status, 403, `${m} ${rota} deveria ser 403`);
      assert.equal(r.json.status, 'pendente');
    }
  });

  test('apelido repetido (ignorando caixa, acento e símbolos) é recusado', async () => {
    await srv.cliente().post('/api/register', dadosCadastro('Maria Clara'));
    for (const outro of ['maria clara', 'MARIA-CLARA', 'María.Clara', 'mariaclara']) {
      const r = await srv.cliente().post('/api/register', dadosCadastro(outro));
      assert.equal(r.status, 409, outro);
    }
  });

  test('só o líder aprova: jogador e anônimo recebem 403/401', async () => {
    const j = srv.cliente();
    await j.post('/api/register', dadosCadastro('Tentador'));
    assert.equal((await j.get('/api/admin/usuarios')).status, 403);
    assert.equal((await j.post('/api/admin/usuarios/1/aprovar')).status, 403);
    assert.equal((await srv.cliente().get('/api/admin/usuarios')).status, 401);
  });

  test('líder lista pendentes, aprova, e o jovem passa a acessar o jogo', async () => {
    const j = srv.cliente();
    await j.post('/api/register', dadosCadastro('Aprovado1'));
    const adm = await logarLider(srv);
    const pend = await adm.get('/api/admin/usuarios?status=pendente');
    const u = pend.json.usuarios.find(x => x.apelido === 'Aprovado1');
    assert.ok(u);
    assert.equal(u.nome, 'Fulano de Tal');   // o líder enxerga o nome real para reconhecer a pessoa
    assert.equal(u.grupo, 'Clube Teste');
    assert.equal((await adm.get('/api/me')).json.perfil.pendentes >= 1, true);
    assert.equal((await adm.post(`/api/admin/usuarios/${u.id}/aprovar`)).status, 200);
    assert.equal((await j.get('/api/progress')).status, 200);
    assert.equal((await j.get('/api/ranking')).status, 200);
    assert.equal((await adm.post('/api/admin/usuarios/99999/aprovar')).status, 404);
    assert.equal((await adm.post(`/api/admin/usuarios/${u.id}abc/aprovar`)).status, 404, 'id com letras não vale como número');
    assert.equal((await adm.post('/api/admin/usuarios/-1/aprovar')).status, 404);
  });

  test('o líder não aparece na lista de jovens nem pode ser bloqueado/removido pelo painel', async () => {
    const adm = await logarLider(srv);
    const lista = await adm.get('/api/admin/usuarios');
    assert.ok(!lista.json.usuarios.some(u => u.apelido === 'Líder'));
    const meuId = (await adm.get('/api/me')).json.perfil.id;
    assert.equal((await adm.post(`/api/admin/usuarios/${meuId}/bloquear`)).status, 404);
    assert.equal((await adm.del(`/api/admin/usuarios/${meuId}`)).status, 404);
  });
});

describe('login, sessão e senha', () => {
  let srv; before(async () => { srv = await iniciar(); }); after(() => srv.parar());

  test('login com senha errada e com apelido inexistente dão a MESMA resposta (não vaza quem existe)', async () => {
    await criarJovem(srv, 'Existe123');
    const a = await srv.cliente().post('/api/login', { apelido: 'Existe123', senha: 'errada-errada' });
    const b = await srv.cliente().post('/api/login', { apelido: 'NaoExiste', senha: 'errada-errada' });
    assert.equal(a.status, 401); assert.equal(b.status, 401);
    assert.equal(a.json.erro, b.json.erro);
  });

  test('login aceita apelido em outra caixa e acentos; sessão persiste; logout encerra', async () => {
    await criarJovem(srv, 'João Pedro');
    const c = srv.cliente();
    const r = await c.post('/api/login', { apelido: 'joao pedro', senha: 'Senha-forte-1' });
    assert.equal(r.status, 200);
    assert.equal(r.json.perfil.apelido, 'João Pedro');
    assert.equal((await c.get('/api/me')).status, 200);
    assert.equal((await c.post('/api/logout')).status, 200);
    assert.equal((await c.get('/api/me')).status, 401);
  });

  test('o banco guarda só o hash do token da sessão, e a senha só como bcrypt', async () => {
    const c = await criarJovem(srv, 'HashTeste');
    const tok = c.cookie.split('=')[1];
    const sess = srv.db.prepare('SELECT token_hash FROM gs_sessions').all().map(x => x.token_hash);
    assert.ok(!sess.includes(tok), 'token em texto puro no banco!');
    assert.ok(sess.every(h => /^[0-9a-f]{64}$/.test(h)));
    const u = srv.db.prepare("SELECT senha_hash FROM gs_users WHERE apelido = 'HashTeste'").get();
    assert.match(u.senha_hash, /^\$2[aby]\$/);
    assert.ok(!u.senha_hash.includes('Senha-forte-1'));
  });

  test('cookie forjado ou malformado não autentica', async () => {
    const c = srv.cliente();
    for (const v of ['gs_sid=abc', 'gs_sid=' + 'A'.repeat(43), 'gs_sid=' + 'A'.repeat(500), "gs_sid=' OR 1=1 --"]) {
      c.cookie = v;
      assert.equal((await c.get('/api/me')).status, 401, v);
    }
  });

  test('no máximo 5 sessões por usuário', async () => {
    await criarJovem(srv, 'MuitosAparelhos');
    for (let i = 0; i < 8; i++) await srv.cliente().post('/api/login', { apelido: 'MuitosAparelhos', senha: 'Senha-forte-1' });
    const n = srv.db.prepare("SELECT COUNT(*) n FROM gs_sessions s JOIN gs_users u ON u.id = s.user_id WHERE u.apelido = 'MuitosAparelhos'").get().n;
    assert.ok(n <= 5, 'sessões: ' + n);
  });

  test('trocar a senha exige a atual, valida a nova e derruba as OUTRAS sessões', async () => {
    const a = await criarJovem(srv, 'TrocaSenha');
    const b = srv.cliente(); await b.post('/api/login', { apelido: 'TrocaSenha', senha: 'Senha-forte-1' });
    assert.equal((await a.post('/api/me/senha', { atual: 'errada-errada', nova: 'Nova-senha-9' })).status, 403, 'senha atual errada não derruba a sessão (403, não 401)');
    assert.equal((await a.post('/api/me/senha', { atual: 'Senha-forte-1', nova: '123' })).status, 400);
    assert.equal((await a.post('/api/me/senha', { atual: 'Senha-forte-1', nova: 'Nova-senha-9' })).status, 200);
    assert.equal((await a.get('/api/me')).status, 200, 'a sessão atual continua');
    assert.equal((await b.get('/api/me')).status, 401, 'as outras caem');
    assert.equal((await srv.cliente().post('/api/login', { apelido: 'TrocaSenha', senha: 'Senha-forte-1' })).status, 401);
    assert.equal((await srv.cliente().post('/api/login', { apelido: 'TrocaSenha', senha: 'Nova-senha-9' })).status, 200);
  });

  test('o jovem pode mudar avatar e visibilidade no ranking, mas só com valores válidos', async () => {
    const c = await criarJovem(srv, 'Perfil1');
    assert.equal((await c.put('/api/me', { avatar: 'DROP TABLE' })).status, 400);
    assert.equal((await c.put('/api/me', { mostrarRanking: 'sim' })).status, 400);
    const r = await c.put('/api/me', { avatar: '🦁', mostrarRanking: false });
    assert.equal(r.status, 200);
    assert.equal(r.json.perfil.avatar, '🦁');
    assert.equal(r.json.perfil.mostrarRanking, false);
  });
});

describe('progresso (só números e ids) e anti-trapaça básica', () => {
  let srv; before(async () => { srv = await iniciar(); }); after(() => srv.parar());
  const prog = (o = {}) => Object.assign({ xp: 100, semanas: 0, streak: 1, done: ['boas-vindas'], badges: [] }, o);

  test('grava e lê o progresso do próprio jovem', async () => {
    const c = await criarJovem(srv, 'Prog1');
    const r = await c.put('/api/progress', prog({ xp: 120, done: ['boas-vindas', 'como-jogar'], badges: ['f1'] }));
    assert.equal(r.status, 200);
    const g = await c.get('/api/progress');
    assert.equal(g.json.progresso.xp, 120);
    assert.deepEqual(g.json.progresso.done.sort(), ['boas-vindas', 'como-jogar']);
    assert.deepEqual(g.json.progresso.badges, ['f1']);
  });

  test('sincronização é monotônica: XP nunca diminui e ids só se somam (aparelho velho não apaga o novo)', async () => {
    const c = await criarJovem(srv, 'Prog2');
    await c.put('/api/progress', prog({ xp: 500, done: ['boas-vindas', 'como-jogar', '1-criacao'], badges: ['f1'] }));
    const r = await c.put('/api/progress', prog({ xp: 50, done: ['1-sinal'], badges: ['f2'] }));
    assert.equal(r.status, 200);
    assert.equal(r.json.progresso.xp, 500);
    assert.deepEqual(r.json.progresso.done.sort(), ['1-criacao', '1-sinal', 'boas-vindas', 'como-jogar']);
    assert.deepEqual(r.json.progresso.badges.sort(), ['f1', 'f2']);
  });

  test('rejeita formato errado: números inválidos, canais/conquistas inventados, listas gigantes', async () => {
    const c = await criarJovem(srv, 'Prog3');
    const ruins = [
      prog({ xp: -1 }), prog({ xp: 1.5 }), prog({ xp: '100' }), prog({ xp: null }), prog({ xp: undefined }),
      prog({ semanas: -1 }), prog({ semanas: 1.2 }), prog({ semanas: '1' }), prog({ streak: -1 }), prog({ streak: 99999 }),
      prog({ done: ['canal-que-nao-existe'] }), prog({ done: [1, 2] }), prog({ done: 'boas-vindas' }), prog({ done: null }),
      prog({ badges: ['hack'] }), prog({ badges: 'f1' }), prog({ done: new Array(61).fill('boas-vindas') })
    ];
    for (const p of ruins) assert.equal((await c.put('/api/progress', p)).status, 400, JSON.stringify(p).slice(0, 90));
  });

  test('XP e semanas acima do possível são AJUSTADOS ao teto (não recusados), então ninguém trapaceia nem perde o sincronismo', async () => {
    const c = await criarJovem(srv, 'Prog4');
    // conta recém-criada: no máximo 2 semanas (sexta + sábado cruzam a virada)
    let r = await c.put('/api/progress', prog({ xp: 999999, semanas: 50 }));
    assert.equal(r.status, 200);
    assert.equal(r.json.progresso.semanas, 2);
    assert.equal(r.json.progresso.xp, G.XP_BASE_MAX + 2 * G.XP_PER_WEEK);
    // o teto exato é aceito sem ajuste
    const c2 = await criarJovem(srv, 'Prog4b');
    r = await c2.put('/api/progress', prog({ xp: G.XP_BASE_MAX, semanas: 0 }));
    assert.equal(r.json.progresso.xp, G.XP_BASE_MAX);
    // conta "antiga" (8 semanas) pode ter mais semanas e mais XP
    srv.db.prepare("UPDATE gs_users SET criado_em = ? WHERE apelido = 'Prog4b'").run(new Date(Date.now() - 8 * 7 * 86400e3).toISOString());
    r = await c2.put('/api/progress', prog({ xp: 6000, semanas: 5 }));
    assert.equal(r.json.progresso.semanas, 5);
    assert.equal(r.json.progresso.xp, 6000);
    // e ainda assim há teto
    r = await c2.put('/api/progress', prog({ xp: 90000, semanas: 500 }));
    assert.equal(r.json.progresso.semanas, 10);  // 8 semanas completas + a semana em curso + 1 de folga
    assert.equal(r.json.progresso.xp, G.XP_BASE_MAX + 10 * G.XP_PER_WEEK);
  });

  test('reiniciar o progresso zera o servidor', async () => {
    const c = await criarJovem(srv, 'Prog5');
    await c.put('/api/progress', prog({ xp: 400, done: ['boas-vindas'], badges: ['f1'] }));
    assert.equal((await c.post('/api/progress/reset')).status, 200);
    const g = await c.get('/api/progress');
    assert.equal(g.json.progresso.xp, 0);
    assert.deepEqual(g.json.progresso.done, []);
  });

  test('um jovem nunca lê nem altera o progresso de outro (não há rota por id)', async () => {
    const a = await criarJovem(srv, 'Isola1'), b = await criarJovem(srv, 'Isola2');
    await a.put('/api/progress', prog({ xp: 700, done: ['boas-vindas'] }));
    const g = await b.get('/api/progress');
    assert.equal(g.json.progresso.xp, 0);
    for (const rota of [`/api/progress/${a.id}`, `/api/users/${a.id}`, `/api/usuarios/${a.id}`, `/api/admin/usuarios`]) {
      const r = await b.get(rota);
      assert.ok([403, 404].includes(r.status), rota + ' → ' + r.status);
    }
  });
});

describe('PRIVACIDADE: respostas nunca chegam ao servidor', () => {
  let srv; before(async () => { srv = await iniciar(); }); after(() => srv.parar());

  test('campos extras (respostas, diário, perguntas) enviados ao progresso são ignorados e NÃO ficam no banco', async () => {
    const c = await criarJovem(srv, 'Privado1');
    const segredo = 'MINHA-RESPOSTA-SECRETA-' + Date.now();
    const r = await c.put('/api/progress', {
      xp: 10, semanas: 0, streak: 0, done: ['boas-vindas'], badges: [],
      respostas: { '1-sinal': segredo }, diario: [segredo], ask: segredo, notas: segredo, texto: segredo
    });
    assert.equal(r.status, 200);
    assert.ok(!r.texto.includes(segredo), 'a resposta devolveu o texto');
    // varre TODAS as tabelas do banco procurando o segredo
    const tabelas = srv.db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all().map(t => t.name);
    for (const t of tabelas) {
      const linhas = JSON.stringify(srv.db.prepare(`SELECT * FROM ${t}`).all());
      assert.ok(!linhas.includes(segredo), `texto de resposta apareceu na tabela ${t}`);
    }
  });

  test('campos desconhecidos no cadastro também não são gravados', async () => {
    const segredo = 'EXTRA-' + Date.now();
    await srv.cliente().post('/api/register', dadosCadastro('Extra1', { respostas: segredo, bio: segredo, email: segredo + '@x.com' }));
    const todas = JSON.stringify(srv.db.prepare('SELECT * FROM gs_users').all());
    assert.ok(!todas.includes(segredo));
  });

  test('o esquema do banco não tem coluna para respostas e as tabelas são só as esperadas', () => {
    const tabelas = srv.db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map(t => t.name);
    assert.deepEqual(tabelas, ['gs_progress', 'gs_sessions', 'gs_users']);
    const colunas = ['gs_users', 'gs_progress', 'gs_sessions'].flatMap(t => srv.db.prepare(`PRAGMA table_info(${t})`).all().map(x => x.name));
    for (const proibida of ['resposta', 'respostas', 'texto', 'diario', 'pergunta', 'answers', 'text', 'notes', 'email', 'telefone', 'cpf', 'nascimento', 'ip']) {
      assert.ok(!colunas.includes(proibida), 'coluna proibida: ' + proibida);
    }
  });
});

describe('ranking', () => {
  let srv; before(async () => { srv = await iniciar(); }); after(() => srv.parar());
  const prog = (xp, semanas = 0, done = ['boas-vindas']) => ({ xp, semanas, streak: 1, done, badges: [] });

  test('todos os liberados veem; o conteúdo é só apelido, avatar, cargo, XP e sábados (sem nome, grupo, id, status)', async () => {
    const a = await criarJovem(srv, 'Rank_A'), b = await criarJovem(srv, 'Rank_B'), c = await criarJovem(srv, 'Rank_C');
    srv.db.prepare("UPDATE gs_users SET criado_em = ? WHERE apelido LIKE 'Rank_%'").run(new Date(Date.now() - 10 * 7 * 86400e3).toISOString());
    for (const [cli, xp, sem] of [[a, 900, 2], [b, 300, 5], [c, 900, 1]]) assert.equal((await cli.put('/api/progress', prog(xp, sem))).status, 200);
    const r = await b.get('/api/ranking');
    assert.equal(r.status, 200);
    assert.equal(r.json.tipo, 'geral');
    assert.equal(r.json.total, 3);
    assert.deepEqual(Object.keys(r.json.lista[0]).sort(), ['apelido', 'avatar', 'cargo', 'pos', 'semanas', 'voce', 'xp']);
    assert.doesNotMatch(r.texto, /Fulano|Clube Teste|senha|hash|"id"|status|pendente|nome/i);
    // empate em 900 XP: mesma posição (1,1), depois 3
    assert.deepEqual(r.json.lista.map(l => [l.apelido, l.pos]), [['Rank_A', 1], ['Rank_C', 1], ['Rank_B', 3]]);
    assert.equal(r.json.lista[0].cargo.n, 'Guardião');
    assert.equal(r.json.voce.pos, 3);
    assert.equal(r.json.lista.find(l => l.apelido === 'Rank_B').voce, true);
    assert.equal(r.json.lista.find(l => l.apelido === 'Rank_A').voce, false);
  });

  test('ranking de constância ordena por sábados guardados', async () => {
    const r = await (await criarJovem(srv, 'Rank_D')).get('/api/ranking?tipo=constancia');
    assert.equal(r.json.tipo, 'constancia');
    assert.equal(r.json.lista[0].apelido, 'Rank_B');      // 5 sábados
    assert.equal(r.json.lista[0].pos, 1);
  });

  test('quem esconde o próprio nome sai da lista, mas continua vendo o ranking', async () => {
    const x = await criarJovem(srv, 'Rank_Oculto');
    await x.put('/api/progress', prog(4000, 0));
    assert.ok((await x.get('/api/ranking')).json.lista.some(l => l.apelido === 'Rank_Oculto'));
    await x.put('/api/me', { mostrarRanking: false });
    const r = await x.get('/api/ranking');
    assert.equal(r.status, 200);
    assert.ok(!r.json.lista.some(l => l.apelido === 'Rank_Oculto'));
    assert.equal(r.json.voce.oculto, true);
  });

  test('pendentes, bloqueados e o líder não aparecem', async () => {
    await srv.cliente().post('/api/register', dadosCadastro('Rank_Pendente'));
    const bl = await criarJovem(srv, 'Rank_Bloqueado');
    await bl.put('/api/progress', prog(2500, 0));
    const adm = await logarLider(srv);
    await adm.post(`/api/admin/usuarios/${bl.id}/bloquear`);
    const lider = await adm.get('/api/ranking');
    assert.equal(lider.status, 200);
    const nomes = lider.json.lista.map(l => l.apelido);
    assert.ok(!nomes.includes('Rank_Pendente'));
    assert.ok(!nomes.includes('Rank_Bloqueado'));
    assert.ok(!nomes.includes('Líder'));
    assert.equal(lider.json.voce.oculto, true);
  });

  test('anônimo não vê o ranking', async () => {
    assert.equal((await srv.cliente().get('/api/ranking')).status, 401);
  });

  test('a lista é limitada a 50 e informa o total', async () => {
    const adm = await logarLider(srv);
    const t = new Date().toISOString();
    const ins = srv.db.prepare("INSERT INTO gs_users (apelido, chave, senha_hash, nome, status, role, criado_em) VALUES (?, ?, 'x', 'N', 'ativo', 'jogador', ?)");
    const insP = srv.db.prepare('INSERT INTO gs_progress (user_id, xp, atualizado_em) VALUES (?, ?, ?)');
    for (let i = 0; i < 60; i++) { const id = ins.run('Massa' + i, 'massa' + i, t).lastInsertRowid; insP.run(id, i, t); }
    const r = await adm.get('/api/ranking');
    assert.equal(r.json.lista.length, 50);
    assert.ok(r.json.total >= 60);
  });
});

describe('avatar no cadastro e exclusão da própria conta', () => {
  let srv; before(async () => { srv = await iniciar(); }); after(() => srv.parar());

  test('cadastro aceita só avatares da lista oficial', async () => {
    assert.equal((await srv.cliente().post('/api/register', dadosCadastro('Av_ruim', { avatar: '<img>' }))).status, 400);
    const r = await srv.cliente().post('/api/register', dadosCadastro('Av_bom', { avatar: '🦁' }));
    assert.equal(r.status, 201);
    assert.equal(r.json.perfil.avatar, '🦁');
    assert.equal((await srv.cliente().post('/api/register', dadosCadastro('Av_padrao'))).json.perfil.avatar, '🙂');
  });

  test('o jovem apaga a própria conta com a senha: some tudo e o apelido volta a ficar livre', async () => {
    const c = await criarJovem(srv, 'SaiSozinho');
    await c.put('/api/progress', { xp: 40, semanas: 0, streak: 0, done: ['boas-vindas'], badges: [] });
    assert.equal((await c.post('/api/me/excluir', { senha: 'errada-errada' })).status, 403);
    assert.equal((await c.get('/api/me')).status, 200, 'senha errada não derruba a conta');
    assert.equal((await c.post('/api/me/excluir', { senha: 'Senha-forte-1' })).status, 200);
    assert.equal(srv.db.prepare("SELECT COUNT(*) n FROM gs_users WHERE apelido = 'SaiSozinho'").get().n, 0);
    assert.equal(srv.db.prepare('SELECT COUNT(*) n FROM gs_progress WHERE user_id = ?').get(c.id).n, 0);
    assert.equal((await c.get('/api/me')).status, 401);
    assert.equal((await srv.cliente().post('/api/register', dadosCadastro('SaiSozinho'))).status, 201);
  });

  test('quem ainda está pendente também pode cancelar o pedido; o líder não se exclui por aqui', async () => {
    const c = srv.cliente();
    await c.post('/api/register', dadosCadastro('Desisti1'));
    assert.equal((await c.post('/api/me/excluir', { senha: 'Senha-forte-1' })).status, 200);
    const adm = await logarLider(srv);
    assert.equal((await adm.post('/api/me/excluir', { senha: SENHA_LIDER })).status, 403);
    assert.equal((await adm.get('/api/me')).status, 200);
  });
});

describe('moderação: bloquear, desbloquear, senha temporária, remover', () => {
  let srv; before(async () => { srv = await iniciar(); }); after(() => srv.parar());

  test('bloquear derruba a sessão na hora e impede novo login; desbloquear devolve o acesso', async () => {
    const j = await criarJovem(srv, 'Trava1'); const adm = await logarLider(srv);
    assert.equal((await j.get('/api/progress')).status, 200);
    assert.equal((await adm.post(`/api/admin/usuarios/${j.id}/bloquear`)).status, 200);
    assert.equal((await j.get('/api/progress')).status, 401, 'sessão precisa cair imediatamente');
    const l = await srv.cliente().post('/api/login', { apelido: 'Trava1', senha: 'Senha-forte-1' });
    assert.equal(l.status, 403); assert.equal(l.json.status, 'bloqueado');
    assert.equal((await adm.post(`/api/admin/usuarios/${j.id}/desbloquear`)).status, 200);
    assert.equal((await srv.cliente().post('/api/login', { apelido: 'Trava1', senha: 'Senha-forte-1' })).status, 200);
  });

  test('senha temporária: aparece uma vez, a antiga morre, sessões caem, a nova funciona', async () => {
    const j = await criarJovem(srv, 'EsqueciSenha'); const adm = await logarLider(srv);
    const r = await adm.post(`/api/admin/usuarios/${j.id}/senha`);
    assert.equal(r.status, 200);
    assert.match(r.json.senhaTemporaria, /^[A-Za-z0-9]{10}$/);
    assert.equal((await j.get('/api/me')).status, 401);
    assert.equal((await srv.cliente().post('/api/login', { apelido: 'EsqueciSenha', senha: 'Senha-forte-1' })).status, 401);
    assert.equal((await srv.cliente().post('/api/login', { apelido: 'EsqueciSenha', senha: r.json.senhaTemporaria })).status, 200);
  });

  test('remover apaga conta, progresso e sessões (LGPD: eliminação) e libera o apelido', async () => {
    const j = await criarJovem(srv, 'Sai1'); const adm = await logarLider(srv);
    await j.put('/api/progress', { xp: 50, semanas: 0, streak: 0, done: ['boas-vindas'], badges: [] });
    assert.equal((await adm.del(`/api/admin/usuarios/${j.id}`)).status, 200);
    assert.equal(srv.db.prepare('SELECT COUNT(*) n FROM gs_users WHERE id = ?').get(j.id).n, 0);
    assert.equal(srv.db.prepare('SELECT COUNT(*) n FROM gs_progress WHERE user_id = ?').get(j.id).n, 0);
    assert.equal(srv.db.prepare('SELECT COUNT(*) n FROM gs_sessions WHERE user_id = ?').get(j.id).n, 0);
    assert.equal((await j.get('/api/me')).status, 401);
    assert.equal((await srv.cliente().post('/api/register', dadosCadastro('Sai1'))).status, 201);
  });

  test('resumo do líder conta pendentes/ativos/bloqueados e quem concluiu cada canal, sem texto de resposta', async () => {
    const adm = await logarLider(srv);
    await srv.cliente().post('/api/register', dadosCadastro('ResumoPend'));
    const j = await criarJovem(srv, 'ResumoAtivo');
    await j.put('/api/progress', { xp: 200, semanas: 0, streak: 0, done: ['boas-vindas', '1-quiz'], badges: [] });
    const r = await adm.get('/api/admin/resumo');
    assert.equal(r.status, 200);
    assert.ok(r.json.pendentes >= 1 && r.json.ativos >= 1);
    assert.ok(r.json.concluidos['1-quiz'] >= 1);
    assert.ok(r.json.xpMedio >= 0);
    const lista = await adm.get('/api/admin/usuarios');
    const u = lista.json.usuarios.find(x => x.apelido === 'ResumoAtivo');
    assert.deepEqual(Object.keys(u.progresso).sort(), ['canais', 'semanas', 'xp']);
    assert.doesNotMatch(JSON.stringify(lista.json), /hash|senha_hash|resposta/i);
  });

  test('backup do banco: só o líder baixa, e o arquivo é um SQLite válido', async () => {
    const j = await criarJovem(srv, 'SemBackup');
    assert.equal((await j.get('/api/admin/backup')).status, 403);
    const adm = await logarLider(srv);
    const r = await fetch(srv.base + '/api/admin/backup', { headers: { Cookie: adm.cookie, 'X-GS': '1' } });
    assert.equal(r.status, 200);
    const buf = Buffer.from(await r.arrayBuffer());
    assert.equal(buf.subarray(0, 15).toString('latin1'), 'SQLite format 3');
  });
});

describe('proteções: CSRF, limites, cabeçalhos, erros', () => {
  let srv; before(async () => { srv = await iniciar(); }); after(() => srv.parar());

  test('POST sem o cabeçalho X-GS é recusado (CSRF), mesmo com cookie válido', async () => {
    const j = await criarJovem(srv, 'Csrf1');
    assert.equal((await j.post('/api/progress/reset', {}, { semGS: true })).status, 403);
    assert.equal((await srv.cliente().post('/api/login', { apelido: 'Csrf1', senha: 'Senha-forte-1' }, { semGS: true })).status, 403);
  });

  test('POST vindo de outra origem é recusado; da mesma origem passa', async () => {
    const j = await criarJovem(srv, 'Csrf2');
    const host = new URL(srv.base).host;
    assert.equal((await j.post('/api/progress/reset', {}, { headers: { Origin: 'https://site-malicioso.example' } })).status, 403);
    assert.equal((await j.post('/api/progress/reset', {}, { headers: { Origin: 'null' } })).status, 403);
    assert.equal((await j.post('/api/progress/reset', {}, { headers: { Origin: 'http://' + host } })).status, 200);
  });

  test('corpo que não é JSON é recusado, JSON inválido dá 400 e corpo grande dá 413 (sem vazar stack)', async () => {
    const c = srv.cliente();
    const t = await c.req('POST', '/api/login', 'apelido=a&senha=b', { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    assert.ok([400, 415].includes(t.status), 'form-urlencoded: ' + t.status);
    const j = await c.req('POST', '/api/login', '{quebrado');
    assert.equal(j.status, 400);
    assert.doesNotMatch(j.texto, /at .*\.js|SyntaxError/);
    const g = await c.req('POST', '/api/login', JSON.stringify({ apelido: 'a', senha: 'x'.repeat(40000) }));
    assert.equal(g.status, 413);
  });

  test('cabeçalhos de segurança: CSP sem script inline, nosniff, sem x-powered-by, API sem cache', async () => {
    const r = await srv.cliente().get('/api/config');
    const csp = r.headers.get('content-security-policy');
    assert.ok(csp, 'CSP presente');
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /script-src 'self'(;|$)/);
    assert.doesNotMatch(csp.match(/script-src[^;]*/)[0], /unsafe-inline|unsafe-eval/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /object-src 'none'/);
    assert.doesNotMatch(csp, /https?:\/\//, 'nenhuma origem externa permitida');
    assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(r.headers.get('x-powered-by'), null);
    assert.equal(r.headers.get('cache-control'), 'no-store');
    assert.equal(r.headers.get('referrer-policy'), 'no-referrer');
    assert.match(r.headers.get('permissions-policy'), /camera=\(\)/);
  });

  test('arquivos estáticos: index sem cache, assets com hash imutáveis, healthz, 404 limpo', async () => {
    const c = srv.cliente();
    const idx = await c.get('/');
    assert.equal(idx.status, 200); assert.match(idx.texto, /<title>teste<\/title>/);
    assert.equal(idx.headers.get('cache-control'), 'no-cache');
    const js = await c.get('/app.abcdef1234.js');
    assert.equal(js.status, 200);
    assert.match(js.headers.get('cache-control'), /immutable/);
    assert.equal((await c.get('/healthz')).texto, 'ok');
    assert.equal((await c.get('/nao-existe')).status, 404);
    assert.equal((await c.get('/api/nao-existe')).status, 404);
    assert.equal((await c.get('/../../etc/passwd')).status, 404);
    assert.equal((await c.get('/%2e%2e/%2e%2e/etc/passwd')).status, 404);
  });

  test('arquivos grandes saem comprimidos (gzip) quando o navegador aceita', async () => {
    const grande = 'console.log("x");\n'.repeat(5000);
    require('node:fs').writeFileSync(require('node:path').join(srv.publicDir, 'app.0123456789.js'), grande);
    const r = await fetch(srv.base + '/app.0123456789.js', { headers: { 'Accept-Encoding': 'gzip' } });
    assert.equal(r.headers.get('content-encoding'), 'gzip');
    assert.equal((await r.text()).length, grande.length, 'descomprime de volta ao original');
  });

  test('o servidor não coloca o banco, o código ou o .env na pasta pública', async () => {
    const c = srv.cliente();
    for (const rota of ['/guardioes.db', '/data/guardioes.db', '/.env', '/package.json', '/src/app.js', '/server.js']) {
      assert.equal((await c.get(rota)).status, 404, rota);
    }
  });
});

describe('limites de tentativas', () => {
  const base = { loginIp: 1000, loginPar: 1000, loginApelido: 1000, cadastroIp: 1000, senha: 1000, progresso: 1000, geral: 100000 };
  const xff = n => ({ headers: { 'X-Forwarded-For': '10.0.0.' + n } });      // simula aparelhos diferentes atrás do proxy

  test('força bruta: depois de N erros, aquele aparelho trava para aquele apelido, até com a senha certa', async () => {
    const srv = await iniciar({ limites: Object.assign({}, base, { loginPar: 4 }) });
    try {
      await criarJovem(srv, 'AlvoForca');
      for (let i = 0; i < 4; i++) assert.equal((await srv.cliente().post('/api/login', { apelido: 'AlvoForca', senha: 'chute-' + i + '-xx' }, xff(1))).status, 401);
      assert.equal((await srv.cliente().post('/api/login', { apelido: 'AlvoForca', senha: 'Senha-forte-1' }, xff(1))).status, 429);
      assert.equal((await srv.cliente().post('/api/login', { apelido: 'outroqualquer', senha: 'qualquer-coisa' }, xff(1))).status, 401, 'outros apelidos não são afetados');
    } finally { await srv.parar(); }
  });

  test('um colega NÃO consegue trancar a conta do outro: o travamento é por apelido+aparelho', async () => {
    const srv = await iniciar({ limites: Object.assign({}, base, { loginPar: 4 }) });
    try {
      await criarJovem(srv, 'Vitima1');
      for (let i = 0; i < 6; i++) await srv.cliente().post('/api/login', { apelido: 'Vitima1', senha: 'palpite-' + i + '-xx' }, xff(66));   // o engraçadinho
      assert.equal((await srv.cliente().post('/api/login', { apelido: 'Vitima1', senha: 'palpite-9-xx' }, xff(66))).status, 429);
      assert.equal((await srv.cliente().post('/api/login', { apelido: 'Vitima1', senha: 'Senha-forte-1' }, xff(7))).status, 200, 'a vítima, de outro aparelho, entra normalmente');
    } finally { await srv.parar(); }
  });

  test('ataque vindo de muitos aparelhos esbarra no teto global por apelido', async () => {
    const srv = await iniciar({ limites: Object.assign({}, base, { loginApelido: 6 }) });
    try {
      await criarJovem(srv, 'AlvoDistribuido');
      for (let i = 0; i < 6; i++) assert.equal((await srv.cliente().post('/api/login', { apelido: 'AlvoDistribuido', senha: 'chute-' + i + '-xx' }, xff(100 + i))).status, 401);
      assert.equal((await srv.cliente().post('/api/login', { apelido: 'AlvoDistribuido', senha: 'chute-outro-xx' }, xff(200))).status, 429);
    } finally { await srv.parar(); }
  });

  test('limite por IP no login e nos cadastros', async () => {
    const srv = await iniciar({ limites: Object.assign({}, base, { loginIp: 3, cadastroIp: 2 }) });
    try {
      for (let i = 0; i < 3; i++) await srv.cliente().post('/api/login', { apelido: 'x' + i + 'abc', senha: 'errada-errada' });
      assert.equal((await srv.cliente().post('/api/login', { apelido: 'novoapelido', senha: 'errada-errada' })).status, 429);
      assert.equal((await srv.cliente().post('/api/register', dadosCadastro('Cad1xx'))).status, 201);
      assert.equal((await srv.cliente().post('/api/register', dadosCadastro('Cad2xx'))).status, 201);
      assert.equal((await srv.cliente().post('/api/register', dadosCadastro('Cad3xx'))).status, 429);
    } finally { await srv.parar(); }
  });

  test('os padrões aguentam um grupo grande no mesmo Wi-Fi: 30 cadastros e 60 logins do mesmo IP', async () => {
    const srv = await iniciar({ limites: {} });    // limites reais de produção
    try {
      for (let i = 0; i < 30; i++) assert.equal((await srv.cliente().post('/api/register', dadosCadastro('Grupo' + String(i).padStart(2, '0')))).status, 201, 'cadastro ' + i);
      for (let i = 0; i < 60; i++) assert.equal((await srv.cliente().post('/api/login', { apelido: 'Grupo' + String(i % 30).padStart(2, '0'), senha: 'Senha-forte-1' })).status, 200, 'login ' + i);
    } finally { await srv.parar(); }
  });

  test('limite geral de requisições por minuto', async () => {
    const srv = await iniciar({ limites: Object.assign({}, base, { geral: 5 }) });
    try {
      const c = srv.cliente(); let ultimo;
      for (let i = 0; i < 8; i++) ultimo = await c.get('/api/config');
      assert.equal(ultimo.status, 429);
    } finally { await srv.parar(); }
  });

  test('limite de atualizações de progresso', async () => {
    const srv = await iniciar({ limites: Object.assign({}, base, { progresso: 3 }) });
    try {
      const c = await criarJovem(srv, 'Spammer');
      const p = { xp: 1, semanas: 0, streak: 0, done: [], badges: [] };
      const codigos = [];
      for (let i = 0; i < 5; i++) codigos.push((await c.put('/api/progress', p)).status);
      assert.deepEqual(codigos, [200, 200, 200, 429, 429]);
    } finally { await srv.parar(); }
  });
});

describe('cookie Secure em produção', () => {
  test('com cookieSecure ligado o cookie leva Secure e a CSP força HTTPS; HSTS ligado', async () => {
    const srv = await iniciar({ cookieSecure: true });
    try {
      const c = srv.cliente();
      const r = await c.post('/api/register', dadosCadastro('Seguro1'));
      assert.match(r.setCookie.find(x => x.startsWith('gs_sid=')), /; Secure/);
      assert.match(r.headers.get('content-security-policy'), /upgrade-insecure-requests/);
      assert.match(r.headers.get('strict-transport-security'), /max-age=/);
    } finally { await srv.parar(); }
  });
});

describe('conta do líder (superadmin)', () => {
  test('não inicia sem senha do líder; exige 10+ caracteres', () => {
    assert.throws(() => criarApp({ dbPath: ':memory:', adminPassword: '' }), /GS_ADMIN_PASSWORD/);
    assert.throws(() => criarApp({ dbPath: ':memory:', adminPassword: 'curta' }), /GS_ADMIN_PASSWORD/);
  });

  test('é criada uma única vez; reiniciar o servidor não recria nem troca a senha', async () => {
    const arq = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gs-db-')), 'g.db');
    const a = criarApp({ dbPath: arq, adminPassword: SENHA_LIDER, cookieSecure: false, bcryptCusto: 4 });
    const hash1 = a.db.prepare("SELECT senha_hash FROM gs_users WHERE role = 'superadmin'").get().senha_hash;
    a.fechar();
    const b = criarApp({ dbPath: arq, adminPassword: 'outra-senha-bem-longa', cookieSecure: false, bcryptCusto: 4 });
    const rows = b.db.prepare("SELECT senha_hash FROM gs_users WHERE role = 'superadmin'").all();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].senha_hash, hash1, 'a senha do banco não pode ser trocada só por mudar a variável');
    b.fechar();
    fs.rmSync(path.dirname(arq), { recursive: true, force: true });
  });

  test('GS_ADMIN_RESET=1 redefine a senha do líder e derruba as sessões; sem a flag, nada muda', async () => {
    const arq = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gs-db-')), 'g.db');
    const a = criarApp({ dbPath: arq, adminPassword: SENHA_LIDER, cookieSecure: false, bcryptCusto: 4 });
    a.db.prepare("INSERT INTO gs_sessions (token_hash, user_id, criado_em, expira_em) SELECT 'x', id, '2026-01-01', '2999-01-01' FROM gs_users WHERE role = 'superadmin'").run();
    a.fechar();
    assert.throws(() => criarApp({ dbPath: arq, adminPassword: 'curta', adminReset: true, cookieSecure: false }), /GS_ADMIN_RESET/);
    const b = criarApp({ dbPath: arq, adminPassword: 'senha-nova-do-lider-9', adminReset: true, cookieSecure: false, bcryptCusto: 4 });
    assert.equal(b.db.prepare('SELECT COUNT(*) n FROM gs_sessions').get().n, 0, 'sessões antigas do líder foram derrubadas');
    const srv = await new Promise(ok => { const s2 = b.app.listen(0, '127.0.0.1', () => ok(s2)); });
    const base = `http://127.0.0.1:${srv.address().port}`;
    const tenta = async senha => (await fetch(base + '/api/login', { method: 'POST', headers: { 'X-GS': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ apelido: 'Líder', senha }) })).status;
    assert.equal(await tenta(SENHA_LIDER), 401, 'a senha antiga deixou de valer');
    assert.equal(await tenta('senha-nova-do-lider-9'), 200, 'a nova senha vale');
    await new Promise(ok => srv.close(ok)); b.fechar();
    fs.rmSync(path.dirname(arq), { recursive: true, force: true });
  });

  test('nenhum cadastro público consegue virar superadmin', async () => {
    const srv = await iniciar();
    try {
      const c = srv.cliente();
      const r = await c.post('/api/register', dadosCadastro('QueroSerLider', { role: 'superadmin', status: 'ativo' }));
      assert.equal(r.status, 201);
      assert.equal(r.json.perfil.role, 'jogador');
      assert.equal(r.json.perfil.status, 'pendente');
      assert.equal((await c.get('/api/admin/usuarios')).status, 403);
      assert.equal(srv.db.prepare("SELECT COUNT(*) n FROM gs_users WHERE role = 'superadmin'").get().n, 1);
    } finally { await srv.parar(); }
  });
});
