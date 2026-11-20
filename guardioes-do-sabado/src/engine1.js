/* ============================================================
   ENGINE · parte 1 — utilidades, estado, renderização do chat, XP e conquistas
   ============================================================ */

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const wc = s => { const n = norm(s); return n ? n.split(' ').length : 0; };
const pick = (a, n) => a[Math.abs(n | 0) % a.length];
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const hueOf = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const dkey = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const sabbathKey = () => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7)); return dkey(d); };
const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
const coarse = () => { try { return matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } };
const trunc = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };

function md(s) {
  let t = String(s == null ? '' : s).split('{nick}').join(S.user.name || 'você');
  t = esc(t);
  t = t.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[\s(>"“—])\*([^\s*][^*]*?)\*(?=[\s).,!?:;<"”—]|$)/g, '$1<em>$2</em>');
  return t.replace(/\n/g, '<br>');
}

/* ---------- ícones ---------- */
const svg = (inner, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;
const I = {
  hash: svg('<path d="M9.5 3 7.5 21M16.5 3l-2 18M4 8.5h17M3 15.5h17"/>'),
  lock: svg('<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
  check: svg('<circle cx="12" cy="12" r="9"/><path d="m7.8 12.4 2.8 2.8 5.6-6"/>'),
  checkSm: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'stroke-width="3"'),
  chev: svg('<path d="m6 9 6 6 6-6"/>'),
  x: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  gear: svg('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
  sound: svg('<path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>'),
  mute: svg('<path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="m17 9 4 6M21 9l-4 6"/>')
};

/* ---------- estado + persistência (localStorage, com fallback em memória) ---------- */
const KEY = 'guardioes-do-sabado:v1';
const DEF = () => ({
  v: 1, user: { name: '', av: '🙂' }, xp: 0, streak: { n: 0, last: '' },
  ch: {}, ans: {}, badges: {}, dec: {}, pocket: {}, parked: [],
  set: { sound: false, timer: true, fast: false, theme: 'auto' },
  week: { key: '', items: {}, paid: {}, diary: '', diaryXp: false, kept: false },
  weeksKept: 0, base: '', fin: '', pledge: { decide: '', why: '' },
  stats: { qa: 0 }, ui: { closed: {}, last: '' }
});
let S = DEF();
let active = null;          // id do canal aberto
let AW = null;              // o que o jogo espera do usuário agora
let RUN = 0;                // token de execução do canal (aborta ao trocar de canal)

function mergeState(raw) {
  const d = DEF();
  if (!raw || typeof raw !== 'object') return d;
  const out = Object.assign({}, d, raw);
  ['user', 'streak', 'set', 'week', 'pledge', 'stats', 'ui'].forEach(k => { out[k] = Object.assign({}, d[k], raw[k] || {}); });
  ['ch', 'ans', 'badges', 'dec', 'pocket'].forEach(k => { out[k] = raw[k] && typeof raw[k] === 'object' ? raw[k] : {}; });
  if (!Array.isArray(out.parked)) out.parked = [];
  return out;
}
function loadState() { try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) { /* sem storage */ } return null; }
let saveTimer = 0;
function saveNow() { clearTimeout(saveTimer); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sem storage */ } }
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 120); }
const chs = id => { if (!S.ch[id]) S.ch[id] = { i: 0, done: false, hist: [], sub: {} }; return S.ch[id]; };

/* ---------- cargos, desbloqueio, fases ---------- */
const roleIdx = xp => ROLES.reduce((r, x, i) => (xp >= x.xp ? i : r), 0);
const isDone = id => !!(S.ch[id] && S.ch[id].done);
function dilemmasDone() { return F4.filter(isDone).length; }

