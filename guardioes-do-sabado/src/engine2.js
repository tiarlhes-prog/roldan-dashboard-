/* ============================================================
   ENGINE · parte 2 — fluxo dos canais, avaliação das respostas, dilemas, Q&A, missão, modais e boot
   ============================================================ */

/* ---------- espera / "digitando…" ---------- */
let skipFn = null;
function waitMs(ms) {
  return new Promise(res => {
    const t = setTimeout(done, ms);
    function done() { clearTimeout(t); if (skipFn === done) skipFn = null; res(); }
    skipFn = done;
  });
}
function skipWait() { if (skipFn) skipFn(); }
async function typing(w, ms, tok) {
  if (S.set.fast || reduced()) ms = Math.min(ms, 120);
  const el = $('#typing'), p = whoInfo(w);
  el.innerHTML = `<span class="dots"><i></i><i></i><i></i></span><span><b>${esc(p.n)}</b> está digitando…</span>`;
  await waitMs(ms);
  if (tok === RUN) el.innerHTML = '';
  return tok === RUN;
}
const typeMs = (text, extra = 0) => clamp(380 + String(text || '').length * 8 + extra, 450, 1500);
async function botSay(chId, text, o = {}, ms = 600) {
  const tok = RUN;
  if (active === chId && ms > 0) await typing('neemias', ms, tok);
  return post(chId, Object.assign({ w: 'neemias', x: text }, o));
}
async function advance(chId, ms = 450) {
  if (active !== chId) return;
  await waitMs(S.set.fast || reduced() ? 40 : ms);
  if (active === chId) play(chId);
}

/* ---------- o que o jogo espera do usuário (AW), chips e cronômetro ---------- */
function setAW(a, idle) {
  AW = a;
  const inp = $('#inp'), send = $('#send'), comp = $('#comp');
  const typeable = !!a && a.type !== 'dec';
  inp.disabled = !typeable; send.disabled = !typeable; comp.classList.toggle('off', !typeable);
  inp.placeholder = a ? (a.ph || 'Escreva sua resposta…') : (idle || 'Neemias está escrevendo…');
  stopTimer();
  renderChips();
  if (a && a.type === 'ask' && a.step.time && S.set.timer) startTimer(a.step.time);
  if (typeable && !coarse() && !modalOpen) inp.focus({ preventScroll: true });
}
const chipBtn = (cmd, label) => `<button class="chip" data-act="runcmd" data-id="${cmd}">${label}</button>`;
function renderChips() {
  let h = '';
  if (AW) {
    if (AW.type === 'ask') {
      const st = AW.step;
      if (st.kind === 'concept' || st.kind === 'list') h += chipBtn('/dica', '💡 Dica (−5 XP)') + chipBtn('/resposta', '👀 Ver resposta');
      if (!st.base && !st.final) h += chipBtn('/pular', '⏭ Pular');
    } else if (AW.type === 'dec') {
      h += `<button class="chip hot" data-act="dec" data-id="${esc(AW.step.id)}">📝 Abrir formulário de decisão</button>`;
    } else if (AW.type === 'qa') {
      const seen = S.stats.seen || {}, un = FAQ.filter(f => !seen[f.id]);
      const ids = un.filter(f => FAQ_SUGGEST.indexOf(f.id) >= 0).concat(un.filter(f => FAQ_SUGGEST.indexOf(f.id) < 0)).slice(0, 4).map(f => f.id);
      h += ids.map(id => { const f = FAQ.find(q => q.id === id); return f ? `<button class="chip" data-act="faq" data-id="${f.id}">${esc(f.q)}</button>` : ''; }).join('');
    }
  }
  $('#chips').innerHTML = h;
}
let tmr = 0, tEnd = 0;
function startTimer(sec) {
  stopTimer();
  const bar = $('#timer'), i = bar.firstElementChild;
  bar.hidden = false; bar.classList.remove('low');
  i.style.transition = 'none'; i.style.transform = 'scaleX(1)'; void i.offsetWidth;
  if (!reduced()) { i.style.transition = `transform ${sec}s linear`; i.style.transform = 'scaleX(0)'; }
  tEnd = Date.now() + sec * 1000;
  tmr = setInterval(() => {
    const left = (tEnd - Date.now()) / 1000;
    bar.classList.toggle('low', left < 8);
    if (reduced()) i.style.transform = `scaleX(${clamp(left / sec, 0, 1)})`;
    if (left <= 0) { stopTimer(); onTimeout(); }
  }, 250);
}
function stopTimer() { clearInterval(tmr); tmr = 0; const b = $('#timer'); if (b) b.hidden = true; }
const timerLeft = () => tmr ? Math.max(0, (tEnd - Date.now()) / 1000) : 0;

