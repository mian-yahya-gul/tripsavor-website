"use client";

import { useCallback, useEffect, useState } from "react";

type FileInfo = { id: number; original_name: string; content_type: string; size_bytes: number };
type Enquiry = {
  id: number;
  public_ref: string;
  type: string;
  status: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  details_json: string | null;
  created_at: string;
  files: FileInfo[];
};

const STATUSES = ["new", "in_progress", "quoted", "won", "lost", "spam"];

export default function AdminEnquiries() {
  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch(`/api/admin/enquiries${filter ? `?status=${filter}` : ""}`, { cache: "no-store" });
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      setError("You are not authorised to view this page.");
      setRows([]);
      return;
    }
    if (!res.ok) {
      setError("Could not load enquiries.");
      setRows([]);
      return;
    }
    const data: { enquiries: Enquiry[] } = await res.json();
    setRows(data.enquiries);
  }, [filter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot data load on mount / filter change
    void load();
  }, [load]);

  async function setStatus(id: number, status: string) {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) void load();
    else setError("Could not update the status.");
  }

  async function openFile(id: number) {
    const res = await fetch(`/api/admin/files/${id}/link`, { method: "POST" });
    if (!res.ok) return setError("Could not create a download link.");
    const data: { url: string } = await res.json();
    window.location.assign(data.url); // short-lived signed link, served as an attachment
  }

  if (rows === null) return <p className="mt-6 text-sm text-slate-500">Loading…</p>;

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3 text-sm">
        <label className="font-semibold text-slate-600" htmlFor="status-filter">
          Status
        </label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="space-y-3">
        {rows.map((e) => (
          <div key={e.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-heading font-bold text-brand-950">{e.public_ref}</span>
                <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">{e.type}</span>
                <span className="ml-2 text-xs text-slate-400">{e.created_at.slice(0, 16).replace("T", " ")} UTC</span>
              </div>
              <select
                aria-label={`Status for ${e.public_ref}`}
                value={e.status}
                onChange={(ev) => setStatus(e.id, ev.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-1.5"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 font-semibold text-slate-800">
              {e.name} · {e.email}
              {e.phone ? ` · ${e.phone}` : ""}
            </p>
            {e.message && <p className="mt-1 whitespace-pre-wrap text-slate-600">{e.message}</p>}
            {e.details_json && <p className="mt-1 break-words text-xs text-slate-500">{e.details_json}</p>}
            {e.files.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {e.files.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => openFile(f.id)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    {f.original_name} ({Math.round(f.size_bytes / 1024)} KB)
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {rows.length === 0 && !error && <p className="text-slate-500">No enquiries yet.</p>}
      </div>
    </div>
  );
}
