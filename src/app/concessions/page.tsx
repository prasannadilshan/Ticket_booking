"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CONCESSIONS } from "@/data/cinemaData";
import type { ConcessionCategory } from "@/types/cinema";
import { formatCurrency } from "@/lib/cardUtils";
import { useCinema } from "@/context/CinemaContext";
import { ConcessionTrayIcon, TicketStubIcon } from "@/components/icons/CinemaIcons";

const CATEGORIES: Array<"All" | ConcessionCategory> = [
  "All",
  "Combos",
  "Popcorn",
  "Drinks",
  "Bites",
];

export default function ConcessionsPage() {
  const { activeHall } = useCinema();
  const [category, setCategory] = useState<"All" | ConcessionCategory>("All");

  const items =
    category === "All"
      ? CONCESSIONS
      : CONCESSIONS.filter((item) => item.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA]">
            <ConcessionTrayIcon className="w-4 h-4 text-[#DC2626]" />
            <span>Kitchen & Bar · {activeHall.shortName}</span>
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
            Cinema Concessions Menu
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#A1A1AA]">
            Add any combo, truffle popcorn, or craft spritz during seat checkout for express pickup or quiet in-seat delivery.
          </p>
        </div>

        <Link
          href="/#schedule"
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-[#DC2626] px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#EF4444]"
        >
          <TicketStubIcon className="w-4 h-4" />
          <span>Pick a Showtime to Order</span>
        </Link>
      </div>

      {/* Category Filter */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              category === cat
                ? "bg-white text-[#09090B]"
                : "bg-[#141418] text-[#A1A1AA] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#111114] p-5"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                    {item.category}
                  </span>
                  <h2 className="mt-0.5 text-base font-bold text-white">{item.name}</h2>
                </div>
                <span className="font-mono text-base font-bold text-white">
                  {formatCurrency(item.price)}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">{item.description}</p>

              {item.flavors && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.flavors.map((flav) => (
                    <span
                      key={flav}
                      className="rounded border border-white/10 bg-[#18181D] px-2 py-0.5 text-[10px] text-[#D4D4D8]"
                    >
                      {flav}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-[11px] text-[#71717A]">
              <span className="font-mono">{item.calories}</span>
              <div className="flex gap-1.5">
                {item.dietaryTags.map((tag) => (
                  <span key={tag} className="text-[#E4E4E7]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
