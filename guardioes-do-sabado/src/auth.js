/* ============================================================
   ACESSO · login com liberação do líder, sincronização do progresso, ranking e painel do líder
   Só age na versão "server" (data-mode do #app). Nas versões "static" e "artifact" nada disto aparece.

   PRIVACIDADE POR DESENHO: do aparelho para o servidor vão SÓ números e ids (XP, canais concluídos,
   conquistas, sábados guardados, sequência). Respostas, decisões de fé, diário, plano e perguntas
   ao Neemias NUNCA saem do aparelho (veja progressPayload).
   ============================================================ */

const MODE = (($('#app') || {}).dataset || {}).mode || 'static';
const SERVER = MODE === 'server';
let ME = null;                 // conta logada: { id, apelido, avatar, status, role, mostrarRanking, pendentes? }
let CFG = { responsavel: '', contato: '', aceiteVersao: '' };
let GAME_ON = false;           // vira true quando o jogo começa (conta liberada)
const canRank = () => SERVER && !!ME && ME.status === 'ativo';
const isLeader = () => SERVER && !!ME && ME.role === 'superadmin' && ME.status === 'ativo';
const PRIV_TEXT = () => SERVER
  ? 'Suas **respostas, decisões e diário ficam só neste aparelho** — nem o líder vê. Na sua conta vão apenas **apelido, XP, canais concluídos e conquistas** (para o ranking).'
  : 'Seu progresso fica **só neste aparelho**. Nada é enviado a ninguém.';
const fmtNum = n => Number(n || 0).toLocaleString('pt-BR');
function ago(iso) {
  if (!iso) return '—';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'agora';
  if (s < 3600) return 'há ' + Math.round(s / 60) + ' min';
  if (s < 86400) return 'há ' + Math.round(s / 3600) + ' h';
  const d = Math.round(s / 86400);
  if (d === 1) return 'ontem';
  if (d < 30) return 'há ' + d + ' dias';
  return new Date(iso).toLocaleDateString('pt-BR');
}

/* ---------- chamadas ao servidor ---------- */
async function api(method, url, body, o = {}) {
  const init = { method, credentials: 'same-origin', headers: { 'X-GS': '1' }, keepalive: !!o.keepalive };
  if (body !== undefined) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(body); }
  let r;
  try { r = await fetch(url, init); } catch (e) { const err = new Error('Sem conexão com o servidor.'); err.offline = true; throw err; }
  let data = null;
  try { data = await r.json(); } catch (e) { /* resposta sem corpo */ }
  if (!r.ok) {
    const err = new Error((data && data.erro) || 'Algo deu errado (' + r.status + ').');
    err.status = r.status; err.data = data || {};
    if (r.status === 401 && !o.quiet) onSessionLost();
    throw err;
  }
  return data;
}

/* ---------- teclado virtual e barras do celular ---------- */
function initViewport() {
  const vv = window.visualViewport, root = document.documentElement;
  if (vv) {
    let raf = 0;
    const upd = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const kb = window.innerHeight - vv.height > 90;           // teclado virtual aberto (iOS não encolhe a janela)
        if (kb) { root.style.setProperty('--vvh', Math.round(vv.height) + 'px'); window.scrollTo(0, 0); } else root.style.removeProperty('--vvh');
        const m = $('#msgs');
        if (kb && m && document.activeElement === $('#inp')) m.scrollTop = m.scrollHeight;
      });
    };
    vv.addEventListener('resize', upd); vv.addEventListener('scroll', upd);
  }
  document.addEventListener('focusin', e => {                    // campo focado nunca fica escondido atrás do teclado
    const t = e.target;
    if (!t || !t.matches || !t.matches('input,textarea,select') || t.id === 'inp') return;
    setTimeout(() => { try { t.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); } catch (er) { /* ok */ } }, 320);
  });
}

/* ============================================================
   PORTÃO DE ACESSO
   ============================================================ */
let gateOpts = {}, regAv = '🙂', pendTimer = 0, authWired = false;
const EYE = svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>');
const pwField = (id, label, auto, extra = '') => `<div class="fld"><label for="${id}">${label}</label><div class="pw"><input id="${id}" type="password" autocomplete="${auto}" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="72" required>` +
  `<button type="button" class="eye" data-g="eye" data-id="${id}" aria-label="Mostrar a senha" aria-pressed="false">${EYE}</button></div>${extra}</div>`;
const textField = (id, label, auto, o = {}) => `<div class="fld"><label for="${id}">${label}</label><input id="${id}" type="text" autocomplete="${auto}" autocapitalize="${o.cap || 'none'}" autocorrect="off" spellcheck="false" maxlength="${o.max || 60}" enterkeyhint="${o.hint || 'next'}"${o.req === false ? '' : ' required'}${o.focus ? ' data-focus' : ''}>${o.small ? `<small>${o.small}</small>` : ''}</div>`;

