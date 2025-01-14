import { startOfDay } from "date-fns";
import { z } from "zod";

const meetingBaseSchema = z.object({
  timezone: z.string().min(1, "Required"),
  startTime: z.date().min(new Date()),
  guestName: z.string().min(1, "Required"),
  guestEmail: z.string().email().min(1, "Required"),
  guestNotes: z.string().optional(),
});

export const meetingFormSchema = z
  .object({
    date: z.date().min(startOfDay(new Date()), "Must be in the future"),
  })
  .merge(meetingBaseSchema);
export type MeetingFormSchemaType = z.infer<typeof meetingFormSchema>;

export const meetingActionSchema = z
  .object({
    eventId: z.string().min(1, "Required"),
    clerkUserId: z.string().min(1, "Required"),
  })
  .merge(meetingBaseSchema);
