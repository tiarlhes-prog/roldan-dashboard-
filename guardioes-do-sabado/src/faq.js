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
    a: `Na leitura adventista, **não**. O sábado nasceu na **Criação** (Gn 2:1-3), muito **antes de Israel existir**. Jesus disse que “o sábado foi feito por causa do homem” (Mc 2:27) — da humanidade. Isaías fala de **estrangeiros** que guardam o sábado (Is 56:6-7) e da **nova terra**, onde haverá sábados (Is 66:22-23). O documento oficial *Observância do Sábado* afirma que a observância vale para **todas as pessoas, em qualquer tempo e lugar**.`,
    src: ['gn2', 'mc2', 'is56', 'is66', 'doc'], rel: ['domingo', 'sinal'] },

  { id: 'inicio', q: 'Quando o sábado começa e termina?', k: 'comeca:3 termina:3 horario:2 por_do_sol:2 pordosol:2 entardecer:3 anoitecer:2 inicio:2 acaba:2 comeco:2 quando_comeca:3 que_horas:3',
    a: `O sábado vai **de pôr do sol a pôr do sol**: começa quando o sol se põe na **sexta** e termina quando se põe no **sábado** (Lv 23:32; Crença Fundamental 20). O horário muda conforme a cidade e a época — pesquise “horário do pôr do sol” na sua cidade. O documento oficial sugere **cultos breves** para abrir e encerrar o dia, em família.`,
    src: ['lv23', 'cf20', 'doc'], rel: ['sexta', 'culto'] },

  { id: 'sexta', q: 'O que fazer na sexta? (preparação)', k: 'sexta:3 prepara:3 preparacao:3 preparar:2 vespera:2 deixar_pronto:3',
    a: `A sexta é o **dia de preparação** (Test. 6, p. 354; Êx 16:23). Sugestões do folder: planejar a rotina para a sexta não ficar exaustiva; **dividir tarefas** da casa; separar **roupa e calçado**; preparar as **ofertas**; preparar-se **espiritualmente**; e, na tarde de sexta, **deixar as preocupações da semana de fora**. O documento oficial acrescenta: interrompa as atividades seculares **antes do pôr do sol** e deixe casa, roupas e comida prontas.`,
    src: ['tpi6_354', 'ex16', 'folder', 'doc'], rel: ['inicio', 'roupa'] },

  { id: 'trabalho', q: 'Posso trabalhar, estudar ou fazer lição de casa no sábado?', k: 'trabalh:3 emprego:3 estagio:3 estudar:2 licao_de_casa:3 tarefa:3 dever:2 secular:3 servico:2 bico:3 freela:3 atividade_secular:3',
    a: `O folder é claro: “Nenhum dever relacionado com os seis dias anteriores será deixado para o sábado” (Test. 6, p. 354). **Planeje a semana** para terminar trabalhos e lições até a sexta. Quem trabalha em serviços que não param (como hospitais) deve “recordar os princípios que regem as atividades sabáticas” (*Declarações da Igreja*, p. 204-205). **Obras de misericórdia** e emergências são diferentes de trabalho comum (Mt 12:12; *Beneficência Social*, p. 77). Para provas e aulas, veja a pergunta sobre **prova no sábado**.`,
    src: ['tpi6_354', 'decl_204', 'bs_77', 'mt12'], rel: ['prova', 'misericordia'] },

  { id: 'prova', q: 'Tenho prova, aula ou vestibular no sábado. E agora?', k: 'prova:3 vestibular:3 enem:3 simulado:3 aula:2 escola:2 colegio:2 faculdade:2 concurso:3 coordenacao:3 reposicao:3 lei$:2 direito:2 nota:1',
    a: `No Brasil, a **Lei 13.796/2019** acrescentou o **art. 7º-A à LDB**: o aluno de instituição pública ou privada pode, mediante **requerimento prévio e motivado** (pedido feito com antecedência, explicando o motivo religioso), faltar a prova ou aula em dia de guarda religiosa, e a escola oferece uma **prestação alternativa** (prova/aula de reposição ou trabalho), sem custo para o aluno. Há exceções (por exemplo, o ensino militar).\n\n⚠️ Isto **não é orientação jurídica**: confira o texto oficial da lei e converse com seus responsáveis e com a coordenação. Para concursos e vestibulares externos, valem as regras do edital: fale com a organizadora com antecedência.`,
    src: ['lei'], rel: ['trabalho'] },

  { id: 'celular', q: 'Posso usar celular, jogos, séries e redes sociais?', k: 'celular:3 jogo:2 jogar:2 videogame:3 game:3 serie:3 filme:2 tv$:2 televisao:2 internet:2 redes_sociais:3 rede_social:3 instagram:3 tiktok:3 youtube:3 netflix:3 whatsapp:2 midia:3 tela:3 streaming:3 discord:3 console:3 musica:2',
    a: `O folder diz: “A Mídia (TV, rádio, computador, internet, celular, jogos eletrônicos, DVD's, etc.) deve ficar desativada durante as horas do sábado, a menos que esteja relacionada com assuntos religiosos.” E sugere guardar “revistas, jornais e músicas seculares” longe da vista.\n\nNa dúvida, use a pergunta-chave: “**Esta atividade me leva a compreender melhor a verdadeira e sagrada natureza do sábado?**” (*Declarações da Igreja*, p. 198). Dica prática: crie um **Modo Sábado** no celular (Foco/Não perturbe) e use a tela para hinos, Bíblia e a lição.`,
    src: ['folder', 'decl_198'], rel: ['esporte', 'tarde'] },

  { id: 'restaurante', q: 'Posso comer fora ou pedir delivery?', k: 'restaurante:3 comer_fora:3 lanchonete:2 pizza:2 almoco_fora:3 fast_food:3 delivery:3 ifood:3 pedir_comida:3 shopping:1',
    a: `Sobre restaurantes, o folder cita **F. D. Nichol** (autor adventista): em **viagem**, quando não há alternativa, ir a um restaurante é algo que “não deve ser criticado”; mas ir a um restaurante **da própria comunidade** só para ter variedade ou “um novo ambiente” seria, segundo ele, “contrário ao espírito do sábado”. Ele conclui: “É melhor ter aos sábados uma refeição simples na quietude do lar, precedida por uma oração de agradecimento a Deus, do que o mais fino banquete no melhor restaurante.”\n\nAtenção: isso é **opinião de um autor**, não regra oficial. As fontes do servidor **não tratam de delivery**: converse com seus pais e seu líder.`,
    src: ['nichol'], rel: ['comida', 'viagem'] },

  { id: 'viagem', q: 'Posso viajar ou ir a um passeio no sábado?', k: 'viaj:3 viagem:3 excursao:3 passeio:2 onibus:2 aviao:2 estrada:2 aeroporto:2',
    a: `“Pode ser necessário viajar no sábado; mas sempre que possível devemos, no dia anterior, comprar a passagem e fazer todos os arranjos necessários. Quando viajarmos, devemos esforçar-nos o máximo para evitar que o dia da chegada coincida com o sábado” (Test. 6, p. 359-360). Sugestões do folder: **evite viagens longas e cansativas** no sábado e **planeje viajar na sexta**, para estar em comunhão com Deus no sábado.`,
    src: ['tpi6_359', 'folder'], rel: ['restaurante', 'tarde'] },

  { id: 'compras', q: 'Posso fazer compras ou ir ao shopping?', k: 'compra:3 comprar:3 shopping:3 loja:2 mercado:2 farmacia:2 vender:2 comercio:3 gastar:2',
    a: `O folder orienta: “A compra de alimento ou medicamento para atender as necessidades deve ser feita durante a semana, exceto emergências.” Neemias enfrentou o comércio no sábado e agiu antes que ele começasse (Ne 13:15-22).\n\nAs fontes **não trazem uma lista de “pode/não pode”** para shopping ou lazer; use o **teste do sábado** (“Esta atividade me leva a compreender melhor a verdadeira e sagrada natureza do sábado?”) e converse com seus pais e líder.`,
    src: ['folder', 'ne13', 'decl_198'], rel: ['celular', 'misericordia'] },

  { id: 'esporte', q: 'Posso jogar bola, praticar esportes ou disputar campeonato?', k: 'esporte:3 bola:3 futebol:3 volei:3 basquete:3 campeonato:3 treino:2 academia:2 correr:2 corrida:2 natacao:2 competi:3 time$:2 jogo_da_escola:3',
    a: `Ponto de honestidade: **as fontes do servidor não trazem uma regra específica sobre esportes**.\n\nO que elas dizem: o sábado é dia de **descanso, culto e boas obras** (DTN, p. 207); a atividade **secular** fica de fora; e a “recreação imprópria” faz o dia perder “sua importância sagrada” (Test. 6, p. 358). Ao mesmo tempo, o folder **incentiva** passeios ao ar livre com família, amigos e igreja, em contato com a natureza.\n\nAplique o **teste do sábado** (*Declarações da Igreja*, p. 198) e leve a pergunta ao seu pastor ou líder — principalmente se envolver campeonato ou compromisso com time.`,
    src: ['dtn_207', 'tpi6_358', 'decl_198', 'csa_165'], rel: ['celular', 'natureza'] },

  { id: 'dormir', q: 'Posso dormir até tarde no sábado?', k: 'dorm:3 sono:3 acordar:2 preguica:3 cochilo:2 soneca:2 cama:2 tarde_demais:2 descansar:2',
    a: `Descansar faz parte do sábado (“saudável repouso”, DTN p. 207). Mas Ellen White diz que “desagrada a Deus que os observadores do sábado durmam muito tempo no sábado”, porque o tempo santo deve ir também para o **culto** (Test. 2, p. 704).\n\nDica do folder: depois do jantar de sexta, converse em família e **descanse mais cedo** — assim você acorda disposto(a). E programe horário de levantar, café e saída para chegar **antes** do início dos serviços.`,
    src: ['tpi2_704', 'dtn_207', 'folder'], rel: ['roupa', 'sexta'] },

  { id: 'roupa', q: 'Que roupa usar no sábado?', k: 'roupa:3 vestir:3 vestuario:3 traje:3 tenis:2 bermuda:2 camiseta:2 chique:2 vestido:2 look:3 arrumar:2',
    a: `Dicas do folder: separe a **melhor roupa** para o sábado; ela deve ser **sóbria e de bom gosto**, não extravagante; **não faça da roupa um motivo de discussão**; e lembre que você está “indo ao encontro do Criador”.\n\nO princípio é **honrar a Deus**: nem vaidade, nem desleixo. Ellen White critica quem vai à igreja com a roupa “poeirenta e encardida” e “posta sobre o corpo de maneira negligente” (*Mensagens Escolhidas*, vol. 2, p. 475). Para ela, “o caráter de uma pessoa é julgado pelo aspecto de seu vestuário” (*Educação*, p. 248).`,
    src: ['me2_475', 'edu_248', 'folder'], rel: ['dormir', 'escola_sabatina'] },

  { id: 'tarde', q: 'O que fazer à tarde? Estou entediado(a).', k: 'tarde:3 atividade:2 programa:2 ideia:2 tedio:3 chato:3 entediado:3 o_que_fazer:3 lazer:2 entretenimento:2 sem_o_que_fazer:3 passar_o_tempo:3',
    a: `Ideias do folder para a tarde: **visitas** de cortesia e estudo bíblico com um amigo; **passeios na natureza** com família e amigos; **almoço** com convidados e música cristã ao fundo; **jogos bíblicos** e DVDs cristãos; visitar a **igreja de um amigo**; participar da **programação missionária** da igreja; e **ações sociais** (hospitais, idosos, orfanatos, presídios, doação de sangue, campanha *Quebrando o Silêncio*).\n\nTédio costuma ser **falta de plano**: monte sua “Caixa do Sábado” antes de sexta.`,
    src: ['folder', 'csa_165', 'tpi6_358'], rel: ['natureza', 'amigos'] },

  { id: 'misericordia', q: 'Posso ajudar alguém doente ou em emergência no sábado?', k: 'doente:3 hospital:3 emergencia:3 ajudar:2 socorro:3 misericordia:3 cuidar:2 enfermo:3 medico:3 curar:3 remedio:2 urgencia:3 acidente:3 enfermeir:3',
    a: `Sim. Jesus curou no sábado e disse: “é lícito fazer o bem” (Mt 12:12). Ellen White escreve: “as obras de misericórdia e beneficência estavam em harmonia com o propósito do Senhor [...]. Aliviar os aflitos, confortar os tristes, é um trabalho de amor que faz honra ao dia de Deus” (*Beneficência Social*, p. 77). O folder lembra que remédios e alimentos devem ser comprados **durante a semana**, “exceto emergências”.`,
    src: ['mt12', 'bs_77', 'folder'], rel: ['trabalho', 'tarde'] },

  { id: 'escola_sabatina', q: 'O que é a Escola Sabatina?', k: 'escola_sabatina:4 escola_sabatica:4 licao:2 classe:2 estudo_da_biblia:2',
    a: `A Escola Sabatina “oferece a pais e filhos preciosa oportunidade para o estudo da Palavra de Deus”, e para aproveitá-la todos precisam “dedicar tempo ao estudo das lições” (*Conselhos Sobre a Escola Sabatina*, p. 41). Sugestões do folder: tenha a **assinatura da lição** para cada pessoa da família; incentive o **estudo pessoal** durante a semana; **saúde os visitantes**; e, ao entrar na igreja, faça uma **oração silenciosa**.`,
    src: ['css_41', 'folder'], rel: ['roupa', 'culto'] },

  { id: 'culto', q: 'Como fazer um bom culto de pôr do sol ou culto familiar?', k: 'culto:4 culto_familiar:5 adoracao_em_casa:3 devocional:2 familiar:2 oracao_em_familia:3 hinos:2',
    a: `Ideias do folder: **cante vários hinos**; leia um parágrafo do Espírito de Profecia; **dramatize** uma história bíblica; dê a cada pessoa um **texto bíblico** para ler; cada um agradece por algo específico da semana; **convide amigos**; prepare uma **recordação-surpresa**; e feche com um abraço desejando “feliz sábado”.\n\nMantenha **curto e espiritual**, sem monotonia (*Orientação da Criança*, p. 521): com um pouco de cuidado, “o culto familiar pode tornar-se agradável” (*Signs of the Times*, 1884).`,
    src: ['folder', 'oc_521', 'st_1884', 'tpi6_357b'], rel: ['inicio', 'amigos'] },

  { id: 'comida', q: 'O que comer ou cozinhar no sábado?', k: 'comida:3 comer:3 almoco:3 refeicao:3 cozinhar:3 jantar:2 cardapio:2 churrasco:2 lanche:2 receita:1',
    a: `“No sábado, não devemos aumentar a quantidade de alimento ou preparar maior variedade do que nos outros dias. Ao contrário, a refeição do sábado deve ser mais simples, e devemos comer menos, a fim de ter o espírito claro” (Test. 6, p. 357).\n\nO folder acrescenta: faça uma comida **simples, mas saborosa e atraente** (um prato especial é bem-vindo), convide amigos, tenha música instrumental cristã, conversem sobre o sermão e **todos ajudem** no preparo e na arrumação.`,
    src: ['tpi6_357', 'folder'], rel: ['restaurante', 'amigos'] },

  { id: 'salvacao', q: 'Guardar o sábado me salva? E se eu falhar?', k: 'salva:3 salvacao:3 salvo:3 perder_a_salvacao:4 falhei:3 falhar:3 errei:3 errar:3 culpa:3 pecado:2 perdoa:3 perdao:3 inferno:3 condena:3 legalismo:4 obrigacao:2 mereco:2',
    a: `A salvação é pela **graça**, mediante a fé em Cristo: “não vem de vós, é dom de Deus” (Ef 2:8-9). O sábado é **símbolo da nossa redenção em Cristo** (Crença Fundamental 20), não um jeito de “ganhar pontos”. Obedecemos por **amor** (Jo 14:15). Ellen White escreve que, para santificar o sábado, é preciso, “pela fé, tornar-se participante da justiça de Cristo” (DTN, p. 283).\n\nE se você falhar? “Se confessarmos os nossos pecados, Ele é fiel e justo para nos perdoar” (1 Jo 1:9): **confesse, receba perdão e recomece**.`,
    src: ['ef2', 'cf20', 'jo14', 'dtn_283', 'jo1'], rel: ['sinal', 'pais'] },

  { id: 'sinal', q: 'O que significa o sábado ser um “sinal”?', k: 'sinal:3 alianca:3 pacto:3 lealdade:3 identidade:2 simbolo:3',
    a: `Na Bíblia, o sábado é **sinal** entre Deus e o Seu povo, para lembrar que é Ele quem nos **santifica** (Êx 31:13-17; Ez 20:12, 20). Segundo a Crença Fundamental 20, é um símbolo da nossa redenção em Cristo, um sinal de santificação, uma demonstração de lealdade e um antegozo do futuro eterno. O documento oficial fala em **sinal distintivo de lealdade** a Deus e **sinal exterior da graça divina**.`,
    src: ['ex31', 'ez20', 'cf20', 'doc'], rel: ['oque', 'salvacao'] },

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
    a: `Pode — e o folder incentiva! Sugestões: convidar **amigos** para o almoço ou para um passeio na natureza; convidar amigos dos filhos para o **culto de pôr do sol**; fazer **visitas** e **estudo bíblico** com um amigo; e **divulgar** as atividades da igreja, pois “a comunidade que vive nos arredores da igreja precisa conhecer o que realizamos como cristãos”. Sem pressão: seja amigo(a) primeiro.`,
    src: ['folder'], rel: ['tarde', 'culto'] },

  { id: 'pais', q: 'Meus pais não guardam o sábado / não deixam. E agora?', k: 'meus_pais:4 pais_nao:4 minha_mae:3 meu_pai:3 familia_nao:4 proibe:3 nao_deixa:4 nao_deixam:4 sou_o_unico:4 sozinho_na_igreja:4 contra_minha:3',
    a: `Esse é um assunto delicado, e as fontes do servidor **não trazem um passo a passo** para ele. O que dá para dizer com segurança: **honrar pai e mãe** também é mandamento (Êx 20:12); converse com calma, mostre o que o sábado significa para você e **peça ajuda ao seu pastor ou líder JA** — eles já acompanharam situações parecidas. Ore, seja paciente e mostre o sábado como **alegria**, não como briga.\n\nSe a situação estiver pesada, fale com um adulto de confiança.`,
    src: ['ex20b'], rel: ['salvacao'], park: true },

  { id: 'jogo', q: 'Como o jogo avalia minhas respostas? Como ganho XP?', k: 'xp$:3 pontos:3 pontuacao:3 como_funciona:4 cargo:3 nivel:3 avalia:3 nota:2 como_ganho:4',
    a: `Cada resposta digitada é comparada com as **ideias principais** que as fontes trazem (não com palavras exatas). Quanto mais ideias você cobre, mais XP ganha. Nos **dilemas**, o XP vem de você **refletir, decidir e planejar** — não existe resposta certa para o que você faria. Se eu não reconhecer sua ideia, compare com a **resposta-modelo**. Os cargos vão de **Visitante** a **Embaixador do Sábado**. Veja mais em **#como-jogar**.`,
    src: [], rel: ['oque'] }
];

const FAQ_SUGGEST = ['domingo', 'celular', 'inicio', 'esporte', 'prova', 'salvacao', 'tarde', 'restaurante'];
