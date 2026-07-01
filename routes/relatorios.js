const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { getDb } = require('../database/db');
const { authMiddleware } = require('../middleware/auth');

const UNIDADES = [
  'Atibaia', 'Bragança Paulista', 'Caraguatatuba', 'Gopoúva',
  'Jacareí', 'Lorena', 'Mogi das Cruzes', 'São José dos Campos',
  'Taubaté', 'Vila Galvão'
];

const COR_AZUL   = '#1E3A5F';
const COR_LARANJA = '#F97316';

function getRegistros(query) {
  const { data_inicio, data_fim, responsavel } = query;
  const db = getDb();
  const conds = [], params = [];

  if (data_inicio) { conds.push('r.data_atendimento >= ?'); params.push(data_inicio); }
  if (data_fim)    { conds.push('r.data_atendimento <= ?'); params.push(data_fim); }
  if (responsavel) { conds.push('r.responsavel LIKE ?');    params.push(`%${responsavel}%`); }

  const where = conds.length ? conds.join(' AND ') : '1=1';
  const rows = db.prepare(`
    SELECT r.*, u.nome AS usuario_nome
    FROM registros_diarios r
    LEFT JOIN usuarios u ON r.usuario_id = u.id
    WHERE ${where}
    ORDER BY r.data_atendimento ASC, r.id ASC
  `).all(...params);

  for (const r of rows)
    r.unidades = db.prepare('SELECT * FROM agendamentos_unidade WHERE registro_id = ? ORDER BY id').all(r.id);

  return rows;
}

function buildConsolidado(registros) {
  const c = {
    total: registros.length,
    ligacoes_totais: 0,
    contatos_whatsapp: 0,
    agendamentos_confirmados: 0,
    unidades: Object.fromEntries(UNIDADES.map(u => [u, { agendamentos: 0 }]))
  };
  for (const r of registros) {
    c.ligacoes_totais          += r.ligacoes_totais || 0;
    c.contatos_whatsapp        += r.contatos_whatsapp || 0;
    c.agendamentos_confirmados += r.agendamentos_confirmados || 0;
    for (const u of r.unidades || []) {
      if (c.unidades[u.unidade]) {
        c.unidades[u.unidade].agendamentos += u.agendamentos || 0;
      }
    }
  }
  return c;
}

function fmtDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString('pt-BR');
}

// ─── GET /api/relatorios/consolidado ────────────────────────────────────────
router.get('/consolidado', authMiddleware, (req, res) => {
  const registros = getRegistros(req.query);
  res.json({ consolidado: buildConsolidado(registros), registros });
});