function unlocked(c) {
  if (c.id === 'boas-vindas') return true;
  if (c.id === 'como-jogar' || c.id === 'pergunte') return isDone('boas-vindas');
  if (c.id === 'missao') return isDone('3-despedida');
  if (c.cat === 'f4') return isDone('3-quiz');
  if (c.id === 'chefao-plano') return dilemmasDone() >= 4;
  if (c.id === 'chefao-compromisso') return isDone('chefao-plano');
  const i = SEQ.indexOf(c.id);
  return i > 0 ? isDone(SEQ[i - 1]) : false;
}
function lockHint(c) {
  if (c.id === 'como-jogar' || c.id === 'pergunte') return '🔒 Termine o check-in em #boas-vindas primeiro.';
  if (c.id === 'missao') return '🔒 Conclua a Fase 3 (até #3-despedida) para liberar a missão da semana.';
  if (c.cat === 'f4') return '🔒 Termine o quiz da Fase 3 (#3-quiz) para liberar os dilemas.';
  if (c.id === 'chefao-plano') return `🔒 Decida pelo menos 4 dilemas para enfrentar o Chefão (faltam ${Math.max(0, 4 - dilemmasDone())}).`;
  if (c.id === 'chefao-compromisso') return '🔒 Monte seu plano em #chefao-plano primeiro.';
  const i = SEQ.indexOf(c.id);
  return i > 0 ? `🔒 Termine #${CHM[SEQ[i - 1]].name} para destravar este canal.` : '🔒 Canal bloqueado.';
}
function nextAfter(c) {
  const order = CH.filter(x => x.cat !== 'free' && x.id !== 'como-jogar');
  const i = order.findIndex(x => x.id === c.id);
  for (let k = i + 1; k < order.length; k++) { if (unlocked(order[k]) && !isDone(order[k].id)) return order[k]; }
  for (let k = 0; k < order.length; k++) { if (unlocked(order[k]) && !isDone(order[k].id)) return order[k]; }
  return null;
}
function catComplete(cat) { const l = CH.filter(c => c.cat === cat); return l.length > 0 && l.every(c => isDone(c.id)); }

/* ---------- renderização: lateral, usuário, painel, topo ---------- */
function renderChannels() {
  let h = '';
  for (const cat of CATS) {
    const list = CH.filter(c => c.cat === cat.id);
    if (!list.length) continue;
    const done = list.filter(c => isDone(c.id)).length;
    const closed = S.ui.closed[cat.id] ? ' closed' : '';
    h += `<section class="cat${closed}"><button class="cat-h" data-act="cat" data-id="${cat.id}" aria-expanded="${!closed}">${I.chev}<span>${esc(cat.t)}</span><span class="ct">${done}/${list.length}</span></button><div class="chs">`;
    for (const c of list) {
      const un = unlocked(c), dn = isDone(c.id) && c.kind !== 'qa' && c.kind !== 'board', act = active === c.id;
      const started = (S.ch[c.id] && (S.ch[c.id].i || 0)) > 0;
      const cls = ['ch', act ? 'active' : '', !un ? 'locked' : '', dn ? 'done' : '', (un && !dn && !started && !act) ? 'fresh' : ''].filter(Boolean).join(' ');
      const ico = !un ? I.lock : dn ? I.check : I.hash;
      h += `<button class="${cls}" data-act="open" data-id="${c.id}" data-ch="${c.id}"${act ? ' aria-current="page"' : ''}${!un ? ' aria-disabled="true"' : ''}>${ico}<span class="nm">${esc(c.name)}</span>${c.pill && un && !dn ? `<span class="pill">${esc(c.pill)}</span>` : ''}</button>`;
    }
    h += '</div></section>';
  }
  $('#chlist').innerHTML = h;
  renderDay();
}

