const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');
const { authMiddleware } = require('../middleware/auth');

const UNIDADES = [
  'Atibaia', 'Bragança Paulista', 'Caraguatatuba', 'Gopoúva',
  'Jacareí', 'Lorena', 'Mogi das Cruzes', 'São José dos Campos',
  'Taubaté', 'Vila Galvão'
];

function getUnidades(db, registroId) {
  return db.prepare(
    'SELECT * FROM agendamentos_unidade WHERE registro_id = ? ORDER BY id'
  ).all(registroId);
}

function buildWhere(query) {
  const { data_inicio, data_fim, responsavel } = query;
  const conditions = [];
  const params = [];

  if (data_inicio) { conditions.push('r.data_atendimento >= ?'); params.push(data_inicio); }
  if (data_fim)    { conditions.push('r.data_atendimento <= ?'); params.push(data_fim); }
  if (responsavel) { conditions.push('r.responsavel LIKE ?');    params.push(`%${responsavel}%`); }

  return { where: conditions.length ? conditions.join(' AND ') : '1=1', params };
}

router.get('/', authMiddleware, (req, res) => {
  const { where, params } = buildWhere(req.query);
  const db = getDb();

  const registros = db.prepare(`
    SELECT r.*, u.nome AS usuario_nome
    FROM registros_diarios r
    LEFT JOIN usuarios u ON r.usuario_id = u.id
    WHERE ${where}
    ORDER BY r.data_atendimento DESC, r.id DESC
  `).all(...params);

  for (const r of registros) r.unidades = getUnidades(db, r.id);
  res.json(registros);
});

router.get('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const registro = db.prepare(`
    SELECT r.*, u.nome AS usuario_nome
    FROM registros_diarios r
    LEFT JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.id = ?
  `).get(req.params.id);

  if (!registro) return res.status(404).json({ error: 'Registro não encontrado' });
  registro.unidades = getUnidades(db, registro.id);
  res.json(registro);
});

router.post('/', authMiddleware, (req, res) => {
  const {
    data_atendimento, turno, responsavel, status_dia,
    ligacoes_totais = 0, contatos_whatsapp = 0,
    agendamentos_confirmados = 0, unidades = []
  } = req.body;

  if (!data_atendimento || !turno || !responsavel || !status_dia)
    return res.status(400).json({ error: 'Campos obrigatórios: data_atendimento, turno, responsavel, status_dia' });

  const db = getDb();
  const insReg = db.prepare(`
    INSERT INTO registros_diarios
    (data_atendimento,turno,responsavel,status_dia,ligacoes_totais,
     contatos_whatsapp,agendamentos_confirmados,usuario_id)
    VALUES (?,?,?,?,?,?,?,?)
  `);
  const insUnd = db.prepare(
    'INSERT INTO agendamentos_unidade (registro_id,unidade,agendamentos) VALUES (?,?,?)'
  );

  const tx = db.transaction(() => {
    const { lastInsertRowid: id } = insReg.run(
      data_atendimento, turno, responsavel.trim(), status_dia,
      +ligacoes_totais, +contatos_whatsapp,
      +agendamentos_confirmados, req.user.id
    );
    for (const nome of UNIDADES) {
      const u = unidades.find(x => x.unidade === nome) || {};
      insUnd.run(id, nome, +(u.agendamentos || 0));
    }
    return id;
  });

  try {
    const id = tx();
    const registro = db.prepare('SELECT * FROM registros_diarios WHERE id = ?').get(id);
    registro.unidades = getUnidades(db, id);
    res.status(201).json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar registro' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const {
    data_atendimento, turno, responsavel, status_dia,
    ligacoes_totais = 0, contatos_whatsapp = 0,
    agendamentos_confirmados = 0, unidades = []
  } = req.body;

  const db = getDb();
  if (!db.prepare('SELECT id FROM registros_diarios WHERE id = ?').get(req.params.id))
    return res.status(404).json({ error: 'Registro não encontrado' });

  const updReg = db.prepare(`
    UPDATE registros_diarios SET
    data_atendimento=?,turno=?,responsavel=?,status_dia=?,
    ligacoes_totais=?,contatos_whatsapp=?,
    agendamentos_confirmados=?,updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `);
  const updUnd = db.prepare(
    'UPDATE agendamentos_unidade SET agendamentos=? WHERE registro_id=? AND unidade=?'
  );

  const tx = db.transaction(() => {
    updReg.run(
      data_atendimento, turno, responsavel.trim(), status_dia,
      +ligacoes_totais, +contatos_whatsapp,
      +agendamentos_confirmados, req.params.id
    );
    for (const u of unidades)
      updUnd.run(+(u.agendamentos || 0), req.params.id, u.unidade);
  });

  try {
    tx();
    const updated = db.prepare('SELECT * FROM registros_diarios WHERE id = ?').get(req.params.id);
    updated.unidades = getUnidades(db, req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar registro' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  if (!db.prepare('SELECT id FROM registros_diarios WHERE id = ?').get(req.params.id))
    return res.status(404).json({ error: 'Registro não encontrado' });
  db.prepare('DELETE FROM registros_diarios WHERE id = ?').run(req.params.id);
  res.json({ message: 'Registro excluído' });
});

module.exports = router;