// ─── GET /api/relatorios/pdf ─────────────────────────────────────────────────
router.get('/pdf', authMiddleware, (req, res) => {
  const registros = getRegistros(req.query);
  const con = buildConsolidado(registros);
  const { data_inicio, data_fim } = req.query;
  const periodo = `${data_inicio || 'início'} a ${data_fim || 'hoje'}`;

  const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition',
    `attachment; filename="relatorio_roldan_${(data_inicio || 'tudo').replace(/\//g,'-')}_${(data_fim || 'tudo').replace(/\//g,'-')}.pdf"`);
  doc.pipe(res);

  const W = doc.page.width;
  const MARGIN = 40;
  const CONTENT_W = W - MARGIN * 2;

  function header() {
    doc.rect(0, 0, W, 70).fill(COR_AZUL);
    doc.fillColor('white').font('Helvetica-Bold').fontSize(18)
      .text('ROLDAN', MARGIN, 15);
    doc.font('Helvetica').fontSize(9)
      .text('Marketing Educacional e Contact Center BPO  |  (11) 95474-2815', MARGIN, 38);
    doc.font('Helvetica-Bold').fontSize(13)
      .text('Relatório de Atendimento', 0, 25, { align: 'right', width: W - MARGIN });
    doc.y = 90;
  }

  function footer() {
    const ph = doc.page.height;
    doc.rect(0, ph - 32, W, 32).fill(COR_AZUL);
    doc.fillColor('white').font('Helvetica').fontSize(7.5)
      .text('ROLDAN Marketing Educacional e Contact Center BPO  |  (11) 95474-2815',
        0, ph - 20, { align: 'center', width: W });
  }

  function sectionTitle(txt) {
    doc.moveDown(0.6);
    doc.fillColor(COR_AZUL).font('Helvetica-Bold').fontSize(11).text(txt, MARGIN);
    doc.moveDown(0.3);
  }

  function tableRow(cols, widths, y, fill) {
    let x = MARGIN;
    if (fill) doc.rect(MARGIN, y, CONTENT_W, 20).fill(fill).fillColor('#000');
    for (let i = 0; i < cols.length; i++) {
      const isBold = fill === COR_AZUL;
      doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(8.5)
        .fillColor(fill === COR_AZUL ? 'white' : '#1e293b')
        .text(String(cols[i]), x + 4, y + 5, { width: widths[i] - 8, lineBreak: false });
      x += widths[i];
    }
    return y + 22;
  }

  // Página 1
  header();

  // Período
  doc.fillColor('#64748b').font('Helvetica').fontSize(9)
    .text(`Período: ${periodo}  |  Total de registros: ${con.total}`, MARGIN, doc.y);
  doc.moveDown(0.5);

  // Resumo numérico
  sectionTitle('RESUMO CONSOLIDADO');
  const summaryItems = [
    ['Ligações Totais Realizadas', con.ligacoes_totais],
    ['Contatos via WhatsApp',      con.contatos_whatsapp],
    ['Agendamentos Confirmados',   con.agendamentos_confirmados],
  ];

  const COL1 = CONTENT_W * 0.7;
  const COL2 = CONTENT_W * 0.3;
  let y = doc.y;
  // header row
  y = tableRow(['Indicador', 'Total'], [COL1, COL2], y, COR_AZUL);
  for (let i = 0; i < summaryItems.length; i++) {
    const [label, val] = summaryItems[i];
    const bg = i % 2 === 0 ? '#f1f5f9' : 'white';
    y = tableRow([label, val], [COL1, COL2], y, bg);
    // highlight value cell
    doc.rect(MARGIN + COL1, y - 22, COL2, 20).fill(COR_LARANJA);
    doc.fillColor('white').font('Helvetica-Bold').fontSize(8.5)
      .text(String(val), MARGIN + COL1 + 4, y - 17, { width: COL2 - 8, align: 'center', lineBreak: false });
  }

  doc.y = y + 8;

  // Unidades
  sectionTitle('AGENDAMENTOS POR UNIDADE');
  const UC = [CONTENT_W * 0.5, CONTENT_W * 0.25, CONTENT_W * 0.25];
  y = doc.y;
  y = tableRow(['Unidade', 'Agendamentos'], [CONTENT_W * 0.6, CONTENT_W * 0.4], y, COR_AZUL);
  let idx = 0;
  for (const [nome, dados] of Object.entries(con.unidades)) {
    y = tableRow([nome, dados.agendamentos], [CONTENT_W * 0.6, CONTENT_W * 0.4], y, idx % 2 === 0 ? '#f1f5f9' : 'white');
    idx++;
  }
  doc.y = y + 8;

  // Registros detalhados
  if (registros.length > 0) {
    sectionTitle('REGISTROS DETALHADOS');
    for (const r of registros) {
      if (doc.y > 680) { doc.addPage(); header(); }
      const dateStr = fmtDate(r.data_atendimento);
      const titulo = `${dateStr}  |  ${r.turno}  |  ${r.responsavel}  |  ${r.status_dia}`;
      doc.rect(MARGIN, doc.y, CONTENT_W, 18).fill(COR_AZUL);
      doc.fillColor('white').font('Helvetica-Bold').fontSize(8)
        .text(titulo, MARGIN + 4, doc.y + 4, { lineBreak: false });
      doc.y += 20;

      const detalhe = [
        `Lig. Totais: ${r.ligacoes_totais}`,
        `WhatsApp: ${r.contatos_whatsapp}`,
        `Agendamentos: ${r.agendamentos_confirmados}`,
      ].join('   |   ');
      doc.fillColor('#334155').font('Helvetica').fontSize(7.5)
        .text(detalhe, MARGIN + 4, doc.y + 2);
      doc.y += 16;

      // mini tabela de unidades apenas se tiver valores
      const comDados = (r.unidades || []).filter(u => u.agendamentos > 0);
      if (comDados.length > 0) {
        doc.fillColor('#64748b').font('Helvetica').fontSize(7)
          .text(comDados.map(u => `${u.unidade}: ${u.agendamentos} agend.`).join('   '), MARGIN + 4, doc.y + 1);
        doc.y += 12;
      }
      doc.y += 4;
    }
  }

  // Adiciona rodapé em todas as páginas
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    footer();
  }

  doc.end();
});

