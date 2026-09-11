import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — TripSavor",
  description: "The terms and conditions governing use of the TripSavor website and booking service.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="August 2026"
      sections={[
        {
          heading: "1. Agreement to Terms",
          body: [
            "By accessing or using the TripSavor website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.",
          ],
        },
        {
          heading: "2. Our Role as a Booking Agent",
          body: [
            "TripSavor acts as a travel agent facilitating flight bookings on behalf of travelers with third-party airlines. The airline operating your flight is responsible for the carriage of passengers and baggage, and their own conditions of carriage apply in addition to these terms.",
          ],
        },
        {
          heading: "3. Fares & Payment",
          body: [
            "Fares displayed are indicative and subject to change until a booking is confirmed and paid for in full. A booking is only guaranteed once payment has been received and an e-ticket has been issued.",
            "We accept payment by debit/credit card, bank transfer, and cash-on-delivery through our rider network in select cities.",
          ],
        },
        {
          heading: "4. Cancellations, Changes & Refunds",
          body: [
            "Cancellation and date-change fees are set by the operating airline's fare rules, not by TripSavor. Where a refund is approved by the airline, TripSavor will process it back to your original payment method within the timeframe stated on our FAQs page.",
          ],
        },
        {
          heading: "5. Passenger Responsibilities",
          body: [
            "Travelers are responsible for ensuring that names, travel documents, and visa requirements meet the entry requirements of their destination. Airlines generally do not permit name corrections after a ticket has been issued.",
          ],
        },
        {
          heading: "6. Limitation of Liability",
          body: [
            "TripSavor is not liable for flight delays, cancellations, schedule changes, or losses caused by the operating airline, weather, or other events outside our reasonable control.",
          ],
        },
        {
          heading: "7. Changes to These Terms",
          body: [
            "We may update these Terms & Conditions from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.",
          ],
        },
        {
          heading: "8. Contact",
          body: [
            "Questions about these terms can be directed to our support team via the Contact Us page.",
          ],
        },
      ]}
    />
  );
}
