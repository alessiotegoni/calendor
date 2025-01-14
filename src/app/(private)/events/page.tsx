import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, Calendar, ArrowRight } from "lucide-react";
import LinkButton from "@/components/LinkButton";
import EventCard from "../../../components/EventCard";

export const metadata = {
  title: "Your Events",
};

export default async function EventsPage() {
  const { userId: clerkUserId, redirectToSignIn } = await auth();

  if (!clerkUserId) return redirectToSignIn();

  const results = await db.query.events.findMany({
    where: ({ userId }, { eq }) => eq(userId, clerkUserId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  return (
    <div className="container">
      <div className="flex-between mb-8">
        <h1 className="text-3xl xl:text-5xl font-semibold text-foreground">
          Events
        </h1>
        <LinkButton href="/events/new">
          <CalendarPlus />
          New Event
        </LinkButton>
      </div>
      {!results.length ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="size-48 rounded-full bg-primary/10 flex-center animate-pulse">
            <Calendar className="size-28 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-center mt-6">
            No Events Yet
          </h2>
          <p className="text-muted-foreground text-center max-w-md mt-1 mb-4">
            It looks like you haven&apos;t created any events yet. Start organizing
            your schedule by creating your first event!
          </p>
          <LinkButton href="/events/new" size="lg" className="mt-4">
            Create Your First Event
            <ArrowRight />
          </LinkButton>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((event) => (
            <EventCard key={event.id} event={event} isPublic={false} />
          ))}
        </div>
      )}
    </div>
  );
}
