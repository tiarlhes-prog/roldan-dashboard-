# Rodar o Guardiões do Sábado no seu computador (só para testar)

Isto roda o jogo **com login, liberação pelo líder e ranking** no seu próprio computador. Serve para **testar** e ensaiar. **Não é a publicação**: o grupo só consegue entrar se o seu computador estiver ligado e exposto à internet, e eu não recomendo isso com dados de adolescentes. Para publicar de verdade, veja `PUBLICAR.md`.

## Passo a passo

1. **Instale o Node.js** (versão 22 ou mais nova; a "LTS" do site serve): https://nodejs.org
2. **Windows:** dê dois cliques em `INICIAR-WINDOWS.bat`.
   **Mac:** dê dois cliques em `INICIAR-MAC-LINUX.command` (se o Mac reclamar de permissão: abra o Terminal na pasta e rode `sh INICIAR-MAC-LINUX.command`).
3. Na primeira vez ele instala as dependências (1 a 2 minutos). Depois o navegador abre em **http://localhost:3000**.
4. Entre como líder: apelido **Líder** e senha **teste-local-123456** (senha de teste, só vale no seu computador).
5. Para testar o fluxo do jovem: abra uma **janela anônima**, toque em *Peça seu acesso*, cadastre-se, volte à janela do líder, abra o **🛡️** e libere.

## Testar no celular (mesmo Wi-Fi)

Descubra o IP do computador (Windows: `ipconfig`; Mac: Ajustes → Rede) e abra no celular `http://IP-DO-COMPUTADOR:3000`. Se não abrir, o firewall do computador está bloqueando a porta 3000.

## Se algo falhar

- **"Node não encontrado" ou "versão antiga":** instale/atualize o Node.js e abra de novo.
- **Erro ao instalar (`better-sqlite3`):** costuma ser internet bloqueada ou Node antigo. Me envie um print da janela.
- **Quer outra senha de líder:** abra o Terminal na pasta `server` e rode, no Windows, `set GS_ADMIN_PASSWORD=sua-senha-longa` e depois `INICIAR-WINDOWS.bat`; no Mac, `GS_ADMIN_PASSWORD='sua-senha-longa' sh INICIAR-MAC-LINUX.command`. A senha só é lida na **primeira** vez (quando o banco é criado). Para recomeçar do zero, apague a pasta `server/data`.
- Os dados de teste ficam em `server/data/` e não vão para o GitHub.
