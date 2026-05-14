"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FASES_DATA } from '@/lib/data';
import { Notif, NotifLevel } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const levelConfig: Record<NotifLevel, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  critical: { icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
  warning:  { icon: Zap,           color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  info:     { icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30' },
  success:  { icon: CheckCircle,   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30' },
};

function useNotifInit() {
  const { qtg, reqs, notifs, addNotif } = useAppStore();

  useEffect(() => {
    if (notifs.length > 0) return;

    const rejected = qtg.filter(q => q.status === 'rejected');
    if (rejected.length > 0) {
      addNotif({
        title: `${rejected.length} prueba${rejected.length > 1 ? 's' : ''} QTG rechazada${rejected.length > 1 ? 's' : ''}`,
        body: `Las pruebas ${rejected.slice(0, 3).map(q => q.id).join(', ')}${rejected.length > 3 ? '...' : ''} requieren acción correctiva.`,
        level: 'critical',
        link: '/qtg',
      });
    }

    FASES_DATA.forEach(f => {
      const done = f.requisitos.filter(r => reqs[r.id]).length;
      if (done === 0) {
        addNotif({
          title: `Fase ${f.n} sin iniciar`,
          body: `La fase "${f.title.split('—')[1]?.trim() ?? f.title}" aún no tiene requisitos completados.`,
          level: 'warning',
          link: '/fases',
        });
      }
    });

    const pendingQtg = qtg.filter(q => q.status === 'pending').length;
    addNotif({
      title: 'Resumen de certificación',
      body: `${pendingQtg} pruebas QTG pendientes de evaluación. Revise el panel de QTG.`,
      level: 'info',
      link: '/qtg',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default function NotificationBell() {
  const { notifs, markNotifRead, markAllNotifRead, clearNotifs } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useNotifInit();

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/70 hover:text-white"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-lg shadow-red-500/40">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl bg-[#0f1923] border border-white/10 shadow-2xl shadow-black/60 z-[200] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-xs font-black text-white uppercase tracking-widest">
              Notificaciones {unread > 0 && <span className="ml-1 text-red-400">({unread})</span>}
            </span>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAllNotifRead}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={clearNotifs}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-all"
                title="Limpiar notificaciones"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-10 text-center text-white/20 text-xs font-medium">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                Sin notificaciones
              </div>
            ) : (
              notifs.map(n => {
                const cfg = levelConfig[n.level];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => markNotifRead(n.id)}
                    className={cn(
                      'flex gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all',
                      !n.read && 'bg-white/[0.03]'
                    )}
                  >
                    <div className={cn('mt-0.5 p-1.5 rounded-lg flex-shrink-0', cfg.bg, cfg.border, 'border')}>
                      <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn('text-xs font-bold leading-tight', n.read ? 'text-white/50' : 'text-white')}>
                          {n.title}
                        </p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-white/30 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                      <p className="text-[9px] text-white/20 mt-1">{n.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
