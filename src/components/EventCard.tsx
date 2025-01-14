"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Copy, Edit, NotebookPen } from "lucide-react";
import { useState } from "react";
import LinkButton from "@/components/LinkButton";
import { events } from "@/drizzle/schema";
import { formatEventDuration } from "@/lib/formatters";

export default function EventCard({
  event,
  isPublic = true,
}: {
  event: typeof events.$inferSelect;
  isPublic?: boolean;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleSetCopy = () => {
    setIsCopied(true);
    try {
      setTimeout(() => setIsCopied(false), 5_000);
      navigator.clipboard.writeText(
        `${location.origin}/book/${event.userId}/${event.id}`
      );
    } catch (err) {
      console.error(err);
      setIsCopied(false);
    }
  };

  return (
    <Card className="bg-card text-card-foreground hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
        <CardDescription>
          {formatEventDuration(event.durationInMinutes)} •{" "}
          {event.isActive ? "Active" : "Inactive"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground line-clamp-2">
          {event.description || "No description provided"}
        </p>
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>Created: {event.createdAt.toLocaleDateString()}</span>
          <span>Updated: {event.updatedAt.toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 p-4 pt-1">
        {isCopied ? (
          <Button variant="outline" className="bg-green-500 hover:bg-green-500">
            <ClipboardCheck className="size-4" />
            Copied
          </Button>
        ) : (
          <Button variant="outline" onClick={handleSetCopy}>
            <Copy className="size-4" />
            Copy Link
          </Button>
        )}
        {isPublic ? (
          <LinkButton href={`/book/${event.userId}/${event.id}`}>
            <NotebookPen className="size-4" />
            Book
          </LinkButton>
        ) : (
          <LinkButton href={`/events/${event.id}/edit`}>
            <Edit className="size-4" />
            Edit
          </LinkButton>
        )}
      </CardFooter>
    </Card>
  );
}
