import { events } from "@/drizzle/schema";
import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  durationInMinutes: z
    .number({ message: "Duration must be a number" })
    .positive("Duration must be greater then 0")
    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12}) minutes`),
});

export type insertEventType = z.infer<typeof eventFormSchema>;
export type selectEventType = typeof events.$inferSelect;
