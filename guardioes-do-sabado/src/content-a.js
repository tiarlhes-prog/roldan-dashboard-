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
  tpi6_357: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 357' },
  tpi6_357b:{ t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 357-358' },
  nichol:   { t: 'F. D. Nichol, Questions People Have Asked Me, p. 237' },
  dtn_207:  { t: 'E. G. White, O Desejado de Todas as Nações, p. 207' },
  bs_77:    { t: 'E. G. White, Beneficência Social, p. 77' },
  decl_204: { t: 'Declarações da Igreja, p. 204-205' },
  decl_198: { t: 'Declarações da Igreja, p. 198' },
  csa_165:  { t: 'E. G. White, Conselhos Sobre Saúde, p. 165' },
  tpi2_585: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 2, p. 585' },
  tpi6_358: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 358' },
  tpi6_354: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 354' },
  tpi6_359: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 6, p. 359-360' },
  ts6_359:  { t: 'E. G. White, Testemunhos Seletos, vol. 6, p. 359' },
  dtn_283:  { t: 'E. G. White, O Desejado de Todas as Nações, p. 283' },
  tpi5_609: { t: 'E. G. White, Testemunhos Para a Igreja, vol. 5, p. 609' },
  oc_521:   { t: 'E. G. White, Orientação da Criança, p. 521' },
  st_1884:  { t: 'E. G. White, Signs of the Times, 7 de agosto de 1884' },
  folder:   { t: 'Folder “O Significado e a Prática do Sábado” (sugestões práticas)' },
  // Igreja e lei
  doc: { t: 'Documento oficial “Observância do Sábado” (Igreja Adventista)', u: 'https://institucional.adventistas.org/pt/documentos/observancia-do-sabado/' },
  cf20:{ t: 'Crença Fundamental 20 — O Sábado', u: 'https://institucional.adventistas.org/pt/nossas-crencas/20-o-sabado/' },
  lei: { t: 'Lei 13.796/2019 (art. 7º-A da LDB)', u: 'https://www2.camara.leg.br/legin/fed/lei/2019/lei-13796-3-janeiro-2019-787598-norma-pl.html' }
};

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
      { n: '🔒 Privacidade', v: 'Seu progresso fica **só neste aparelho**. Nada é enviado a ninguém.' }
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
      { n: '📄 Documento oficial', v: 'Descreve o sábado como **sinal distintivo de lealdade a Deus** e como **sinal exterior da graça divina**, e diz que sua observância vale para todas as pessoas, em qualquer tempo e lugar.', w: 1 }
    ], src: ['ex31', 'ez20', 'cf20', 'doc'] }),
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
    qz('z1_1', `Em qual livro da Bíblia está o 4º mandamento (“Lembra-te do dia de sábado”)?`, [/(exodo|\bex\b|deuteronomio|deut)/], `Êxodo (cap. 20) — também em Deuteronômio 5`),
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
      bonus: /(visita|hospital|idos|asilo|orfanato|presid|sangue|ajud|mensagem|ligar|conversar|ouvir|consol|compart|alimento|cesta|doa|vizinh|amigo|estudo|biblia|oracao|orar)/,
      text: `Dê um exemplo **de 2026** de uma “obra de misericórdia” que você poderia fazer num sábado — de verdade, no seu mundo.`,
      ph: 'Ex.: visitar… / mandar mensagem…',
      react: `Boa! Misericórdia não precisa ser gigante: uma visita, uma mensagem, uma carona, um ouvido. O folder também lista: visitas a hospitais, idosos, orfanatos e presídios, doação de sangue e a campanha *Quebrando o Silêncio*.` }),
    ask({ id: 'q3_4', kind: 'reflect', xp: 25, minWords: 10,
      bonus: /(presente|beneficio|bem|descans|dadiva|cuidado|amor|liberd|paz)/,
      text: `Marcos 2:27 diz que **“o sábado foi feito por causa do homem”**. Isso muda como você vê o sábado: é mais uma **regra pesada** ou um **presente**? Por quê?`,
      ph: 'Conte o que você pensa…',
      react: `E Marcos 2:28 completa: o Filho do Homem é **Senhor do sábado** — o dia continua sendo Dele. Presente, sim; mas **de Alguém**. 🎁`, src: ['mc2'] })
  ] },

