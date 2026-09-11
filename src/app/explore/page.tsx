import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ExploreGrid from "@/components/ExploreGrid";

export const metadata: Metadata = {
  title: "Explore Destinations — TripSavor",
  description:
    "Set a starting city and a budget, and see every destination TripSavor covers ranked by estimated fare.",
};

export default function ExplorePage() {
  return (
    <>
      <PageHero
        eyebrow="Explore"
        title="Where can your budget take you?"
        description="Pick a starting city, a month, and a budget — we'll rank every destination we cover by estimated fare."
      />
      <ExploreGrid />
    </>
  );
}
