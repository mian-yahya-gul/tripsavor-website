import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportLauncher from "@/components/SupportLauncher";
import ThemeScript from "@/components/ThemeScript";
import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "TripSavor — Book Smarter. Fly Further.",
    template: "%s · TripSavor",
  },
  description:
    "TripSavor helps you find and book the cheapest flights from Pakistan to destinations worldwide, with 24/7 human support and flexible payment options.",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: "TripSavor — Book Smarter. Fly Further.",
    description:
      "Compare fares across leading airlines and book flights from Pakistan with real human support.",
  },
  twitter: { card: "summary_large_image" },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteConfig.name,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address,
    addressCountry: "PK",
  },
  sameAs: Object.values(siteConfig.social),
};

const siteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?from={from}&to={to}`,
    "query-input": "required name=from",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <SupportLauncher />
        <JsonLd data={orgLd} />
        <JsonLd data={siteLd} />
      </body>
    </html>
  );
}
