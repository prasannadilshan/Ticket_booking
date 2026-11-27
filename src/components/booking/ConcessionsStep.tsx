"use client";

import React, { useState } from "react";
import { CONCESSIONS } from "@/data/cinemaData";
import type {
  ConcessionCategory,
  ConcessionItem,
  DeliveryMode,
  SelectedConcession,
} from "@/types/cinema";
import { formatCurrency } from "@/lib/cardUtils";
import {
  ConcessionTrayIcon,
  MinusIcon,
  PlusIcon,
} from "@/components/icons/CinemaIcons";

interface ConcessionsStepProps {
  selectedConcessions: SelectedConcession[];
  deliveryMode: DeliveryMode;
  hasVipSeats: boolean;
  onChangeDeliveryMode: (mode: DeliveryMode) => void;
  onUpdateItem: (item: ConcessionItem, delta: number, flavor?: string) => void;
  onChangeFlavor: (itemId: string, flavor: string) => void;
  onSkipToCheckout: () => void;
}

const CATEGORIES: Array<"All" | ConcessionCategory> = [
  "All",
  "Combos",
  "Popcorn",
  "Drinks",
  "Bites",
];

export function ConcessionsStep({
  selectedConcessions,
  deliveryMode,
  hasVipSeats,
  onChangeDeliveryMode,
  onUpdateItem,
  onChangeFlavor,
  onSkipToCheckout,
}: ConcessionsStepProps) {
  const [category, setCategory] = useState<"All" | ConcessionCategory>("All");
  const [pendingFlavors, setPendingFlavors] = useState<Record<string, string>>({});

  const visibleItems =
    category === "All"
      ? CONCESSIONS
      : CONCESSIONS.filter((item) => item.category === category);

  const selectedMap = new Map(selectedConcessions.map((c) => [c.item.id, c]));

  return (
    <div className="rounded-xl border border-white/10 bg-[#111114] p-4 sm:p-6 lg:p-7">
      <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
            <ConcessionTrayIcon className="w-4 h-4 text-[#DC2626]" />
            <span>Optional Pre-Order</span>
          </div>
          <h2 className="mt-1 text-lg sm:text-xl font-bold text-white">
            Cinema Concessions & Lounge Bites
          </h2>
          <p className="mt-0.5 text-xs text-[#A1A1AA]">
            Skip the lobby line—pre-order fresh popcorn, cold-pressed spritzes, or warm bites.
          </p>
        </div>

        <button
          type="button"
          onClick={onSkipToCheckout}
          className="self-start sm:self-auto rounded-lg border border-white/15 bg-[#18181D] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#DC2626] cursor-pointer"
        >
          Skip Snacks & Pay →
        </button>
      </div>

      {/* Pickup vs In-Seat Delivery Selector */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChangeDeliveryMode("express_counter")}
          className={`rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
            deliveryMode === "express_counter"
              ? "border-white bg-[#18181D]"
              : "border-white/10 bg-[#16161B] hover:border-white/25"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">Express Counter Pickup</span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase font-semibold ${
                deliveryMode === "express_counter"
                  ? "bg-white text-[#09090B]"
                  : "text-[#A1A1AA]"
              }`}
            >
              {deliveryMode === "express_counter" ? "Selected" : "Free"}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A1A1AA]">
            Scan your ticket QR at Express Counter A when arriving in the lobby.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onChangeDeliveryMode("in_seat")}
          className={`rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
            deliveryMode === "in_seat"
              ? "border-white bg-[#18181D]"
              : "border-white/10 bg-[#16161B] hover:border-white/25"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">Quiet In-Seat Delivery</span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase font-semibold ${
                deliveryMode === "in_seat"
                  ? "bg-white text-[#09090B]"
                  : "text-white"
              }`}
            >
              {hasVipSeats ? "VIP Included" : "Courtesy"}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A1A1AA]">
            Delivered silently to your reserved seat 10 minutes before the feature starts.
          </p>
        </button>
      </div>

      {/* Category Filter */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              category === cat
                ? "bg-white text-[#09090B]"
                : "bg-[#18181D] text-[#A1A1AA] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {visibleItems.map((item) => {
          const entry = selectedMap.get(item.id);
          const qty = entry?.quantity ?? 0;
          const activeFlavor =
            entry?.selectedFlavor ?? pendingFlavors[item.id] ?? item.flavors?.[0];

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-xl border p-4 transition-colors ${
                qty > 0
                  ? "border-white bg-[#18181D]"
                  : "border-white/10 bg-[#141418]"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#09090B]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-sm sm:text-base font-bold text-white">
                      {item.name}
                    </h3>
                  </div>
                  <span className="font-mono text-sm font-bold text-white shrink-0">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-[#A1A1AA]">
                  {item.description}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#71717A]">{item.calories}</span>
                  {item.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-[#D4D4D8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Flavor Choices */}
                {item.flavors && item.flavors.length > 0 && (
                  <div className="mt-3">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717A] mb-1.5">
                      Seasoning / Style
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.flavors.map((flav) => {
                        const isChosen = activeFlavor === flav;
                        return (
                          <button
                            key={flav}
                            type="button"
                            onClick={() => {
                              setPendingFlavors((p) => ({ ...p, [item.id]: flav }));
                              if (qty > 0) onChangeFlavor(item.id, flav);
                            }}
                            className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                              isChosen
                                ? "border-white bg-white text-[#09090B]"
                                : "border-white/10 bg-[#0B0B0D] text-[#A1A1AA] hover:text-white"
                            }`}
                          >
                            {flav}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center justify-end border-t border-white/[0.08] pt-3">
                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={() => onUpdateItem(item, 1, activeFlavor)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#18181D] px-3.5 py-1.5 text-xs font-semibold text-white hover:border-[#DC2626] cursor-pointer"
                  >
                    <PlusIcon className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Add Item</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-white/30 bg-[#0B0B0D] px-2 py-1">
                    <button
                      type="button"
                      onClick={() => onUpdateItem(item, -1, activeFlavor)}
                      className="rounded p-1 text-white hover:bg-white/[0.1] cursor-pointer"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className="min-w-[20px] text-center font-mono text-xs font-bold text-white">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateItem(item, 1, activeFlavor)}
                      className="rounded p-1 text-white hover:bg-white/[0.1] cursor-pointer"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
