const COUNTRY_CODES: Record<string, string> = {
  angola: "AO",
  bolivia: "BO",
  "bosnia and herzegovina": "BA",
  bulgaria: "BG",
  cameroon: "CM",
  "côte d'ivoire": "CI",
  "cote d'ivoire": "CI",
  "democratic republic of the congo": "CD",
  haiti: "HT",
  iran: "IR",
  iraq: "IQ",
  kenya: "KE",
  kuwait: "KW",
  "lao people's democratic republic": "LA",
  laos: "LA",
  lebanon: "LB",
  monaco: "MC",
  myanmar: "MM",
  nepal: "NP",
  "papua new guinea": "PG",
  "south sudan": "SS",
  syria: "SY",
  venezuela: "VE",
  vietnam: "VN",
  "virgin islands (british)": "VG",
  yemen: "YE",
  "democratic people's republic of korea": "KP",
  "north korea": "KP",

  bangladesh: "BD",
};

export function getCountryCode(country: string): string | null {
  const normalizedCountry = country.trim().toLowerCase();

  return COUNTRY_CODES[normalizedCountry] ?? null;
}