{ id: '2-deleite', cat: 'f2', name: '2-deleite', title: 'O Sábado Que Dá Vontade de Voltar',
  topic: 'Isaías 58:13-14 · deleite, alegria e família', pins: ['is58', 'tpi2_585', 'ts6_359'], reward: 40,
  steps: [
    say('neemias', `Isaías 58:13-14 convida a chamar o sábado de **deleitoso** (uma delícia). Ellen White pede algo parecido para as famílias:`, { embed: { src: ['is58'] } }),
    quote(`Devemos tornar o sábado tão interessante para nossa família, que sua volta semanal seja saudada com alegria. [...] Pais, tornem o sábado um deleite, para que seus filhos o aguardem e o acolham de coração.`, `E. G. White, Testemunhos Para a Igreja, vol. 2, pág. 585`, ['tpi2_585']),
    ask({ id: 'q4_1', kind: 'reflect', xp: 35, minWords: 10,
      bonus: /(deleit|alegr|delicia|prazer|feliz|present|descans|paz|liberd|famili|amig|comunh)/,
      text: `Um amigo manda: *“sábado é chato, só tem proibição”*. Escreva a **resposta que você mandaria**, usando a ideia de **deleite**.`,
      ph: 'Escreva como no chat…',
      react: `Boa! Quem convida com alegria costuma ser mais ouvido do que quem discute. 😉` }),
    quote(`Os pais poderão fazer do sábado o que em realidade deve ser, isto é, o dia mais alegre da semana, induzindo assim os filhos a considerá-lo um dia deleitoso, o dia por excelência, santo ao Senhor e digno de honra.`, `E. G. White, Testemunhos Seletos, vol. 6, pág. 359`, ['ts6_359']),
    ask({ id: 'q4_2', kind: 'list', xp: 30, need: 3,
      text: `Crie a sua **lista de deleite**: **3 coisas** que tornariam o seu sábado o dia mais esperado da semana (comida, gente, lugar, música, atividade…).`,
      ph: 'Ex.: almoço, trilha, jogos…',
      react: `Essa lista é ouro. Guarde-a: ela vai virar o seu plano lá no Chefão. 👑`,
      model: `Não existe lista certa — o ponto é que o sábado tenha **coisas que você realmente espera com alegria**: pessoas queridas, comida boa, natureza, música, serviço, descanso de verdade.`,
      src: ['is58', 'tpi2_585'] })
  ] },

{ id: '2-quiz', cat: 'f2', name: '2-quiz', title: 'Quiz-relâmpago · Jesus e o Deleite', pill: 'QUIZ',
  topic: 'Respostas curtas · 35s por pergunta', pins: ['lc4', 'mc2', 'mt12', 'is58', 'dtn_207', 'ts6_359'], reward: 40, quiz: true,
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
  topic: 'Dia de preparação · quando o sábado começa · culto de abertura', pins: ['tpi6_354', 'ex16', 'lv23', 'cf20', 'doc', 'tpi6_357b', 'folder'], reward: 40,
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
      model: `A sexta é o dia de **deixar tudo pronto** para o sábado ser descanso de verdade (Êx 16:23). Exemplos do folder: **roupa e calçado**, **ofertas**, tarefas da casa **divididas** entre todos, atividades da semana planejadas — e preparar-se **espiritualmente**. Hoje dá para somar: celular carregado e o **Modo Sábado** programado.`,
      src: ['tpi6_354', 'ex16', 'folder'] }),
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
    emb({ title: 'O documento oficial recomenda', c: 'var(--violet)', fields: [
      { n: '🌅 Preparação para o sábado', v: 'Interromper as atividades seculares **antes do pôr do sol de sexta** e deixar **casa, roupas e comida** preparadas com antecedência.', w: 1 },
      { n: '🕯️ Início e término do sábado', v: 'Abrir e encerrar o dia com **cultos breves** ao pôr do sol, em família.', w: 1 }
    ], src: ['doc'] }),
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
      model: `Ideias do folder: **cantar vários hinos**; ler um parágrafo do Espírito de Profecia; **dramatizar** uma história bíblica; dar a cada participante um **texto bíblico** para ler; cada um **agradecer** por algo específico da semana; **convidar amigos**; preparar uma **recordação-surpresa**; e fechar com um **abraço** e um “feliz sábado”.`,
      src: ['folder', 'tpi6_357b'] })
  ] },

