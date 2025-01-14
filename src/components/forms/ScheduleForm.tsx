"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleFormSchema, ScheduleFormSchemaType } from "@/schema/schedule";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState, useTransition } from "react";
import { timeToInt } from "@/lib/utils";
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { Plus, Trash2 } from "lucide-react";
import { saveSchedule } from "@/actions/schedule";
import TimezoneFormField from "../TimezoneFormField";
import Loader from "../Loader";

type Availability = {
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number];
  startTime: string;
  endTime: string;
};

type Props = {
  schedule?: {
    timezone: string;
    availabilities: Availability[];
  };
};

export default function ScheduleForm({ schedule }: Props) {
  const [successMsg, setSuccessMsg] = useState("");

  const [isSaving, startSavingTransition] = useTransition();

  const form = useForm<ScheduleFormSchemaType>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timezone:
        schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.availabilities.toSorted(
        (a, b) => timeToInt(a.startTime) - timeToInt(b.startTime)
      ),
    },
  });
  const isPending = form.formState.isSubmitting || isSaving;

  async function onSubmit(data: ScheduleFormSchemaType) {
    if (isPending) return;

    startSavingTransition(async () => {
      const result = await saveSchedule(data);

      if (result?.error)
        form.setError("root", { message: "Error saving your schedule" });
      else setSuccessMsg("Schedule saved");
    });

    console.log(data);
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "availabilities",
  });

  const groupedAvailabilityFields = Object.groupBy(
    fields.map((field, index) => ({ ...field, index })),
    (availability) => availability.dayOfWeek
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (successMsg) timeoutId = setTimeout(() => setSuccessMsg(""), 5_000);

    return () => clearTimeout(timeoutId);
  }, [successMsg]);

  console.log(form.formState.errors.availabilities);

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
      {successMsg && (
        <div
          className="mb-4 p-3 bg-green-300 dark:bg-green-800 border
        border-green-500 dark:border-green-400 text-green-800 dark:text-green-300 text-sm rounded-md"
        >
          {successMsg}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TimezoneFormField />
          <div className="space-y-6">
            {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek) => (
              <div key={dayOfWeek} className="space-y-2">
                <div className="flex-between">
                  <h2 className="capitalize font-semibold">{dayOfWeek}</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ startTime: "9:00", endTime: "10:00", dayOfWeek })
                    }
                  >
                    <Plus className="w-4 h-4" />
                    Add Time Slot
                  </Button>
                </div>
                {groupedAvailabilityFields[dayOfWeek]?.length ? (
                  <div className="space-y-2">
                    {groupedAvailabilityFields[dayOfWeek].map(
                      ({ id, index }) => (
                        <Fragment key={id}>
                          <div className="flex items-center gap-2">
                            <FormField
                              control={form.control}
                              name={`availabilities.${index}.startTime`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder="Start time"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <p>-</p>
                            <FormField
                              control={form.control}
                              name={`availabilities.${index}.endTime`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input placeholder="End time" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <FormMessage>
                            {
                              form.formState.errors.availabilities?.at?.(index)
                                ?.root?.message
                            }
                          </FormMessage>
                          <FormMessage>
                            {
                              form.formState.errors.availabilities?.at?.(index)
                                ?.startTime?.message
                            }
                          </FormMessage>
                          <FormMessage>
                            {
                              form.formState.errors.availabilities?.at?.(index)
                                ?.endTime?.message
                            }
                          </FormMessage>
                        </Fragment>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No time slots added
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid || !!successMsg}
            >
              {isPending ? (
                <Loader label={schedule ? "Updating" : "Creating"} />
              ) : schedule ? (
                "Update"
              ) : (
                "Create"
              )}{" "}
              Schedule
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
