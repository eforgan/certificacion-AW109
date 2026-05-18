import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QTGTest, Fase, Documento, User, Activity, Snapshot, Category, Notif, NotifLevel } from '../types';
import { QTG_DATA, FASES_DATA, DOCS_DATA } from '../lib/data';

interface AppState {
  user: User | null;
  qtg: QTGTest[];
  reqs: Record<string, boolean>;
  reqNotes: Record<string, string>;
  faseNotes: Record<number, string>;
  docs: Documento[];
  activity: Activity[];
  snapshots: Snapshot[];
  checklist: Record<string, boolean>;
  notifs: Notif[];

  // Actions
  setUser: (user: User | null) => void;
  updateQTG: (id: string, updates: Partial<QTGTest>) => void;
  toggleReq: (id: string) => void;
  saveReqNote: (id: string, note: string) => void;
  saveFaseNote: (faseN: number, note: string) => void;
  logActivity: (text: string, color?: string) => void;
  addDocument: (doc: Documento) => void;
  toggleChecklist: (id: string) => void;
  addSnapshot: (snapshot: Snapshot) => void;
  addNotif: (notif: Omit<Notif, 'id' | 'time' | 'read'>) => void;
  markNotifRead: (id: string) => void;
  markAllNotifRead: () => void;
  clearNotifs: () => void;
  resetState: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: { email: 'operador@fstd.com', name: 'Eduardo Forgan', role: 'Operador', abbr: 'FOR', color: '#f59e0b', pass: 'demo123' },
      qtg: QTG_DATA,
      reqs: FASES_DATA.reduce((acc, f) => {
        f.requisitos.forEach(r => { acc[r.id] = r.done; });
        return acc;
      }, {} as Record<string, boolean>),
      reqNotes: {},
      faseNotes: {},
      docs: DOCS_DATA,
      activity: [],
      snapshots: [],
      checklist: {},
      notifs: [],

      setUser: (user) => set({ user }),
      
      updateQTG: (id, updates) => set((state) => ({
        qtg: state.qtg.map(q => q.id === id ? { ...q, ...updates } : q)
      })),

      toggleReq: (id) => set((state) => ({
        reqs: { ...state.reqs, [id]: !state.reqs[id] }
      })),

      saveReqNote: (id, note) => set((state) => ({
        reqNotes: { ...state.reqNotes, [id]: note }
      })),

      saveFaseNote: (faseN, note) => set((state) => ({
        faseNotes: { ...state.faseNotes, [faseN]: note }
      })),

      logActivity: (text, color = '#64748b') => set((state) => ({
        activity: [
          { text, color, time: new Date().toLocaleString('es-AR') },
          ...state.activity.slice(0, 49)
        ]
      })),

      addDocument: (doc) => set((state) => ({
        docs: [doc, ...state.docs]
      })),

      toggleChecklist: (id) => set((state) => ({
        checklist: { ...state.checklist, [id]: !state.checklist[id] }
      })),

      addSnapshot: (snapshot) => set((state) => {
        const last = state.snapshots[state.snapshots.length - 1];
        if (last && last.date === snapshot.date) {
            return { snapshots: [...state.snapshots.slice(0, -1), snapshot] };
        }
        return { snapshots: [...state.snapshots.slice(-59), snapshot] };
      }),

      addNotif: (notif) => set((state) => ({
        notifs: [
          {
            ...notif,
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            time: new Date().toLocaleString('es-AR'),
            read: false,
          },
          ...state.notifs.slice(0, 49),
        ]
      })),

      markNotifRead: (id) => set((state) => ({
        notifs: state.notifs.map(n => n.id === id ? { ...n, read: true } : n)
      })),

      markAllNotifRead: () => set((state) => ({
        notifs: state.notifs.map(n => ({ ...n, read: true }))
      })),

      clearNotifs: () => set({ notifs: [] }),

      resetState: () => set({
        qtg: QTG_DATA,
        reqs: FASES_DATA.reduce((acc, f) => {
          f.requisitos.forEach(r => { acc[r.id] = r.done; });
          return acc;
        }, {} as Record<string, boolean>),
        reqNotes: {},
        faseNotes: {},
        docs: DOCS_DATA,
        activity: [],
        snapshots: [],
        checklist: {},
        notifs: [],
      }),
    }),
    {
      name: 'fstd-aw109e-storage',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        // Siempre usar la lista completa de QTG_DATA como base,
        // pero preservar resultados/estado guardados por el usuario
        qtg: QTG_DATA.map(q => {
          const saved = persisted?.qtg?.find((s: any) => s.id === q.id);
          if (!saved) return q;
          return { ...q, status: saved.status, result: saved.result, obs: saved.obs, savedBy: saved.savedBy, savedAt: saved.savedAt };
        }),
      }),
    }
  )
);
