(function(){
'use strict';
/* ============================================================
   CONTEÚDO · parte A — metadados, fontes e Fases 0 a 3
   Todo texto do jogo vive em content-*.js e faq.js (edite aqui, sem mexer no engine).
   Citações do folder estão entre aspas e foram copiadas literalmente.
   Textos bíblicos são PARAFRASEADOS (a referência está sempre ao lado).
   ============================================================ */

const ROLES = [
  { n: 'Visitante',            xp: 0,    c: 'var(--r0)', e: '🚪' },
  { n: 'Aprendiz do Sábado',   xp: 250,  c: 'var(--r1)', e: '🌱' },
  { n: 'Guardião',             xp: 800,  c: 'var(--r2)', e: '🛡️' },
  { n: 'Sentinela do Tempo',   xp: 1700, c: 'var(--r3)', e: '⭐' },
  { n: 'Embaixador do Sábado', xp: 3000, c: 'var(--r4)', e: '👑' }
];

const BADGES = {
  f1:       { e: '🌍', n: 'Memorial do Criador', d: 'Concluiu a Fase 1 (Origem).' },
  f2:       { e: '💛', n: 'Deleite',             d: 'Concluiu a Fase 2 (Jesus e o sábado).' },
  f3:       { e: '🧭', n: 'Bússola do Sábado',   d: 'Concluiu a Fase 3 (Como guardar).' },
  d4:       { e: '🛡️', n: 'Corajoso',            d: 'Decidiu 4 dilemas.' },
  d7:       { e: '⚔️', n: 'Fiel nos Dilemas',    d: 'Decidiu os 7 dilemas.' },
  relampago:{ e: '⚡', n: 'Relâmpago',           d: 'Gabaritou um quiz-relâmpago.' },
  pergunta: { e: '🙋', n: 'Perguntador',         d: 'Fez 5 perguntas ao Neemias.' },
  fogo:     { e: '🔥', n: 'Ofensiva de 3 dias',  d: 'Jogou 3 dias seguidos.' },
  mao:      { e: '🎯', n: 'Mão na Massa',        d: 'Cumpriu uma missão de bolso.' },
  sabado:   { e: '🌅', n: 'Sábado Guardado',     d: 'Cumpriu 5 de 7 itens da missão da semana.' },
  embx:     { e: '👑', n: 'Embaixador',          d: 'Concluiu o Chefão e fez o compromisso de fé.' },
  const3:   { e: '🏔️', n: 'Constância',          d: 'Guardou 3 semanas na Missão da semana.' }
};

const EMOJIS = ['🙂', '😎', '🦁', '🦅', '🌿', '🔥', '⭐', '🎧', '🎮', '📖', '🛡️', '🕊️', '🌅', '🏔️', '🦋', '🐺'];

/* Personagens (todos fictícios). h = matiz da cor do avatar */
const NPC = {
  neemias: { n: 'Neemias', bot: 1, e: '🛡️' },
  narr:    { n: 'Narrador', sys: 1 },
  kaio:    { n: 'Kaio', e: '🎮', h: 205 },
  rafa:    { n: 'Rafa', e: '⚽', h: 150 },
  bia:     { n: 'Bia', e: '📚', h: 322 },
  duda:    { n: 'Duda', e: '🎂', h: 345 },
  nath:    { n: 'Nath', e: '🌿', h: 140 },
  gui:     { n: 'Gui', e: '📱', h: 262 },
  marcos:  { n: 'Seu Marcos', e: '🧢', h: 28 },
  leo:     { n: 'Léo', e: '🤔', h: 215 },
  sandra:  { n: 'Coord. Sandra', e: '🗂️', h: 180 }
};

/* Fontes. A chave é usada em src:[...] nas perguntas. */
const DOC_URL = 'https://institucional.adventistas.org/pt/documentos/observancia-do-sabado/';
const SRC = {
  // Bíblia (referência; o jogo parafraseia)
  gn2:  { t: 'Gênesis 2:1-3' },        ex20: { t: 'Êxodo 20:8-11' },       ex31: { t: 'Êxodo 31:13-17' },
  ez20: { t: 'Ezequiel 20:12, 20' },   is58: { t: 'Isaías 58:13-14' },     is56: { t: 'Isaías 56:6-7' },
  is66: { t: 'Isaías 66:22-23' },      mc2:  { t: 'Marcos 2:27-28' },      mt12: { t: 'Mateus 12:9-12' },
  lc4:  { t: 'Lucas 4:16' },           lc23: { t: 'Lucas 23:54-56' },      at17: { t: 'Atos 17:2' },
  mt24: { t: 'Mateus 24:20' },         hb4:  { t: 'Hebreus 4:4-11' },      lv23: { t: 'Levítico 23:32' },
  ne13: { t: 'Neemias 13:15-22' },     ex16: { t: 'Êxodo 16:23' },         jo14: { t: 'João 14:15' },
  ef2:  { t: 'Efésios 2:8-9' },        jo1:  { t: '1 João 1:9' },          pe3:  { t: '1 Pedro 3:15' },
  mt6:  { t: 'Mateus 6:33' },          ex20b:{ t: 'Êxodo 20:12' },
  // Folder (E. G. White e outros)
  tpi6_352: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 352' },
  tpm_137:  { t: 'E. G. White, Testemunhos Para Ministros, p. 137' },
  edu_250:  { t: 'E. G. White, Educação, p. 250-251' },
  edu_251:  { t: 'E. G. White, Educação, p. 251' },
  edu_248:  { t: 'E. G. White, Educação, p. 248' },
  tpi2_704: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 2, p. 704' },
  me2_475:  { t: 'E. G. White, Mensagens Escolhidas, vol. 2, p. 475' },
  css_41:   { t: 'E. G. White, Conselhos Sobre a Escola Sabatina, p. 41' },
  vj_74:    { t: 'E. G. White, Vida de Jesus, p. 74' },
  css_170:  { t: 'E. G. White, Conselhos Sobre a Escola Sabatina, p. 170 (citado no documento oficial)' },
  tpi6_357: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 357' },
  tpi6_357b:{ t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 357-358' },
  dtn_207:  { t: 'E. G. White, O Desejado de Todas as Nações, p. 207' },
  bs_77:    { t: 'E. G. White, Beneficência Social, p. 77' },
  decl_198: { t: 'Declarações da Igreja, p. 198' },
  csa_165:  { t: 'E. G. White, Conselhos Sobre Saúde, p. 165' },
  tpi2_585: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 2, p. 585' },
  tpi6_358: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 358' },
  tpi6_354: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 354' },
  tpi6_359: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 359-360' },
  tpi6_356: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 356-359 (conforme o documento oficial)' },
  dtn_283:  { t: 'E. G. White, O Desejado de Todas as Nações, p. 283' },
  tpi5_609: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 5, p. 609' },
  oc_521:   { t: 'E. G. White, Orientação da Criança, p. 521' },
  st_1884:  { t: 'E. G. White, Signs of the Times, 7 de agosto de 1884' },
  folder:   { t: 'Folder “O Significado e a Prática do Sábado” (sugestões práticas)' },
  // Igreja e lei
  doc: { t: 'Documento oficial “Observância do Sábado” (Divisão Sul-Americana, 24/10/2023)', u: DOC_URL },
  cf20:{ t: 'Crença Fundamental 20 — O Sábado', u: 'https://institucional.adventistas.org/pt/nossas-crencas/20-o-sabado/' },
  lei: { t: 'Lei 13.796/2019 (art. 7º-A da LDB)', u: 'https://www2.camara.leg.br/legin/fed/lei/2019/lei-13796-3-janeiro-2019-787598-norma-pl.html' }
};
/* Seções do documento oficial: cada uma vira uma fonte citável (doc_prep, doc_esporte…) */
const DOC_SEC = { intro: 'Introdução', santif: 'Vida de santificação', cresc: 'Crescimento espiritual', prep: 'Preparação para o sábado', inicio: 'Início e término do sábado', infl: 'Pessoas sob nossa influência', comun: 'Espírito de comunhão', igreja: 'Reuniões da igreja', festas: 'Casamentos e festas', midia: 'Mídia secular', esporte: 'Esportes e lazer', sono: 'Horas de sono', viagem: 'Viagens', excurs: 'Excursões e acampamentos', rest: 'Restaurantes e alimentação', med: 'Medicamentos', estag: 'Estágios e práticas escolares', prof: 'Escolha e exercício da profissão', serv: 'Instituições de serviços básicos', saude: 'Atividades médicas e de saúde', assist: 'Projetos assistenciais', missao: 'Atividades missionárias' };
Object.keys(DOC_SEC).forEach(k => { SRC['doc_' + k] = { t: 'Documento oficial “Observância do Sábado” (DSA, 2023) · ' + DOC_SEC[k], u: DOC_URL }; });

/* ---------- construtores de passos ---------- */
const say   = (who, text, o = {}) => ({ t: 'say', who, text, ...o });
const sys   = (text) => ({ t: 'say', who: 'narr', text });
const emb   = (e, text = '', who = 'neemias') => ({ t: 'say', who, text, embed: e });
const quote = (q, cite, src, text = '') => ({ t: 'say', who: 'neemias', text, embed: { quote: q, cite, src } });
const ask   = (o) => ({ t: 'ask', ...o });
const C  = (k, re, w = 1) => ({ k, re, w });                       // conceito: regex sobre o texto normalizado
const CI = (k, res, need, w = 1) => ({ k, items: res, need, w });  // conceito por contagem de categorias
const qz = (id, text, accept, ans, o = {}) => ask({ id, kind: 'short', text, accept, ans, xp: 15, time: 35, ph: 'Resposta curta…', ...o });

const QUIZ_INTRO = (n) => say('neemias', `⚡ **Quiz-relâmpago!** ${n} perguntas de **resposta curta**, sem alternativas.\nVocê tem **35 segundos** em cada uma. Acertos em sequência geram **combo** (mais XP). Dá para desligar o cronômetro em ⚙️.`);

/* ============================================================
   CANAIS
   ============================================================ */
const CH_A = [

/* ---------- COMECE AQUI ---------- */
{ id: 'boas-vindas', cat: 'start', name: 'boas-vindas', title: 'Boas-vindas',
  topic: 'Comece por aqui · apelido, avatar e check-in inicial', pins: ['ne13', 'doc', 'cf20'], reward: 30,
  steps: [
    say('neemias', `E aí! 👋 Chegou gente nova no servidor. Eu sou o **Neemias** — o bot que vai te acompanhar nessa jornada.`),
    say('neemias', `Uma história rápida: em **Neemias 13**, o líder viu gente trabalhando e vendendo no sábado. Em vez de só reclamar, ele **agiu**: no fim da tarde de sexta, antes de o sábado começar, mandou **fechar os portões** da cidade.\n\n*Conhecimento virou decisão. Decisão virou prática.* É isso que a gente treina aqui.`, { embed: { desc: 'Quer ler o texto original? Abra a sua Bíblia:', src: ['ne13'] } }),
    emb({ title: 'Como o jogo funciona', c: 'var(--violet)', fields: [
      { n: '🎯 Objetivo', v: 'Entender o sábado (cabeça), decidir sobre ele (coração) e praticar pela fé (mãos).' },
      { n: '⌨️ Sem alternativas', v: 'Aqui ninguém marca A, B ou C. Você responde **escrevendo**, do seu jeito.' },
      { n: '⭐ XP e cargos', v: 'Cada resposta rende XP. Suba de **Visitante** até **Embaixador do Sábado**.' },
      { n: '🧪 Dilemas', v: 'Situações reais de 2026: jogo, prova, rolê, celular, emprego. Você decide — e planeja.' },
      { n: '📚 Fontes', v: 'Tudo vem da Bíblia, da Igreja e do folder do sábado. Toque em **Fontes** (no topo) para ver.' },
      { n: '🔒 Privacidade', v: '{priv}' }
    ] }),
    say('neemias', `Primeiro: **como quer ser chamado(a)** por aqui? Digite um apelido (até 20 letras).`),
    { t: 'name' },
    { t: 'avatar' },
    say('neemias', `Agora um **check-in** — sem certo nem errado. Vou guardar sua resposta e, no final da jornada, a gente compara. 👀`),
    ask({ id: 'base', kind: 'reflect', xp: 20, minWords: 4, base: true,
      text: `Em uma ou duas frases: **o que o sábado significa pra você hoje?** Seja sincero(a).`,
      ph: 'Escreva do seu jeito…',
      react: `Anotado. Sinceridade vale mais que resposta bonita. 🙏 Guardei isso para compararmos no final.` })
  ] },

{ id: 'como-jogar', cat: 'start', name: 'como-jogar', title: 'Como jogar', kind: 'static', topic: 'Cargos, comandos e como suas respostas são avaliadas', pins: [],
  steps: [
    emb({ title: 'Cargos (XP)', fields: ROLES.map(r => ({ n: `${r.e} ${r.n}`, v: r.xp === 0 ? 'Todo mundo começa aqui.' : `a partir de **${r.xp} XP**` })) }),
    emb({ title: 'Comandos', c: 'var(--violet)', desc: 'Digite no chat (ou toque no **+**):', fields: [
      { n: '/dica', v: 'Uma pista para a pergunta atual (custa 5 XP).' },
      { n: '/resposta', v: 'Mostra a resposta-modelo (você ganha só 25% do XP).' },
      { n: '/pular', v: 'Pula a pergunta, sem XP.' },
      { n: '/perfil · /mapa · /fontes', v: 'Seu perfil, o mapa das fases e as fontes do canal.' },
      { n: '/cartao', v: 'Abre o seu Cartão de Compromisso (depois do Chefão).' }
    ] }),
    emb({ title: 'Como as respostas são avaliadas', c: 'var(--warn)', desc: 'O servidor procura as **ideias principais** na sua resposta — não palavras exatas. Se você disse com outras palavras e eu não reconheci, compare com a **resposta-modelo**: o objetivo é aprender, não enganar o bot.\n\nNos **dilemas** não existe resposta certa para o que você faria. O que conta é você pensar, **decidir** e **planejar** — e depois praticar.' }),
    emb({ title: 'Importante', c: 'var(--bad)', desc: 'Eu sou um bot: **não substituo** sua Bíblia, seu pastor, seus pais ou sua conversa pessoal com Deus. Se uma pergunta for séria demais para um jogo, leve-a a um adulto de confiança.' })
  ] },

/* ---------- FASE 1 · ORIGEM ---------- */
{ id: '1-criacao', cat: 'f1', name: '1-criacao', title: 'Memorial do Criador',
  topic: 'Gênesis 2:1-3 · Êxodo 20:8-11 · por que o sábado existe', pins: ['gn2', 'ex20', 'tpm_137', 'edu_250', 'tpi6_352'], reward: 40,
  steps: [
    say('neemias', `**Fase 1 · Origem** 🌍\nAntes de qualquer regra, uma pergunta: *por que o sábado existe?* Vamos começar pelo começo.`),
    quote(`O sábado é o memorial de Deus, apontando ao homem o Criador, que fez o mundo e todas as coisas que nele há. Nas eternas montanhas, nas árvores majestosas, em cada botão que desabrochando, floresce, podemos observar a obra do grande Artista Mestre. Tudo nos fala de Deus e de Sua glória.`, `E. G. White, Testemunhos Para Ministros, pág. 137`, ['tpm_137']),
    ask({ id: 'q1_1', kind: 'concept', xp: 30, minWords: 4,
      text: `Quem criou o sábado, e **quando** ele foi criado? Responda com suas palavras (Gênesis 2:1-3).`,
      concepts: [
        C('Deus, o Criador', /\b(deus|criador|senhor|jeova)\b/),
        C('na Criação (fim da semana da Criação)', /(criac|criou|criar|comeco|principio|genesis|eden|semana)/),
        C('no sétimo dia', /(setimo|\b7\b|\bsete\b|ultimo dia|seis dias|\b6 dias)/)
      ], full: .66,
      hint: `Pense no que Deus fez nos seis primeiros dias — e no que fez no sétimo.`,
      model: `Foi **Deus**, no fim da semana da Criação: Ele descansou no **sétimo dia**, abençoou e santificou esse dia (Gn 2:1-3) — muito antes de existir Israel ou qualquer religião.`,
      src: ['gn2', 'ex20'] }),
    ask({ id: 'q1_2', kind: 'concept', xp: 30, minWords: 4,
      text: `O 4º mandamento começa com a palavra **“Lembra-te”**. O sábado nos ajuda a lembrar de quê? (Êxodo 20:8-11)`,
      concepts: [
        C('o Criador / a Criação', /(criador|criou|criac|fez (o )?(mundo|ceu|terra|tudo)|ceus e a terra)/, 2),
        C('memorial (lembrar)', /(memorial|lembr|recorda)/),
        C('Deus como fonte da vida', /(fonte|origem|autor|dono|vida|depend|quem nos fez|nos fez)/)
      ], full: .5,
      hint: `O folder chama o sábado de “memorial”: ele aponta para Quem fez o mundo.`,
      model: `Lembramos que **Deus é o Criador** — que fez céu, terra, mar e tudo o que neles há (Êx 20:11). O sábado é o **memorial da Criação**: toda semana ele nos tira da correria e nos lembra de quem somos e de Quem nos fez.`,
      src: ['ex20', 'tpm_137'] }),
    quote(`O sábado é um sinal do poder criador e redentor; ele indica a Deus como a fonte da vida e do saber; lembra a primitiva glória do homem, e assim testifica do propósito de Deus em criar-nos de novo à Sua própria imagem. [...] Sobre o sábado Ele põe Sua misericordiosa mão. No Seu dia Ele reserva à família a oportunidade da comunhão com Ele, com a natureza, e uns para com outros.`, `E. G. White, Educação, págs. 250-251`, ['edu_250']),
    ask({ id: 'q1_3', kind: 'concept', xp: 40, minWords: 3,
      text: `Segundo esse trecho, o sábado reserva tempo para **três tipos de comunhão**. Quais são? (Sem olhar!)`,
      concepts: [
        C('com Deus', /\b(deus|senhor|criador)\b/),
        C('com a natureza', /(natureza|criac|montanha|arvore|flore|ar livre)/),
        C('com a família e com as pessoas', /(famili|uns com os outros|outros|pessoas|amigos|gente|pais|irmaos|proximo)/)
      ], full: .99,
      hint: `Uma é vertical (com Quem fez tudo), outra é com o que Ele fez, e outra é com quem convive com você.`,
      model: `Com **Deus**, com a **natureza** e com a **família / uns com os outros** (Educação, p. 250-251).`,
      src: ['edu_250'] }),
    quote(`O sábado é um elo de ouro que nos une a Deus.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, pág. 352`, ['tpi6_352'], `Ponto de virada: o sábado **não nasceu como proibição**. Nasceu como um **presente do Criador** — quando Ele parou, no 7º dia, para estar com a Sua criação. 🎁`),
    ask({ id: 'q1_4', kind: 'reflect', xp: 25, minWords: 8,
      text: `Pensa na sua semana: **onde você sente falta de parar?** Escreva uma situação em que um dia assim faria diferença pra você.`,
      ph: 'Conte uma situação real…',
      react: `Guarda essa resposta: ela vira combustível lá nos dilemas. 🔥 Parar não é perder tempo — é lembrar **Quem** sustenta o seu tempo.` })
  ] },

{ id: '1-sinal', cat: 'f1', name: '1-sinal', title: 'Sinal e Aliança',
  topic: 'Êxodo 31:13-17 · Ezequiel 20:12 · sinal de quê, entre quem?', pins: ['ex31', 'ez20', 'cf20', 'doc', 'dtn_283', 'jo14', 'ef2'], reward: 40,
  steps: [
    say('neemias', `O sábado também é um **sinal**. Mas sinal de quê? Entre quem e quem? 🔗`),
    emb({ title: 'O que a Bíblia e a Igreja dizem', c: 'var(--violet)', fields: [
      { n: '📖 Bíblia', v: 'Deus chama o sábado de **sinal** entre Ele e o Seu povo, para saberem que é o Senhor quem os **santifica** (Êx 31:13-17; Ez 20:12, 20).', w: 1 },
      { n: '⛪ Crença Fundamental 20', v: 'O sábado é um **símbolo da nossa redenção em Cristo**, um **sinal de santificação**, uma demonstração de **lealdade** e um antegozo do futuro eterno.', w: 1 },
      { n: '📄 Documento oficial (DSA, 2023)', v: `A Igreja “reconhece o sábado como **sinal distintivo de lealdade a Deus**”, cuja observância “é pertinente a todos os seres humanos em todas as épocas e lugares”. E conclui que o sábado deve ser, para cada um, “um **sinal exterior da graça de Deus** e um canal de Suas incontáveis bênçãos”.`, w: 1 },
      { n: '✝️ Fé em Cristo', v: `Os filhos de Deus observam o sábado “como uma importante expressão da **justificação pela fé em Cristo**” (Hb 4:4-11). E a verdadeira observância “se fundamenta em uma **vida santificada pela graça de Cristo**”.`, w: 1 }
    ], src: ['ex31', 'ez20', 'cf20', 'doc_intro', 'doc_santif'] }),
    ask({ id: 'q2_1', kind: 'concept', xp: 40, minWords: 6,
      text: `Explique com suas palavras: o que quer dizer que o sábado é um **sinal**? Sinal **de quê**, e **entre quem**?`,
      concepts: [
        C('entre Deus e o Seu povo (aliança)', /(deus.{0,40}(povo|nos|filhos|pessoas)|alianca|pacto|entre (deus|ele)|relacion)/),
        C('lealdade, santificação ou redenção', /(lealdade|fidelidade|santific|redenc|graca|identidade|pertenc|marca|distingu|santo)/),
        C('lembra o Criador', /(criador|criac|criou)/)
      ], full: .66,
      hint: `Pense numa aliança de casamento: um anel é “sinal” de quê? E entre quem?`,
      model: `O sábado é um **sinal entre Deus e o Seu povo**: lembra que Ele é o Criador e quem nos **santifica** (Êx 31:13; Ez 20:12). Também é sinal de **lealdade** e de **redenção em Cristo** — mostra a quem pertencemos.`,
      src: ['ex31', 'ez20', 'cf20'] }),
    quote(`Mas a fim de santificar o sábado, os homens precisam ser eles próprios santos. Devem, pela fé, tornar-se participantes da justiça de Cristo. Quando foi dado a Israel o mandamento: “Lembra-te do dia do sábado, para o santificar” (Êxo. 20:8), o Senhor lhes disse também: “E ser-Me-eis homens santos.” Êxo. 22:31.`, `E. G. White, O Desejado de Todas as Nações, pág. 283`, ['dtn_283']),
    ask({ id: 'q2_2', kind: 'concept', xp: 40, minWords: 8,
      text: `Segundo esse trecho, por que a **fé** — e não só a força de vontade — é a chave para guardar o sábado?`,
      concepts: [
        C('não é por esforço ou mérito próprio', /(esforco|merito|propri|sozinho|forca|capacidade|mim mesmo|ganhar pontos|obrigac)/),
        C('Cristo, graça, justiça de Cristo', /(cristo|jesus|graca|justica|salvac)/),
        C('confiança, amor, relacionamento', /(\bfe\b|confi|relacion|amor|coracao)/)
      ], full: .66,
      hint: `A frase fala em “participantes da justiça de Cristo”. De quem é a justiça que nos sustenta?`,
      model: `Porque o sábado não se guarda com **força de vontade** nem para “ganhar pontos” com Deus. Guardamos **confiando em Cristo**, participando da Sua justiça — a obediência é **resposta de amor** (Jo 14:15), não uma tentativa de se salvar por esforço (Ef 2:8-9).`,
      src: ['dtn_283', 'jo14', 'ef2'] })
  ] },

{ id: '1-quiz', cat: 'f1', name: '1-quiz', title: 'Quiz-relâmpago · Origem', pill: 'QUIZ',
  topic: 'Respostas curtas · 35s por pergunta · combo de acertos', pins: ['ex20', 'tpi6_352', 'edu_250'], reward: 40, quiz: true,
  steps: [
    QUIZ_INTRO(6),
    qz('z1_1', `Em qual livro da Bíblia está o 4º mandamento (“Lembra-te do dia do sábado”)?`, [/(exodo|\bex\b|deuteronomio|deut)/], `Êxodo (cap. 20) — também em Deuteronômio 5`),
    qz('z1_2', `Quantos dias Deus trabalhou na Criação antes de descansar?`, [/\b(6|seis)\b/], `Seis`),
    qz('z1_3', `Em que dia da semana Deus descansou? (nome ou número)`, [/(sabado|setimo|\b7\b|\bsete\b)/], `No sétimo dia (sábado)`),
    qz('z1_4', `Complete: o sábado é um elo de ____ que nos une a Deus.`, [/ouro/], `Ouro`),
    qz('z1_5', `O sábado é o memorial de quê? (uma palavra)`, [/(criac|criador)/], `Da Criação / do Criador`),
    qz('z1_6', `O sábado reserva comunhão com Deus, com a natureza e com… quem?`, [/(famili|outros|pessoas|gente|irmaos|amigos|proximo)/], `Com a família / uns com os outros`),
    { t: 'quizend' }
  ] },

/* ---------- FASE 2 · JESUS E O SÁBADO ---------- */
{ id: '2-jesus', cat: 'f2', name: '2-jesus', title: 'Jesus e o Sábado',
  topic: 'Lucas 4:16 · Marcos 2:27 · Mateus 12:12 · descanso, culto e boas obras', pins: ['lc4', 'mc2', 'mt12', 'edu_251', 'dtn_207', 'bs_77'], reward: 40,
  steps: [
    say('neemias', `**Fase 2 · Jesus e o sábado** 💛\nDá para entender a intenção de um mandamento olhando como o Autor dele viveu. Vamos ver o que Jesus fazia.`),
    quote(`Feliz “é a família que pode ir ao lugar de culto, aos sábados, como iam Jesus e Seus discípulos à sinagoga”.`, `E. G. White, Educação, pág. 251`, ['edu_251', 'lc4'], `Em Lucas 4:16, Jesus vai a Nazaré e, **segundo o Seu costume**, entra na sinagoga no sábado.`),
    ask({ id: 'q3_1', kind: 'concept', xp: 20, minWords: 1,
      text: `Segundo Lucas 4:16, o que Jesus tinha como **costume** no sábado?`,
      concepts: [C('ir à sinagoga (culto)', /(sinagoga|igreja|culto|adora|templo|reun|louvor)/)], full: .99,
      hint: `Onde as pessoas se reuniam para estudar a Palavra e adorar?`,
      model: `Ir à **sinagoga** — participar do culto e do estudo da Palavra, toda semana, por hábito (Lc 4:16).`,
      src: ['lc4', 'edu_251'] }),
    quote(`A obra no Céu não cessa nunca, e o homem não deve descansar de fazer o bem. O sábado não se destina a ser um período de inútil inatividade. A lei proíbe trabalho secular no dia de repouso do Senhor; [...] Mas como Deus cessou Seu labor de criar e repousou ao sábado, e o abençoou, assim deve o homem deixar as ocupações da vida diária, e devotar essas sagradas horas a um saudável repouso, ao culto e a boas obras.`, `E. G. White, O Desejado de Todas as Nações, pág. 207`, ['dtn_207']),
    ask({ id: 'q3_2', kind: 'concept', xp: 45, minWords: 8,
      text: `Então o sábado é um dia de **ficar sem fazer nada**? Explique o que se **deixa de fazer** e o que se **faz** no sábado.`,
      concepts: [
        C('não é inatividade', /(inutil|inativ|nao (e|eh|significa|quer dizer)|nao precisa ficar|nada nao)/),
        C('deixa o trabalho e as ocupações do dia a dia', /(trabalh|ocupac|estud|secular|rotina|vida diaria|dia a dia|compromiss)/),
        C('descanso saudável', /(descans|repous|relax)/),
        C('culto e adoração', /(cult|ador|igreja|louvor|oracao|biblia|escola sabatina)/),
        C('boas obras e misericórdia', /(boas obras|misericord|ajud|servi|fazer o bem|caridade|visita|solidari)/)
      ], full: .6,
      hint: `O trecho fala em três coisas para dedicar as horas do sábado: repouso, culto e …`,
      model: `Não. Deixamos o **trabalho e as ocupações do dia a dia** e dedicamos as horas a um **descanso saudável, ao culto e a boas obras** (DTN, p. 207). Descanso, adoração e serviço: os três juntos.`,
      src: ['dtn_207'] }),
    quote(`De acordo com o quarto mandamento, o sábado foi dedicado ao repouso e ao culto religioso. Toda atividade secular devia ser suspensa, mas as obras de misericórdia e beneficência estavam em harmonia com o propósito do Senhor. Elas não deviam ser limitadas a tempo ou lugar. Aliviar os aflitos, confortar os tristes, é um trabalho de amor que faz honra ao dia de Deus.`, `E. G. White, Beneficência Social, pág. 77`, ['bs_77', 'mt12'], `Jesus curou várias pessoas no sábado e disse que **é lícito fazer o bem** (Mt 12:12).`),
    ask({ id: 'q3_3', kind: 'reflect', xp: 35, minWords: 8,
      bonus: /(visita|hospital|idos|asilo|orfanato|presid|enfermo|viuva|orfao|encarcer|ajud|mensagem|ligar|conversar|ouvir|consol|compart|refeic|comida|alimento|cesta|vizinh|amigo|estudo|biblia|oracao|orar)/,
      text: `Dê um exemplo **de 2026** de uma “obra de misericórdia” que você poderia fazer num sábado — de verdade, no seu mundo.`,
      ph: 'Ex.: visitar… / mandar mensagem…',
      react: `Boa! Misericórdia não precisa ser gigante: uma visita, uma mensagem, uma carona, um ouvido. O documento oficial diz que é lícito, nas horas sagradas do sábado, “visitar enfermos, viúvas e órfãos, encarcerados e compartilhar uma refeição”. E dá o critério: “ações sociais que podem ser realizadas em outro dia não devem tomar as sagradas horas do sábado”. Na prática: campanhas e mutirões que podem ser agendados ficam para outro dia.`, src: ['bs_77', 'doc_assist'] }),
    ask({ id: 'q3_4', kind: 'reflect', xp: 25, minWords: 10,
      bonus: /(presente|beneficio|bem|descans|dadiva|cuidado|amor|liberd|paz)/,
      text: `Marcos 2:27 diz que **“o sábado foi feito por causa do homem”**. Isso muda como você vê o sábado: é mais uma **regra pesada** ou um **presente**? Por quê?`,
      ph: 'Conte o que você pensa…',
      react: `E Marcos 2:28 completa: o Filho do Homem é **Senhor do sábado** — o dia continua sendo Dele. Presente, sim; mas **de Alguém**. 🎁`, src: ['mc2'] })
  ] },

{ id: '2-deleite', cat: 'f2', name: '2-deleite', title: 'O Sábado Que Dá Vontade de Voltar',
  topic: 'Isaías 58:13-14 · deleite, alegria e família', pins: ['is58', 'tpi2_585', 'tpi6_356'], reward: 40,
  steps: [
    say('neemias', `Isaías 58:13-14 convida a chamar o sábado de **deleitoso** (uma delícia). O documento oficial da Divisão Sul-Americana cita o texto assim:`),
    quote(`Se desviares o pé de profanar o sábado e de cuidar dos teus próprios interesses no Meu santo dia; se chamares ao sábado deleitoso e santo dia do Senhor, digno de honra, e o honrares não seguindo os teus caminhos, não pretendendo fazer a tua própria vontade, nem falando palavras vãs, então, te deleitarás no Senhor.`, `Isaías 58:13, 14 — como citado no documento oficial (DSA, 2023)`, ['is58', 'doc_intro']),
    emb({ title: '📄 Documento oficial · Espírito de comunhão', c: 'var(--violet)', desc: `O sábado deve se caracterizar por “um prazeroso e alegre compromisso com as prioridades espirituais, com momentos especiais de leitura da Bíblia, oração e, se possível, de contato com a natureza”.`, src: ['doc_comun'] }),
    say('neemias', `Ellen White pede algo parecido para as famílias:`),
    quote(`Devemos tornar o sábado tão interessante para nossa família, que sua volta semanal seja saudada com alegria. [...] Pais, tornem o sábado um deleite, para que seus filhos o aguardem e o acolham de coração.`, `E. G. White, Testemunhos Para a Igreja, vol. 2, pág. 585`, ['tpi2_585']),
    ask({ id: 'q4_1', kind: 'reflect', xp: 35, minWords: 10,
      bonus: /(deleit|alegr|delicia|prazer|feliz|present|descans|paz|liberd|famili|amig|comunh)/,
      text: `Um amigo manda: *“sábado é chato, só tem proibição”*. Escreva a **resposta que você mandaria**, usando a ideia de **deleite**.`,
      ph: 'Escreva como no chat…',
      react: `Boa! Quem convida com alegria costuma ser mais ouvido do que quem discute. 😉` }),
    quote(`Os pais poderão fazer do sábado o que em realidade deve ser, isto é, o dia mais alegre da semana, induzindo assim os filhos a considerá-lo um dia deleitoso, o dia por excelência, santo ao Senhor e digno de honra.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, págs. 356-359`, ['tpi6_356']),
    ask({ id: 'q4_2', kind: 'list', xp: 30, need: 3,
      text: `Crie a sua **lista de deleite**: **3 coisas** que tornariam o seu sábado o dia mais esperado da semana (comida, gente, lugar, música, atividade…).`,
      ph: 'Ex.: almoço, trilha, jogos…',
      react: `Essa lista é ouro. Guarde-a: ela vai virar o seu plano lá no Chefão. 👑`,
      model: `Não existe lista certa — o ponto é que o sábado tenha **coisas que você realmente espera com alegria**: pessoas queridas, comida boa, natureza, música, serviço, descanso de verdade.`,
      src: ['is58', 'tpi2_585'] })
  ] },

{ id: '2-quiz', cat: 'f2', name: '2-quiz', title: 'Quiz-relâmpago · Jesus e o Deleite', pill: 'QUIZ',
  topic: 'Respostas curtas · 35s por pergunta', pins: ['lc4', 'mc2', 'mt12', 'is58', 'dtn_207', 'tpi6_356'], reward: 40, quiz: true,
  steps: [
    QUIZ_INTRO(6),
    qz('z2_1', `Em qual evangelho está que Jesus ia à sinagoga no sábado “segundo o seu costume”?`, [/(lucas|\blc\b)/], `Lucas (4:16)`),
    qz('z2_2', `Marcos 2:27: o sábado foi feito por causa de quem?`, [/(homem|humano|humanidade|pessoa|gente|\bnos\b)/], `Do ser humano (“do homem”)`),
    qz('z2_3', `Segundo Mateus 12:12, o que é lícito fazer no sábado?`, [/(\bbem\b|bondade|boas obras|misericord)/], `O bem (fazer o bem)`),
    qz('z2_4', `Isaías 58:13 chama o sábado de ______. (uma palavra)`, [/(deleit|delicia|prazer|alegr)/], `Deleitoso (deleite)`),
    qz('z2_5', `Ellen White: o sábado não se destina a ser um período de inútil ______.`, [/(inativ)/], `Inatividade`),
    qz('z2_6', `Ellen White: o sábado é “o dia mais ______ da semana”.`, [/(alegre|feliz)/], `Alegre`),
    { t: 'quizend' }
  ] },

/* ---------- FASE 3 · COMO GUARDAR ---------- */
{ id: '3-sexta', cat: 'f3', name: '3-sexta', title: 'Sexta: Preparação e Pôr do Sol',
  topic: 'Dia de preparação · quando o sábado começa · culto de abertura', pins: ['tpi6_354', 'ex16', 'lv23', 'cf20', 'doc_prep', 'doc_inicio', 'tpi6_357b', 'folder'], reward: 40,
  steps: [
    say('neemias', `**Fase 3 · Como guardar** 🧭\nHora de sair da teoria e ir para o *calendário*. Tudo começa na **sexta**. 🌅`),
    quote(`Embora devamos nos preparar para o sábado durante toda a semana, a sexta-feira é o dia especial de preparação. Por intermédio de Moisés, o Senhor disse a Israel: “Amanhã é o repouso, o santo sábado do Senhor; o que quiserdes cozer no forno, cozei-o, e o que quiserdes cozer em água, cozei-o em água; e tudo o que sobrar, ponde em guarda para vós até amanhã.” Êxo. 16:23.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, pág. 354`, ['tpi6_354', 'ex16']),
    ask({ id: 'q5_1', kind: 'concept', xp: 40, minWords: 6,
      text: `Por que a sexta é chamada de **dia de preparação**? E cite **duas coisas práticas** que você pode deixar prontas nesse dia.`,
      concepts: [
        C('deixar tudo pronto antes', /(prepar|antecip|organiz|planej|adiant|deixar pront|deixa pront)/),
        CI('2 coisas práticas', [
          /(roupa|sapato|calcad|vest)/, /(comida|refeic|cozinh|almoc|lanche|alimento)/, /(oferta|dizimo)/,
          /(tarefa|trabalho|licao|estudo|prova|atividade)/, /(casa|limp|quarto|arrum)/,
          /(biblia|escola sabatina|mochila|hino|louvor)/, /(celular|modo|notific|bateria|carreg|tela)/
        ], 2, 2)
      ], full: .6,
      hint: `Pense em tudo o que, se ficar para o sábado, vira correria: roupa, comida, ofertas, tarefas…`,
      model: `A sexta é o dia de **deixar tudo pronto** para o sábado ser descanso de verdade (Êx 16:23). O documento oficial pede: casa **limpa e arrumada**, roupas **lavadas e passadas**, alimentos **providenciados** e a família **pronta**, antes do pôr do sol. O folder soma: **roupa e calçado**, **ofertas**, tarefas **divididas** entre todos e preparo **espiritual**. Hoje dá para somar: celular carregado e o **Modo Sábado** programado.`,
      src: ['tpi6_354', 'ex16', 'doc_prep', 'folder'] }),
    ask({ id: 'q5_2', kind: 'concept', xp: 40, minWords: 5,
      text: `**Quando o sábado começa e quando termina?** E como você descobre esse horário na sua cidade?`,
      concepts: [
        C('pôr do sol', /(por do sol|poente|entardecer|anoitecer|sol se po|sol se p)/, 2),
        C('de sexta a sábado', /(sexta.*sabado|sabado.*sexta)/),
        C('como descobrir o horário', /(aplicativo|\bapp\b|google|pesquis|tabela|calendario|site|internet|clima|previsao)/)
      ], full: .6,
      hint: `É “de entardecer a entardecer”. Qual momento do dia marca o começo e o fim?`,
      model: `O sábado vai **de pôr do sol a pôr do sol**: começa quando o sol se põe na **sexta** e termina quando se põe no **sábado** (Lv 23:32; Crença Fundamental 20). O horário muda por cidade e época do ano: use um app de clima/calendário ou pesquise “horário do pôr do sol” na sua cidade.`,
      src: ['lv23', 'cf20'] }),
    emb({ title: '📄 O documento oficial recomenda', c: 'var(--violet)', fields: [
      { n: '🌅 Preparação para o sábado', v: `Antes do pôr do sol de sexta, as atividades seculares devem ser interrompidas; a casa, **limpa e arrumada**; as roupas, **lavadas e passadas**; os alimentos, **providenciados**; e os membros da família, **já prontos**.`, w: 1 },
      { n: '🕯️ Início e término do sábado', v: `O dia deve ser aberto e encerrado com “**breves e atrativos cultos de pôr do sol**, com a participação dos membros da família”: cantar alguns hinos, ler uma passagem bíblica com comentários pertinentes e agradecer a Deus em oração.`, w: 1 }
    ], src: ['doc_prep', 'doc_inicio'] }),
    quote(`As crianças devem participar do culto familiar, cada qual com sua Bíblia, lendo um ou dois versículos. Podem cantar um hino preferido, seguido de oração [...]. Em singela petição, contemos ao Senhor as nossas necessidades exprimindo gratidão por Suas bênçãos. Deste modo, saudaremos a Jesus como hóspede bem-vindo em nosso lar e coração.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, págs. 357-358`, ['tpi6_357b']),
    ask({ id: 'q5_3', kind: 'concept', xp: 50, minWords: 8,
      text: `Monte o seu **culto de pôr do sol** nota 10: descreva pelo menos **3 elementos** (música, leitura, dinâmica, convidados, surpresa…).`,
      concepts: [
        CI('3 elementos', [
          /(hino|cant|music|louvor|violao)/, /(biblia|texto|versiculo|leitura|ler|espirito de profecia|paragrafo)/,
          /(oracao|orar|agradec|gratidao)/, /(dramatiz|historia|teatro|encena)/, /(convid|amig|visita)/,
          /(surpresa|lembranca|recordacao|presente)/, /(abraco|feliz sabado|beijo)/, /(experienc|compartilh|testemunho)/
        ], 3)
      ], full: .99,
      hint: `Dê uma olhada em tudo o que cabe em 15 minutos: cantar, ler, agradecer, dramatizar, convidar, abraçar…`,
      model: `O documento oficial resume o essencial de um culto de pôr do sol **breve e atrativo**: **cantar alguns hinos**, **ler uma passagem bíblica com comentários pertinentes** e **agradecer a Deus em oração**. O folder acrescenta: ler um parágrafo do Espírito de Profecia; **dramatizar** uma história bíblica; dar a cada participante um **texto bíblico**; cada um **agradecer** por algo específico da semana; **convidar amigos**; preparar uma **recordação-surpresa**; e fechar com um **abraço** e um “feliz sábado”.`,
      src: ['doc_inicio', 'folder', 'tpi6_357b'] })
  ] },

{ id: '3-manha', cat: 'f3', name: '3-manha', title: 'Manhã: Sono, Roupa e Igreja',
  topic: 'Descansar sem desperdiçar o dia · o que vestir · Escola Sabatina e culto', pins: ['tpi2_704', 'doc_sono', 'css_170', 'me2_475', 'edu_248', 'css_41', 'doc_igreja', 'folder'], reward: 40,
  steps: [
    say('neemias', `O sábado de manhã é o “lançamento” do dia. Três temas: **sono, roupa e igreja**. ⛪`),
    quote(`Ninguém se deve sentir na liberdade de gastar tempo santo inutilmente. Desagrada a Deus que os observadores do sábado durmam muito tempo no sábado. [...] Devem dedicar o tempo e as energias a cultos religiosos, para que a divina influência os possa acompanhar durante a semana. De todos os dias semanais, nenhum é tão favorável aos pensamentos e sentimentos religiosos como o sábado.`, `E. G. White, Testemunhos Para a Igreja, vol. 2, pág. 704`, ['tpi2_704']),
    emb({ title: '📄 Documento oficial · Horas de sono', c: 'var(--violet)', desc: `A Bíblia define o sábado como dia de “repouso solene” (Êx 31:15), “e não como dia de recuperar o sono atrasado da semana. Ricas bênçãos advirão de levantar cedo no sábado, dedicando esse dia ao serviço do Senhor”.`, src: ['doc_sono', 'css_170'] }),
    ask({ id: 'q6_1', kind: 'concept', xp: 35, minWords: 5,
      text: `Como **não** ficar morto de sono no sábado? Que hábito de **sexta à noite** ajuda? (O folder dá dicas.)`,
      concepts: [
        C('dormir/descansar mais cedo', /(dormir cedo|deitar cedo|descans.{0,25}cedo|mais cedo|cedo)/),
        C('conversar em família depois do jantar', /(famili|jantar|conversa)/),
        C('programar horários', /(horario|despertador|acordar|alarme|levantar|programar|desjejum|cafe)/)
      ], full: .5,
      hint: `Logo após o jantar… o que o folder sugere fazer e a que horas ir para a cama?`,
      model: `Depois do jantar, **converse um pouco em família e descanse mais cedo** que de costume; assim você fica mais disposto(a). **Programe** o horário de levantar, o café e a saída de casa para chegar a tempo. O documento oficial lembra que o sábado não é dia de “recuperar o sono atrasado da semana” — “ricas bênçãos advirão de levantar cedo no sábado”.`,
      src: ['folder', 'tpi2_704', 'doc_sono'] }),
    quote(`Alguns adquirem a ideia de que, para efetuar a separação do mundo que a Palavra de Deus requer, devem negligenciar o vestuário. [...] Reúnem-se com o povo de Deus no sábado, com a roupa poeirenta e encardida, e mesmo com bocejantes rasgões, e posta sobre o corpo de maneira negligente.`, `E. G. White, Mensagens Escolhidas, vol. 2, pág. 475`, ['me2_475', 'edu_248']),
    ask({ id: 'q6_2', kind: 'concept', xp: 40, minWords: 8,
      text: `Qual é o **princípio** por trás da roupa de sábado? (Dica: não é sobre ser chique, nem sobre ser desleixado.)`,
      concepts: [
        C('honrar a Deus / respeito', /(respeit|honr|reveren|encontro|criador|deus|importan|valor|cuidado|capricho)/),
        C('equilíbrio: sóbria, bom gosto, sem exagero', /(sobri|bom gosto|simples|discret|equilibr|extravag|exager|negligen|desleix)/),
        C('sem vaidade nem discussão', /(discuss|julg|competi|vaidade|aparenc|briga)/)
      ], full: .66,
      hint: `O folder lembra: “você está indo ao encontro do …”.`,
      model: `O princípio é **honrar a Deus**: você está “indo ao encontro do Criador”. Por isso, a **melhor roupa** separada para o sábado, **sóbria e de bom gosto** — sem extravagância e sem desleixo — e **sem transformar roupa em motivo de discussão**.`,
      src: ['me2_475', 'edu_248', 'folder'] }),
    quote(`A Escola Sabatina oferece a pais e filhos preciosa oportunidade para o estudo da Palavra de Deus. Mas, a fim de receber o benefício que devem conseguir na Escola Sabatina, tanto os pais como os filhos precisam dedicar tempo ao estudo das lições [...].`, `E. G. White, Conselhos Sobre a Escola Sabatina, pág. 41`, ['css_41']),
    emb({ title: '📄 Documento oficial · Reuniões da igreja', c: 'var(--violet)', desc: `Somos admoestados a não deixar “de congregar-nos” (Hb 10:25). Por isso, “as programações e atividades regulares da igreja aos sábados devem ter precedência sobre outros compromissos pessoais e sociais, mesmo que estes sejam pertinentes para o sábado”.`, src: ['doc_igreja'] }),
    ask({ id: 'q6_3', kind: 'concept', xp: 30, minWords: 6,
      text: `O que você pode fazer **durante a semana** para aproveitar mais a Escola Sabatina e o culto? Cite **2 ações** práticas.`,
      concepts: [
        CI('2 ações práticas', [
          /(licao|estud|ler|biblia)/, /(assinatura|revista|aplicativo|\bapp\b)/, /(famili|pais|irmao)/,
          /(saud|visitante|recepc|acolh)/, /(oracao|orar)/, /(oferta|dizimo)/,
          /(infantil|crianc)/, /(particip|envolv|anot|atencao|foco)/
        ], 2)
      ], full: .99,
      hint: `O folder fala de assinatura da lição, estudo pessoal na semana, saudar visitantes, oração ao entrar, ofertas prontas…`,
      model: `Do folder: ter a **assinatura da lição** para cada pessoa da família; **estudar a lição** durante a semana; **saudar** amigos e visitantes; fazer uma **oração silenciosa** ao entrar; deixar as **ofertas prontas**; e se envolver de verdade com a mensagem.`,
      src: ['css_41', 'folder'] })
  ] },

{ id: '3-tarde', cat: 'f3', name: '3-tarde', title: 'Tarde: Mesa, Gente e Natureza',
  topic: 'Almoço simples e alegre · natureza · tarde com gente · irmãos menores', pins: ['tpi6_357', 'doc_rest', 'csa_165', 'doc_assist', 'tpi6_358', 'folder'], reward: 40,
  steps: [
    say('neemias', `Depois do culto vem a parte que mais define se o sábado vai ser **deleite** ou **tédio**: a tarde. ☀️`),
    quote(`No sábado, não devemos aumentar a quantidade de alimento ou preparar maior variedade do que nos outros dias. Ao contrário, a refeição do sábado deve ser mais simples, e devemos comer menos, a fim de ter o espírito claro e em condições de compreender os temas espirituais. A alimentação em excesso entorpece a mente.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, pág. 357`, ['tpi6_357']),
    emb({ title: '📄 Documento oficial · Restaurantes e alimentação', c: 'var(--violet)', desc: `O alimento deve ser providenciado com antecedência: isso “significa que ele deve ser comprado fora das horas do sábado, e que a frequência a restaurantes comerciais nesse dia deve ser evitada”.`, src: ['doc_rest'] }),
    ask({ id: 'q7_1', kind: 'concept', xp: 35, minWords: 8,
      text: `Por que a refeição do sábado deve ser **mais simples**? E como fazer dela um momento **alegre** mesmo assim?`,
      concepts: [
        C('mente clara para o espiritual', /(mente|espirit|clar|entorpec|concentr|sono|pesad|compreend)/),
        C('simples, mas saborosa e especial', /(saborosa|gostos|atraente|especial|prato|apetit|simples)/),
        C('convivência e alegria', /(amig|convid|famili|conversa|alegr|descontr|musica|ajudar|todos ajudam)/)
      ], full: .66,
      hint: `Duas ideias: o efeito de comer demais na mente… e o que o folder sugere para o almoço virar festa sem virar banquete.`,
      model: `Porque comer demais “entorpece a mente” e atrapalha entender os temas espirituais. O folder sugere: comida **simples, mas saborosa e atraente** (um prato especial é bem-vindo), **convidar amigos**, ter **música instrumental cristã** ao fundo, conversar sobre o sermão e fazer **todos ajudarem** no preparo e na arrumação. Lembrete do documento oficial: o alimento é providenciado **antes**, e a ida a restaurantes comerciais nesse dia deve ser evitada.`,
      src: ['tpi6_357', 'doc_rest', 'folder'] }),
    quote(`O sábado convida-nos a contemplar, nas obras criadas, a glória do Criador. [...] Mais do que em qualquer outro dia, devemos, no santo dia de descanso, estudar as mensagens que Deus para nós escreveu na natureza. [...] À medida que penetramos no seio da natureza, Cristo nos torna real a Sua presença, e nos fala ao coração de Sua paz e amor.`, `E. G. White, Conselhos Sobre Saúde, pág. 165`, ['csa_165']),
    ask({ id: 'q7_2', kind: 'list', xp: 40, need: 3,
      bonus: /(natureza|trilha|parque|praca|passeio|caminh|ar livre|campo|praia)/,
      text: `Monte a sua **tarde de sábado ideal**: cite **3 atividades** (com gente, na natureza ou servindo alguém) que você realmente curtiria.`,
      ph: 'Ex.: trilha, visita, jogo bíblico…',
      react: `Boa! O folder reforça: visitas, estudo bíblico com um amigo, passeios na natureza e jogos bíblicos. O documento acrescenta visitar enfermos, viúvas e órfãos, encarcerados. Quanto mais **gente e propósito**, menos tédio. 🌿`,
      model: `Exemplos do folder: **visitas** de cortesia e estudo bíblico com um amigo; **passeio na natureza** com família e amigos; **jogos bíblicos** ou DVD cristão; visitar a **igreja de um amigo**. O documento oficial cita visitar “enfermos, viúvas e órfãos, encarcerados” e “compartilhar uma refeição” — e lembra que ações sociais que podem ser feitas em outro dia não devem tomar as horas do sábado.`,
      src: ['folder', 'csa_165', 'doc_assist'] }),
    quote(`Em muitas famílias, os filhos menores são deixados à vontade, a fim de se entreterem como melhor puderem. Abandonadas a si mesmas, as crianças em breve ficam inquietas e começam a brincar ou ocupar-se de coisas inadequadas. Deste modo, o sábado perde para elas sua importância sagrada.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, pág. 358`, ['tpi6_358'], `Você tem irmãos menores, primos ou sobrinhos? Aqui o desafio é **você liderar**.`),
    ask({ id: 'q7_3', kind: 'reflect', xp: 25, minWords: 8,
      text: `O folder sugere, por exemplo, uma **caixa** com brinquedos e jogos bíblicos usados **só no sábado**. Que ideia **nova** você teria para tornar o sábado especial para uma criança?`,
      ph: 'Sua ideia criativa…',
      react: `Gostei! Quem inventa um sábado bom para uma criança, aprende a amá-lo também. 💛` })
  ] },

{ id: '3-modo', cat: 'f3', name: '3-modo-sabado', title: 'Modo Sábado (telas e mundo secular)',
  topic: 'Mídia desativada · o teste do sábado · planejar para não invadir as horas sagradas', pins: ['doc_midia', 'folder', 'decl_198', 'tpi6_354', 'ne13'], reward: 40,
  steps: [
    say('neemias', `Chegou o tema mais 2026 de todos: **telas**. 📱`),
    emb({ title: 'O que o folder sugere', c: 'var(--violet)', fields: [
      { n: '📵 Mídia', v: `“A Mídia (TV, rádio, computador, internet, celular, jogos eletrônicos, DVD's, etc.) deve ficar desativada durante as horas do sábado, a menos que esteja relacionada com assuntos religiosos.”`, w: 1 },
      { n: '📄 Documento oficial · Mídia secular', v: `“A mídia secular, em todas as suas formas, deve ser deixada de lado durante as horas do sábado, para que este, rompendo com a rotina da vida, possa ser um dia ‘deleitoso e santo’.” (Is 58:13)`, w: 1 },
      { n: '🗂️ Longe da vista', v: `“Guarde em locais que não desperte a sua atenção as revistas, jornais e músicas seculares.”`, w: 1 },
      { n: '📅 Planejamento', v: `“Planeje as atividades diárias de forma que não invadam as horas sabáticas.”`, w: 1 },
      { n: '🧭 A pergunta-chave', v: `“É importante ter em mente a seguinte pergunta: Esta atividade me leva a compreender melhor a verdadeira e sagrada natureza do sábado?” — *Declarações da Igreja*, pág. 198`, w: 1 }
    ], src: ['doc_midia', 'folder', 'decl_198'] }),
    quote(`Nenhum dever relacionado com os seis dias anteriores será deixado para o sábado. Durante a semana, teremos o cuidado de não gastar as energias com trabalho físico a ponto de estarmos demasiadamente cansados para participar do culto, no dia em que o Senhor descansou.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, pág. 354`, ['tpi6_354']),
    qz('q8_1', `Complete a **pergunta-chave** do sábado: “Esta atividade me leva a compreender melhor a verdadeira e sagrada ______ do sábado?”`, [/natureza/], `Natureza`, { xp: 20, time: 0 }),
    ask({ id: 'q8_2', kind: 'reflect', xp: 60, minWords: 18, listBonus: 3,
      text: `Aplique o **teste do sábado** a **3 atividades da sua rotina digital** (jogar, séries, redes, música, grupos…). Para cada uma: **passa ou não passa?** Por quê?`,
      ph: '1) … passa porque… 2) …',
      react: `Sem julgamento: o teste é uma **bússola**, não uma lista de pecados. O que importa é você ter uma **resposta própria**, construída com Deus e conversada com seus pais e líderes.` }),
    ask({ id: 'q8_3', kind: 'concept', xp: 60, minWords: 10,
      text: `Se seu celular tivesse um **Modo Sábado**, quais seriam as **regras** dele? (horário, o que fecha, o que fica liberado)`,
      concepts: [
        C('horário (sexta/sábado, pôr do sol)', /(por do sol|sexta|sabado|horario|\bdas\b|\bate\b)/),
        C('o que fecha (redes, jogos, séries, notificações)', /(rede|jogo|serie|notific|stories|tiktok|insta|youtube|streaming|netflix|mensag|grupo|game)/),
        C('o que fica liberado (Bíblia, hinos, lição, ligar para alguém)', /(biblia|hino|licao|louvor|oracao|igreja|devocion|musica crista|espiritual|religios|emergenc|familia|ligar|ligacao)/)
      ], full: .66,
      hint: `Três partes: QUANDO começa/termina, O QUE fecha e O QUE continua liberado (assuntos religiosos, emergências).`,
      model: `Uma boa configuração tem 3 partes: **horário** (sexta no pôr do sol → sábado no pôr do sol), **o que fecha** (redes sociais, jogos, séries, notificações de grupos) e **o que fica liberado** (Bíblia, hinos, lição da Escola Sabatina, ligar para alguém em emergência). No iPhone use *Foco*; no Android, *Não perturbe/Modos*.`,
      src: ['folder', 'decl_198'] }),
    say('neemias', `Dica final: programe esse modo **agora**, antes de sexta. É o seu **“portão de Neemias”** digital — fechado *antes* de a tentação chegar. 🔒`, { embed: { src: ['ne13'] } })
  ] },

{ id: '3-documento', cat: 'f3', name: '3-documento-oficial', title: 'O Documento Oficial na Vida Real',
  topic: 'Esportes e lazer · festas · escola e provas · profissão · restaurantes e viagens', reward: 50,
  pins: ['doc', 'doc_esporte', 'doc_festas', 'doc_estag', 'doc_prof', 'doc_serv', 'doc_rest', 'doc_viagem', 'doc_med', 'doc_excurs'],
  steps: [
    say('neemias', `Agora o **documento oficial** da Divisão Sul-Americana da Igreja Adventista (24/10/2023). Ele trata de coisas bem concretas: esporte, festa, escola, trabalho, viagem. Vamos ler alguns trechos e testar se você entendeu. 📄`, { embed: { src: ['doc'] } }),
    emb({ title: 'O que o documento diz (trechos)', c: 'var(--violet)', fields: [
      { n: '⚽ Esportes e lazer', v: `“Muitas atividades esportivas e de lazer, aceitáveis durante a semana, não são condizentes com a observância do sábado, pois desviam a mente das questões espirituais.” (Is 58:13)`, w: 1 },
      { n: '🎉 Casamentos e festas', v: `Devem ser realizados “fora desse período sagrado”, incluindo os preparativos. E “Casamentos e algumas festas mais suntuosas não devem ser planejados para os sábados à noite”, porque os preparativos envolvem “expectativas e atividades não condizentes com o espírito de comunhão com Deus”.`, w: 1 },
      { n: '🏫 Estágios e práticas escolares', v: `Entre as atividades seculares “que gerem lucro ou benefício material” estão os programas de preparo para a vida profissional, “incluindo a frequência às aulas e a participação em estágios, simpósios, seminários e palestras de cunho profissional, concursos públicos e exames seletivos”. Se o exame exigir confinamento depois do fim do sábado, “as horas desse dia devem ser gastas em atividades espirituais”.`, w: 1 },
      { n: '💼 Profissão e trabalho', v: `Os adventistas do sétimo dia “devem escolher e exercer profissões condizentes com a devida observância do sábado”. Mesmo em instituições seculares de serviços básicos, “devem se abster de trabalhar nesse dia”.`, w: 1 },
      { n: '🍽️ Restaurantes', v: `O alimento deve ser “comprado fora das horas do sábado”, e a frequência a restaurantes comerciais nesse dia “deve ser evitada”.` },
      { n: '🧳 Viagens', v: `Viagem “por questões de trabalho ou interesses particulares é imprópria para o sábado”; as exceções são “compromisso religioso ou situações emergenciais”.` },
      { n: '💊 Medicamentos', v: `Comprar remédio é aceitável “em situações emergenciais”; é “imprópria quando a pessoa já os necessitava, e acabou postergando sua compra para esse dia”.` },
      { n: '⛺ Excursões e acampamentos', v: `A realização de excursões e acampamentos “pode promover a socialização cristã”, mas todos devem “chegar ao devido local antes do início do sábado e montar sua estrutura, incluindo suas barracas”.` }
    ], src: ['doc_esporte', 'doc_festas', 'doc_estag', 'doc_prof', 'doc_serv', 'doc_rest', 'doc_viagem', 'doc_med', 'doc_excurs'] }),
    ask({ id: 'q10_1', kind: 'concept', xp: 35, minWords: 8,
      text: `**Esportes e lazer:** que **critério** o documento usa para dizer que atividades “aceitáveis durante a semana” não combinam com o sábado? E ele diz que **toda** atividade esportiva fica de fora?`,
      concepts: [
        C('“muitas”, não todas', /(muita|nem toda|nem todas|algumas|nao e toda|nao sao todas|depende|nao diz que toda|nao proibe toda)/),
        C('desviam a mente das questões espirituais', /(desvi|mente|espiritu|distra|foco|afast)/),
        C('o critério vem de Isaías 58:13', /(proprios interesses|proprios caminhos|propria vontade|isaias|\bis\b 58|58)/)
      ], full: .66,
      hint: `O critério não é “esporte é pecado”: é o que a atividade faz com a sua **mente**. E repare na primeira palavra da frase do documento.`,
      model: `O documento diz que “**muitas** atividades esportivas e de lazer, aceitáveis durante a semana, não são condizentes com a observância do sábado, pois **desviam a mente das questões espirituais**” (Is 58:13). Ou seja: não diz “todas”, e o critério é o efeito na mente. Por isso vale aplicar o **teste do sábado** e conversar com seu líder.`,
      src: ['doc_esporte', 'decl_198'] }),
    ask({ id: 'q10_2', kind: 'concept', xp: 35, minWords: 8,
      text: `**Festas:** segundo o documento, **quando** casamentos e festas devem acontecer? E por que ele alerta até sobre festas planejadas para o **sábado à noite**?`,
      concepts: [
        C('fora do período sagrado do sábado', /(fora (d[oe]|desse|dessas|do) (periodo|sabado|horas)|periodo sagrado|fora do sabado|fora dessas horas|fora das horas)/),
        C('os preparativos acontecem no sábado', /(preparativ|prepar)/),
        C('expectativas e atividades não condizentes com a comunhão com Deus', /(expectativ|nao condizent|comunhao|espirito de comunhao|incompativ|nao combin)/)
      ], full: .66,
      hint: `Pense no que acontece durante a tarde de sábado quando há uma festa grande à noite: quem está se preparando, e para quê?`,
      model: `Casamentos e festas, “incluindo seus devidos preparativos”, devem ser feitos **fora do período sagrado**. As festas mais suntuosas não devem ser planejadas para o sábado à noite porque os **preparativos** acontecem durante o sábado e envolvem “expectativas e atividades não condizentes com o espírito de comunhão com Deus”.`,
      src: ['doc_festas'] }),
    ask({ id: 'q10_3', kind: 'concept', xp: 40, minWords: 10,
      text: `**Escola e provas:** que atividades escolares e profissionais o documento lista entre as atividades seculares? E o que fazer com as **horas do sábado** se o exame exigir confinamento depois do pôr do sol?`,
      concepts: [
        CI('aulas, estágios, seminários, concursos, exames', [/(aula|frequencia)/, /(estagio)/, /(simposio|seminario|palestra)/, /(concurso)/, /(exame|vestibular|selet|prova)/], 2),
        C('gastar as horas do sábado em atividades espirituais', /(atividades espirituais|espiritu|oracao|biblia|culto|estudo biblico|louvor)/)
      ], full: .99,
      hint: `São atividades de “preparo para a vida profissional”. E, no confinamento, o documento diz para ocupar as horas do sábado com …`,
      model: `O documento cita “a frequência às aulas e a participação em estágios, simpósios, seminários e palestras de cunho profissional, concursos públicos e exames seletivos”. Se o exame exigir confinamento depois do fim do sábado, “as horas desse dia devem ser gastas em atividades espirituais”.`,
      src: ['doc_estag'] }),
    ask({ id: 'q10_4', kind: 'reflect', xp: 30, minWords: 12,
      bonus: /(esporte|festa|escola|prova|trabalho|restaurante|viagem|amigo|familia|time|vestibular|estagio|jogo|celular)/,
      text: `Dos trechos de hoje, **qual é o mais difícil de viver** no seu mundo (esporte, festa, escola, trabalho, restaurante, viagem)? Conte com sinceridade — o jogo não julga.`,
      ph: 'Conte com sinceridade…',
      react: `Obrigado por ser sincero(a). Dificuldade não é pecado: é **mapa**. Os dilemas da Fase 4 vão usar exatamente esses pontos.` })
  ] },

{ id: '3-despedida', cat: 'f3', name: '3-despedida', title: 'Despedida e Sete Dias',
  topic: 'Como encerrar o sábado · adventista de segunda a sexta · culto familiar', pins: ['tpi6_356', 'tpi5_609', 'oc_521', 'st_1884', 'folder'], reward: 40,
  steps: [
    say('neemias', `O sábado termina — mas a fé não. Duas ideias para fechar a Fase 3. 🌇`),
    quote(`Ao pôr-do-sol, é hora de elevar a voz em oração e cânticos de louvor a Deus, celebrando o término do sábado e pedindo a assistência do Senhor para os cuidados da nova semana de atividades.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, págs. 356-359`, ['tpi6_356']),
    ask({ id: 'q9_1', kind: 'concept', xp: 35, minWords: 6,
      text: `Na **despedida do sábado**, o folder propõe alguns movimentos. Cite pelo menos **2**.`,
      concepts: [
        C('agradecer as bênçãos', /(agradec|gratidao|obrig)/),
        C('pedir direção para a semana', /(pedir|direcao|assistencia|orient|nova semana|semana nova)/),
        C('avaliar e planejar a semana', /(avali|planej|organiz|agenda)/),
        C('começar a se preparar para o próximo sábado', /(prepar.*sabado|proximo sabado|novo sabado)/),
        C('oração e louvor', /(oracao|louvor|canticos|cantar|hino)/)
      ], full: .4,
      hint: `É um momento de transição: encerrar um ciclo e abrir outro. Pense em agradecer, pedir, avaliar e …`,
      model: `Do folder: **agradecer** as bênçãos do sábado e **pedir direção** para a nova semana; **gastar um tempo avaliando e planejando** as atividades; e já **iniciar o preparo** de um novo sábado — tudo com **oração e louvor** ao pôr do sol.`,
      src: ['tpi6_356', 'folder'] }),
    quote(`Devemos dia a dia, hora a hora, minuto a minuto viver para Cristo; então Ele habitará em nosso coração [...].`, `E. G. White, Testemunhos Para a Igreja, vol. 5, pág. 609`, ['tpi5_609'], `O folder fala em ser **“adventista nos sete dias”**.`),
    ask({ id: 'q9_2', kind: 'reflect', xp: 30, minWords: 10,
      bonus: /(primeira hora|oracao|biblia|palavra|gesto|ajudar|respeit|honest|mentira|colar|pais|conversa|culto familiar|musica|celular|bondade|paciencia)/,
      text: `Diga **uma atitude concreta**, de **segunda a sexta**, que mostra que o sábado mudou o seu jeito de viver.`,
      ph: 'Ex.: na primeira hora do dia eu…',
      react: `É isso: o sábado é o **ensaio semanal** de uma vida inteira com Deus. Um dia que contagia os outros seis.` }),
    ask({ id: 'q9_3', kind: 'concept', xp: 25, minWords: 6,
      text: `Dê **uma ideia** para deixar o **culto familiar** da semana menos monótono. (O folder tem várias.)`,
      concepts: [
        C('ideia concreta', /(promessa|experienc|compartilh|oracao em circulo|circulo|continuidade|um comeca|dia para cada|perdao|perdoar|hino|musica|dramatiz|historia|curto|diferente|alternar|revezar)/)
      ], full: .99,
      hint: `Promessas bíblicas, compartilhar o dia, orações diferentes (em círculo, em continuidade), pedir perdão…`,
      model: `Do folder: apresentar **promessas bíblicas**; **compartilhar as experiências do dia**; variar a oração (**em círculo**, cada um uma frase; ou **em continuidade**, um começa e outro conclui); **um dia para cada pessoa orar**; e **pedir perdão** por faltas entre os membros da família. Mantenha o culto **curto e espiritual**.`,
      src: ['oc_521', 'st_1884', 'folder'] })
  ] },

{ id: '3-quiz', cat: 'f3', name: '3-quiz', title: 'Quiz-relâmpago · Como Guardar', pill: 'QUIZ',
  topic: 'Respostas curtas · 35s por pergunta', pins: ['tpi6_354', 'tpi6_357', 'csa_165', 'folder', 'decl_198', 'doc_sono', 'doc_rest', 'doc_inicio'], reward: 50, quiz: true,
  steps: [
    QUIZ_INTRO(10),
    qz('z3_1', `Qual dia da semana é o “dia de preparação”?`, [/sexta/], `Sexta-feira`),
    qz('z3_2', `O sábado começa em qual momento da sexta?`, [/(por do sol|poente|entardecer|anoitecer)/], `No pôr do sol`),
    qz('z3_3', `Complete: a refeição do sábado deve ser mais ______.`, [/simples/], `Simples`),
    qz('z3_4', `Na roupa de sábado se evita a extravagância, mas também ser ______. (uma palavra)`, [/(negligen|desleix|relaxad|largad|desarrum|descuid)/], `Negligente / desleixado`),
    qz('z3_5', `Em que “lugar” devemos estudar as mensagens que Deus escreveu, segundo Conselhos Sobre Saúde, p. 165?`, [/(natureza|campo|prado|ar livre|ceu aberto)/], `Na natureza`),
    qz('z3_6', `A mídia (TV, internet, jogos) deve ficar ______ nas horas do sábado, a menos que seja religiosa.`, [/(desativ|desligad|\boff\b|fechad|bloquead)/], `Desativada`),
    qz('z3_7', `A compra de alimento ou remédio deve ser feita durante a ______ (exceto emergências).`, [/semana/], `Semana`),
    qz('z3_8', `O documento oficial diz que a Bíblia define o sábado como dia de “repouso ______” (Êx 31:15). (uma palavra)`, [/solene/], `Solene`),
    qz('z3_9', `Segundo o documento, a frequência a restaurantes ______ nesse dia deve ser evitada. (uma palavra)`, [/comerc/], `Comerciais`),
    qz('z3_10', `Os cultos de pôr do sol devem ser “______ e atrativos”, segundo o documento. (uma palavra)`, [/breve/], `Breves`),
    { t: 'quizend' }
  ] }

];

/* ============================================================
   CONTEÚDO · parte B — Dilemas (Fase 4), Chefão (Fase 5), canais livres e montagem
   Personagens e situações são FICTÍCIOS.
   ============================================================ */

const DEF_AFTER = `Valeu por ser sincero(a). Ensaiar aqui custa **zero**; na vida real custa mais — por isso vale decidir **antes**. Vamos ver o que as fontes dizem e o que isso muda na prática.`;

function dilemma(o) {
  const s = [];
  s.push(say('neemias', `**Dilema ${o.num} · ${o.title}** ${o.emoji}\n${o.setup}\n\nResponda **como na vida real**. Não existe resposta certa para o que você faria — aqui é lugar seguro para ensaiar.`));
  o.scene.forEach(([w, t]) => s.push(w === 'narr' ? sys(t) : say(w, t)));
  s.push(ask({ id: o.id + '_a', kind: 'reply', xp: 25, minWords: 4, text: o.q1, ph: 'Responda como na vida real…' }));
  o.mid.forEach(([w, t]) => s.push(w === 'narr' ? sys(t) : say(w, t)));
  s.push(ask({ id: o.id + '_b', kind: 'reply', xp: 30, minWords: 4, text: o.q2, ph: 'Mantém ou cede? Seja sincero(a)…' }));
  s.push(say('neemias', o.after || DEF_AFTER));
  s.push(emb({
    title: '🔎 Teoria × Prática', c: 'var(--violet)',
    fields: [
      { n: '📖 Teoria — o que as fontes dizem', v: o.theory, w: 1 },
      { n: '🛠️ Prática — o que muda na vida real', v: o.practice, w: 1 },
      { n: '🙏 Pela fé', v: o.faith, w: 1 }
    ],
    src: o.src
  }));
  s.push({ t: 'dec', id: o.id, title: o.dec.title, intro: o.dec.intro || 'Agora transforme a reflexão em **decisão**. Escreva como se fosse de verdade — o que você escrever aqui vai para o seu Cartão de Compromisso.', fields: o.dec.fields, xp: 70 });
  s.push({ t: 'pocket', id: o.id, text: o.pocket, xp: 30 });
  return { id: o.id, cat: 'f4', name: o.name, title: o.title, topic: o.topic, cast: o.cast, pins: o.src, steps: s, reward: 40 };
}

const CH_B = [

dilemma({
  id: 'd1', num: 1, emoji: '🎮', title: 'O Torneio', name: 'dilema-1-torneio',
  topic: 'Jogo, time e sábado · mídia e atividades seculares', cast: ['kaio', 'rafa'],
  setup: `Você está no grupo **Squad Ranked**, a turma do jogo online. Leia e responda.`,
  scene: [
    ['kaio', `GENTE saiu a tabela do campeonato interno 🔥🔥`],
    ['kaio', `nossa partida é **SÁBADO 15h**. se ganhar, vai pro regional`],
    ['rafa', `sem o {nick} a gente não passa, ele é o nosso carry 😭`],
    ['kaio', `{nick} tá dentro, né? 👀`]
  ],
  q1: `O grupo está esperando. **O que você responde?**`,
  mid: [
    ['kaio', `ah vai, é só 1h 🥺 Deus entende, é só um jogo`],
    ['rafa', `ninguém precisa saber kkkk. e se a gente perder por sua causa?`]
  ],
  q2: `A pressão aumentou. **Você mantém ou cede?** Escreva a resposta (pode ser a mesma ou outra — seja honesto(a)).`,
  theory: `• O sábado é **memorial do Criador** e sinal de lealdade (Êx 20:8-11; 31:13-17).\n• O folder orienta: a mídia, incluindo **jogos eletrônicos**, “deve ficar desativada durante as horas do sábado, a menos que esteja relacionada com assuntos religiosos”.\n• Pergunta-chave: “Esta atividade me leva a compreender melhor a verdadeira e sagrada natureza do sábado?” (*Declarações da Igreja*, p. 198)
• O documento oficial: “Muitas atividades esportivas e de lazer, aceitáveis durante a semana, não são condizentes com a observância do sábado, pois desviam a mente das questões espirituais” — e “a mídia secular, em todas as suas formas, deve ser deixada de lado durante as horas do sábado”.`,
  practice: `• A decisão forte é a de **antes**: avise o time **quando a tabela sair**, não na hora do jogo.\n• Chegue com **alternativa**: outro dia ou horário, treino extra na quinta, indicar um reserva.\n• Sem sermão e sem drama: *“Sábado eu não jogo — mas conta comigo em qualquer outro dia.”*\n• Aceite o custo: você pode perder a vaga. Isso é real.`,
  faith: `Fé não é garantia de placar. É decidir **antes de ver o resultado**, confiando em quem Deus é — como Neemias, que fechou os portões sem saber o que os comerciantes fariam (Ne 13:19-22).`,
  src: ['ne13', 'decl_198', 'ex20', 'folder', 'doc_esporte', 'doc_midia'],
  dec: { title: 'Decisão de Fé · O Torneio', fields: [
    { id: 'msg', label: 'A mensagem que vou mandar ao time (até hoje)', ph: 'Ex.: Pessoal, sábado eu não jogo porque guardo o sábado. Mas quero ajudar o time: posso…', min: 12, rows: 4 },
    { id: 'alt', label: 'A alternativa que eu ofereço', ph: 'Ex.: treinar na quinta, indicar um reserva…', min: 4, rows: 2 },
    { id: 'quem', label: 'Quem vai me ajudar a manter essa decisão?', ph: 'Ex.: meu pai, meu líder JA, a Nath…', min: 1, rows: 1 }
  ] },
  pocket: `Mande a mensagem ao time **hoje**, antes que a tabela vire “oficial”. E ore por esse grupo.`
}),

dilemma({
  id: 'd2', num: 2, emoji: '📚', title: 'A Prova do Sábado', name: 'dilema-2-prova',
  topic: 'Escola, vestibular e o direito de pedir uma alternativa', cast: ['bia', 'sandra'],
  setup: `A escola marcou um simulado. Você recebe uma mensagem da Bia, da sua turma.`,
  scene: [
    ['bia', `viu o aviso da coordenação?? 📢`],
    ['bia', `o simulado do vestibular vai ser **sábado de manhã**. vale nota e entra no ranking da escola`],
    ['bia', `quem faltar zera 😬 você vai, né? é só 4 horinhas`]
  ],
  q1: `A Bia espera sua resposta. **O que você escreve?**`,
  mid: [
    ['bia', `mas o que a escola vai achar? vão falar que você tá fugindo`],
    ['bia', `vai perder a chance de passar em medicina por causa disso?? 😳`]
  ],
  q2: `O medo de perder a chance bateu. **Qual é a sua resposta agora?** Mantém, cede ou propõe outro caminho?`,
  theory: `• O sábado é dia de deixar “as ocupações da vida diária” e dedicar as horas a “um saudável repouso, ao culto e a boas obras” (DTN, p. 207).\n• O folder: “Planeje as atividades diárias de forma que não invadam as horas sabáticas.”\n• Ellen White: “Nenhum dever relacionado com os seis dias anteriores será deixado para o sábado” (Test. 6, p. 354) — **estudo é valioso**, o desafio é planejar.
• O documento oficial inclui entre as atividades seculares os “programas de planejamento e preparo para a vida profissional, incluindo a frequência às aulas e a participação em estágios, simpósios, seminários e palestras de cunho profissional, concursos públicos e exames seletivos”. Se o exame exigir confinamento depois do fim do sábado, “as horas desse dia devem ser gastas em atividades espirituais”.`,
  practice: `• No Brasil, a **Lei 13.796/2019** (art. 7º-A da LDB) prevê que o aluno de escola pública ou privada pode, mediante **requerimento prévio e motivado**, faltar a prova ou aula em dia de guarda religiosa; a escola oferece **prestação alternativa** (reposição ou trabalho), sem custo para o aluno. *Há exceções, como o ensino militar. Confira o texto oficial e converse com seus responsáveis.*\n• Faça o pedido **cedo**, com **respeito** e **por escrito** (assim fica registrado), com a ajuda dos seus pais, explicando o motivo religioso.\n• Você não está *fugindo* da prova: está pedindo **outro horário**.\n• Concursos e vestibulares externos seguem o edital: fale com a organizadora com antecedência.
• Se não houver alternativa e o exame exigir confinamento depois do pôr do sol, o documento orienta ocupar as horas do sábado com atividades espirituais.`,
  faith: `Pedir um direito com educação é uma fé **ativa**: você faz a sua parte e confia que Deus faz a Dele (Mt 6:33).`,
  src: ['lei', 'dtn_207', 'tpi6_354', 'mt6', 'folder', 'doc_estag'],
  dec: { title: 'Decisão de Fé · A Prova do Sábado', fields: [
    { id: 'pedido', label: 'Meu pedido à coordenação (2 a 4 frases)', ph: 'Prezada coordenação, sou aluno(a) adventista e guardo o sábado como dia de descanso e adoração. Por isso, peço…', min: 15, rows: 4 },
    { id: 'quem', label: 'Quem vai comigo nessa conversa?', ph: 'Ex.: minha mãe e o líder JA', min: 2, rows: 1 },
    { id: 'planb', label: 'Se a escola negar, meu próximo passo é…', ph: 'Ex.: pedir orientação do pastor e falar com a direção…', min: 5, rows: 2 }
  ] },
  pocket: `Escreva e entregue o pedido **antes da data** (quanto antes, melhor).`
}),

dilemma({
  id: 'd3', num: 3, emoji: '🎂', title: 'O Níver da Sexta', name: 'dilema-3-role',
  topic: 'Amizade, convite e o início do sábado no pôr do sol de sexta', cast: ['duda', 'nath'],
  setup: `Sua amiga Duda te chama no privado.`,
  scene: [
    ['duda', `AMIGAAAA meu níver vai ser **SEXTA 19h30** na casa da Lu 🎂🎉`],
    ['duda', `vai ter pizza, karaokê e luz neon. a turma toda vai!`],
    ['duda', `eu fiz questão que você viesse. senão não tem graça 🥺`]
  ],
  q1: `A Duda é sua amiga de verdade. **O que você responde?**`,
  mid: [
    ['duda', `sempre que tem rolê de sexta você some... parece que não é mais minha amiga 😞`],
    ['duda', `pelo menos fica até o parabéns, é 21h!`]
  ],
  q2: `Agora é pessoal e dói um pouco. **O que você responde, de coração?**`,
  theory: `• O sábado vai “de entardecer a entardecer”: começa no **pôr do sol de sexta** (Lv 23:32; Crença Fundamental 20).\n• O documento oficial *Observância do Sábado* recomenda interromper as atividades seculares **antes do pôr do sol de sexta** e abrir o sábado com um culto breve, em família.\n• Test. 6, p. 357-358: no culto de pôr do sol, “saudaremos a Jesus como hóspede bem-vindo em nosso lar e coração”.
• O documento oficial: casamentos e festas, “incluindo seus devidos preparativos, devem ser realizados fora desse período sagrado”; e algumas festas mais suntuosas “não devem ser planejados para os sábados à noite”, pois os preparativos “envolvem expectativas e atividades não condizentes com o espírito de comunhão com Deus”.`,
  practice: `• Amizade e convicção **não precisam brigar**. Diga com carinho o que você valoriza.\n• Ofereça algo concreto: entregar o presente **antes do pôr do sol**, um almoço só de vocês no domingo, ou convidar a Duda para o seu sábado.\n• Evite o sermão: fale de **você**, não dos erros dos outros.\n• Sim, pode doer: algumas amizades vão testar sua decisão. Outras vão te surpreender.\n• *No sábado à noite*, o dia já terminou no pôr do sol — mas o documento alerta que festas mais suntuosas não sejam planejadas para essa hora, porque os preparativos invadem o sábado. Faça a despedida (oração e louvor) antes de sair: o folder chama de “momento de transição”.`,
  faith: `Pela fé, você escolhe o **relacionamento com Deus** sem abandonar as **pessoas**. Jesus esteve com gente — e nunca abriu mão de quem Ele era.`,
  src: ['lv23', 'cf20', 'doc', 'tpi6_357b', 'tpi6_356', 'doc_festas'],
  dec: { title: 'Decisão de Fé · O Níver da Sexta', fields: [
    { id: 'msg', label: 'Minha mensagem para a Duda (carinhosa e firme)', ph: 'Duda, você é muito importante pra mim e…', min: 12, rows: 4 },
    { id: 'alt', label: 'A alternativa que ofereço (dia, hora, atividade)', ph: 'Ex.: entrego o presente às 17h e almoçamos domingo…', min: 5, rows: 2 },
    { id: 'plano', label: 'O que eu vou fazer na sexta à noite', ph: 'Ex.: culto de pôr do sol com a família e…', min: 6, rows: 2 }
  ] },
  pocket: `Mande a mensagem para a Duda **hoje** e marque algo com ela em outro horário.`
}),

dilemma({
  id: 'd4', num: 4, emoji: '📱', title: 'A Ofensiva', name: 'dilema-4-ofensiva',
  topic: 'Celular, streaks, séries e FOMO · o seu Modo Sábado', cast: ['gui'],
  setup: `É sábado de manhã e o celular não para.`,
  scene: [
    ['narr', `📱 *Notificação:* “Sua ofensiva de **412 dias** está em risco! Pratique hoje.”`],
    ['narr', `📸 *Notificação:* “Seu streak com 3 amigos vence hoje.”`],
    ['gui', `bora ver a série nova hoje à tarde? saiu a 2ª temporada completa 🍿`],
    ['gui', `e o grupo da turma vai bombar de meme. quem fica offline perde tudo kkk`]
  ],
  q1: `É sábado de manhã. **O que você faz?** Descreva.`,
  mid: [
    ['gui', `relaxa, é só abrir 1 minutinho pra salvar o streak`],
    ['gui', `ficar 24h sem celular é impossível kkkk você vai surtar`]
  ],
  q2: `Tente de novo: **dá para ficar sem?** O que você diria ao Gui — e a si mesmo(a)?`,
  theory: `• Folder: “A Mídia (TV, rádio, computador, internet, celular, jogos eletrônicos, DVD's, etc.) deve ficar desativada durante as horas do sábado, a menos que esteja relacionada com assuntos religiosos.”\n• Folder: “Guarde em locais que não desperte a sua atenção as revistas, jornais e músicas seculares.”\n• Neemias mandou fechar os portões **antes** de o sábado começar (Ne 13:19): o preparo vem **antes** da tentação.
• O documento oficial: “A mídia secular, em todas as suas formas, deve ser deixada de lado durante as horas do sábado, para que este, rompendo com a rotina da vida, possa ser um dia ‘deleitoso e santo’” (Is 58:13).`,
  practice: `• Crie um **Modo Sábado**: no iPhone, *Foco*; no Android, *Não perturbe/Modos*. Programe de **sexta no pôr do sol** até **sábado no pôr do sol**.\n• Deixe uma **resposta automática**: *“Hoje é sábado: respondo à noite 🌅”.* Seus amigos aprendem — e muitos respeitam.\n• **Use a tela para Deus**: hinos, Bíblia, lição da Escola Sabatina, uma mensagem de ânimo a alguém — o folder abre exceção para o que “esteja relacionada com assuntos religiosos”.\n• Perder a ofensiva tem custo — **pequeno** e visível. O que você ganha também é real: presença.
• O documento vai além da tela: o compromisso com as prioridades espirituais deve ser mantido “na escolha dos assuntos abordados também em nossos diálogos informais com familiares e amigos”.`,
  faith: `A pergunta que importa: **quem manda em quem?** Pela fé, você escolhe parar — e pode descobrir que o mundo continua girando sem você por 24 horas.`,
  src: ['folder', 'decl_198', 'ne13', 'tpi6_354', 'doc_midia', 'doc_comun'],
  dec: { title: 'Decisão de Fé · Meu Modo Sábado', fields: [
    { id: 'regras', label: 'As regras do meu Modo Sábado (horário, o que fecha, o que fica liberado)', ph: 'De sexta no pôr do sol até sábado no pôr do sol: fecho… e deixo liberado…', min: 15, rows: 4 },
    { id: 'auto', label: 'Minha resposta automática para os amigos', ph: 'Ex.: Hoje é sábado: respondo à noite 🌅', min: 4, rows: 2 },
    { id: 'tempo', label: 'O que vou fazer com o tempo que sobrar', ph: 'Ex.: caminhar, ler, ligar para a vovó…', min: 6, rows: 2 }
  ] },
  pocket: `Programe o Foco/Não perturbe “Sábado” **agora** (leva 2 minutos) e teste na próxima sexta.`
}),

dilemma({
  id: 'd5', num: 5, emoji: '🧢', title: 'A Vaga', name: 'dilema-5-vaga',
  topic: 'Primeiro emprego ou bico com escala de sábado', cast: ['marcos'],
  setup: `Depois de uma entrevista de primeiro emprego, chega uma mensagem.`,
  scene: [
    ['marcos', `Oi {nick}, tudo bem? Aqui é o Marcos, da loja de material esportivo.`],
    ['marcos', `Gostei muito da sua entrevista! A vaga é de ajudante, pagamento bom + vale-transporte 👍`],
    ['marcos', `Só um detalhe: **sábado é o dia mais movimentado**. Preciso de todo mundo das 8 às 14h.`],
    ['marcos', `Consegue começar semana que vem?`]
  ],
  q1: `É a sua chance. **O que você responde ao Seu Marcos?**`,
  mid: [
    ['marcos', `Olha, tem outros 5 candidatos na fila. Se não pode no sábado, vou chamar outro.`],
    ['narr', `💸 Sua família está apertada este mês. Esse dinheiro ajudaria bastante.`]
  ],
  q2: `A pressão é real — e o motivo é bom. **Qual é a sua resposta agora?**`,
  theory: `• DTN, p. 207: “A lei proíbe trabalho secular no dia de repouso do Senhor” — e as **obras de misericórdia combinam** com o sábado (Mt 12:12; *Beneficência Social*, p. 77).\n• Jesus ensinou a colocar o Reino de Deus **em primeiro lugar** (Mt 6:33).
• O documento oficial: os adventistas do sétimo dia “devem escolher e exercer profissões condizentes com a devida observância do sábado”, e “devem se abster de trabalhar nesse dia, mesmo em instituições seculares de serviços básicos”.`,
  practice: `• **Converse antes de aceitar**: pergunte se há escala sem sábado, troca por domingo ou outro horário.\n• Se você é **menor de idade**, decida junto com seus pais ou responsáveis (contratos de adolescentes têm regras próprias).\n• Peça orientação do **pastor ou líder JA**: eles já viram isso muitas vezes.\n• Procure alternativas: vagas compatíveis, bicos em outros dias, trabalhos por projeto.\n• Cuide do “porquê”: não é birra — é **lealdade**.
• Pense no longo prazo: o documento pede escolher profissões e escalas **compatíveis com o sábado**. Vale conversar com seus pais e líder já na hora de escolher curso e carreira.`,
  faith: `Fé não é fingir que o problema não existe: a família está apertada e isso pesa. Fé é fazer a **sua parte** (procurar, negociar, orar) e confiar que Deus não te deixa sozinho(a) — mesmo que a resposta demore.`,
  src: ['dtn_207', 'mt12', 'bs_77', 'mt6', 'doc_prof', 'doc_serv'],
  dec: { title: 'Decisão de Fé · A Vaga', fields: [
    { id: 'resp', label: 'A mensagem que vou mandar ao Seu Marcos', ph: 'Seu Marcos, obrigado(a) pela oportunidade. Eu guardo o sábado e…', min: 15, rows: 4 },
    { id: 'neg', label: 'O que vou propor ou negociar', ph: 'Ex.: trabalhar domingo e feriados, ou…', min: 6, rows: 2 },
    { id: 'quem', label: 'Com quem vou conversar antes de decidir', ph: 'Ex.: meus pais e o pastor', min: 3, rows: 1 }
  ] },
  pocket: `Converse com seus pais ou responsáveis e com o líder JA **antes** de responder.`
}),

dilemma({
  id: 'd6', num: 6, emoji: '🤔', title: 'O Debate do Grupo', name: 'dilema-6-debate',
  topic: 'Testemunho: explicar o sábado com a Bíblia, com mansidão', cast: ['leo', 'bia'],
  setup: `No grupo da turma, alguém resolve perguntar sobre a sua fé — na frente de todos.`,
  scene: [
    ['leo', `pessoal, pergunta séria: por que o {nick} não vem nos rolês de sábado?`],
    ['leo', `ele é adventista, guarda o sábado kkk`],
    ['leo', `mas Jesus ressuscitou no **domingo**, né? isso não mudou tudo?`],
    ['leo', `sábado é coisa do Antigo Testamento, no Novo já acabou 🤷`],
    ['bia', `verdade, nunca entendi isso 👀 explica aí, {nick}`]
  ],
  q1: `A turma toda está olhando. **Escreva sua resposta** — educada, firme e com a Bíblia (até 3 mensagens).`,
  mid: [
    ['leo', `hmm, interessante. mas então vocês acham que quem vai no domingo vai pro inferno??`]
  ],
  q2: `A pergunta ficou pesada. **Como você responde com mansidão e verdade?**`,
  theory: `• Instituído na **Criação**, antes de Israel existir (Gn 2:1-3). Jesus: “o sábado foi feito por causa do homem” (Mc 2:27).\n• **Depois da cruz**, as mulheres descansaram no sábado “segundo o mandamento” (Lc 23:54-56).\n• Paulo seguia o costume de ir à sinagoga no sábado (At 17:2). Jesus falou do sábado num tempo futuro (Mt 24:20). Na nova terra haverá sábados (Is 66:22-23).\n• Hb 4:9: “resta ainda um repouso para o povo de Deus”.\n• A salvação é pela **graça**, não por um dia (Ef 2:8-9); o sábado é símbolo dessa redenção (Crença Fundamental 20).
• O documento oficial afirma que a observância do sábado “é pertinente a todos os seres humanos em todas as épocas e lugares” (Is 56:1-7; Mc 2:27) e que Paulo usava o sábado para persuadir “tanto judeus como gregos” (At 18:4, 11; 17:2).`,
  practice: `• Estrutura simples: **valorizo** (respeito sua fé) → **explico** (o que eu entendo da Bíblia) → **convido** (“quer estudar junto?”).\n• Nada de atacar igrejas ou pessoas: responda com “mansidão e temor” (1 Pe 3:15).\n• Sobre a ressurreição: os adventistas entendem que ela não revogou o 4º mandamento e que o texto bíblico não registra uma ordem de troca do dia.\n• Se não souber, **diga**: *“boa pergunta, vou estudar e te respondo”*. Isso é maturidade, não derrota.`,
  faith: `Testemunho não é ganhar o debate. É deixar claro **por Quem** você guarda o sábado — com um sorriso, não com um soco.`,
  src: ['gn2', 'mc2', 'lc23', 'at17', 'mt24', 'is66', 'hb4', 'ef2', 'pe3', 'cf20', 'doc_intro', 'doc_missao'],
  dec: { title: 'Decisão de Fé · Minha Resposta', fields: [
    { id: 'resp', label: 'Minha resposta final ao grupo (cordial e bíblica)', ph: 'Léo, obrigado por perguntar! Eu guardo o sábado porque…', min: 15, rows: 4 },
    { id: 'texto', label: 'O texto-chave que vou memorizar (referência)', ph: 'Ex.: Marcos 2:27', min: 2, rows: 1 },
    { id: 'duvida', label: 'Uma pergunta que eu ainda não sei responder (vou levar ao meu líder)', ph: 'Ex.: Como explicar Colossenses 2:16?', min: 3, rows: 2, park: true }
  ] },
  pocket: `Memorize o texto-chave e converse com seu líder sobre a dúvida que ficou.`
}),

dilemma({
  id: 'd7', num: 7, emoji: '🏠', title: 'Sábado Sem Plateia', name: 'dilema-7-sozinho',
  topic: 'Convicção pessoal: o que você faz quando ninguém está olhando', cast: [],
  setup: `Este dilema é só entre você e Deus.`,
  scene: [
    ['narr', `Sábado, **14h30**. Seus pais viajaram e só voltam à noite. A Escola Sabatina e o culto já passaram.`],
    ['narr', `O Wi-Fi está ali. O console também. **Ninguém vai saber.**`],
    ['neemias', `Isso aqui não é um teste de “quem pega você”. É sobre **quem você é quando ninguém está olhando**. 👀`]
  ],
  q1: `Escreva o que passa pela sua cabeça — e o que você faz nas **próximas 3 horas**.`,
  mid: [
    ['neemias', `Pergunta honesta, sem enfeite: **por que você guarda o sábado?** Por medo, por hábito ou por amor?`]
  ],
  q2: `Responda com sinceridade: **medo, hábito ou amor?** Por quê?`,
  after: `Qualquer das três respostas é um ponto de partida honesto. O objetivo é caminhar **em direção ao amor** — e isso é obra de Deus em você, não só esforço seu.`,
  theory: `• DTN, p. 283: “a fim de santificar o sábado, os homens precisam ser eles próprios santos. Devem, pela fé, tornar-se participantes da justiça de Cristo.”\n• Jo 14:15: “Se me amais, guardareis os meus mandamentos” — a obediência é **resposta**, não moeda de troca.\n• Test. 6, p. 358: “Abandonadas a si mesmas, as crianças em breve ficam inquietas” — o vazio sem plano pesa em **qualquer idade**.
• O documento oficial: “não devemos permitir que outras atividades, por mais nobres que sejam, enfraqueçam nossa comunhão com Deus nesse dia” — e pede “um prazeroso e alegre compromisso com as prioridades espirituais, com momentos especiais de leitura da Bíblia, oração e, se possível, de contato com a natureza”.`,
  practice: `• **Tédio = falta de plano**, não prova de que o sábado é chato.\n• Monte sua **Caixa do Sábado**: leitura separada, playlist de louvor, jogo bíblico, caminhada na natureza (*Conselhos Sobre Saúde*, p. 165), uma visita ou ligação a alguém (obra de misericórdia).\n• Combine um **parceiro de sábado**: alguém a quem você manda mensagem quando bater a vontade de desistir.\n• Se falhar: confesse e recomece (1 Jo 1:9). A graça não está de folga no sábado.`,
  faith: `Convicção não é o que você faz **na frente** dos outros. É o que você escolhe quando só Deus está olhando — e ainda assim descobre que não está sozinho(a).`,
  src: ['dtn_283', 'jo14', 'tpi6_358', 'csa_165', 'jo1', 'folder', 'doc_cresc', 'doc_comun'],
  dec: { title: 'Decisão de Fé · Sábado Sem Plateia', fields: [
    { id: 'plano', label: 'Meu plano de 3 atividades para uma tarde de sábado sozinho(a)', ph: '1) … 2) … 3) …', min: 12, rows: 4 },
    { id: 'gatilho', label: 'Se a tentação bater, eu vou…', ph: 'Ex.: mandar mensagem para meu parceiro de sábado e sair para caminhar…', min: 8, rows: 2 },
    { id: 'porque', label: 'Meu porquê em uma frase', ph: 'Eu guardo o sábado porque…', min: 5, rows: 2 }
  ] },
  pocket: `Monte sua **Caixa do Sábado** (leitura, hinos, atividades) até sexta.`
}),

/* ---------- FASE 5 · CHEFÃO ---------- */
{ id: 'chefao-plano', cat: 'f5', name: 'chefao-plano', title: 'Meu Sábado em Primeira Pessoa',
  topic: 'Monte o seu plano: sexta, pôr do sol, sábado e Modo Sábado', pins: ['folder', 'doc', 'tpi6_354', 'tpi6_357b'], reward: 60,
  steps: [
    say('neemias', `**Fase 5 · Chefão** 👑\nChegou a hora de montar o **seu** sábado — do pôr do sol de sexta ao pôr do sol de sábado. São **quatro blocos curtos**. Seja específico(a): **horário, gente, lugar**.`),
    ask({ id: 'p1', kind: 'list', xp: 50, need: 3, minWords: 8, bonus: /(\d{1,2}\s*(h|hr|:)|hora|por do sol)/,
      text: `🌅 **Bloco 1 · Sexta.** Liste **3 coisas** que você deixa prontas e **a que horas** você “fecha os portões” (para atividades seculares e celular).`,
      ph: 'Ex.: roupa, comida; portões 17h…',
      react: `Ótimo. Quem chega na sexta com tudo pronto entra no sábado **descansado(a)** — e sem correria.` }),
    ask({ id: 'p2', kind: 'concept', xp: 50, minWords: 8,
      text: `🕯️ **Bloco 2 · Culto de pôr do sol.** Quem participa e quais **3 elementos** ele terá (música, leitura, oração, dinâmica, convidado…)?`,
      concepts: [CI('3 elementos', [
        /(hino|cant|music|louvor|violao)/, /(biblia|texto|versiculo|leitura|ler|espirito de profecia|paragrafo)/,
        /(oracao|orar|agradec|gratidao)/, /(dramatiz|historia|teatro|encena)/, /(convid|amig|visita)/,
        /(surpresa|lembranca|recordacao|presente)/, /(abraco|feliz sabado|beijo)/, /(experienc|compartilh|testemunho)/
      ], 3)], full: .99,
      hint: `Ex.: um hino, um texto lido por cada um, uma oração de gratidão e um abraço no final.`,
      model: `Um culto de pôr do sol simples já funciona: **cantar**, **ler** um texto, **agradecer** por algo da semana e **orar**; para surpreender, **dramatize** uma história, convide um amigo e feche com um abraço (“feliz sábado”).`,
      src: ['folder', 'tpi6_357b'] }),
    ask({ id: 'p3', kind: 'concept', xp: 60, minWords: 14,
      text: `🌿 **Bloco 3 · Sábado.** Escreva seu roteiro: **manhã** (igreja), **tarde** (atividades com gente ou natureza) e **1 ato de misericórdia** bem concreto.`,
      concepts: [
        C('manhã na igreja (Escola Sabatina e culto)', /(igreja|escola sabatina|culto|manha)/),
        C('tarde com gente ou natureza', /(tarde|almoc|natureza|trilha|parque|visita|amig|famili|passeio)/),
        C('ato de misericórdia', /(misericord|visit|ajud|doa|ouvir|consol|servi|mensagem|hospital|idos)/)
      ], full: .66,
      hint: `Três partes: manhã → tarde → misericórdia. Cite lugar, pessoa e horário.`,
      model: `Um roteiro completo tem: **manhã** (Escola Sabatina e culto, com a lição estudada), **tarde** (almoço simples com gente querida e um passeio ou visita) e **um ato de misericórdia** com nome e endereço — por exemplo, visitar alguém ou ligar para quem está só.`,
      src: ['folder', 'bs_77'] }),
    ask({ id: 'p4', kind: 'reflect', xp: 50, minWords: 15,
      text: `📱 **Bloco 4 · Modo Sábado e dilemas.** Resuma as regras do seu Modo Sábado e diga **qual dilema da Fase 4 foi o mais difícil** para você — e o que fará de diferente.`,
      ph: 'Meu Modo Sábado: … Dilema: …',
      react: `Isso é maturidade: saber onde você é mais frágil **antes** de o teste chegar.` }),
    { t: 'plan' }
  ] },

{ id: 'chefao-compromisso', cat: 'f5', name: 'chefao-compromisso', title: 'Compromisso de Fé',
  topic: 'A sua decisão, o seu porquê e o check-in final', pins: ['dtn_283', 'jo14', 'ef2'], reward: 150,
  steps: [
    say('neemias', `Última etapa. Esta é a sua **decisão** — para você e para Deus. 🕊️\nSem pressa e sem teatro: escreva o que é **verdadeiro hoje**.`),
    { t: 'summary' },
    ask({ id: 'c1', kind: 'reflect', xp: 60, minWords: 10, pledge: 'decide',
      text: `Complete com o que for verdadeiro: **“Pela fé, eu decido que…”**`,
      ph: 'Pela fé, eu decido que…',
      react: `Registrado. Lembre: fé não é sentimento de força — é **dar o passo antes de ver o resultado**. 🕊️` }),
    ask({ id: 'c2', kind: 'reflect', xp: 40, minWords: 6, pledge: 'why',
      text: `Qual é o **seu porquê** em **uma frase**? (Por que guardar o sábado?)`,
      ph: 'Eu guardo o sábado porque…',
      react: `Guarde essa frase. Quando bater o cansaço, ela vale mais que qualquer regra.` }),
    ask({ id: 'c3', kind: 'reflect', xp: 40, minWords: 6, final: true,
      text: `**Check-in final:** em uma ou duas frases, o que o sábado significa pra você **agora**?`,
      ph: 'Hoje, o sábado significa…' }),
    { t: 'compare' },
    { t: 'pledge' }
  ] },

/* ---------- SEMPRE ABERTOS ---------- */
{ id: 'ranking', cat: 'free', name: 'ranking', title: 'Ranking', kind: 'rank', serverOnly: true,
  topic: 'Constância vale mais que pressa · só apelido, cargo e XP aparecem',
  pins: [],
  steps: [
    say('neemias', `Aqui está o **ranking** do grupo. 🏆 Ele mostra só **apelido, cargo, XP e sábados guardados**. As suas respostas ficam **só no seu aparelho**: ninguém vê, nem o líder.\nNo ranking de **constância**, quem guarda o sábado toda semana sobe — não precisa ser o mais rápido.`)
  ] },

{ id: 'pergunte', cat: 'free', name: 'pergunte-ao-neemias', title: 'Pergunte ao Neemias', kind: 'qa',
  topic: 'Pergunte qualquer coisa sobre o sábado · respostas só com base nas fontes', pins: ['folder', 'doc', 'cf20'],
  steps: [
    say('neemias', `Aqui você pergunta o que quiser sobre o sábado. 🙋\nRespondo **só com base nas fontes do servidor** (Bíblia, Igreja e folder). Quando eu **não tiver fonte segura**, vou dizer isso — e anotar a pergunta no seu **caderno** para você levar ao pastor ou líder.`, { c: { t: 'qchips' } })
  ] },

{ id: 'missao', cat: 'free', name: 'missao-da-semana', title: 'Missão da semana', kind: 'board',
  topic: 'Pratique pela fé: checklist do seu sábado + diário', pins: ['folder', 'doc', 'tpi6_354'],
  steps: [
    say('neemias', `Conhecimento sem prática é só decoração. 😉 Esta é a **sua missão desta semana**: marque cada item *depois* de fazer de verdade (palavra de honra!).\nNo fim do sábado, volte e escreva no **diário** aqui no chat: *O que foi mais gostoso? O que foi mais difícil? O que você vai repetir?*`)
  ] }

];

/* ---------- montagem ---------- */
const CH = [...CH_A, ...CH_B];
const CHM = Object.fromEntries(CH.map(c => [c.id, c]));
const CATS = [
  { id: 'start', t: 'Comece aqui' },
  { id: 'f1', t: 'Fase 1 · Origem' },
  { id: 'f2', t: 'Fase 2 · Jesus e o sábado' },
  { id: 'f3', t: 'Fase 3 · Como guardar' },
  { id: 'f4', t: 'Fase 4 · Dilemas' },
  { id: 'f5', t: 'Fase 5 · Chefão' },
  { id: 'free', t: 'Sempre abertos' }
];
const SEQ = ['boas-vindas', '1-criacao', '1-sinal', '1-quiz', '2-jesus', '2-deleite', '2-quiz', '3-sexta', '3-manha', '3-tarde', '3-modo', '3-documento', '3-despedida', '3-quiz'];
const F4 = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'];

const WEEK_ITEMS = [
  { id: 'w1', e: '🌅', t: 'Preparei roupa, comida e ofertas antes do pôr do sol de sexta', xp: 20 },
  { id: 'w2', e: '🔒', t: 'Ativei o Modo Sábado no celular (sexta → sábado, pôr do sol)', xp: 25 },
  { id: 'w3', e: '🕯️', t: 'Fiz o culto de pôr do sol (com família ou amigo)', xp: 25 },
  { id: 'w4', e: '⛪', t: 'Fui à Escola Sabatina e ao culto — e participei de verdade', xp: 25 },
  { id: 'w5', e: '🤝', t: 'Fiz 1 ato de misericórdia (visita, mensagem, ajuda)', xp: 25 },
  { id: 'w6', e: '🌿', t: 'Passei a tarde com gente e/ou na natureza', xp: 20 },
  { id: 'w7', e: '🌇', t: 'Fiz a despedida do sábado e planejei a semana', xp: 20 }
];

/* ============================================================
   FAQ · base de conhecimento do canal #pergunte-ao-neemias
   k  = palavras-chave "radical:peso" separadas por espaço (_ = espaço). Casam no início de palavra.
   a  = resposta (markdown simples). src = ids de SRC. rel = ids de perguntas relacionadas.
   Regra de ouro: só responder com base nas fontes; quando não houver, dizer isso.
   ============================================================ */
const FAQ = [
  { id: 'oque', q: 'O que é o sábado?', k: 'significa:2 significado:3 que_e_o_sabado:4 oque_e:3 conceito:2 definicao:3 sentido:2 importancia:2 importa:1',
    a: `O sábado é o **sétimo dia da semana**, que Deus abençoou e santificou na Criação (Gn 2:1-3). Para a Igreja Adventista, é um **dia de descanso, adoração e ministério**, de comunhão com Deus e com as pessoas, **símbolo da nossa redenção em Cristo**, sinal de santificação e de lealdade (Crença Fundamental 20).`,
    src: ['gn2', 'cf20', 'doc'], rel: ['sinal', 'judeus'] },

  { id: 'domingo', q: 'Por que sábado e não domingo? E a ressurreição?', k: 'domingo:3 ressurre:3 ressuscit:3 mudou:2 mudanca:2 troc:2 muda:1 dia_certo:2 qual_dia:2 sabado_ou:2',
    a: `Os adventistas entendem que: (1) o sábado foi instituído na **Criação** (Gn 2:1-3) e o 4º mandamento fala expressamente do **sétimo dia** (Êx 20:8-11); (2) Jesus o guardou (Lc 4:16); (3) **depois da cruz**, as mulheres descansaram “no sábado, segundo o mandamento” (Lc 23:54-56); (4) Paulo ia à sinagoga no sábado “segundo o seu costume” (At 17:2).\n\nNa leitura adventista, a ressurreição não revogou o 4º mandamento, e a Bíblia não registra uma **ordem** de troca do dia. Respeite quem pensa diferente: você explica, não ataca (1 Pe 3:15).`,
    src: ['gn2', 'ex20', 'lc4', 'lc23', 'at17', 'pe3'], rel: ['judeus', 'salvacao'] },

  { id: 'judeus', q: 'O sábado é só para judeus? Não acabou no Antigo Testamento?', k: 'judeu:3 judaic:3 judaismo:3 israel:2 so_pra:2 antigo_testamento:3 velho_testamento:3 antigo:2 abolid:2 acabou:2 fim_da_lei:3 novo_testamento:2',
    a: `Na leitura adventista, **não**. O sábado nasceu na **Criação** (Gn 2:1-3), muito **antes de Israel existir**. Jesus disse que “o sábado foi feito por causa do homem” (Mc 2:27) — da humanidade. Isaías fala de **estrangeiros** que guardam o sábado (Is 56:6-7) e da **nova terra**, onde haverá sábados (Is 66:22-23). O documento oficial diz que a observância “é pertinente a todos os seres humanos em todas as épocas e lugares” (Is 56:1-7; Mc 2:27).`,
    src: ['gn2', 'mc2', 'is56', 'is66', 'doc_intro'], rel: ['domingo', 'sinal'] },

  { id: 'inicio', q: 'Quando o sábado começa e termina?', k: 'comeca:3 termina:3 horario:2 por_do_sol:2 pordosol:2 entardecer:3 anoitecer:2 inicio:2 acaba:2 comeco:2 quando_comeca:3 que_horas:3',
    a: `O sábado vai **de pôr do sol a pôr do sol**: começa quando o sol se põe na **sexta** e termina quando se põe no **sábado** (Lv 23:32; Crença Fundamental 20). O horário muda conforme a cidade e a época — pesquise “horário do pôr do sol” na sua cidade. O documento oficial remete a Lv 23:32, Dt 16:6 e Ne 13:19 e sugere **cultos de pôr do sol breves e atrativos**, em família, para abrir e encerrar o dia.`,
    src: ['lv23', 'cf20', 'doc'], rel: ['sexta', 'culto'] },

  { id: 'sexta', q: 'O que fazer na sexta? (preparação)', k: 'sexta:3 prepara:3 preparacao:3 preparar:2 vespera:2 deixar_pronto:3',
    a: `A sexta é o **dia de preparação** (Test. 6, p. 354; Êx 16:23). O documento oficial pede que, antes do pôr do sol, as atividades seculares sejam interrompidas; a casa esteja **limpa e arrumada**; as roupas, **lavadas e passadas**; os alimentos, **providenciados**; e os membros da família, **já prontos**.

Sugestões do folder: planejar a rotina para a sexta não ficar exaustiva; **dividir tarefas** da casa; separar **roupa e calçado**; preparar as **ofertas**; preparar-se **espiritualmente**; e, na tarde de sexta, **deixar as preocupações da semana de fora**.`,
    src: ['tpi6_354', 'ex16', 'doc_prep', 'folder'], rel: ['inicio', 'roupa'] },

  { id: 'trabalho', q: 'Posso trabalhar, estudar ou fazer lição de casa no sábado?', k: 'trabalh:3 emprego:3 estagio:3 estudar:2 licao_de_casa:3 tarefa:3 dever:2 secular:3 servico:2 bico:3 freela:3 atividade_secular:3',
    a: `O folder é claro: “Nenhum dever relacionado com os seis dias anteriores será deixado para o sábado” (Test. 6, p. 354). **Planeje a semana** para terminar trabalhos e lições até a sexta.

O documento oficial vai além: o quarto mandamento “desabona a realização de atividades seculares no sábado, que gerem lucro ou benefício material”, e isso inclui “a frequência às aulas e a participação em estágios, simpósios, seminários e palestras de cunho profissional, concursos públicos e exames seletivos”. Os observadores do sábado “devem se abster de trabalhar nesse dia, mesmo em instituições seculares de serviços básicos”.

**Obras de misericórdia** e emergências são diferentes de trabalho comum (Mt 12:12; *Beneficência Social*, p. 77). Para provas e aulas, veja **prova no sábado**; para escolha de carreira, veja **profissão**.`,
    src: ['tpi6_354', 'doc_estag', 'doc_serv', 'bs_77', 'mt12'], rel: ['prova', 'profissao', 'misericordia'] },

  { id: 'prova', q: 'Tenho prova, aula ou vestibular no sábado. E agora?', k: 'prova:3 vestibular:3 enem:3 simulado:3 aula:2 escola:2 colegio:2 faculdade:2 concurso:3 coordenacao:3 reposicao:3 lei$:2 direito:2 nota:1 exame:3 confinamento:4',
    a: `Duas camadas:

**1) A orientação da Igreja.** O documento oficial inclui entre as atividades seculares inadequadas para o sábado “a frequência às aulas e a participação em estágios, simpósios, seminários e palestras de cunho profissional, concursos públicos e exames seletivos”. Se o exame exigir **confinamento** depois do fim do sábado, “as horas desse dia devem ser gastas em atividades espirituais”.

**2) O que a lei brasileira permite.** A **Lei 13.796/2019** acrescentou o **art. 7º-A à LDB**: o aluno de instituição pública ou privada pode, mediante **requerimento prévio e motivado** (pedido feito com antecedência, explicando o motivo religioso), faltar a prova ou aula em dia de guarda religiosa, e a escola oferece uma **prestação alternativa** (prova/aula de reposição ou trabalho), sem custo para o aluno. Há exceções (por exemplo, o ensino militar).

⚠️ Isto **não é orientação jurídica**: confira o texto oficial da lei e converse com seus responsáveis e com a coordenação. Para concursos e vestibulares externos, valem as regras do edital: fale com a organizadora com antecedência.`,
    src: ['doc_estag', 'lei'], rel: ['trabalho', 'profissao'] },

  { id: 'celular', q: 'Posso usar celular, jogos, séries e redes sociais?', k: 'celular:3 jogo:2 jogar:2 videogame:3 game:3 serie:3 filme:2 tv$:2 televisao:2 internet:2 redes_sociais:3 rede_social:3 instagram:3 tiktok:3 youtube:3 netflix:3 whatsapp:2 midia:3 tela:3 streaming:3 discord:3 console:3 musica:2',
    a: `O documento oficial diz: “A mídia secular, em todas as suas formas, deve ser deixada de lado durante as horas do sábado, para que este, rompendo com a rotina da vida, possa ser um dia ‘deleitoso e santo’” (Is 58:13).

O folder detalha: “A Mídia (TV, rádio, computador, internet, celular, jogos eletrônicos, DVD's, etc.) deve ficar desativada durante as horas do sábado, a menos que esteja relacionada com assuntos religiosos.” E sugere guardar “revistas, jornais e músicas seculares” longe da vista.

Na dúvida, use a pergunta-chave: “**Esta atividade me leva a compreender melhor a verdadeira e sagrada natureza do sábado?**” (*Declarações da Igreja*, p. 198). Dica prática: crie um **Modo Sábado** no celular (Foco/Não perturbe) e use a tela para hinos, Bíblia e a lição.`,
    src: ['doc_midia', 'folder', 'decl_198'], rel: ['esporte', 'tarde'] },

  { id: 'restaurante', q: 'Posso comer fora ou pedir delivery?', k: 'restaurante:3 comer_fora:3 lanchonete:2 pizza:2 almoco_fora:3 fast_food:3 delivery:3 ifood:3 pedir_comida:3 shopping:1',
    a: `O documento oficial é direto: o alimento deve ser providenciado com antecedência, o que “significa que ele deve ser comprado fora das horas do sábado, e que a frequência a restaurantes comerciais nesse dia deve ser evitada” (seção *Restaurantes e alimentação*).

Sobre **delivery**, o documento não fala; o princípio (alimento providenciado antes, compra fora das horas do sábado) aponta para evitar. Converse com seus pais e líder.`,
    src: ['doc_rest'], rel: ['comida', 'viagem', 'compras'] },

  { id: 'viagem', q: 'Posso viajar ou ir a um passeio no sábado?', k: 'viaj:3 viagem:3 passeio:2 onibus:2 aviao:2 estrada:2 aeroporto:2',
    a: `O documento oficial diz que “a realização de viagens por questões de trabalho ou interesses particulares é imprópria para o sábado”, com **exceções**: “compromisso religioso ou situações emergenciais”. E pede que, sempre que possível, os preparativos — “incluindo a compra de passagens e o abastecimento de combustível” — sejam feitos “com a devida antecedência”.

Ellen White: “Pode ser necessário viajar no sábado; mas sempre que possível devemos, no dia anterior, comprar a passagem e fazer todos os arranjos necessários” (Test. 6, p. 359-360). O folder sugere **evitar viagens longas e cansativas** e **planejar viajar na sexta**.

Para **excursões e acampamentos**, veja a pergunta própria.`,
    src: ['doc_viagem', 'tpi6_359', 'folder'], rel: ['excursao', 'restaurante'] },

  { id: 'compras', q: 'Posso fazer compras, comprar remédio ou ir ao shopping?', k: 'compra:3 comprar:3 shopping:3 loja:2 mercado:2 farmacia:3 remedio:3 medicamento:3 vender:2 comercio:3 gastar:2',
    a: `O folder orienta: “A compra de alimento ou medicamento para atender as necessidades deve ser feita durante a semana, exceto emergências.” O documento oficial confirma: o alimento deve ser “comprado fora das horas do sábado”; e sobre remédios, a compra é aceitável “em situações emergenciais” e “imprópria quando a pessoa já os necessitava, e acabou postergando sua compra para esse dia”.

Neemias enfrentou o comércio no sábado e agiu antes que ele começasse (Ne 13:15-22). Para **shopping**, as fontes não trazem uma lista de “pode/não pode”; use o **teste do sábado** e lembre que, segundo o documento, “muitas atividades esportivas e de lazer, aceitáveis durante a semana, não são condizentes com a observância do sábado”. Converse com seus pais e líder.`,
    src: ['folder', 'doc_rest', 'doc_med', 'doc_esporte', 'ne13', 'decl_198'], rel: ['restaurante', 'misericordia'] },

  { id: 'esporte', q: 'Posso jogar bola, praticar esportes ou disputar campeonato?', k: 'esporte:3 bola:3 futebol:3 volei:3 basquete:3 campeonato:3 treino:2 academia:2 correr:2 corrida:2 natacao:2 competi:3 time$:2 jogo_da_escola:3 lazer:3 diversao:2',
    a: `O documento oficial da Divisão Sul-Americana trata disso em **Esportes e lazer**: “Muitas atividades esportivas e de lazer, aceitáveis durante a semana, não são condizentes com a observância do sábado, pois desviam a mente das questões espirituais” (Is 58:13). Repare no “**muitas**”: o critério é o que a atividade faz com a sua **mente**.

Do outro lado, o folder **incentiva** passeios ao ar livre com família, amigos e igreja, em contato com a natureza, e o documento também fala em “contato com a natureza” como parte do espírito de comunhão (At 16:13). Use o **teste do sábado** (“Esta atividade me leva a compreender melhor a verdadeira e sagrada natureza do sábado?” — *Declarações da Igreja*, p. 198) e, na dúvida — principalmente se envolver campeonato ou compromisso com time —, converse com seu pastor ou líder.`,
    src: ['doc_esporte', 'doc_comun', 'csa_165', 'decl_198'], rel: ['celular', 'natureza', 'festas'] },

  { id: 'dormir', q: 'Posso dormir até tarde no sábado?', k: 'dorm:3 sono:3 acordar:2 preguica:3 cochilo:2 soneca:2 cama:2 tarde_demais:2 descansar:2',
    a: `O documento oficial é firme: a Bíblia define o sábado como dia de “repouso solene” (Êx 31:15), “e não como dia de recuperar o sono atrasado da semana. Ricas bênçãos advirão de levantar cedo no sábado, dedicando esse dia ao serviço do Senhor” (seção *Horas de sono*; ver *Conselhos Sobre a Escola Sabatina*, p. 170).

Ellen White diz que “desagrada a Deus que os observadores do sábado durmam muito tempo no sábado”, porque o tempo santo deve ir também para o **culto** (Test. 2, p. 704). Isso não proíbe descansar (“saudável repouso”, DTN, p. 207): o ponto é **não** transformar o sábado no dia de dormir.

Dica do folder: depois do jantar de sexta, converse em família e **descanse mais cedo**; programe horário de levantar, café e saída para chegar **antes** do início dos serviços.`,
    src: ['doc_sono', 'css_170', 'tpi2_704', 'dtn_207', 'folder'], rel: ['roupa', 'sexta'] },

  { id: 'roupa', q: 'Que roupa usar no sábado?', k: 'roupa:3 vestir:3 vestuario:3 traje:3 tenis:2 bermuda:2 camiseta:2 chique:2 vestido:2 look:3 arrumar:2',
    a: `Dicas do folder: separe a **melhor roupa** para o sábado; ela deve ser **sóbria e de bom gosto**, não extravagante; **não faça da roupa um motivo de discussão**; e lembre que você está “indo ao encontro do Criador”.\n\nO princípio é **honrar a Deus**: nem vaidade, nem desleixo. Ellen White critica quem vai à igreja com a roupa “poeirenta e encardida” e “posta sobre o corpo de maneira negligente” (*Mensagens Escolhidas*, vol. 2, p. 475). Para ela, “o caráter de uma pessoa é julgado pelo aspecto de seu vestuário” (*Educação*, p. 248).

Na preparação de sexta, o documento oficial lembra de deixar as roupas “lavadas e passadas”.`,
    src: ['me2_475', 'edu_248', 'doc_prep', 'folder'], rel: ['dormir', 'escola_sabatina'] },

  { id: 'tarde', q: 'O que fazer à tarde? Estou entediado(a).', k: 'tarde:3 atividade:2 programa:2 ideia:2 tedio:3 chato:3 entediado:3 o_que_fazer:3 lazer:2 entretenimento:2 sem_o_que_fazer:3 passar_o_tempo:3',
    a: `Ideias do folder para a tarde: **visitas** de cortesia e estudo bíblico com um amigo; **passeios na natureza** com família e amigos; **almoço** com convidados e música cristã ao fundo; **jogos bíblicos** e DVDs cristãos; visitar a **igreja de um amigo**; participar da **programação missionária** da igreja; e **visitas a quem precisa** — o documento oficial cita enfermos, viúvas e órfãos, encarcerados —, lembrando que ações sociais que podem ser feitas em outro dia não devem tomar as horas do sábado.\n\nTédio costuma ser **falta de plano**: monte sua “Caixa do Sábado” antes de sexta.`,
    src: ['folder', 'csa_165', 'tpi6_358'], rel: ['natureza', 'amigos'] },

  { id: 'misericordia', q: 'Posso ajudar alguém doente ou em emergência no sábado?', k: 'doente:3 hospital:3 emergencia:3 ajudar:2 socorro:3 misericordia:3 cuidar:2 enfermo:3 medico:3 curar:3 urgencia:3 acidente:3 enfermeir:3',
    a: `Sim. Jesus curou no sábado e disse: “é lícito fazer o bem” (Mt 12:12). Ellen White escreve: “as obras de misericórdia e beneficência estavam em harmonia com o propósito do Senhor [...]. Aliviar os aflitos, confortar os tristes, é um trabalho de amor que faz honra ao dia de Deus” (*Beneficência Social*, p. 77).

O documento oficial acrescenta: “é lícito nas horas sagradas do sábado visitar enfermos, viúvas e órfãos, encarcerados e compartilhar uma refeição”, mas “ações sociais que podem ser realizadas em outro dia não devem tomar as sagradas horas do sábado”. Na saúde, as **emergências** são atendidas “com base no princípio de que ‘é lícito curar no sábado’”; já os “plantões rotineiros” em hospitais não adventistas “são impróprios para as horas do sábado”.

O folder lembra que remédios e alimentos devem ser comprados **durante a semana**, “exceto emergências”.`,
    src: ['mt12', 'bs_77', 'doc_assist', 'doc_saude', 'folder'], rel: ['trabalho', 'tarde', 'profissao'] },

  { id: 'escola_sabatina', q: 'O que é a Escola Sabatina?', k: 'escola_sabatina:4 escola_sabatica:4 licao:2 classe:2 estudo_da_biblia:2',
    a: `A Escola Sabatina “oferece a pais e filhos preciosa oportunidade para o estudo da Palavra de Deus”, e para aproveitá-la todos precisam “dedicar tempo ao estudo das lições” (*Conselhos Sobre a Escola Sabatina*, p. 41). Sugestões do folder: tenha a **assinatura da lição** para cada pessoa da família; incentive o **estudo pessoal** durante a semana; **saúde os visitantes**; e, ao entrar na igreja, faça uma **oração silenciosa**.`,
    src: ['css_41', 'folder'], rel: ['roupa', 'culto'] },

  { id: 'culto', q: 'Como fazer um bom culto de pôr do sol ou culto familiar?', k: 'culto:4 culto_familiar:5 adoracao_em_casa:3 devocional:2 familiar:2 oracao_em_familia:3 hinos:2',
    a: `O documento oficial recomenda “breves e atrativos cultos de pôr do sol, com a participação dos membros da família”, para abrir e para encerrar o sábado: “cantar alguns hinos, ler uma passagem bíblica, seguida de comentários pertinentes, e expressar gratidão a Deus em oração” (ver *Testemunhos Para a Igreja*, v. 6, p. 356-359).

Ideias do folder para variar: **cante vários hinos**; leia um parágrafo do Espírito de Profecia; **dramatize** uma história bíblica; dê a cada pessoa um **texto bíblico** para ler; cada um agradece por algo específico da semana; **convide amigos**; prepare uma **recordação-surpresa**; e feche com um abraço desejando “feliz sábado”.

Mantenha **curto e espiritual**, sem monotonia (*Orientação da Criança*, p. 521): com um pouco de cuidado, “o culto familiar pode tornar-se agradável” (*Signs of the Times*, 1884).`,
    src: ['doc_inicio', 'folder', 'oc_521', 'st_1884', 'tpi6_357b'], rel: ['inicio', 'amigos'] },

  { id: 'comida', q: 'O que comer ou cozinhar no sábado?', k: 'comida:3 comer:3 almoco:3 refeicao:3 cozinhar:3 jantar:2 cardapio:2 churrasco:2 lanche:2 receita:1',
    a: `“No sábado, não devemos aumentar a quantidade de alimento ou preparar maior variedade do que nos outros dias. Ao contrário, a refeição do sábado deve ser mais simples, e devemos comer menos, a fim de ter o espírito claro” (Test. 6, p. 357).\n\nO folder acrescenta: faça uma comida **simples, mas saborosa e atraente** (um prato especial é bem-vindo), convide amigos, tenha música instrumental cristã, conversem sobre o sermão e **todos ajudem** no preparo e na arrumação.`,
    src: ['tpi6_357', 'folder'], rel: ['restaurante', 'amigos'] },

  { id: 'salvacao', q: 'Guardar o sábado me salva? E se eu falhar?', k: 'salva:3 salvacao:3 salvo:3 perder_a_salvacao:4 falhei:3 falhar:3 errei:3 errar:3 culpa:3 pecado:2 perdoa:3 perdao:3 inferno:3 condena:3 legalismo:4 obrigacao:2 mereco:2',
    a: `A salvação é pela **graça**, mediante a fé em Cristo: “não vem de vós, é dom de Deus” (Ef 2:8-9). O documento oficial diz que os filhos de Deus observam o sábado “como uma importante expressão da justificação pela fé em Cristo” (Hb 4:4-11) e que a verdadeira observância “se fundamenta em uma vida santificada pela graça de Cristo”. O sábado é **símbolo da nossa redenção em Cristo** (Crença Fundamental 20), não um jeito de ganhar pontos. Obedecemos por **amor** (Jo 14:15).

Ellen White escreve que, para santificar o sábado, os homens devem, “pela fé, tornar-se participantes da justiça de Cristo” (DTN, p. 283).

E se você falhar? “Se confessarmos os nossos pecados, Ele é fiel e justo para nos perdoar” (1 Jo 1:9): **confesse, receba perdão e recomece**.`,
    src: ['ef2', 'doc_intro', 'doc_santif', 'cf20', 'jo14', 'dtn_283', 'jo1'], rel: ['sinal', 'pais'] },

  { id: 'sinal', q: 'O que significa o sábado ser um “sinal”?', k: 'sinal:3 alianca:3 pacto:3 lealdade:3 identidade:2 simbolo:3',
    a: `Na Bíblia, o sábado é **sinal** entre Deus e o Seu povo, para lembrar que é Ele quem nos **santifica** (Êx 31:13-17; Ez 20:12, 20). O documento oficial diz que a Igreja “reconhece o sábado como sinal distintivo de lealdade a Deus” e que o sábado deve ser, para cada um, “um sinal exterior da graça de Deus e um canal de Suas incontáveis bênçãos”. Segundo a Crença Fundamental 20, é também um símbolo da nossa redenção em Cristo, um sinal de santificação e um antegozo do futuro eterno.`,
    src: ['ex31', 'ez20', 'doc_intro', 'cf20'], rel: ['oque', 'salvacao'] },

  { id: 'ellen', q: 'Quem foi Ellen White e por que vocês citam ela?', k: 'ellen:4 white:3 profetisa:3 espirito_de_profecia:4 egw:3 testemunhos:2 elena:3',
    a: `Ellen G. White (1827–1915) foi uma das fundadoras da Igreja Adventista. A Igreja entende que seus escritos expressam o **dom de profecia**, sempre **submetidos à Bíblia**, que é o padrão para testar todo ensino. Neste servidor, usamos as citações dela como **conselho prático** — e a Bíblia como base.`,
    src: ['folder'], rel: ['oque'] },

  { id: 'marca', q: 'O sábado tem a ver com a “marca da besta”?', k: 'marca_da_besta:6 besta:4 fim_dos_tempos:4 apocalipse:3 profecia:2 666:5 anticristo:4',
    a: `Esse é um tema profético amplo, e as fontes deste servidor **não o cobrem**. Para não inventar nada, indico o documento oficial da Igreja *“Resposta às perguntas sobre a marca da besta”* (no site institucional da Igreja Adventista, seção Documentos) e uma conversa com seu pastor ou líder.`,
    src: [], rel: ['ellen'], park: true },

  { id: 'natureza', q: 'Por que passar o sábado na natureza?', k: 'natureza:3 trilha:3 parque:2 campo:2 praia:2 acampamento:3 ar_livre:3 passear:2 cachoeira:3',
    a: `“O sábado convida-nos a contemplar, nas obras criadas, a glória do Criador [...]. Mais do que em qualquer outro dia, devemos, no santo dia de descanso, estudar as mensagens que Deus para nós escreveu na natureza” (*Conselhos Sobre Saúde*, p. 165). O folder sugere programar passeios com família e amigos e atividades ao ar livre com a igreja, quando o tempo ajudar.`,
    src: ['csa_165', 'folder'], rel: ['tarde', 'esporte'] },

  { id: 'criancas', q: 'Como tornar o sábado legal para crianças e irmãos menores?', k: 'crianca:3 irmao:3 irmaozinho:3 filhos:2 primo:2 pequeno:2 sobrinho:2 cacula:2',
    a: `Ellen White: “Devemos tornar o sábado tão interessante para nossa família, que sua volta semanal seja saudada com alegria” (Test. 2, p. 585). Ela alerta que crianças “abandonadas a si mesmas” acabam inquietas e ocupando-se de “coisas inadequadas” (Test. 6, p. 358). Sugestões do folder: **prepare uma caixa** com brinquedos e jogos bíblicos usados **só no sábado**, planeje atividades especiais e evite desentendimentos. Você, como adolescente, pode **liderar** isso!`,
    src: ['tpi2_585', 'tpi6_358', 'folder'], rel: ['tarde', 'culto'] },

  { id: 'amigos', q: 'Posso convidar amigos que não são adventistas?', k: 'convidar:3 convite:3 amigo_de_fora:4 nao_adventista:4 visitante:2 amigos:2 evangel:2 testemunh:2 missao:2 igreja_de_amigo:3',
    a: `Pode — e o folder incentiva! Sugestões: convidar **amigos** para o almoço ou para um passeio na natureza; convidar amigos dos filhos para o **culto de pôr do sol**; fazer **visitas** e **estudo bíblico** com um amigo; e **divulgar** as atividades da igreja, pois “a comunidade que vive nos arredores da igreja precisa conhecer o que realizamos como cristãos”. Sem pressão: seja amigo(a) primeiro.

O documento oficial lembra que, no sábado, “todas as pessoas sob nossa influência devem ser dispensadas das atividades seculares” — família, empregados e hóspedes — e estimuladas a observar o sábado.`,
    src: ['folder', 'doc_infl'], rel: ['tarde', 'culto'] },

  { id: 'pais', q: 'Meus pais não guardam o sábado / não deixam. E agora?', k: 'meus_pais:4 pais_nao:4 minha_mae:3 meu_pai:3 familia_nao:4 proibe:3 nao_deixa:4 nao_deixam:4 sou_o_unico:4 sozinho_na_igreja:4 contra_minha:3',
    a: `Esse é um assunto delicado, e as fontes do servidor **não trazem um passo a passo** para ele. O que dá para dizer com segurança: **honrar pai e mãe** também é mandamento (Êx 20:12); converse com calma, mostre o que o sábado significa para você e **peça ajuda ao seu pastor ou líder JA** — eles já acompanharam situações parecidas. Ore, seja paciente e mostre o sábado como **alegria**, não como briga.\n\nSe a situação estiver pesada, fale com um adulto de confiança.`,
    src: ['ex20b'], rel: ['salvacao'], park: true },

  { id: 'festas', q: 'Posso ir a festas, casamentos e aniversários?', k: 'festa:3 casamento:3 aniversario:3 niver:3 balada:3 festinha:3 role$:2 formatura:3 show$:2 baile:3 comemoracao:2',
    a: `O documento oficial diz que “casamentos e festas, incluindo seus devidos preparativos, devem ser realizados fora desse período sagrado”, e que “Casamentos e algumas festas mais suntuosas não devem ser planejados para os sábados à noite, pois seus preparativos envolvem expectativas e atividades não condizentes com o espírito de comunhão com Deus”.

Lembre que o sábado começa no pôr do sol de **sexta**. Se o convite cair nesse período, converse com carinho, ofereça outro horário e leve a dúvida ao seu pastor ou líder.`,
    src: ['doc_festas', 'lv23'], rel: ['inicio', 'amigos'] },

  { id: 'excursao', q: 'Posso ir a excursão, acampamento ou passeio da escola ou da igreja?', k: 'excursao:4 acampamento:4 acamp:3 passeio_da_escola:4 retiro:3 viagem_da_escola:4 camping:3 desbravador:3 aventureiro:2',
    a: `O documento oficial diz que a realização de excursões e acampamentos “pode promover a socialização cristã” (Sl 42:4), mas todos devem “chegar ao devido local antes do início do sábado e montar sua estrutura, incluindo suas barracas”; e que as atividades nas horas do sábado “devem ser condizentes com o espírito sagrado desse dia”.

Na prática: confira os horários de saída e de chegada **antes** de aceitar o convite, e pergunte qual será o programa do sábado.`,
    src: ['doc_excurs'], rel: ['viagem', 'natureza'] },

  { id: 'profissao', q: 'Que profissão escolher? Posso trabalhar em hospital, loja ou delivery?', k: 'profissao:4 carreira:4 curso$:2 medicina:3 enfermagem:3 turno:2 escala:3 plantao:4 aprendiz:3 sociedade:2',
    a: `O documento oficial orienta que os adventistas do sétimo dia “devem escolher e exercer profissões condizentes com a devida observância do sábado”, reconhecendo que “a estrutura da sociedade em geral nem sempre favorece a observância do sábado”. Os observadores do sábado “devem se abster de trabalhar nesse dia, mesmo em instituições seculares de serviços básicos”. Em instituições da própria Igreja que não podem fechar, o serviço deve ser feito “por um grupo reduzido e em forma de rodízio”.

Na **saúde**: emergências são atendidas (“é lícito curar no sábado”), mas “plantões rotineiros” em hospitais não adventistas “são impróprios para as horas do sábado”. Converse com seus pais e líder já na hora de escolher curso e carreira.`,
    src: ['doc_prof', 'doc_serv', 'doc_saude'], rel: ['trabalho', 'misericordia'] },

  { id: 'igreja_prec', q: 'E se eu tiver outro compromisso no sábado de manhã? (igreja ou outros compromissos)', k: 'compromisso:3 precedencia:4 prioridade:3 igreja_ou:3 reuniao:3 congregar:4 faltar_na_igreja:4 ir_a_igreja:3 obrigado_a_ir:4',
    a: `O documento oficial cita Hb 10:25 (“de congregar-nos”) e diz que “as programações e atividades regulares da igreja aos sábados devem ter precedência sobre outros compromissos pessoais e sociais, mesmo que estes sejam pertinentes para o sábado”. Se houver conflito, converse cedo com seus pais e seu líder, antes de assumir o compromisso.`,
    src: ['doc_igreja'], rel: ['escola_sabatina', 'festas'] },

  { id: 'documento', q: 'O que diz o documento oficial “Observância do Sábado”?', k: 'documento:4 documento_oficial:5 divisao_sul_americana:5 dsa:4 declaracao:3 oficial:3 igreja_diz:3 posicao_oficial:4',
    a: `É um documento da **Divisão Sul-Americana** da Igreja Adventista, de **24/10/2023**. Ele trata de: vida de santificação, preparação para o sábado, início e término (cultos de pôr do sol), espírito de comunhão, reuniões da igreja, casamentos e festas, mídia secular, esportes e lazer, horas de sono, viagens, excursões e acampamentos, restaurantes e alimentação, medicamentos, estágios e práticas escolares, escolha da profissão, serviços básicos, atividades de saúde, projetos assistenciais e atividades missionárias. Pergunte por qualquer tema e eu respondo com o trecho. Neste servidor, quando o folder e o documento divergem, **vale o documento**, que é mais atualizado. O texto completo está no link da fonte abaixo.`,
    src: ['doc'], rel: ['esporte', 'festas', 'prova'] },

  { id: 'jogo', q: 'Como o jogo avalia minhas respostas? Como ganho XP?', k: 'xp$:3 pontos:3 pontuacao:3 como_funciona:4 cargo:3 nivel:3 avalia:3 nota:2 como_ganho:4',
    a: `Cada resposta digitada é comparada com as **ideias principais** que as fontes trazem (não com palavras exatas). Quanto mais ideias você cobre, mais XP ganha. Nos **dilemas**, o XP vem de você **refletir, decidir e planejar** — não existe resposta certa para o que você faria. Se eu não reconhecer sua ideia, compare com a **resposta-modelo**. Os cargos vão de **Visitante** a **Embaixador do Sábado**. Veja mais em **#como-jogar**.`,
    src: [], rel: ['oque'] }
];

const FAQ_SUGGEST = ['domingo', 'celular', 'inicio', 'esporte', 'prova', 'salvacao', 'festas', 'restaurante'];

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
  let t = String(s == null ? '' : s).split('{nick}').join(S.user.name || 'você').split('{priv}').join(PRIV_TEXT());
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
let KEY = 'guardioes-do-sabado:v1';   // na versão com login vira ...:v2:u<id> (um espaço por conta, no mesmo aparelho)
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
function saveNow() { clearTimeout(saveTimer); if (SERVER && !GAME_ON) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sem storage */ } }
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 120); queueSync(); }
const chs = id => { if (!S.ch[id]) S.ch[id] = { i: 0, done: false, hist: [], sub: {} }; return S.ch[id]; };

