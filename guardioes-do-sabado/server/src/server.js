'use strict';
/* Ponto de entrada. Variáveis de ambiente (veja .env.example):
 *   GS_ADMIN_USER / GS_ADMIN_PASSWORD   conta do líder (superadmin), criada no primeiro início
 *   GS_ADMIN_RESET=1                    redefine a senha do líder para GS_ADMIN_PASSWORD neste início (depois remova)
 *   GS_DB_PATH                          caminho do banco (em produção: dentro do volume, ex.: /data/guardioes.db)
 *   GS_COOKIE_SECURE=0                  só para testar em http local; em produção deixe ligado (HTTPS)
 *   GS_TRUST_PROXY                      quantos proxies existem na frente (Railway/Nginx = 1)
 *   GS_RESPONSAVEL / GS_CONTATO         quem responde pelos dados, mostrado no aviso de privacidade */
const { criarApp } = require('./app');

let inst;
try {
  inst = criarApp({
    dbPath: process.env.GS_DB_PATH,
    adminUser: process.env.GS_ADMIN_USER,
    adminPassword: process.env.GS_ADMIN_PASSWORD,
    adminReset: process.env.GS_ADMIN_RESET === '1',
    cookieSecure: process.env.GS_COOKIE_SECURE !== '0',
    trustProxy: process.env.GS_TRUST_PROXY === undefined || process.env.GS_TRUST_PROXY === '' ? 1 : Number(process.env.GS_TRUST_PROXY),
    responsavel: process.env.GS_RESPONSAVEL,
    contato: process.env.GS_CONTATO
  });
} catch (e) {
  console.error('\n✖ Não foi possível iniciar: ' + e.message + '\n');
  process.exit(1);
}

const porta = Number(process.env.PORT) || 3000;
const servidor = inst.app.listen(porta, '0.0.0.0', () => console.log(`✓ Guardiões do Sábado no ar, porta ${porta}`));
const encerrar = () => { servidor.close(() => { inst.fechar(); process.exit(0); }); setTimeout(() => process.exit(0), 5000).unref(); };
process.on('SIGTERM', encerrar);
process.on('SIGINT', encerrar);
