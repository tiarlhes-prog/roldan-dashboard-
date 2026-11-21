#!/usr/bin/env node
/* Gera server/src/gamedata.js a partir do conteúdo do jogo (src/content-*.js),
 * para o servidor conhecer os canais, cargos e conquistas oficiais sem cópia manual.
 *   node scripts/gerar-gamedata.js          -> grava src/gamedata.js
 *   node scripts/gerar-gamedata.js --check  -> só confere (sai com 1 se estiver desatualizado) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const RAIZ = path.resolve(__dirname, '..', '..');
const code = ['content-a.js', 'content-b.js'].map(f => fs.readFileSync(path.join(RAIZ, 'src', f), 'utf8')).join('\n') + '\n({CH, ROLES, BADGES, EMOJIS})';
const D = vm.runInNewContext(code, {});
const dados = {
  ROLES: D.ROLES.map(r => ({ n: r.n, xp: r.xp, e: r.e })),
  CHANNELS: D.CH.map(c => c.id),
  BADGES: Object.keys(D.BADGES),
  AVATARS: D.EMOJIS,
  XP_BASE_MAX: 5000,   // teto de XP possível só jogando as fases (um jogador perfeito faz ~4.400)
  XP_PER_WEEK: 300     // cada semana de missão pode render até ~220 XP; folga para o diário
};
const texto = "'use strict';\n// GERADO por scripts/gerar-gamedata.js a partir de ../src/content-*.js. Não edite à mão.\nmodule.exports = " + JSON.stringify(dados, null, 2) + ";\n";
const destino = path.join(__dirname, '..', 'src', 'gamedata.js');
if (process.argv.includes('--check')) {
  const atual = fs.existsSync(destino) ? fs.readFileSync(destino, 'utf8') : '';
  if (atual !== texto) { console.error('gamedata.js está desatualizado: rode "npm run gamedata".'); process.exit(1); }
  console.log('gamedata.js em dia com o conteúdo do jogo.'); process.exit(0);
}
fs.writeFileSync(destino, texto);
console.log('gamedata.js gerado:', dados.CHANNELS.length, 'canais,', dados.BADGES.length, 'conquistas,', dados.ROLES.length, 'cargos.');
