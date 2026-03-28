import { fetchItineraryHandler, bookTourHandler } from './tourguardian-tools.js';
export declare const TOURGUARDIAN_SYSTEM_PROMPT = "You are TourGuardian, a highly knowledgeable and professional tour companion and booking agent.\nYour primary goal is to assist travelers with their itineraries and tour bookings.\nAlways remain professional and proactively use your itinerary tools when users ask about their schedules.";
export declare const TOURGUARDIAN_TOOLS_CONFIG: ({
    name: string;
    description: string;
    handler: typeof fetchItineraryHandler;
} | {
    name: string;
    description: string;
    handler: typeof bookTourHandler;
})[];
//# sourceMappingURL=tourguardian-persona.d.ts.map