"use client";

import React, { useState } from "react";
import { useCinema } from "@/context/CinemaContext";
import { PROMO_CODES } from "@/data/cinemaData";
import type { PaymentSummary } from "@/types/cinema";
import {
  detectCardNetwork,
  formatCardExpiry,
  formatCardNumber,
  formatCurrency,
  getCardNetworkLabel,
  isValidCardExpiry,
  isValidCardLuhn,
} from "@/lib/cardUtils";
import {
  AppleBrandIcon,
  CardChipIcon,
  CardNetworkBadge,
  CheckMarkIcon,
  FacebookBrandIcon,
  GitHubBrandIcon,
  GoogleBrandIcon,
  LockShieldIcon,
} from "@/components/icons/CinemaIcons";

interface CardPaymentStepProps {
  seatCount: number;
  totalDue: number;
  promoCode: string;
  promoMessage: string;
  useLoyaltyPoints: boolean;
  onApplyPromo: (code: string) => void;
  onToggleLoyaltyPoints: (use: boolean) => void;
  onCompletePayment: (
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    payment: PaymentSummary
  ) => void;
}

export function CardPaymentStep({
  seatCount,
  totalDue,
  promoCode,
  promoMessage,
  useLoyaltyPoints,
  onApplyPromo,
  onToggleLoyaltyPoints,
  onCompletePayment,
}: CardPaymentStepProps) {
  const { user, signInWithSocial, addSavedCard } = useCinema();

  const [guestName, setGuestName] = useState(user?.name ?? "");
  const [guestEmail, setGuestEmail] = useState(user?.email ?? "");
  const [guestPhone, setGuestPhone] = useState(user?.phone ?? "");

  const [promoInput, setPromoInput] = useState(promoCode);
  const [paymentTab, setPaymentTab] = useState<"card" | "apple_pay" | "google_pay">("card");

  const defaultSaved = user?.savedCards.find((c) => c.isDefault) ?? user?.savedCards[0];
  const [selectedSavedCardId, setSelectedSavedCardId] = useState<string>(
    defaultSaved ? defaultSaved.id : "new"
  );

  // New Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(user?.name?.toUpperCase() ?? "");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [saveCardToAccount, setSaveCardToAccount] = useState(true);
  const [cvcFocused, setCvcFocused] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const effectiveName = user ? user.name : guestName;
  const effectiveEmail = user ? user.email : guestEmail;
  const detectedNetwork = detectCardNetwork(cardNumber);
  const usingSavedCard =
    paymentTab === "card" && Boolean(user) && selectedSavedCardId !== "new";
  const activeSavedCard = user?.savedCards.find((c) => c.id === selectedSavedCardId);

  const fillDemoCard = () => {
    setSelectedSavedCardId("new");
    setCardNumber("4242 4242 4242 4242");
    setCardHolder((effectiveName || "ELENA VANCE").toUpperCase());
    setExpiry("08/29");
    setCvc("482");
    setBillingZip("10013");
    setErrors([]);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!effectiveName.trim()) {
      validationErrors.push("Please enter your full name for the ticket & PDF receipt.");
    }
    if (!effectiveEmail.trim() || !effectiveEmail.includes("@")) {
      validationErrors.push("Please provide a valid email address.");
    }

    if (paymentTab === "card" && !usingSavedCard) {
      if (!isValidCardLuhn(cardNumber)) {
        validationErrors.push("Card number failed Luhn check. Enter a valid card or click Fill Test Visa.");
      }
      if (!cardHolder.trim()) {
        validationErrors.push("Cardholder name is required.");
      }
      if (!isValidCardExpiry(expiry)) {
        validationErrors.push("Card expiration must be a valid future MM/YY date.");
      }
      const requiredCvcLen = detectedNetwork === "amex" ? 4 : 3;
      if (cvc.replace(/\D/g, "").length !== requiredCvcLen) {
        validationErrors.push(`Security code (CVC) must be ${requiredCvcLen} digits.`);
      }
      if (billingZip.trim().length < 3) {
        validationErrors.push("Billing postal/ZIP code is required.");
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setProcessing(true);

    setTimeout(() => {
      const digits = cardNumber.replace(/\D/g, "");
      const last4 =
        paymentTab === "apple_pay"
          ? "8841"
          : paymentTab === "google_pay"
          ? "5519"
          : usingSavedCard && activeSavedCard
          ? activeSavedCard.last4
          : digits.slice(-4);

      const network =
        usingSavedCard && activeSavedCard ? activeSavedCard.network : detectedNetwork;

      if (paymentTab === "card" && !usingSavedCard && user && saveCardToAccount) {
        addSavedCard({
          network,
          last4,
          expiry,
          holderName: cardHolder.toUpperCase(),
          isDefault: user.savedCards.length === 0,
        });
      }

      const authCode = `AUTH${Math.floor(10000 + Math.random() * 89999)}`;
      const txId = `TXN-${Math.floor(1000000 + Math.random() * 8999999)}-${
        paymentTab === "card" ? network.slice(0, 2).toUpperCase() : "WL"
      }`;

      setProcessing(false);
      onCompletePayment(
        effectiveName.trim(),
        effectiveEmail.trim(),
        guestPhone.trim(),
        {
          method: paymentTab,
          cardNetwork: paymentTab === "card" ? network : undefined,
          last4,
          holderName:
            paymentTab === "card"
              ? usingSavedCard && activeSavedCard
                ? activeSavedCard.holderName
                : cardHolder.toUpperCase()
              : effectiveName.toUpperCase(),
          authCode,
          transactionId: txId,
          paidAtIso: new Date().toISOString(),
        }
      );
    }, 950);
  };

  return (
    <form onSubmit={handlePaySubmit} className="space-y-6">
      {/* 1. Member Social Sign-In OR Guest Contact */}
      <div className="rounded-xl border border-white/10 bg-[#111114] p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              1. Ticket Delivery & Member Pass
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              {user
                ? "Signed in — your booking earns Astor Pass loyalty points."
                : "Sign in instantly with a social account or continue as guest."}
            </p>
          </div>
          {user && (
            <span className="self-start rounded-full bg-white px-3 py-1 font-mono text-xs font-semibold text-[#09090B]">
              {user.tier} · {user.points.toLocaleString()} pts
            </span>
          )}
        </div>

        {!user ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => signInWithSocial("google")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#18181D] px-3 py-2.5 text-xs font-semibold text-white hover:border-white/30 cursor-pointer"
              >
                <GoogleBrandIcon className="w-4 h-4" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => signInWithSocial("apple")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white px-3 py-2.5 text-xs font-semibold text-[#09090B] hover:bg-[#F4F4F5] cursor-pointer"
              >
                <AppleBrandIcon className="w-4 h-4" />
                <span>Apple</span>
              </button>
              <button
                type="button"
                onClick={() => signInWithSocial("facebook")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#18181D] px-3 py-2.5 text-xs font-semibold text-white hover:border-white/30 cursor-pointer"
              >
                <FacebookBrandIcon className="w-4 h-4" />
                <span>Facebook</span>
              </button>
              <button
                type="button"
                onClick={() => signInWithSocial("github")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#18181D] px-3 py-2.5 text-xs font-semibold text-white hover:border-white/30 cursor-pointer"
              >
                <GitHubBrandIcon className="w-4 h-4" />
                <span>GitHub</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-[11px] uppercase tracking-wider text-[#71717A]">
                or guest receipt details
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
                  Receipt Email
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
                  Mobile (optional)
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+1 212 555 0140"
                  className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/[0.08] bg-[#16161B] p-3.5">
            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-[#A1A1AA]">
                PDF receipt & QR ticket linked to <span className="text-white">{user.email}</span>
              </p>
            </div>
            {user.points >= 500 && (
              <label className="flex items-center gap-2.5 rounded-lg border border-white/25 bg-[#111114] px-3 py-2 text-xs font-semibold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLoyaltyPoints}
                  onChange={(e) => onToggleLoyaltyPoints(e.target.checked)}
                  className="accent-[#DC2626]"
                />
                <span>Redeem 500 pts (-$5.00)</span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* 2. Offers & Promo Codes */}
      <div className="rounded-xl border border-white/10 bg-[#111114] p-5 sm:p-6">
        <h2 className="text-base font-bold text-white">2. Promo Code & Offers</h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
            placeholder="Enter promo code (e.g. ASTOR15)"
            className="flex-1 rounded-lg border border-white/12 bg-[#09090B] px-3.5 py-2.5 font-mono text-sm uppercase text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onApplyPromo(promoInput)}
            className="rounded-lg border border-white/15 bg-[#18181D] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:border-[#DC2626] cursor-pointer"
          >
            Apply Code
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-[#71717A]">Available offers:</span>
          {PROMO_CODES.map((rule) => (
            <button
              key={rule.code}
              type="button"
              disabled={Boolean(rule.minTickets && seatCount < rule.minTickets)}
              onClick={() => {
                setPromoInput(rule.code);
                onApplyPromo(rule.code);
              }}
              className="rounded-md bg-white px-2 py-1 font-mono font-semibold text-[#09090B] hover:bg-[#E4E4E7] disabled:opacity-40 cursor-pointer"
              title={rule.description}
            >
              {rule.code}
            </button>
          ))}
        </div>

        {promoMessage && (
          <p className="mt-2 text-xs text-white font-medium">{promoMessage}</p>
        )}
      </div>

      {/* 3. Card Payment Options */}
      <div className="rounded-xl border border-white/10 bg-[#111114] p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardChipIcon className="w-5 h-5 text-[#DC2626]" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              3. Card Payment & Digital Wallets
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#A1A1AA]">
            <LockShieldIcon className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>256-bit TLS · Luhn Validated</span>
          </span>
        </div>

        {/* Method Tabs */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.08] bg-[#09090B] p-1">
          <button
            type="button"
            onClick={() => setPaymentTab("card")}
            className={`rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              paymentTab === "card"
                ? "bg-[#18181D] text-white border border-[#DC2626]"
                : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Credit / Debit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentTab("apple_pay")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              paymentTab === "apple_pay"
                ? "bg-[#18181D] text-white border border-[#DC2626]"
                : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            <AppleBrandIcon className="w-3.5 h-3.5" />
            <span>Apple Pay</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentTab("google_pay")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              paymentTab === "google_pay"
                ? "bg-[#18181D] text-white border border-[#DC2626]"
                : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            <GoogleBrandIcon className="w-3.5 h-3.5" />
            <span>Google Pay</span>
          </button>
        </div>

        {paymentTab === "card" ? (
          <div className="mt-5 space-y-5">
            {/* Saved Cards (if signed in) */}
            {user && user.savedCards.length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                  Saved Cards
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {user.savedCards.map((card) => {
                    const checked = selectedSavedCardId === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedSavedCardId(card.id)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                          checked
                            ? "border-white bg-[#18181D]"
                            : "border-white/10 bg-[#16161B] hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CardNetworkBadge network={card.network} className="h-6 w-10" />
                          <div>
                            <p className="font-mono text-xs font-bold text-white">
                              {getCardNetworkLabel(card.network)} •••• {card.last4}
                            </p>
                            <p className="font-mono text-[10px] text-[#A1A1AA]">
                              Expires {card.expiry}
                            </p>
                          </div>
                        </div>
                        {checked && <CheckMarkIcon className="w-4 h-4 text-[#DC2626]" />}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setSelectedSavedCardId("new")}
                    className={`flex items-center justify-center rounded-xl border border-dashed p-3 text-xs font-semibold transition-colors cursor-pointer ${
                      selectedSavedCardId === "new"
                        ? "border-white bg-white text-[#09090B]"
                        : "border-white/20 bg-transparent text-[#A1A1AA] hover:text-white"
                    }`}
                  >
                    + Pay with a New Card
                  </button>
                </div>
              </div>
            )}

            {/* New Card Entry + 3D Interactive Card Preview */}
            {(!user || selectedSavedCardId === "new") && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
                {/* 3D Interactive Card Visual */}
                <div className="lg:col-span-5">
                  <div className="perspective-1000 mx-auto max-w-[320px]">
                    <div
                      className={`relative h-48 w-full transition-transform duration-500 transform-style-3d ${
                        cvcFocused ? "rotate-y-180" : ""
                      }`}
                    >
                      {/* Front Face */}
                      <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-xl border border-white/15 bg-[#16161B] p-5">
                        <div className="flex items-center justify-between">
                          {/* EMV Chip */}
                          <div className="h-7 w-10 rounded-md border border-white/30 bg-[#27272A]" />
                          <CardNetworkBadge network={detectedNetwork} className="h-7 w-11" />
                        </div>

                        <div className="font-mono text-base sm:text-lg font-semibold tracking-widest text-white">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </div>

                        <div className="flex items-end justify-between text-[11px]">
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-[#71717A]">
                              Cardholder
                            </span>
                            <span className="font-mono font-semibold uppercase text-[#E4E4E7]">
                              {cardHolder || "FULL NAME"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[9px] uppercase tracking-wider text-[#71717A]">
                              Expires
                            </span>
                            <span className="font-mono font-semibold text-[#E4E4E7]">
                              {expiry || "MM/YY"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Back Face (CVC Focus) */}
                      <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-xl border border-white/15 bg-[#121216] py-5">
                        <div className="h-9 w-full bg-black" />
                        <div className="px-5">
                          <span className="block text-[9px] uppercase tracking-wider text-[#71717A] mb-1">
                            Security Code
                          </span>
                          <div className="flex h-9 items-center justify-end rounded bg-white px-3 font-mono text-sm font-bold tracking-widest text-[#09090B]">
                            {cvc ? cvc.replace(/\d/g, "•") : "•••"}
                          </div>
                        </div>
                        <div className="px-5 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                          <span>ASTOR BOX OFFICE</span>
                          <span>{getCardNetworkLabel(detectedNetwork)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <CardNetworkBadge network="visa" className="h-4 w-7" />
                      <CardNetworkBadge network="mastercard" className="h-4 w-7" />
                      <CardNetworkBadge network="amex" className="h-4 w-7" />
                      <CardNetworkBadge network="discover" className="h-4 w-7" />
                    </div>
                    <button
                      type="button"
                      onClick={fillDemoCard}
                      className="text-[11px] font-semibold text-white hover:underline cursor-pointer"
                    >
                      Fill Test Visa
                    </button>
                  </div>
                </div>

                {/* Card Input Fields */}
                <div className="space-y-3.5 lg:col-span-7">
                  <div>
                    <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-lg border border-white/12 bg-[#09090B] pl-3.5 pr-14 py-2.5 font-mono text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
                      />
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        <CardNetworkBadge network={detectedNetwork} className="h-5 w-8" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      autoComplete="cc-name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="ELENA VANCE"
                      className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3.5 py-2.5 font-mono text-sm uppercase text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={expiry}
                        onChange={(e) => setExpiry(formatCardExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3 py-2.5 font-mono text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
                        CVC
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={cvc}
                        onFocus={() => setCvcFocused(true)}
                        onBlur={() => setCvcFocused(false)}
                        onChange={(e) =>
                          setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder={detectedNetwork === "amex" ? "1234" : "123"}
                        maxLength={4}
                        className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3 py-2.5 font-mono text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
                        ZIP / Postal
                      </label>
                      <input
                        type="text"
                        autoComplete="postal-code"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value.toUpperCase())}
                        placeholder="10013"
                        maxLength={10}
                        className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3 py-2.5 font-mono text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
                      />
                    </div>
                  </div>

                  {user && (
                    <label className="flex items-center gap-2 text-xs text-[#A1A1AA] cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveCardToAccount}
                        onChange={(e) => setSaveCardToAccount(e.target.checked)}
                        className="accent-[#DC2626]"
                      />
                      <span>Save card securely to Astor Film Pass for faster checkout</span>
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-white/10 bg-[#16161B] p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#09090B]">
              {paymentTab === "apple_pay" ? (
                <AppleBrandIcon className="w-6 h-6 text-white" />
              ) : (
                <GoogleBrandIcon className="w-6 h-6" />
              )}
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">
              {paymentTab === "apple_pay"
                ? "Express Checkout via Apple Pay"
                : "Express Checkout via Google Pay"}
            </h3>
            <p className="mt-1 text-xs text-[#A1A1AA] max-w-md mx-auto">
              Tokenized wallet card •••• {paymentTab === "apple_pay" ? "8841" : "5519"} ready for
              instant authorization and immediate PDF receipt generation.
            </p>
          </div>
        )}

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="mt-5 rounded-xl border border-[#DC2626] bg-[#141418] p-3.5 text-xs text-white space-y-1">
            {errors.map((err) => (
              <p key={err}>• {err}</p>
            ))}
          </div>
        )}

        {/* Submit Payment CTA */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/[0.08] pt-5">
          <p className="text-[11px] text-[#71717A]">
            Demo gateway: no live financial charge occurs. Instant QR & PDF issued locally.
          </p>
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#DC2626] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#EF4444] transition-colors disabled:opacity-60 cursor-pointer shrink-0"
          >
            <LockShieldIcon className="w-4 h-4" />
            <span>
              {processing
                ? "Authorizing Payment..."
                : `Pay ${formatCurrency(totalDue)} & Issue Tickets`}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
