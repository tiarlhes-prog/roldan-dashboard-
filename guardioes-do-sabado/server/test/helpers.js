'use strict';
/* Utilitários dos testes: sobe o app numa porta livre e simula um navegador (com cookie). */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { criarApp } = require('../src/app');

const SENHA_LIDER = 'senha-do-lider-123';

async function iniciar(cfg = {}) {
  const pub = fs.mkdtempSync(path.join(os.tmpdir(), 'gs-pub-'));
  fs.writeFileSync(path.join(pub, 'index.html'), '<!doctype html><title>teste</title>');
  fs.writeFileSync(path.join(pub, 'app.abcdef1234.js'), 'console.log(1)');
  fs.writeFileSync(path.join(pub, 'manifest.webmanifest'), '{}');
  const inst = criarApp(Object.assign({
    dbPath: ':memory:', adminUser: 'Líder', adminPassword: SENHA_LIDER, cookieSecure: false,
    bcryptCusto: 4, publicDir: pub, responsavel: 'Pr. Teste', contato: 'teste@exemplo.com',
    limites: { loginIp: 1000, loginPar: 1000, loginApelido: 1000, cadastroIp: 1000, senha: 1000, progresso: 10000, geral: 100000 }
  }, cfg));
  const servidor = await new Promise(ok => { const s = inst.app.listen(0, '127.0.0.1', () => ok(s)); });
  const base = `http://127.0.0.1:${servidor.address().port}`;
  return {
    ...inst, base, publicDir: pub,
    async parar() { await new Promise(ok => servidor.close(ok)); inst.fechar(); fs.rmSync(pub, { recursive: true, force: true }); },
    cliente: () => new Cliente(base)
  };
}

class Cliente {
  constructor(base) { this.base = base; this.cookie = ''; this.cookies = []; }
  async req(metodo, rota, corpo, extra = {}) {
    const headers = Object.assign({ 'X-GS': '1' }, extra.headers);
    if (corpo !== undefined) headers['Content-Type'] = 'application/json';
    if (this.cookie) headers.Cookie = this.cookie;
    if (extra.semGS) delete headers['X-GS'];
    const r = await fetch(this.base + rota, { method: metodo, headers, body: corpo === undefined ? undefined : (typeof corpo === 'string' ? corpo : JSON.stringify(corpo)), redirect: 'manual' });
    const setc = r.headers.getSetCookie ? r.headers.getSetCookie() : [];
    this.cookies = setc;
    for (const sc of setc) {
      const [par] = sc.split(';');
      const [k, v] = [par.slice(0, par.indexOf('=')), par.slice(par.indexOf('=') + 1)];
      if (k === 'gs_sid') this.cookie = v ? `gs_sid=${v}` : '';
    }
    const txt = await r.text();
    let json = null; try { json = JSON.parse(txt); } catch (e) { /* não é JSON */ }
    return { status: r.status, headers: r.headers, texto: txt, json, setCookie: setc };
  }
  get(rota, extra) { return this.req('GET', rota, undefined, extra); }
  post(rota, corpo, extra) { return this.req('POST', rota, corpo === undefined ? {} : corpo, extra); }
  put(rota, corpo, extra) { return this.req('PUT', rota, corpo, extra); }
  del(rota, extra) { return this.req('DELETE', rota, undefined, extra); }
}

const dadosCadastro = (apelido, extra = {}) => Object.assign({
  apelido, senha: 'Senha-forte-1', nome: 'Fulano de Tal', grupo: 'Clube Teste', aceite: true, responsavel: true
}, extra);

/* cadastra um jovem e (opcionalmente) libera pelo líder; devolve o cliente já logado */
async function criarJovem(srv, apelido, { aprovar = true, admin } = {}) {
  const c = srv.cliente();
  const r = await c.post('/api/register', dadosCadastro(apelido));
  if (r.status !== 201) throw new Error('cadastro falhou: ' + r.texto);
  if (aprovar) {
    const a = admin || await logarLider(srv);
    const lista = await a.get('/api/admin/usuarios');
    const u = lista.json.usuarios.find(x => x.apelido === apelido);
    const ok = await a.post(`/api/admin/usuarios/${u.id}/aprovar`);
    if (ok.status !== 200) throw new Error('aprovação falhou: ' + ok.texto);
    c.id = u.id;
  }
  return c;
}
async function logarLider(srv) {
  const a = srv.cliente();
  const r = await a.post('/api/login', { apelido: 'Líder', senha: SENHA_LIDER });
  if (r.status !== 200) throw new Error('login do líder falhou: ' + r.texto);
  return a;
}

module.exports = { iniciar, Cliente, dadosCadastro, criarJovem, logarLider, SENHA_LIDER };
