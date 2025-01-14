ALTER TABLE "scheduleAvailabilty" RENAME TO "scheduleAvailabilties";--> statement-breakpoint
ALTER TABLE "scheduleAvailabilties" DROP CONSTRAINT "scheduleAvailabilty_scheduleId_schedules_id_fk";
--> statement-breakpoint
ALTER TABLE "scheduleAvailabilties" ADD CONSTRAINT "scheduleAvailabilties_scheduleId_schedules_id_fk" FOREIGN KEY ("scheduleId") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;