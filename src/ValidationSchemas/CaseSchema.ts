import { z } from "zod";

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

export const PARTY_ROLES = [
  "مدعي",
  "مدعى عليه",
  "مستأنف",
  "مستأنف ضده",
] as const;

export const createCaseSchema = z
  .object({
    title: z.string().min(1, "عنوان القضية مطلوب"),

    description: z.string().optional(),

    case_number: z.string().min(1, "رقم القضية مطلوب"),

    case_year: z.string().regex(/^\d{4}$/, "السنة غير صحيحة"),

    client_name: z.string().min(1, "اسم الموكل مطلوب"),

    client_opponent_name: z.string().min(1, "اسم الخصم مطلوب"),

    client_role: z.enum(PARTY_ROLES, "صفة الموكل غير صحيحة"),

    client_opponent_role: z.enum(PARTY_ROLES, "صفة الخصم غير صحيحة"),

    client_national_id: z.string().regex(/^\d{14}$/, "الرقم القومي غير صحيح"),

    client_opponent_national_id: z
      .string()
      .regex(/^\d{14}$/, "الرقم القومي غير صحيح"),

    latest_court_session_date: z
      .string()
      .optional()
      .refine(
        (date) => !date || new Date(date) <= new Date(),
        "تاريخ آخر جلسة لا يمكن أن يكون في المستقبل",
      ),
    next_court_session_date: z.string().optional(),

    case_status: z.enum(CASE_STATUSES).default("قضية جديدة"),

    latest_update: z.string().default("لم يتم العمل عليها بعد"),

    assigned_lawyer_id: z.string().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.latest_court_session_date &&
      data.next_court_session_date &&
      new Date(data.latest_court_session_date) >
        new Date(data.next_court_session_date)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["next_court_session_date"],
        message: "آخر جلسة يجب أن تكون قبل الجلسة القادمة",
      });
    }
  });