function renderUser() {
  const r = ROLES[roleIdx(S.xp)];
  $('#userbar').innerHTML =
    `<button class="ub-me" data-act="profile" aria-label="Abrir meu perfil"><span class="av sm" style="--h:${hueOf(S.user.name || 'v')}">${esc(S.user.av)}<span class="st"></span></span><span class="ub-t"><b>${esc(S.user.name || 'Visitante')}</b><small>${r.e} ${esc(r.n)} · ${S.xp} XP${S.streak.n > 1 ? ' · 🔥' + S.streak.n : ''}</small></span></button>` +
    `<button class="ub-btn${S.set.sound ? '' : ' off'}" data-act="tog" data-id="sound" aria-label="Som ${S.set.sound ? 'ligado' : 'desligado'}" title="Som">${S.set.sound ? I.sound : I.mute}</button>` +
    `<button class="ub-btn" data-act="settings" aria-label="Configurações" title="Configurações">${I.gear}</button>`;
  $('#railMe').textContent = S.user.av;
}

function xpCardHTML() {
  const r = roleIdx(S.xp), role = ROLES[r], next = ROLES[r + 1];
  const pct = next ? Math.round((S.xp - role.xp) / (next.xp - role.xp) * 100) : 100;
  return `<div class="xpc"><div class="role" style="--rc:${role.c}"><i></i>${role.e} ${esc(role.n)}</div>` +
    `<div class="num"><b>${S.xp}</b><span>XP${next ? ` · próximo: ${next.xp}` : ' · topo!'}</span></div>` +
    `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>` +
    `<small>${next ? `Faltam <b>${next.xp - S.xp} XP</b> para <b>${esc(next.n)}</b>.` : 'Você chegou ao cargo mais alto. Agora, viva isso toda semana.'}</small>` +
    (S.streak.n > 1 ? `<small>🔥 Ofensiva: <b>${S.streak.n} dias</b> seguidos</small>` : '') + `</div>`;
}
function memRow(id, sub) {
  const p = whoInfo(id);
  return `<div class="mem">${p.bot ? `<span class="av sm bot">${p.e}<span class="st"></span></span>` : `<span class="av sm" style="--h:${p.h}">${esc(p.e)}<span class="st"></span></span>`}<span><b>${esc(p.n)}${p.bot ? ' <span class="tag">BOT</span>' : ''}</b><small>${esc(sub)}</small></span></div>`;
}
function renderMembers() {
  const c = CHM[active] || {};
  const cast = c.cast || [];
  let h = `<button class="mem-x" data-act="current" aria-label="Fechar painel">${I.x}</button><div class="mh">Seu progresso</div>${xpCardHTML()}`;
  h += `<div class="mh">Online — ${2 + cast.length}</div>` + memRow('neemias', 'Mentor do servidor') + memRow('me', ROLES[roleIdx(S.xp)].n);
  if (cast.length) h += `<div class="mh">Na conversa · personagens fictícios</div>` + cast.map(id => memRow(id, 'NPC')).join('');
  const have = Object.keys(S.badges).length;
  h += `<div class="mh">Conquistas · ${have}/${Object.keys(BADGES).length}</div><div class="badges">` +
    Object.entries(BADGES).map(([id, b]) => `<div class="bdg${S.badges[id] ? '' : ' off'}" data-t="${esc(b.n + ' — ' + b.d)}" tabindex="0" role="img" aria-label="${esc(b.n + (S.badges[id] ? ' (conquistada)' : ' (bloqueada)') + ': ' + b.d)}">${b.e}</div>`).join('') + '</div>';
  $('#members').innerHTML = h;
}
function renderTop() {
  const c = CHM[active];
  if (!c) return;
  $('#tbName').textContent = c.name;
  $('#tbTopic').textContent = c.topic || '';
  document.title = `#${c.name} · Guardiões do Sábado`;
}
function renderDay() {
  const wd = new Date().getDay(), nm = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  let t;
  if (wd === 5) t = unlocked(CHM.missao) ? '🌅 <b>Hoje é sexta</b> — dia de preparação. Abra a <b>#missao-da-semana</b>.' : '🌅 <b>Hoje é sexta</b> — dia de preparação. Termine a Fase 3 para liberar a <b>#missao-da-semana</b>.';
  else if (wd === 6) t = '🌿 <b>Feliz sábado!</b> Aqui é estudo e reflexão: ótimo para fazer em turma, à tarde.';
  else { const n = (6 - wd + 7) % 7; t = `📅 Hoje é <b>${nm[wd]}</b> · faltam <b>${n} dia${n > 1 ? 's' : ''}</b> para o sábado.`; }
  $('#sday').innerHTML = t;
}
function renderAll() { renderChannels(); renderUser(); renderMembers(); renderTop(); renderDay(); }

