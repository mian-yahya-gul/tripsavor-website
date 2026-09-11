"use client";

import { useState } from "react";
import { LogIn, Mail, UserPlus } from "lucide-react";
import PageHero from "@/components/PageHero";
import AccountPanel from "@/components/AccountPanel";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <>
      <PageHero
        eyebrow="Your Account"
        title="SignUp / Login"
        description="Save your travelers' details and manage all your bookings in one place."
      />

      <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="mb-6 flex gap-1 rounded-lg bg-brand-50 p-1 text-sm font-semibold">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 rounded-md py-2 transition ${
                tab === "login" ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:text-brand-700"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 rounded-md py-2 transition ${
                tab === "signup" ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:text-brand-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            {tab === "signup" && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-slate-700">Full Name</span>
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-slate-700">Email Address</span>
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-slate-700">Password</span>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            {tab === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" />
                  Remember me
                </label>
                <a href="#" className="font-semibold text-brand-700 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-heading text-sm font-bold text-white shadow-md transition hover:bg-brand-700"
            >
              {tab === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
              {tab === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <Mail size={16} />
            Continue with Email OTP
          </button>
        </div>

        <AccountPanel />
      </section>
    </>
  );
}
