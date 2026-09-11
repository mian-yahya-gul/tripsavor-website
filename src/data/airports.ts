export type AirportRegion =
  | "Pakistan"
  | "GCC"
  | "Middle East"
  | "UK & Europe"
  | "North America"
  | "Asia Pacific"
  | "Africa";

export type Airport = {
  city: string;
  code: string;
  country: string;
  /** Full airport name, shown as the secondary line in the picker. */
  name: string;
  region: AirportRegion;
  /** Surfaced first when the picker opens with no query typed. */
  popular?: boolean;
};

export const airports: Airport[] = [
  // Pakistan
  { city: "Karachi", code: "KHI", country: "Pakistan", name: "Jinnah International", region: "Pakistan", popular: true },
  { city: "Lahore", code: "LHE", country: "Pakistan", name: "Allama Iqbal International", region: "Pakistan", popular: true },
  { city: "Islamabad", code: "ISB", country: "Pakistan", name: "Islamabad International", region: "Pakistan", popular: true },
  { city: "Peshawar", code: "PEW", country: "Pakistan", name: "Bacha Khan International", region: "Pakistan" },
  { city: "Multan", code: "MUX", country: "Pakistan", name: "Multan International", region: "Pakistan" },
  { city: "Quetta", code: "UET", country: "Pakistan", name: "Quetta International", region: "Pakistan" },
  { city: "Sialkot", code: "SKT", country: "Pakistan", name: "Sialkot International", region: "Pakistan" },
  { city: "Faisalabad", code: "LYP", country: "Pakistan", name: "Faisalabad International", region: "Pakistan" },
  { city: "Skardu", code: "KDU", country: "Pakistan", name: "Skardu International", region: "Pakistan" },
  { city: "Gwadar", code: "GWD", country: "Pakistan", name: "Gwadar International", region: "Pakistan" },
  { city: "Sukkur", code: "SKZ", country: "Pakistan", name: "Sukkur Airport", region: "Pakistan" },

  // GCC
  { city: "Dubai", code: "DXB", country: "United Arab Emirates", name: "Dubai International", region: "GCC", popular: true },
  { city: "Abu Dhabi", code: "AUH", country: "United Arab Emirates", name: "Zayed International", region: "GCC", popular: true },
  { city: "Sharjah", code: "SHJ", country: "United Arab Emirates", name: "Sharjah International", region: "GCC" },
  { city: "Doha", code: "DOH", country: "Qatar", name: "Hamad International", region: "GCC", popular: true },
  { city: "Jeddah", code: "JED", country: "Saudi Arabia", name: "King Abdulaziz International", region: "GCC", popular: true },
  { city: "Madinah", code: "MED", country: "Saudi Arabia", name: "Prince Mohammad Bin Abdulaziz", region: "GCC", popular: true },
  { city: "Riyadh", code: "RUH", country: "Saudi Arabia", name: "King Khalid International", region: "GCC", popular: true },
  { city: "Dammam", code: "DMM", country: "Saudi Arabia", name: "King Fahd International", region: "GCC" },
  { city: "Kuwait City", code: "KWI", country: "Kuwait", name: "Kuwait International", region: "GCC" },
  { city: "Manama", code: "BAH", country: "Bahrain", name: "Bahrain International", region: "GCC" },
  { city: "Muscat", code: "MCT", country: "Oman", name: "Muscat International", region: "GCC", popular: true },
  { city: "Salalah", code: "SLL", country: "Oman", name: "Salalah Airport", region: "GCC" },

  // Middle East
  { city: "Istanbul", code: "IST", country: "Turkey", name: "Istanbul Airport", region: "Middle East", popular: true },
  { city: "Istanbul", code: "SAW", country: "Turkey", name: "Sabiha Gokcen International", region: "Middle East" },
  { city: "Amman", code: "AMM", country: "Jordan", name: "Queen Alia International", region: "Middle East" },
  { city: "Beirut", code: "BEY", country: "Lebanon", name: "Rafic Hariri International", region: "Middle East" },
  { city: "Cairo", code: "CAI", country: "Egypt", name: "Cairo International", region: "Middle East" },
  { city: "Baghdad", code: "BGW", country: "Iraq", name: "Baghdad International", region: "Middle East" },
  { city: "Najaf", code: "NJF", country: "Iraq", name: "Al Najaf International", region: "Middle East" },
  { city: "Tehran", code: "IKA", country: "Iran", name: "Imam Khomeini International", region: "Middle East" },

  // UK & Europe
  { city: "London", code: "LHR", country: "United Kingdom", name: "Heathrow", region: "UK & Europe", popular: true },
  { city: "London", code: "LGW", country: "United Kingdom", name: "Gatwick", region: "UK & Europe" },
  { city: "Manchester", code: "MAN", country: "United Kingdom", name: "Manchester Airport", region: "UK & Europe", popular: true },
  { city: "Birmingham", code: "BHX", country: "United Kingdom", name: "Birmingham Airport", region: "UK & Europe" },
  { city: "Paris", code: "CDG", country: "France", name: "Charles de Gaulle", region: "UK & Europe" },
  { city: "Frankfurt", code: "FRA", country: "Germany", name: "Frankfurt Airport", region: "UK & Europe" },
  { city: "Amsterdam", code: "AMS", country: "Netherlands", name: "Schiphol", region: "UK & Europe" },
  { city: "Milan", code: "MXP", country: "Italy", name: "Malpensa", region: "UK & Europe" },
  { city: "Rome", code: "FCO", country: "Italy", name: "Leonardo da Vinci–Fiumicino", region: "UK & Europe" },
  { city: "Barcelona", code: "BCN", country: "Spain", name: "Josep Tarradellas Barcelona–El Prat", region: "UK & Europe" },
  { city: "Madrid", code: "MAD", country: "Spain", name: "Adolfo Suárez Madrid–Barajas", region: "UK & Europe" },
  { city: "Dublin", code: "DUB", country: "Ireland", name: "Dublin Airport", region: "UK & Europe" },
  { city: "Oslo", code: "OSL", country: "Norway", name: "Oslo Gardermoen", region: "UK & Europe" },
  { city: "Stockholm", code: "ARN", country: "Sweden", name: "Arlanda", region: "UK & Europe" },
  { city: "Copenhagen", code: "CPH", country: "Denmark", name: "Copenhagen Airport", region: "UK & Europe" },

  // North America
  { city: "New York", code: "JFK", country: "United States", name: "John F. Kennedy International", region: "North America", popular: true },
  { city: "Newark", code: "EWR", country: "United States", name: "Newark Liberty International", region: "North America" },
  { city: "Washington", code: "IAD", country: "United States", name: "Washington Dulles International", region: "North America" },
  { city: "Chicago", code: "ORD", country: "United States", name: "O'Hare International", region: "North America" },
  { city: "Houston", code: "IAH", country: "United States", name: "George Bush Intercontinental", region: "North America" },
  { city: "Dallas", code: "DFW", country: "United States", name: "Dallas Fort Worth International", region: "North America" },
  { city: "Los Angeles", code: "LAX", country: "United States", name: "Los Angeles International", region: "North America" },
  { city: "San Francisco", code: "SFO", country: "United States", name: "San Francisco International", region: "North America" },
  { city: "Boston", code: "BOS", country: "United States", name: "Logan International", region: "North America" },
  { city: "Atlanta", code: "ATL", country: "United States", name: "Hartsfield–Jackson International", region: "North America" },
  { city: "Toronto", code: "YYZ", country: "Canada", name: "Pearson International", region: "North America", popular: true },
  { city: "Vancouver", code: "YVR", country: "Canada", name: "Vancouver International", region: "North America" },
  { city: "Montreal", code: "YUL", country: "Canada", name: "Montréal–Trudeau International", region: "North America" },

  // Asia Pacific
  { city: "Bangkok", code: "BKK", country: "Thailand", name: "Suvarnabhumi", region: "Asia Pacific", popular: true },
  { city: "Kuala Lumpur", code: "KUL", country: "Malaysia", name: "Kuala Lumpur International", region: "Asia Pacific", popular: true },
  { city: "Singapore", code: "SIN", country: "Singapore", name: "Changi", region: "Asia Pacific" },
  { city: "Hong Kong", code: "HKG", country: "Hong Kong", name: "Hong Kong International", region: "Asia Pacific" },
  { city: "Beijing", code: "PEK", country: "China", name: "Beijing Capital International", region: "Asia Pacific" },
  { city: "Guangzhou", code: "CAN", country: "China", name: "Baiyun International", region: "Asia Pacific" },
  { city: "Shanghai", code: "PVG", country: "China", name: "Pudong International", region: "Asia Pacific" },
  { city: "Seoul", code: "ICN", country: "South Korea", name: "Incheon International", region: "Asia Pacific" },
  { city: "Tokyo", code: "NRT", country: "Japan", name: "Narita International", region: "Asia Pacific" },
  { city: "Delhi", code: "DEL", country: "India", name: "Indira Gandhi International", region: "Asia Pacific" },
  { city: "Mumbai", code: "BOM", country: "India", name: "Chhatrapati Shivaji Maharaj International", region: "Asia Pacific" },
  { city: "Colombo", code: "CMB", country: "Sri Lanka", name: "Bandaranaike International", region: "Asia Pacific" },
  { city: "Dhaka", code: "DAC", country: "Bangladesh", name: "Hazrat Shahjalal International", region: "Asia Pacific" },
  { city: "Kathmandu", code: "KTM", country: "Nepal", name: "Tribhuvan International", region: "Asia Pacific" },
  { city: "Malé", code: "MLE", country: "Maldives", name: "Velana International", region: "Asia Pacific" },
  { city: "Baku", code: "GYD", country: "Azerbaijan", name: "Heydar Aliyev International", region: "Asia Pacific" },
  { city: "Tashkent", code: "TAS", country: "Uzbekistan", name: "Islam Karimov Tashkent International", region: "Asia Pacific" },
  { city: "Almaty", code: "ALA", country: "Kazakhstan", name: "Almaty International", region: "Asia Pacific" },
  { city: "Sydney", code: "SYD", country: "Australia", name: "Kingsford Smith", region: "Asia Pacific" },
  { city: "Melbourne", code: "MEL", country: "Australia", name: "Melbourne Airport", region: "Asia Pacific" },

  // Africa
  { city: "Nairobi", code: "NBO", country: "Kenya", name: "Jomo Kenyatta International", region: "Africa" },
  { city: "Addis Ababa", code: "ADD", country: "Ethiopia", name: "Bole International", region: "Africa" },
  { city: "Johannesburg", code: "JNB", country: "South Africa", name: "O. R. Tambo International", region: "Africa" },
  { city: "Dar es Salaam", code: "DAR", country: "Tanzania", name: "Julius Nyerere International", region: "Africa" },
  { city: "Lagos", code: "LOS", country: "Nigeria", name: "Murtala Muhammed International", region: "Africa" },
];

