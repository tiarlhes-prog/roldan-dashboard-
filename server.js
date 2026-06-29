require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const { initDatabase } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

initDatabase();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/registros', require('./routes/registros'));
app.use('/api/relatorios', require('./routes/relatorios'));

app.use('/api/*', (req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor ROLDAN rodando em http://localhost:${PORT}`);
  console.log('   Pressione Ctrl+C para parar.\n');
});
