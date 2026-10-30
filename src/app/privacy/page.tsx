import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How TripSavor collects, uses and protects your personal information when you search and book flights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="August 2026"
      sections={[
        {
          heading: "1. Information We Collect",
          body: [
            "When you search for or book a flight, we collect information such as your name, contact details, travel dates, and payment details necessary to complete your booking with the relevant airline.",
          ],
        },
        {
          heading: "2. How We Use Your Information",
          body: [
            "We use your information to process bookings, communicate with you about your itinerary, provide customer support, and improve our website and services. We do not sell your personal information to third parties.",
          ],
        },
        {
          heading: "3. Sharing With Airlines & Payment Providers",
          body: [
            "To complete a booking, relevant passenger details are shared with the operating airline. Payment information is processed through secure, encrypted payment channels and is not stored in full on our servers.",
          ],
        },
        {
          heading: "4. Data Security",
          body: [
            "We use industry-standard encryption for checkout and restrict access to personal data to staff who need it to support your booking.",
          ],
        },
        {
          heading: "5. Your Choices",
          body: [
            "You may request access to, correction of, or deletion of your personal information by contacting our support team, subject to any records we are legally required to retain.",
          ],
        },
        {
          heading: "6. Cookies",
          body: [
            "We use essential browser storage to remember your language, currency, saved searches and cookie choice. These do not need consent. We only use analytics if you choose Accept all in the cookie banner, and you can change your choice at any time with the Cookie settings link in the footer. You can also clear storage in your browser settings, though some features may not work as intended.",
          ],
        },
        {
          heading: "7. Changes to This Policy",
          body: [
            "We may update this Privacy Policy periodically. The 'last updated' date at the top of this page reflects the most recent revision.",
          ],
        },
        {
          heading: "8. Contact",
          body: [
            "For privacy-related questions, reach out via our Contact Us page or email us directly.",
          ],
        },
      ]}
    />
  );
}
