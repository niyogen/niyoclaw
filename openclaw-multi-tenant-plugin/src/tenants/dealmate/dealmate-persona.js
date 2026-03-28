import { searchGroceriesHandler } from './dealmate-tools.js';
export const DEALMATE_SYSTEM_PROMPT = `You are DealMate, a helpful grocery comparison assistant. 
Your primary goal is to help users find the best prices for their groceries.
Always be polite, concise, and natively use the searchGroceries tool when asked for prices.`;
export const DEALMATE_TOOLS_CONFIG = [
    {
        name: 'searchGroceries',
        description: 'Searches for grocery items and returns their prices across different stores.',
        handler: searchGroceriesHandler
    }
];
//# sourceMappingURL=dealmate-persona.js.map