/* ---------- mensagens ---------- */
function whoInfo(id) {
  if (id === 'me') return { n: S.user.name || 'Você', e: S.user.av, h: hueOf(S.user.name || 'v'), me: 1 };
  return NPC[id] || { n: String(id), e: '🙂', h: hueOf(String(id)) };
}
function avHTML(w, extra = '') {
  const p = whoInfo(w);
  return p.bot ? `<div class="av bot ${extra}" aria-hidden="true">${p.e}</div>` : `<div class="av ${extra}" style="--h:${p.h}" aria-hidden="true">${esc(p.e)}</div>`;
}
function srcLabel(id) {
  const s = SRC[id];
  if (!s) return '';
  return s.u ? `<a href="${esc(s.u)}" target="_blank" rel="noopener noreferrer">${esc(s.t)}</a>` : esc(s.t);
}
function embedHTML(e) {
  if (!e) return '';
  let h = `<div class="embed${e.cls ? ' ' + e.cls : ''}"${e.c ? ` style="--e:${e.c}"` : ''}>`;
  if (e.title) h += `<div class="e-title">${md(e.title)}</div>`;
  if (e.desc) h += `<div class="e-desc">${md(e.desc)}</div>`;
  if (e.quote) h += `<blockquote>${md(e.quote)}${e.cite ? `<cite>${esc(e.cite)}</cite>` : ''}</blockquote>`;
  if (e.fields) h += `<div class="e-fields">${e.fields.map(f => `<div class="e-f${f.w ? ' wide' : ''}"><b>${md(f.n)}</b><div>${md(f.v)}</div></div>`).join('')}</div>`;
  if (e.xp) h += `<div class="e-xp">⭐ ${esc(e.xp)}</div>`;
  const srcs = (e.src || []).map(srcLabel).filter(Boolean);
  if (srcs.length) h += `<div class="e-src">📌 ${srcs.join(' · ')}</div>`;
  if (e.foot) h += `<div class="e-foot">${md(e.foot)}</div>`;
  return h + '</div>';
}
const btnsHTML = b => (b && b.length) ? `<div class="btns">${b.map(x => `<button class="btn ${x.cls || ''}" data-act="${esc(x.a)}" data-id="${esc(x.id || '')}">${esc(x.l)}</button>`).join('')}</div>` : '';
function faqChip(id) { const f = FAQ.find(x => x.id === id); return f ? `<button class="qchip" data-act="faq" data-id="${f.id}">${esc(f.q)}</button>` : ''; }
function compHTML(c) {
  if (!c) return '';
  if (c.t === 'avatars') return `<div class="avpick" role="group" aria-label="Escolha um avatar">${EMOJIS.map(e => `<button class="${S.user.av === e ? 'on' : ''}" data-act="avatar" data-id="${e}" aria-label="Avatar ${e}">${e}</button>`).join('')}</div>`;
  if (c.t === 'pocket') { const d = S.pocket[c.id]; return `<div class="btns"><button class="btn ${d ? 'ok' : 'pri'}" data-act="pocket" data-id="${esc(c.id)}"${d ? ' disabled' : ''}>${d ? '✔ Feito! +' + c.xp + ' XP' : '✅ Já fiz / vou fazer hoje'}</button></div>`; }
  if (c.t === 'qchips') return `<div class="quick">${FAQ_SUGGEST.map(faqChip).join('')}</div>`;
  if (c.t === 'related') return `<div class="quick">${c.ids.map(faqChip).join('')}</div>`;
  return '';
}
const fmtTime = ts => new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const fmtDay = ts => new Date(ts).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const sameDay = (a, b) => dkey(new Date(a)) === dkey(new Date(b));

