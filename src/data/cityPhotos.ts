import { destinations } from "@/data/destinations";

/** Airport code → photo under /public/destinations (Unsplash, free license). */
export const CITY_PHOTOS: Record<string, string> = {
  ...Object.fromEntries(destinations.map((d) => [d.code, d.image])),
  AUH: "/destinations/abu-dhabi.jpg",
  MED: "/destinations/medina.jpg",
  MCT: "/destinations/muscat.jpg",
  BAH: "/destinations/bahrain.jpg",
  KWI: "/destinations/kuwait.jpg",
  RUH: "/destinations/riyadh.jpg",
  KHI: "/destinations/karachi.jpg",
  LHE: "/destinations/lahore.jpg",
  ISB: "/destinations/islamabad.jpg",
  MUX: "/destinations/multan.jpg",
  LYP: "/destinations/faisalabad.jpg",
  UET: "/destinations/quetta.jpg",
  KDU: "/destinations/skardu.jpg",
  CDG: "/destinations/paris.jpg",
  // Other UK airports reuse the London skyline rather than showing a blank card
  LGW: "/destinations/london.jpg",
  MAN: "/destinations/london.jpg",
  BHX: "/destinations/london.jpg",
};