/* ---------- abrir canal e reproduzir os passos ---------- */
function closeDrawers() { $('#app').classList.remove('show-nav', 'show-mem'); $('#scrim').hidden = true; }
function openChannel(id, o = {}) {
  const c = CHM[id];
  if (!c) return;
  if (!unlocked(c)) {
    toast(lockHint(c));
    const b = $(`[data-ch="${id}"]`);
    if (b) { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); }
    return;
  }
  closeDrawers();
  if (active === id && !o.force) return;
  RUN++; skipWait(); stopTimer(); $('#typing').innerHTML = ''; closeModal(true); modalQ = [];
  active = id; S.ui.last = id; save();
  setAW(null);
  renderTop(); renderChannels(); renderMembers(); renderHistory(id);
  startChannel(c);
}
function fillStatic(c) {
  const st = chs(c.id);
  c.steps.forEach(s => {
    if (s.t === 'say') st.hist.push({ w: s.who, x: s.text || '', e: s.embed, b: s.b, c: s.c, k: s.who === 'narr' ? 'sys' : undefined, ts: Date.now() });
  });
  st.i = c.steps.length; save();
}
function startChannel(c) {
  const st = chs(c.id);
  if (c.kind === 'static') {
    if (!st.i) { fillStatic(c); renderHistory(c.id); }
    setAW(null, 'Somente leitura · toque no +');
    return;
  }
  if (c.kind === 'qa' || c.kind === 'board') {
    if (!st.i) { fillStatic(c); renderHistory(c.id); }
    setAW(c.kind === 'qa'
      ? { type: 'qa', chId: c.id, ph: 'Pergunte algo sobre o sábado…' }
      : { type: 'diary', chId: c.id, ph: 'Diário: como foi seu sábado?' });
    return;
  }
  if (st.done) { setAW(null, 'Canal concluído ✔'); return; }
  play(c.id);
}
async function play(chId) {
  if (active !== chId) return;
  const tok = ++RUN;
  skipWait();
  const c = CHM[chId], st = chs(chId);
  while (tok === RUN && active === chId) {
    if (st.i >= c.steps.length) { finishChannel(c); return; }
    const r = await runStep(c, st, c.steps[st.i], tok);
    if (r !== 'next') return;
  }
}
async function runStep(c, st, s, tok) {
  const alive = () => tok === RUN && active === c.id;
  switch (s.t) {
    case 'say': {
      if (s.who === 'narr') await waitMs(S.set.fast || reduced() ? 80 : 650);
      else await typing(s.who, typeMs(s.text, s.embed ? 500 : 0), tok);
      if (!alive()) return 'abort';
      post(c.id, { w: s.who, x: s.text || '', e: s.embed, b: s.b, c: s.c, k: s.who === 'narr' ? 'sys' : undefined });
      st.i++; save(); return 'next';
    }
    case 'ask': {
      if (st.sub.asked !== st.i) {
        await typing('neemias', s.kind === 'short' ? 450 : typeMs(s.text), tok);
        if (!alive()) return 'abort';
        post(c.id, { w: 'neemias', x: s.text });
        st.sub.asked = st.i; st.sub.tries = 0; st.sub.hint = false; save();
      }
      setAW({ type: 'ask', c, st, step: s, ph: s.ph });
      return 'wait';
    }
    case 'name': {
      if (S.user.name) { st.i++; save(); return 'next'; }
      setAW({ type: 'name', c, st, step: s, ph: 'Seu apelido (2 a 20 letras)…' });
      return 'wait';
    }
    case 'avatar': {
      await typing('neemias', 500, tok);
      if (!alive()) return 'abort';
      post(c.id, { w: 'neemias', x: 'Prazer, **{nick}**! 🤝 Escolha um avatar (opcional) — é só tocar:', c: { t: 'avatars' } });
      st.i++; save(); return 'next';
    }
    case 'dec': {
      if (st.sub.asked !== st.i) {
        await typing('neemias', 700, tok);
        if (!alive()) return 'abort';
        post(c.id, { w: 'neemias', x: `📝 **${s.title}**\n${s.intro}`, b: [{ l: '📝 Abrir formulário de decisão', a: 'dec', id: s.id, cls: 'pri' }] });
        st.sub.asked = st.i; save();
      }
      setAW({ type: 'dec', c, st, step: s, ph: 'Abra o formulário de decisão ↑' });
      return 'wait';
    }
    case 'pocket': {
      await typing('neemias', typeMs(s.text), tok);
      if (!alive()) return 'abort';
      post(c.id, { w: 'neemias', x: `🎯 **Missão de bolso** · vale **+${s.xp} XP** quando você fizer de verdade\n${s.text}`, c: { t: 'pocket', id: s.id, xp: s.xp } });
      st.i++; save(); return 'next';
    }
    case 'plan': {
      await typing('neemias', 900, tok);
      if (!alive()) return 'abort';
      const A = id => (S.ans[id] && S.ans[id].t && S.ans[id].t[0] !== '(') ? S.ans[id].t : '—';
      post(c.id, { w: 'neemias', x: 'Aqui está o **seu Plano de Sábado**. Guarde na memória — e no coração:', e: { title: '🗓️ Meu Plano de Sábado', c: 'var(--accent)', fields: [
        { n: '🌅 Sexta', v: A('p1'), w: 1 }, { n: '🕯️ Culto de pôr do sol', v: A('p2'), w: 1 },
        { n: '🌿 Sábado', v: A('p3'), w: 1 }, { n: '📱 Modo Sábado e dilemas', v: A('p4'), w: 1 }
      ], foot: 'Este plano fica no seu aparelho. Mostre ao seu líder ou à sua família!' } });
      st.i++; save(); return 'next';
    }
    case 'summary': {
      await typing('neemias', 800, tok);
      if (!alive()) return 'abort';
      const ids = F4.filter(id => S.dec[id]);
      if (ids.length) {
        post(c.id, { w: 'neemias', x: 'Antes de decidir, olhe o caminho que você já fez:', e: { title: '🧾 Suas decisões de fé até aqui', c: 'var(--violet)', fields: ids.map(id => ({ n: S.dec[id].t.replace('Decisão de Fé · ', ''), v: trunc(firstVal(S.dec[id]), 160), w: 1 })) } });
      } else {
        post(c.id, { w: 'neemias', x: 'Você ainda não registrou decisões nos dilemas — sem problema. Escreva abaixo o que é verdadeiro para você **hoje**.' });
      }
      st.i++; save(); return 'next';
    }
    case 'compare': {
      await typing('neemias', 900, tok);
      if (!alive()) return 'abort';
      post(c.id, { w: 'neemias', x: 'Olhe só a sua jornada. O que mudou?', e: { title: '🔁 Antes × Depois', c: 'var(--accent)', fields: [
        { n: 'Antes (check-in inicial)', v: S.base || '—', w: 1 }, { n: 'Depois (check-in final)', v: S.fin || '—', w: 1 }
      ] } });
      st.i++; save(); return 'next';
    }
    case 'pledge': {
      await typing('neemias', 800, tok);
      if (!alive()) return 'abort';
      post(c.id, { w: 'neemias', x: '🪪 Seu **Cartão de Compromisso** está pronto. Agora vem a parte mais importante: **praticar**. Abra **#missao-da-semana** e comece pela sexta.', b: [{ l: '🪪 Ver meu Cartão de Compromisso', a: 'pledge', cls: 'pri' }, { l: '🎯 Ir para a Missão da semana', a: 'open', id: 'missao' }] });
      st.i++; save(); return 'next';
    }
    case 'quizend': {
      await typing('neemias', 600, tok);
      if (!alive()) return 'abort';
      const total = c.steps.filter(x => x.t === 'ask').length, right = st.sub.right || 0;
      post(c.id, { w: 'neemias', x: '', e: { cls: right === total ? 'ok' : 'violet', title: '🏁 Resultado do quiz', desc: `**${right}/${total}** acertos · melhor combo **×${st.sub.maxc || 0}**${right === total ? '\n⚡ Gabaritou!' : ''}` } });
      if (right === total) giveBadge('relampago');
      st.i++; save(); return 'next';
    }
  }
  st.i++; save(); return 'next';
}

/* ---------- avaliação das respostas abertas ---------- */
function evalConcepts(step, text) {
  const n = norm(text), cs = step.concepts || [];
  let tot = 0, got = 0; const hits = [], miss = [];
  for (const c of cs) {
    tot += c.w;
    const ok = c.items ? c.items.filter(re => re.test(n)).length >= c.need : c.re.test(n);
    if (ok) { got += c.w; hits.push(c.k); } else miss.push(c.k);
  }
  const pct = tot ? got / tot : 0;
  return { pct, hits, miss, full: pct >= (step.full == null ? .6 : step.full) };
}
function listItems(raw) {
  const parts = String(raw).split(/\n|;|,|•|·|\s[-–—]\s|\d+\s*[.)]\s*|\se\s/i).map(norm).filter(s => s.replace(/\s/g, '').length >= 3);
  return new Set(parts).size;
}
function calcXP(step, pct, how, st, full) {
  const base = step.xp || 30;
  if (how === 'reveal') return Math.round(base * .25);
  if (how === 'skip') return 0;
  let x = base * (.3 + .7 * pct);
  if (st.sub.hint) x -= 5;
  if (!st.sub.tries && full && !st.sub.hint) x *= 1.2;
  return Math.max(5, Math.round(x));
}
function recordAns(id, text, pct, xp) { S.ans[id] = { t: text, p: pct, x: xp, ts: Date.now() }; }
function stepDone(st) { st.i++; st.sub.tries = 0; st.sub.hint = false; save(); }

