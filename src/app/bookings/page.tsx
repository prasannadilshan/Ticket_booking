"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCinema } from "@/context/CinemaContext";
import { downloadBookingPdf } from "@/lib/pdfReceipt";
import {
  formatCurrency,
  formatReadableDate,
  getCardNetworkLabel,
} from "@/lib/cardUtils";
import {
  DownloadDocIcon,
  SunBoostIcon,
  TicketStubIcon,
} from "@/components/icons/CinemaIcons";
import { QrCodeDisplay } from "@/components/QrCodeDisplay";
import type { BookingRecord } from "@/types/cinema";

export default function BookingsPage() {
  const { bookings, cancelBooking, notify } = useCinema();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeQrBooking, setActiveQrBooking] = useState<BookingRecord | null>(null);
  const [boostQr, setBoostQr] = useState(false);

  const handleDownload = async (booking: BookingRecord) => {
    setDownloadingId(booking.id);
    try {
      await downloadBookingPdf(booking);
      notify(`Downloaded PDF receipt for ${booking.bookingRef}`, "success");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA]">
            Digital Ticket Wallet
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
            My Tickets & PDF Receipts
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#A1A1AA]">
            Present QR passes at the cinema gate or download itemized PDF tax receipts anytime.
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto rounded-xl bg-[#DC2626] px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#EF4444]"
        >
          Book Another Screening
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-10 rounded-xl border border-white/10 bg-[#111114] p-12 text-center">
          <TicketStubIcon className="mx-auto h-10 w-10 text-[#DC2626]" />
          <h2 className="mt-4 text-lg font-bold text-white">No Tickets Reserved Yet</h2>
          <p className="mt-1 text-xs text-[#A1A1AA]">
            Explore today&apos;s screenings and reserve your seats to unlock QR passes and PDF receipts.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#09090B]"
          >
            Browse Films
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === "confirmed";
            return (
              <article
                key={booking.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#111114] transition-colors hover:border-white/25"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Film & Booking Metadata */}
                  <div className="p-5 sm:p-6 lg:col-span-8">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative h-32 w-22 shrink-0 overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={booking.film.posterUrl}
                          alt={booking.film.title}
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-white">
                            {booking.bookingRef}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                              isConfirmed
                                ? "bg-white text-[#09090B]"
                                : "bg-[#DC2626] text-white"
                            }`}
                          >
                            {isConfirmed ? "Confirmed · Paid" : "Cancelled · Refunded"}
                          </span>
                        </div>

                        <h2 className="mt-1.5 text-xl font-bold text-white">
                          {booking.film.title}
                        </h2>
                        <p className="mt-0.5 text-xs text-[#D4D4D8]">
                          {booking.hall.name} · {booking.showtime.screenName} · {booking.showtime.format}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                          <div>
                            <span className="block text-[10px] uppercase text-[#71717A]">Date</span>
                            <span className="font-semibold text-white">
                              {formatReadableDate(booking.showtime.dateIso)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-[#71717A]">Time</span>
                            <span className="font-mono font-bold text-white">
                              {booking.showtime.timeLabel}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-[#71717A]">Seats</span>
                            <span className="font-mono font-bold text-white">
                              {booking.seats.map((s) => s.id).join(", ")}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-[#71717A]">Paid</span>
                            <span className="font-mono font-semibold text-white">
                              {formatCurrency(booking.totalPaid)} (
                              {booking.payment.method === "card"
                                ? `${getCardNetworkLabel(booking.payment.cardNetwork)} ••${booking.payment.last4}`
                                : booking.payment.method === "apple_pay"
                                ? "Apple Pay"
                                : "Google Pay"}
                              )
                            </span>
                          </div>
                        </div>

                        {booking.concessions.length > 0 && (
                          <p className="mt-3 text-xs text-[#A1A1AA]">
                            <strong className="text-[#E4E4E7]">Concessions:</strong>{" "}
                            {booking.concessions
                              .map((c) => `${c.quantity}× ${c.item.name}`)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions Panel */}
                  <div className="flex flex-col justify-between gap-3 border-t border-white/[0.08] bg-[#0B0B0D] p-5 lg:col-span-4 lg:border-l lg:border-t-0">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        disabled={downloadingId === booking.id}
                        onClick={() => handleDownload(booking)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#EF4444] transition-colors disabled:opacity-60 cursor-pointer"
                      >
                        <DownloadDocIcon className="w-4 h-4" />
                        <span>
                          {downloadingId === booking.id
                            ? "Building PDF..."
                            : "Download PDF Receipt"}
                        </span>
                      </button>

                      {isConfirmed && (
                        <button
                          type="button"
                          onClick={() => {
                            setBoostQr(false);
                            setActiveQrBooking(booking);
                          }}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#18181D] px-4 py-2.5 text-xs font-semibold text-white hover:border-[#DC2626] cursor-pointer"
                        >
                          <TicketStubIcon className="w-4 h-4 text-[#DC2626]" />
                          <span>Show Gate QR Pass</span>
                        </button>
                      )}
                    </div>

                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => cancelBooking(booking.id)}
                        className="text-center text-[11px] font-medium text-[#A1A1AA] hover:text-white underline cursor-pointer"
                      >
                        Cancel Booking & Request Card Refund
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* QR Pass Modal */}
      {activeQrBooking && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Digital QR Ticket Pass"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#111114] p-6 text-center shadow-2xl">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA]">
              Astor Turnstile Admission
            </span>
            <h3 className="mt-1 text-lg font-bold text-white">
              {activeQrBooking.film.title}
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              {activeQrBooking.hall.shortName} · {activeQrBooking.showtime.timeLabel} · Seats{" "}
              <span className="font-mono text-white">
                {activeQrBooking.seats.map((s) => s.id).join(", ")}
              </span>
            </p>

            <div className="my-5 flex justify-center">
              <QrCodeDisplay
                payload={activeQrBooking.qrPayload}
                size={180}
                boosted={boostQr}
              />
            </div>

            <p className="font-mono text-sm font-bold text-white">
              {activeQrBooking.bookingRef}
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setBoostQr((b) => !b)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-[#18181D] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <SunBoostIcon className="w-4 h-4 text-[#DC2626]" />
                <span>{boostQr ? "Normal Brightness" : "Boost Lobby Brightness"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveQrBooking(null)}
                className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#09090B] cursor-pointer"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
