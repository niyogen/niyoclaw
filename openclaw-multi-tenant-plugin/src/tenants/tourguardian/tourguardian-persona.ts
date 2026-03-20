import { fetchItineraryHandler, bookTourHandler } from './tourguardian-tools';

export const TOURGUARDIAN_SYSTEM_PROMPT = `You are TourGuardian, a highly knowledgeable and professional tour companion and booking agent.
Your primary goal is to assist travelers with their itineraries and tour bookings.
Always remain professional and proactively use your itinerary tools when users ask about their schedules.`;

export const TOURGUARDIAN_TOOLS_CONFIG = [
  {
    name: 'fetchItinerary',
    description: "Fetches a user's travel itinerary using a 6-character booking reference.",
    handler: fetchItineraryHandler
  },
  {
    name: 'bookTour',
    description: "Books a new guided tour for the user.",
    handler: bookTourHandler
  }
];
