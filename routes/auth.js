const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');
const { authMiddleware, adminMiddleware, JWT_SECRET } = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });

  const db = getDb();
  const user = db.prepare('SELECT * FROM usuarios WHERE username = ?').get(username.trim().toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Usuário ou senha incorretos' });

  const token = jwt.sign(
    { id: user.id, username: user.username, nome: user.nome, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, user: { id: user.id, username: user.username, nome: user.nome, role: user.role } });
});

router.get('/me', authMiddleware, (req, res) => res.json({ user: req.user }));

router.get('/usuarios', authMiddleware, adminMiddleware, (req, res) => {
  const users = getDb()
    .prepare('SELECT id, username, nome, role, created_at FROM usuarios ORDER BY nome')
    .all();
  res.json(users);
});

router.post('/usuarios', authMiddleware, adminMiddleware, (req, res) => {
  const { username, password, nome, role } = req.body;
  if (!username || !password || !nome)
    return res.status(400).json({ error: 'username, password e nome são obrigatórios' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });

  try {
    const hash = bcrypt.hashSync(password, 10);
    const result = getDb()
      .prepare('INSERT INTO usuarios (username, password_hash, nome, role) VALUES (?, ?, ?, ?)')
      .run(username.trim().toLowerCase(), hash, nome.trim(), role === 'admin' ? 'admin' : 'user');
    res.status(201).json({ id: result.lastInsertRowid, username: username.trim().toLowerCase(), nome: nome.trim(), role: role || 'user' });
  } catch (err) {
    if (err.message.includes('UNIQUE'))
      return res.status(409).json({ error: 'Usuário já existe' });
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.delete('/usuarios/:id', authMiddleware, adminMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (user.username === 'admin') return res.status(403).json({ error: 'O admin principal não pode ser removido' });
  db.prepare('DELETE FROM usuarios WHERE id = ?').run(req.params.id);
  res.json({ message: 'Usuário removido' });
});

router.put('/senha', authMiddleware, (req, res) => {
  const { senha_atual, nova_senha } = req.body;
  if (!senha_atual || !nova_senha)
    return res.status(400).json({ error: 'Informe a senha atual e a nova senha' });
  if (nova_senha.length < 6)
    return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });

  const db = getDb();
  const user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(senha_atual, user.password_hash))
    return res.status(401).json({ error: 'Senha atual incorreta' });

  const hash = bcrypt.hashSync(nova_senha, 10);
  db.prepare('UPDATE usuarios SET password_hash = ? WHERE id = ?').run(hash, req.user.id);
  res.json({ message: 'Senha alterada com sucesso' });
});

module.exports = router;
