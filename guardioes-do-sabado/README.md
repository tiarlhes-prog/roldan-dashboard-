# Guardiões do Sábado

Jogo interativo em formato de servidor de chat para adolescentes adventistas. O objetivo é duplo: **entender** o sábado (cabeça) e **decidir e praticar** sua guarda pela fé (coração e mãos). Não há alternativas A/B/C: o jovem responde **escrevendo**.

- Uma única página (`index.html`), sem servidor, sem cadastro e sem envio de dados. O progresso fica só no navegador do jovem (`localStorage`).
- Layout de servidor de chat: trilho, canais por fase, conversa e painel do jogador. Funciona no celular (gavetas laterais) e em tema escuro ou claro.

## Como abrir ou hospedar

- Abra `index.html` num navegador. Para o progresso ser salvo de forma confiável, **sirva por HTTP(S)** (GitHub Pages, Netlify, o próprio Railway, ou qualquer hospedagem estática). Abrir direto do disco (`file://`) pode não persistir o progresso em alguns navegadores.
- A pasta não é servida pelo dashboard do Roldan: ela está fora de `public/`. Para publicar por lá, copie `index.html` para `public/guardioes/` (decisão sua).

## Estrutura da jornada

| Fase | Canais | O que treina |
|---|---|---|
| Comece aqui | `#boas-vindas`, `#como-jogar` | apelido, avatar, check-in inicial |
| 1 · Origem | memorial do Criador, sinal e aliança, quiz | por que o sábado existe |
| 2 · Jesus e o sábado | Jesus e o sábado, deleite, quiz | sábado como presente, não peso |
| 3 · Como guardar | sexta, manhã, tarde, Modo Sábado, despedida, quiz | o ciclo prático, do pôr do sol ao pôr do sol |
| 4 · Dilemas | 7 situações reais de 2026 | teoria × prática, decisão de fé, missão de bolso |
| 5 · Chefão | plano pessoal + compromisso | plano de sábado, check-in final, Cartão de Compromisso |
| Sempre abertos | `#pergunte-ao-neemias`, `#missao-da-semana` | perguntas livres; checklist semanal + diário |

**Dilemas:** torneio de jogo online, prova no sábado, aniversário na sexta à noite, ofensiva e celular, primeiro emprego, debate com colega, sábado sozinho. Em cada um o jovem responde em duas rodadas (a segunda com pressão), vê a comparação *Teoria × Prática* com fontes, preenche um **formulário de decisão** (que vira texto real: a mensagem ao time, o pedido à coordenação, a regra do Modo Sábado) e recebe uma **missão de bolso**.

## Como as respostas são avaliadas

Sem IA e sem servidor. Cada pergunta tem **conceitos** (expressões regulares sobre o texto normalizado, sem acento) e um limite de acerto. O jogo mostra o que a resposta cobriu, o que faltou e a **resposta-modelo com a fonte**. Perguntas de reflexão e dilemas não têm resposta certa: o XP vem de refletir, decidir e planejar. É uma heurística: se o jovem escrever com outras palavras, o jogo mostra o modelo em vez de reprovar.

## Como editar o conteúdo

Tudo o que o jovem lê fica em `src/`:

- `content-a.js`: cargos, conquistas, fontes (`SRC`), Fases 0 a 3.
- `content-b.js`: dilemas, Chefão, canais livres, itens da missão semanal.
- `faq.js`: base do `#pergunte-ao-neemias` (palavras-chave com peso: `radical:peso`).
- `engine1.js`, `engine2.js`, `style.css`, `template.html`: motor, visual e estrutura.

Depois de editar: `python3 build.py` regenera o `index.html`.

## De onde vem o conteúdo (revise antes de divulgar)

- **Folder “O Significado e a Prática do Sábado”**: citações de E. G. White e sugestões práticas, copiadas literalmente do texto fornecido. A citação de *Testemunhos Seletos, vol. 6, p. 359* foi mantida como está no folder; vale conferir (pode ser *Testemunhos Para a Igreja, vol. 6*).
- **Bíblia**: referências sempre indicadas; os versos são **parafraseados**.
- **Documento oficial “Observância do Sábado” (Igreja Adventista)**: a página **não pôde ser lida diretamente** na sessão de criação (host bloqueado). O que o jogo diz sobre ele (sinal de lealdade, sinal da graça, cultos breves ao pôr do sol, preparação antes do pôr do sol de sexta) veio de resumos retornados por busca. **Confira com o texto da página antes de divulgar.**
- **Crença Fundamental 20**: parafraseada.
- **Lei 13.796/2019 (art. 7º-A da LDB)**: existência, alcance e prestação alternativa confirmados em fontes legislativas; o trecho “requerimento prévio e motivado” é da lei, mas a busca não o reproduziu — confira o texto oficial (link no jogo). Não é orientação jurídica.
- **Sem fonte nas bases do jogo** (o Neemias diz isso e anota a pergunta no caderno do jovem): esportes e campeonatos, delivery, marca da besta, conflito com os pais.

## Cuidados

- Personagens e situações são **fictícios** e marcados como NPC.
- Respostas livres podem trazer algo sensível: se aparecer linguagem de risco (automutilação, abuso), o jogo pausa e orienta a falar com um adulto de confiança e com o **CVV (188)**.
- Revisão pastoral e teológica da liderança é recomendada antes do uso com o grupo.

## Ideias para a próxima versão

- Ranking de turma com apelidos (opt-in), usando o Express + SQLite que o repositório já tem.
- Avaliação das respostas e Q&A com IA no servidor (a chave nunca vai no navegador), ancorada nas mesmas fontes.
- Modo “projetar na TV” para a turma jogar junto no sábado à tarde.
