import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { allRoutes } from "@/data/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/flights",
    "/explore",
    "/group-tickets",
    "/umrah-calculator",
    "/about",
    "/contact",
    "/faqs",
    "/terms",
    "/privacy",
  ];
  const now = new Date();
  return [
    ...pages.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: (path === "" ? "daily" : "weekly") as "daily" | "weekly",
      priority: path === "" ? 1 : path === "/flights" ? 0.9 : 0.7,
    })),
    ...allRoutes().map((r) => ({
      url: `${siteConfig.url}/flights/${r.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
