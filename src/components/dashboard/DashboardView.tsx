"use client";

import React from 'react';
import { Clock, FileText, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FASES_DATA } from '@/lib/data';
import SummaryCards from './SummaryCards';
import MainCharts from './MainCharts';
import ActivityFeed from './ActivityFeed';
import FasesSummary from './FasesSummary';
import CertProgress from './CertProgress';
import { printQTGReport } from '@/lib/export';

export default function DashboardView() {
  const { qtg, reqs } = useAppStore();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            Dashboard Ejecutivo
            <span className="text-xs bg-brand/10 text-brand-light px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-brand/20">
              RAAC 60
            </span>
          </h2>
          <p className="text-white/40 font-medium">Estado de certificación del FSTD AW109E Power</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => printQTGReport(qtg, reqs)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-400 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <FileText className="w-3.5 h-3.5" />
            Reporte PDF
          </button>
          <div className="flex items-center gap-2 text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Clock className="w-3 h-3 text-brand-light" />
            {new Date().toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <SummaryCards />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts — 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          <MainCharts />
        </div>

        {/* Right column */}
        <div className="space-y-8">
          <CertProgress />
          <FasesSummary />
        </div>
      </div>

      {/* Activity feed — full width below */}
      <ActivityFeed />
    </div>
  );
}
