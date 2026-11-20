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
| 3 · Como guardar | sexta, manhã, tarde, Modo Sábado, **documento oficial na vida real**, despedida, quiz | o ciclo prático e o que o documento da Divisão Sul-Americana diz sobre esporte, festa, escola, trabalho, restaurante e viagem |
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

Depois de editar:

```
python3 build.py                     # regenera index.html
node tools/verificar-citacoes.js     # confere as citações contra fontes/
```

## De onde vem o conteúdo

Os textos-base estão em `fontes/` e são a referência para conferir qualquer citação:

| Fonte | Arquivo | Uso |
|---|---|---|
| Folder “O Significado e a Prática do Sábado” | `fontes/textos_do_folder.md` | citações de E. G. White, *Declarações da Igreja* (p. 198, o “teste do sábado”) e as sugestões práticas, **copiadas literalmente**. Onde diverge do documento, vale o documento |
| Documento oficial “Observância do Sábado” (Divisão Sul-Americana, 24/10/2023) | `fontes/observancia-do-sabado-dsa-2023.txt` | citado literalmente, seção por seção (cada seção é uma fonte: *Esportes e lazer*, *Restaurantes e alimentação* etc.) |
| Bíblia | referências no jogo | **parafraseada** ou em citações curtas de versões comuns; confira sempre na sua Bíblia |
| Crença Fundamental 20 | link no jogo | parafraseada |
| Lei 13.796/2019 (art. 7º-A da LDB) | link no jogo | alcance e prestação alternativa conferidos em fontes legislativas; o trecho “requerimento prévio e motivado” é da lei, mas a busca não o reproduziu: confira o texto. Não é orientação jurídica |

O texto do documento oficial foi colado pelo usuário na sessão de criação (20/11/2026). Na primeira versão do jogo ele ainda não tinha sido lido, e duas respostas do FAQ (esportes e restaurantes) estavam erradas por isso. Foram corrigidas.

`tools/verificar-citacoes.js` compara todo trecho entre aspas com `fontes/`. Na última execução: 210 trechos, 177 batem com as fontes; os 28 restantes são versos bíblicos, falas de personagens fictícios e rótulos do jogo (lista em `tools/citacoes-fora-das-fontes.json`).

### Regra editorial: quando divergem, vale o documento

Decisão do responsável pelo projeto em 20/11/2026: o documento oficial é mais atualizado que o folder, então **onde os dois divergem, o jogo segue o documento**. Foi aplicado assim:

- **Ações sociais no sábado:** vale o documento (“ações sociais que podem ser realizadas em outro dia não devem tomar as sagradas horas do sábado”). Saíram do jogo as sugestões do folder de doação de sangue e da campanha *Quebrando o Silêncio* como atividades de sábado. Ficam as visitas a enfermos, viúvas e órfãos, encarcerados, e compartilhar uma refeição.
- **Trabalho em instituições seculares:** vale o documento (abster-se de trabalhar, mesmo em instituições seculares de serviços básicos; plantões rotineiros em hospitais não adventistas são impróprios). Saiu a citação de *Declarações da Igreja*, p. 204-205 (“recordar os princípios”).
- **Restaurantes:** vale o documento (a frequência a restaurantes comerciais deve ser evitada). Saiu a opinião de F. D. Nichol, que admitia a exceção em viagem.
- **Delivery:** mantido como estava. Nenhuma das duas fontes fala; o jogo diz isso e aponta o princípio (alimento providenciado antes, compra fora das horas do sábado).
- **Citação do folder:** vale a do documento, *Testemunhos Para a Igreja*, v. 6, p. 356-359. O folder indicava “Testemunhos Seletos, vol. 6, p. 359”. O arquivo `fontes/textos_do_folder.md` mantém o texto original, sem alteração.

O jogo avisa isso ao jovem na janela “Fontes” (botão no topo de cada canal) e na resposta sobre o documento no `#pergunte-ao-neemias`. Se algum dia o folder for atualizado, a regra pode ser revista em `src/faq.js` e `src/content-*.js`, e conferida com `tools/verificar-citacoes.js`.

Sem fonte nas bases do jogo (o Neemias diz isso e anota a pergunta no caderno do jovem): marca da besta, conflito com os pais, delivery.

## Cuidados

- Personagens e situações são **fictícios** e marcados como NPC.
- Respostas livres podem trazer algo sensível: se aparecer linguagem de risco (automutilação, abuso), o jogo pausa e orienta a falar com um adulto de confiança e com o **CVV (188)**.
- Revisão pastoral e teológica da liderança é recomendada antes do uso com o grupo.
- `fontes/` contém textos de terceiros fornecidos para conferência. Se o repositório for tornado público, reavalie se esses arquivos devem ficar nele.

## Ideias para a próxima versão

- Ranking de turma com apelidos (opt-in), usando o Express + SQLite que o repositório já tem.
- Avaliação das respostas e Q&A com IA no servidor (a chave nunca vai no navegador), ancorada nas mesmas fontes.
- Modo “projetar na TV” para a turma jogar junto no sábado à tarde.
