'use strict';
/* Segurança: validação de entradas, sessões, cookies e limite de tentativas. Sem dependências externas. */
const crypto = require('node:crypto');

const COOKIE = 'gs_sid';

/* Apelidos que ninguém pode usar (evita se passar pelo líder, pelo bot ou pelo sistema). */
const RESERVADOS = new Set([
  'admin', 'administrador', 'lider', 'superadmin', 'moderador', 'moderadora', 'neemias', 'narrador',
  'sistema', 'suporte', 'bot', 'claude', 'ranking', 'guardioes', 'guardiao', 'pastor', 'pastora', 'anonimo'
]);
const SENHAS_FRACAS = new Set([
  '12345678', '123456789', '1234567890', 'password', 'senha123', 'senha1234', 'qwertyui', 'qwerty123',
  '11111111', '00000000', 'abcd1234', 'abc12345', 'iloveyou', 'minhasenha', 'guardioes', 'sabado123', 'adventista'
]);

const semAcento = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
/* "Davi_1", "davi 1" e "DAVÍ.1" viram a mesma chave: impede apelidos parecidos para confundir os outros. */
const chaveApelido = s => semAcento(s).toLowerCase().replace(/[^a-z0-9]/g, '');

function validarApelido(bruto, extraReservados) {
  const v = String(bruto == null ? '' : bruto).normalize('NFC').replace(/\s+/g, ' ').trim();
  const len = [...v].length;
  if (len < 3 || len > 20) return { erro: 'O apelido precisa ter de 3 a 20 caracteres.' };
  if (!/^[\p{L}\p{N}](?:[\p{L}\p{N} ._-]*[\p{L}\p{N}])$/u.test(v)) {
    return { erro: 'Use só letras, números, espaço, ponto, hífen ou _ (sem emojis).' };
  }
  const chave = chaveApelido(v);
  if (chave.length < 3) return { erro: 'Escolha um apelido com pelo menos 3 letras ou números.' };
  if (RESERVADOS.has(chave) || (extraReservados && extraReservados.has(chave))) {
    return { erro: 'Esse apelido é reservado. Escolha outro.' };
  }
  return { valor: v, chave };
}

function validarSenha(senha, chave) {
  if (typeof senha !== 'string') return { erro: 'Informe uma senha.' };
  if (senha.length < 8) return { erro: 'A senha precisa ter pelo menos 8 caracteres.' };
  if (Buffer.byteLength(senha, 'utf8') > 72) return { erro: 'A senha pode ter no máximo 72 caracteres.' };
  const baixa = senha.toLowerCase();
  if (SENHAS_FRACAS.has(baixa) || /^(.)\1+$/.test(senha)) return { erro: 'Essa senha é fácil demais de adivinhar. Escolha outra.' };
  if (chave && chaveApelido(senha) === chave) return { erro: 'A senha não pode ser igual ao apelido.' };
  return { ok: true };
}

function validarTexto(bruto, { min, max, rotulo, obrigatorio = true }) {
  const v = String(bruto == null ? '' : bruto).normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!v && !obrigatorio) return { valor: '' };
  const len = [...v].length;
  if (len < min || len > max) return { erro: `${rotulo} precisa ter de ${min} a ${max} caracteres.` };
  if (/[\u0000-\u001f\u007f<>]/.test(v)) return { erro: `${rotulo} tem caracteres que não são aceitos.` };
  return { valor: v };
}

/* ---------- sessões ---------- */
const gerarToken = () => crypto.randomBytes(32).toString('base64url');           // 43 caracteres
const hashToken = t => crypto.createHash('sha256').update(String(t)).digest('hex'); // o banco só guarda o hash
const TOKEN_OK = /^[A-Za-z0-9_-]{43}$/;

function lerCookies(cabecalho) {
  const out = {};
  String(cabecalho || '').split(';').forEach(par => {
    const i = par.indexOf('=');
    if (i < 1) return;
    const k = par.slice(0, i).trim();
    if (!(k in out)) out[k] = par.slice(i + 1).trim();
  });
  return out;
}
function serializarCookie(nome, valor, { maxAge, secure }) {
  return `${nome}=${valor}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

/* ---------- limite de tentativas (em memória, janela deslizante) ---------- */
function criarLimitador({ janelaMs, max }) {
  const mapa = new Map();
  const podar = (arr, agora) => arr.filter(t => agora - t < janelaMs);
  const timer = setInterval(() => {
    const agora = Date.now();
    for (const [k, v] of mapa) { const r = podar(v, agora); if (r.length) mapa.set(k, r); else mapa.delete(k); }
  }, Math.max(30000, Math.min(janelaMs, 300000)));
  timer.unref();
  return {
    /* conta uma tentativa; false = passou do limite */
    tentar(chave) {
      const agora = Date.now(), arr = podar(mapa.get(chave) || [], agora);
      arr.push(agora); mapa.set(chave, arr);
      return arr.length <= max;
    },
    /* só olha, sem contar */
    bloqueado(chave) { return podar(mapa.get(chave) || [], Date.now()).length >= max; },
    zerar(chave) { mapa.delete(chave); },
    parar() { clearInterval(timer); }
  };
}

/* Senha temporária legível (sem 0/O/1/l/I) para o líder repassar ao jovem. */
function senhaTemporaria() {
  const alfabeto = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(10);
  return [...bytes].map(b => alfabeto[b % alfabeto.length]).join('');
}

module.exports = {
  COOKIE, RESERVADOS, chaveApelido, validarApelido, validarSenha, validarTexto,
  gerarToken, hashToken, TOKEN_OK, lerCookies, serializarCookie, criarLimitador, senhaTemporaria
};
