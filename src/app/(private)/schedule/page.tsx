import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import ScheduleForm from "@/components/forms/ScheduleForm";

export const metadata = {
  title: "Schedule",
};

export default async function SchedulePage() {
  const { userId: clerkUserId, redirectToSignIn } = await auth();

  if (!clerkUserId) return redirectToSignIn();

  const schedule = await db.query.schedules.findFirst({
    columns: {
      timezone: true,
    },
    where: ({ userId }, { eq }) => eq(userId, clerkUserId),
    with: {
      availabilities: {
        columns: { startTime: true, endTime: true, dayOfWeek: true },
      },
    },
  });

  return (
    <div className="container max-w-lg">
      <h1 className="text-3xl xl:text-4xl font-semibold text-foreground my-5">
        Schedule
      </h1>
      <ScheduleForm schedule={schedule} />
    </div>
    
  );
}
