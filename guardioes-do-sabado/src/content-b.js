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
  src: ['lv23', 'cf20', 'doc', 'tpi6_357b', 'ts6_359', 'doc_festas'],
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
  theory: `• DTN, p. 207: “A lei proíbe trabalho secular no dia de repouso do Senhor” — e as **obras de misericórdia combinam** com o sábado (Mt 12:12; *Beneficência Social*, p. 77).\n• *Declarações da Igreja*, p. 204-205: quem trabalha onde as horas do sábado “não trazem diminuição dos deveres rotineiros” tem “a obrigação de recordar os princípios que regem as atividades sabáticas”.\n• Jesus ensinou a colocar o Reino de Deus **em primeiro lugar** (Mt 6:33).
• O documento oficial: os adventistas do sétimo dia “devem escolher e exercer profissões condizentes com a devida observância do sábado”, e “devem se abster de trabalhar nesse dia, mesmo em instituições seculares de serviços básicos”. (O folder fala em “recordar os princípios”; o documento é mais explícito.)`,
  practice: `• **Converse antes de aceitar**: pergunte se há escala sem sábado, troca por domingo ou outro horário.\n• Se você é **menor de idade**, decida junto com seus pais ou responsáveis (contratos de adolescentes têm regras próprias).\n• Peça orientação do **pastor ou líder JA**: eles já viram isso muitas vezes.\n• Procure alternativas: vagas compatíveis, bicos em outros dias, trabalhos por projeto.\n• Cuide do “porquê”: não é birra — é **lealdade**.
• Pense no longo prazo: o documento pede escolher profissões e escalas **compatíveis com o sábado**. Vale conversar com seus pais e líder já na hora de escolher curso e carreira.`,
  faith: `Fé não é fingir que o problema não existe: a família está apertada e isso pesa. Fé é fazer a **sua parte** (procurar, negociar, orar) e confiar que Deus não te deixa sozinho(a) — mesmo que a resposta demore.`,
  src: ['dtn_207', 'decl_204', 'mt12', 'bs_77', 'mt6', 'doc_prof', 'doc_serv'],
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
