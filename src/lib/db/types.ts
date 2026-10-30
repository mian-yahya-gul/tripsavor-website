/** Row types mirroring migrations/*.sql. Money is integer minor units; timestamps are ISO-8601 UTC. */

export type EnquiryType = "contact" | "group-tickets" | "callback";
export type EnquiryStatus = "new" | "in_progress" | "quoted" | "won" | "lost" | "spam";
export type BookingStatus = "pending" | "confirmed" | "ticketed" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "card" | "bank_transfer" | "cash" | "other";
export type PassengerType = "adult" | "child" | "infant";

export interface DestinationRow {
  id: number;
  code: string;
  city: string;
  country: string;
  slug: string;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface TravelPackageRow {
  id: number;
  destination_id: number | null;
  slug: string;
  title: string;
  description: string | null;
  duration_days: number | null;
  price_minor: number;
  currency: string;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface CustomerRow {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnquiryRow {
  id: number;
  public_ref: string;
  type: EnquiryType;
  status: EnquiryStatus;
  customer_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  details_json: string | null;
  email_sent: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface BookingRow {
  id: number;
  public_ref: string;
  customer_id: number;
  package_id: number | null;
  enquiry_id: number | null;
  status: BookingStatus;
  currency: string;
  total_minor: number;
  itinerary_json: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PassengerRow {
  id: number;
  booking_id: number;
  full_name: string;
  passenger_type: PassengerType;
  date_of_birth: string | null;
  nationality: string | null;
  created_at: string;
}

export interface PaymentRow {
  id: number;
  booking_id: number;
  amount_minor: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider: string | null;
  provider_ref: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatusEventRow {
  id: number;
  from_status: string | null;
  to_status: string;
  note: string | null;
  actor: string;
  created_at: string;
}
export interface EnquiryEventRow extends StatusEventRow {
  enquiry_id: number;
}
export interface BookingEventRow extends StatusEventRow {
  booking_id: number;
}