const GATE = {
  login: o => `<h2>Entrar</h2><p>Use o apelido e a senha que você criou. Primeira vez por aqui? <button type="button" class="lk" data-g="to-register">Peça seu acesso</button>.</p>` +
    (o.aviso ? `<div class="note" role="status">${esc(o.aviso)}</div>` : '') +
    `<form id="fLogin" novalidate>${textField('lgUser', 'Apelido', 'username', { max: 20, focus: true })}${pwField('lgPass', 'Senha', 'current-password')}` +
    `<div id="gErr" role="alert"></div><button class="btn pri lg" type="submit" id="gSubmit">Entrar</button></form>` +
    `<div class="gate-foot"><button type="button" class="lk" data-g="privacy">Aviso de privacidade</button></div>`,

  register: () => `<h2>Pedir acesso</h2><p>O líder do grupo confere o seu pedido e libera a sua entrada. Costuma ser rápido.</p>` +
    `<form id="fReg" novalidate>${textField('rgUser', 'Apelido <small style="display:inline;font-weight:400">(aparece no ranking)</small>', 'username', { max: 20, focus: true, small: '3 a 20 letras ou números. Sem emojis. Não use seu sobrenome.' })}` +
    pwField('rgPass', 'Senha', 'new-password', '<small>Pelo menos 8 caracteres. Só você deve saber.</small>') +
    textField('rgName', 'Seu nome completo', 'name', { cap: 'words', small: 'Só o líder vê — para saber quem pediu acesso.' }) +
    textField('rgGroup', 'Igreja, clube ou turma <small style="display:inline;font-weight:400">(opcional)</small>', 'off', { cap: 'words', req: false, hint: 'done' }) +
    `<div class="fld"><label>Escolha um avatar</label><div class="avpick" id="rgAv" role="group" aria-label="Avatar">${EMOJIS.map(e => `<button type="button" class="${e === regAv ? 'on' : ''}" data-g="av" data-id="${e}" aria-label="Avatar ${e}">${e}</button>`).join('')}</div></div>` +
    `<label class="ck" id="ckA"><input type="checkbox" id="rgOk1"><span>Li o <button type="button" class="lk" data-g="privacy">aviso de privacidade</button> e concordo.</span></label>` +
    `<label class="ck" id="ckB"><input type="checkbox" id="rgOk2"><span>Meu responsável <b>sabe e autoriza</b> a minha participação (obrigatório para menores de 18 anos).</span></label>` +
    `<div id="gErr" role="alert"></div><button class="btn pri lg" type="submit" id="gSubmit">Pedir acesso</button></form>` +
    `<div class="gate-foot"><button type="button" class="lk" data-g="to-login">Já tenho conta</button></div>`,

  pending: () => `<div class="big-emoji" aria-hidden="true">⏳</div><h2>Quase lá, ${esc(ME.apelido)}!</h2>` +
    `<p>Seu pedido foi enviado${CFG.responsavel ? ` para <b>${esc(CFG.responsavel)}</b>` : ' ao líder'}. Assim que ele liberar, você entra <b>sozinho</b> — pode deixar esta página aberta ou voltar depois.</p>` +
    `<ol class="steps"><li class="ok"><i>✓</i><span>Pedido enviado</span></li><li class="on"><i>2</i><span>O líder confere e libera o seu acesso</span></li><li><i>3</i><span>Você entra e começa a jogar</span></li></ol>` +
    `<div class="note" id="pdStatus" role="status" aria-live="polite"><span class="spin" aria-hidden="true"></span> Verificando a liberação…</div>` +
    `<button type="button" class="btn pri lg" data-g="check">Já fui liberado? Verificar agora</button>` +
    `<div class="gate-foot"><button type="button" class="lk" data-g="logout">Sair</button><button type="button" class="lk" data-g="privacy">Aviso de privacidade</button><button type="button" class="lk" data-g="to-delete">Cancelar meu pedido</button></div>`,

  blocked: () => `<div class="big-emoji" aria-hidden="true">🔒</div><h2>Acesso suspenso</h2>` +
    `<p>O líder suspendeu o seu acesso. Fale com ${CFG.responsavel ? `<b>${esc(CFG.responsavel)}</b>` : 'o líder do grupo'}${CFG.contato ? ` (${esc(CFG.contato)})` : ''} para entender o motivo e pedir a reativação.</p>` +
    `<button type="button" class="btn pri lg" data-g="to-login">Voltar</button>`,

  offline: () => `<div class="big-emoji" aria-hidden="true">📡</div><h2>Sem conexão</h2><p>Não consegui falar com o servidor. Confira a sua internet e tente de novo.</p>` +
    `<button type="button" class="btn pri lg" data-g="retry">Tentar de novo</button>`,

  del: () => `<h2>Excluir minha conta</h2><p>Isso <b>apaga o seu cadastro e o seu progresso</b> do servidor. Não dá para desfazer. Confirme com a sua senha.</p>` +
    `<form id="fDel" novalidate>${pwField('dlPass', 'Senha', 'current-password')}<div id="gErr" role="alert"></div>` +
    `<button class="btn bad lg" type="submit" id="gSubmit">Apagar minha conta</button></form>` +
    `<div class="gate-foot"><button type="button" class="lk" data-g="back">Voltar</button></div>`
};

function showGate(view, opts = {}) {
  gateOpts = Object.assign({}, reauthOpen ? { reauth: true } : {}, opts);   // enquanto a sessão está caída, o aviso de "reentrar" vale em todas as telas
  document.body.classList.add('gated');
  $('#app').setAttribute('inert', '');
  const g = $('#gate');
  g.hidden = false;
  $('#gateBody').innerHTML = GATE[view](gateOpts);
  g.scrollTop = 0;
  g.dataset.view = view;
  if (!coarse()) { const f = $('#gateBody [data-focus]'); if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { /* ok */ } }, 40); }
}
function hideGate() { $('#gate').hidden = true; $('#gateBody').innerHTML = ''; document.body.classList.remove('gated'); $('#app').removeAttribute('inert'); }
function setBusy(on, label) {
  const b = $('#gSubmit');
  if (!b) return;
  if (!b.dataset.t) b.dataset.t = b.textContent;
  b.disabled = !!on; b.textContent = on ? label : b.dataset.t;
}
function gateError(msg, fieldId) {
  const e = $('#gErr');
  if (e) e.innerHTML = `<div class="note bad">${esc(msg)}</div>`;
  $$('#gateBody .fld').forEach(f => f.classList.remove('bad'));
  $$('#gateBody [aria-invalid]').forEach(i => i.removeAttribute('aria-invalid'));
  const i = fieldId && $('#' + fieldId);
  if (i) { i.setAttribute('aria-invalid', 'true'); const f = i.closest('.fld'); if (f) f.classList.add('bad'); try { i.focus(); } catch (er) { /* ok */ } }
}
const FIELD_OF = { apelido: 'rgUser', senha: 'rgPass', nome: 'rgName', grupo: 'rgGroup' };

function gateClick(e) {
  const t = e.target.closest('[data-g]');
  if (!t) return;
  const g = t.dataset.g, id = t.dataset.id;
  switch (g) {
    case 'to-register': showGate('register'); break;
    case 'to-login': showGate('login'); break;
    case 'to-delete': showGate('del'); break;
    case 'back': showGate(ME && ME.status === 'pendente' ? 'pending' : 'login'); break;
    case 'privacy': openPrivacy(); break;
    case 'eye': { const i = $('#' + id); if (!i) break; const show = i.type === 'password'; i.type = show ? 'text' : 'password'; t.setAttribute('aria-pressed', String(show)); t.setAttribute('aria-label', show ? 'Esconder a senha' : 'Mostrar a senha'); break; }
    case 'av': regAv = id; $$('#rgAv button').forEach(b => b.classList.toggle('on', b.dataset.id === id)); break;
    case 'check': checkApproval(true); break;
    case 'retry': authBoot(); break;
    case 'logout': api('POST', '/api/logout', {}, { quiet: true }).catch(() => {}).then(() => { stopPendingPoll(); ME = null; showGate('login'); }); break;
  }
}
async function onFormSubmit(e) {
  const f = e.target;
  if (!f || !f.id) return;
  const known = { fLogin: doLogin, fReg: doRegister, fDel: doDeleteFromGate, fPw: doChangePassword, fDelAcc: doDeleteAccount };
  if (!known[f.id]) return;
  e.preventDefault();
  known[f.id]();
}

