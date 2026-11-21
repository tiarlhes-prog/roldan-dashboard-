# Publicar o Guardiões do Sábado no seu domínio (versão com login)

**Em uma frase:** o jogo com login roda como um **segundo serviço** do Railway (ao lado do dashboard do Roldan, sem mexer nele), com um **volume** para guardar o banco e um **subdomínio** seu apontando para ele.

**Resultado:** `https://guardioes.seudominio.com.br` (o nome você escolhe). Os jovens pedem acesso → você libera no **🛡️ Painel do líder** → eles jogam. Ninguém vê as respostas de ninguém (nem você). Todos os liberados veem o ranking.

> O código já está pronto e testado (59 testes do servidor + testes de navegador em 8 tamanhos de tela). O que falta é só o que depende da **sua conta**: criar o serviço, colar as variáveis, criar o volume e apontar o endereço.

---

## Antes de começar (2 minutos)

Separe:

1. **Acesso ao Railway** (o projeto onde já está o dashboard serve) e ao **painel de DNS** do seu domínio (Registro.br, Cloudflare, GoDaddy…).
2. **O endereço** que você quer, por exemplo `guardioes.seudominio.com.br`.
3. **A senha do líder**: 10 caracteres ou mais, só sua, que você **não use em nenhum outro lugar**. Uma frase longa funciona bem. Guarde no seu gerenciador de senhas.
4. **Quem responde pelos dados** (seu nome ou o da organização) e um **contato** (e-mail ou WhatsApp). Isso aparece no aviso de privacidade que os jovens e os responsáveis leem.

---

## Passo a passo (cerca de 15 minutos)

### 1) Criar o serviço

1. No Railway, abra o projeto → **New** → **GitHub Repo** → escolha `tiarlhes-prog/roldan-dashboard-`.
2. Abra o serviço novo → **Settings** e configure:
   - **Root Directory:** `guardioes-do-sabado/server`
   - **Branch** (em *Source*): `claude/sabbath-observance-interactive-e16wob` (ou `main`, se você já tiver feito o merge)
   - Nome sugerido: `guardioes`
   - Opcional, mas recomendado: **Watch Paths** = `/guardioes-do-sabado/server/**`, para este serviço só publicar de novo quando o jogo mudar (e o dashboard não ser reiniciado à toa).
3. **Ainda não faça o deploy.** Sem a senha do líder ele não inicia — é proposital.

### 2) Criar o volume (onde fica o banco de dados)

No serviço, crie um **Volume** com **Mount Path** `/data`.

> **Sem volume, os cadastros e o progresso somem a cada novo deploy.** É o erro mais caro desta etapa.

### 3) Colar as variáveis (aba *Variables*)

| Variável | O que colocar | Precisa? |
|---|---|---|
| `GS_ADMIN_PASSWORD` | a senha do líder (10+ caracteres) | **Sim** |
| `GS_DB_PATH` | `/data/guardioes.db` | **Sim** |
| `GS_ADMIN_USER` | o apelido do líder. Padrão: `Líder` (no login, maiúsculas e acentos não importam: `lider` funciona) | Não |
| `GS_RESPONSAVEL` | seu nome ou da organização | Recomendada |
| `GS_CONTATO` | e-mail ou WhatsApp para pedidos sobre os dados | Recomendada |
| `GS_TRUST_PROXY` | `1` (padrão). Use `2` **só** se for usar o Cloudflare com a “nuvem laranja” ligada | Não |

Não crie `PORT` (o Railway define sozinho) nem `GS_COOKIE_SECURE` (o padrão, ligado, é o certo para HTTPS).

### 4) Publicar e testar no endereço provisório

1. Clique em **Deploy**. Espere ficar **Active**.
2. Em **Settings → Networking**, gere o domínio do Railway (`…up.railway.app`) e abra.
3. Confira `https://…/healthz`: deve mostrar `ok`.
4. Entre como líder: apelido `Líder` e a senha que você definiu. Você verá o botão **🛡️**.
5. **Teste de 3 minutos, com o celular:** abra o endereço, toque em *Peça seu acesso*, cadastre um apelido de teste, volte ao 🛡️ no computador, **libere**, e veja o celular entrar sozinho. Depois apague a conta de teste (🛡️ → *Ativos* → *Remover*).

