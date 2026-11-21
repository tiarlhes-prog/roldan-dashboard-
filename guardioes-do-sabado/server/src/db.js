'use strict';
/* Banco SQLite. IMPORTANTE (privacidade): não existe tabela nem coluna para respostas, reflexões, decisões,
 * diário ou perguntas dos jovens. Elas ficam só no aparelho de cada um. Aqui há apenas conta, progresso e ranking. */
const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

function abrirBanco(caminho) {
  if (caminho !== ':memory:') fs.mkdirSync(path.dirname(caminho), { recursive: true });
  const db = new Database(caminho);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  db.exec(`
    CREATE TABLE IF NOT EXISTS gs_users (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      apelido         TEXT    NOT NULL,                       -- aparece no ranking
      chave           TEXT    NOT NULL UNIQUE,                -- apelido normalizado (login e unicidade)
      senha_hash      TEXT    NOT NULL,
      nome            TEXT    NOT NULL,                       -- só o líder vê (para reconhecer quem pediu acesso)
      grupo           TEXT    NOT NULL DEFAULT '',            -- igreja / clube / turma (opcional)
      avatar          TEXT    NOT NULL DEFAULT '🙂',
      status          TEXT    NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','ativo','bloqueado')),
      role            TEXT    NOT NULL DEFAULT 'jogador'  CHECK (role IN ('jogador','superadmin')),
      mostrar_ranking INTEGER NOT NULL DEFAULT 1,
      aceite_em       TEXT,
      aceite_versao   TEXT,
      criado_em       TEXT    NOT NULL,
      aprovado_em     TEXT,
      aprovado_por    INTEGER,
      ultimo_acesso   TEXT
    );
    CREATE TABLE IF NOT EXISTS gs_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES gs_users(id) ON DELETE CASCADE,
      criado_em  TEXT NOT NULL,
      expira_em  TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS gs_sessions_user ON gs_sessions(user_id);
    CREATE TABLE IF NOT EXISTS gs_progress (
      user_id       INTEGER PRIMARY KEY REFERENCES gs_users(id) ON DELETE CASCADE,
      xp            INTEGER NOT NULL DEFAULT 0,
      done          TEXT    NOT NULL DEFAULT '[]',            -- ids dos canais concluídos (sem texto)
      badges        TEXT    NOT NULL DEFAULT '[]',            -- ids das conquistas
      streak        INTEGER NOT NULL DEFAULT 0,
      semanas       INTEGER NOT NULL DEFAULT 0,               -- sábados guardados
      atualizado_em TEXT    NOT NULL
    );
  `);
  return db;
}

module.exports = { abrirBanco };
