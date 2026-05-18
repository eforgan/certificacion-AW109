"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Info,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  id: string;
  onClose: () => void;
}

export default function QTGDetailModal({ id, onClose }: Props) {
  const { qtg, updateQTG, logActivity, user } = useAppStore();
  const item = qtg.find(q => q.id === id);

  const [result, setResult] = useState(item?.result || '');
  const [obs, setObs] = useState(item?.obs || '');
  const [status, setStatus] = useState(item?.status || 'pending');

  if (!item) return null;

  const handleSave = (newStatus?: typeof status) => {
    const finalStatus = newStatus || status;
    updateQTG(id, {
      result,
      obs,
      status: finalStatus,
      savedBy: user?.name,
      savedAt: new Date().toLocaleString('es-AR')
    });
    
    logActivity(
      `QTG ${id} actualizado a ${finalStatus.toUpperCase()}${result ? ` (${result})` : ''}`, 
      finalStatus === 'approved' ? '#10b981' : finalStatus === 'rejected' ? '#ef4444' : '#64748b'
    );
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass w-full max-w-2xl rounded-[2.5rem] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand-light shadow-lg">
              <Info className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-display font-bold text-white tracking-tight">{item.id} — Detalle de Prueba</h3>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{item.cat} · {item.ref}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Nombre de la Prueba</p>
                <p className="text-sm font-semibold text-white/80 leading-relaxed">{item.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Condición de Vuelo</p>
                <p className="text-xs text-white/50 leading-relaxed font-medium">{item.cond}</p>
              </div>
            </div>
            
            <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
              {/* Título criterios */}
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Criterios de Aceptación — Manual RFM</p>

              {/* Valor de referencia */}
              <div className="bg-brand/10 border border-brand/20 rounded-2xl p-4">
                <p className="text-[9px] font-black text-brand-light/50 uppercase tracking-widest mb-1">Valor de Referencia (RFM)</p>
                <p className="text-base font-display font-bold text-brand-light leading-tight">{item.ref_val}</p>
                {item.param && <p className="text-[9px] text-white/30 mt-1 font-bold">{item.param} · {item.unit}</p>}
              </div>

              {/* Tolerancia */}
              <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
                <p className="text-[9px] font-black text-warning/60 uppercase tracking-widest mb-1">Tolerancia Admisible (RAAC 60)</p>
                <p className="text-lg font-display font-bold text-warning leading-tight">{item.tol}</p>
              </div>

              {item.critical && (
                <div className="bg-danger/10 border border-danger/20 rounded-2xl p-3 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-danger uppercase tracking-widest">Prueba Crítica</p>
                        <p className="text-[9px] text-white/30 font-medium">Cualquier resultado fuera de tolerancia implica el rechazo directo de la calificación.</p>
                    </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-6 pt-4 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Resultado Obtenido</label>
                <input
                  type="text"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder={`Ej: ${item.ref_val}`}
                  className="input-premium font-display font-semibold text-lg"
                />
                <p className="text-[9px] text-white/20 font-bold px-1">
                  Para aprobar: <span className="text-warning/70">{item.ref_val}</span> · tol. <span className="text-warning/70">{item.tol}</span>
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Estado de la Prueba</label>
                <div className="grid grid-cols-3 gap-2">
                   {[
                     { id: 'approved', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: '✓' },
                     { id: 'rejected', icon: XCircle, color: 'text-danger', bg: 'bg-danger/10', label: '✗' },
                     { id: 'pending', icon: Clock, color: 'text-white/40', bg: 'bg-white/5', label: '○' },
                   ].map(s => (
                     <button
                       key={s.id}
                       onClick={() => setStatus(s.id as any)}
                       className={cn(
                        "flex flex-col items-center justify-center py-2 rounded-xl border border-white/5 transition-all duration-300",
                        status === s.id ? `${s.bg} border-${s.id}/50 ${s.color}` : "bg-white/2 hover:bg-white/5 text-white/20"
                       )}
                     >
                       <s.icon className="w-5 h-5" />
                       <span className="text-[10px] mt-1 font-bold">{s.id.toUpperCase()}</span>
                     </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Observaciones Técnicas / Notas del Inspector</label>
              <textarea 
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Indique detalles de la ejecución o no-conformidades..."
                className="input-premium min-h-[120px] resize-none text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Audit Trail */}
          {(item.savedBy || item.savedAt) && (
            <div className="flex gap-6 py-4 px-6 rounded-2xl bg-brand/5 border border-brand/10">
               {item.savedBy && (
                 <div className="flex items-center gap-2">
                    <UserIcon className="w-3 h-3 text-brand-light" />
                    <span className="text-[10px] font-bold text-brand-light/60 uppercase tracking-wider">{item.savedBy}</span>
                 </div>
               )}
               {item.savedAt && (
                 <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-brand-light" />
                    <span className="text-[10px] font-bold text-brand-light/60 uppercase tracking-wider">{item.savedAt}</span>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3.5 rounded-2xl border border-white/5 text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          
          <button 
            onClick={() => handleSave()}
            className="flex-[2] btn-premium py-4 flex items-center justify-center gap-2"
          >
             <Save className="w-5 h-5" />
             Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
