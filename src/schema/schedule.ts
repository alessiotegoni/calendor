import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { timeToInt } from "@/lib/utils";
import { z } from "zod";

export const scheduleFormSchema = z.object({
  timezone: z.string().min(1, "Required"),
  availabilities: z
    .array(
      z.object({
        dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
        startTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM"
          ),
        endTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM"
          ),
      })
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((avb, index) => {
        const overlaps = availabilities.some(
          (a, i) =>
            i !== index &&
            a.dayOfWeek === avb.dayOfWeek &&
            timeToInt(a.startTime) < timeToInt(avb.endTime) &&
            timeToInt(a.endTime) > timeToInt(avb.startTime)
        );

        if (overlaps) {
          ctx.addIssue({
            code: "custom",
            message: "Availability overlaps with another",
            path: [index],
          });
        }

        if (timeToInt(avb.startTime) >= timeToInt(avb.endTime)) {
          ctx.addIssue({
            code: "custom",
            message: "End time must be after start",
            path: [index],
          });
        }
      });
    }),
});
export type ScheduleFormSchemaType = z.infer<typeof scheduleFormSchema>;
