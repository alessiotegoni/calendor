import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    durationInMinutes: integer("durationInMinutes").notNull(),
    userId: text("userId").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => ({ userIdIndex: index("userIdIndex").on(table.userId) })
);

export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  userId: text("userId").notNull().unique(),
  createdAt,
  updatedAt,
});

export const scheduleRelations = relations(schedules, ({ many }) => ({
  availabilities: many(scheduleAvailabilities),
}));

export const scheduleDayOfWeekEnum = pgEnum("dayOfWeek", DAYS_OF_WEEK_IN_ORDER);

export const scheduleAvailabilities = pgTable(
  "scheduleAvailabilties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
      .notNull()
      .references(() => schedules.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  (table) => ({
    scheduleIdIndex: index("scheduleIdIndex").on(table.scheduleId),
  })
);

export const scheduleAvailabilitiesRelation = relations(
  scheduleAvailabilities,
  ({ one }) => ({
    schedule: one(schedules, {
      fields: [scheduleAvailabilities.scheduleId],
      references: [schedules.id],
    }),
  })
);
