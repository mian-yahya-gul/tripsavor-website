import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/explore",
    "/group-tickets",
    "/umrah-calculator",
    "/manage-booking",
    "/about",
    "/contact",
    "/faqs",
    "/login",
    "/terms",
    "/privacy",
  ];
  const now = new Date();
  return routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
