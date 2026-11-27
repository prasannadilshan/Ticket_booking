"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BookingRecord } from "@/types/cinema";
import {
  formatCurrency,
  formatDuration,
  formatReadableDate,
  getCardNetworkLabel,
} from "@/lib/cardUtils";
import { downloadBookingPdf } from "@/lib/pdfReceipt";
import {
  CheckMarkIcon,
  DownloadDocIcon,
  PrinterIcon,
  SunBoostIcon,
  TicketStubIcon,
} from "@/components/icons/CinemaIcons";
import { QrCodeDisplay } from "@/components/QrCodeDisplay";

export function ConfirmationStep({ booking }: { booking: BookingRecord }) {
  const [downloading, setDownloading] = useState(false);
  const [boostQr, setBoostQr] = useState(false);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await downloadBookingPdf(booking);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Success Banner */}
      <div className="no-print flex flex-col gap-4 rounded-xl border border-white/15 bg-[#111114] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DC2626] text-white">
            <CheckMarkIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Booking Confirmed · {booking.bookingRef}
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-white">
              Your Seats & PDF Receipt Are Ready
            </h2>
            <p className="mt-1 text-xs text-[#D4D4D8]">
              Confirmation prepared for {booking.customerName} ({booking.customerEmail}).
              {booking.pointsEarned > 0 && ` Earned +${booking.pointsEarned} Astor Pass pts.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#EF4444] transition-colors disabled:opacity-60 cursor-pointer"
          >
            <DownloadDocIcon className="w-4 h-4" />
            <span>{downloading ? "Generating PDF..." : "Download PDF Receipt"}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#18181D] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:border-white/30 cursor-pointer"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Digital Boarding Pass + QR Stub */}
      <div className="overflow-hidden rounded-xl border border-white/12 bg-[#111114] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="p-6 sm:p-8 lg:col-span-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={booking.film.posterUrl}
                  alt={booking.film.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-[#09090B]">
                    {booking.showtime.format}
                  </span>
                  <span className="rounded bg-white/[0.08] px-2 py-0.5 font-mono text-[11px] text-white">
                    {booking.film.rating} · {formatDuration(booking.film.durationMins)}
                  </span>
                </div>

                <h3 className="mt-2 text-2xl font-extrabold text-white">
                  {booking.film.title}
                </h3>
                <p className="mt-1 text-sm text-[#D4D4D8]">{booking.hall.name}</p>
                <p className="text-xs text-[#A1A1AA]">{booking.hall.address}</p>

                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 border-t border-white/[0.08] pt-4">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                      Date
                    </span>
                    <span className="mt-0.5 block text-xs sm:text-sm font-semibold text-white">
                      {formatReadableDate(booking.showtime.dateIso)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                      Showtime
                    </span>
                    <span className="mt-0.5 block font-mono text-sm font-bold text-white">
                      {booking.showtime.timeLabel} hrs
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                      Auditorium
                    </span>
                    <span className="mt-0.5 block text-xs sm:text-sm font-semibold text-white">
                      {booking.showtime.screenName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reserved Seats Pill Bar */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#09090B] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                  Reserved Seats ({booking.seats.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {booking.seats.map((seat) => (
                    <span
                      key={seat.id}
                      className="rounded-md bg-white px-2.5 py-1 font-mono text-xs font-bold text-[#09090B]"
                    >
                      {seat.id}
                    </span>
                  ))}
                </div>
              </div>

              {booking.concessions.length > 0 && (
                <div className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-[#D4D4D8]">
                  <span className="font-semibold text-white">
                    Concessions ({booking.deliveryMode === "in_seat" ? "In-Seat Delivery" : "Express Counter"}):{" "}
                  </span>
                  {booking.concessions
                    .map(
                      (c) =>
                        `${c.quantity}× ${c.item.name}${
                          c.selectedFlavor ? ` (${c.selectedFlavor})` : ""
                        }`
                    )
                    .join(", ")}
                </div>
              )}
            </div>

            {/* Tax Receipt Breakdown */}
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-3">
                <span className="font-semibold uppercase tracking-wider text-white">
                  Payment Receipt Summary
                </span>
                <span className="font-mono">
                  {booking.payment.method === "card"
                    ? `${getCardNetworkLabel(booking.payment.cardNetwork)} •••• ${booking.payment.last4}`
                    : booking.payment.method === "apple_pay"
                    ? `Apple Pay •••• ${booking.payment.last4}`
                    : `Google Pay •••• ${booking.payment.last4}`}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#D4D4D8]">
                  <span>Tickets ({booking.seats.length})</span>
                  <span className="font-mono">{formatCurrency(booking.ticketsSubtotal)}</span>
                </div>
                {booking.concessionsSubtotal > 0 && (
                  <div className="flex justify-between text-[#D4D4D8]">
                    <span>Concessions</span>
                    <span className="font-mono">{formatCurrency(booking.concessionsSubtotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Convenience & Box Office Fee</span>
                  <span className="font-mono">{formatCurrency(booking.bookingFee)}</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-white">
                    <span>
                      Discount {booking.promoApplied ? `(${booking.promoApplied})` : "(Loyalty)"}
                    </span>
                    <span className="font-mono">-{formatCurrency(booking.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Entertainment & Sales Tax (8.875%)</span>
                  <span className="font-mono">{formatCurrency(booking.taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                  <span>Total Charged</span>
                  <span className="font-mono text-white">
                    {formatCurrency(booking.totalPaid)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Perforated QR Stub */}
          <div className="flex flex-col items-center justify-center border-t border-dashed border-white/15 bg-[#0C0C0F] p-6 sm:p-8 lg:col-span-4 lg:border-l lg:border-t-0">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#A1A1AA]">
              Scan at Turnstile
            </span>

            <div className="mt-4">
              <QrCodeDisplay payload={booking.qrPayload} size={160} boosted={boostQr} />
            </div>

            <p className="mt-4 font-mono text-sm font-bold tracking-wider text-white">
              {booking.bookingRef}
            </p>
            <p className="mt-1 font-mono text-[10px] text-[#71717A]">
              Auth {booking.payment.authCode} · {booking.payment.transactionId}
            </p>

            <button
              type="button"
              onClick={() => setBoostQr((b) => !b)}
              className="no-print mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#18181D] px-3 py-1.5 text-xs font-medium text-white hover:border-[#DC2626] cursor-pointer"
            >
              <SunBoostIcon className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>{boostQr ? "Normal Brightness" : "Lobby Brightness Boost"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Next Navigation Actions */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#18181D] px-5 py-3 text-sm font-semibold text-white hover:border-[#DC2626]"
        >
          <TicketStubIcon className="w-4 h-4 text-[#DC2626]" />
          <span>Open My Tickets Wallet</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#09090B] hover:bg-[#F4F4F5]"
        >
          <span>Browse More Screenings</span>
        </Link>
      </div>
    </div>
  );
}
