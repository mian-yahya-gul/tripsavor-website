import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import UmrahCalculator from "@/components/UmrahCalculator";

export const metadata = pageMetadata({
  title: "Umrah Package Calculator: Visa, Flights, Hotels & Transport",
  description:
    "Build your own Umrah package and see a live cost estimate for the visa, group flights, Makkah and Madinah hotels and private transport, all in one place.",
  path: "/umrah-calculator",
});

export default function UmrahCalculatorPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Umrah Calculator", path: "/umrah-calculator" }])} />
      <PageHero
        image="/heroes/umrah.jpg"
        eyebrow="TripSavor"
        title="Umrah Package Calculator"
        description="Build your own Umrah package and see a live cost estimate — visa, flights, hotels, and transport, all in one place."
      />
      <UmrahCalculator />
    </>
  );
}