### 5) Apontar o seu endereço

1. No serviço: **Settings → Networking → Custom Domain** → digite `guardioes.seudominio.com.br`.
2. O Railway mostra um **destino CNAME**. No painel de DNS do seu domínio, crie um registro **CNAME** (nome `guardioes`) apontando para esse destino.
3. Aguarde de alguns minutos a algumas horas. O HTTPS é emitido automaticamente.

> As telas do Railway mudam com o tempo: se algum nome acima estiver diferente, procure o equivalente. O essencial é: **pasta raiz = `guardioes-do-sabado/server`**, **volume em `/data`**, **variáveis acima** e **domínio personalizado**.

### 6) Depois do primeiro acesso (1 minuto)

- Guarde `GS_ADMIN_PASSWORD` no seu gerenciador de senhas e **apague a variável do Railway**. A conta do líder já está criada (a senha fica no banco, embaralhada); a variável só é necessária de novo se o banco for recriado ou se você precisar redefinir a senha.
- Entre no 🛡️ e dê uma olhada no **Resumo**.

---

## Como convidar o grupo

Modelo de mensagem para o WhatsApp (ajuste o endereço):

> Pessoal, o jogo **Guardiões do Sábado** já está no ar: https://guardioes.seudominio.com.br
> Para entrar: 1) toque em **Peça seu acesso**; 2) escolha um apelido (sem sobrenome) e uma senha; 3) marque as duas caixas (seu responsável precisa autorizar); 4) espere a liberação — eu libero hoje!
> Dica no celular: depois de entrar, adicione à tela inicial (Configurações → *Colocar na tela inicial*).
> Suas respostas ficam só no seu aparelho: ninguém vê, nem eu. No ranking aparecem só apelido, cargo, XP e sábados guardados.

**Dica de segurança prática:** só libere quem você **reconhece** (o painel mostra o nome real e o grupo) e cujo responsável você sabe que autorizou. É a sua conferência de idade e de autorização.

---

## Dia a dia

| Quero… | Faça |
|---|---|
| Liberar um pedido | 🛡️ → **Pendentes** → *Liberar acesso* (o ponto vermelho mostra quantos esperam) |
| Bloquear / desbloquear | 🛡️ → **Ativos** → *Bloquear* (derruba o acesso na hora) |
| Jovem esqueceu a senha | 🛡️ → **Ativos** → *Nova senha*: o painel mostra uma senha temporária **uma única vez**; passe para a pessoa e peça para trocar em *Configurações → Trocar minha senha* |
| Apagar uma conta | 🛡️ → *Remover* (apaga conta, progresso e sessões) ou o jovem em *Configurações → Excluir minha conta* |
| **Eu** esqueci a senha do líder | No Railway, defina `GS_ADMIN_PASSWORD` com a senha nova **e** `GS_ADMIN_RESET=1`, reinicie, entre, e **remova** `GS_ADMIN_RESET` |
| Fazer backup | 🛡️ → **Resumo** → *Baixar backup (.db)*. Faça toda semana e guarde em lugar seguro: o arquivo tem dados pessoais (sem respostas) |
| Ver o que aconteceu | Railway → *Deployments* → *View logs*. As ações do líder aparecem, por exemplo: `[líder Líder] liberou o acesso de #3 (Davi_10)` |
| Atualizar o jogo | Edite `src/`, rode `python3 build.py --server`, faça *commit* e *push*: o Railway publica de novo (o banco no volume continua intacto) |

---

## Se algo der errado

