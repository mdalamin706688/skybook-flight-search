# SkyBook — Flight Search & Booking

A flight search aggregator built as a take-home exercise for iBox Lab. Users can search for flights, filter and sort results, select a flight, and complete a booking flow with validation and confirmation.

## Tech Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **TanStack Query** — server state (fetching, caching, loading/error)
- **Zustand** — client state for booking flow (selected flight, confirmation)
- **Zod** — form validation schemas
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

Open [http://localhost:3000](http://localhost:3000).

### Other Commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run test     # Run tests
npm run lint     # ESLint
```

## Features

### Flight Search
- Search by origin, destination, date, and passenger count
- Results displayed as scannable flight cards
- Sort by price, duration, or departure time (asc/desc)
- Filter by max price, stops, and airline
- Paginated results (10 per page by default, configurable)
- Compact search bar on results page for refining searches
- Loading, empty, and error states with retry

### Booking Flow
- Select a flight from results
- Review flight details and total price
- Complete passenger information form with validation
- Receive booking confirmation with reference number

## Demo Data

Mock data lives in `data/flights.json` and covers **every airport pair** in the search dropdown:

- **8 airports** → **56 routes** → **1,792 flights** (32 per route)
- Date: **2026-07-15**
- Regenerate with: `npm run generate:flights`

Pagination shows **4 flights per page** by default (configurable: 4, 8, 12, 20).

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flights?origin=&destination=&date=` | Search flights |
| GET | `/api/flights?id=` | Get single flight |
| POST | `/api/bookings` | Create booking |

API routes simulate network latency (~600–800ms). Append `simulateError=true` to the search URL to test error handling:

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
└── flights.json      # Mock flight data
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions and trade-offs.

## Testing

Tests cover:
- Flight filtering, sorting, and formatting utilities
- Zod validation schemas and URL param parsing
- Mock data repository (30+ flights on primary route)
- Search form and results (loading, empty, error states)
- Key UI components (FlightCard, BookingForm, shared states)

```bash
npm test
```

## What I'd Do Next

Given more time, priorities would be:

1. **URL-driven filters/sort** — persist filter and sort state in search params for shareable/bookmarkable results
2. **Integration tests** — Playwright E2E for the full search → book flow
3. **Accessibility audit** — keyboard navigation, screen reader testing
4. **Pagination / virtual scrolling** — for large result sets (1000+ flights)
5. **Real backend integration** — swap mock API for typed API client with OpenAPI-generated types

## License

MIT — take-home exercise submission.
