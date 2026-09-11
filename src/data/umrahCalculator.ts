export type VisaType = {
  id: string;
  label: string;
  sarAdult: number;
  sarChild: number;
  sarInfant: number;
};

export const visaTypes: VisaType[] = [
  { id: "single-14", label: "Umrah Visa — Single Entry (14 Days)", sarAdult: 300, sarChild: 300, sarInfant: 0 },
  { id: "single-30", label: "Umrah Visa — Single Entry (30 Days)", sarAdult: 380, sarChild: 380, sarInfant: 0 },
  { id: "multi-90", label: "Umrah Visa — Multiple Entry (90 Days)", sarAdult: 480, sarChild: 480, sarInfant: 0 },
  { id: "family", label: "Family Umrah Visa Package", sarAdult: 340, sarChild: 260, sarInfant: 0 },
];

export const SAR_TO_PKR = 76.8;

export const umrahCities = ["Makkah", "Madinah", "Jeddah"];

export const hotelSuggestions: Record<string, string[]> = {
  Makkah: ["Swissôtel Al Maqam", "Elaf Al Mashaer", "Al Kiswah Towers", "Makkah Towers"],
  Madinah: ["Dar Al Taqwa Hotel", "Al Aqeeq Royal", "Madinah Hilton", "Al Eiman Taibah"],
  Jeddah: ["Jeddah Hilton", "Park Inn Jeddah", "Rove Jeddah"],
};

export const roomTypes = ["Quad Sharing", "Triple Sharing", "Double Sharing", "Private Room"];

export const transportTypes = [
  { id: "airport-transfer", label: "Airport Transfer (Jeddah ⇄ Makkah)" },
  { id: "intercity", label: "Intercity Transfer (Makkah ⇄ Madinah)" },
  { id: "ziyarat-makkah", label: "Ziyarat Tour — Makkah" },
  { id: "ziyarat-madinah", label: "Ziyarat Tour — Madinah" },
];