function msgHTML(m, prev, isNew) {
  let h = '';
  if (!prev || !sameDay(prev.ts, m.ts)) h += `<div class="day"><span>${esc(fmtDay(m.ts))}</span></div>`;
  if (m.k === 'sys') return h + `<div class="sys${isNew ? ' new' : ''}">${md(m.x)}${compHTML(m.c)}</div>`;
  const p = whoInfo(m.w);
  const compact = !!(prev && prev.k !== 'sys' && prev.w === m.w && sameDay(prev.ts, m.ts) && (m.ts - prev.ts) < 300000);
  const nm = p.me ? `color:${ROLES[roleIdx(S.xp)].c}` : p.bot ? 'color:var(--accent-ink)' : `color:hsl(${p.h} 62% var(--nl))`;
  const tag = p.bot ? '<span class="tag">BOT</span>' : (p.me ? '' : '<span class="tag npc">NPC</span>');
  const gut = compact ? `<div class="gut"><time>${esc(fmtTime(m.ts))}</time></div>` : `<div class="gut">${avHTML(m.w)}</div>`;
  const head = compact ? '' : `<div class="head"><span class="nm" style="${nm}">${esc(p.n)}</span>${tag}<time>${esc(fmtTime(m.ts))}</time></div>`;
  const txt = m.x ? `<div class="txt">${m.w === 'me' ? esc(m.x).replace(/\n/g, '<br>') : md(m.x)}</div>` : '';
  return h + `<div class="msg${compact ? ' compact' : ' first'}${p.me ? ' me' : ''}${isNew ? ' new' : ''}">${gut}<div class="body">${head}${txt}${embedHTML(m.e)}${btnsHTML(m.b)}${compHTML(m.c)}</div></div>`;
}
function appendMsg(chId, m) {
  const box = $('#msgs'), st = chs(chId), idx = st.hist.indexOf(m), prev = idx > 0 ? st.hist[idx - 1] : null;
  const near = box.scrollHeight - box.scrollTop - box.clientHeight < 200 || m.w === 'me';
  box.insertAdjacentHTML('beforeend', msgHTML(m, prev, true));
  if (near) box.scrollTop = box.scrollHeight;
}
function renderHistory(chId) {
  const box = $('#msgs'), st = chs(chId), c = CHM[chId];
  let h = c.kind === 'board' ? '<div class="board" id="board"></div>' : '', prev = null;
  for (const m of st.hist) { h += msgHTML(m, prev, false); prev = m; }
  box.innerHTML = h;
  if (c.kind === 'board') renderBoard();
  box.scrollTop = box.scrollHeight;
}
function post(chId, m) {
  m.ts = Date.now();
  const st = chs(chId);
  st.hist.push(m);
  if (st.hist.length > 400) st.hist.shift();
  save();
  if (active === chId) appendMsg(chId, m);
  if (pendingLvl != null && m.w === 'neemias' && !m.lvl) setTimeout(flushLevel, 350);
  return m;
}

