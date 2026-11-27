"use client";

import type { BookingRecord } from "@/types/cinema";
import {
  formatCurrency,
  formatDuration,
  formatReadableDate,
  getCardNetworkLabel,
} from "@/lib/cardUtils";

export async function generateQrDataUrl(payload: string): Promise<string> {
  const QRCode = await import("qrcode");
  return QRCode.toDataURL(payload, {
    width: 320,
    margin: 1,
    color: {
      dark: "#0B0C0F",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  });
}

export async function downloadBookingPdf(booking: BookingRecord): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const qrDataUrl = await generateQrDataUrl(booking.qrPayload);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Background paper crisp white
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 297, "F");

  // Top Header Black Architectural Block
  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, pageWidth, 42, "F");

  // Two-Letter Red Monogram Mark inside PDF Header
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(margin, 10, 12, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("AF", margin + 6, 17.7, { align: "center" });

  // Brand Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ASTOR FILM HALL", margin + 16, 16.5);

  doc.setTextColor(161, 161, 170);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("OFFICIAL ADMISSION PASS & TAX RECEIPT", margin + 16, 21.5);

  // Reference & Status Right Side
  doc.setTextColor(255, 255, 255);
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.text(booking.bookingRef, pageWidth - margin, 16, { align: "right" });

  doc.setTextColor(booking.status === "confirmed" ? 255 : 220, booking.status === "confirmed" ? 255 : 38, booking.status === "confirmed" ? 255 : 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(
    booking.status === "confirmed" ? "CONFIRMED · PAID" : "CANCELLED · REFUNDED",
    pageWidth - margin,
    22,
    { align: "right" }
  );

  doc.setTextColor(150, 155, 165);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(booking.hall.address, margin, 33);
  doc.text(
    `Issued ${new Date(booking.createdAtIso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    pageWidth - margin,
    33,
    { align: "right" }
  );

  // Admission Ticket Card Container
  let y = 52;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(225, 222, 214);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 68, 3, 3, "FD");

  // Left Ticket Details (approx 122mm wide)
  const leftX = margin + 7;
  doc.setTextColor(120, 124, 134);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("FEATURE PRESENTATION", leftX, y + 9);

  doc.setTextColor(15, 17, 21);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(booking.film.title, leftX, y + 17);

  doc.setTextColor(95, 100, 112);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `${booking.showtime.format}  |  ${booking.film.rating}  |  ${formatDuration(
      booking.film.durationMins
    )}  |  ${booking.showtime.languageTag}`,
    leftX,
    y + 23.5
  );

  // Metadata Grid inside ticket
  const gridY = y + 33;
  const col1 = leftX;
  const col2 = leftX + 60;

  doc.setTextColor(120, 124, 134);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("CINEMA & AUDITORIUM", col1, gridY);
  doc.text("DATE & SHOWTIME", col2, gridY);

  doc.setTextColor(18, 20, 26);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(booking.hall.shortName, col1, gridY + 5);
  doc.text(formatReadableDate(booking.showtime.dateIso), col2, gridY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 85, 95);
  doc.text(booking.showtime.screenName, col1, gridY + 10);
  doc.text(`${booking.showtime.timeLabel} hrs`, col2, gridY + 10);

  // Seat Assignment Box
  const seatBoxY = y + 50;
  doc.setFillColor(244, 244, 245);
  doc.roundedRect(leftX, seatBoxY, 114, 12, 1.5, 1.5, "F");
  doc.setTextColor(120, 124, 134);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("RESERVED SEATS", leftX + 4, seatBoxY + 4.8);

  doc.setTextColor(15, 17, 21);
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  const seatList = booking.seats.map((s) => s.id).join(", ");
  doc.text(
    seatList.length > 42 ? `${seatList.slice(0, 42)}...` : seatList,
    leftX + 4,
    seatBoxY + 9.8
  );

  // Vertical dashed tear divider inside ticket
  const dividerX = margin + contentWidth - 48;
  doc.setDrawColor(210, 206, 198);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(dividerX, y + 5, dividerX, y + 63);
  doc.setLineDashPattern([], 0);

  // QR Code on right stub
  const qrSize = 36;
  const qrX = dividerX + (48 - qrSize) / 2;
  doc.addImage(qrDataUrl, "PNG", qrX, y + 8, qrSize, qrSize);

  doc.setTextColor(15, 17, 21);
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.text(booking.bookingRef, dividerX + 24, y + 49, { align: "center" });

  doc.setTextColor(110, 115, 125);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text("SCAN AT DOOR TURNSTILE", dividerX + 24, y + 54, { align: "center" });
  if (booking.concessions.length > 0) {
    doc.text(
      booking.deliveryMode === "in_seat" ? "IN-SEAT F&B SERVICE" : "EXPRESS F&B PICKUP",
      dividerX + 24,
      y + 58.5,
      { align: "center" }
    );
  }

  // Horizontal Perforation Separator
  y += 77;
  doc.setDrawColor(200, 196, 188);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setLineDashPattern([], 0);

  // Itemized Receipt Section
  y += 10;
  doc.setTextColor(15, 17, 21);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ITEMIZED PAYMENT RECEIPT", margin, y);

  doc.setTextColor(115, 120, 130);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    `Guest: ${booking.customerName} (${booking.customerEmail})`,
    pageWidth - margin,
    y,
    { align: "right" }
  );

  y += 6;
  // Table header
  doc.setFillColor(238, 236, 229);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setTextColor(75, 80, 90);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("DESCRIPTION", margin + 3, y + 5.2);
  doc.text("QTY", margin + 122, y + 5.2, { align: "right" });
  doc.text("UNIT", margin + 148, y + 5.2, { align: "right" });
  doc.text("AMOUNT", pageWidth - margin - 3, y + 5.2, { align: "right" });

  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const addReceiptRow = (label: string, qty: string, unit: string, amount: string, muted = false) => {
    doc.setTextColor(muted ? 105 : 22, muted ? 110 : 25, muted ? 120 : 32);
    doc.text(label, margin + 3, y);
    if (qty) doc.text(qty, margin + 122, y, { align: "right" });
    if (unit) doc.text(unit, margin + 148, y, { align: "right" });
    doc.setFont("courier", "normal");
    doc.text(amount, pageWidth - margin - 3, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 7;
  };

  // Group seats by tier for clean receipt lines
  const tierGroups = new Map<string, { count: number; unitPrice: number; total: number; seatIds: string[] }>();
  booking.seats.forEach((s) => {
    const label =
      s.tier === "vip_recliner"
        ? "VIP Recliner Suite"
        : s.tier === "executive"
        ? "Executive Prime Seat"
        : "Standard Seat";
    const existing = tierGroups.get(label);
    if (existing) {
      existing.count += 1;
      existing.total += s.price;
      existing.seatIds.push(s.id);
    } else {
      tierGroups.set(label, { count: 1, unitPrice: s.price, total: s.price, seatIds: [s.id] });
    }
  });

  tierGroups.forEach((group, label) => {
    addReceiptRow(
      `${label} (${group.seatIds.join(", ")})`,
      String(group.count),
      formatCurrency(group.unitPrice),
      formatCurrency(group.total)
    );
  });

  // Concessions rows
  booking.concessions.forEach((c) => {
    const flavorSuffix = c.selectedFlavor ? ` · ${c.selectedFlavor}` : "";
    addReceiptRow(
      `${c.item.name}${flavorSuffix}`,
      String(c.quantity),
      formatCurrency(c.item.price),
      formatCurrency(c.item.price * c.quantity)
    );
  });

  // Divider before fees & tax
  doc.setDrawColor(225, 222, 214);
  doc.line(margin, y - 2, pageWidth - margin, y - 2);
  y += 4;

  addReceiptRow(
    "Online Convenience & Box Office Fee",
    String(booking.seats.length),
    formatCurrency(booking.bookingFee / Math.max(1, booking.seats.length)),
    formatCurrency(booking.bookingFee),
    true
  );

  if (booking.discountAmount > 0) {
    const discountLabel = booking.promoApplied
      ? `Promotional Discount (${booking.promoApplied})`
      : "Member Loyalty Credit";
    addReceiptRow(discountLabel, "", "", `-${formatCurrency(booking.discountAmount)}`, true);
  }

  addReceiptRow("State & Local Entertainment Tax (8.875%)", "", "", formatCurrency(booking.taxAmount), true);

  // Total Bar
  y += 2;
  doc.setFillColor(9, 9, 11);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL CHARGED (USD)", margin + 4, y + 7.6);
  doc.setTextColor(255, 255, 255);
  doc.setFont("courier", "bold");
  doc.setFontSize(12);
  doc.text(formatCurrency(booking.totalPaid), pageWidth - margin - 4, y + 7.8, {
    align: "right",
  });

  // Payment Authorization Box
  y += 20;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(225, 222, 214);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, "FD");

  doc.setTextColor(120, 124, 134);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PAYMENT AUTHORIZATION DETAILS", margin + 4, y + 6.5);

  const methodText =
    booking.payment.method === "apple_pay"
      ? `Apple Pay (•••• ${booking.payment.last4 ?? "8841"})`
      : booking.payment.method === "google_pay"
      ? `Google Pay (•••• ${booking.payment.last4 ?? "5519"})`
      : `${getCardNetworkLabel(booking.payment.cardNetwork)} ending in •••• ${
          booking.payment.last4 ?? "4242"
        }`;

  doc.setTextColor(22, 25, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Method: ${methodText}`, margin + 4, y + 13);
  doc.text(
    `Transaction ID: ${booking.payment.transactionId}`,
    margin + 4,
    y + 19.5
  );
  doc.text(`Auth Code: ${booking.payment.authCode}`, pageWidth - margin - 4, y + 13, {
    align: "right",
  });
  if (booking.pointsEarned > 0) {
    doc.text(
      `Astor Pass Points Earned: +${booking.pointsEarned} pts`,
      pageWidth - margin - 4,
      y + 19.5,
      { align: "right" }
    );
  }

  // Footer
  doc.setTextColor(135, 140, 150);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "Auditorium doors open 20 minutes prior to screening time. Please present this QR code at the concierge gate.",
    pageWidth / 2,
    279,
    { align: "center" }
  );
  doc.text(
    "Astor Film Hall LLC · Ticket cancellations accepted up to 2 hours prior to showtime.",
    pageWidth / 2,
    284,
    { align: "center" }
  );

  doc.save(`Astor-Receipt-${booking.bookingRef}.pdf`);
}
