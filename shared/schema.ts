import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const preBookings = pgTable("pre_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  movieTitle: text("movie_title").notNull(),
  moviePoster: text("movie_poster").notNull(),
  ticketCount: integer("ticket_count").notNull(),
  selectedTheaters: jsonb("selected_theaters").notNull(), // array of theater names
  seatPreference: text("seat_preference").notNull(), // "adjacent" or "split"
  seatRowPreference: text("seat_row_preference").notNull(), // "front", "middle", "back", "any"
  timeRange: text("time_range").notNull(),
  selectedDates: jsonb("selected_dates").notNull(), // array of date strings
  upiId: text("upi_id").notNull(),
  userLocation: jsonb("user_location"), // {latitude, longitude, city} or null if permission denied
  status: text("status").notNull().default("pending"), // pending, searching, match_found, confirmed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  matchDetails: jsonb("match_details"), // seat details, theater, time when match found
});

export const movieBookings = pgTable("movie_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  movieTitle: text("movie_title").notNull(),
  isBookingOpen: boolean("is_booking_open").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPreBookingSchema = createInsertSchema(preBookings).omit({
  id: true,
  createdAt: true,
  status: true,
  matchDetails: true,
});

export const insertMovieBookingSchema = createInsertSchema(movieBookings).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPreBooking = z.infer<typeof insertPreBookingSchema>;
export type PreBooking = typeof preBookings.$inferSelect;
export type InsertMovieBooking = z.infer<typeof insertMovieBookingSchema>;
export type MovieBooking = typeof movieBookings.$inferSelect;
