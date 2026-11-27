"use client";

import React, { useState } from "react";
import type { Seat, SeatRow, Showtime } from "@/types/cinema";
import { formatCurrency } from "@/lib/cardUtils";
import {
  AccessibleSeatIcon,
  CinemaSeatGlyph,
  MinusIcon,
  PlusIcon,
} from "@/components/icons/CinemaIcons";

interface SeatMapStepProps {
  showtime: Showtime;
  rows: SeatRow[];
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  onQuickPickCount: (count: number) => void;
  onClearSeats: () => void;
}

export function SeatMapStep({
  showtime,
  rows,
  selectedSeats,
  onToggleSeat,
  onQuickPickCount,
  onClearSeats,
}: SeatMapStepProps) {
  const [zoom, setZoom] = useState<number>(1);
  const selectedIds = new Set(selectedSeats.map((s) => s.id));

  const tierPrices = {
    standard: rows.find((r) => r.tier === "standard")?.seats[2]?.price ?? showtime.basePrice,
    executive: rows.find((r) => r.tier === "executive")?.seats[2]?.price ?? showtime.basePrice + 2.5,
    vip_recliner:
      rows.find((r) => r.tier === "vip_recliner")?.seats[2]?.price ?? showtime.basePrice + 6.5,
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#111114] p-4 sm:p-6 lg:p-7">
      {/* Top Toolbar: Quick Pick & Zoom */}
      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Select Auditorium Seats
          </h2>
          <p className="mt-0.5 text-xs text-[#A1A1AA]">
            Max 8 seats per booking · Tap any available seat or use Best Seats auto-pick.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A] mr-1">
            Best Seats:
          </span>
          {[1, 2, 3, 4, 6].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => onQuickPickCount(count)}
              className={`h-8 min-w-[32px] rounded-lg border px-2.5 font-mono text-xs font-bold transition-colors cursor-pointer ${
                selectedSeats.length === count
                  ? "border-[#DC2626] bg-[#DC2626] text-white"
                  : "border-white/15 bg-[#18181D] text-[#E4E4E7] hover:border-white/30"
              }`}
            >
              {count}
            </button>
          ))}
          {selectedSeats.length > 0 && (
            <button
              type="button"
              onClick={onClearSeats}
              className="ml-1 text-xs font-medium text-[#A1A1AA] hover:text-white underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Legend & Zoom Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A1A1AA]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-white/25 bg-[#18181D]" />
            <span>Standard ({formatCurrency(tierPrices.standard)})</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-white/60 bg-[#202026]" />
            <span>Executive ({formatCurrency(tierPrices.executive)})</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-[#DC2626] bg-[#141418]" />
            <span>VIP Recliner ({formatCurrency(tierPrices.vip_recliner)})</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#DC2626]" />
            <span className="text-white">Selected</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#27272A] opacity-55" />
            <span>Taken</span>
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-white/12 bg-[#16161B] p-1 shrink-0">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.15).toFixed(2))))}
            className="rounded p-1 text-[#A1A1AA] hover:bg-white/[0.08] hover:text-white cursor-pointer"
            aria-label="Zoom out seat map"
          >
            <MinusIcon className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono text-[11px] text-[#D4D4D8]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.3, Number((z + 0.15).toFixed(2))))}
            className="rounded p-1 text-[#A1A1AA] hover:bg-white/[0.08] hover:text-white cursor-pointer"
            aria-label="Zoom in seat map"
          >
            <PlusIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Auditorium Canvas */}
      <div className="mt-6 overflow-x-auto pb-4">
        <div
          className="mx-auto min-w-[600px] max-w-[740px] origin-top transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Minimal Architectural Screen Line */}
          <div className="mb-8 flex flex-col items-center">
            <svg
              viewBox="0 0 560 28"
              className="w-full max-w-[520px]"
              aria-hidden="true"
            >
              <path
                d="M 24 22 Q 280 -2 536 22"
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.65"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
              Screen This Way · {showtime.format}
            </span>
          </div>

          {/* Seat Rows */}
          <div className="space-y-2.5">
            {rows.map((row, rIdx) => {
              const prevTier = rIdx > 0 ? rows[rIdx - 1].tier : null;
              const showTierDivider = prevTier !== row.tier;

              return (
                <React.Fragment key={row.rowLabel}>
                  {showTierDivider && (
                    <div className="flex items-center gap-3 pt-2 pb-1">
                      <div className="h-px flex-1 bg-white/[0.08]" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                        {row.tierLabel} · {formatCurrency(row.seats[2]?.price ?? showtime.basePrice)}
                      </span>
                      <div className="h-px flex-1 bg-white/[0.08]" />
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2">
                    <span className="w-6 text-center font-mono text-xs font-bold text-[#71717A]">
                      {row.rowLabel}
                    </span>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {row.seats.map((seat) => {
                        const isSelected = selectedIds.has(seat.id);
                        const isAisleGap = seat.number === 7;

                        let seatClasses =
                          "border-white/20 bg-[#18181D] text-[#D4D4D8] hover:border-[#DC2626] hover:text-white";
                        if (seat.isOccupied) {
                          seatClasses =
                            "border-white/[0.04] bg-[#141418] text-[#3F3F46] cursor-not-allowed opacity-55";
                        } else if (isSelected) {
                          seatClasses =
                            "border-[#DC2626] bg-[#DC2626] text-white";
                        } else if (seat.tier === "vip_recliner") {
                          seatClasses =
                            "border-[#DC2626] bg-[#141418] text-white hover:bg-[#1E1E24]";
                        } else if (seat.tier === "executive") {
                          seatClasses =
                            "border-white/45 bg-[#202026] text-white hover:border-[#DC2626]";
                        }

                        return (
                          <React.Fragment key={seat.id}>
                            {isAisleGap && <div className="w-4 sm:w-7" aria-hidden="true" />}
                            <button
                              type="button"
                              disabled={seat.isOccupied}
                              onClick={() => onToggleSeat(seat)}
                              title={
                                seat.isOccupied
                                  ? `${seat.id} · Occupied`
                                  : `${seat.id} · ${row.tierLabel} · ${formatCurrency(seat.price)}${
                                      seat.isAccessible ? " (Wheelchair Accessible)" : ""
                                    }${seat.isCompanion ? " (Companion Seat)" : ""}`
                              }
                              aria-label={`Seat ${seat.id}, ${row.tierLabel}, ${formatCurrency(
                                seat.price
                              )}, ${seat.isOccupied ? "occupied" : isSelected ? "selected" : "available"}`}
                              className={`relative flex flex-col items-center justify-center rounded-lg border transition-colors ${
                                seat.tier === "vip_recliner" ? "h-10 w-10 sm:w-11" : "h-9 w-9 sm:w-10"
                              } ${seatClasses} ${!seat.isOccupied ? "cursor-pointer" : ""}`}
                            >
                              {seat.isAccessible ? (
                                <AccessibleSeatIcon className="w-3.5 h-3.5" />
                              ) : (
                                <CinemaSeatGlyph
                                  variant={seat.tier}
                                  className="w-4 h-4 opacity-85"
                                />
                              )}
                              <span className="font-mono text-[9px] font-bold leading-none mt-0.5">
                                {seat.number}
                              </span>
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <span className="w-6 text-center font-mono text-xs font-bold text-[#71717A]">
                      {row.rowLabel}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accessible Seating Note */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.08] bg-[#141418] px-4 py-2.5 text-xs text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <AccessibleSeatIcon className="w-4 h-4 text-[#DC2626] shrink-0" />
          <span>
            Wheelchair bays (A-01, A-12, G-01) and adjacent companion seats (A-02, A-11, G-02) offer step-free elevator entry.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#D4D4D8]">
          {selectedSeats.length}/8 selected
        </span>
      </div>
    </div>
  );
}
