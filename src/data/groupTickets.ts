import { MoonStar, Plane } from "lucide-react";

export type GroupCategoryId = "umrah" | "uae" | "ksa" | "uk" | "muscat" | "qatar" | "bahrain";

export type GroupCategory = {
  id: GroupCategoryId;
  label: string;
  icon: typeof MoonStar;
  gradient: string;
};

export const groupCategories: GroupCategory[] = [
  { id: "umrah", label: "Umrah & Hajj Groups", icon: MoonStar, gradient: "from-brand-900 to-brand-600" },
  { id: "uae", label: "UAE Groups", icon: Plane, gradient: "from-brand-700 to-brand-400" },
  { id: "ksa", label: "KSA Groups", icon: Plane, gradient: "from-accent-600 to-accent-400" },
  { id: "uk", label: "UK Groups", icon: Plane, gradient: "from-brand-800 to-brand-500" },
  { id: "muscat", label: "Muscat Groups", icon: Plane, gradient: "from-brand-600 to-brand-400" },
  { id: "qatar", label: "Qatar Groups", icon: Plane, gradient: "from-brand-900 to-brand-700" },
  { id: "bahrain", label: "Bahrain Groups", icon: Plane, gradient: "from-accent-500 to-accent-400" },
];

export type GroupFlight = {
  date: string;
  flightNo: string;
  time: string;
  bag: string;
  meal: boolean;
  fare: number;
  ref: string;
};

export type GroupRoute = {
  category: GroupCategoryId;
  airline: string;
  route: string;
  flights: GroupFlight[];
};

export const groupRoutes: GroupRoute[] = [
  {
    category: "umrah",
    airline: "SalamAir",
    route: "ISLAMABAD - MUSCAT - MADINAH",
    flights: [
      { date: "05-09-2026", flightNo: "OV 560", time: "04:10 - 06:20", bag: "20+7 KG", meal: false, fare: 95000, ref: "AG# 2201" },
      { date: "12-09-2026", flightNo: "OV 560", time: "04:10 - 06:20", bag: "20+7 KG", meal: false, fare: 98500, ref: "AG# 2202" },
      { date: "19-09-2026", flightNo: "OV 560", time: "04:10 - 06:20", bag: "20+7 KG", meal: false, fare: 99000, ref: "AG# 2203" },
    ],
  },
  {
    category: "uae",
    airline: "Fly Jinnah",
    route: "LAHORE - DUBAI",
    flights: [
      { date: "02-09-2026", flightNo: "9P 310", time: "14:20 - 17:05", bag: "20+7 KG", meal: true, fare: 58000, ref: "AG# 3110" },
      { date: "09-09-2026", flightNo: "9P 310", time: "14:20 - 17:05", bag: "20+7 KG", meal: true, fare: 61000, ref: "AG# 3111" },
    ],
  },
  {
    category: "ksa",
    airline: "AirSial",
    route: "KARACHI - JEDDAH",
    flights: [
      { date: "03-09-2026", flightNo: "PF 412", time: "09:40 - 12:55", bag: "20+7 KG", meal: true, fare: 88000, ref: "AG# 4021" },
      { date: "10-09-2026", flightNo: "PF 412", time: "09:40 - 12:55", bag: "20+7 KG", meal: true, fare: 91500, ref: "AG# 4022" },
    ],
  },
  {
    category: "uk",
    airline: "Airblue",
    route: "ISLAMABAD - LONDON",
    flights: [
      { date: "06-09-2026", flightNo: "ABQ 775", time: "03:15 - 09:40", bag: "30+7 KG", meal: true, fare: 168000, ref: "AG# 5501" },
      { date: "20-09-2026", flightNo: "ABQ 775", time: "03:15 - 09:40", bag: "30+7 KG", meal: true, fare: 172500, ref: "AG# 5502" },
    ],
  },
  {
    category: "muscat",
    airline: "SalamAir",
    route: "LAHORE - MUSCAT",
    flights: [
      { date: "04-09-2026", flightNo: "OV 206", time: "10:05 - 12:20", bag: "20+7 KG", meal: true, fare: 62000, ref: "AG# 6301" },
      { date: "11-09-2026", flightNo: "OV 206", time: "10:05 - 12:20", bag: "20+7 KG", meal: true, fare: 64500, ref: "AG# 6302" },
    ],
  },
  {
    category: "qatar",
    airline: "Qatar Airways",
    route: "KARACHI - DOHA",
    flights: [
      { date: "05-09-2026", flightNo: "QR 602", time: "01:20 - 03:10", bag: "30+7 KG", meal: true, fare: 71000, ref: "AG# 7110" },
      { date: "15-09-2026", flightNo: "QR 602", time: "01:20 - 03:10", bag: "30+7 KG", meal: true, fare: 74500, ref: "AG# 7111" },
    ],
  },
  {
    category: "bahrain",
    airline: "Gulf Air",
    route: "LAHORE - BAHRAIN",
    flights: [
      { date: "07-09-2026", flightNo: "GF 731", time: "08:30 - 11:15", bag: "20+7 KG", meal: false, fare: 59000, ref: "AG# 8020" },
      { date: "14-09-2026", flightNo: "GF 731", time: "08:30 - 11:15", bag: "20+7 KG", meal: false, fare: 61500, ref: "AG# 8021" },
    ],
  },
];
