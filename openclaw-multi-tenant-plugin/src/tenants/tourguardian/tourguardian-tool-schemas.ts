/**
 * Zod schemas defining the strict data structures the OpenClaw AI is permitted
 * to output when calling the TourGuardian specific tools (e.g., itinerary fetch).
 */
import { z } from 'zod';

export const FetchItinerarySchema = z.object({
  bookingReference: z.string().describe("The 6-character alphanumeric booking code"),
  userEmail: z.string().email().optional().describe("The email address of the traveler if provided"),
});

export type FetchItineraryInput = z.infer<typeof FetchItinerarySchema>;

export const BookTourSchema = z.object({
  destination: z.string().describe("The city or landmark the user wants to visit"),
  dates: z.object({
    start: z.string().describe("ISO 8601 start date of the tour"),
    end: z.string().describe("ISO 8601 end date of the tour")
  }),
  numberOfPeople: z.number().int().min(1).describe("Number of tickets to book")
});

export type BookTourInput = z.infer<typeof BookTourSchema>;
