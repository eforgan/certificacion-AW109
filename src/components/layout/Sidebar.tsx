"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Image as ImageIcon,
  Calculator,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'qtg', label: 'Gestión QTG', icon: FileText, href: '/qtg' },
  { id: 'fases', label: 'Fases Certificación', icon: CheckSquare, href: '/fases' },
  { id: 'normativa', label: 'Normativa RAAC', icon: ShieldCheck, href: '/normativa' },
  { id: 'docs', label: 'Documentación', icon: BookOpen, href: '/docs' },
  { id: 'visual', label: 'Recursos Visuales', icon: ImageIcon, href: '/visual' },
  { id: 'wb', label: 'Computadoras W&B', icon: Calculator, href: '/wb' },
];

const DEMO_USER = { email: 'operador@fstd.com', name: 'Eduardo Forgan', role: 'Operador', abbr: 'FOR', color: '#f59e0b', pass: 'demo123' };

export default function Sidebar() {
  const pathname = usePathname();
  const { user, qtg, reqs, docs, checklist } = useAppStore();

  const effectiveUser = user ?? DEMO_USER;

  const getProgress = (id: string) => {
    switch (id) {
      case 'qtg':
        return Math.round((qtg.filter(q => q.status === 'approved').length / qtg.length) * 100);
      case 'fases':
        const done = Object.values(reqs).filter(Boolean).length;
        const total = Object.keys(reqs).length;
        return Math.round((done / total) * 100);
      case 'docs':
        return Math.round((docs.filter(d => d.status.includes('✅')).length / docs.length) * 100);
      default:
        return 0;
    }
  };

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-[#1577c4] border-r border-white/20 flex flex-col z-50 shadow-2xl">
      {/* Brand & Logos Top */}
      <div className="p-6 border-b border-white/20">
        <div className="flex flex-col gap-4 mb-6">
          <div className="aspect-[16/9] w-full bg-white/10 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
            <img src="/img/logo_modena_ceac.png" alt="Modena CEAC" className="w-full h-full object-cover brightness-110" />
          </div>
          <div className="aspect-[16/9] w-full bg-white/10 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
            <img src="/img/logo_6xsim.png" alt="6XSIM" className="w-full h-full object-cover brightness-110" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg border border-white/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tighter text-white uppercase">FSTD Cert</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/90 font-black">AW109E Power</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="mx-6 p-4 rounded-2xl bg-white/5 border border-white/5 mb-8">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner"
            style={{ background: `linear-gradient(135deg, ${effectiveUser.color}, ${effectiveUser.color}88)` }}
          >
            {effectiveUser.abbr}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{effectiveUser.name}</p>
            <p className="text-xs text-white/40 truncate">{effectiveUser.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const progress = getProgress(item.id);
          
          return (
            <Link 
              key={item.id}
              href={item.href}
              className={cn(
                "group flex flex-col p-3 rounded-xl transition-all duration-300",
                isActive ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-brand-light" : "text-current")} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {progress > 0 && (
                  <span className="text-[10px] font-bold text-brand-light/70">{progress}%</span>
                )}
              </div>
              
              {isActive && progress > 0 && (
                <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-light transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer & Logos Bottom */}
      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <button 
          onClick={() => useAppStore.getState().setUser(null)}
          className="flex items-center gap-3 w-full p-3 rounded-xl text-white/40 hover:text-danger hover:bg-danger/10 transition-all duration-300 mb-6"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>

        <div className="flex items-center justify-between opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <img src="/img/logo_modena_ceac.png" alt="Modena CEAC" className="h-6 w-auto object-contain" />
          <img src="/img/logo_6xsim.png" alt="6XSIM" className="h-6 w-auto object-contain" />
        </div>
        <p className="text-[8px] text-center text-white/10 mt-4 leading-tight font-medium uppercase tracking-[0.1em]">
          Certification Manager v1.0<br/>&copy; 2026 Modena CEAC
        </p>
      </div>
    </aside>
  );
}
