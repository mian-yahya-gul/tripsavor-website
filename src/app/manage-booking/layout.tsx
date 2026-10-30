import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Manage Your Booking",
  description: "Retrieve and manage your TripSavor itinerary with your booking reference.",
  path: "/manage-booking",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
