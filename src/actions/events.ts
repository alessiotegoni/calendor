"use server";

import { db } from "@/drizzle/db";
import { events } from "@/drizzle/schema";
import { eventFormSchema, insertEventType } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createEvent(data: insertEventType) {
  const { userId } = await auth();

  const { error } = eventFormSchema.safeParse(data);

  if (error || !userId) return { error: true };

  await db
    .insert(events)
    .values({ ...data, userId })
    .returning({ eventId: events.id });

  redirect(`/events`);
}

export async function editEvent(data: insertEventType, eventId: string) {
  const { userId } = await auth();

  const { error } = eventFormSchema.safeParse(data);

  if (error || !userId) return { error: true };

  const { rowCount } = await db
    .update(events)
    .set({ ...data })
    .where(and(eq(events.id, eventId), eq(events.userId, userId)));

  if (!rowCount) return { error: true };

  redirect(`/events`);
}

export async function deleteEvent(eventId: string) {
  const { userId } = await auth();

  if (!userId) return { error: true };

  const { rowCount } = await db
    .delete(events)
    .where(and(eq(events.id, eventId), eq(events.userId, userId)));

  if (!rowCount) return { error: true };

  redirect(`/events`);
}