/* ---------- cargos, desbloqueio, fases ---------- */
const roleIdx = xp => ROLES.reduce((r, x, i) => (xp >= x.xp ? i : r), 0);
const isDone = id => !!(S.ch[id] && S.ch[id].done);
function dilemmasDone() { return F4.filter(isDone).length; }

function unlocked(c) {
  if (c.serverOnly) return canRank();     // ranking: só com login e acesso liberado
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
  if (c.serverOnly) return '🔒 O ranking só existe na versão com login.';
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
  let h = quickNavHTML();
  for (const cat of CATS) {
    const list = CH.filter(c => c.cat === cat.id && (!c.serverOnly || SERVER));
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
    adminBtnHTML() +
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
  h += rankMiniHTML();
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
  let h = c.kind === 'board' ? '<div class="board" id="board"></div>' : c.kind === 'rank' ? '<div class="board" id="rankboard"></div>' : '', prev = null;
  for (const m of st.hist) { h += msgHTML(m, prev, false); prev = m; }
  box.innerHTML = h;
  if (c.kind === 'board') renderBoard();
  if (c.kind === 'rank') renderRankBoard();
  box.scrollTop = c.kind === 'rank' ? 0 : box.scrollHeight;
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
  if (c.kind === 'rank') {
    if (!st.i) { fillStatic(c); renderHistory(c.id); }
    setAW(null, 'Ranking · atualiza sozinho a cada minuto');
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
  ['/cartao', 'seu cartão de compromisso'], ...(SERVER ? [['/ranking', 'abre o ranking do grupo']] : []), ['/ajuda', 'lista de comandos']
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
    case '/ranking': return SERVER ? openChannel('ranking') : toast('O ranking só existe na versão com login.');
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
    const list = CH.filter(c => c.cat === cat.id && (!c.serverOnly || SERVER)), done = list.filter(real).length, pct = Math.round(done / list.length * 100);
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
  if (SERVER) return openSettingsServer();
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
  const url = /^https?:/.test(location.href) ? location.origin + location.pathname : '';
  const txt = (SERVER
    ? `Bora jogar o “Guardiões do Sábado”? É um jogo com fases, XP e dilemas reais sobre o sábado. Peça seu acesso aqui e o líder libera: ${url}`
    : `Bora jogar o servidor “Guardiões do Sábado”? É um jogo com fases, XP e dilemas reais sobre o sábado. ${url}`).trim();
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
  if (!dl && MODE === 'artifact') { toast('Salvar imagem não está disponível aqui. Tire um print do cartão 📸'); return; }
  try {
    const blob = await pledgeBlob();
    if (dl) { await dl.save({ filename: 'compromisso-de-fe.jpg', data: blob }); toast('Cartão salvo ✅'); return; }
    const file = new File([blob], 'compromisso-de-fe.jpg', { type: 'image/jpeg' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {            // celular: abre "Salvar imagem / Compartilhar"
      try { await navigator.share({ files: [file], title: 'Meu compromisso de fé' }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'compromisso-de-fe.jpg'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
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
      S.user.av = id; save(); renderUser(); renderMembers(); pushProfile({ avatar: id });
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
      if (SERVER) { resetEverything(); break; }
      try { localStorage.removeItem(KEY); } catch (er) { /* ok */ }
      S = DEF(); active = null; applyTheme(); closeModal(); renderAll(); openChannel('boas-vindas', { force: true });
      break;
    default: authClick(act, id, t);
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
function startGame() {
  applyTheme(); renderAll();
  openChannel(pickStart(), { force: true });
}
function boot(hot) {
  initViewport();
  if (SERVER) { wire(); authBoot(); return; }          // versão com login: o jogo só começa depois do acesso liberado
  const loaded = (hot && hot.S) ? hot.S : loadState();
  S = mergeState(loaded);
  try { if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ S })); } catch (e) { /* ok */ }
  wire(); startGame();
}
(function init() {
  const h = window.claude && window.claude.hot;
  if (h && h.ready) h.ready(boot); else boot((h && h.data) || {});
})();

})();