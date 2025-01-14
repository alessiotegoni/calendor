"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, insertEventType } from "@/schema/events";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createEvent, deleteEvent, editEvent } from "@/actions/events";
import { useTransition } from "react";
import Loader from "../Loader";

type Props = {
  event?: insertEventType & { id: string };
};

export default function EventForm({ event }: Props) {
  const [isDeleting, startDeleteTransition] = useTransition();

  const form = useForm<insertEventType>({
    mode: "all",
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ?? {
      name: "",
      durationInMinutes: 30,
      isActive: true,
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: insertEventType) {
    if (isSubmitting) return;

    const action = event ? editEvent.bind(null, data, event.id) : createEvent;
    const { error } = await action(data);

    if (error)
      form.setError("root", {
        message: `There was an error ${
          event ? "updating" : "saving"
        } your event`,
      });
  }

  return (
    <>
      {form.formState.errors.root && (
        <div
          className="mb-4 p-3 bg-destructive/15 border border-destructive/30
        text-destructive text-sm rounded-md"
        >
          {form.formState.errors.root?.message}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event name" {...field} />
                </FormControl>
                <FormDescription>
                  Give your event a clear and descriptive name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your event (optional)"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide additional details about your event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationInMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormDescription>
                  Set the duration of your event in minutes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Event</FormLabel>
                  <FormDescription>
                    This event will be visible and bookable if active.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            {event && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isSubmitting || isDeleting}
                  >
                    {isDeleting ? <Loader label="Deleting" /> : "Delete"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive"
                      disabled={isSubmitting || isDeleting}
                      onClick={() => {
                        startDeleteTransition(async () => {
                          const { error } = await deleteEvent(event.id);
                          if (error) {
                            form.setError("root", {
                              message: "There was an error deleting you event",
                            });
                          }
                        });
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isDeleting || !form.formState.isValid}
            >
              {isSubmitting ? (
                <Loader label={event ? "Editing" : "Creating"} />
              ) : (
                `${event ? "Edit" : "Create"} Event`
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
