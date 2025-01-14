import { db } from "@/drizzle/db";
import { parseISO } from "date-fns";
import { notFound } from "next/navigation";
import { Calendar, CalendarCheck, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { clerkClient } from "@clerk/nextjs/server";
import { formatDateTime } from "@/lib/formatters";

type Props = {
  searchParams: Promise<{ startTime: string }>;
  params: Promise<{
    userId: string;
    eventId: string;
  }>;
};

export default async function BookingSuccessPage({
  searchParams,
  params,
}: Props) {
  const [{ startTime }, { userId, eventId }, { users }] = await Promise.all([
    searchParams,
    params,
    clerkClient(),
  ]);
  const { fullName: eventAuthor } = await users.getUser(userId);

  if (!startTime) notFound();

  const event = await db.query.events.findFirst({
    where: ({ id, userId: clerkUserId }, { eq, and }) =>
      and(eq(id, eventId), eq(clerkUserId, userId)),
  });

  if (!event) notFound();

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <CalendarCheck className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your meeting with {eventAuthor} has been successfully scheduled.
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Booking Details</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span>{formatDateTime(parseISO(startTime))}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>{event.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span>Online meeting</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Next Steps</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              Check your email for a calendar invite and additional details.
            </li>
            <li>
              Prepare any necessary materials or questions for the meeting.
            </li>
            <li>
              If you need to reschedule, please contact the organizer directly.
            </li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link href={`/book/${userId}`}>View More Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
