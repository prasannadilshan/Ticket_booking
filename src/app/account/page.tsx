"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCinema } from "@/context/CinemaContext";
import {
  detectCardNetwork,
  formatCardExpiry,
  formatCardNumber,
  getCardNetworkLabel,
  isValidCardExpiry,
  isValidCardLuhn,
} from "@/lib/cardUtils";
import {
  AppleBrandIcon,
  CardNetworkBadge,
  FacebookBrandIcon,
  GitHubBrandIcon,
  GoogleBrandIcon,
  TrashLineIcon,
} from "@/components/icons/CinemaIcons";

export default function AccountPage() {
  const {
    user,
    openAuthModal,
    signInWithSocial,
    signOut,
    addSavedCard,
    removeSavedCard,
    setDefaultCard,
    bookings,
    notify,
  } = useCinema();

  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCardLuhn(cardNumber)) {
      notify("Please enter a valid card number.", "warning");
      return;
    }
    if (!isValidCardExpiry(expiry)) {
      notify("Please enter a valid future MM/YY expiry date.", "warning");
      return;
    }
    const network = detectCardNetwork(cardNumber);
    const digits = cardNumber.replace(/\D/g, "");
    addSavedCard({
      network,
      last4: digits.slice(-4),
      expiry,
      holderName: (holderName || user?.name || "ASTOR MEMBER").toUpperCase(),
      isDefault: false,
    });
    setCardNumber("");
    setHolderName("");
    setExpiry("");
    setShowAddCard(false);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="rounded-xl border border-white/12 bg-[#111114] p-6 sm:p-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA]">
            Astor Film Pass Membership
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
            Sign In with Social Login
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
            Connect Google, Apple, Facebook, or GitHub to save cards, unlock reduced convenience fees,
            and manage your PDF tickets in one place.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => signInWithSocial("google")}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-[#18181D] px-4 py-3 text-sm font-semibold text-white hover:border-white/30 cursor-pointer"
            >
              <GoogleBrandIcon className="w-4 h-4" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => signInWithSocial("apple")}
              className="flex items-center justify-center gap-2.5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#09090B] hover:bg-[#F4F4F5] cursor-pointer"
            >
              <AppleBrandIcon className="w-4 h-4" />
              <span>Apple</span>
            </button>
            <button
              type="button"
              onClick={() => signInWithSocial("facebook")}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-[#18181D] px-4 py-3 text-sm font-semibold text-white hover:border-white/30 cursor-pointer"
            >
              <FacebookBrandIcon className="w-4 h-4" />
              <span>Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => signInWithSocial("github")}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-[#18181D] px-4 py-3 text-sm font-semibold text-white hover:border-white/30 cursor-pointer"
            >
              <GitHubBrandIcon className="w-4 h-4" />
              <span>GitHub</span>
            </button>
          </div>

          <button
            type="button"
            onClick={openAuthModal}
            className="mt-5 text-xs font-semibold text-white hover:underline cursor-pointer"
          >
            Or sign in with email & password →
          </button>
        </div>
      </div>
    );
  }

  const nextTierTarget = user.tier === "Silver" ? 1000 : 2500;
  const progressPct = Math.min(100, Math.round((user.points / nextTierTarget) * 100));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      {/* Member Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#111114] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DC2626] text-lg font-extrabold text-white">
            {user.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#09090B]">
                {user.tier}
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              {user.email} · Connected via{" "}
              <span className="capitalize text-white">{user.provider}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/bookings"
            className="rounded-xl border border-white/15 bg-[#18181D] px-4 py-2 text-xs font-semibold text-white"
          >
            Tickets ({bookings.filter((b) => b.status === "confirmed").length})
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="rounded-xl border border-white/15 bg-[#18181D] px-4 py-2 text-xs font-semibold text-white hover:border-[#DC2626] cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Loyalty Progress */}
      <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
              Astor Loyalty Balance
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-white">
              {user.points.toLocaleString()} pts
            </p>
          </div>
          <span className="text-xs text-[#A1A1AA]">
            500 pts = $5.00 ticket & concession credit
          </span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#1C1C22]">
          <div
            className="h-full rounded-full bg-[#DC2626] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#71717A]">
          {user.tier === "Noir Member"
            ? "Noir tier unlocked: $0 convenience fees on all bookings."
            : `${Math.max(0, nextTierTarget - user.points)} pts until ${
                user.tier === "Silver" ? "Gold ($0.95 fee)" : "Noir Member ($0 fee)"
              }.`}
        </p>
      </div>

      {/* Saved Cards Manager */}
      <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Saved Payment Cards</h2>
            <p className="text-xs text-[#A1A1AA]">
              Manage tokenized cards for 1-click ticket checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddCard((s) => !s)}
            className="rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-bold text-white hover:bg-[#EF4444] cursor-pointer"
          >
            {showAddCard ? "Cancel" : "+ Add Card"}
          </button>
        </div>

        {showAddCard && (
          <form
            onSubmit={handleSaveCard}
            className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-[#16161B] p-4 sm:grid-cols-4"
          >
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="Card Number"
              className="sm:col-span-2 rounded-lg border border-white/12 bg-[#09090B] px-3 py-2 font-mono text-xs text-white"
              required
            />
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatCardExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className="rounded-lg border border-white/12 bg-[#09090B] px-3 py-2 font-mono text-xs text-white"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#09090B] cursor-pointer"
            >
              Save Card
            </button>
            <input
              type="text"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value.toUpperCase())}
              placeholder="Cardholder Name"
              className="sm:col-span-4 rounded-lg border border-white/12 bg-[#09090B] px-3 py-2 font-mono text-xs uppercase text-white"
            />
          </form>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {user.savedCards.map((card) => (
            <div
              key={card.id}
              className={`flex items-center justify-between rounded-xl border p-4 ${
                card.isDefault
                  ? "border-white bg-[#18181D]"
                  : "border-white/10 bg-[#16161B]"
              }`}
            >
              <div className="flex items-center gap-3">
                <CardNetworkBadge network={card.network} className="h-6 w-10" />
                <div>
                  <p className="font-mono text-xs font-bold text-white">
                    {getCardNetworkLabel(card.network)} •••• {card.last4}
                  </p>
                  <p className="font-mono text-[10px] text-[#A1A1AA]">
                    {card.holderName} · Exp {card.expiry}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {card.isDefault ? (
                  <span className="rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#09090B]">
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDefaultCard(card.id)}
                    className="text-[11px] font-semibold text-[#D4D4D8] hover:text-white cursor-pointer"
                  >
                    Set Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeSavedCard(card.id)}
                  className="rounded p-1.5 text-[#A1A1AA] hover:bg-white/[0.06] hover:text-white cursor-pointer"
                  aria-label="Remove card"
                >
                  <TrashLineIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
