"use client";

import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Activity as ActivityIcon,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FASES_DATA } from '@/lib/data';
import SummaryCards from './SummaryCards';
import MainCharts from './MainCharts';
import ActivityFeed from './ActivityFeed';
import FasesSummary from './FasesSummary';

const DEMO_USER = { email: 'operador@fstd.com', name: 'Eduardo Forgan', role: 'Operador', abbr: 'FOR', color: '#f59e0b', pass: 'demo123' };

export default function DashboardView() {
  const { user, qtg, reqs, activity, setUser } = useAppStore();

  useEffect(() => {
    if (!user) setUser(DEMO_USER);
  }, []);

  const effectiveUser = user ?? DEMO_USER;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            Dashboard Ejecutivo
            <span className="text-xs bg-brand/10 text-brand-light px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-brand/20">RAAC 60</span>
          </h2>
          <p className="text-white/40 font-medium">Estado de certificación del FSTD AW109E Power</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <Clock className="w-3 h-3 text-brand-light" />
          Última actualización: {new Date().toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* KPI Cards */}
      <SummaryCards />

      {/* Charts & Main Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MainCharts />
        </div>
        <div className="space-y-8">
          <FasesSummary />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
