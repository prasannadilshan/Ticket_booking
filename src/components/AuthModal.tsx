"use client";

import React, { useState } from "react";
import { useCinema } from "@/context/CinemaContext";
import type { SocialProvider } from "@/types/cinema";
import {
  AppleBrandIcon,
  AstorTitleMark,
  CloseMarkIcon,
  FacebookBrandIcon,
  GitHubBrandIcon,
  GoogleBrandIcon,
  LockShieldIcon,
} from "@/components/icons/CinemaIcons";

export function AuthModal() {
  const { authModalOpen, closeAuthModal, signInWithSocial, signInWithEmail } = useCinema();
  const [connectingProvider, setConnectingProvider] = useState<SocialProvider | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!authModalOpen) return null;

  const handleSocial = (provider: Exclude<SocialProvider, "email">) => {
    setError("");
    setConnectingProvider(provider);
    setTimeout(() => {
      setConnectingProvider(null);
      signInWithSocial(provider);
    }, 550);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    setError("");
    setConnectingProvider("email");
    setTimeout(() => {
      setConnectingProvider(null);
      signInWithEmail(name, email);
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/12 bg-[#111114] p-6 sm:p-7 shadow-2xl">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-2 text-[#A1A1AA] hover:bg-white/[0.06] hover:text-white cursor-pointer"
          aria-label="Close sign in dialog"
        >
          <CloseMarkIcon className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <AstorTitleMark className="w-8 h-8" />
          <div>
            <h2 id="auth-modal-title" className="text-lg font-bold text-white">
              Sign in to Astor Film Pass
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Save payment cards, earn 10 pts/$1, and access PDF tickets anytime.
            </p>
          </div>
        </div>

        {/* Social Login Providers */}
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            disabled={connectingProvider !== null}
            onClick={() => handleSocial("google")}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/12 bg-[#18181D] px-4 py-3 text-sm font-semibold text-white hover:border-white/25 hover:bg-[#1F1F26] transition-colors disabled:opacity-60 cursor-pointer"
          >
            <GoogleBrandIcon className="w-4 h-4" />
            <span>
              {connectingProvider === "google" ? "Connecting Google..." : "Continue with Google"}
            </span>
          </button>

          <button
            type="button"
            disabled={connectingProvider !== null}
            onClick={() => handleSocial("apple")}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/12 bg-white px-4 py-3 text-sm font-semibold text-[#09090B] hover:bg-[#F4F4F5] transition-colors disabled:opacity-60 cursor-pointer"
          >
            <AppleBrandIcon className="w-4 h-4" />
            <span>
              {connectingProvider === "apple" ? "Authorizing Apple ID..." : "Continue with Apple"}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={connectingProvider !== null}
              onClick={() => handleSocial("facebook")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#18181D] px-3 py-2.5 text-xs font-semibold text-white hover:border-white/25 hover:bg-[#1F1F26] transition-colors disabled:opacity-60 cursor-pointer"
            >
              <FacebookBrandIcon className="w-4 h-4" />
              <span>{connectingProvider === "facebook" ? "Connecting..." : "Facebook"}</span>
            </button>

            <button
              type="button"
              disabled={connectingProvider !== null}
              onClick={() => handleSocial("github")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#18181D] px-3 py-2.5 text-xs font-semibold text-white hover:border-white/25 hover:bg-[#1F1F26] transition-colors disabled:opacity-60 cursor-pointer"
            >
              <GitHubBrandIcon className="w-4 h-4" />
              <span>{connectingProvider === "github" ? "Connecting..." : "GitHub"}</span>
            </button>
          </div>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#71717A]">
            or sign in with email
          </span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
              Full Name (optional for existing pass)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Vance"
              className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3.5 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3.5 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D4D4D8] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/12 bg-[#09090B] px-3.5 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
            />
          </div>

          {error && <p className="text-xs font-medium text-[#EF4444]">{error}</p>}

          <button
            type="submit"
            disabled={connectingProvider !== null}
            className="w-full rounded-xl bg-[#DC2626] px-4 py-3 text-sm font-bold text-white hover:bg-[#EF4444] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {connectingProvider === "email" ? "Signing in..." : "Sign In / Create Pass"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#71717A]">
          <LockShieldIcon className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>OAuth 2.0 encrypted session · Instant guest checkout also supported</span>
        </div>
      </div>
    </div>
  );
}
