#!/usr/bin/env node
/* Recupera o acesso do líder: define a senha da conta de superadmin a partir de GS_ADMIN_PASSWORD
 * e derruba as sessões abertas.   Uso:  GS_ADMIN_PASSWORD='nova-senha-forte' npm run admin:reset */
'use strict';
const path = require('node:path');
const bcrypt = require('bcryptjs');
const { abrirBanco } = require('../src/db');

const senha = process.env.GS_ADMIN_PASSWORD || '';
if (senha.length < 10) { console.error('✖ Defina GS_ADMIN_PASSWORD com pelo menos 10 caracteres.'); process.exit(1); }
const db = abrirBanco(process.env.GS_DB_PATH || path.join(__dirname, '..', 'data', 'guardioes.db'));
const adm = db.prepare("SELECT id, apelido FROM gs_users WHERE role = 'superadmin' LIMIT 1").get();
if (!adm) { console.error('✖ Ainda não existe conta de líder. Inicie o servidor uma vez com GS_ADMIN_PASSWORD definida.'); process.exit(1); }
db.prepare('UPDATE gs_users SET senha_hash = ? WHERE id = ?').run(bcrypt.hashSync(senha, 12), adm.id);
db.prepare('DELETE FROM gs_sessions WHERE user_id = ?').run(adm.id);
console.log(`✓ Senha do líder "${adm.apelido}" redefinida. Entre com o novo valor de GS_ADMIN_PASSWORD.`);
db.close();
