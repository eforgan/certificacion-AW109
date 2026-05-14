import { QTGTest } from '@/types';
import { FASES_DATA } from './data';

// ── CSV ──────────────────────────────────────────────────────────────────────

export function exportQTGtoCSV(tests: QTGTest[]) {
  const headers = ['ID', 'Categoría', 'Nombre', 'Referencia', 'Parámetro', 'Unidad', 'Valor Ref', 'Tolerancia', 'Resultado', 'Estado', 'Crítica', 'Guardado Por', 'Fecha', 'Observaciones'];
  const rows = tests.map(q => [
    q.id,
    q.cat,
    `"${q.name.replace(/"/g, '""')}"`,
    q.ref,
    q.param,
    q.unit,
    q.ref_val,
    q.tol,
    q.result ?? '',
    q.status,
    q.critical ? 'Sí' : 'No',
    q.savedBy ?? '',
    q.savedAt ?? '',
    `"${(q.obs ?? '').replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const bom = '﻿';
  download(`QTG_AW109E_${isoDate()}.csv`, bom + csv, 'text/csv;charset=utf-8;');
}

// ── PDF via print ─────────────────────────────────────────────────────────────

export function printQTGReport(
  tests: QTGTest[],
  reqs: Record<string, boolean>,
) {
  const approved = tests.filter(t => t.status === 'approved').length;
  const rejected = tests.filter(t => t.status === 'rejected').length;
  const pending  = tests.filter(t => t.status === 'pending').length;
  const pct = Math.round((approved / tests.length) * 100);

  const faseRows = FASES_DATA.map(f => {
    const done  = f.requisitos.filter(r => reqs[r.id]).length;
    const total = f.requisitos.length;
    const fp    = Math.round((done / total) * 100);
    const color = fp === 100 ? '#22c55e' : fp > 0 ? '#f59e0b' : '#ef4444';
    return `
      <tr>
        <td>Fase ${f.n}</td>
        <td>${f.title}</td>
        <td style="color:${color};font-weight:700">${fp}%</td>
        <td>${done}/${total}</td>
      </tr>`;
  }).join('');

  const testRows = tests.map(q => {
    const statusColor = q.status === 'approved' ? '#22c55e' : q.status === 'rejected' ? '#ef4444' : '#94a3b8';
    const statusLabel = q.status === 'approved' ? 'APROBADA' : q.status === 'rejected' ? 'RECHAZADA' : 'PENDIENTE';
    return `
      <tr>
        <td>${q.id}</td>
        <td>${q.cat.toUpperCase()}</td>
        <td>${q.name}</td>
        <td>${q.ref_val} ${q.unit}</td>
        <td>${q.result ?? '—'}</td>
        <td style="color:${statusColor};font-weight:700">${statusLabel}</td>
        <td>${q.critical ? '⚠ CRÍTICA' : '—'}</td>
      </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Reporte QTG — FSTD AW109E Power</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1e293b; background:#fff; }
  .cover { text-align:center; padding: 60px 40px; border-bottom: 3px solid #1577c4; }
  .cover h1 { font-size:28px; color:#1577c4; font-weight:900; letter-spacing:-0.5px; }
  .cover h2 { font-size:16px; color:#475569; font-weight:400; margin-top:8px; }
  .cover .meta { display:flex; justify-content:center; gap:40px; margin-top:32px; }
  .cover .kpi { text-align:center; }
  .cover .kpi-val { font-size:36px; font-weight:900; color:#1577c4; }
  .cover .kpi-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748b; margin-top:4px; }
  .section { padding: 24px 32px; }
  .section h3 { font-size:13px; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#1577c4; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:16px; }
  table { width:100%; border-collapse:collapse; }
  th { background:#1577c4; color:#fff; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; padding:8px 10px; text-align:left; }
  td { padding:7px 10px; border-bottom:1px solid #f1f5f9; font-size:10px; }
  tr:nth-child(even) td { background:#f8fafc; }
  .footer { margin-top:32px; padding:16px 32px; border-top:1px solid #e2e8f0; text-align:center; font-size:9px; color:#94a3b8; }
  @media print { @page { size:A4 landscape; margin:10mm; } }
</style>
</head>
<body>
<div class="cover">
  <h1>Reporte de Certificación FSTD</h1>
  <h2>AgustaWestland AW109E Power — RAAC Parte 60</h2>
  <p style="margin-top:8px;font-size:10px;color:#94a3b8">Generado: ${new Date().toLocaleString('es-AR')}</p>
  <div class="meta">
    <div class="kpi"><div class="kpi-val">${pct}%</div><div class="kpi-lbl">Progreso Total</div></div>
    <div class="kpi"><div class="kpi-val" style="color:#22c55e">${approved}</div><div class="kpi-lbl">Aprobadas</div></div>
    <div class="kpi"><div class="kpi-val" style="color:#ef4444">${rejected}</div><div class="kpi-lbl">Rechazadas</div></div>
    <div class="kpi"><div class="kpi-val" style="color:#94a3b8">${pending}</div><div class="kpi-lbl">Pendientes</div></div>
  </div>
</div>

<div class="section">
  <h3>Resumen de Fases de Certificación</h3>
  <table>
    <thead><tr><th>Fase</th><th>Título</th><th>Progreso</th><th>Requisitos</th></tr></thead>
    <tbody>${faseRows}</tbody>
  </table>
</div>

<div class="section">
  <h3>Registro de Pruebas QTG (${tests.length} pruebas)</h3>
  <table>
    <thead><tr><th>ID</th><th>Categoría</th><th>Nombre</th><th>Valor Ref</th><th>Resultado</th><th>Estado</th><th>Criticidad</th></tr></thead>
    <tbody>${testRows}</tbody>
  </table>
</div>

<div class="footer">
  FSTD Cert Manager v1.0 · AW109E Power · © 2026 Modena CEAC · Documento de uso interno — ANAC RAAC Parte 60
</div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1200,height=800');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

// ── helpers ───────────────────────────────────────────────────────────────────

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
