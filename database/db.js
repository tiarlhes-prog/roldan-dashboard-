const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'roldan.db');
const dataDir = path.dirname(DB_PATH);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDatabase() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nome        TEXT NOT NULL,
      role        TEXT NOT NULL DEFAULT 'user',
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registros_diarios (
      id                       INTEGER PRIMARY KEY AUTOINCREMENT,
      data_atendimento         DATE NOT NULL,
      turno                    TEXT NOT NULL,
      responsavel              TEXT NOT NULL,
      status_dia               TEXT NOT NULL,
      ligacoes_totais          INTEGER NOT NULL DEFAULT 0,
      ligacoes_atendidas       INTEGER NOT NULL DEFAULT 0,
      contatos_whatsapp        INTEGER NOT NULL DEFAULT 0,
      agendamentos_confirmados INTEGER NOT NULL DEFAULT 0,
      compareceram_visita      INTEGER NOT NULL DEFAULT 0,
      usuario_id               INTEGER REFERENCES usuarios(id),
      created_at               DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at               DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agendamentos_unidade (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      registro_id INTEGER NOT NULL REFERENCES registros_diarios(id) ON DELETE CASCADE,
      unidade     TEXT NOT NULL,
      agendamentos INTEGER NOT NULL DEFAULT 0,
      compareceram INTEGER NOT NULL DEFAULT 0
    );
  `);

  const adminExists = database.prepare('SELECT id FROM usuarios WHERE username = ?').get('admin');
  if (!adminExists) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    database.prepare(
      'INSERT INTO usuarios (username, password_hash, nome, role) VALUES (?, ?, ?, ?)'
    ).run('admin', hash, 'Administrador', 'admin');
    console.log('✓ Usuário admin criado  →  login: admin  |  senha: admin123');
    console.log('  ⚠️  Altere a senha após o primeiro acesso!\n');
  }
}

module.exports = { getDb, initDatabase };
