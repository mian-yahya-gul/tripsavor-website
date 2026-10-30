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
};
