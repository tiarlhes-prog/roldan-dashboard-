'use strict';
/* Servidor do Guardiões do Sábado.
 * Regras de negócio:
 *  - quem se cadastra fica PENDENTE; só o líder (superadmin) libera, bloqueia ou remove;
 *  - cada jovem só enxerga o próprio progresso; as RESPOSTAS nunca chegam ao servidor;
 *  - todos os jovens liberados enxergam o ranking (apelido, avatar, cargo, XP, sábados guardados). */
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const { abrirBanco } = require('./db');
const S = require('./security');
const G = require('./gamedata');

const agora = () => new Date().toISOString();
const emDias = d => new Date(Date.now() + d * 86400e3).toISOString();
const cargoDe = xp => G.ROLES.reduce((r, x, i) => (xp >= x.xp ? i : r), 0);
const json = txt => { try { const v = JSON.parse(txt); return Array.isArray(v) ? v : []; } catch (e) { return []; } };

function criarApp(cfg = {}) {
  const c = {
    dbPath: cfg.dbPath || path.join(__dirname, '..', 'data', 'guardioes.db'),
    adminUser: cfg.adminUser || 'Líder',
    adminPassword: cfg.adminPassword || '',
    cookieSecure: cfg.cookieSecure !== false,
    trustProxy: cfg.trustProxy == null ? 1 : cfg.trustProxy,
    publicDir: path.resolve(cfg.publicDir || path.join(__dirname, '..', 'public')),
    responsavel: cfg.responsavel || 'o líder do grupo',
    contato: cfg.contato || '',
    aceiteVersao: cfg.aceiteVersao || '2026-11-21',
    sessaoDias: cfg.sessaoDias || 30,
    limites: Object.assign({ loginIp: 40, loginApelido: 8, cadastroIp: 8, senha: 10, progresso: 120, geral: 600 }, cfg.limites)
  };

  const db = abrirBanco(c.dbPath);
  const bcryptCusto = cfg.bcryptCusto || 11;

  /* ---------- conta do líder (superadmin) ---------- */
  const adminChave = S.chaveApelido(c.adminUser);
  if (!db.prepare("SELECT id FROM gs_users WHERE role = 'superadmin' LIMIT 1").get()) {
    if (!c.adminPassword || c.adminPassword.length < 10) {
      throw new Error('Defina GS_ADMIN_PASSWORD (mínimo 10 caracteres) para criar a conta do líder.');
    }
    if (adminChave.length < 3) throw new Error('GS_ADMIN_USER inválido: use pelo menos 3 letras ou números.');
    const t = agora();
    const r = db.prepare(`INSERT INTO gs_users (apelido, chave, senha_hash, nome, avatar, status, role, mostrar_ranking, aceite_em, aceite_versao, criado_em, aprovado_em)
                          VALUES (?, ?, ?, ?, '🛡️', 'ativo', 'superadmin', 0, ?, ?, ?, ?)`)
      .run(c.adminUser.trim(), adminChave, bcrypt.hashSync(c.adminPassword, 12), 'Líder do grupo', t, c.aceiteVersao, t, t);
    db.prepare('INSERT INTO gs_progress (user_id, atualizado_em) VALUES (?, ?)').run(r.lastInsertRowid, t);
  }
  const reservadosExtra = new Set([adminChave]);

  /* ---------- limitadores ---------- */
  const lim = {
    geral: S.criarLimitador({ janelaMs: 60e3, max: c.limites.geral }),
    loginIp: S.criarLimitador({ janelaMs: 15 * 60e3, max: c.limites.loginIp }),
    loginApelido: S.criarLimitador({ janelaMs: 15 * 60e3, max: c.limites.loginApelido }),
    cadastroIp: S.criarLimitador({ janelaMs: 60 * 60e3, max: c.limites.cadastroIp }),
    senha: S.criarLimitador({ janelaMs: 15 * 60e3, max: c.limites.senha }),
    progresso: S.criarLimitador({ janelaMs: 60e3, max: c.limites.progresso })
  };
  const podarSessoes = () => db.prepare('DELETE FROM gs_sessions WHERE expira_em < ?').run(agora());
  podarSessoes();
  const timerSessoes = setInterval(podarSessoes, 3600e3); timerSessoes.unref();

  /* ---------- helpers ---------- */
  const falha = (res, status, erro, extra) => res.status(status).json(Object.assign({ erro }, extra));
  const perfil = u => ({ id: u.id, apelido: u.apelido, avatar: u.avatar, status: u.status, role: u.role, mostrarRanking: !!u.mostrar_ranking });
  const dummyHash = bcrypt.hashSync('nao-existe-esse-usuario', bcryptCusto);

  function criarSessao(userId) {
    const tok = S.gerarToken();
    db.prepare('INSERT INTO gs_sessions (token_hash, user_id, criado_em, expira_em) VALUES (?, ?, ?, ?)')
      .run(S.hashToken(tok), userId, agora(), emDias(c.sessaoDias));
    db.prepare(`DELETE FROM gs_sessions WHERE user_id = ? AND token_hash NOT IN
                (SELECT token_hash FROM gs_sessions WHERE user_id = ? ORDER BY criado_em DESC LIMIT 5)`).run(userId, userId);
    return tok;
  }
  const darCookie = (res, tok) => res.append('Set-Cookie', S.serializarCookie(S.COOKIE, tok, { maxAge: c.sessaoDias * 86400, secure: c.cookieSecure }));
  const tirarCookie = res => res.append('Set-Cookie', S.serializarCookie(S.COOKIE, '', { maxAge: 0, secure: c.cookieSecure }));

  /* ---------- aplicação ---------- */
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', c.trustProxy);

  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: Object.assign({
        'default-src': ["'self'"], 'script-src': ["'self'"], 'style-src': ["'self'"], 'style-src-attr': ["'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'blob:'], 'font-src': ["'self'"], 'connect-src': ["'self'"], 'manifest-src': ["'self'"],
        'object-src': ["'none'"], 'base-uri': ["'none'"], 'form-action': ["'self'"], 'frame-ancestors': ["'none'"]
      }, c.cookieSecure ? { 'upgrade-insecure-requests': [] } : {})
    },
    strictTransportSecurity: c.cookieSecure ? { maxAge: 15552000 } : false,
    referrerPolicy: { policy: 'no-referrer' },
    crossOriginEmbedderPolicy: false
  }));
  app.use((req, res, next) => { res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'); next(); });

  /* arquivos do jogo */
  app.use(express.static(c.publicDir, {
    index: false,
    setHeaders(res, file) {
      res.setHeader('Cache-Control', /\.[0-9a-f]{10}\.(js|css)$/.test(file) ? 'public, max-age=31536000, immutable' : 'no-cache');
    }
  }));
  app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(c.publicDir, 'index.html'), { headers: { 'Cache-Control': 'no-cache' } }));
  app.get('/healthz', (req, res) => res.type('text/plain').send('ok'));

  /* ---------- API ---------- */
  const api = express.Router();
  api.use((req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  api.use((req, res, next) => (lim.geral.tentar(req.ip) ? next() : falha(res, 429, 'Muitas requisições. Espere um minuto.')));
  api.use(express.json({ limit: '20kb' }));

  /* CSRF: sem CORS, só o próprio site consegue mandar o cabeçalho X-GS; ainda conferimos a origem quando vier. */
  api.use((req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
    const origem = req.headers.origin;
    if (origem) { try { if (new URL(origem).host !== req.headers.host) return falha(res, 403, 'Origem não permitida.'); } catch (e) { return falha(res, 403, 'Origem não permitida.'); } }
    if (req.headers['x-gs'] !== '1') return falha(res, 403, 'Requisição inválida.');
    const tipo = req.headers['content-type'];
    if (tipo && !/^application\/json/i.test(tipo)) return falha(res, 415, 'Use JSON.');
    next();
  });

  /* sessão */
  api.use((req, res, next) => {
    req.user = null;
    const tok = S.lerCookies(req.headers.cookie)[S.COOKIE];
    if (tok && S.TOKEN_OK.test(tok)) {
      const th = S.hashToken(tok);
      const u = db.prepare(`SELECT u.*, s.expira_em AS sessao_expira FROM gs_sessions s JOIN gs_users u ON u.id = s.user_id
                            WHERE s.token_hash = ? AND s.expira_em > ?`).get(th, agora());
      if (u) {
        req.user = u; req.tokenHash = th;
        if (new Date(u.sessao_expira).getTime() - Date.now() < c.sessaoDias * 43200e3) { // renova quando passou da metade
          db.prepare('UPDATE gs_sessions SET expira_em = ? WHERE token_hash = ?').run(emDias(c.sessaoDias), th);
          darCookie(res, tok);
        }
        if (!u.ultimo_acesso || Date.now() - new Date(u.ultimo_acesso).getTime() > 600e3) {
          db.prepare('UPDATE gs_users SET ultimo_acesso = ? WHERE id = ?').run(agora(), u.id);
        }
      }
    }
    next();
  });
  const exigirLogin = (req, res, next) => (req.user ? next() : falha(res, 401, 'Entre para continuar.', { codigo: 'login' }));
  const exigirAtivo = (req, res, next) => {
    if (!req.user) return falha(res, 401, 'Entre para continuar.', { codigo: 'login' });
    if (req.user.status !== 'ativo') {
      return falha(res, 403, req.user.status === 'pendente' ? 'Seu acesso ainda não foi liberado pelo líder.' : 'Seu acesso está bloqueado.', { status: req.user.status });
    }
    next();
  };
  const exigirAdmin = (req, res, next) => {
    if (!req.user) return falha(res, 401, 'Entre para continuar.', { codigo: 'login' });
    return req.user.role === 'superadmin' && req.user.status === 'ativo' ? next() : falha(res, 403, 'Só o líder pode fazer isso.');
  };

  api.get('/config', (req, res) => res.json({ responsavel: c.responsavel, contato: c.contato, aceiteVersao: c.aceiteVersao }));

  /* --- cadastro: nasce PENDENTE --- */
  api.post('/register', async (req, res) => {
    if (!lim.cadastroIp.tentar(req.ip)) return falha(res, 429, 'Muitos cadastros deste aparelho. Tente mais tarde.');
    const b = req.body || {};
    const ap = S.validarApelido(b.apelido, reservadosExtra);
    if (ap.erro) return falha(res, 400, ap.erro, { campo: 'apelido' });
    const sv = S.validarSenha(b.senha, ap.chave);
    if (sv.erro) return falha(res, 400, sv.erro, { campo: 'senha' });
    const nm = S.validarTexto(b.nome, { min: 2, max: 60, rotulo: 'O nome' });
    if (nm.erro) return falha(res, 400, nm.erro, { campo: 'nome' });
    const gp = S.validarTexto(b.grupo, { min: 2, max: 60, rotulo: 'A igreja/clube/turma', obrigatorio: false });
    if (gp.erro) return falha(res, 400, gp.erro, { campo: 'grupo' });
    let avatar = '🙂';
    if (b.avatar !== undefined && b.avatar !== null && b.avatar !== '') {
      if (!G.AVATARS.includes(b.avatar)) return falha(res, 400, 'Avatar inválido.', { campo: 'avatar' });
      avatar = b.avatar;
    }
    if (b.aceite !== true || b.responsavel !== true) {
      return falha(res, 400, 'Marque o aviso de privacidade e a autorização do seu responsável para continuar.', { campo: 'aceite' });
    }
    if (db.prepare('SELECT 1 FROM gs_users WHERE chave = ?').get(ap.chave)) {
      return falha(res, 409, 'Esse apelido já está em uso. Escolha outro.', { campo: 'apelido' });
    }
    const hash = await bcrypt.hash(b.senha, bcryptCusto);
    let id;
    try {
      const t = agora();
      id = db.prepare(`INSERT INTO gs_users (apelido, chave, senha_hash, nome, grupo, avatar, status, role, aceite_em, aceite_versao, criado_em)
                       VALUES (?, ?, ?, ?, ?, ?, 'pendente', 'jogador', ?, ?, ?)`).run(ap.valor, ap.chave, hash, nm.valor, gp.valor, avatar, t, c.aceiteVersao, t).lastInsertRowid;
      db.prepare('INSERT INTO gs_progress (user_id, atualizado_em) VALUES (?, ?)').run(id, t);
    } catch (e) {
      if (String(e.message).includes('UNIQUE')) return falha(res, 409, 'Esse apelido já está em uso. Escolha outro.', { campo: 'apelido' });
      throw e;
    }
    darCookie(res, criarSessao(id));
    res.status(201).json({ perfil: perfil(db.prepare('SELECT * FROM gs_users WHERE id = ?').get(id)) });
  });

  /* --- entrar / sair --- */
  api.post('/login', async (req, res) => {
    const b = req.body || {};
    const chave = S.chaveApelido(b.apelido || '');
    const senha = typeof b.senha === 'string' ? b.senha : '';
    if (!chave || !senha) return falha(res, 400, 'Informe apelido e senha.');
    if (lim.loginIp.bloqueado(req.ip) || lim.loginApelido.bloqueado(chave)) {
      return falha(res, 429, 'Muitas tentativas. Espere uns 15 minutos e tente de novo.');
    }
    const u = db.prepare('SELECT * FROM gs_users WHERE chave = ?').get(chave);
    const certo = await bcrypt.compare(senha, u ? u.senha_hash : dummyHash);
    if (!u || !certo) {
      lim.loginIp.tentar(req.ip); lim.loginApelido.tentar(chave);
      return falha(res, 401, 'Apelido ou senha incorretos.');
    }
    lim.loginApelido.zerar(chave);
    if (u.status === 'bloqueado') return falha(res, 403, 'Seu acesso está bloqueado. Fale com o líder.', { status: 'bloqueado' });
    db.prepare('UPDATE gs_users SET ultimo_acesso = ? WHERE id = ?').run(agora(), u.id);
    darCookie(res, criarSessao(u.id));
    res.json({ perfil: perfil(u) });
  });
  api.post('/logout', (req, res) => {
    if (req.tokenHash) db.prepare('DELETE FROM gs_sessions WHERE token_hash = ?').run(req.tokenHash);
    tirarCookie(res);
    res.json({ ok: true });
  });

  /* --- meu perfil --- */
  api.get('/me', exigirLogin, (req, res) => {
    const p = perfil(req.user);
    if (req.user.role === 'superadmin') p.pendentes = db.prepare("SELECT COUNT(*) n FROM gs_users WHERE status = 'pendente'").get().n;
    res.json({ perfil: p });
  });
  api.put('/me', exigirAtivo, (req, res) => {
    const b = req.body || {};
    let { avatar, mostrar_ranking: mr } = req.user;
    if (b.avatar !== undefined) { if (!G.AVATARS.includes(b.avatar)) return falha(res, 400, 'Avatar inválido.'); avatar = b.avatar; }
    if (b.mostrarRanking !== undefined) { if (typeof b.mostrarRanking !== 'boolean') return falha(res, 400, 'Valor inválido.'); mr = b.mostrarRanking ? 1 : 0; }
    db.prepare('UPDATE gs_users SET avatar = ?, mostrar_ranking = ? WHERE id = ?').run(avatar, mr, req.user.id);
    res.json({ perfil: perfil(db.prepare('SELECT * FROM gs_users WHERE id = ?').get(req.user.id)) });
  });
  api.post('/me/senha', exigirAtivo, async (req, res) => {
    if (!lim.senha.tentar('u' + req.user.id)) return falha(res, 429, 'Muitas tentativas. Tente mais tarde.');
    const b = req.body || {};
    if (!(await bcrypt.compare(String(b.atual || ''), req.user.senha_hash))) return falha(res, 401, 'A senha atual está incorreta.', { campo: 'atual' });
    const sv = S.validarSenha(b.nova, req.user.chave);
    if (sv.erro) return falha(res, 400, sv.erro, { campo: 'nova' });
    db.prepare('UPDATE gs_users SET senha_hash = ? WHERE id = ?').run(await bcrypt.hash(b.nova, bcryptCusto), req.user.id);
    db.prepare('DELETE FROM gs_sessions WHERE user_id = ? AND token_hash <> ?').run(req.user.id, req.tokenHash);
    res.json({ ok: true });
  });

  /* o próprio jovem (ou o responsável, com a senha) apaga a conta: some tudo do servidor (LGPD, eliminação) */
  api.post('/me/excluir', exigirLogin, async (req, res) => {
    if (req.user.role === 'superadmin') return falha(res, 403, 'A conta do líder não pode ser excluída por aqui.');
    if (!lim.senha.tentar('u' + req.user.id)) return falha(res, 429, 'Muitas tentativas. Tente mais tarde.');
    const senha = (req.body && typeof req.body.senha === 'string') ? req.body.senha : '';
    if (!(await bcrypt.compare(senha, req.user.senha_hash))) return falha(res, 401, 'Senha incorreta.', { campo: 'senha' });
    db.prepare('DELETE FROM gs_users WHERE id = ?').run(req.user.id);   // apaga conta, sessões e progresso (cascata)
    tirarCookie(res);
    console.log(`[conta] #${req.user.id} (${req.user.apelido}) excluiu a própria conta`);
    res.json({ ok: true });
  });

  /* --- progresso (SÓ números e ids; nunca texto de resposta) --- */
  const lerProgresso = id => {
    const p = db.prepare('SELECT * FROM gs_progress WHERE user_id = ?').get(id);
    return { xp: p.xp, done: json(p.done), badges: json(p.badges), streak: p.streak, semanas: p.semanas, atualizadoEm: p.atualizado_em };
  };
  api.get('/progress', exigirAtivo, (req, res) => res.json({ progresso: lerProgresso(req.user.id) }));
  api.put('/progress', exigirAtivo, (req, res) => {
    if (!lim.progresso.tentar('u' + req.user.id)) return falha(res, 429, 'Devagar: muitas atualizações.');
    const b = req.body || {};
    /* Formato errado (texto no lugar de número, canal que não existe...) é recusado: só acontece com cliente quebrado ou adulterado. */
    if (!Number.isInteger(b.xp) || b.xp < 0) return falha(res, 400, 'XP inválido.');
    if (!Number.isInteger(b.semanas) || b.semanas < 0) return falha(res, 400, 'Semanas inválidas.');
    const streak = b.streak === undefined ? 0 : b.streak;
    if (!Number.isInteger(streak) || streak < 0 || streak > 3650) return falha(res, 400, 'Sequência inválida.');
    const idsValidos = (arr, lista, max) => Array.isArray(arr) && arr.length <= max && arr.every(x => typeof x === 'string' && lista.includes(x));
    if (!idsValidos(b.done, G.CHANNELS, 60)) return falha(res, 400, 'Canais inválidos.');
    if (!idsValidos(b.badges, G.BADGES, 40)) return falha(res, 400, 'Conquistas inválidas.');
    const at = lerProgresso(req.user.id);
    const uniao = (a, z) => [...new Set([...a, ...z])];
    /* Número acima do possível é AJUSTADO ao teto (não recusado): assim um aparelho honesto, com a data errada, não perde o sincronismo.
     * Uma semana de missão = um sábado; conta nova já pode ter 2 no primeiro fim de semana (a sexta e o sábado cruzam a virada). */
    const idadeMs = Math.max(0, Date.now() - new Date(req.user.criado_em).getTime());
    const semanasMax = Math.ceil(idadeMs / (7 * 86400e3)) + 1;
    const semanas = Math.max(at.semanas, Math.min(b.semanas, semanasMax));
    const tetoXp = G.XP_BASE_MAX + G.XP_PER_WEEK * semanas;
    const novo = {
      xp: Math.min(Math.max(at.xp, b.xp), tetoXp), semanas, streak,
      done: uniao(at.done, b.done), badges: uniao(at.badges, b.badges)
    };
    db.prepare('UPDATE gs_progress SET xp = ?, done = ?, badges = ?, streak = ?, semanas = ?, atualizado_em = ? WHERE user_id = ?')
      .run(novo.xp, JSON.stringify(novo.done), JSON.stringify(novo.badges), novo.streak, novo.semanas, agora(), req.user.id);
    res.json({ progresso: lerProgresso(req.user.id) });
  });
  api.post('/progress/reset', exigirAtivo, (req, res) => {
    db.prepare("UPDATE gs_progress SET xp = 0, done = '[]', badges = '[]', streak = 0, semanas = 0, atualizado_em = ? WHERE user_id = ?").run(agora(), req.user.id);
    res.json({ progresso: lerProgresso(req.user.id) });
  });

  /* --- ranking: todos os liberados veem; mostra só apelido, avatar, cargo, XP e sábados --- */
  api.get('/ranking', exigirAtivo, (req, res) => {
    const tipo = req.query.tipo === 'constancia' ? 'constancia' : 'geral';
    /* Empates dividem a mesma posição (1, 2, 2, 4) e, dentro do empate, a ordem é alfabética: ninguém "ganha" por ter se cadastrado antes. */
    const metrica = tipo === 'constancia' ? 'p.semanas DESC, p.xp DESC' : 'p.xp DESC';
    const base = `SELECT u.id AS id, u.apelido AS apelido, u.chave AS chave, u.avatar AS avatar, p.xp AS xp, p.semanas AS semanas,
                         RANK() OVER (ORDER BY ${metrica}) AS pos
                  FROM gs_users u JOIN gs_progress p ON p.user_id = u.id
                  WHERE u.status = 'ativo' AND u.role = 'jogador' AND u.mostrar_ranking = 1`;
    const linhas = db.prepare(`SELECT * FROM (${base}) ORDER BY pos ASC, chave ASC LIMIT 50`).all();
    const total = db.prepare(`SELECT COUNT(*) AS n FROM (${base})`).get().n;
    const lista = linhas.map(l => {
      const cg = G.ROLES[cargoDe(l.xp)];
      return { pos: l.pos, apelido: l.apelido, avatar: l.avatar, cargo: { n: cg.n, e: cg.e }, xp: l.xp, semanas: l.semanas, voce: l.id === req.user.id };
    });
    let voce = { oculto: !req.user.mostrar_ranking || req.user.role !== 'jogador', pos: null };
    if (!voce.oculto) {
      const r = db.prepare(`SELECT pos, xp, semanas FROM (${base}) WHERE id = ?`).get(req.user.id);
      if (r) voce = { oculto: false, pos: r.pos, xp: r.xp, semanas: r.semanas };
    }
    res.json({ tipo, atualizadoEm: agora(), total, lista, voce });
  });

  /* --- painel do líder --- */
  const linhaAdmin = u => {
    const done = json(u.done);
    return {
      id: u.id, apelido: u.apelido, nome: u.nome, grupo: u.grupo, avatar: u.avatar, status: u.status,
      criadoEm: u.criado_em, aprovadoEm: u.aprovado_em, ultimoAcesso: u.ultimo_acesso, aceiteEm: u.aceite_em,
      mostrarRanking: !!u.mostrar_ranking, progresso: { xp: u.xp, canais: done.length, semanas: u.semanas }
    };
  };
  api.get('/admin/resumo', exigirAdmin, (req, res) => {
    const n = st => db.prepare("SELECT COUNT(*) n FROM gs_users WHERE role = 'jogador' AND status = ?").get(st).n;
    const ativos = db.prepare("SELECT p.xp, p.done, u.ultimo_acesso FROM gs_users u JOIN gs_progress p ON p.user_id = u.id WHERE u.role = 'jogador' AND u.status = 'ativo'").all();
    const corte = new Date(Date.now() - 7 * 86400e3).toISOString();
    const concluidos = {};
    ativos.forEach(a => json(a.done).forEach(id => { concluidos[id] = (concluidos[id] || 0) + 1; }));
    res.json({
      pendentes: n('pendente'), ativos: n('ativo'), bloqueados: n('bloqueado'),
      ativos7d: ativos.filter(a => a.ultimo_acesso && a.ultimo_acesso > corte).length,
      xpMedio: ativos.length ? Math.round(ativos.reduce((s, a) => s + a.xp, 0) / ativos.length) : 0,
      concluidos
    });
  });
  api.get('/admin/usuarios', exigirAdmin, (req, res) => {
    const st = ['pendente', 'ativo', 'bloqueado'].includes(req.query.status) ? req.query.status : null;
    const linhas = db.prepare(`SELECT u.*, p.xp, p.done, p.semanas FROM gs_users u JOIN gs_progress p ON p.user_id = u.id
                               WHERE u.role = 'jogador' ${st ? 'AND u.status = ?' : ''} ORDER BY u.criado_em ASC`).all(...(st ? [st] : []));
    res.json({ usuarios: linhas.map(linhaAdmin) });
  });
  const alvo = (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const u = Number.isInteger(id) ? db.prepare("SELECT * FROM gs_users WHERE id = ? AND role = 'jogador'").get(id) : null;
    if (!u) falha(res, 404, 'Jovem não encontrado.');
    return u;
  };
  const registrar = (req, msg) => console.log(`[líder ${req.user.apelido}] ${msg}`);
  api.post('/admin/usuarios/:id/aprovar', exigirAdmin, (req, res) => {
    const u = alvo(req, res); if (!u) return;
    db.prepare("UPDATE gs_users SET status = 'ativo', aprovado_em = ?, aprovado_por = ? WHERE id = ?").run(agora(), req.user.id, u.id);
    registrar(req, `liberou o acesso de #${u.id} (${u.apelido})`);
    res.json({ ok: true });
  });
  api.post('/admin/usuarios/:id/bloquear', exigirAdmin, (req, res) => {
    const u = alvo(req, res); if (!u) return;
    db.prepare("UPDATE gs_users SET status = 'bloqueado' WHERE id = ?").run(u.id);
    db.prepare('DELETE FROM gs_sessions WHERE user_id = ?').run(u.id);   // derruba o acesso na hora
    registrar(req, `bloqueou #${u.id} (${u.apelido})`);
    res.json({ ok: true });
  });
  api.post('/admin/usuarios/:id/desbloquear', exigirAdmin, (req, res) => {
    const u = alvo(req, res); if (!u) return;
    db.prepare("UPDATE gs_users SET status = 'ativo' WHERE id = ?").run(u.id);
    registrar(req, `desbloqueou #${u.id} (${u.apelido})`);
    res.json({ ok: true });
  });
  api.post('/admin/usuarios/:id/senha', exigirAdmin, async (req, res) => {
    const u = alvo(req, res); if (!u) return;
    const temp = S.senhaTemporaria();
    db.prepare('UPDATE gs_users SET senha_hash = ? WHERE id = ?').run(await bcrypt.hash(temp, bcryptCusto), u.id);
    db.prepare('DELETE FROM gs_sessions WHERE user_id = ?').run(u.id);
    registrar(req, `gerou senha temporária para #${u.id} (${u.apelido})`);
    res.json({ senhaTemporaria: temp });   // aparece uma vez só, para o líder repassar
  });
  api.delete('/admin/usuarios/:id', exigirAdmin, (req, res) => {
    const u = alvo(req, res); if (!u) return;
    db.prepare('DELETE FROM gs_users WHERE id = ?').run(u.id);           // apaga conta, sessões e progresso
    registrar(req, `removeu #${u.id} (${u.apelido})`);
    res.json({ ok: true });
  });
  api.get('/admin/backup', exigirAdmin, async (req, res) => {
    const tmp = path.join(os.tmpdir(), `gs-backup-${process.pid}-${Date.now()}.db`);
    await db.backup(tmp);
    registrar(req, 'baixou um backup do banco');
    res.download(tmp, `guardioes-backup-${agora().slice(0, 10)}.db`, () => fs.rm(tmp, { force: true }, () => {}));
  });

  api.use((req, res) => falha(res, 404, 'Rota não encontrada.'));
  app.use('/api', api);

  app.use((req, res) => res.status(404).type('text/plain').send('Página não encontrada.'));
  app.use((err, req, res, next) => {            // eslint-disable-line no-unused-vars
    if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) return falha(res, 400, 'JSON inválido.');
    if (err && err.type === 'entity.too.large') return falha(res, 413, 'Dados grandes demais.');
    console.error('Erro:', err && err.stack ? err.stack : err);
    falha(res, 500, 'Erro interno. Tente de novo em instantes.');
  });

  const fechar = () => { clearInterval(timerSessoes); Object.values(lim).forEach(l => l.parar()); db.close(); };
  return { app, db, fechar };
}

module.exports = { criarApp };
