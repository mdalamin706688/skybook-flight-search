export const AIRPORTS = [
  { code: "JFK", city: "New York", name: "John F. Kennedy International" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International" },
  { code: "ORD", city: "Chicago", name: "O'Hare International" },
  { code: "MIA", city: "Miami", name: "Miami International" },
  { code: "DFW", city: "Dallas", name: "Dallas/Fort Worth International" },
  { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International" },
  { code: "BOS", city: "Boston", name: "Boston Logan International" },
] as const;

export type AirportCode = (typeof AIRPORTS)[number]["code"];

export function getAirportLabel(code: string): string {
  const airport = AIRPORTS.find((a) => a.code === code);
  return airport ? `${airport.city} (${airport.code})` : code;
}
