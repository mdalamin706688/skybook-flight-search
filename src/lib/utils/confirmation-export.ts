import { getAirportLabel } from "@/lib/constants/airports";
import type { BookingConfirmation } from "@/lib/types/booking";
import { formatDuration, formatPrice, formatStops } from "@/lib/utils/flight-utils";

function formatBookedAt(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildConfirmationReceiptHtml(booking: BookingConfirmation) {
  const { flight, passengerDetails } = booking;
  const passengerName = `${passengerDetails.firstName} ${passengerDetails.lastName}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SkyBook Itinerary · ${escapeHtml(booking.bookingId)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0c1222;
      background: #fafaf9;
      padding: 40px 24px;
      line-height: 1.5;
    }
    .wrap { max-width: 720px; margin: 0 auto; }
    .brand { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #94a3b8; }
    h1 { font-size: 28px; font-weight: 600; margin-top: 8px; }
    .meta { margin-top: 8px; color: #5c6578; font-size: 14px; }
    .card {
      margin-top: 28px;
      border: 1px solid #e8eaed;
      border-radius: 16px;
      overflow: hidden;
      background: #fff;
    }
    .banner {
      background: #0c1222;
      color: #fff;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
    .banner h2 { font-size: 18px; font-weight: 600; }
    .banner p { font-size: 13px; opacity: 0.7; margin-top: 4px; }
    .body { padding: 24px; }
    .route {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 16px;
      align-items: center;
      margin-top: 20px;
    }
    .code { font-size: 42px; font-weight: 600; letter-spacing: -0.03em; }
    .city { font-size: 13px; color: #5c6578; margin-top: 6px; }
    .time { font-size: 22px; font-weight: 600; margin-top: 12px; }
    .mid { text-align: center; font-size: 11px; color: #94a3b8; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px; }
    td { padding: 10px 0; border-bottom: 1px dashed #e8eaed; vertical-align: top; }
    td:first-child { color: #5c6578; width: 40%; }
    td:last-child { font-weight: 500; text-align: right; }
    .total td { border-bottom: none; padding-top: 16px; font-size: 18px; font-weight: 600; }
    .footer { margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center; }
    @media print {
      body { background: #fff; padding: 0; }
      .card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <p class="brand">SkyBook · Travel itinerary</p>
    <h1>Booking confirmed</h1>
    <p class="meta">Confirmation <strong>${escapeHtml(booking.bookingId)}</strong> · ${escapeHtml(formatBookedAt(booking.bookedAt))}</p>

    <div class="card">
      <div class="banner">
        <div>
          <p class="brand" style="color: rgba(255,255,255,0.45);">E-ticket</p>
          <h2>${escapeHtml(flight.airline)}</h2>
          <p>${escapeHtml(flight.flightNumber)} · ${escapeHtml(formatStops(flight.stops))}</p>
        </div>
        <div style="text-align:right">
          <p class="brand" style="color: rgba(255,255,255,0.45);">Passenger</p>
          <h2>${escapeHtml(passengerName)}</h2>
          <p>${escapeHtml(String(booking.passengers))} traveler(s)</p>
        </div>
      </div>
      <div class="body">
        <div class="route">
          <div>
            <div class="code">${escapeHtml(flight.origin)}</div>
            <div class="city">${escapeHtml(getAirportLabel(flight.origin))}</div>
            <div class="time">${escapeHtml(flight.departureTime)}</div>
          </div>
          <div class="mid">${escapeHtml(formatDuration(flight.durationMinutes))}</div>
          <div style="text-align:right">
            <div class="code">${escapeHtml(flight.destination)}</div>
            <div class="city">${escapeHtml(getAirportLabel(flight.destination))}</div>
            <div class="time">${escapeHtml(flight.arrivalTime)}</div>
          </div>
        </div>
        <table>
          <tr><td>Travel date</td><td>${escapeHtml(flight.date)}</td></tr>
          <tr><td>Email</td><td>${escapeHtml(passengerDetails.email)}</td></tr>
          <tr><td>Phone</td><td>${escapeHtml(passengerDetails.phone)}</td></tr>
          <tr><td>Fare</td><td>${escapeHtml(formatPrice(flight.price))} × ${escapeHtml(String(booking.passengers))}</td></tr>
          <tr class="total"><td>Total paid</td><td>${escapeHtml(formatPrice(booking.totalPrice))}</td></tr>
        </table>
      </div>
    </div>

    <p class="footer">Present this itinerary at check-in. This is a confirmation receipt from SkyBook.</p>
  </div>
</body>
</html>`;
}

export function printConfirmation() {
  window.print();
}

export function downloadConfirmationReceipt(booking: BookingConfirmation) {
  const html = buildConfirmationReceiptHtml(booking);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `skybook-itinerary-${booking.bookingId}.html`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
