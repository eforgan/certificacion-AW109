"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calculator,
  Weight,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  Fuel,
  Users as UsersIcon,
  Maximize2,
} from 'lucide-react';
import { AW109E_SPECS } from '@/lib/data';
import WBChart from '@/components/wb/WBChart';
import UnitConverter from '@/components/wb/UnitConverter';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WBItem {
  id: string;
  label: string;
  weight: number;
  arm: number;
  editableWeight: boolean;
  editableArm: boolean;
}

const initialItems: WBItem[] = [
  { id: 'empty', label: 'Peso Vacío Equipado', weight: 1700, arm: 3390, editableWeight: true, editableArm: true },
  { id: 'pilot', label: 'Piloto (PLT)', weight: 80, arm: 1980, editableWeight: true, editableArm: false },
  { id: 'copilot', label: 'Co-Piloto (CP)', weight: 0, arm: 1980, editableWeight: true, editableArm: false },
  { id: 'passengers', label: 'Pasajeros (PAX)', weight: 0, arm: 2950, editableWeight: true, editableArm: false },
  { id: 'fuel', label: 'Combustible (JET A-1)', weight: 300, arm: 3500, editableWeight: true, editableArm: false },
  { id: 'cargo', label: 'Equipaje / Carga', weight: 0, arm: 4300, editableWeight: true, editableArm: true },
];

export default function WBPage() {
  const [items, setItems] = useState<WBItem[]>(initialItems);
  const [totals, setTotals] = useState({ weight: 0, moment: 0, cg: 0 });

  useEffect(() => {
    const w = items.reduce((acc, item) => acc + item.weight, 0);
    const m = items.reduce((acc, item) => acc + (item.weight * item.arm), 0);
    const cg = w > 0 ? Math.round((m / w) * 10) / 10 : 0;
    setTotals({ weight: w, moment: m, cg });
  }, [items]);

  const updateItem = (id: string, weight: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, weight } : item));
  };

  const isOverweight = totals.weight > AW109E_SPECS.rfm.weights.mtow_kg;
  
  // Validation for CG
  const isValidCG = (weight: number, cg: number) => {
    const limit = AW109E_SPECS.rfm.cg.limits.find(l => weight <= l.weight_kg) || 
                  AW109E_SPECS.rfm.cg.limits[AW109E_SPECS.rfm.cg.limits.length - 1];
    return cg >= limit.fwd_mm && cg <= limit.aft_mm;
  };

  const cgValid = isValidCG(totals.weight, totals.cg);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            Computadoras de Certificación
            <span className="text-xs bg-brand/10 text-brand-light px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-brand/20">Metric/Imperial</span>
          </h2>
          <p className="text-white/40 font-medium">Validación de envolvente AW109E Power & Utilidades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        
        {/* Table Column */}
        <div className="space-y-8">
           <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 uppercase text-[10px] font-bold tracking-[0.2em] text-white/40">
                    <th className="px-8 py-6">Componente</th>
                    <th className="px-6 py-6 text-center">Peso (kg)</th>
                    <th className="px-6 py-6 text-center">Brazo (mm)</th>
                    <th className="px-8 py-6 text-right">Momento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="group transition-colors hover:bg-white/[0.02]">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                           {item.id === 'fuel' ? <Fuel className="w-4 h-4 text-brand-light" /> : 
                            item.id === 'pilot' || item.id === 'copilot' || item.id === 'passengers' ? <UsersIcon className="w-4 h-4 text-brand-light" /> :
                            <Weight className="w-4 h-4 text-white/20" />}
                           <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex justify-center">
                            <input 
                              type="number" 
                              value={item.weight || ''}
                              onChange={(e) => updateItem(item.id, Number(e.target.value))}
                              disabled={!item.editableWeight}
                              className="w-24 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-center text-sm font-display font-bold text-brand-light focus:border-brand-light/50 outline-none transition-all"
                            />
                         </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <span className="text-sm font-mono text-white/30">{item.arm}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <span className="text-sm font-mono text-white/60">{(item.weight * item.arm).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-brand/5 border-t border-brand/10">
                    <td className="px-8 py-6 text-sm font-bold text-brand-light uppercase tracking-widest">Totales de Vuelo</td>
                    <td className="px-6 py-6 text-center">
                       <span className={cn(
                         "text-xl font-display font-bold",
                         isOverweight ? "text-danger" : "text-white"
                       )}>{totals.weight.toLocaleString()} kg</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                       <div className="flex flex-col items-center">
                          <span className={cn(
                            "text-xl font-display font-bold",
                            !cgValid ? "text-warning" : "text-success"
                          )}>{totals.cg} mm</span>
                          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">CG</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="text-sm font-mono text-white/40">{totals.moment.toLocaleString()}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
           </div>

           {/* Alerts & Specs */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={cn(
                "glass p-6 rounded-3xl border transition-all duration-500",
                isOverweight ? "border-danger/30 bg-danger/5" : "border-success/30 bg-success/5"
              )}>
                 <div className="flex items-center gap-3 mb-3">
                    {isOverweight ? <AlertTriangle className="text-danger" /> : <CheckCircle2 className="text-success" />}
                    <h4 className="font-bold text-white uppercase text-xs tracking-widest">Línea de Peso</h4>
                 </div>
                 <p className="text-sm text-white/60 leading-relaxed font-medium">
                   {isOverweight 
                     ? `¡MTOW EXCEDIDO! Superó el límite de ${AW109E_SPECS.rfm.weights.mtow_kg} kg por ${(totals.weight - AW109E_SPECS.rfm.weights.mtow_kg).toLocaleString()} kg.`
                     : `Masa total dentro de los límites operativos (≤ ${AW109E_SPECS.rfm.weights.mtow_kg} kg).`}
                 </p>
              </div>

              <div className={cn(
                "glass p-6 rounded-3xl border transition-all duration-500",
                !cgValid ? "border-warning/30 bg-warning/5" : "border-brand-light/30 bg-brand-light/5"
              )}>
                 <div className="flex items-center gap-3 mb-3">
                    {!cgValid ? <AlertTriangle className="text-warning" /> : <Info className="text-brand-light" />}
                    <h4 className="font-bold text-white uppercase text-xs tracking-widest">Equilibrio CG</h4>
                 </div>
                 <p className="text-sm text-white/60 leading-relaxed font-medium">
                   {!cgValid 
                     ? `¡CG FUERA DE LÍMITES! Verifique la distribución de carga para estabilizar el centro de gravedad.`
                     : `Centro de Gravedad dentro de la envolvente para el peso actual.`}
                 </p>
              </div>
           </div>
        </div>

        {/* Chart Column */}
        <div className="flex flex-col gap-6 h-full min-h-[600px]">
           <div className="glass p-8 rounded-[2.5rem] border-white/5 flex-1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="flex items-center justify-between mb-8">
                 <div className="space-y-1">
                    <h3 className="text-xl font-display font-bold text-white tracking-tight">Gráfico de Envolvente CG</h3>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Coordenadas: Estación (mm) vs Peso (kg)</p>
                 </div>
                 <button className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all">
                    <Maximize2 className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex-1 min-h-[400px]">
                 <WBChart currentWeight={totals.weight} currentCG={totals.cg} />
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4">
                  <div className="text-center">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Datum</p>
                     <p className="text-[11px] font-bold text-white/60">NARIZ (STA 0)</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Unidades</p>
                     <p className="text-[11px] font-bold text-white/60">Sistema Métrico</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Aeronave</p>
                     <p className="text-[11px] font-bold text-white/60">AW109E Power</p>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Unit Converter Integration */}
      <UnitConverter />
    </div>
  );
}