// ─── GET /api/relatorios/excel ────────────────────────────────────────────────
router.get('/excel', authMiddleware, async (req, res) => {
  const registros = getRegistros(req.query);
  const con = buildConsolidado(registros);
  const { data_inicio, data_fim } = req.query;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'ROLDAN Dashboard';
  wb.created = new Date();

  const styleHeader = (cell) => {
    cell.font  = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  };
  const styleOrange = (cell, val) => {
    cell.value = val;
    cell.font  = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF97316' } };
    cell.alignment = { horizontal: 'center' };
  };
  const styleAlt = (row, even) => {
    row.eachCell(c => {
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: even ? 'FFF1F5F9' : 'FFFFFFFF' } };
    });
  };

  // ── Aba 1: Consolidado ─────────────────────────────────────────────────────
  const ws1 = wb.addWorksheet('Consolidado');

  ws1.mergeCells('A1:C1');
  const t1 = ws1.getCell('A1');
  t1.value = 'ROLDAN Marketing Educacional e Contact Center BPO';
  styleHeader(t1);
  t1.font = { ...t1.font, size: 13 };
  ws1.getRow(1).height = 28;

  ws1.mergeCells('A2:C2');
  const t2 = ws1.getCell('A2');
  t2.value = `Período: ${data_inicio || 'início'} até ${data_fim || 'hoje'}  |  Total de registros: ${con.total}`;
  t2.alignment = { horizontal: 'center' };
  t2.font = { italic: true, color: { argb: 'FF64748B' } };

  ws1.addRow([]);

  // Resumo
  const h3 = ws1.addRow(['RESUMO CONSOLIDADO', '', '']);
  h3.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF1E3A5F' } };

  const hdr4 = ws1.addRow(['Indicador', 'Total', '']);
  styleHeader(hdr4.getCell(1));
  styleHeader(hdr4.getCell(2));
  ws1.getRow(4).height = 22;

  const summaryItems = [
    ['Ligações Totais Realizadas', con.ligacoes_totais],
    ['Contatos via WhatsApp',      con.contatos_whatsapp],
    ['Agendamentos Confirmados',   con.agendamentos_confirmados],
  ];
  summaryItems.forEach(([label, val], i) => {
    const r = ws1.addRow([label, '']);
    styleAlt(r, i % 2 === 0);
    r.getCell(1).value = label;
    styleOrange(r.getCell(2), val);
    r.height = 20;
  });

  ws1.addRow([]);

  // Unidades
  const hu = ws1.addRow(['AGENDAMENTOS POR UNIDADE', '', '']);
  hu.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF1E3A5F' } };

  const hu2 = ws1.addRow(['Unidade', 'Agendamentos']);
  [1, 2].forEach(i => styleHeader(hu2.getCell(i)));
  ws1.getRow(hu2.number).height = 22;

  Object.entries(con.unidades).forEach(([nome, d], i) => {
    const r = ws1.addRow([nome, d.agendamentos]);
    styleAlt(r, i % 2 === 0);
    r.getCell(2).alignment = { horizontal: 'center' };
    r.height = 20;
  });

  ws1.columns = [{ width: 34 }, { width: 18 }];

  // ── Aba 2: Registros Detalhados ────────────────────────────────────────────
  const ws2 = wb.addWorksheet('Registros Detalhados');

  const colHeaders = [
    'Data', 'Turno', 'Responsável', 'Status',
    'Lig. Totais', 'WhatsApp', 'Agend. Confirm.',
    ...UNIDADES.map(u => `${u} – Agend.`),
  ];
  const hdrRow = ws2.addRow(colHeaders);
  hdrRow.eachCell(c => styleHeader(c));
  hdrRow.height = 36;
  ws2.getRow(1).alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };

  registros.forEach((r, i) => {
    const undMap = Object.fromEntries((r.unidades || []).map(u => [u.unidade, u]));
    const row = ws2.addRow([
      fmtDate(r.data_atendimento),
      r.turno, r.responsavel, r.status_dia,
      r.ligacoes_totais, r.contatos_whatsapp,
      r.agendamentos_confirmados,
      ...UNIDADES.map(u => undMap[u]?.agendamentos || 0),
    ]);
    styleAlt(row, i % 2 === 0);
    row.height = 18;
  });

  ws2.columns = [
    { width: 12 }, { width: 10 }, { width: 22 }, { width: 14 },
    { width: 12 }, { width: 12 }, { width: 16 },
    ...UNIDADES.map(() => ({ width: 20 })),
  ];

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition',
    `attachment; filename="relatorio_roldan_${(data_inicio || 'tudo').replace(/\//g,'-')}_${(data_fim || 'tudo').replace(/\//g,'-')}.xlsx"`);

  await wb.xlsx.write(res);
  res.end();
});

module.exports = router;
