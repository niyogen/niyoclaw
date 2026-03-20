/**
 * Zod schemas defining the strict data structures the OpenClaw AI is permitted
 * to output when calling the DealMate specific tools (e.g., grocery search).
 */
import { z } from 'zod';

export const SearchGroceriesSchema = z.object({
  query: z.string().describe("The name of the grocery item to search for (e.g., 'organic milk')"),
  maxPrice: z.number().optional().describe("Maximum price the user is willing to pay"),
  storePreference: z.array(z.string()).optional().describe("Specific stores like 'Walmart' or 'Target'"),
});

export type SearchGroceriesInput = z.infer<typeof SearchGroceriesSchema>;
