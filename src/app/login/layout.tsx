import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sign Up / Log In",
  description: "Sign in to save traveller details and manage your TripSavor bookings.",
  path: "/login",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
