import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} Travels: ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: "Cheap flights from Pakistan with 24/7 human support, group tickets and Umrah planning.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#082f4e",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
