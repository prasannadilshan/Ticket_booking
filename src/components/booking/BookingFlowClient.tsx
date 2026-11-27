"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCinema } from "@/context/CinemaContext";
import {
  PROMO_CODES,
  buildSeatMapForShowtime,
  findBestAvailableSeats,
} from "@/data/cinemaData";
import type {
  BookingRecord,
  CinemaHall,
  ConcessionItem,
  DeliveryMode,
  Film,
  PaymentSummary,
  Seat,
  SelectedConcession,
  Showtime,
} from "@/types/cinema";
import { formatCurrency, formatDuration, formatReadableDate } from "@/lib/cardUtils";
import {
  ArrowLeftIcon,
  CheckMarkIcon,
  ClockLineIcon,
} from "@/components/icons/CinemaIcons";
import { SeatMapStep } from "@/components/booking/SeatMapStep";
import { ConcessionsStep } from "@/components/booking/ConcessionsStep";
import { CardPaymentStep } from "@/components/booking/CardPaymentStep";
import { ConfirmationStep } from "@/components/booking/ConfirmationStep";

interface BookingFlowClientProps {
  showtime: Showtime;
  film: Film;
  hall: CinemaHall;
}

export function BookingFlowClient({ showtime, film, hall }: BookingFlowClientProps) {
  const { user, addBooking, getExtraOccupiedSeats, notify } = useCinema();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedConcessions, setSelectedConcessions] = useState<SelectedConcession[]>([]);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("express_counter");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [holdSeconds, setHoldSeconds] = useState(480);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const extraOccupied = useMemo(
    () => getExtraOccupiedSeats(showtime.id),
    [getExtraOccupiedSeats, showtime.id]
  );

  const seatRows = useMemo(
    () => buildSeatMapForShowtime(showtime, extraOccupied),
    [extraOccupied, showtime]
  );

  // Seat Hold Countdown Timer (8:00 minutes)
  useEffect(() => {
    if (selectedSeats.length === 0 || step === 4) {
      return;
    }
    const timer = setInterval(() => {
      setHoldSeconds((prev) => {
        if (prev <= 1) {
          setSelectedSeats([]);
          setStep(1);
          notify("Seat reservation hold expired. Please re-select your seats.", "warning");
          return 480;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [notify, selectedSeats.length, step]);

  const handleToggleSeat = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        const next = prev.filter((s) => s.id !== seat.id);
        if (next.length === 0) setHoldSeconds(480);
        return next;
      }
      if (prev.length >= 8) {
        notify("Maximum 8 seats allowed per single transaction.", "warning");
        return prev;
      }
      if (prev.length === 0) setHoldSeconds(480);
      const next = [...prev, seat];
      if (next.some((s) => s.tier === "vip_recliner")) {
        setDeliveryMode("in_seat");
      }
      return next;
    });
  };

  const handleQuickPickCount = (count: number) => {
    const best = findBestAvailableSeats(seatRows, count);
    if (best.length === 0) {
      notify("Not enough contiguous seats left for this screening.", "warning");
      return;
    }
    setSelectedSeats(best);
    setHoldSeconds(480);
    if (best.some((s) => s.tier === "vip_recliner")) {
      setDeliveryMode("in_seat");
    }
  };

  const handleUpdateConcession = (item: ConcessionItem, delta: number, flavor?: string) => {
    setSelectedConcessions((prev) => {
      const idx = prev.findIndex((c) => c.item.id === item.id);
      if (idx === -1) {
        if (delta <= 0) return prev;
        return [...prev, { item, quantity: delta, selectedFlavor: flavor }];
      }
      const nextQty = prev[idx].quantity + delta;
      if (nextQty <= 0) {
        return prev.filter((c) => c.item.id !== item.id);
      }
      return prev.map((c, i) =>
        i === idx
          ? { ...c, quantity: nextQty, selectedFlavor: flavor ?? c.selectedFlavor }
          : c
      );
    });
  };

  const handleChangeFlavor = (itemId: string, flavor: string) => {
    setSelectedConcessions((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, selectedFlavor: flavor } : c))
    );
  };

  // Pricing Breakdown
  const ticketsSubtotal = useMemo(
    () => Number(selectedSeats.reduce((sum, s) => sum + s.price, 0).toFixed(2)),
    [selectedSeats]
  );

  const concessionsSubtotal = useMemo(
    () =>
      Number(
        selectedConcessions.reduce((sum, c) => sum + c.item.price * c.quantity, 0).toFixed(2)
      ),
    [selectedConcessions]
  );

  const perTicketFee = user?.tier === "Noir Member" ? 0 : user?.tier === "Gold" ? 0.95 : 1.95;
  const bookingFee = Number((selectedSeats.length * perTicketFee).toFixed(2));

  const appliedPromoRule = useMemo(() => {
    if (!promoCode) return null;
    const rule = PROMO_CODES.find((p) => p.code === promoCode.toUpperCase());
    if (!rule) return null;
    if (rule.minTickets && selectedSeats.length < rule.minTickets) return null;
    return rule;
  }, [promoCode, selectedSeats.length]);

  const promoDiscount = useMemo(() => {
    if (!appliedPromoRule) return 0;
    if (appliedPromoRule.type === "percent_tickets") {
      return Number(((ticketsSubtotal * appliedPromoRule.value) / 100).toFixed(2));
    }
    if (appliedPromoRule.type === "percent_all") {
      return Number(
        (((ticketsSubtotal + concessionsSubtotal) * appliedPromoRule.value) / 100).toFixed(2)
      );
    }
    return appliedPromoRule.value;
  }, [appliedPromoRule, concessionsSubtotal, ticketsSubtotal]);

  const pointsRedeemed = useLoyaltyPoints && user && user.points >= 500 ? 500 : 0;
  const loyaltyDiscount = pointsRedeemed > 0 ? 5.0 : 0;

  const discountAmount = Number(
    Math.min(ticketsSubtotal + concessionsSubtotal, promoDiscount + loyaltyDiscount).toFixed(2)
  );
  const taxableBase = Math.max(0, ticketsSubtotal + concessionsSubtotal - discountAmount);
  const taxAmount = Number((taxableBase * 0.08875).toFixed(2));
  const totalPaid = Number((taxableBase + bookingFee + taxAmount).toFixed(2));

  const handleApplyPromo = (rawCode: string) => {
    const clean = rawCode.trim().toUpperCase();
    if (!clean) {
      setPromoCode("");
      setPromoMessage("");
      return;
    }
    const rule = PROMO_CODES.find((r) => r.code === clean);
    if (!rule) {
      setPromoCode("");
      setPromoMessage("");
      notify(`Promo code "${clean}" is invalid. Try ASTOR15 or VIP20.`, "warning");
      return;
    }
    if (rule.minTickets && selectedSeats.length < rule.minTickets) {
      notify(`${rule.code} requires at least ${rule.minTickets} seats.`, "warning");
      return;
    }
    setPromoCode(rule.code);
    setPromoMessage(`Applied ${rule.code}: ${rule.description}`);
    notify(`Promo ${rule.code} applied`, "success");
  };

  const handleCompletePayment = (
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    payment: PaymentSummary
  ) => {
    const refSuffix = Math.random().toString(36).slice(2, 4).toUpperCase();
    const refNum = Math.floor(1000 + Math.random() * 8999);
    const bookingRef = `AST-${refNum}-${refSuffix}`;

    const record: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingRef,
      createdAtIso: new Date().toISOString(),
      status: "confirmed",
      hall,
      film,
      showtime,
      seats: [...selectedSeats].sort((a, b) => a.id.localeCompare(b.id)),
      concessions: selectedConcessions,
      deliveryMode,
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      ticketsSubtotal,
      concessionsSubtotal,
      bookingFee,
      taxAmount,
      discountAmount,
      pointsRedeemed,
      pointsEarned: user ? Math.round(totalPaid * 10) : 0,
      promoApplied: appliedPromoRule?.code,
      totalPaid,
      payment,
      qrPayload: JSON.stringify({
        ref: bookingRef,
        film: film.id,
        hall: hall.id,
        showtime: showtime.id,
        seats: selectedSeats.map((s) => s.id),
        issued: payment.paidAtIso,
      }),
    };

    addBooking(record);
    setConfirmedBooking(record);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const holdMinutes = String(Math.floor(holdSeconds / 60)).padStart(2, "0");
  const holdRemSec = String(holdSeconds % 60).padStart(2, "0");
  const hasVipSeats = selectedSeats.some((s) => s.tier === "vip_recliner");

  const stepsMeta = [
    { num: 1 as const, label: "Seats" },
    { num: 2 as const, label: "Concessions" },
    { num: 3 as const, label: "Payment" },
    { num: 4 as const, label: "E-Ticket & PDF" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-16">
      {/* Top Booking Header & Stepper */}
      <div className="no-print mb-6 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#111114] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3.5">
          <Link
            href={`/movies/${film.slug}`}
            className="rounded-lg border border-white/15 bg-[#18181D] p-2 text-[#D4D4D8] hover:text-white"
            aria-label="Back to showtimes"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white">{film.title}</h1>
              <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[#09090B]">
                {showtime.format}
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA]">
              {hall.shortName} · {showtime.screenName} · {formatReadableDate(showtime.dateIso)} at{" "}
              <span className="font-mono text-white">{showtime.timeLabel}</span>
            </p>
          </div>
        </div>

        {/* Stepper + Hold Timer */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ol className="flex items-center gap-1.5 sm:gap-2">
            {stepsMeta.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              const canJump = s.num < step && step < 4;
              return (
                <li key={s.num}>
                  <button
                    type="button"
                    disabled={!canJump}
                    onClick={() => canJump && setStep(s.num)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                      isCurrent
                        ? "bg-[#DC2626] text-white"
                        : isDone
                        ? "bg-white text-[#09090B] hover:bg-[#E4E4E7] cursor-pointer"
                        : "bg-[#18181D] text-[#71717A]"
                    }`}
                  >
                    <span className="font-mono">
                      {isDone ? <CheckMarkIcon className="w-3.5 h-3.5" /> : s.num}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          {selectedSeats.length > 0 && step < 4 && (
            <div
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold ${
                holdSeconds <= 90
                  ? "border-[#DC2626] bg-[#DC2626] text-white"
                  : "border-white/20 bg-[#18181D] text-white"
              }`}
              title="Temporary seat reservation timer"
            >
              <ClockLineIcon className="w-3.5 h-3.5" />
              <span>
                Hold {holdMinutes}:{holdRemSec}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      {step === 4 && confirmedBooking ? (
        <ConfirmationStep booking={confirmedBooking} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Active Step Area */}
          <div className="lg:col-span-8">
            {step === 1 && (
              <SeatMapStep
                showtime={showtime}
                rows={seatRows}
                selectedSeats={selectedSeats}
                onToggleSeat={handleToggleSeat}
                onQuickPickCount={handleQuickPickCount}
                onClearSeats={() => setSelectedSeats([])}
              />
            )}

            {step === 2 && (
              <ConcessionsStep
                selectedConcessions={selectedConcessions}
                deliveryMode={deliveryMode}
                hasVipSeats={hasVipSeats}
                onChangeDeliveryMode={setDeliveryMode}
                onUpdateItem={handleUpdateConcession}
                onChangeFlavor={handleChangeFlavor}
                onSkipToCheckout={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <CardPaymentStep
                seatCount={selectedSeats.length}
                totalDue={totalPaid}
                promoCode={promoCode}
                promoMessage={promoMessage}
                useLoyaltyPoints={useLoyaltyPoints}
                onApplyPromo={handleApplyPromo}
                onToggleLoyaltyPoints={setUseLoyaltyPoints}
                onCompletePayment={handleCompletePayment}
              />
            )}
          </div>

          {/* Right Order Summary Sidebar (Desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-xl border border-white/10 bg-[#111114] p-5 sm:p-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={film.posterUrl}
                    alt={film.title}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-white">{film.title}</h2>
                  <p className="text-xs text-[#A1A1AA]">
                    {film.rating} · {formatDuration(film.durationMins)}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-[#D4D4D8]">
                    {showtime.timeLabel} · {showtime.format}
                  </p>
                </div>
              </div>

              {/* Selected Seats */}
              <div className="mt-4 border-b border-white/[0.08] pb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#D4D4D8]">
                    Seats ({selectedSeats.length})
                  </span>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[11px] text-white hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {selectedSeats.length === 0 ? (
                  <p className="mt-2 text-xs text-[#71717A]">
                    Tap seats on the auditorium map to reserve them.
                  </p>
                ) : (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {selectedSeats
                      .slice()
                      .sort((a, b) => a.id.localeCompare(b.id))
                      .map((seat) => (
                        <span
                          key={seat.id}
                          className="rounded-md bg-white px-2 py-0.5 font-mono text-xs font-semibold text-[#09090B]"
                        >
                          {seat.id}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Concessions Summary */}
              {selectedConcessions.length > 0 && (
                <div className="mt-4 border-b border-white/[0.08] pb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-[#D4D4D8]">
                      Concessions ({deliveryMode === "in_seat" ? "In-Seat" : "Express"})
                    </span>
                    {step > 2 && (
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[11px] text-white hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs text-[#A1A1AA]">
                    {selectedConcessions.map((c) => (
                      <div key={c.item.id} className="flex justify-between gap-2">
                        <span className="truncate">
                          {c.quantity}× {c.item.name}
                        </span>
                        <span className="font-mono text-[#E4E4E7]">
                          {formatCurrency(c.item.price * c.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#D4D4D8]">
                  <span>Tickets Subtotal</span>
                  <span className="font-mono">{formatCurrency(ticketsSubtotal)}</span>
                </div>
                {concessionsSubtotal > 0 && (
                  <div className="flex justify-between text-[#D4D4D8]">
                    <span>Concessions</span>
                    <span className="font-mono">{formatCurrency(concessionsSubtotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>
                    Booking Fee{" "}
                    {user && perTicketFee < 1.95 && (
                      <span className="text-white">({user.tier} Perk)</span>
                    )}
                  </span>
                  <span className="font-mono">{formatCurrency(bookingFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Promo & Loyalty Savings</span>
                    <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Estimated Tax (8.875%)</span>
                  <span className="font-mono">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white">
                  <span>Total</span>
                  <span className="font-mono text-white">{formatCurrency(totalPaid)}</span>
                </div>
              </div>

              {/* Desktop Navigation Controls */}
              <div className="mt-6 hidden lg:flex flex-col gap-2.5">
                {step === 1 && (
                  <button
                    type="button"
                    disabled={selectedSeats.length === 0}
                    onClick={() => setStep(2)}
                    className="w-full rounded-xl bg-[#DC2626] px-4 py-3 text-sm font-bold text-white hover:bg-[#EF4444] transition-colors disabled:opacity-45 cursor-pointer"
                  >
                    Continue to Concessions →
                  </button>
                )}

                {step === 2 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-full rounded-xl bg-[#DC2626] px-4 py-3 text-sm font-bold text-white hover:bg-[#EF4444] transition-colors cursor-pointer"
                    >
                      Continue to Card Checkout →
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full rounded-xl border border-white/15 bg-[#18181D] px-4 py-2.5 text-xs font-semibold text-[#D4D4D8] hover:border-white/30 cursor-pointer"
                    >
                      ← Back to Seats
                    </button>
                  </>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full rounded-xl border border-white/15 bg-[#18181D] px-4 py-2.5 text-xs font-semibold text-[#D4D4D8] hover:border-white/30 cursor-pointer"
                  >
                    ← Back to Concessions
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Sticky Mobile Bottom Checkout Bar */}
      {step < 4 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#09090B]/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-[#A1A1AA]">
                {selectedSeats.length === 0
                  ? "Select seats to continue"
                  : `${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""} · ${selectedSeats
                      .map((s) => s.id)
                      .slice(0, 3)
                      .join(", ")}${selectedSeats.length > 3 ? "…" : ""}`}
              </p>
              <p className="font-mono text-base font-bold text-white">
                {formatCurrency(totalPaid)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                  className="rounded-xl border border-white/15 bg-[#18181D] px-3.5 py-2.5 text-xs font-semibold text-white"
                >
                  Back
                </button>
              )}
              {step === 1 && (
                <button
                  type="button"
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep(2)}
                  className="rounded-xl bg-[#DC2626] px-5 py-2.5 text-xs sm:text-sm font-bold text-white disabled:opacity-45"
                >
                  Concessions →
                </button>
              )}
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-xl bg-[#DC2626] px-5 py-2.5 text-xs sm:text-sm font-bold text-white"
                >
                  Checkout →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
