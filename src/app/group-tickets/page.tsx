import type { Metadata } from "next";
import { CalendarClock, HeadphonesIcon, MessageCircle, PiggyBank, Users } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import GroupTicketForm from "@/components/GroupTicketForm";
import GroupTicketsExplorer from "@/components/GroupTicketsExplorer";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Group Tickets — TripSavor",
  description:
    "Book discounted group flight tickets for Umrah groups, corporate travel, weddings, and tours of 10 or more passengers.",
};

const benefits = [
  {
    icon: PiggyBank,
    title: "Discounted Group Fares",
    desc: "Special negotiated rates for bookings of 10 or more passengers on the same flight.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Payment Plans",
    desc: "Reserve seats with a deposit and pay the balance in installments before departure.",
  },
  {
    icon: Users,
    title: "Seats Held Together",
    desc: "We coordinate with the airline to seat your group together wherever possible.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Coordinator",
    desc: "One point of contact manages your booking from quote through to check-in.",
  },
];

export default function GroupTicketsPage() {
  return (
    <>
      <GroupTicketsExplorer />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 p-6 text-center transition hover:border-brand-200 hover:bg-brand-50/50">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-heading text-base font-bold text-brand-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="request-quote" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHeading
              eyebrow="Request a Quote"
              title="Tell us about your group"
              description="Fill in the details below and our Group Travel Desk will get back to you with fare options — usually within 24 hours."
            />
            <div className="mt-6">
              <GroupTicketForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-heading text-base font-bold text-brand-950">Prefer to talk it through?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Our Group Travel Desk can put together a quote over WhatsApp or a call — often faster
                than the form for complex itineraries or tight timelines.
              </p>
              <a
                href={buildWhatsAppLink("Hi! I'd like a quote for a group of 10+ passengers.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                <MessageCircle size={15} />
                WhatsApp the Group Desk
              </a>
              <div className="mt-4 space-y-2 text-sm">
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="block font-semibold text-brand-800 hover:underline">
                  Call: {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="block font-semibold text-brand-800 hover:underline">
                  Email: {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-brand-950 p-6 text-brand-100">
              <h3 className="font-heading text-base font-bold text-white">How group pricing works</h3>
              <ol className="mt-3 space-y-2 text-sm">
                <li>1. Share your route, dates, and passenger count.</li>
                <li>2. We check availability and negotiate group rates with the airline.</li>
                <li>3. You review the quote and confirm with a deposit.</li>
                <li>4. Pay the balance before departure — tickets are issued to your group.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
