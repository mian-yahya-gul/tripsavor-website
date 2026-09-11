import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us — TripSavor",
  description: "Get in touch with the TripSavor support team by phone, WhatsApp, email, or our contact form.",
};

const infoCards = [
  { icon: Phone, title: "Call Us", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: siteConfig.whatsapp,
    href: `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`,
  },
  { icon: Mail, title: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Clock, title: "Support Hours", value: siteConfig.hours, href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="We're here to help"
        description="Reach our support team by phone, WhatsApp, or the form below — most queries are answered within the hour."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {infoCards.map(({ icon: Icon, title, value, href }) => {
            const content = (
              <div className="flex h-full flex-col items-center gap-2 rounded-2xl border border-slate-200 p-5 text-center transition hover:border-brand-300 hover:bg-brand-50/50">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Icon size={18} />
                </span>
                <p className="text-sm font-semibold text-brand-950">{title}</p>
                <p className="text-xs text-slate-500">{value}</p>
              </div>
            );
            return href ? (
              <a key={title} href={href}>
                {content}
              </a>
            ) : (
              <div key={title}>{content}</div>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="mb-4 font-heading text-xl font-bold text-brand-950">Send us a message</h2>
            <ContactForm />
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-4 font-heading text-xl font-bold text-brand-950">Our Office</h2>
            <div className="flex h-56 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <div className="text-center">
                <MapPin size={28} className="mx-auto" />
                <p className="mt-2 text-sm font-semibold">Islamabad, Pakistan</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 p-5 text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-600" />
                {siteConfig.address}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-brand-600" />
                {siteConfig.hours}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
