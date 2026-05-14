export type Category = 'performance' | 'handling' | 'systems' | 'emergency' | 'visual' | 'cabina';

export interface QTGTest {
  id: string;
  cat: Category;
  critical: boolean;
  name: string;
  ref: string;
  param: string;
  unit: string;
  ref_val: string;
  tol: string;
  cond: string;
  status: 'pending' | 'approved' | 'rejected';
  result?: string;
  obs?: string;
  savedBy?: string;
  savedAt?: string;
  // Secciones técnicas para la Planilla de Verificación
  procedure?: string;   // Descripción del procedimiento según RAAC 60
  rfm_params?: {        // Parámetros del Manual de Operación de la aeronave
    label: string;
    value: string;
    unit?: string;
  }[];
}

export interface Requisito {
  id: string;
  text: string;
  done: boolean;
}

export interface Fase {
  n: number;
  color: string;
  title: string;
  desc: string;
  status: 'pending' | 'in-progress' | 'completed';
  requisitos: Requisito[];
}

export interface User {
  email: string;
  name: string;
  role: string;
  abbr: string;
  color: string;
}

export interface Documento {
  id: string;
  icon: string;
  name: string;
  cat: string;
  date: string;
  size: string;
  status: string;
  url?: string;
}

export interface NormativaItem {
  id: string;
  section: string;
  title: string;
  ref: string;
  content: string;
}

export interface Activity {
  text: string;
  color: string;
  time: string;
}

export interface Snapshot {
  date: string;
  pct: number;
}

export type NotifLevel = 'info' | 'warning' | 'critical' | 'success';

export interface Notif {
  id: string;
  title: string;
  body: string;
  level: NotifLevel;
  time: string;
  read: boolean;
  link?: string;
}