{ id: '3-manha', cat: 'f3', name: '3-manha', title: 'Manhã: Sono, Roupa e Igreja',
  topic: 'Descansar sem desperdiçar o dia · o que vestir · Escola Sabatina e culto', pins: ['tpi2_704', 'me2_475', 'edu_248', 'css_41', 'folder'], reward: 40,
  steps: [
    say('neemias', `O sábado de manhã é o “lançamento” do dia. Três temas: **sono, roupa e igreja**. ⛪`),
    quote(`Ninguém se deve sentir na liberdade de gastar tempo santo inutilmente. Desagrada a Deus que os observadores do sábado durmam muito tempo no sábado. [...] Devem dedicar o tempo e as energias a cultos religiosos, para que a divina influência os possa acompanhar durante a semana. De todos os dias semanais, nenhum é tão favorável aos pensamentos e sentimentos religiosos como o sábado.`, `E. G. White, Testemunhos Para a Igreja, vol. 2, pág. 704`, ['tpi2_704']),
    ask({ id: 'q6_1', kind: 'concept', xp: 35, minWords: 5,
      text: `Como **não** ficar morto de sono no sábado? Que hábito de **sexta à noite** ajuda? (O folder dá dicas.)`,
      concepts: [
        C('dormir/descansar mais cedo', /(dormir cedo|deitar cedo|descans.{0,25}cedo|mais cedo|cedo)/),
        C('conversar em família depois do jantar', /(famili|jantar|conversa)/),
        C('programar horários', /(horario|despertador|acordar|alarme|levantar|programar|desjejum|cafe)/)
      ], full: .5,
      hint: `Logo após o jantar… o que o folder sugere fazer e a que horas ir para a cama?`,
      model: `Depois do jantar, **converse um pouco em família e descanse mais cedo** que de costume; assim você fica mais disposto(a). E **programe** o horário de levantar, o café e a saída de casa para chegar a tempo, antes do início dos serviços.`,
      src: ['folder', 'tpi2_704'] }),
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
  topic: 'Almoço simples e alegre · natureza · tarde com gente · irmãos menores', pins: ['tpi6_357', 'csa_165', 'tpi6_358', 'folder'], reward: 40,
  steps: [
    say('neemias', `Depois do culto vem a parte que mais define se o sábado vai ser **deleite** ou **tédio**: a tarde. ☀️`),
    quote(`No sábado, não devemos aumentar a quantidade de alimento ou preparar maior variedade do que nos outros dias. Ao contrário, a refeição do sábado deve ser mais simples, e devemos comer menos, a fim de ter o espírito claro e em condições de compreender os temas espirituais. A alimentação em excesso entorpece a mente.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, pág. 357`, ['tpi6_357']),
    ask({ id: 'q7_1', kind: 'concept', xp: 35, minWords: 8,
      text: `Por que a refeição do sábado deve ser **mais simples**? E como fazer dela um momento **alegre** mesmo assim?`,
      concepts: [
        C('mente clara para o espiritual', /(mente|espirit|clar|entorpec|concentr|sono|pesad|compreend)/),
        C('simples, mas saborosa e especial', /(saborosa|gostos|atraente|especial|prato|apetit|simples)/),
        C('convivência e alegria', /(amig|convid|famili|conversa|alegr|descontr|musica|ajudar|todos ajudam)/)
      ], full: .66,
      hint: `Duas ideias: o efeito de comer demais na mente… e o que o folder sugere para o almoço virar festa sem virar banquete.`,
      model: `Porque comer demais “entorpece a mente” e atrapalha entender os temas espirituais. O folder sugere: comida **simples, mas saborosa e atraente** (um prato especial é bem-vindo), **convidar amigos**, ter **música instrumental cristã** ao fundo, conversar sobre o sermão e fazer **todos ajudarem** no preparo e na arrumação.`,
      src: ['tpi6_357', 'folder'] }),
    quote(`O sábado convida-nos a contemplar, nas obras criadas, a glória do Criador. [...] Mais do que em qualquer outro dia, devemos, no santo dia de descanso, estudar as mensagens que Deus para nós escreveu na natureza. [...] À medida que penetramos no seio da natureza, Cristo nos torna real a Sua presença, e nos fala ao coração de Sua paz e amor.`, `E. G. White, Conselhos Sobre Saúde, pág. 165`, ['csa_165']),
    ask({ id: 'q7_2', kind: 'list', xp: 40, need: 3,
      bonus: /(natureza|trilha|parque|praca|passeio|caminh|ar livre|campo|praia)/,
      text: `Monte a sua **tarde de sábado ideal**: cite **3 atividades** (com gente, na natureza ou servindo alguém) que você realmente curtiria.`,
      ph: 'Ex.: trilha, visita, jogo bíblico…',
      react: `Boa! O folder reforça: visitas, estudo bíblico com um amigo, passeios na natureza, jogos bíblicos e ações sociais. Quanto mais **gente e propósito**, menos tédio. 🌿`,
      model: `Exemplos do folder: **visitas** de cortesia e estudo bíblico com um amigo; **passeio na natureza** com família e amigos; **jogos bíblicos** ou DVD cristão; visitar a **igreja de um amigo**; **ações sociais** (hospitais, idosos, orfanatos, doação de sangue).`,
      src: ['folder', 'csa_165'] }),
    quote(`Em muitas famílias, os filhos menores são deixados à vontade, a fim de se entreterem como melhor puderem. Abandonadas a si mesmas, as crianças em breve ficam inquietas e começam a brincar ou ocupar-se de coisas inadequadas. Deste modo, o sábado perde para elas sua importância sagrada.`, `E. G. White, Testemunhos Para a Igreja, vol. 6, pág. 358`, ['tpi6_358'], `Você tem irmãos menores, primos ou sobrinhos? Aqui o desafio é **você liderar**.`),
    ask({ id: 'q7_3', kind: 'reflect', xp: 25, minWords: 8,
      text: `O folder sugere, por exemplo, uma **caixa** com brinquedos e jogos bíblicos usados **só no sábado**. Que ideia **nova** você teria para tornar o sábado especial para uma criança?`,
      ph: 'Sua ideia criativa…',
      react: `Gostei! Quem inventa um sábado bom para uma criança, aprende a amá-lo também. 💛` })
  ] },

{ id: '3-modo', cat: 'f3', name: '3-modo-sabado', title: 'Modo Sábado (telas e mundo secular)',
  topic: 'Mídia desativada · o teste do sábado · planejar para não invadir as horas sagradas', pins: ['folder', 'decl_198', 'tpi6_354', 'ne13'], reward: 40,
  steps: [
    say('neemias', `Chegou o tema mais 2026 de todos: **telas**. 📱`),
    emb({ title: 'O que o folder sugere', c: 'var(--violet)', fields: [
      { n: '📵 Mídia', v: `“A Mídia (TV, rádio, computador, internet, celular, jogos eletrônicos, DVD's, etc.) deve ficar desativada durante as horas do sábado, a menos que esteja relacionada com assuntos religiosos.”`, w: 1 },
      { n: '🗂️ Longe da vista', v: `“Guarde em locais que não desperte a sua atenção as revistas, jornais e músicas seculares.”`, w: 1 },
      { n: '📅 Planejamento', v: `“Planeje as atividades diárias de forma que não invadam as horas sabáticas.”`, w: 1 },
      { n: '🧭 A pergunta-chave', v: `“É importante ter em mente a seguinte pergunta: Esta atividade me leva a compreender melhor a verdadeira e sagrada natureza do sábado?” — *Declarações da Igreja*, pág. 198`, w: 1 }
    ], src: ['folder', 'decl_198'] }),
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

{ id: '3-despedida', cat: 'f3', name: '3-despedida', title: 'Despedida e Sete Dias',
  topic: 'Como encerrar o sábado · adventista de segunda a sexta · culto familiar', pins: ['ts6_359', 'tpi5_609', 'oc_521', 'st_1884', 'folder'], reward: 40,
  steps: [
    say('neemias', `O sábado termina — mas a fé não. Duas ideias para fechar a Fase 3. 🌇`),
    quote(`Ao pôr-do-sol, é hora de elevar a voz em oração e cânticos de louvor a Deus, celebrando o término do sábado e pedindo a assistência do Senhor para os cuidados da nova semana de atividades.`, `E. G. White, Testemunhos Seletos, vol. 6, pág. 359`, ['ts6_359']),
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
      src: ['ts6_359', 'folder'] }),
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
  topic: 'Respostas curtas · 35s por pergunta', pins: ['tpi6_354', 'tpi6_357', 'csa_165', 'folder', 'decl_198'], reward: 50, quiz: true,
  steps: [
    QUIZ_INTRO(7),
    qz('z3_1', `Qual dia da semana é o “dia de preparação”?`, [/sexta/], `Sexta-feira`),
    qz('z3_2', `O sábado começa em qual momento da sexta?`, [/(por do sol|poente|entardecer|anoitecer)/], `No pôr do sol`),
    qz('z3_3', `Complete: a refeição do sábado deve ser mais ______.`, [/simples/], `Simples`),
    qz('z3_4', `Na roupa de sábado se evita a extravagância, mas também ser ______. (uma palavra)`, [/(negligen|desleix|relaxad|largad|desarrum|descuid)/], `Negligente / desleixado`),
    qz('z3_5', `Em que “lugar” devemos estudar as mensagens que Deus escreveu, segundo Conselhos Sobre Saúde, p. 165?`, [/(natureza|campo|prado|ar livre|ceu aberto)/], `Na natureza`),
    qz('z3_6', `A mídia (TV, internet, jogos) deve ficar ______ nas horas do sábado, a menos que seja religiosa.`, [/(desativ|desligad|\boff\b|fechad|bloquead)/], `Desativada`),
    qz('z3_7', `A compra de alimento ou remédio deve ser feita durante a ______ (exceto emergências).`, [/semana/], `Semana`),
    { t: 'quizend' }
  ] }

];
