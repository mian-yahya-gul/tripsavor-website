import AdminEnquiries from "@/components/AdminEnquiries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Admin",
  description: "TripSavor staff area.",
  path: "/admin",
  noindex: true,
});

// Static shell only — it contains no data. The data comes from /api/admin/*, which verifies the
// Cloudflare Access JWT and the staff allow-list on every request.
export default function AdminPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-extrabold text-brand-950">Enquiries</h1>
      <AdminEnquiries />
    </section>
  );
}
