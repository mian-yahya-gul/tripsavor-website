"use client";

import { useSyncExternalStore } from "react";
import {
  getContactServerSnapshot,
  getContactSnapshot,
  getTravellersServerSnapshot,
  getTravellersSnapshot,
  subscribeContact,
  subscribeTravellers,
} from "@/lib/profiles";

export function useContactProfile() {
  return useSyncExternalStore(subscribeContact, getContactSnapshot, getContactServerSnapshot);
}

export function useTravellers() {
  return useSyncExternalStore(
    subscribeTravellers,
    getTravellersSnapshot,
    getTravellersServerSnapshot
  );
}