const OK_LINES = ['Isso! Você pegou a ideia. 🎯', 'Mandou bem — sem decoreba, com entendimento. 👏', 'É isso aí! Entendeu o ponto. ✅', 'Bingo! 🎉'];
const PART_LINES = ['Foi por um bom caminho! 🧭', 'Boa — você pegou parte da ideia. 👀', 'Quase lá! Veja o que faltou:'];
const CRISIS = /\b(me matar|suicid\w*|quero morrer|vontade de morrer|automutila\w*|me cortar|abuso sexual|abusad[oa] por|apanho em casa|sofro violencia)\b/;
async function careMsg(chId) {
  await botSay(chId, '', { e: { cls: 'bad', title: '💛 Parei o jogo um segundo', desc: 'O que você escreveu é sério e é **mais importante que qualquer pontuação**.\n\nFale **agora** com um adulto de confiança: pais ou responsáveis, pastor, líder, professor ou psicólogo. No Brasil, o **CVV (telefone 188)** atende 24 horas, de graça, por telefone e chat (cvv.org.br).\n\nVocê não precisa passar por isso sozinho(a).' } }, 400);
}

/* ---------- envio de mensagens ---------- */
function autosize() { const el = $('#inp'); el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 150) + 'px'; }
function onSend() {
  const inp = $('#inp'), text = inp.value.trim();
  if (!text) return;
  if (text[0] === '/') { inp.value = ''; autosize(); hideSlash(); runCommand(text); return; }
  if (!AW) return;
  inp.value = ''; autosize(); hideSlash();
  const t = AW.type;
  if (t === 'ask') onAsk(text);
  else if (t === 'name') onName(text);
  else if (t === 'qa') onQA(text);
  else if (t === 'diary') onDiary(text);
}
async function onName(text) {
  const a = AW, c = a.c, st = a.st;
  setAW(null);
  const name = text.replace(/[*_`<>\[\]{}]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
  if (name.length < 2) {
    post(c.id, { w: 'me', x: text });
    await botSay(c.id, 'Esse apelido ficou curto. Tente com **2 a 20 letras**.', {}, 300);
    setAW(a); return;
  }
  S.user.name = name; save(); renderUser(); renderMembers();
  post(c.id, { w: 'me', x: name });
  st.i++; save();
  advance(c.id, 300);
}
async function onAsk(text) {
  const a = AW, c = a.c, st = a.st, step = a.step, chId = c.id;
  setAW(null);
  post(chId, { w: 'me', x: text });
  const n = norm(text);
  if (CRISIS.test(n)) { await careMsg(chId); setAW(a); return; }
  if (step.kind === 'short') { finishShort(a, text); return; }
  if (/^(nao sei|n sei|sei la|nao lembro|nao faco ideia|nem ideia)$/.test(n) || (/\bnao sei\b/.test(n) && wc(text) <= 4)) {
    await botSay(chId, `Sem problema — dá pra aprender no caminho. Use **/dica** para uma pista ou **/resposta** para ver o modelo. Se quiser, tente de novo com o que você *acha*.`, {}, 450);
    setAW(a); return;
  }
  const min = step.minWords || 3;
  if (wc(text) < min) {
    await botSay(chId, `Escreva um pouquinho mais — pelo menos **${min} palavra${min > 1 ? 's' : ''}** — para eu entender sua ideia. Pode ser simples! ✍️`, {}, 350);
    setAW(a); return;
  }
  if (step.kind === 'reply') { finishReply(a, text); return; }
  if (step.kind === 'reflect') { finishReflect(a, text); return; }
  if (step.kind === 'list') { finishList(a, text); return; }
  const res = evalConcepts(step, text);
  if (res.full || (st.sub.tries || 0) >= 1) { finishConcept(a, text, res, 'answer'); return; }
  st.sub.tries = 1; save();
  const e = { cls: res.pct > 0 ? 'warn' : 'bad', title: res.pct > 0 ? '🟡 Você está no caminho' : '🔎 Ainda não vi a ideia central', fields: [] };
  if (res.hits.length) e.fields.push({ n: '✔ Você cobriu', v: res.hits.join(' · '), w: 1 });
  e.fields.push({ n: '🔎 Ainda falta', v: res.miss.join(' · '), w: 1 });
  e.foot = 'Reformule e envie de novo, ou use **/dica**. Se preferir, **/resposta** mostra o modelo.';
  await botSay(chId, res.pct > 0 ? 'Quase! Falta pouco — reformule incluindo o que faltou:' : 'Hmm, talvez você tenha dito com outras palavras. Quer tentar mais uma vez?', { e }, 650);
  setAW(a);
}
async function finishConcept(a, text, res, how) {
  const c = a.c, st = a.st, step = a.step, chId = c.id;
  const xp = calcXP(step, res ? res.pct : 0, how, st, !!(res && res.full));
  recordAns(step.id, how === 'answer' ? text : (how === 'reveal' ? '(viu a resposta-modelo)' : '(pulou)'), res ? res.pct : 0, xp);
  stepDone(st);
  addXP(xp);
  const full = how === 'answer' && res.full;
  const e = { cls: full ? 'ok' : (how === 'answer' && res.pct > 0 ? 'warn' : 'violet'), title: how === 'reveal' ? '👀 Resposta-modelo' : how === 'skip' ? '⏭ Resposta-modelo' : '📘 Resposta-modelo', fields: [], src: step.src, xp: xp ? `+${xp} XP` : '' };
  if (how === 'answer') {
    if (res.hits.length) e.fields.push({ n: '✔ Você cobriu', v: res.hits.join(' · '), w: 1 });
    if (res.miss.length && !res.full) e.fields.push({ n: '🔎 Faltou', v: res.miss.join(' · '), w: 1 });
  }
  e.fields.push({ n: 'Para comparar', v: step.model, w: 1 });
  const line = how === 'answer' ? (full ? pick(OK_LINES, hueOf(text)) : pick(PART_LINES, hueOf(text))) : 'Sem estresse — vamos aprender com o modelo:';
  sfx(full ? 'ok' : 'xp');
  await botSay(chId, line, { e }, 600);
  advance(chId, 500);
}
async function finishReflect(a, text) {
  const c = a.c, st = a.st, step = a.step, chId = c.id;
  let xp = step.xp;
  if (step.bonus && step.bonus.test(norm(text))) xp += Math.round(step.xp * .2);
  if (step.listBonus && listItems(text) >= step.listBonus) xp += Math.round(step.xp * .2);
  if (step.base) S.base = text;
  if (step.final) S.fin = text;
  if (step.pledge) S.pledge[step.pledge] = text;
  recordAns(step.id, text, 1, xp);
  stepDone(st);
  addXP(xp);
  if (step.react) await botSay(chId, step.react, step.src ? { e: { src: step.src } } : {}, 700);
  advance(chId, 450);
}
async function finishList(a, text) {
  const c = a.c, st = a.st, step = a.step, chId = c.id, need = step.need || 3;
  const items = listItems(text);
  if (items < need && !st.sub.tries) {
    st.sub.tries = 1; save();
    await botSay(chId, `Quase! Contei **${items}** item${items === 1 ? '' : 's'} e o pedido era de **${need}**. Separe cada ideia por vírgula ou em linhas diferentes — quer completar?`, {}, 500);
    setAW(a); return;
  }
  const ok = items >= need;
  let xp = ok ? step.xp : Math.round(step.xp * .5);
  if (ok && step.bonus && step.bonus.test(norm(text))) xp += Math.round(step.xp * .15);
  recordAns(step.id, text, ok ? 1 : items / need, xp);
  stepDone(st);
  addXP(xp);
  const e = { cls: ok ? 'ok' : 'warn', title: ok ? '✅ Lista completa!' : '🟡 Lista parcial', xp: `+${xp} XP`, src: step.src };
  if (step.model) e.fields = [{ n: 'Para comparar', v: step.model, w: 1 }];
  sfx(ok ? 'ok' : 'xp');
  await botSay(chId, step.react || (ok ? 'Boa!' : 'Valeu por tentar.'), { e }, 600);
  advance(chId, 450);
}
function finishReply(a, text) {
  const c = a.c, st = a.st, step = a.step;
  recordAns(step.id, text, 1, step.xp);
  stepDone(st);
  addXP(step.xp);
  advance(c.id, 400);
}
async function finishShort(a, text) {
  const c = a.c, st = a.st, step = a.step, chId = c.id, n = norm(text);
  const left = timerLeft(); stopTimer();
  const ok = (step.accept || []).some(re => re.test(n));
  let xp = 0, line;
  if (ok) {
    st.sub.combo = (st.sub.combo || 0) + 1; st.sub.right = (st.sub.right || 0) + 1; st.sub.maxc = Math.max(st.sub.maxc || 0, st.sub.combo);
    const bonus = Math.min(10, (st.sub.combo - 1) * 2), tb = (step.time && S.set.timer) ? Math.floor(left / 5) : 0;
    xp = (step.xp || 15) + bonus + tb;
    line = `✅ **Certo!** +${xp} XP${st.sub.combo > 1 ? ` · combo ×${st.sub.combo} 🔥` : ''}`; sfx('ok');
  } else {
    st.sub.combo = 0; line = `❌ Quase! Era: **${step.ans}**`; sfx('bad');
  }
  recordAns(step.id, text, ok ? 1 : 0, xp);
  stepDone(st);
  if (xp) addXP(xp);
  await botSay(chId, line, {}, 250);
  advance(chId, 350);
}
function onTimeout() {
  const a = AW;
  if (!a || a.type !== 'ask' || a.step.kind !== 'short') return;
  const c = a.c, st = a.st, step = a.step;
  setAW(null);
  st.sub.combo = 0; recordAns(step.id, '(tempo esgotado)', 0, 0); stepDone(st); sfx('bad');
  botSay(c.id, `⏱️ **Tempo!** Era: **${step.ans}**`, {}, 200).then(() => advance(c.id, 350));
}

/* ---------- comandos ---------- */
const CMDS = [
  ['/dica', 'pista para a pergunta atual (−5 XP)'], ['/resposta', 'mostra a resposta-modelo'], ['/pular', 'pula a pergunta atual'],
  ['/perfil', 'seu perfil, conquistas e caderno'], ['/mapa', 'mapa das fases'], ['/fontes', 'fontes deste canal'],
  ['/cartao', 'seu cartão de compromisso'], ['/ajuda', 'lista de comandos']
];
function runCommand(raw) {
  const cmd = raw.trim().split(/\s+/)[0].toLowerCase();
  switch (cmd) {
    case '/dica': return cmdHint();
    case '/resposta': return cmdReveal();
    case '/pular': return cmdSkip();
    case '/perfil': return openProfile();
    case '/mapa': return openMap();
    case '/fontes': return openSources();
    case '/cartao': return openPledge();
    case '/ajuda': case '/help': return cmdHelp();
    default: toast('Comando não encontrado. Digite /ajuda.');
  }
}
function cmdHelp() {
  openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>Comandos</h2><ul class="list" style="margin-top:12px">${CMDS.map(([c, d]) => `<li><b>${c}</b>${esc(d)}</li>`).join('')}</ul>`, { label: 'Comandos' });
}
function cmdHint() {
  const a = AW;
  if (!a || a.type !== 'ask' || !a.step.hint || a.step.kind === 'short') { toast('Não há dica para esta pergunta agora.'); return; }
  a.st.sub.hint = true; save();
  post(a.c.id, { w: 'neemias', x: '', e: { cls: 'violet', title: '💡 Dica', desc: a.step.hint, foot: 'Usar a dica custa 5 XP desta pergunta.' } });
}
function cmdReveal() {
  const a = AW;
  if (!a || a.type !== 'ask') { toast('Não há pergunta para revelar agora.'); return; }
  if (a.step.kind === 'short') { toast('No quiz não tem “ver resposta” — mas você pode pular.'); return; }
  if (!a.step.model) { toast('Aqui não existe resposta-modelo: é a sua opinião que importa. Escreva ou use /pular.'); return; }
  setAW(null);
  finishConcept(a, '', null, 'reveal');
}
function cmdSkip() {
  const a = AW;
  if (!a || a.type !== 'ask') { toast('Nada para pular agora.'); return; }
  const c = a.c, st = a.st, step = a.step;
  if (step.base || step.final) { toast('Esse check-in não dá para pular — é rápido, prometo. 🙂'); return; }
  setAW(null);
  if (step.kind === 'short') {
    st.sub.combo = 0; recordAns(step.id, '(pulou)', 0, 0); stepDone(st);
    botSay(c.id, `⏭ Pulou. Era: **${step.ans}**`, {}, 200).then(() => advance(c.id, 350));
    return;
  }
  if (step.model) { finishConcept(a, '', null, 'skip'); return; }
  recordAns(step.id, '(pulou)', 0, 0); stepDone(st);
  botSay(c.id, 'Tudo bem, seguimos. Você pode voltar a este tema quando quiser. 🧭', {}, 300).then(() => advance(c.id, 300));
}
let slashOpen = false;
function showSlash(prefix) {
  const list = CMDS.filter(([c]) => c.startsWith(prefix)), box = $('#slash');
  if (!list.length) { hideSlash(); return; }
  box.innerHTML = list.map(([c, d]) => `<button data-act="runcmd" data-id="${c}"><b>${c}</b><span>${esc(d)}</span></button>`).join('');
  box.hidden = false; slashOpen = true;
}
function hideSlash() { $('#slash').hidden = true; slashOpen = false; }
function slashCheck() { const v = $('#inp').value; if (v[0] === '/' && !/\s/.test(v)) showSlash(v.toLowerCase()); else hideSlash(); }

/* ---------- conclusão de canal e fases ---------- */
function finishChannel(c) {
  const st = chs(c.id);
  if (st.done) { setAW(null, 'Canal concluído ✔'); return; }
  st.done = true; save();
  const reward = c.reward == null ? 30 : c.reward;
  addXP(reward);
  if (catComplete('f1')) giveBadge('f1');
  if (catComplete('f2')) giveBadge('f2');
  if (catComplete('f3')) giveBadge('f3');
  if (dilemmasDone() >= 4) giveBadge('d4');
  if (dilemmasDone() >= 7) giveBadge('d7');
  if (c.id === 'chefao-compromisso') giveBadge('embx');
  renderChannels(); renderMembers();
  const nxt = nextAfter(c), cat = CATS.find(x => x.id === c.cat);
  const phaseDone = c.cat !== 'start' && catComplete(c.cat);
  let desc = `Você ganhou **+${reward} XP**${phaseDone ? ' e a conquista da fase' : ''}.`;
  if (c.id === 'boas-vindas') desc += '\n🔓 Liberou **#como-jogar** e **#pergunte-ao-neemias** (pergunte o que quiser!).';
  if (c.id === '3-despedida') desc += '\n🔓 Liberou a **#missao-da-semana** — onde a fé vira prática.';
  if (c.id === '3-quiz') desc += '\n🔓 Os **7 dilemas** foram liberados. Escolha por onde começar!';
  if (c.cat === 'f4' && dilemmasDone() === 4) desc += '\n🔓 O **Chefão** foi liberado — mas ainda dá para fazer os outros dilemas.';
  if (nxt) desc += `\nPróximo: **#${nxt.name}**.`;
  post(c.id, { w: 'neemias', x: '', e: { cls: 'ok', title: phaseDone ? `🏁 ${cat.t}: concluída!` : '🎉 Canal concluído!', desc }, b: nxt ? [{ l: `Ir para #${nxt.name}`, a: 'open', id: nxt.id, cls: 'pri' }] : [] });
  if (phaseDone) confetti();
  setAW(null, 'Canal concluído ✔');
}

/* ---------- Q&A (#pergunte-ao-neemias) ---------- */
const KW = FAQ.map(f => ({ f, k: f.k.split(/\s+/).filter(Boolean).map(t => { const p = t.split(':'); return [p[0].replace(/_/g, ' '), +p[1] || 1]; }) }));
function findFAQ(q) {
  const n = ' ' + norm(q) + ' ';
  let best = null, bs = 0, second = null, ss = 0;
  for (const { f, k } of KW) {
    let s = 0;
    for (const [stem, w] of k) {
      if (stem.endsWith('$') ? n.includes(' ' + stem.slice(0, -1) + ' ') : n.includes(' ' + stem)) s += w;
    }
    if (s > bs) { second = best; ss = bs; best = f; bs = s; } else if (s > ss) { second = f; ss = s; }
  }
  return { best: bs >= 2 ? best : null, alt: ss >= 2 ? second : null };
}
let qaBusy = false;
async function onQA(text) {
  if (qaBusy || !AW) return;
  const chId = AW.chId; qaBusy = true;
  post(chId, { w: 'me', x: text });
  const n = norm(text);
  try {
    if (CRISIS.test(n)) { await careMsg(chId); return; }
    if (/^(oi|ola|e ai|eai|bom dia|boa tarde|boa noite|salve|opa)\b/.test(n) && wc(text) <= 4) { await botSay(chId, 'Oi! 👋 Pode perguntar o que quiser sobre o sábado. Se quiser ideias, toque numa destas:', { c: { t: 'qchips' } }, 400); return; }
    if (/\b(obrigad|valeu|vlw|brigado)/.test(n) && wc(text) <= 5) { await botSay(chId, 'Por nada! 🙌 Quando quiser, é só perguntar.', {}, 300); return; }
    S.stats.qa = (S.stats.qa || 0) + 1; save();
    const r = findFAQ(text);
    if (r.best) {
      const f = r.best;
      S.stats.seen = S.stats.seen || {}; S.stats.seen[f.id] = 1; save();
      const rel = Array.from(new Set((f.rel || []).concat(r.alt ? [r.alt.id] : []))).filter(id => id !== f.id).slice(0, 3);
      await botSay(chId, '', { e: { title: f.q, c: 'var(--accent)', desc: f.a, src: f.src, foot: 'Resposta montada só com as fontes do servidor. Na dúvida, confirme com seu pastor ou líder.' }, c: rel.length ? { t: 'related', ids: rel } : undefined }, 800);
      if (f.park) { S.parked.push({ q: text, ts: Date.now() }); save(); await botSay(chId, '📓 Anotei essa pergunta no seu **caderno** para você levar ao pastor ou líder.', {}, 300); }
    } else {
      S.parked.push({ q: text, ts: Date.now() }); save();
      await botSay(chId, 'Hmm, **não tenho fonte segura** sobre isso nas bases do servidor — e prefiro admitir do que inventar. 🙏\nAnotei sua pergunta no seu **caderno** (veja em /perfil) para você levar ao pastor ou líder JA.\n\nSe quiser, reformule com outras palavras (ex.: *“posso …?”*, *“por que …?”*) ou escolha uma destas:', { c: { t: 'qchips' } }, 700);
    }
    if (S.stats.qa <= 10) addXP(5);
    if (S.stats.qa >= 5) giveBadge('pergunta');
  } finally {
    qaBusy = false;
    if (active === chId) renderChips();
  }
}

/* ---------- missão da semana + diário ---------- */
function weekState() {
  const k = sabbathKey();
  if (S.week.key !== k) S.week = { key: k, items: {}, paid: {}, diary: '', diaryXp: false, kept: false };
  return S.week;
}
function renderBoard() {
  const el = $('#board');
  if (!el) return;
  const w = weekState(), done = WEEK_ITEMS.filter(i => w.items[i.id]).length, pct = Math.round(done / WEEK_ITEMS.length * 100);
  const date = new Date(w.key + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  let h = `<div class="embed"><div class="e-title">🎯 Missão da semana · sábado, ${esc(date)}</div><div class="e-desc"><b>${done}/${WEEK_ITEMS.length}</b> cumpridos · meta: <b>5</b> para ganhar o selo <b>Sábado Guardado</b>.</div><div class="bar" style="margin:8px 0 6px"><i style="width:${pct}%"></i></div>`;
  h += WEEK_ITEMS.map(i => `<button class="chk${w.items[i.id] ? ' on' : ''}" data-act="week" data-id="${i.id}" aria-pressed="${!!w.items[i.id]}"><span class="bx">${I.checkSm}</span><span class="lbl">${i.e} ${esc(i.t)}</span><span class="xp">+${i.xp}</span></button>`).join('');
  const pk = F4.filter(id => S.dec[id]);
  if (pk.length) {
    h += `<div class="e-title" style="margin-top:14px">🎒 Missões de bolso (das suas decisões)</div>`;
    h += pk.map(id => { const st = CHM[id].steps.find(s => s.t === 'pocket'); return `<button class="chk${S.pocket[id] ? ' on' : ''}" data-act="pocket" data-id="${id}"${S.pocket[id] ? ' disabled' : ''}><span class="bx">${I.checkSm}</span><span class="lbl">${md(st.text)}</span><span class="xp">+${st.xp}</span></button>`; }).join('');
  }
  h += `<div class="e-foot">Sábados guardados: <b>${S.weeksKept}</b> · Diário: escreva no chat abaixo depois do seu sábado (+40 XP, uma vez por semana).</div></div>`;
  el.innerHTML = h;
}
function toggleWeek(id) {
  const w = weekState(), it = WEEK_ITEMS.find(x => x.id === id);
  if (!it) return;
  w.items[id] = !w.items[id];
  if (w.items[id] && !w.paid[id]) { w.paid[id] = true; addXP(it.xp); }
  const n = WEEK_ITEMS.filter(i => w.items[i.id]).length;
  if (n >= 5 && !w.kept) {
    w.kept = true; S.weeksKept++; giveBadge('sabado');
    if (S.weeksKept >= 3) giveBadge('const3');
    toast('🌅 Sábado Guardado! Semana cumprida.'); confetti();
  }
  save(); renderBoard(); renderMembers();
}
async function onDiary(text) {
  const chId = AW.chId;
  post(chId, { w: 'me', x: text });
  if (CRISIS.test(norm(text))) { await careMsg(chId); return; }
  if (wc(text) < 8) { await botSay(chId, 'Conte um pouquinho mais (8 palavras ou mais): o que foi **mais gostoso**, o que foi **mais difícil** e o que você **vai repetir**? ✍️', {}, 400); return; }
  const w = weekState();
  w.diary = (w.diary ? w.diary + '\n---\n' : '') + text;
  if (!w.diaryXp) { w.diaryXp = true; addXP(40); }
  save();
  await botSay(chId, '📔 Anotado no seu diário! Quem registra, aprende duas vezes. Se algo foi difícil, leve para uma conversa com seu líder — e não desista: **recomeçar também é fé**.', {}, 700);
}
function doPocket(id) {
  if (S.pocket[id]) return;
  const st = CHM[id] && CHM[id].steps.find(s => s.t === 'pocket'), xp = st ? st.xp : 30;
  S.pocket[id] = Date.now(); save();
  addXP(xp); giveBadge('mao');
  $$(`[data-act="pocket"][data-id="${id}"]`).forEach(b => { b.disabled = true; if (b.classList.contains('btn')) { b.classList.remove('pri'); b.classList.add('ok'); b.textContent = '✔ Feito! +' + xp + ' XP'; } });
  renderBoard();
}

/* ---------- decisões de fé (formulário dos dilemas) ---------- */
const DRAFT = {};
const firstVal = d => { const k = d.ord && d.ord[0]; return (k && d.f[k]) || Object.values(d.f)[0] || ''; };
function openDecision(id) {
  const c = CHM[active], step = c && c.steps.find(s => s.t === 'dec' && s.id === id);
  if (!step) return;
  const done = S.dec[id];
  if (done) {
    openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>${esc(step.title)}</h2><p style="color:var(--dim)">Decisão registrada · <b>${done.conf}%</b> decidido(a).</p><ul class="list" style="margin-top:10px">${step.fields.map(f => `<li><b>${esc(f.label)}</b>${esc(done.f[f.id] || '')}</li>`).join('')}</ul>`, { label: step.title });
    return;
  }
  const h = `<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>${esc(step.title)}</h2><p style="color:var(--dim)">${md(step.intro)}</p>` +
    step.fields.map(f => `<div class="fld"><label for="df_${f.id}">${esc(f.label)}</label><textarea id="df_${f.id}" rows="${f.rows || 3}" placeholder="${esc(f.ph || '')}" maxlength="600">${esc(DRAFT['df_' + id + '_' + f.id] || '')}</textarea><div class="err" id="dfe_${f.id}" role="alert"></div></div>`).join('') +
    `<div class="fld"><label for="df_conf">Quão decidido(a) você está? <b id="dfv">70</b>%</label><input type="range" id="df_conf" min="0" max="100" value="70" step="5"><div class="rng"><span>talvez</span><span>decidi!</span></div></div>` +
    `<div class="mfoot"><button class="btn ghost" data-act="close">Agora não</button><button class="btn pri" data-act="decsave" data-id="${esc(id)}">Registrar decisão (+${step.xp} XP)</button></div>`;
  openModal(h, { label: step.title, sticky: true });
}
function submitDecision(id) {
  const a = AW;
  if (!a || a.type !== 'dec' || a.step.id !== id) return;
  const step = a.step, vals = {}; let ok = true;
  step.fields.forEach(f => {
    const v = ($('#df_' + f.id).value || '').trim(); vals[f.id] = v;
    const er = $('#dfe_' + f.id);
    if (wc(v) < f.min) { ok = false; er.textContent = `Escreva pelo menos ${f.min} palavra${f.min > 1 ? 's' : ''}.`; } else er.textContent = '';
  });
  const joined = Object.values(vals).join(' ');
  if (CRISIS.test(norm(joined))) { closeModal(); careMsg(a.c.id); return; }
  if (!ok) return;
  const conf = +$('#df_conf').value;
  S.dec[id] = { t: step.title, f: vals, ord: step.fields.map(f => f.id), conf, ts: Date.now() };
  step.fields.forEach(f => { if (f.park && vals[f.id]) S.parked.push({ q: vals[f.id], ts: Date.now() }); delete DRAFT['df_' + id + '_' + f.id]; });
  closeModal();
  const c = a.c, st = a.st;
  setAW(null);
  post(c.id, { w: 'me', x: `📝 Decisão registrada: “${trunc(vals[step.fields[0].id], 220)}” (${conf}% decidido)` });
  stepDone(st);
  const xp = step.xp + (conf >= 70 ? 10 : 0);
  addXP(xp);
  sfx('ok');
  botSay(c.id, '', { e: { cls: 'ok', title: '✅ Decisão de fé registrada', desc: `Você transformou o que **pensa** no que **vai fazer**. Isso é o que separa teoria de prática.${conf < 50 ? '\n\nSua confiança está baixa — e tudo bem. Converse com seu líder: decisões ficam mais fortes com companhia.' : ''}`, xp: `+${xp} XP` } }, 700).then(() => advance(c.id, 500));
}

/* ---------- perfil, mapa, fontes, configurações, convite ---------- */
function openProfile() {
  const role = ROLES[roleIdx(S.xp)];
  const nAns = Object.keys(S.ans).length, nDec = Object.keys(S.dec).length;
  const decs = F4.filter(id => S.dec[id]).map(id => `<li><b>${esc(S.dec[id].t.replace('Decisão de Fé · ', ''))} · ${S.dec[id].conf}% decidido(a)</b>${esc(trunc(firstVal(S.dec[id]), 200))}</li>`).join('');
  const park = S.parked.slice(-8).reverse().map(p => `<li>${esc(p.q)}</li>`).join('');
  const h = `<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><div class="pbanner"></div><div class="pid">${avHTML('me', 'lg')}<div><h2>${esc(S.user.name || 'Visitante')}</h2><span class="rolepill" style="--rc:${role.c}"><i></i>${role.e} ${esc(role.n)}</span></div></div>` +
    `<div style="margin-top:14px">${xpCardHTML()}</div>` +
    `<div class="tiles"><div class="tile"><b>${nAns}</b><span>respostas</span></div><div class="tile"><b>${nDec}</b><span>decisões de fé</span></div><div class="tile"><b>${S.weeksKept}</b><span>sábados guardados</span></div><div class="tile"><b>${S.streak.n || 0}</b><span>dias seguidos</span></div></div>` +
    `<h3>Conquistas</h3><div class="badges" style="grid-template-columns:repeat(6,1fr)">${Object.entries(BADGES).map(([id, b]) => `<div class="bdg${S.badges[id] ? '' : ' off'}" data-t="${esc(b.n + ' — ' + b.d)}" tabindex="0" role="img" aria-label="${esc(b.n)}">${b.e}</div>`).join('')}</div>` +
    `<h3>Minhas decisões de fé</h3>${decs ? `<ul class="list">${decs}</ul>` : '<p style="color:var(--dim)">Ainda não há decisões. Elas nascem nos <b>dilemas</b> da Fase 4.</p>'}` +
    `<h3>Caderno de perguntas para meu líder</h3>${park ? `<ul class="list">${park}</ul>` : '<p style="color:var(--dim)">Vazio. Perguntas que o Neemias não souber responder ficam anotadas aqui.</p>'}` +
    `<div class="mfoot"><button class="btn ghost" data-act="settings">Configurações</button><button class="btn pri" data-act="pledge">🪪 Cartão de compromisso</button></div>`;
  openModal(h, { wide: true, label: 'Meu perfil' });
}
function openMap() {
  const real = c => isDone(c.id) && c.kind !== 'qa' && c.kind !== 'board';
  const h = CATS.map(cat => {
    const list = CH.filter(c => c.cat === cat.id), done = list.filter(real).length, pct = Math.round(done / list.length * 100);
    return `<div class="mp${list.some(c => c.id === active) ? ' cur' : ''}"><div class="mp-h"><b>${esc(cat.t)}</b><span>${done}/${list.length}</span></div><div class="bar"><i style="width:${pct}%"></i></div><div class="mp-c">${list.map(c => `<button class="${real(c) ? 'done' : ''}${unlocked(c) ? '' : ' lock'}" data-act="open" data-id="${c.id}">${real(c) ? '✔ ' : unlocked(c) ? '# ' : '🔒 '}${esc(c.name)}</button>`).join('')}</div></div>`;
  }).join('');
  openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>Mapa das fases</h2><p style="color:var(--dim)">Siga a ordem das fases. Nos dilemas, você escolhe por onde começar.</p><div class="map">${h}</div>`, { wide: true, label: 'Mapa das fases' });
}
function openSources() {
  const c = CHM[active], ids = (c && c.pins) || [];
  openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>Fontes deste canal</h2>` +
    (ids.length ? `<ul class="list" style="margin-top:12px">${ids.map(id => `<li>${srcLabel(id)}</li>`).join('')}</ul>` : '<p style="color:var(--dim)">Este canal não tem fontes específicas.</p>') +
    `<p style="color:var(--dim);font-size:13.5px;margin-top:14px">Versos bíblicos aparecem <b>parafraseados</b> ou em citações curtas de versões comuns — confira sempre na sua Bíblia. As citações de E. G. White e as sugestões práticas vêm do folder do sábado; as do documento oficial vêm do texto da Divisão Sul-Americana (24/10/2023). Ambas foram conferidas contra os textos originais fornecidos. Quando o folder e o documento divergem, o jogo segue o documento, que é mais atualizado. A Lei 13.796/2019 e o documento têm link para o texto completo.</p>`, { label: 'Fontes' });
}
const sw = (id, t, d) => `<div class="sw"><span>${t}<small>${d}</small></span><button class="tog${S.set[id] ? ' on' : ''}" data-act="tog" data-id="${id}" role="switch" aria-checked="${!!S.set[id]}" aria-label="${t}"></button></div>`;
function openSettings() {
  const t = S.set.theme;
  openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>Configurações</h2>` +
    `<div class="fld"><label for="setName">Apelido</label><input type="text" id="setName" maxlength="20" value="${esc(S.user.name)}"><small>Aparece nas suas mensagens.</small></div>` +
    `<div class="fld"><label>Avatar</label><div class="avpick">${EMOJIS.map(e => `<button class="${S.user.av === e ? 'on' : ''}" data-act="avatar" data-id="${e}" aria-label="Avatar ${e}">${e}</button>`).join('')}</div></div>` +
    `<h3>Preferências</h3>` + sw('sound', 'Efeitos sonoros', 'Sons curtos ao ganhar XP e conquistas.') + sw('timer', 'Cronômetro nos quizzes', 'Desligue para responder sem pressa (sem bônus de tempo).') + sw('fast', 'Mensagens instantâneas', 'Pula a animação de “digitando…”.') +
    `<div class="sw"><span>Tema<small>“Auto” segue o seu aparelho.</small></span><span class="seg" role="group" aria-label="Tema">${[['auto', 'Auto'], ['dark', 'Escuro'], ['light', 'Claro']].map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-act="theme" data-id="${k}">${l}</button>`).join('')}</span></div>` +
    `<h3>Dados</h3><p style="color:var(--dim);font-size:13.5px;margin:0">Seu progresso fica salvo só neste aparelho e navegador. Nada é enviado a ninguém.</p>` +
    `<div class="mfoot" id="resetRow"><button class="btn ghost" data-act="reset1">Apagar meu progresso…</button><button class="btn pri" data-act="saveSettings">Salvar</button></div>`, { label: 'Configurações' });
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {
    try { const ta = document.createElement('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;opacity:0;left:-999px'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; } catch (e2) { return false; }
  }
}
function invite() {
  const url = /^https?:/.test(location.href) ? location.href : '';
  const txt = `Bora jogar o servidor “Guardiões do Sábado”? É um jogo com fases, XP e dilemas reais sobre o sábado. ${url}`.trim();
  copyText(txt).then(ok => toast(ok ? '📋 Convite copiado! Cole no seu grupo.' : 'Não consegui copiar. Compartilhe o link desta página com seus amigos.'));
}

/* ---------- cartão de compromisso ---------- */
function pledgeData() {
  const decs = F4.filter(id => S.dec[id]).slice(0, 3).map(id => ({ t: S.dec[id].t.replace('Decisão de Fé · ', ''), v: firstVal(S.dec[id]) }));
  return { name: S.user.name || 'Guardião', decide: S.pledge.decide, why: S.pledge.why, decs, date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) };
}
function openPledge() {
  if (!S.pledge.decide) { toast('🔒 Termine o #chefao-compromisso para liberar seu cartão.'); return; }
  const d = pledgeData();
  openModal(`<button class="m-x" data-act="close" aria-label="Fechar">${I.x}</button><h2>Meu Cartão de Compromisso</h2><p style="color:var(--dim)">Tire um print ou salve a imagem. Mostre ao seu líder, aos seus pais ou a um amigo: <b>compromisso dito em voz alta fica mais forte</b>.</p>` +
    `<div class="pledge" id="pledgeCard"><small>GUARDIÕES DO SÁBADO · COMPROMISSO DE FÉ</small><h2>Pela fé, eu decido que…</h2><p>${esc(d.decide)}</p>${d.why ? `<p style="font-weight:500">Meu porquê: ${esc(d.why)}</p>` : ''}${d.decs.length ? `<p style="font-size:14px;font-weight:600">${d.decs.map(x => '• ' + esc(x.t) + ': ' + esc(trunc(x.v, 90))).join('<br>')}</p>` : ''}<div class="who">— ${esc(d.name)}, ${esc(d.date)}</div></div>` +
    `<div class="mfoot"><button class="btn ghost" data-act="pledgecopy">Copiar texto</button><button class="btn pri" data-act="pledgepng">Salvar imagem</button></div>`, { label: 'Cartão de compromisso' });
}
function wrapText(ctx, text, x, y, maxW, lh) {
  const words = String(text).split(/\s+/); let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; } else line = t;
  }
  if (line) { ctx.fillText(line, x, y); y += lh; }
  return y;
}
function pledgeBlob() {
  const d = pledgeData(), W = 1080, H = 1350, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const x = cv.getContext('2d'), g = x.createLinearGradient(0, 0, W * .5, H);
  g.addColorStop(0, '#ffd77a'); g.addColorStop(.55, '#ff9f6b'); g.addColorStop(1, '#9a8cff');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.fillStyle = 'rgba(255,255,255,.28)'; x.beginPath(); x.arc(W / 2, H + 60, 420, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#1d1503'; x.textBaseline = 'top';
  const ui = '"Noto Sans", system-ui, sans-serif', dsp = '"Space Grotesk","Noto Sans", system-ui, sans-serif';
  let y = 90;
  x.font = `800 28px ${ui}`; x.fillText('GUARDIÕES DO SÁBADO · COMPROMISSO DE FÉ', 80, y); y += 90;
  x.font = `700 72px ${dsp}`; y = wrapText(x, 'Pela fé, eu decido que…', 80, y, W - 160, 84) + 16;
  x.font = `600 44px ${ui}`; y = wrapText(x, trunc(d.decide, 260), 80, y, W - 160, 60) + 24;
  if (d.why) { x.font = `500 36px ${ui}`; y = wrapText(x, 'Meu porquê: ' + trunc(d.why, 160), 80, y, W - 160, 50) + 24; }
  x.font = `600 31px ${ui}`;
  d.decs.forEach(k => { y = wrapText(x, '• ' + k.t + ': ' + trunc(k.v, 90), 80, y, W - 160, 44) + 6; });
  x.font = `800 38px ${ui}`; x.fillText('— ' + d.name + ', ' + d.date, 80, H - 150);
  return new Promise(res => cv.toBlob(res, 'image/jpeg', .92));
}
async function savePledgePNG() {
  let dl = null;
  try { dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { dl = null; }
  if (!dl) { toast('Salvar imagem não está disponível aqui. Tire um print do cartão 📸'); return; }
  try {
    const blob = await pledgeBlob();
    await dl.save({ filename: 'compromisso-de-fe.jpg', data: blob });
    toast('Cartão salvo ✅');
  } catch (e) { if (!e || e.code !== 'declined') toast('Não consegui salvar. Tire um print do cartão 📸'); }
}
async function copyPledge() {
  const d = pledgeData();
  const t = `🪪 COMPROMISSO DE FÉ — ${d.name}\n\nPela fé, eu decido que ${d.decide}\n${d.why ? '\nMeu porquê: ' + d.why + '\n' : ''}${d.decs.length ? '\n' + d.decs.map(k => '• ' + k.t + ': ' + trunc(k.v, 120)).join('\n') + '\n' : ''}\n${d.date} · Guardiões do Sábado`;
  toast((await copyText(t)) ? '📋 Texto copiado!' : 'Não consegui copiar. Tire um print do cartão 📸');
}

/* ---------- eventos ---------- */
let themeSet = false;
function applyTheme() {
  const r = document.documentElement, t = S.set.theme;
  if (t === 'auto') { if (themeSet) { r.removeAttribute('data-theme'); themeSet = false; } } else { r.setAttribute('data-theme', t); themeSet = true; }
}
function onClick(e) {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const act = t.dataset.act, id = t.dataset.id;
  switch (act) {
    case 'open': openChannel(id); break;
    case 'current': closeDrawers(); break;
    case 'nav': { const app = $('#app'), on = !app.classList.contains('show-nav'); closeDrawers(); if (on) { app.classList.add('show-nav'); $('#scrim').hidden = false; } break; }
    case 'mem': { const app = $('#app'), on = !app.classList.contains('show-mem'); closeDrawers(); if (on) { app.classList.add('show-mem'); $('#scrim').hidden = false; } break; }
    case 'cat': S.ui.closed[id] = !S.ui.closed[id]; save(); renderChannels(); break;
    case 'close': closeModal(); break;
    case 'profile': closeDrawers(); openProfile(); break;
    case 'map': closeDrawers(); openMap(); break;
    case 'sources': openSources(); break;
    case 'settings': closeDrawers(); openSettings(); break;
    case 'invite': closeDrawers(); invite(); break;
    case 'cmds': if (slashOpen) hideSlash(); else showSlash('/'); break;
    case 'runcmd': hideSlash(); $('#inp').value = ''; autosize(); runCommand(id); break;
    case 'faq': { const f = FAQ.find(x => x.id === id); if (f && AW && AW.type === 'qa') onQA(f.q); break; }
    case 'dec': openDecision(id); break;
    case 'decsave': submitDecision(id); break;
    case 'pocket': doPocket(id); break;
    case 'week': toggleWeek(id); break;
    case 'pledge': closeModal(true); openPledge(); break;
    case 'pledgecopy': copyPledge(); break;
    case 'pledgepng': savePledgePNG(); break;
    case 'avatar':
      S.user.av = id; save(); renderUser(); renderMembers();
      $$('.avpick button').forEach(b => b.classList.toggle('on', b.dataset.id === id));
      break;
    case 'tog':
      S.set[id] = !S.set[id]; save();
      if (t.classList.contains('tog')) { t.classList.toggle('on', S.set[id]); t.setAttribute('aria-checked', String(!!S.set[id])); }
      renderUser();
      if (id === 'sound' && S.set.sound) sfx('ok');
      break;
    case 'theme':
      S.set.theme = id; save(); applyTheme();
      $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.id === id));
      break;
    case 'saveSettings': {
      const v = ($('#setName').value || '').replace(/[*_`<>\[\]{}]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
      if (v.length >= 2) S.user.name = v;
      save(); renderUser(); renderMembers(); closeModal(); toast('Configurações salvas ✔');
      break;
    }
    case 'reset1': $('#resetRow').innerHTML = `<span style="flex:1;color:var(--bad);font-weight:600">Apagar XP, respostas e decisões? Não dá para desfazer.</span><button class="btn ghost" data-act="close">Cancelar</button><button class="btn" style="background:var(--bad);color:#fff" data-act="reset2">Sim, apagar tudo</button>`; break;
    case 'reset2':
      try { localStorage.removeItem(KEY); } catch (er) { /* ok */ }
      S = DEF(); active = null; applyTheme(); closeModal(); renderAll(); openChannel('boas-vindas', { force: true });
      break;
  }
}
function wire() {
  document.addEventListener('click', onClick);
  $('#send').addEventListener('click', onSend);
  const inp = $('#inp');
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); onSend(); }
    else if (e.key === 'Escape') hideSlash();
  });
  inp.addEventListener('input', () => { autosize(); slashCheck(); });
  $('#scrim').addEventListener('click', closeDrawers);
  $('#msgs').addEventListener('click', () => skipWait());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalOpen) closeModal(); });
  document.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'df_conf') { const v = $('#dfv'); if (v) v.textContent = t.value; }
    else if (t.id && t.id.indexOf('df_') === 0 && AW && AW.type === 'dec') DRAFT['df_' + AW.step.id + '_' + t.id.slice(3)] = t.value;
  });
  window.addEventListener('pagehide', saveNow);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });
}

/* ---------- início ---------- */
function pickStart() {
  if (!S.user.name) return 'boas-vindas';
  const last = S.ui.last && CHM[S.ui.last];
  if (last && unlocked(last)) return last.id;
  const first = CH.find(c => c.cat !== 'free' && unlocked(c) && !isDone(c.id));
  return first ? first.id : 'pergunte';
}
function boot(hot) {
  const loaded = (hot && hot.S) ? hot.S : loadState();
  S = mergeState(loaded);
  try { if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ S })); } catch (e) { /* ok */ }
  applyTheme(); wire(); renderAll();
  openChannel(pickStart(), { force: true });
}
(function init() {
  const h = window.claude && window.claude.hot;
  if (h && h.ready) h.ready(boot); else boot((h && h.data) || {});
})();
