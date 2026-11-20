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
