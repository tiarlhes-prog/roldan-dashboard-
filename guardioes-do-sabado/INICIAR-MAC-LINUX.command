#!/bin/sh
# Guardiões do Sábado: roda o jogo COM login no seu computador, só para TESTAR (não é a publicação).
# Precisa do Node.js 22 ou mais novo (https://nodejs.org). No Mac: dois cliques (ou, no Terminal: sh INICIAR-MAC-LINUX.command).
cd "$(dirname "$0")/server" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Falta instalar o Node.js. Baixe a versão LTS em https://nodejs.org e rode este arquivo de novo."
  exit 1
fi
MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$MAJOR" -lt 22 ]; then
  echo "O Node.js instalado é antigo (versão $MAJOR). Instale a LTS mais nova em https://nodejs.org e tente de novo."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Instalando as dependências (só na primeira vez, pode levar 1 ou 2 minutos)..."
  npm ci --omit=dev || { echo "A instalação falhou. Confira a internet e tente de novo."; exit 1; }
fi

export GS_COOKIE_SECURE=0
export GS_ADMIN_PASSWORD="${GS_ADMIN_PASSWORD:-teste-local-123456}"
export PORT="${PORT:-3000}"

echo
echo "======================================================"
echo " Guardiões do Sábado rodando no seu computador"
echo " Endereço:  http://localhost:$PORT"
echo " Líder:     Líder   /   senha de teste: teste-local-123456"
echo " Para parar: Ctrl+C (ou feche esta janela)."
echo "======================================================"
echo
( sleep 2; open "http://localhost:$PORT" 2>/dev/null || xdg-open "http://localhost:$PORT" 2>/dev/null ) &
exec node src/server.js
