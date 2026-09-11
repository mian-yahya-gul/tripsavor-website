"use client";

import { useState } from "react";
import { Trash2, UserPlus, Users } from "lucide-react";
import {
  addTraveller,
  clearContact,
  hasContact,
  removeTraveller,
  updateTraveller,
  type Traveller,
} from "@/lib/profiles";
import { useContactProfile, useTravellers } from "@/components/useProfiles";

const inputCls =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

function TravellerForm({ onDone, initial }: { onDone: () => void; initial?: Traveller }) {
  return (
    <form
      className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-brand-50/40 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = {
          fullName: String(fd.get("fullName") ?? ""),
          dob: String(fd.get("dob") ?? ""),
          nationality: String(fd.get("nationality") ?? ""),
          passport: String(fd.get("passport") ?? ""),
          passportExpiry: String(fd.get("passportExpiry") ?? ""),
        };
        if (initial) updateTraveller(initial.id, data);
        else addTraveller(data);
        onDone();
      }}
    >
      <input
        required
        name="fullName"
        defaultValue={initial?.fullName}
        placeholder="Full name (as on passport)"
        className={`${inputCls} col-span-2`}
      />
      <label className="text-[11px] font-semibold text-slate-400">
        Date of birth
        <input name="dob" type="date" defaultValue={initial?.dob} className={`${inputCls} mt-0.5 w-full`} />
      </label>
      <input
        name="nationality"
        defaultValue={initial?.nationality}
        placeholder="Nationality"
        className={`${inputCls} self-end`}
      />
      <input
        name="passport"
        defaultValue={initial?.passport}
        placeholder="Passport no."
        className={inputCls}
      />
      <label className="text-[11px] font-semibold text-slate-400">
        Passport expiry
        <input
          name="passportExpiry"
          type="date"
          defaultValue={initial?.passportExpiry}
          className={`${inputCls} mt-0.5 w-full`}
        />
      </label>
      <div className="col-span-2 flex items-center gap-3">
        <button type="submit" className="rounded-lg bg-brand-900 px-3 py-1.5 text-xs font-bold text-white">
          Save
        </button>
        <button type="button" onClick={onDone} className="text-xs font-semibold text-slate-500">
          Cancel
        </button>
      </div>
    </form>
  );
}

function TravellerRow({ t }: { t: Traveller }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <TravellerForm initial={t} onDone={() => setEditing(false)} />;
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm">
      <div className="min-w-0">
        <p className="truncate font-semibold text-brand-950">{t.fullName || "Unnamed"}</p>
        <p className="truncate text-xs text-slate-500">
          {[t.nationality, t.dob && `DOB ${t.dob}`, t.passport && `Passport ${t.passport}`]
            .filter(Boolean)
            .join(" · ") || "No details"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => setEditing(true)}
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => removeTraveller(t.id)}
          aria-label={`Remove ${t.fullName || "traveller"}`}
          className="text-slate-400 transition hover:text-red-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </li>
  );
}

export default function AccountPanel() {
  const contact = useContactProfile();
  const travellers = useTravellers();
  const [adding, setAdding] = useState(false);

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <p className="flex items-center gap-2 font-heading text-sm font-bold text-brand-950">
        <Users size={15} />
        Saved on this device
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Stored only in this browser to speed up our forms — not an account, and nothing is sent
        anywhere until you submit a form.
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Contact details</p>
        {hasContact(contact) ? (
          <div className="flex items-start justify-between gap-3">
            <div className="text-slate-700">
              <p className="font-semibold text-brand-950">{contact.name || "—"}</p>
              <p>{contact.email || "—"}</p>
              <p>{contact.phone || "—"}</p>
            </div>
            <button
              onClick={() => clearContact()}
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              Clear
            </button>
          </div>
        ) : (
          <p className="text-slate-400">
            Nothing saved yet — tick &ldquo;save my details&rdquo; on the Contact or Group Tickets
            form.
          </p>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Traveller records ({travellers.length})
          </p>
          <button
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
          >
            <UserPlus size={13} />
            Add traveller
          </button>
        </div>

        {adding && <TravellerForm onDone={() => setAdding(false)} />}

        <ul className="space-y-2">
          {travellers.map((t) => (
            <TravellerRow key={t.id} t={t} />
          ))}
        </ul>
        {travellers.length === 0 && !adding && (
          <p className="text-sm text-slate-400">
            No traveller records yet. Add family members&apos; passport details to reuse them when
            booking.
          </p>
        )}
      </div>
    </div>
  );
}
