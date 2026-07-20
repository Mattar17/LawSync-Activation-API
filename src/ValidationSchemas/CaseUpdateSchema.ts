import { z } from "zod";
import { CASE_STATUSES } from "./CaseSchema.js";
import { createCaseSchema } from "./CaseSchema.js";
export const lawyerUpdateSchema = z
  .object({
    case_status: z.enum(CASE_STATUSES).optional(),
    latest_court_session_date: z
      .string()
      .optional()
      .refine(
        (date) => !date || new Date(date) <= new Date(),
        "تاريخ آخر جلسة لا يمكن أن يكون في المستقبل",
      ),
    next_court_session_date: z.string().optional(),

    latest_update: z.string().optional(),
  })
  .strict();

export const ownerUpdateSchema = createCaseSchema
  .partial()
  .extend({
    case_status: z.enum(CASE_STATUSES).optional(),
    latest_update: z.string().optional(),
  })
  .strict();
