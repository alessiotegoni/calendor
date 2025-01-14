"use server"

import { db } from "@/drizzle/db";
import { scheduleAvailabilities, schedules } from "@/drizzle/schema";
import { scheduleFormSchema, ScheduleFormSchemaType } from "@/schema/schedule";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";

export async function saveSchedule(data: ScheduleFormSchemaType) {
  const { userId: clerkUserId } = await auth();

  const { error } = scheduleFormSchema.safeParse(data);

  if (!clerkUserId || error) return { error: true };

  const { availabilities, ...scheduledData } = data;

  const [{ scheduleId }] = await db
    .insert(schedules)
    .values({ userId: clerkUserId, ...scheduledData })
    .onConflictDoUpdate({ target: schedules.userId, set: scheduledData })
    .returning({ scheduleId: schedules.id });

  const statements: [BatchItem<"pg">] = [
    db
      .delete(scheduleAvailabilities)
      .where(eq(scheduleAvailabilities.scheduleId, scheduleId)),
  ];

  if (availabilities.length) {
    statements.push(
      db
        .insert(scheduleAvailabilities)
        .values(availabilities.map((avb) => ({ scheduleId, ...avb })))
    );
  }

  await db.batch(statements);
}
