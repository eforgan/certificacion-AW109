"use client";

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  Layers,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FASES_DATA } from '@/lib/data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function FasesPage() {
  const { reqs, toggleReq, faseNotes, saveFaseNote } = useAppStore();
  const [expanded, setExpanded] = useState<number[]>([1]);

  const toggleExpand = (n: number) =>
    setExpanded(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);

  const fasesProgress = FASES_DATA.map(f => {
    const done = f.requisitos.filter(r => reqs[r.id]).length;
    return { ...f, done, pct: Math.round((done / f.requisitos.length) * 100) };
  });

  const globalDone  = fasesProgress.reduce((a, f) => a + f.done, 0);
  const globalTotal = fasesProgress.reduce((a, f) => a + f.requisitos.length, 0);
  const globalPct   = Math.round((globalDone / globalTotal) * 100);
  const currentFase = fasesProgress.findIndex(f => f.pct < 100) + 1 || FASES_DATA.length;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            Proceso de Certificación RAAC 60
            <span className="text-xs bg-brand/10 text-brand-light px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-brand/20">
              6 Fases
            </span>
          </h2>
          <p className="text-white/40 font-medium">Cronograma de habilitación técnica ANAC</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Progreso Global</p>
          <p className="text-4xl font-display font-black text-white">{globalPct}<span className="text-xl text-white/40">%</span></p>
          <p className="text-[10px] text-white/30 mt-1">{globalDone} / {globalTotal} requisitos</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="glass rounded-3xl p-8 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max mx-auto w-full">
          {fasesProgress.map((f, i) => {
            const isActive  = f.n === currentFase;
            const isDone    = f.pct === 100;
            const isLast    = i === fasesProgress.length - 1;
            return (
              <React.Fragment key={f.n}>
                <button
                  onClick={() => toggleExpand(f.n)}
                  className="flex flex-col items-center gap-3 group flex-shrink-0 relative"
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-lg transition-all duration-300 border-2',
                      isDone
                        ? 'bg-success/20 border-success text-success shadow-lg shadow-success/20'
                        : isActive
                        ? 'border-brand-light bg-brand-light/10 text-brand-light shadow-lg shadow-brand/20 scale-110'
                        : 'border-white/10 bg-white/5 text-white/30'
                    )}
                    style={isDone ? {} : isActive ? {} : { borderColor: `${f.color}44`, color: f.color }}
                  >
                    {isDone ? <CheckCircle2 className="w-6 h-6" /> : f.n}
                  </div>
                  <div className="text-center">
                    <p className={cn('text-[10px] font-bold uppercase tracking-wider transition-colors', isActive ? 'text-white' : 'text-white/30')}>
                      Fase {f.n}
                    </p>
                    <p className={cn('text-[9px] font-medium mt-0.5 max-w-[80px] leading-tight', isDone ? 'text-success/70' : isActive ? 'text-brand-light/70' : 'text-white/20')}>
                      {f.pct}%
                    </p>
                  </div>
                  {/* Pie progress */}
                  <div className="w-14 h-1 rounded-full overflow-hidden bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${f.pct}%`, backgroundColor: isDone ? '#22c55e' : f.color }}
                    />
                  </div>
                </button>

                {!isLast && (
                  <div className={cn('flex-1 h-px mx-3 transition-all duration-500', f.pct === 100 ? 'bg-success/40' : 'bg-white/5')} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Phase Cards */}
      <div className="grid grid-cols-1 gap-8">
        {fasesProgress.map((f) => {
          const isExpanded = expanded.includes(f.n);
          const { pct, done } = f;

          return (
            <div
              key={f.n}
              className={cn(
                'glass rounded-[2.5rem] border-white/5 transition-all duration-500 overflow-hidden',
                isExpanded ? 'ring-2 ring-brand-light/20 shadow-[0_32px_80px_rgba(0,0,0,0.5)]' : 'hover:bg-white/[0.03]'
              )}
            >
              {/* Card Header */}
              <div
                className="p-8 cursor-pointer flex items-center gap-6 select-none"
                onClick={() => toggleExpand(f.n)}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-bold shadow-lg flex-shrink-0"
                  style={{ backgroundColor: `${f.color}22`, color: f.color, border: `1px solid ${f.color}44` }}
                >
                  {pct === 100 ? <CheckCircle2 className="w-7 h-7" style={{ color: f.color }} /> : f.n}
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-display font-bold text-white tracking-tight">{f.title}</h3>
                    {pct === 100 && (
                      <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-bold border border-success/20">
                        Completado
                      </span>
                    )}
                    {pct > 0 && pct < 100 && (
                      <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-bold border border-warning/20">
                        En Progreso
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/40 font-medium line-clamp-1">{f.desc}</p>
                </div>

                <div className="flex items-center gap-8 px-6 border-l border-white/5 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">
                      {done}/{f.requisitos.length} req
                    </p>
                    <p className="text-2xl font-display font-bold text-white leading-none">{pct}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all bg-white/5">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 w-full bg-white/5 overflow-hidden">
                <div
                  className="h-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: f.color }}
                />
              </div>

              {/* Card Body */}
              {isExpanded && (
                <div className="p-10 bg-white/[0.01] border-t border-white/5 animate-fade-in-slow">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Requirements */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] border-b border-white/5 pb-4">
                        Requisitos Mandatorios ({done}/{f.requisitos.length})
                      </h4>
                      <div className="space-y-5">
                        {f.requisitos.map((req) => (
                          <div key={req.id} className="flex items-start gap-4 group/item">
                            <button
                              onClick={() => toggleReq(req.id)}
                              className={cn(
                                'mt-0.5 w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center shadow-lg flex-shrink-0',
                                reqs[req.id]
                                  ? 'bg-success border-success text-white scale-110'
                                  : 'border-white/10 hover:border-white/30 text-transparent'
                              )}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <div className="flex-1 space-y-1">
                              <p className={cn(
                                'text-sm font-medium leading-relaxed transition-colors',
                                reqs[req.id] ? 'text-white/50 line-through decoration-white/20' : 'text-white/90'
                              )}>
                                {req.text}
                              </p>
                              <span className="text-[10px] font-bold text-brand-light/40 uppercase tracking-widest">
                                {req.id}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status & Notes */}
                    <div className="space-y-8">
                      <div className="glass bg-white/[0.02] p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Estado de Fase</h4>
                        {pct === 100 ? (
                          <div className="flex items-center gap-4 text-success">
                            <div className="p-3 bg-success/10 rounded-2xl"><CheckCircle2 className="w-6 h-6" /></div>
                            <div>
                              <p className="text-sm font-bold uppercase tracking-wider">Completado ✓</p>
                              <p className="text-xs text-success/60 font-medium">Toda la documentación verificada.</p>
                            </div>
                          </div>
                        ) : pct > 0 ? (
                          <div className="flex items-center gap-4 text-warning">
                            <div className="p-3 bg-warning/10 rounded-2xl"><Clock className="w-6 h-6" /></div>
                            <div>
                              <p className="text-sm font-bold uppercase tracking-wider">En Progreso</p>
                              <p className="text-xs text-warning/60 font-medium">
                                {f.requisitos.length - done} tarea{f.requisitos.length - done !== 1 ? 's' : ''} pendiente{f.requisitos.length - done !== 1 ? 's' : ''} de auditoría.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 text-white/20">
                            <div className="p-3 bg-white/5 rounded-2xl"><AlertCircle className="w-6 h-6" /></div>
                            <div>
                              <p className="text-sm font-bold uppercase tracking-wider text-white/40">Pendiente</p>
                              <p className="text-xs text-white/20 font-medium">No se ha iniciado la fase.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                          <FileText className="w-3 h-3 text-brand-light" />
                          Notas Técnicas de Fase
                        </label>
                        <textarea
                          value={faseNotes[f.n] ?? ''}
                          onChange={(e) => saveFaseNote(f.n, e.target.value)}
                          placeholder="Ingrese observaciones internas sobre esta fase..."
                          className="input-premium min-h-[150px] resize-none text-sm leading-relaxed w-full"
                        />
                        <p className="text-[10px] text-white/20 italic text-right px-2 leading-relaxed">
                          Registro auditable por: <span className="font-bold text-brand-light/50">SISTEMA FSTD CERT</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
