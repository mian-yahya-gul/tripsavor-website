export type Testimonial = {
  name: string;
  location: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ayesha K.",
    location: "Karachi",
    quote:
      "Booked our whole family's tickets to Jeddah in minutes. The agent on WhatsApp helped me pick the cheapest connection and even reminded me about baggage limits.",
    rating: 5,
  },
  {
    name: "Bilal S.",
    location: "Lahore",
    quote:
      "I compared three other sites before landing on TripSavor — same flight, better fare, and I could pay cash on delivery which made my parents a lot more comfortable.",
    rating: 5,
  },
  {
    name: "Fatima R.",
    location: "Islamabad",
    quote:
      "My flight got rescheduled by the airline and TripSavor support sorted the new itinerary out for me the same day. Genuinely helpful team.",
    rating: 4,
  },
];