/* ---------- toasts, efeitos, som ---------- */
function toast(msg) {
  $$('.toast').forEach(x => x.remove());
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  $('#layer').appendChild(el);
  setTimeout(() => el.remove(), 3400);
}
let flying = 0;
function flyXP(n) {
  if (reduced()) return;
  const r = $('#comp').getBoundingClientRect(), el = document.createElement('div');
  el.className = 'xpfly'; el.textContent = '+' + n + ' XP';
  el.style.left = Math.max(12, r.right - 110) + 'px'; el.style.top = Math.max(60, r.top - 18 - flying * 26) + 'px';
  flying++;
  $('#layer').appendChild(el);
  setTimeout(() => { el.remove(); flying = Math.max(0, flying - 1); }, 1600);
}
function confetti() {
  if (reduced()) return;
  const cols = ['#f5b94a', '#ff8a5c', '#8f83ff', '#4cc38a', '#ffffff'], layer = $('#layer');
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('i');
    p.className = 'cf';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = cols[i % cols.length];
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    p.style.animationDelay = Math.random() * .5 + 's';
    layer.appendChild(p);
    setTimeout(() => p.remove(), 3800);
  }
}
let actx = null;
function sfx(kind) {
  if (!S.set.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const seq = ({ xp: [[660, .06]], ok: [[660, .08], [880, .1]], bad: [[220, .14]], badge: [[784, .08], [988, .08], [1175, .14]], up: [[523, .1], [659, .1], [784, .1], [1047, .24]] })[kind] || [];
    let t = actx.currentTime;
    for (const [f, d] of seq) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + .02); t += d * .9;
    }
  } catch (e) { /* áudio indisponível */ }
}

/* ---------- modais (um por vez, com fila para avisos) ---------- */
let modalOpen = false, modalQ = [], lastFocus = null;
function openModal(html, o = {}) {
  if (modalOpen && o.queue) { modalQ.push({ html, o }); return; }
  closeModal(true);
  modalOpen = true; lastFocus = document.activeElement;
  const w = document.createElement('div');
  w.className = 'mwrap'; w.id = 'mwrap';
  w.innerHTML = `<div class="modal${o.wide ? ' wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(o.label || 'Janela')}" tabindex="-1">${html}</div>`;
  w.addEventListener('mousedown', e => { if (e.target === w && !o.sticky) closeModal(); });
  $('#layer').appendChild(w);
  const f = $('input, textarea, button.pri, .m-x', w) || $('.modal', w);
  setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { /* ok */ } }, 30);
}
function closeModal(silent) {
  const w = $('#mwrap');
  if (w) w.remove();
  modalOpen = false;
  if (!silent) {
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* ok */ } }
    const n = modalQ.shift();
    if (n) openModal(n.html, n.o);
  }
}

/* ---------- XP, ofensiva, conquistas, cargos ---------- */
function touchStreak() {
  const t = dkey();
  if (S.streak.last === t) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  S.streak.n = S.streak.last === dkey(y) ? S.streak.n + 1 : 1;
  S.streak.last = t;
  if (S.streak.n >= 3) giveBadge('fogo');
}
function addXP(n) {
  n = Math.round(n);
  if (!n) return;
  const before = roleIdx(S.xp);
  S.xp += n; touchStreak(); save();
  renderUser(); renderMembers();
  flyXP(n); sfx('xp');
  const after = roleIdx(S.xp);
  if (after > before) levelUp(after);
}
function giveBadge(id) {
  if (S.badges[id] || !BADGES[id]) return;
  S.badges[id] = Date.now(); save();
  const b = BADGES[id];
  toast(`${b.e} Conquista: ${b.n}`); sfx('badge'); renderMembers();
}
let pendingLvl = null, lvlTimer = 0;
function levelUp(i) {
  pendingLvl = i;
  clearTimeout(lvlTimer);
  lvlTimer = setTimeout(flushLevel, 1800);   // garantia caso nenhuma fala do Neemias venha em seguida
}
function flushLevel() {
  clearTimeout(lvlTimer);
  if (pendingLvl == null) return;
  const i = pendingLvl, r = ROLES[i];
  pendingLvl = null;
  confetti(); sfx('up');
  toast(`${r.e} Novo cargo: ${r.n}`);
  if (active) post(active, { w: 'neemias', x: '', lvl: true, e: { c: r.c, title: `${r.e} Novo cargo: ${r.n}`, desc: `Você chegou a **${S.xp} XP**. ${i === ROLES.length - 1 ? 'Topo do servidor! Agora, **viva isso** toda semana.' : 'Continue — o próximo cargo está logo ali.'}` } });
}
