"use client";

import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { QTGTest } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  data: QTGTest[];
  onSelect: (id: string) => void;
  onOpenSheet: (id: string) => void;
}

const catColors: Record<string, string> = {
  performance: 'bg-brand-light/10 text-brand-light border-brand-light/20',
  handling:    'bg-accent/10 text-accent border-accent/20',
  systems:     'bg-info/10 text-info border-info/20',
  emergency:   'bg-danger/10 text-danger border-danger/20',
  visual:      'bg-warning/10 text-warning border-warning/20',
  cabina:      'bg-success/10 text-success border-success/20',
};

const statusStyles: Record<string, { icon: any, color: string, label: string, bg: string }> = {
  approved: { icon: CheckCircle2, color: 'text-success', label: 'Aprobada', bg: 'bg-success/5' },
  rejected: { icon: XCircle, color: 'text-danger', label: 'Rechazada', bg: 'bg-danger/5' },
  pending:  { icon: Clock, color: 'text-white/20', label: 'Pendiente', bg: 'bg-white/5' },
};

export default function QTGTable({ data, onSelect, onOpenSheet }: Props) {
  return (
    <div className="overflow-x-auto scrollbar-premium">
      <table className="w-full min-w-[1000px] text-left border-collapse table-fixed">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[23%]" />
          <col className="w-[13%]" />
          <col className="w-[21%]" />
          <col className="w-[11%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead>
          <tr className="bg-white/5 border-b border-white/5 uppercase text-[10px] font-bold tracking-[0.2em] text-white/40">
            <th className="px-6 py-6">ID / Ref</th>
            <th className="px-4 py-6">Categoría</th>
            <th className="px-4 py-6">Nombre del Ensayo</th>
            <th className="px-4 py-6">Referencia RFM</th>
            <th className="px-4 py-6">Criterio de Aceptación / Resultado</th>
            <th className="px-4 py-6 text-center">Estado</th>
            <th className="px-6 py-6 text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Clock className="w-10 h-10 text-white/5" />
                  <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No se encontraron resultados</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((q) => {
              const st = statusStyles[q.status];
              return (
                <tr 
                  key={q.id} 
                  className={cn(
                    "group transition-all duration-300 hover:bg-white/5 cursor-pointer",
                    q.critical && q.status === 'rejected' ? 'bg-danger/5' : ''
                  )}
                  onClick={() => onSelect(q.id)}
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white group-hover:text-brand-light transition-colors">{q.id}</span>
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">RAAC 60</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border",
                      catColors[q.cat]
                    )}>
                      {q.cat}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-start gap-2 pr-4">
                      {q.critical && <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />}
                      <span className="text-xs font-bold text-white line-clamp-2 leading-tight">{q.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-bold text-white/50 truncate pr-2">{q.ref}</span>
                      <span className="text-[9px] text-white/20 font-black uppercase truncate">{q.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex flex-col gap-1.5">
                      {/* Criterio de aceptación del manual */}
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-wider shrink-0">RFM:</span>
                        <span className="text-[10px] font-bold text-white/60 leading-tight">{q.ref_val}</span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[8px] font-black text-warning/60 uppercase tracking-wider shrink-0">TOL:</span>
                        <span className="text-[10px] font-bold text-warning/80">{q.tol}</span>
                      </div>
                      {/* Separador + resultado */}
                      <div className="border-t border-white/10 pt-1.5 flex items-baseline gap-1.5">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-wider shrink-0">OBT:</span>
                        <span className={cn(
                          "text-[10px] font-black",
                          q.result ? (q.status === 'approved' ? 'text-success' : q.status === 'rejected' ? 'text-danger' : 'text-brand-light') : 'text-white/20'
                        )}>
                          {q.result ? `${q.result} ${q.unit}` : '—'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/5",
                      st.bg, st.color
                    )}>
                      <st.icon className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{st.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSheet(q.id);
                      }}
                      className="px-3 py-2 rounded-lg bg-blue-600 active:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/40 relative z-10"
                    >
                      Planilla
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
