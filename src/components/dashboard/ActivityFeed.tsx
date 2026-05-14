"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Clock, Activity as ActivityIcon } from 'lucide-react';

export default function ActivityFeed() {
  const { activity } = useAppStore();

  const shown = activity.slice(0, 10);

  return (
    <div className="glass p-8 rounded-[2rem]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ActivityIcon className="text-brand-light w-5 h-5" />
          <h3 className="text-lg font-display font-bold text-white/80 tracking-tight">Actividad Reciente</h3>
        </div>
        {activity.length > 0 && (
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            {activity.length} registros
          </span>
        )}
      </div>

      {activity.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/20">
          <Clock className="w-8 h-8 opacity-20 mb-2" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-center">Sin actividad aún</p>
          <p className="text-[10px] text-white/10 mt-1">Las acciones en QTG y Fases se registran aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((item, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
              <div
                className="w-2 h-2 rounded-full mt-1.5 ring-4 ring-white/5 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/60 leading-relaxed group-hover:text-white/80 transition-colors line-clamp-2">
                  {item.text}
                </p>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider mt-1 block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
