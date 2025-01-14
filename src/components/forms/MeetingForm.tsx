"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TimezoneFormField from "@/components/TimezoneFormField";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { meetingFormSchema, MeetingFormSchemaType } from "@/schema/meetings";
import Loader from "../Loader";
import { toZonedTime } from "date-fns-tz";
import { formatTimeString } from "@/lib/formatters";
import { createMeeting } from "@/actions/meetings";

type BookingFormProps = {
  validTimes: Date[];
  eventId: string;
  clerkUserId: string;
};

export default function MeetingForm({
  validTimes,
  eventId,
  clerkUserId,
}: BookingFormProps) {
  const [successMsg, setSuccessMsg] = useState("");
  const [isBooking, startBookingTransition] = useTransition();

  const form = useForm<MeetingFormSchemaType>({
    mode: "all",
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      guestName: "",
      guestEmail: "",
      guestNotes: "",
    },
  });

  const timezone = form.watch("timezone");
  const date = form.watch("date");

  const validTimesInTimezone = useMemo(() => {
    return validTimes.map((date) => toZonedTime(date, timezone));
  }, [validTimes, timezone]);

  const isPending = form.formState.isSubmitting || isBooking;

  function onSubmit(data: MeetingFormSchemaType) {
    if (isPending) return;

    startBookingTransition(async () => {
      const result = await createMeeting({ ...data, eventId, clerkUserId });

      if (result?.error) {
        form.setError("root", {
          message: "There was an error creating meeting",
        });
      } else setSuccessMsg("Meeting created!");
      console.log(result);
    });
  }

  return (
    <>
      {form.formState.errors.root && (
        <div className="mb-4 p-3 bg-destructive/15 border border-destructive/30 text-destructive text-sm rounded-md">
          {form.formState.errors.root?.message}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-300 dark:bg-green-800 border border-green-500 dark:border-green-400 text-green-800 dark:text-green-300 text-sm rounded-md">
          {successMsg}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TimezoneFormField />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        !validTimesInTimezone.some((time) =>
                          isSameDay(date, time)
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Select an available date</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(new Date(Date.parse(value)))
                  }
                  value={field.value?.toISOString()}
                  disabled={!date}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={date && "Select a time"} />
                      {!date && (
                        <p className="grow text-left">Select a date first</p>
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {validTimesInTimezone
                      .filter((time) => isSameDay(time, date))
                      .map((time) => (
                        <SelectItem
                          key={time.toISOString()}
                          value={time.toISOString()}
                        >
                          {formatTimeString(time)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription
                  aria-disabled={!date}
                  className="aria-disabled:text-muted-foreground/30 aria-disabled:cursor-not-allowed"
                >
                  Choose an available time slot
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any additional notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !!successMsg}
            >
              {isPending ? <Loader label="Booking" /> : "Book Event"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
