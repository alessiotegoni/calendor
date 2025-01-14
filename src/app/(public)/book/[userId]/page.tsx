import EventCard from "@/components/EventCard";
import { db } from "@/drizzle/db";
import { clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarX } from "lucide-react";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserEventsPage({ params }: Props) {
  const { userId: clerkUserId } = await params;

  if (!clerkUserId) notFound();

  const events = await db.query.events.findMany({
    where: ({ userId }, { eq }) => eq(userId, clerkUserId),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  const { fullName } = await (await clerkClient()).users.getUser(clerkUserId);

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card className="bg-card text-card-foreground mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{fullName}</CardTitle>
          <CardDescription className="text-lg mt-2">
            Schedule a meeting with me by selecting an event type below.
          </CardDescription>
        </CardHeader>
      </Card>

      {events.length === 0 ? (
        <Card className="bg-muted/50 text-muted-foreground">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarX className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Events Available</h2>
            <p className="text-center max-w-md">
              There are currently no events scheduled. Please check back later
              or contact the organizer for more information.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* <div className="mt-8 text-center">
        <Button asChild>
          <Link href="/">
            <Calendar className="h-4 w-4" />
            View My Calendar
          </Link>
        </Button>
      </div> */}
    </div>
  );
}
