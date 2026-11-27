"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCinema } from "@/context/CinemaContext";
import {
  AstorTitleMark,
  ChevronDownIcon,
  CloseMarkIcon,
  MapPinLineIcon,
  MenuLinesIcon,
  TicketStubIcon,
  UserProfileIcon,
} from "@/components/icons/CinemaIcons";

export function Navbar() {
  const pathname = usePathname();
  const {
    halls,
    activeHall,
    setSelectedHallId,
    user,
    openAuthModal,
    signOut,
    bookings,
  } = useCinema();

  const [hallDropdownOpen, setHallDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const mobileMenuOpen = mobileMenuPath === pathname;

  const hallRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const activeBookingsCount = bookings.filter((b) => b.status === "confirmed").length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (hallRef.current && !hallRef.current.contains(e.target as Node)) {
        setHallDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const navLinks = [
    { href: "/#catalog", label: "Screenings", active: pathname === "/" },
    { href: "/#schedule", label: "Showtimes", active: false },
    { href: "/concessions", label: "Concessions", active: pathname === "/concessions" },
    {
      href: "/bookings",
      label: "My Tickets",
      active: pathname === "/bookings",
      badge: activeBookingsCount,
    },
  ];

  return (
    <header className="no-print sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090B]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Title + Two-Letter Monogram + Hall Selector */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] rounded-lg"
          >
            <AstorTitleMark className="w-8 h-8 shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="text-sm sm:text-[15px] font-bold tracking-[0.14em] text-white">
                ASTOR
              </span>
              <span className="text-[10px] font-medium tracking-[0.22em] text-[#A1A1AA] mt-0.5">
                FILM HALL
              </span>
            </div>
          </Link>

          {/* Desktop Hall Selector */}
          <div className="relative hidden md:block" ref={hallRef}>
            <button
              type="button"
              onClick={() => setHallDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-white/12 bg-[#141418] px-3.5 py-1.5 text-xs font-medium text-white hover:border-[#DC2626] transition-colors cursor-pointer"
              aria-expanded={hallDropdownOpen}
            >
              <MapPinLineIcon className="w-3.5 h-3.5 text-[#DC2626]" />
              <span className="truncate max-w-[140px]">{activeHall.shortName}</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
            </button>

            {hallDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-xl border border-white/12 bg-[#111114] p-2 shadow-2xl">
                <div className="px-3 py-2 border-b border-white/[0.08]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    Select Film Hall Branch
                  </p>
                </div>
                <div className="mt-1 space-y-1">
                  {halls.map((hall) => {
                    const selected = hall.id === activeHall.id;
                    return (
                      <button
                        key={hall.id}
                        type="button"
                        onClick={() => {
                          setSelectedHallId(hall.id);
                          setHallDropdownOpen(false);
                        }}
                        className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors cursor-pointer ${
                          selected
                            ? "bg-[#18181D] border border-white/40"
                            : "hover:bg-white/[0.05] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">
                            {hall.name}
                          </span>
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-[#DC2626]" />
                          )}
                        </div>
                        <p className="text-xs text-[#A1A1AA] mt-0.5">{hall.address}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {hall.amenities.slice(0, 3).map((item) => (
                            <span
                              key={item}
                              className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-[#D4D4D8]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                link.active
                  ? "text-white bg-white/[0.08]"
                  : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span>{link.label}</span>
              {typeof link.badge === "number" && link.badge > 0 && (
                <span className="ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#DC2626] px-1.5 font-mono text-[11px] font-semibold text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Auth / Profile & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/bookings"
            className="lg:hidden relative inline-flex items-center justify-center rounded-lg border border-white/12 bg-[#141418] p-2 text-white hover:border-white/25"
            aria-label="My Tickets"
          >
            <TicketStubIcon className="w-4 h-4" />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DC2626] px-1 font-mono text-[10px] font-bold text-white">
                {activeBookingsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full border border-white/15 bg-[#141418] py-1 pl-1.5 pr-3 hover:border-[#DC2626] transition-colors cursor-pointer"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DC2626] text-xs font-bold text-white">
                  {user.initials}
                </span>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-semibold text-white max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#A1A1AA]">
                    {user.points.toLocaleString()} pts
                  </span>
                </div>
                <ChevronDownIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl border border-white/12 bg-[#111114] p-1.5 shadow-2xl">
                  <div className="px-3 py-2.5 border-b border-white/[0.08]">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-[#A1A1AA] truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="rounded bg-white px-1.5 py-0.5 font-semibold text-[#09090B]">
                        {user.tier}
                      </span>
                      <span className="font-mono text-[#D4D4D8]">
                        {user.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[#E4E4E7] hover:bg-white/[0.06]"
                  >
                    <span>Account & Saved Cards</span>
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[#E4E4E7] hover:bg-white/[0.06]"
                  >
                    <span>Tickets & PDF Receipts</span>
                    <span className="font-mono text-[#A1A1AA]">{activeBookingsCount}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="mt-1 w-full text-left rounded-lg px-3 py-2 text-xs font-medium text-[#DC2626] hover:bg-white/[0.06] cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#141418] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:border-[#DC2626] transition-colors cursor-pointer"
            >
              <UserProfileIcon className="w-4 h-4 text-[#DC2626]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuPath((prev) => (prev === pathname ? null : pathname))
            }
            className="lg:hidden inline-flex items-center justify-center rounded-lg border border-white/12 bg-[#141418] p-2 text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <CloseMarkIcon className="w-5 h-5" />
            ) : (
              <MenuLinesIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0B0B0D] px-4 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2">
              Active Cinema Hall
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {halls.map((hall) => (
                <button
                  key={hall.id}
                  type="button"
                  onClick={() => setSelectedHallId(hall.id)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs border ${
                    hall.id === activeHall.id
                      ? "bg-[#18181D] border-white text-white"
                      : "bg-[#141418] border-white/[0.08] text-[#A1A1AA]"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white">{hall.shortName}</p>
                    <p className="text-[11px] text-[#A1A1AA]">{hall.neighborhood}</p>
                  </div>
                  {hall.id === activeHall.id && (
                    <span className="h-2 w-2 rounded-full bg-[#DC2626]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuPath(null)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[#E4E4E7] hover:bg-white/[0.06]"
              >
                <span>{link.label}</span>
                {typeof link.badge === "number" && link.badge > 0 && (
                  <span className="rounded-full bg-[#DC2626] px-2 py-0.5 font-mono text-xs text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileMenuPath(null)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[#E4E4E7] hover:bg-white/[0.06]"
            >
              <span>Astor Pass & Saved Cards</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
