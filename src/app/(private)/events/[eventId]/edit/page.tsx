import EventForm from "@/components/forms/EventForm";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ eventId: string }>;
};

export const metadata = {
  title: "Edit Event",
};

export default async function EditEventPage({ params }: Props) {
  const [{ eventId }, { userId: clerkUserId, redirectToSignIn }] =
    await Promise.all([params, auth()]);

  if (!clerkUserId) return redirectToSignIn();

  const event = await db.query.events.findFirst({
    columns: {
      id: true,
      name: true,
      isActive: true,
      durationInMinutes: true,
      description: true,
    },
    where: ({ id, userId }, { and, eq }) =>
      and(eq(id, eventId), eq(userId, clerkUserId)),
  });

  if (!event) notFound();

  return (
    <div className="container max-w-lg">
      <h1 className="text-3xl xl:text-4xl font-semibold text-foreground my-5">
        Edit Event
      </h1>
      <EventForm
        event={{ ...event, description: event?.description || undefined }}
      />
    </div>
  );
}
