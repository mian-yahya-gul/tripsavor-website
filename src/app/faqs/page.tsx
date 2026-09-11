import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";
import CtaBanner from "@/components/CtaBanner";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "FAQs — TripSavor",
  description: "Answers to common questions about booking, payments, cancellations, and support at TripSavor.",
};

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Frequently asked questions"
        description="Can't find what you're looking for? Reach out on our Contact page and we'll help directly."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <FaqAccordion items={faqs} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <CtaBanner />
      </section>
    </>
  );
}