async function doLogin() {
  const apelido = $('#lgUser').value.trim(), senha = $('#lgPass').value;
  if (!apelido || !senha) return gateError('Informe o apelido e a senha.', apelido ? 'lgPass' : 'lgUser');
  setBusy(true, 'Entrando…');
  try {
    const r = await api('POST', '/api/login', { apelido, senha }, { quiet: true });
    afterLogin(r.perfil);
  } catch (e) {
    setBusy(false);
    if (e.offline) return gateError('Sem conexão. Confira a internet e tente de novo.');
    if (e.status === 403 && e.data.status === 'bloqueado') { ME = { status: 'bloqueado' }; return showGate('blocked'); }
    gateError(e.message, e.status === 401 ? 'lgPass' : undefined);
  }
}
async function doRegister() {
  const val = id => ($('#' + id).value || '');
  const apelido = val('rgUser').trim(), senha = val('rgPass'), nome = val('rgName').trim(), grupo = val('rgGroup').trim();
  const ok1 = $('#rgOk1').checked, ok2 = $('#rgOk2').checked;
  $('#ckA').classList.remove('bad'); $('#ckB').classList.remove('bad');
  if (apelido.length < 3) return gateError('O apelido precisa ter pelo menos 3 caracteres.', 'rgUser');
  if (senha.length < 8) return gateError('A senha precisa ter pelo menos 8 caracteres.', 'rgPass');
  if (nome.length < 2) return gateError('Informe o seu nome (só o líder vê).', 'rgName');
  if (!ok1 || !ok2) { $('#ckA').classList.toggle('bad', !ok1); $('#ckB').classList.toggle('bad', !ok2); return gateError('Marque as duas caixas para continuar.'); }
  setBusy(true, 'Enviando…');
  try {
    const r = await api('POST', '/api/register', { apelido, senha, nome, grupo, avatar: regAv, aceite: true, responsavel: true }, { quiet: true });
    afterLogin(r.perfil);
  } catch (e) {
    setBusy(false);
    if (e.offline) return gateError('Sem conexão. Confira a internet e tente de novo.');
    gateError(e.message, FIELD_OF[e.data && e.data.campo]);
  }
}
async function doDeleteFromGate() {
  const senha = $('#dlPass').value;
  if (!senha) return gateError('Digite a sua senha para confirmar.', 'dlPass');
  setBusy(true, 'Apagando…');
  try { await api('POST', '/api/me/excluir', { senha }, { quiet: true }); stopPendingPoll(); ME = null; showGate('login', { aviso: 'Pronto: sua conta foi apagada.' }); }
  catch (e) { setBusy(false); gateError(e.message, 'dlPass'); }
}

/* depois de entrar ou de se cadastrar */
function afterLogin(perfil) {
  if (gateOpts.reauth && ME && perfil.id === ME.id && GAME_ON) {   // sessão expirou e a mesma pessoa voltou: segue de onde parou
    ME = Object.assign(ME, perfil); hideGate(); reauthOpen = false; syncNow(); return;
  }
  if (gateOpts.reauth) { location.reload(); return; }              // outra conta no mesmo aparelho: recomeça limpo
  afterAuth(perfil);
}
function afterAuth(perfil) {
  ME = perfil;
  if (perfil.status === 'pendente') { showGate('pending'); startPendingPoll(); return; }
  if (perfil.status === 'bloqueado') { showGate('blocked'); return; }
  enterGame();
}

/* ---------- espera pela liberação do líder ---------- */
function startPendingPoll() {
  stopPendingPoll();
  pendTimer = setInterval(() => { if (!document.hidden) checkApproval(false); }, 15000);
  setTimeout(() => { if (pendTimer) checkApproval(false); }, 1200);
}
function stopPendingPoll() { clearInterval(pendTimer); pendTimer = 0; }
async function checkApproval(manual) {
  const st = $('#pdStatus');
  if (manual && st) st.innerHTML = '<span class="spin" aria-hidden="true"></span> Verificando…';
  try {
    const me = (await api('GET', '/api/me', undefined, { quiet: true })).perfil;
    ME = me;
    if (me.status === 'ativo') { stopPendingPoll(); enterGame(); return; }
    if (me.status === 'bloqueado') { stopPendingPoll(); showGate('blocked'); return; }
    const s = $('#pdStatus');
    if (s) s.innerHTML = `<span class="spin" aria-hidden="true"></span> Ainda aguardando o líder · verificado às ${fmtTime(Date.now())}`;
  } catch (e) {
    if (e.status === 401) { stopPendingPoll(); ME = null; showGate('login', { aviso: 'Sua sessão terminou. Entre de novo para ver se já foi liberado.' }); return; }
    const s = $('#pdStatus');
    if (s) s.textContent = 'Sem conexão agora. Vou tentar de novo em instantes.';
  }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && pendTimer) checkApproval(false); });

/* ---------- início ---------- */
async function authBoot() {
  document.body.classList.add('gated');
  $('#app').setAttribute('inert', '');
  if (!authWired) { authWired = true; $('#gate').addEventListener('click', gateClick); document.addEventListener('submit', onFormSubmit); }
  try { CFG = Object.assign(CFG, await api('GET', '/api/config', undefined, { quiet: true })); } catch (e) { /* segue sem os textos opcionais */ }
  let me = null;
  try { me = (await api('GET', '/api/me', undefined, { quiet: true })).perfil; }
  catch (e) { if (e.status !== 401) { showGate('offline'); return; } }
  if (!me) { showGate('login'); return; }
  afterAuth(me);
}

let entering = false;
async function enterGame() {
  if (GAME_ON || entering) return;
  entering = true;
  KEY = 'guardioes-do-sabado:v2:u' + ME.id;                       // um espaço por conta, mesmo que o aparelho seja compartilhado
  S = mergeState(loadState());
  S.user.name = ME.apelido;
  if (ME.avatar) S.user.av = ME.avatar;
  try { mergeServerProgress((await api('GET', '/api/progress', undefined, { quiet: true })).progresso, true); }
  catch (e) { if (e.status === 401) { entering = false; showGate('login'); return; } /* sem rede: segue com o que há no aparelho */ }
  hideGate();
  GAME_ON = true; entering = false;
  startGame();
  updateAdminDots();
  bindSyncEvents();
  syncNow();
  refreshMe();
  setInterval(refreshMe, 45000);
}

