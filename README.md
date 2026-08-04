# SkyBook — Flight Search & Booking Platform

SkyBook is a production-oriented flight search and booking platform. Travelers can search routes, compare and filter fares, select an itinerary, and complete booking with validated passenger data and instant confirmation.

Built for commercial travel commerce: clear UX, typed APIs, resilient async flows, and an architecture ready to connect to live airline and GDS inventory.

## Tech Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **TanStack Query** — server state (fetching, caching, loading/error)
- **Zustand** — client state for booking flow (selected flight, confirmation)
- **Zod** — form validation schemas shared by client and API
- **Tailwind CSS** — styling
- **Vitest** + **Testing Library** — unit and component tests

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Build a static export for GitHub Pages:

```bash
npm run build:pages
```

**Live product demo:** https://mdalamin706688.github.io/skybook-flight-search/

GitHub Pages uses a static export with client-side catalog data (API routes are not available on static hosting). Local `npm run dev` uses mock API routes that mirror a real backend contract.

### Other Commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run test     # Run tests
npm run lint     # ESLint
```

## Product Capabilities

### Flight Search
- Search by origin, destination, date, and passenger count
- Results displayed as scannable flight cards
- Sort by price, duration, or departure time (asc/desc)
- Filter by max price, stops, and airline
- Paginated results (4 per page by default, configurable: 4, 8, 12, 20)
- Compact search bar on results page for refining searches
- Loading, empty, and error states with retry

### Booking Flow
- Select a flight from results
- Review flight details and total price
- Complete passenger information form with validation
- Receive booking confirmation with reference number

## Catalog Data

Flight catalog lives in `data/flights.json` and covers **every airport pair** in the search dropdown:

- **8 airports** → **56 routes** → **1,792 flights** (32 per route)
- Reference date: **2026-07-15**
- Regenerate with: `npm run generate:flights`

Pagination shows **4 flights per page** by default (configurable: 4, 8, 12, 20).

## Deployment

GitHub Pages deploys automatically on push to `main` via `.github/workflows/deploy-pages.yml`.

In repo **Settings → Pages**, set source to **GitHub Actions** (not “Deploy from branch / README”).

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flights?origin=&destination=&date=` | Search flights |
| GET | `/api/flights?id=` | Get single flight |
| POST | `/api/bookings` | Create booking |

API routes simulate network latency (~600–800ms). Append `simulateError=true` to the search URL to verify error handling:

```
/search?origin=JFK&destination=LAX&date=2026-07-15&passengers=1&simulateError=true
```

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
├── components/       # UI, search, booking, shared components
├── hooks/            # Custom React hooks
├── lib/              # Types, utils, validation, API client
└── store/            # Zustand store
data/
└── flights.json      # Flight catalog
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions and trade-offs.

## Testing

Tests cover:
- Flight filtering, sorting, and formatting utilities
- Zod validation schemas and URL param parsing
- Catalog repository integrity (30+ flights on primary route)
- Search form and results (loading, empty, error states)
- Key UI components (FlightCard, BookingForm, shared states)

```bash
npm test
```

## Roadmap

Near-term commercial priorities:

1. **URL-driven filters/sort** — persist filter and sort state in search params for shareable/bookmarkable results
2. **End-to-end coverage** — Playwright E2E for the full search → book flow
3. **Accessibility hardening** — keyboard navigation, screen reader testing, axe-core CI
4. **Scale for inventory** — server-side filter/sort and cursor pagination for large result sets
5. **Live inventory integration** — swap catalog API for typed clients (GDS / NDC / OTA partners) with OpenAPI-generated types

## License

MIT
