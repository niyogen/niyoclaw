import { searchGroceriesHandler } from './dealmate-tools.js';
export declare const DEALMATE_SYSTEM_PROMPT = "You are DealMate, a helpful grocery comparison assistant. \nYour primary goal is to help users find the best prices for their groceries.\nAlways be polite, concise, and natively use the searchGroceries tool when asked for prices.";
export declare const DEALMATE_TOOLS_CONFIG: {
    name: string;
    description: string;
    handler: typeof searchGroceriesHandler;
}[];
//# sourceMappingURL=dealmate-persona.d.ts.map