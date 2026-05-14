"use client";

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FASES_DATA } from '@/lib/data';

const R = 54;
const CIRC = 2 * Math.PI * R;

function Ring({ pct, color, size = 140 }: { pct: number; color: string; size?: number }) {
  const dash = (pct / 100) * CIRC;
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" className="-rotate-90">
      <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
      <circle
        cx="64" cy="64" r={R}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${CIRC}`}
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  );
}

export default function CertProgress() {
  const { qtg, reqs } = useAppStore();

  const qtgApproved = qtg.filter(q => q.status === 'approved').length;
  const qtgRejected = qtg.filter(q => q.status === 'rejected').length;
  const qtgPct = Math.round((qtgApproved / qtg.length) * 100);

  const totalReqs  = FASES_DATA.reduce((a, f) => a + f.requisitos.length, 0);
  const doneReqs   = FASES_DATA.reduce((a, f) => a + f.requisitos.filter(r => reqs[r.id]).length, 0);
  const fasesPct   = Math.round((doneReqs / totalReqs) * 100);

  const globalPct  = Math.round((qtgPct + fasesPct) / 2);

  const criticalRejected = qtg.filter(q => q.status === 'rejected' && q.critical);

  return (
    <div className="glass p-8 rounded-[2rem] space-y-8">
      <h3 className="text-lg font-display font-bold text-white/80 tracking-tight flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-brand-light" />
        Progreso de Certificación
      </h3>

      {/* Rings */}
      <div className="flex items-center justify-around">
        {[
          { label: 'Global', pct: globalPct, color: globalPct >= 80 ? '#22c55e' : globalPct >= 40 ? '#3b82f6' : '#f59e0b' },
          { label: 'QTG',    pct: qtgPct,    color: '#3b82f6' },
          { label: 'Fases',  pct: fasesPct,  color: '#8b5cf6' },
        ].map(({ label, pct, color }) => (
          <div key={label} className="flex flex-col items-center gap-3">
            <div className="relative">
              <Ring pct={pct} color={color} size={100} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-display font-black text-white">{pct}<span className="text-xs text-white/40">%</span></span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Critical alerts */}
      {criticalRejected.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Críticos sin resolver ({criticalRejected.length})
          </p>
          {criticalRejected.slice(0, 3).map(q => (
            <Link
              key={q.id}
              href="/qtg"
              className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all group"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white/80 truncate">{q.id}</p>
                <p className="text-[10px] text-white/30 truncate">{q.name}</p>
              </div>
              <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors" />
            </Link>
          ))}
          {criticalRejected.length > 3 && (
            <Link href="/qtg" className="text-[10px] text-red-400/60 hover:text-red-400 font-bold uppercase tracking-widest transition-colors">
              Ver {criticalRejected.length - 3} más →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <div>
            <p className="text-xs font-bold text-success">Sin alertas críticas</p>
            <p className="text-[10px] text-white/30 mt-0.5">Todas las pruebas críticas en orden.</p>
          </div>
        </div>
      )}
    </div>
  );
}