/* traz para este aparelho o que a conta já tem (outro aparelho, ou dados do navegador apagados) */
function mergeServerProgress(p, silent) {
  if (!p) return false;
  let changed = false;
  if (p.xp > S.xp) { S.xp = p.xp; changed = true; }
  if (p.semanas > S.weeksKept) { S.weeksKept = p.semanas; changed = true; }
  (p.badges || []).forEach(id => { if (BADGES[id] && !S.badges[id]) { S.badges[id] = Date.now(); changed = true; } });
  (p.done || []).forEach(id => {
    const c = CHM[id];
    if (!c || c.serverOnly) return;
    const st = chs(id);
    if (st.done) return;
    st.done = true; changed = true;
    if (!st.hist.length) {
      fillStatic(c);                                              // só as falas fixas do canal
      st.hist.push({ w: 'neemias', x: 'Você já concluiu este canal em outro aparelho (ou antes de limpar os dados deste). Seu **progresso** veio junto com a conta; já as **respostas** ficam só no aparelho onde foram escritas.', ts: Date.now() });
    }
    st.i = Math.max(st.i, c.steps.length);
  });
  if (changed) { if (GAME_ON || !silent) save(); if (!silent) { renderChannels(); renderUser(); renderMembers(); } }
  return changed;
}

/* ============================================================
   SINCRONIZAÇÃO (só números e ids)
   ============================================================ */
let syncTimer = 0, lastSig = '', backoff = 0, reauthOpen = false;
function progressPayload() {
  return {
    xp: Math.max(0, S.xp | 0),
    semanas: Math.max(0, S.weeksKept | 0),
    streak: clamp(S.streak.n | 0, 0, 3650),
    done: CH.filter(c => !c.serverOnly && isDone(c.id)).map(c => c.id),
    badges: Object.keys(S.badges).filter(id => BADGES[id])
  };
}
function queueSync() {
  if (!SERVER || !GAME_ON) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncNow(), 3500);
}
async function syncNow(keepalive) {
  clearTimeout(syncTimer);
  if (!SERVER || !GAME_ON || !canRank()) return;
  const body = progressPayload(), sig = JSON.stringify(body);
  if (sig === lastSig) return;
  try {
    const r = await api('PUT', '/api/progress', body, { keepalive: !!keepalive, quiet: !!keepalive });
    lastSig = sig; backoff = 0;
    mergeServerProgress(r.progresso, false);
  } catch (e) {
    if (e.status === 401 || e.status === 403) return;            // onSessionLost / status tratam
    backoff = Math.min(60000, (backoff || 4000) * 2);
    syncTimer = setTimeout(() => syncNow(), backoff);
  }
}
function bindSyncEvents() {
  document.addEventListener('visibilitychange', () => { if (document.hidden) { saveNow(); syncNow(true); } else refreshMe(); });
  window.addEventListener('pagehide', () => { saveNow(); syncNow(true); });
  window.addEventListener('online', () => syncNow());
}
function onSessionLost() {
  if (!SERVER || !GAME_ON || reauthOpen) return;
  reauthOpen = true; saveNow();
  showGate('login', { reauth: true, aviso: 'Sua sessão terminou. Entre de novo para continuar — o que você fez neste aparelho continua salvo.' });
}
async function refreshMe() {
  if (!SERVER || !GAME_ON || document.hidden) return;
  try {
    const me = (await api('GET', '/api/me', undefined, { quiet: false })).perfil, before = (ME && ME.pendentes) || 0;
    if (me.status !== 'ativo') { location.reload(); return; }      // bloqueado/rebaixado: volta ao portão
    ME = Object.assign(ME, me);
    if (isLeader() && (me.pendentes || 0) > before) toast(`🔔 ${me.pendentes} pedido(s) de acesso esperando você`);
    updateAdminDots();
  } catch (e) { /* offline: tenta no próximo ciclo */ }
}
function pushProfile(patch) {
  if (!SERVER || !GAME_ON) return Promise.resolve();
  return api('PUT', '/api/me', patch, { quiet: false }).then(r => { ME = Object.assign(ME, r.perfil); RK.cache = {}; }).catch(() => {});
}
async function resetEverything() {
  closeModal(true);
  try { await api('POST', '/api/progress/reset', {}); }
  catch (e) { toast(e.offline ? 'Sem conexão: não deu para apagar agora. Tente de novo.' : 'Não consegui apagar no servidor. Tente de novo.'); return; }
  try { localStorage.removeItem(KEY); } catch (e) { /* ok */ }
  S = DEF(); S.user.name = ME.apelido; S.user.av = ME.avatar || '🙂';
  lastSig = ''; active = null; RK.cache = {};
  applyTheme(); renderAll(); openChannel('boas-vindas', { force: true });
  toast('Progresso apagado. Vamos recomeçar!');
}
async function doLogout(wipeDevice) {
  closeModal(true);
  try { await syncNow(); } catch (e) { /* ok */ }
  saveNow();
  if (wipeDevice) { try { localStorage.removeItem(KEY); } catch (e) { /* ok */ } }
  GAME_ON = false;
  try { await api('POST', '/api/logout', {}, { quiet: true }); } catch (e) { /* ok */ }
  location.reload();
}

/* ============================================================
   ATALHOS, RANKING E TOP 5
   ============================================================ */