const airportByCode = new Map(airports.map((a) => [a.code, a]));

export function getAirport(code: string): Airport | undefined {
  return airportByCode.get(code.toUpperCase());
}

export function cityForCode(code: string): string {
  return airportByCode.get(code.toUpperCase())?.city ?? code;
}

export const popularAirports = airports.filter((a) => a.popular);

/**
 * Ranked fuzzy match over IATA code / city / airport name / country.
 * Returns the popular shortlist when the query is empty so the picker is
 * never blank on open.
 */
export function searchAirports(
  rawQuery: string,
  options: { exclude?: string; limit?: number } = {}
): Airport[] {
  const { exclude, limit = 7 } = options;
  const query = rawQuery.trim().toLowerCase();
  const pool = exclude ? airports.filter((a) => a.code !== exclude.toUpperCase()) : airports;

  if (!query) {
    return pool.filter((a) => a.popular).slice(0, limit);
  }

  const scored = pool
    .map((a) => {
      const code = a.code.toLowerCase();
      const city = a.city.toLowerCase();
      const name = a.name.toLowerCase();
      const country = a.country.toLowerCase();

      let score = -1;
      if (code === query) score = 100;
      else if (code.startsWith(query)) score = 92;
      else if (city.startsWith(query)) score = 84;
      else if (city.includes(query)) score = 66;
      else if (name.includes(query)) score = 48;
      else if (country.startsWith(query)) score = 40;
      else if (country.includes(query)) score = 28;

      if (score >= 0 && a.popular) score += 3;
      return { airport: a, score };
    })
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score || a.airport.city.localeCompare(b.airport.city));

  return scored.slice(0, limit).map((entry) => entry.airport);
}
