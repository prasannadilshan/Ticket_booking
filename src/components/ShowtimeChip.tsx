import React from "react";
import Link from "next/link";
import type { Showtime } from "@/types/cinema";
import { formatCurrency } from "@/lib/cardUtils";

interface ShowtimeChipProps {
  showtime: Showtime;
  compact?: boolean;
}

export function ShowtimeChip({ showtime, compact = false }: ShowtimeChipProps) {
  const statusColor =
    showtime.availability === "almost_full"
      ? "bg-[#DC2626]"
      : showtime.availability === "filling_fast"
      ? "bg-[#A1A1AA]"
      : "bg-white";

  const statusText =
    showtime.availability === "almost_full"
      ? `${showtime.seatsRemaining} left`
      : showtime.availability === "filling_fast"
      ? "Filling"
      : "Open";

  if (compact) {
    return (
      <Link
        href={`/book/${showtime.id}`}
        className="flex flex-col justify-between rounded-lg border border-white/12 bg-[#141418] px-2.5 py-2 transition-colors hover:border-white hover:bg-[#1C1C22]"
      >
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono text-xs font-bold tabular-nums text-white">
            {showtime.timeLabel}
          </span>
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusColor}`}
            title={statusText}
          />
        </div>
        <div className="mt-1 flex items-center justify-between gap-1 text-[10px] text-[#A1A1AA]">
          <span className="hidden sm:inline truncate">{showtime.format}</span>
          <span className="font-mono tabular-nums text-[#E4E4E7] sm:ml-auto">
            {formatCurrency(showtime.basePrice)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/book/${showtime.id}`}
      className="group flex flex-col justify-between rounded-lg border border-white/12 bg-[#141418] px-3.5 py-2.5 transition-colors hover:border-white hover:bg-[#1C1C22]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-bold tabular-nums text-white">
          {showtime.timeLabel}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#A1A1AA]">
          <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
          <span>{statusText}</span>
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
        <span className="truncate font-medium text-[#D4D4D8]">{showtime.format}</span>
        <span className="font-mono tabular-nums text-[#A1A1AA] shrink-0">
          {formatCurrency(showtime.basePrice)}
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between border-t border-white/[0.06] pt-1.5 text-[10px] text-[#71717A]">
        <span className="truncate">{showtime.screenName}</span>
        {showtime.languageTag !== "Original Audio" && (
          <span className="text-white shrink-0 ml-1">{showtime.languageTag}</span>
        )}
      </div>
    </Link>
  );
}
