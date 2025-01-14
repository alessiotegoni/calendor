"use server";

import { db } from "@/drizzle/db";
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { meetingActionSchema } from "@/schema/meetings";
import { z } from "zod";
import { redirect } from "next/navigation";
import { fromZonedTime } from "date-fns-tz";
import { createCalendarEvent } from "./googleCalendar";

export async function createMeeting(
  unsafeData: z.infer<typeof meetingActionSchema>
) {
  const { success, data } = meetingActionSchema.safeParse(unsafeData);

  if (!success) return { error: true };

  const event = await db.query.events.findFirst({
    where: ({ userId, isActive, id }, { eq, and }) =>
      and(
        eq(isActive, true),
        eq(userId, data.clerkUserId),
        eq(id, data.eventId)
      ),
  });

  if (!event) return { error: true };
  const startInTimezone = fromZonedTime(data.startTime, data.timezone);

  const validTimes = await getValidTimesFromSchedule([startInTimezone], event);
  if (!validTimes.length) return { error: true };

  await createCalendarEvent({
    ...data,
    startTime: startInTimezone,
    durationInMinutes: event.durationInMinutes,
    eventName: event.name,
  });

  const searchParams = new URLSearchParams({
    startTime: data.startTime.toISOString(),
  });

  redirect(
    `/book/${data.clerkUserId}/${
      data.eventId
    }/success?${searchParams.toString()}`
  );
}
