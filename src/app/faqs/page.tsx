import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";
import CtaBanner from "@/components/CtaBanner";
import { faqs } from "@/data/faqs";

export const metadata = pageMetadata({
  title: "Flight Booking FAQs: Payments, Refunds, Changes & Support",
  description:
    "Clear answers about booking flights from Pakistan with TripSavor: payment methods, cancellations, refunds, hidden fees, e-tickets and customer support.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <JsonLd data={breadcrumbLd([{ name: "FAQs", path: "/faqs" }])} />
      <PageHero
        image="/heroes/faqs.jpg"
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
