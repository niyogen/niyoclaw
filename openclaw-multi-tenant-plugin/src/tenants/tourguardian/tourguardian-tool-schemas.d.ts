/**
 * Zod schemas defining the strict data structures the OpenClaw AI is permitted
 * to output when calling the TourGuardian specific tools (e.g., itinerary fetch).
 */
import { z } from 'zod';
export declare const FetchItinerarySchema: z.ZodObject<{
    bookingReference: z.ZodString;
    userEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bookingReference: string;
    userEmail?: string | undefined;
}, {
    bookingReference: string;
    userEmail?: string | undefined;
}>;
export type FetchItineraryInput = z.infer<typeof FetchItinerarySchema>;
export declare const BookTourSchema: z.ZodObject<{
    destination: z.ZodString;
    dates: z.ZodObject<{
        start: z.ZodString;
        end: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        start: string;
        end: string;
    }, {
        start: string;
        end: string;
    }>;
    numberOfPeople: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    destination: string;
    dates: {
        start: string;
        end: string;
    };
    numberOfPeople: number;
}, {
    destination: string;
    dates: {
        start: string;
        end: string;
    };
    numberOfPeople: number;
}>;
export type BookTourInput = z.infer<typeof BookTourSchema>;
//# sourceMappingURL=tourguardian-tool-schemas.d.ts.map