const RK = { tipo: 'geral', cache: {}, busy: {}, timer: 0 };
const medal = p => (p === 1 ? '🥇' : p === 2 ? '🥈' : p === 3 ? '🥉' : '');
function quickNavHTML() {
  if (!SERVER || !GAME_ON) return '';
  let h = '<div class="quick-nav"><button class="qn" data-act="rank"><span class="ico" aria-hidden="true">🏆</span><span>Ranking<small>Veja quem está sendo constante</small></span></button>';
  if (isLeader()) h += `<button class="qn" data-act="admin"><span class="ico" aria-hidden="true">🛡️</span><span>Painel do líder<small>Liberar e acompanhar os jovens</small></span>${ME.pendentes ? `<span class="cnt" aria-label="${ME.pendentes} pedidos esperando">${ME.pendentes}</span>` : ''}</button>`;
  return h + '</div>';
}
const adminBtnHTML = () => (isLeader() ? '<button class="ub-btn" data-act="admin" aria-label="Painel do líder" title="Painel do líder"><span aria-hidden="true">🛡️</span></button>' : '');
let dotKey = '';
function updateAdminDots() {
  const lead = isLeader(), n = (ME && ME.pendentes) || 0, key = lead + ':' + n;
  if (key === dotKey && GAME_ON) return;           // só redesenha quando algo mudou
  dotKey = key;
  const b = $('#railAdm'), d = $('#railAdmDot'), menu = $('.tb-menu');
  if (b) b.hidden = !lead;
  if (d) { d.hidden = !(lead && n); d.textContent = n; }
  if (menu) menu.classList.toggle('pip-on', lead && n > 0);
  if (GAME_ON) { renderChannels(); renderUser(); }
}

async function fetchRank(tipo, force) {
  if (!canRank() || RK.busy[tipo]) return false;
  const c = RK.cache[tipo];
  if (!force && c && Date.now() - c.at < 30000) return false;
  RK.busy[tipo] = true;
  try { RK.cache[tipo] = { data: await api('GET', '/api/ranking?tipo=' + tipo), at: Date.now() }; return true; }
  catch (e) { RK.cache[tipo] = { data: c && c.data, at: Date.now(), err: true }; return false; }
  finally { RK.busy[tipo] = false; }
}
function rankRow(l, cons) {
  const m = medal(l.pos);
  return `<li class="rk-row${l.voce ? ' me' : ''}"><span class="rk-pos${m ? ' m' : ''}" aria-label="${l.pos}º lugar">${m || l.pos + 'º'}</span>` +
    `<span class="av sm" style="--h:${hueOf(l.apelido)}" aria-hidden="true">${esc(l.avatar)}</span>` +
    `<span class="rk-who"><b>${esc(l.apelido)}${l.voce ? '<span class="tag">VOCÊ</span>' : ''}</b><small>${esc(l.cargo.e)} ${esc(l.cargo.n)}</small></span>` +
    `<span class="rk-val"><b>${fmtNum(cons ? l.semanas : l.xp)}</b><small>${cons ? (l.semanas === 1 ? 'sábado' : 'sábados') : 'XP'}</small></span></li>`;
}
const rankTabs = tipo => `<div class="seg" role="tablist" aria-label="Tipo de ranking">${[['geral', '⭐ XP'], ['constancia', '🌅 Constância']].map(([k, l]) => `<button role="tab" aria-selected="${tipo === k}" class="${tipo === k ? 'on' : ''}" data-act="rk-tab" data-id="${k}">${l}</button>`).join('')}</div>`;
const rankFrame = (tipo, body) => `<div class="embed rk"><div class="rk-top"><div class="e-title">🏆 Ranking do grupo</div><button class="btn sm ghost" data-act="rk-refresh" aria-label="Atualizar o ranking">↻ Atualizar</button></div>${rankTabs(tipo)}${body}</div>`;
function rankHTML(c) {
  const d = c.data, cons = d.tipo === 'constancia', v = d.voce;
  let you;
  if (v.oculto) {
    you = isLeader()
      ? '<div class="rk-you"><span class="pos" aria-hidden="true">🛡️</span><span><b>Você é o líder</b><small>O líder vê o ranking, mas não aparece nele.</small></span></div>'
      : '<div class="rk-you"><span class="pos" aria-hidden="true">🙈</span><span style="flex:1"><b>Seu nome está escondido</b><small>Você vê o ranking, mas os outros não veem você.</small></span><button class="btn sm pri" data-act="rk-show">Mostrar meu nome</button></div>';
  } else {
    you = `<div class="rk-you"><span class="pos">${v.pos}º</span><span><b>Sua posição</b><small>de ${d.total} ${d.total === 1 ? 'jovem' : 'jovens'} · ${fmtNum(cons ? v.semanas : v.xp)} ${cons ? 'sábados guardados' : 'XP'}</small></span></div>`;
  }
  const list = d.lista.length
    ? `<ol class="rk-list">${d.lista.map(l => rankRow(l, cons)).join('')}</ol>`
    : '<div class="rk-empty">Ninguém no ranking ainda. Ganhe XP nos canais e seja o primeiro! 🚀</div>';
  const foot = `Mostra só <b>apelido, cargo, XP e sábados guardados</b> — suas respostas ficam só no seu aparelho. ${cons ? 'A constância conta os sábados em que você cumpriu a missão da semana.' : ''} ` +
    `${d.total > d.lista.length ? `Mostrando os ${d.lista.length} primeiros de ${d.total}. ` : ''}Atualizado às ${fmtTime(c.at)}${c.err ? ' · <b>sem conexão agora</b>' : ''}.`;
  return rankFrame(d.tipo, `${you}${list}<div class="e-foot">${foot}</div>`);
}
async function renderRankBoard() {
  const el = $('#rankboard');
  if (!el) return;
  const tipo = RK.tipo, c = RK.cache[tipo];
  el.innerHTML = c && c.data ? rankHTML(c) : rankFrame(tipo, '<div class="sk"></div><div class="sk"></div><div class="sk"></div>');
  await fetchRank(tipo, true);
  const el2 = $('#rankboard'), c2 = RK.cache[tipo];
  if (!el2) return;
  el2.innerHTML = c2 && c2.data ? rankHTML(c2) : rankFrame(tipo, '<div class="note bad"><b>Não consegui carregar o ranking.</b> Confira a internet e toque em Atualizar.</div>');
  clearTimeout(RK.timer);
  RK.timer = setTimeout(() => { if (active === 'ranking' && !document.hidden) renderRankBoard(); }, 60000);
}
function rankMiniHTML() {
  if (!canRank()) return '';
  const c = RK.cache.geral;
  if (!c || Date.now() - c.at > 90000) fetchRank('geral', true).then(ok => { if (ok && GAME_ON) renderMembers(); });
  let h = '<div class="mh">🏆 Ranking · Top 5</div><div class="rk-mini">';
  if (!c || !c.data) h += '<div class="sk"></div><div class="sk"></div><div class="sk"></div>';
  else if (!c.data.lista.length) h += '<div class="rk-empty">Ninguém no ranking ainda.</div>';
  else h += `<ol class="rk-list">${c.data.lista.slice(0, 5).map(l => rankRow(l, false)).join('')}</ol>`;
  return h + '<button class="btn sm ghost" style="width:100%;margin-top:8px" data-act="rank">Ver ranking completo</button></div>';
}
async function setVisibility(on) {
  await pushProfile({ mostrarRanking: !!on });
  RK.cache = {};
  if (active === 'ranking') renderRankBoard();
  renderMembers();
  toast(on ? 'Seu nome voltou ao ranking ✔' : 'Seu nome foi escondido do ranking ✔');
}

