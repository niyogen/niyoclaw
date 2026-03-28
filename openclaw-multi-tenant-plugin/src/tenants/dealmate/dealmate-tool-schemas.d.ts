/**
 * Zod schemas defining the strict data structures the OpenClaw AI is permitted
 * to output when calling the DealMate specific tools (e.g., grocery search).
 */
import { z } from 'zod';
export declare const SearchGroceriesSchema: z.ZodObject<{
    query: z.ZodString;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    storePreference: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    query: string;
    maxPrice?: number | undefined;
    storePreference?: string[] | undefined;
}, {
    query: string;
    maxPrice?: number | undefined;
    storePreference?: string[] | undefined;
}>;
export type SearchGroceriesInput = z.infer<typeof SearchGroceriesSchema>;
//# sourceMappingURL=dealmate-tool-schemas.d.ts.map