| Sintoma | Provável causa |
|---|---|
| Deploy falha com “Defina GS_ADMIN_PASSWORD…” | A variável não foi criada ou tem menos de 10 caracteres |
| Os cadastros somem depois de um novo deploy | O volume não está montado em `/data` ou `GS_DB_PATH` não aponta para dentro dele |
| Aparece “Sua sessão terminou” toda hora | O endereço está sem HTTPS (o cookie de sessão exige HTTPS) |
| Vários jovens recebem “Muitas tentativas” | Todos aparecem com o mesmo IP: se usa Cloudflare com a nuvem laranja, defina `GS_TRUST_PROXY=2` |
| `better-sqlite3`/versão do Node no build | Confira se a pasta raiz é `guardioes-do-sabado/server` (lá estão o `nixpacks.toml` e o `.node-version` que pedem Node 22) |
| Quero testar no meu computador | `cd server && npm ci`, depois `GS_COOKIE_SECURE=0 GS_ADMIN_PASSWORD='uma-senha-longa' npm start` e abra `http://localhost:3000` |

---

## Segurança e privacidade: o que já está feito e o que é com você

**Já está no código (e testado):**

- As respostas, decisões, diário e perguntas **nunca vão ao servidor** (o teste automatizado escreve um texto-isca e varre todas as tabelas do banco).
- Cadastro nasce **pendente**; só o líder libera. Bloquear derruba a sessão imediatamente.
- Senhas com bcrypt; sessão em cookie `HttpOnly` + `SameSite=Lax` + `Secure`, guardada só como hash; proteção contra CSRF; limite de tentativas de login por apelido+aparelho (um colega não consegue trancar a conta do outro); cabeçalhos de segurança com política de conteúdo sem script embutido e **nenhuma chamada a serviços de terceiros** (nem fontes externas).
- Dados mínimos: sem e-mail, telefone, CPF, data de nascimento ou localização.
- O jovem (ou o responsável) pode **excluir a conta** sozinho, e o líder também.

**É com você:**

1. **Confirmar com um advogado ou encarregado de dados** o aviso de privacidade e o fluxo antes de divulgar. O público é de adolescentes e a conta liga uma pessoa a um grupo religioso (convicção religiosa é dado pessoal sensível na LGPD). **Isto não é aconselhamento jurídico.** Pontos de partida que usei (resumos; confirme nas fontes):
   - ECA Digital (Lei 15.211/2025) em vigor desde 17/03/2026, fiscalizada pela ANPD; a autodeclaração de idade deixou de bastar para certos serviços. [Agência Senado](https://www12.senado.leg.br/noticias/materias/2026/03/17/eca-digital-para-protecao-on-line-de-criancas-e-adolescentes-entra-em-vigor) · [Machado Meyer](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/estatuto-digital-da-crianca-e-do-adolescente-lei-n-15-211-2025-entra-em-vigor-em-17-de-marco-de-2026)
   - LGPD, art. 5º, II (dado pessoal sensível: convicção religiosa) e art. 14 (tratamento de dados de crianças e adolescentes no melhor interesse deles): [texto compilado no Planalto](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm)
2. **Guardar as autorizações dos responsáveis** (papel ou mensagem) de quem você libera. A caixa marcada no cadastro é autodeclarada.
3. **Fazer backup** e proteger a conta do Railway e do GitHub com verificação em duas etapas.

**Limitações honestas:**

- O **ranking é por honra**: o XP vem do aparelho do jovem. O servidor limita o teto e nunca deixa o número diminuir, mas quem mexer no navegador ainda consegue inflar o próprio valor até esse teto.
- **Não há recuperação de senha automática** (de propósito: não coletamos e-mail). Quem esquece pede ao líder uma senha temporária.
- O **teclado do iPhone (Safari)** não foi testado em aparelho real. Faça um teste rápido num iPhone e num Android antes de divulgar.
- Um serviço só, com SQLite: sobra para centenas de jovens, mas não é alta disponibilidade.

---

## Alternativas (se não for Railway)

- **Sem login:** hospede só o `index.html` em qualquer hospedagem estática (cada jovem joga sozinho, sem ranking).
- **Servidor próprio (VPS Ubuntu):** instale Node 22, copie a pasta `server/`, rode `npm ci --omit=dev` e `GS_ADMIN_PASSWORD='…' GS_DB_PATH=/var/lib/guardioes/guardioes.db pm2 start src/server.js --name guardioes`; coloque o Nginx na frente com HTTPS (Certbot) repassando `X-Forwarded-For`, e use `GS_TRUST_PROXY=1`. Se **não** houver proxy na frente, use `GS_TRUST_PROXY=0`.
