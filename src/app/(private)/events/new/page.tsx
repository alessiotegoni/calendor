import EventForm from "@/components/forms/EventForm";

export const metadata = {
  title: "New Event",
};

export default function NewEventPage() {
  return (
    <div className="container max-w-lg">
      <h1 className="text-3xl xl:text-4xl font-semibold text-foreground my-5">
        New Event
      </h1>
      <EventForm />
    </div>
  );
}
