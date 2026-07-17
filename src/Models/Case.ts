export const CASE_STATUSES = [
  "قضية جديدة",
  "قيد المراجعة",
  "تم رفع الدعوى",
  "قيد النظر",
  "انتظار الجلسة",
  "تم تحديد جلسة",
  "قيد التحقيق",
  "انتظار الحكم",
  "تم الاستئناف",
  "تنفيذ الحكم",
  "موقوفة",
  "مغلقة",
  "كسبت",
  "خُسرت",
  "تمت التسوية",
  "رُفضت",
  "تم التنازل عنها",
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

export const PARTY_ROLES = [
  "مدعي",
  "مدعى عليه",
  "مستأنف",
  "مستأنف ضده",
] as const;

export type PartyRole = (typeof PARTY_ROLES)[number];

export interface Case {
  id: string;
  office_id: string;

  title: string;
  description?: string;

  case_number: string;
  case_year: string;

  client_name: string;
  client_opponent_name: string;

  client_role: PartyRole;
  client_opponent_role: PartyRole;

  client_national_id: string;
  client_opponent_national_id: string;

  latest_court_session_date?: string;
  next_court_session_date?: string;

  case_status: CaseStatus;
  latest_update: string;

  assigned_lawyer_id?: string;

  opened_at: string;
  closed_at?: string;

  created_at: string;
  updated_at: string;
}