/* ============================================================
   PAINEL DO LÍDER
   ============================================================ */
const ADM = { tab: '', users: [], resumo: null };
const OPS = {
  aprovar: { m: 'POST', ok: 'Acesso liberado ✔' }, desbloquear: { m: 'POST', ok: 'Acesso restabelecido ✔' },
  bloquear: { m: 'POST', ok: 'Acesso bloqueado ✔', ask: 'Bloquear o acesso de' }, remover: { m: 'DELETE', ok: 'Conta removida ✔', ask: 'Apagar a conta e o progresso de' },
  senha: { m: 'POST', ask: 'Gerar uma senha temporária para' }
};
async function openAdmin() {
  if (!isLeader()) return;
  closeDrawers();
  ADM.tab = '';
  openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>🛡️ Painel do líder</h2><p style="color:var(--dim);margin-top:2px">Você libera quem entra e acompanha o grupo. As respostas dos jovens ficam só no aparelho deles: <b>nem você as vê</b>.</p><div id="admBody"><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>`, { wide: true, label: 'Painel do líder' });
  await admLoad();
}
async function admLoad() {
  try {
    const [u, r] = await Promise.all([api('GET', '/api/admin/usuarios'), api('GET', '/api/admin/resumo')]);
    ADM.users = u.usuarios; ADM.resumo = r; ME.pendentes = r.pendentes;
    if (!ADM.tab) ADM.tab = r.pendentes ? 'pendente' : 'ativo';
    updateAdminDots();
    admRender();
  } catch (e) {
    const el = $('#admBody');
    if (el) el.innerHTML = `<div class="note bad">Não consegui carregar: ${esc(e.message)}</div><button class="btn pri lg" data-act="adm-reload">Tentar de novo</button>`;
  }
}
function admCard(u) {
  const b = (op, label, cls) => `<button class="btn ${cls || 'ghost'}" data-act="${OPS[op].ask ? 'adm-ask' : 'adm-do'}" data-id="${u.id}" data-op="${op}">${label}</button>`;
  const acts = u.status === 'pendente' ? `<button class="btn pri" data-act="adm-do" data-id="${u.id}" data-op="aprovar">✅ Liberar acesso</button>` + b('remover', 'Recusar')
    : u.status === 'ativo' ? b('bloquear', '⛔ Bloquear') + b('senha', '🔑 Nova senha') + b('remover', '🗑 Remover')
      : `<button class="btn pri" data-act="adm-do" data-id="${u.id}" data-op="desbloquear">Desbloquear</button>` + b('remover', '🗑 Remover');
  const stats = u.status === 'pendente' ? '' : `<span>Último acesso: <b>${u.ultimoAcesso ? ago(u.ultimoAcesso) : '—'}</b></span><span><b>${fmtNum(u.progresso.xp)}</b> XP</span><span><b>${u.progresso.canais}</b> canais</span><span><b>${u.progresso.semanas}</b> sábados</span>${u.mostrarRanking ? '' : '<span>🙈 oculto no ranking</span>'}`;
  return `<div class="adm-card" id="adm${u.id}"><div class="adm-top"><span class="av" style="--h:${hueOf(u.apelido)}" aria-hidden="true">${esc(u.avatar)}</span><div class="who"><b>${esc(u.apelido)}</b><span>${esc(u.nome)}${u.grupo ? ' · ' + esc(u.grupo) : ''}</span></div></div>` +
    `<div class="adm-meta"><span>Pediu acesso: <b>${ago(u.criadoEm)}</b></span>${stats}</div><div class="adm-act" id="act${u.id}">${acts}</div></div>`;
}
function admResumoHTML() {
  const R = ADM.resumo, max = Math.max(1, R.ativos);
  const top = Object.entries(R.concluidos).filter(([id]) => CHM[id]).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const tile = (n, l) => `<div class="tile"><b>${fmtNum(n)}</b><span>${l}</span></div>`;
  return `<div class="kpis">${tile(R.pendentes, 'aguardando liberação')}${tile(R.ativos, 'jovens ativos')}${tile(R.ativos7d, 'ativos nos últimos 7 dias')}${tile(R.xpMedio, 'XP médio')}${tile(R.bloqueados, 'bloqueados')}</div>` +
    `<h3>Canais concluídos</h3>` + (top.length ? top.map(([id, n]) => `<div class="hbar"><span class="t">#${esc(CHM[id].name)}</span><span class="bar"><i style="width:${Math.round(n / max * 100)}%"></i></span><span>${n}/${R.ativos}</span></div>`).join('') : '<p style="color:var(--dim)">Ninguém concluiu canais ainda.</p>') +
    `<h3>Cópia de segurança</h3><p style="color:var(--dim);font-size:13.5px;margin:0 0 8px">Baixe o banco com contas e progresso (sem respostas). Guarde em lugar seguro: ele contém dados pessoais.</p><a class="btn ghost" href="/api/admin/backup" download>⬇ Baixar backup (.db)</a>`;
}
function admRender() {
  const el = $('#admBody');
  if (!el) return;
  const R = ADM.resumo, tabs = [['pendente', 'Pendentes', R.pendentes, true], ['ativo', 'Ativos', R.ativos], ['bloqueado', 'Bloqueados', R.bloqueados], ['resumo', 'Resumo']];
  let h = `<div class="adm-tabs" role="tablist" aria-label="Seções do painel">${tabs.map(([k, l, n, hot]) => `<button role="tab" aria-selected="${ADM.tab === k}" class="${ADM.tab === k ? 'on' : ''}" data-act="adm-tab" data-id="${k}">${l}${n != null ? `<span class="n${hot && n ? ' hot' : ''}">${n}</span>` : ''}</button>`).join('')}</div>`;
  if (ADM.tab === 'resumo') h += admResumoHTML();
  else {
    const list = ADM.users.filter(u => u.status === ADM.tab);
    const empty = { pendente: 'Nenhum pedido esperando. 🎉', ativo: 'Ainda não há jovens liberados.', bloqueado: 'Ninguém bloqueado.' }[ADM.tab];
    h += list.length ? `<div class="adm-list">${list.map(admCard).join('')}</div>` : `<div class="adm-empty">${empty}</div>`;
  }
  el.innerHTML = h;
}
function admAsk(id, op) {
  const u = ADM.users.find(x => x.id === Number(id)), box = $('#act' + id);
  if (!u || !box) return;
  box.innerHTML = `<span style="flex:1 1 100%;font-weight:600;color:${op === 'remover' ? 'var(--bad)' : 'var(--fg)'}">${OPS[op].ask} <b>${esc(u.apelido)}</b>?${op === 'remover' ? ' Não dá para desfazer.' : ''}</span>` +
    `<button class="btn ghost" data-act="adm-cancel">Cancelar</button><button class="btn ${op === 'remover' || op === 'bloquear' ? 'bad' : 'pri'}" data-act="adm-do" data-id="${id}" data-op="${op}">Sim, confirmar</button>`;
}
async function admDo(id, op, btn) {
  const o = OPS[op];
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  try {
    const r = await api(o.m, '/api/admin/usuarios/' + id + (op === 'remover' ? '' : '/' + op), o.m === 'DELETE' ? undefined : {});
    if (op === 'senha') {
      const u = ADM.users.find(x => x.id === Number(id)), box = $('#act' + id);
      if (box) box.innerHTML = `<div style="flex:1 1 100%;font-size:13.5px">Senha temporária de <b>${esc(u ? u.apelido : '')}</b> — aparece só agora. Passe para a pessoa e peça para trocar em Configurações:</div>` +
        `<div class="tmp" style="flex:1 1 100%"><code id="tmpPw">${esc(r.senhaTemporaria)}</code><button class="btn sm" data-act="adm-copy" data-pw="${esc(r.senhaTemporaria)}">Copiar</button></div>`;
      return;
    }
    toast(o.ok);
    await admLoad();
  } catch (e) { toast(e.message); await admLoad(); }
}

