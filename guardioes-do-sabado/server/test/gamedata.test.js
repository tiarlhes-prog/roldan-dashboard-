'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const G = require('../src/gamedata');

test('gamedata.js está em dia com o conteúdo do jogo (rode "npm run gamedata" se falhar)', () => {
  const r = spawnSync(process.execPath, [path.join(__dirname, '..', 'scripts', 'gerar-gamedata.js'), '--check'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr || r.stdout);
});

test('gamedata tem o que o servidor valida', () => {
  assert.ok(G.CHANNELS.length >= 20 && G.CHANNELS.includes('ranking'));
  assert.ok(G.BADGES.length >= 10);
  assert.equal(G.ROLES[0].xp, 0);
  assert.ok(G.ROLES.every((r, i) => i === 0 || r.xp > G.ROLES[i - 1].xp), 'cargos em ordem crescente de XP');
  assert.ok(G.AVATARS.length >= 12);
  assert.ok(G.XP_BASE_MAX > 0 && G.XP_PER_WEEK > 0);
  assert.equal(new Set(G.CHANNELS).size, G.CHANNELS.length, 'ids de canal únicos');
});
