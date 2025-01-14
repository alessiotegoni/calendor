import { db } from "@/drizzle/db";
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { clerkClient } from "@clerk/nextjs/server";
import {
  addMonths,
  eachMinuteOfInterval,
  endOfDay,
  roundToNearestMinutes,
} from "date-fns";
import { notFound } from "next/navigation";
import { CalendarX } from "lucide-react";
import MeetingForm from "@/components/forms/MeetingForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params?: Promise<{ userId: string; eventId: string }>;
};

export default async function BookEventPage({ params }: Props) {
  const eventId = (await params)?.eventId;
  const eventUserId = (await params)?.userId;

  if (!eventUserId || !eventId) notFound();

  const event = await db.query.events.findFirst({
    where: ({ id, userId, isActive }, { and, eq }) =>
      and(eq(id, eventId), eq(userId, eventUserId), eq(isActive, true)),
  });

  if (!event) notFound();

  const { users } = await clerkClient();

  const calendarUser = await users.getUser(eventUserId);

  const startDate = roundToNearestMinutes(new Date(), {
    nearestTo: 15,
    roundingMethod: "ceil",
  });
  const endDate = endOfDay(addMonths(startDate, 2));

  const validTimes = await getValidTimesFromSchedule(
    eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
    event
  );

  return (
    <div className="container max-w-lg">
      {!validTimes.length ? (
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">{event.name}</h1>
          <div className="size-48 rounded-full bg-primary/10 flex-center animate-pulse">
            <CalendarX className="w-24 h-24 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              No Available Time Slots
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {calendarUser.fullName || "The organizer"} doesn&apos;t have any
              available time slots for this event at the moment.
            </p>
          </div>
          <Button asChild size="lg" className="mt-4">
            <Link href={`/book/${eventUserId}`}>View Other Events</Link>
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-3xl xl:text-4xl font-semibold text-foreground mt-5">
            {event.name}
          </h1>
          <p className="text-foreground mt-2 mb-5">
            {calendarUser.fullName}&apos;s event
          </p>
          <MeetingForm
            validTimes={validTimes}
            eventId={event.id}
            clerkUserId={calendarUser.id}
          />
        </>
      )}
    </div>
  );
}
