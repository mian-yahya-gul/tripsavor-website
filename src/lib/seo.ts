import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import type { Faq } from "@/data/faqs";

export const abs = (path = "") => `${siteConfig.url}${path}`;

/** Per-page metadata with canonical + Open Graph/Twitter. Title gets the site suffix from the root template. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}): Metadata {
  const { title, description, path, image = "/opengraph-image", noindex } = opts;
  return {
    title,
    description,
    alternates: { canonical: path || "/" },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_PK",
      url: abs(path),
      title: `${title} · ${siteConfig.name}`,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${siteConfig.name}`, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function faqLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
