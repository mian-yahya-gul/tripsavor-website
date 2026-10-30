import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";
import SearchLoading from "./loading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Flight Search Results",
  description: "Compare flight fares on TripSavor.",
  path: "/search",
  noindex: true,
});

// Static shell: the search itself runs in the browser (see SearchResults).
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
}
