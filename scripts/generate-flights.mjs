/**
 * Generates mock flight data for every airport pair in the search dropdown.
 * Run: node scripts/generate-flights.mjs
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const AIRPORTS = ["JFK", "LAX", "SFO", "ORD", "MIA", "DFW", "SEA", "BOS"];

const AIRPORT_COORDS = {
  JFK: [40.6413, -73.7781],
  LAX: [33.9416, -118.4085],
  SFO: [37.6213, -122.379],
  ORD: [41.9742, -87.9073],
  MIA: [25.7959, -80.287],
  DFW: [32.8998, -97.0403],
  SEA: [47.4502, -122.3088],
  BOS: [42.3656, -71.0096],
};

const AIRLINES = [
  { name: "Delta", prefix: "DL" },
  { name: "United", prefix: "UA" },
  { name: "American", prefix: "AA" },
  { name: "JetBlue", prefix: "B6" },
  { name: "Southwest", prefix: "WN" },
  { name: "Alaska", prefix: "AS" },
  { name: "Spirit", prefix: "NK" },
  { name: "Frontier", prefix: "F9" },
];

const DATE = "2026-07-15";
const FLIGHTS_PER_ROUTE = 32;

function toRad(value) {
  return (value * Math.PI) / 180;
}

function distanceMiles(origin, destination) {
  const [lat1, lon1] = AIRPORT_COORDS[origin];
  const [lat2, lon2] = AIRPORT_COORDS[destination];
  const earthRadiusMiles = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function routeProfile(origin, destination) {
  const miles = distanceMiles(origin, destination);
  const nonstopMinutes = Math.round((miles / 520) * 60 + 35);
  const basePrice = Math.round(70 + miles * 0.12);

  return { miles, nonstopMinutes, basePrice };
}

function formatTime(totalMinutes) {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function generateFlights() {
  const flights = [];
  let counter = 1;

  for (const origin of AIRPORTS) {
    for (const destination of AIRPORTS) {
      if (origin === destination) continue;

      const profile = routeProfile(origin, destination);

      for (let i = 0; i < FLIGHTS_PER_ROUTE; i += 1) {
        const airline = AIRLINES[i % AIRLINES.length];
        const stops = i % 7 === 6 ? 1 : 0;
        const durationMinutes = stops
          ? profile.nonstopMinutes + 75
          : profile.nonstopMinutes;
        const departureMinutes = 360 + i * 27;
        const arrivalMinutes = departureMinutes + durationMinutes;
        const price = stops
          ? profile.basePrice - 25 + (i % 5) * 8
          : profile.basePrice + (i % 6) * 12;

        flights.push({
          id: `flt-${String(counter).padStart(3, "0")}`,
          airline: airline.name,
          flightNumber: `${airline.prefix} ${1000 + counter}`,
          origin,
          destination,
          departureTime: formatTime(departureMinutes),
          arrivalTime: formatTime(arrivalMinutes),
          durationMinutes,
          stops,
          price: Math.max(79, price),
          date: DATE,
        });

        counter += 1;
      }
    }
  }

  return flights;
}

const flights = generateFlights();
const outputPath = join(rootDir, "data", "flights.json");
writeFileSync(outputPath, `${JSON.stringify(flights, null, 2)}\n`);

const routeCount = AIRPORTS.length * (AIRPORTS.length - 1);
console.log(`Generated ${flights.length} flights across ${routeCount} routes.`);
console.log(`Written to ${outputPath}`);
