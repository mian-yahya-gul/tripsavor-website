import type { Metadata, Viewport } from "next";
import { Inter, Noto_Nastaliq_Urdu, Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportLauncher from "@/components/SupportLauncher";
import CookieBanner from "@/components/CookieBanner";
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

const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  display: "swap",
  // ~240 KB: only fetch it when a visitor actually switches to Urdu.
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#082f4e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  keywords: [
    "cheap flights from Pakistan",
    "flight booking Pakistan",
    "Karachi to Dubai flights",
    "Lahore to Dubai flights",
    "Islamabad flights",
    "Umrah packages",
    "group flight tickets",
    "travel agency Islamabad",
  ],
  category: "travel",
  formatDetection: { telephone: true, email: true, address: true },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  other: { "geo.region": "PK", "geo.placename": "Islamabad", "content-language": "en-PK" },
  title: {
    default: "TripSavor — Book Smarter. Fly Further.",
    template: "%s · TripSavor",
  },
  description:
    "TripSavor helps you find and book the cheapest flights from Pakistan to destinations worldwide, with 24/7 human support and flexible payment options.",
  openGraph: {
    type: "website",
    locale: "en_PK",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: "TripSavor — Book Smarter. Fly Further.",
    description:
      "Compare fares across leading airlines and book flights from Pakistan with real human support.",
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteConfig.name,
  url: siteConfig.url,
  "@id": `${siteConfig.url}/#organization`,
  logo: `${siteConfig.url}/tripsavor-logo.png`,
  image: `${siteConfig.url}/opengraph-image`,
  description:
    "Pakistan-based flight booking agency offering cheap international flights, group tickets and Umrah packages with 24/7 human support.",
  priceRange: "$$",
  areaServed: { "@type": "Country", name: "Pakistan" },
  knowsLanguage: ["en", "ur"],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    availableLanguage: ["English", "Urdu"],
    areaServed: "PK",
  },
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
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: ["en-PK", "ur-PK"],
  publisher: { "@id": `${siteConfig.url}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?from={from}&to={to}`,
    "query-input": "required name=from",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${nastaliq.variable} h-full antialiased`}
    >
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
        <CookieBanner />
        <JsonLd data={orgLd} />
        <JsonLd data={siteLd} />
      </body>
    </html>
  );
}
