import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import UmrahCalculator from "@/components/UmrahCalculator";

export const metadata: Metadata = {
  title: "Umrah Package Calculator — TripSavor",
  description:
    "Estimate your full Umrah package cost — visa, group flights, hotel accommodation, and private transport — all converted to PKR.",
};

export default function UmrahCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="TripSavor"
        title="Umrah Package Calculator"
        description="Build your own Umrah package and see a live cost estimate — visa, flights, hotels, and transport, all in one place."
      />
      <UmrahCalculator />
    </>
  );
}
