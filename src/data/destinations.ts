export type Destination = {
  city: string;
  country: string;
  code: string;
  /** indicative starting fare, PKR */
  fromPrice: number;
  gradient: string;
};

export const destinations: Destination[] = [
  { city: "Dubai", country: "United Arab Emirates", code: "DXB", fromPrice: 42500, gradient: "from-brand-600 to-brand-400" },
  { city: "Istanbul", country: "Turkey", code: "IST", fromPrice: 78900, gradient: "from-accent-500 to-accent-400" },
  { city: "London", country: "United Kingdom", code: "LHR", fromPrice: 145000, gradient: "from-brand-800 to-brand-500" },
  { city: "Jeddah", country: "Saudi Arabia", code: "JED", fromPrice: 61300, gradient: "from-brand-700 to-brand-400" },
  { city: "Bangkok", country: "Thailand", code: "BKK", fromPrice: 68200, gradient: "from-accent-600 to-accent-400" },
  { city: "Doha", country: "Qatar", code: "DOH", fromPrice: 55700, gradient: "from-brand-900 to-brand-600" },
  { city: "Kuala Lumpur", country: "Malaysia", code: "KUL", fromPrice: 72400, gradient: "from-brand-600 to-brand-400" },
  { city: "Toronto", country: "Canada", code: "YYZ", fromPrice: 210000, gradient: "from-brand-800 to-brand-500" },
];

export const domesticRoutes = [
  { from: "Karachi", to: "Lahore" },
  { from: "Lahore", to: "Islamabad" },
  { from: "Karachi", to: "Islamabad" },
  { from: "Peshawar", to: "Karachi" },
  { from: "Multan", to: "Lahore" },
  { from: "Quetta", to: "Karachi" },
];
