"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Category } from '../../types';
import QTGTable from '../../components/qtg/QTGTable';
import QTGDetailModal from '../../components/qtg/QTGDetailModal';
import QTGVerificationSheet from '../../components/qtg/QTGVerificationSheet';
import { exportQTGtoCSV, printQTGReport } from '@/lib/export';

export default function QTGPage() {
  const { qtg, reqs } = useAppStore();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedQTG, setSelectedQTG] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActiveSheet(null); setSelectedQTG(null); }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredData = qtg.filter(item => {
    const matchesFilter = filter === 'all' || item.cat === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                         item.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeSheetData = activeSheet ? qtg.find(q => q.id === activeSheet) : null;

  // Navegación entre planillas (navega sobre el array completo qtg)
  const allIds = qtg.map(q => q.id);
  const activeIdx = activeSheet ? allIds.indexOf(activeSheet) : -1;
  const handleNext = () => {
    if (activeIdx >= 0 && activeIdx < allIds.length - 1) setActiveSheet(allIds[activeIdx + 1]);
  };
  const handlePrev = () => {
    if (activeIdx > 0) setActiveSheet(allIds[activeIdx - 1]);
  };

  const stats = {
    total: qtg.length,
    approved: qtg.filter(q => q.status === 'approved').length,
    rejected: qtg.filter(q => q.status === 'rejected').length,
    pending: qtg.filter(q => q.status === 'pending').length,
    critical: qtg.filter(q => q.critical).length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2 text-white">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight flex items-center gap-3 uppercase">
            Gestión de Pruebas QTG
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-bold tracking-widest border border-white/10">{stats.total} Pruebas</span>
          </h2>
          <p className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Ejecución y registro formal RAAC Parte 60</p>
        </div>
        <div className="flex items-center gap-3">
           <button
             onClick={() => exportQTGtoCSV(qtg)}
             className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all text-xs font-black uppercase tracking-widest"
           >
             <Download className="w-4 h-4" />
             Exportar CSV
           </button>
           <button
             onClick={() => printQTGReport(qtg, reqs)}
             className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 border border-blue-500/40 hover:bg-blue-500 text-white transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/40"
           >
             <FileText className="w-4 h-4" />
             Exportar PDF
           </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', val: stats.total, color: 'text-white', bg: 'bg-white/10' },
          { label: 'Aprobadas', val: stats.approved, color: 'text-green-300', bg: 'bg-green-500/20' },
          { label: 'Rechazadas', val: stats.rejected, color: 'text-red-300', bg: 'bg-red-500/20' },
          { label: 'Pendientes', val: stats.pending, color: 'text-white/40', bg: 'bg-white/5' },
          { label: 'Críticas', val: stats.critical, color: 'text-amber-300', bg: 'bg-amber-500/20' },
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-2xl glass flex flex-col items-center justify-center gap-1 border-white/20 shadow-xl ${s.bg}`}>
            <span className={`text-3xl font-display font-black ${s.color}`}>{s.val}</span>
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors w-5 h-5" />
          <input 
            type="text" 
            placeholder="BUSCAR PRUEBA POR ID O NOMBRE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 border-2 border-white/10 p-4 pl-12 rounded-2xl text-white font-bold placeholder:text-white/20 focus:border-white/40 outline-none transition-all uppercase text-sm tracking-widest"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-white/10 border-2 border-white/10 p-4 pl-10 pr-10 rounded-2xl text-white font-black uppercase text-xs tracking-widest outline-none focus:border-white/40 appearance-none min-w-[240px]"
          >
            <option value="all" className="text-slate-900">TODAS LAS CATEGORÍAS</option>
            <option value="performance" className="text-slate-900">PERFORMANCE</option>
            <option value="handling" className="text-slate-900">MANIOBRABILIDAD</option>
            <option value="systems" className="text-slate-900">SISTEMAS</option>
            <option value="emergency" className="text-slate-900">EMERGENCIAS</option>
            <option value="visual" className="text-slate-900">VISUAL / ENTORNO</option>
            <option value="cabina" className="text-slate-900">CABINA</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-[2rem] overflow-hidden border-white/20 shadow-2xl">
        <QTGTable 
          data={filteredData} 
          onSelect={(id: string) => setSelectedQTG(id)}
          onOpenSheet={(id: string) => setActiveSheet(id)}
        />
      </div>

      {/* Detail Modal */}
      {selectedQTG && (
        <QTGDetailModal 
          id={selectedQTG} 
          onClose={() => setSelectedQTG(null)} 
        />
      )}

      {/* Verification Sheet con navegación */}
      {activeSheet && activeSheetData && (
        <QTGVerificationSheet
          test={activeSheetData}
          currentIndex={activeIdx + 1}
          totalCount={allIds.length}
          hasPrev={activeIdx > 0}
          hasNext={activeIdx < allIds.length - 1}
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={() => setActiveSheet(null)}
        />
      )}
    </div>
  );
}