/* ============================================================
   CONFIGURAÇÕES (versão com conta), PRIVACIDADE, INSTALAÇÃO
   ============================================================ */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; });
const standalone = () => { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
function installHTML() {
  if (!SERVER || standalone()) return '';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return '<h3>📱 Colocar na tela inicial</h3><p style="color:var(--dim);font-size:13.5px;margin:0">' + (deferredInstall
    ? 'Instale como um app, com ícone na tela do celular.</p><div class="btns"><button class="btn pri" data-act="install">Instalar o app</button></div>'
    : ios ? 'No iPhone: toque em <b>Compartilhar</b> (o quadrado com a seta) e depois em <b>Adicionar à Tela de Início</b>.</p>'
      : 'No Android: abra o menu <b>⋮</b> do navegador e toque em <b>Instalar app</b> (ou <b>Adicionar à tela inicial</b>).</p>');
}
function openSettingsServer() {
  const t = S.set.theme;
  openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>Configurações</h2>` +
    `<div class="note" style="margin-top:12px"><b>${esc(ME.apelido)}</b> · ${isLeader() ? '🛡️ líder' : 'jogador'}<br><span style="color:var(--dim)">O apelido não muda depois do cadastro (ele aparece no ranking). Para trocar, fale com o líder.</span></div>` +
    `<div class="fld"><label>Avatar</label><div class="avpick">${EMOJIS.map(e => `<button class="${S.user.av === e ? 'on' : ''}" data-act="avatar" data-id="${e}" aria-label="Avatar ${e}">${e}</button>`).join('')}</div></div>` +
    (isLeader() ? '' : `<h3>Ranking</h3><div class="sw"><span>Aparecer no ranking<small>Desligado: você vê o ranking, mas os outros não veem você.</small></span><button class="tog${ME.mostrarRanking ? ' on' : ''}" data-act="srv-vis" role="switch" aria-checked="${!!ME.mostrarRanking}" aria-label="Aparecer no ranking"></button></div>`) +
    `<h3>Preferências</h3>` + sw('sound', 'Efeitos sonoros', 'Sons curtos ao ganhar XP e conquistas.') + sw('timer', 'Cronômetro nos quizzes', 'Desligue para responder sem pressa (sem bônus de tempo).') + sw('fast', 'Mensagens instantâneas', 'Pula a animação de “digitando…”.') +
    `<div class="sw"><span>Tema<small>“Auto” segue o seu aparelho.</small></span><span class="seg" role="group" aria-label="Tema">${[['auto', 'Auto'], ['dark', 'Escuro'], ['light', 'Claro']].map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-act="theme" data-id="${k}">${l}</button>`).join('')}</span></div>` +
    `<h3>Senha</h3><div id="pwBox"><button class="btn ghost" data-act="srv-pw">Trocar minha senha…</button></div>` +
    installHTML() +
    `<h3>Privacidade e dados</h3><p style="color:var(--dim);font-size:13.5px;margin:0">${md(PRIV_TEXT())}</p>` +
    `<div class="btns"><button class="btn ghost" data-act="privacy">Ler o aviso de privacidade</button></div>` +
    `<div class="mfoot" id="resetRow"><button class="btn ghost" data-act="reset1">Apagar meu progresso…</button><button class="btn ghost" data-act="srv-logout">Sair da conta</button></div>` +
    (isLeader() ? '' : `<div id="delBox" style="margin-top:6px"><button class="btn ghost" style="color:var(--bad)" data-act="srv-del">Excluir minha conta…</button></div>`),
  { label: 'Configurações' });
}
function pwFormHTML() {
  return `<form id="fPw" novalidate>${pwField('pwOld', 'Senha atual', 'current-password')}${pwField('pwNew', 'Nova senha', 'new-password', '<small>Pelo menos 8 caracteres.</small>')}<div id="gErr" role="alert"></div>` +
    `<div class="mfoot" style="margin-top:12px"><button type="button" class="btn ghost" data-act="srv-pw-x">Cancelar</button><button type="submit" class="btn pri" id="gSubmit">Trocar senha</button></div></form>`;
}
async function doChangePassword() {
  const atual = $('#pwOld').value, nova = $('#pwNew').value;
  if (!atual) return gateError('Digite a senha atual.', 'pwOld');
  if (nova.length < 8) return gateError('A nova senha precisa ter pelo menos 8 caracteres.', 'pwNew');
  setBusy(true, 'Trocando…');
  try {
    await api('POST', '/api/me/senha', { atual, nova });
    const box = $('#pwBox'); if (box) box.innerHTML = '<div class="note ok">Senha trocada ✔ Os outros aparelhos precisarão entrar de novo.</div>';
  } catch (e) { setBusy(false); gateError(e.message, e.data && e.data.campo === 'atual' ? 'pwOld' : 'pwNew'); }
}
function delFormHTML() {
  return `<form id="fDelAcc" novalidate><div class="note bad"><b>Excluir a conta apaga seu cadastro e seu progresso do servidor.</b> Não dá para desfazer. Suas respostas neste aparelho também serão apagadas.</div>${pwField('dlPass', 'Confirme com a sua senha', 'current-password')}<div id="gErr" role="alert"></div>` +
    `<div class="mfoot" style="margin-top:12px"><button type="button" class="btn ghost" data-act="srv-del-x">Cancelar</button><button type="submit" class="btn bad" id="gSubmit">Apagar minha conta</button></div></form>`;
}
async function doDeleteAccount() {
  const senha = $('#dlPass').value;
  if (!senha) return gateError('Digite a sua senha para confirmar.', 'dlPass');
  setBusy(true, 'Apagando…');
  try {
    await api('POST', '/api/me/excluir', { senha });
    try { localStorage.removeItem(KEY); } catch (e) { /* ok */ }
    GAME_ON = false; location.reload();
  } catch (e) { setBusy(false); gateError(e.message, 'dlPass'); }
}
function openPrivacy() {
  const quem = CFG.responsavel ? `<b>${esc(CFG.responsavel)}</b>` : 'o líder do grupo';
  const pv = (t, h) => `<h3>${t}</h3><p style="font-size:14.5px;line-height:1.5">${h}</p>`;
  openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>🔒 Aviso de privacidade</h2><p style="color:var(--dim)">Em palavras simples — para você e para o seu responsável.</p>` +
    pv('Quem cuida dos dados', `${quem} é quem responde por este grupo e decide como os dados são usados.${CFG.contato ? ` Contato: <b>${esc(CFG.contato)}</b>.` : ''}`) +
    pv('O que fica guardado na sua conta', 'Seu <b>apelido</b> (aparece no ranking), sua <b>senha</b> (guardada de forma embaralhada, nunca em texto aberto), seu <b>nome</b> e sua <b>igreja/clube/turma</b> (só o líder vê), seu <b>avatar</b> e o seu <b>progresso</b>: XP, canais concluídos, conquistas, sábados guardados e dias seguidos. Também a data do cadastro, do último acesso e do seu aceite deste aviso.') +
    pv('O que NUNCA sai do seu aparelho', 'Tudo o que você <b>escreve</b>: respostas, decisões de fé, diário, plano de sábado e perguntas ao Neemias. Ninguém vê — nem o líder, nem o servidor. Não pedimos e-mail, telefone, CPF, data de nascimento nem localização. Não há anúncios nem rastreadores.') +
    pv('Quem vê o quê', 'Todos os jovens liberados veem, no ranking: <b>apelido, avatar, cargo, XP e sábados guardados</b>. Você pode se esconder do ranking em Configurações. O líder vê também o seu nome, grupo, último acesso e progresso — para liberar acessos e cuidar do grupo.') +
    pv('Para quê', 'Só para confirmar quem pode entrar, guardar o seu progresso e montar o ranking. Não vendemos nem repassamos seus dados a terceiros.') +
    pv('Por quanto tempo e como apagar', 'Enquanto a sua conta existir. Em <b>Configurações → Excluir minha conta</b>, ou pedindo ao líder, tudo o que está no servidor é apagado.') +
    pv('Seus direitos (LGPD)', 'Você ou o seu responsável podem pedir para ver quais dados existem, corrigir, apagar e retirar a autorização a qualquer momento.') +
    pv('Menores de 18 anos', 'O cadastro exige a autorização de um responsável, que pode pedir para ver ou apagar tudo.') +
    pv('Segurança', 'A conexão é protegida (HTTPS) e as senhas são embaralhadas. Mesmo assim nenhum sistema é 100% seguro: use uma senha que só você conhece.') +
    pv('Uma ressalva honesta', 'O ranking usa o progresso informado pelo seu aparelho. É uma brincadeira de constância, não uma prova.') +
    `<p style="color:var(--faint);font-size:12.5px">Versão do aviso: ${esc(CFG.aceiteVersao || '—')}</p>`, { wide: true, label: 'Aviso de privacidade' });
}

/* ---------- cliques das funções da conta (chamado pelo onClick do motor) ---------- */
function authClick(act, id, t) {
  switch (act) {
    case 'rank': openChannel('ranking'); return true;
    case 'admin': openAdmin(); return true;
    case 'rk-refresh': renderRankBoard(); return true;
    case 'rk-tab': RK.tipo = id; renderRankBoard(); return true;
    case 'rk-show': setVisibility(true); return true;
    case 'adm-tab': ADM.tab = id; admRender(); return true;
    case 'adm-reload': admLoad(); return true;
    case 'adm-ask': admAsk(id, t.dataset.op); return true;
    case 'adm-cancel': admRender(); return true;
    case 'adm-do': admDo(id, t.dataset.op, t); return true;
    case 'adm-copy': copyText(t.dataset.pw).then(ok => toast(ok ? '📋 Senha copiada' : 'Não consegui copiar; anote a senha.')); return true;
    case 'privacy': openPrivacy(); return true;
    case 'srv-vis': { const on = !ME.mostrarRanking; t.classList.toggle('on', on); t.setAttribute('aria-checked', String(on)); setVisibility(on); return true; }
    case 'srv-pw': { const b = $('#pwBox'); if (b) { b.innerHTML = pwFormHTML(); const f = $('#pwOld'); if (f && !coarse()) f.focus(); } return true; }
    case 'srv-pw-x': { const b = $('#pwBox'); if (b) b.innerHTML = '<button class="btn ghost" data-act="srv-pw">Trocar minha senha…</button>'; return true; }
    case 'srv-del': { const b = $('#delBox'); if (b) { b.innerHTML = delFormHTML(); const f = $('#dlPass'); if (f && !coarse()) f.focus(); } return true; }
    case 'srv-del-x': { const b = $('#delBox'); if (b) b.innerHTML = '<button class="btn ghost" style="color:var(--bad)" data-act="srv-del">Excluir minha conta…</button>'; return true; }
    case 'srv-logout': doLogout(false); return true;
    case 'install': if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; } return true;
  }
  return false;
}
