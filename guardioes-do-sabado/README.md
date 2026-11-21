# Guardiões do Sábado

Jogo interativo em formato de servidor de chat para adolescentes adventistas. O objetivo é duplo: **entender** o sábado (cabeça) e **decidir e praticar** sua guarda pela fé (coração e mãos). Não há alternativas A/B/C: o jovem responde **escrevendo**.

**Três versões, o mesmo jogo:**

| Versão | Para quê | Login | Como gerar |
|---|---|---|---|
| **Com login (servidor)** | o grupo de verdade: o líder libera quem entra e todos veem o ranking | sim, com liberação do líder | `python3 build.py --server` → `server/public/` |
| **Arquivo único** | testar, projetar ou hospedar sem servidor | não | `python3 build.py` → `index.html` |
| **Artifact (claude.ai)** | demonstração dentro do Claude | não | `python3 build.py --artifact CAMINHO` |

- **Privacidade por desenho:** o que o jovem *escreve* (respostas, decisões de fé, diário, perguntas ao Neemias) **nunca sai do aparelho dele**, em nenhuma das versões. Na versão com login o servidor guarda só a conta (apelido, nome e grupo que só o líder vê, avatar, senha embaralhada) e números/ids do progresso (XP, canais concluídos, conquistas, sábados guardados) para montar o ranking.
- **Feito para celular primeiro:** layout em servidor de chat (trilho, canais por fase, conversa e painel do jogador) com gavetas e janelas que sobem da base no celular, alvos de toque de 44 px, teclado virtual e áreas seguras tratados, e instalação na tela inicial. Funciona no computador e em tema escuro ou claro.

## Publicar (versão com login)

Passo a passo para quem não é programador, incluindo o subdomínio: **[PUBLICAR.md](PUBLICAR.md)**.

## Hospedar sem login (arquivo único)

- Abra `index.html` num navegador. Para o progresso ser salvo de forma confiável, **sirva por HTTP(S)** (GitHub Pages, Netlify ou qualquer hospedagem estática). Abrir direto do disco (`file://`) pode não persistir o progresso em alguns navegadores.
- Nessa versão não existe conta nem ranking: cada jovem joga sozinho e o progresso fica só no navegador dele.
- A pasta não é servida pelo dashboard do Roldan: ela está fora de `public/`.

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

- `auth.js`: tudo da versão com login (portão de acesso, sincronização, ranking, painel do líder). Fica inerte nas outras versões.
- `page.css`: ajustes só das versões de página (áreas seguras, teclado). `icons/`: ícones do app (gerados por `node tools/gerar-icones.js`).

Depois de editar:

```
python3 build.py --server            # regenera server/public (versão com login) — este é o que vai para o Railway
python3 build.py                     # regenera index.html (arquivo único, sem login)
node tools/verificar-citacoes.js     # confere as citações contra fontes/
cd server && npm run gamedata        # só se mudou canais, cargos, conquistas ou avatares (o servidor valida o progresso com esses ids)
```

Depois, `git add -A`, `git commit` e `git push`: o Railway publica de novo sozinho.

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

## Testes

| O que | Como | O que cobre |
|---|---|---|
| Servidor | `cd server && npm ci && npm test` | 59 testes: cadastro pendente, aprovação só do líder, sessões, bloqueio na hora, progresso com teto contra trapaça, ranking, **respostas nunca no banco**, CSRF, limites de tentativas, cabeçalhos de segurança, compressão, recuperação da senha do líder |
| Navegador (precisa do Playwright, Python 3 e `npm ci` em `server/`) | `node tests-navegador/e2e-acesso.js`, `e2e-layout.js` e `e2e-contas.js` | **acesso** (34 verificações): pedir acesso → líder libera → jogo → sincronização sem respostas → ranking → sessão cai → bloqueio. **layout** (152): 8 tamanhos de tela, de 320 a 1920 px, sem rolagem lateral, alvos de toque, janelas que cabem. **contas** (19): recarregar em cada etapa, segundo aparelho, trocar de conta, trocar senha, excluir conta, HTML/script malicioso, servidor fora do ar, salvar o cartão |
| Build em dia | `python3 build.py --check` | confere se `server/public` e `index.html` (o que vai ao Railway) são exatamente o que o `src/` gera |
| Citações | `node tools/verificar-citacoes.js` | 210 trechos contra os textos-base |

Limite conhecido: o comportamento do **teclado virtual no iPhone (Safari)** não pôde ser testado em aparelho real; foi tratado com a API `visualViewport` e testado no Chromium em modo celular. Vale um teste rápido num iPhone antes de divulgar.

## Cuidados

- **Ranking é por honra:** o XP vem do aparelho do jovem, então quem mexer no navegador consegue inflar o próprio número. O servidor limita o teto (XP e sábados possíveis para a idade da conta) e nunca deixa o progresso diminuir, mas não há como provar o que foi feito offline. Trate como brincadeira de constância, não como prova.
- **LGPD / ECA Digital:** o jogo foi desenhado com o mínimo de dados, sem anúncios, sem rastreadores e sem serviços de terceiros, e o líder só libera quem conhece (a liberação serve também como conferência da autorização do responsável). Mesmo assim, é um serviço usado por **adolescentes** e liga uma conta a um grupo religioso: leve o aviso de privacidade (`openPrivacy` em `src/auth.js`) e o fluxo ao seu advogado ou encarregado de dados antes de divulgar. Não é aconselhamento jurídico.


- Personagens e situações são **fictícios** e marcados como NPC.
- Respostas livres podem trazer algo sensível: se aparecer linguagem de risco (automutilação, abuso), o jogo pausa e orienta a falar com um adulto de confiança e com o **CVV (188)**.
- Revisão pastoral e teológica da liderança é recomendada antes do uso com o grupo.
- `fontes/` contém textos de terceiros fornecidos para conferência. Se o repositório for tornado público, reavalie se esses arquivos devem ficar nele.

## Ideias para a próxima versão

- Aviso ao líder por WhatsApp/e-mail quando chegar um pedido de acesso (hoje o painel mostra o contador e avisa com o jogo aberto).
- Avaliação das respostas e Q&A com IA no servidor (a chave nunca vai no navegador), ancorada nas mesmas fontes.
- Modo “projetar na TV” para a turma jogar junto no sábado à tarde.
- Trocar senha temporária obrigatória no primeiro acesso depois que o líder gera uma nova.
