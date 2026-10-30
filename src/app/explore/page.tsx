import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import ExploreGrid from "@/components/ExploreGrid";

export const metadata = pageMetadata({
  title: "Explore Destinations by Budget from Pakistan",
  description:
    "Set your departure city, month and budget and see every destination TripSavor covers ranked by estimated fare, from Dubai and Jeddah to London and Bangkok.",
  path: "/explore",
});

export default function ExplorePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Explore", path: "/explore" }])} />
      <PageHero
        image="/heroes/explore.jpg"
        eyebrow="Explore"
        title="Where can your budget take you?"
        description="Pick a starting city, a month, and a budget — we'll rank every destination we cover by estimated fare."
      />
      <ExploreGrid />
    </>
  );
}
