import React from "react";
import Link from "next/link";
import { AstorTitleMark } from "@/components/icons/CinemaIcons";

export function Footer() {
  return (
    <footer className="no-print border-t border-white/[0.08] bg-[#060608] text-[#A1A1AA]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <AstorTitleMark className="w-7 h-7" />
              <span className="text-sm font-bold tracking-[0.16em] text-white">
                ASTOR FILM HALL
              </span>
            </div>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-[#A1A1AA]">
              Architectural cinema halls engineered for 70mm IMAX projection, 12-channel Dolby
              Atmos acoustics, and frictionless digital ticketing with instant PDF tax receipts.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono text-[#71717A]">
              <span className="rounded border border-white/10 px-2 py-1">70MM PROJECTION</span>
              <span className="rounded border border-white/10 px-2 py-1">DOLBY ATMOS</span>
              <span className="rounded border border-white/10 px-2 py-1">INSTANT QR PASS</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Box Office
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/#catalog" className="hover:text-white transition-colors">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link href="/#schedule" className="hover:text-white transition-colors">
                  Today&apos;s Showtimes
                </Link>
              </li>
              <li>
                <Link href="/concessions" className="hover:text-white transition-colors">
                  Concessions Menu
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-white transition-colors">
                  My Tickets & PDF Receipts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Member & Venues
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Astor Pass & Loyalty
                </Link>
              </li>
              <li>
                <span className="text-[#71717A]">Astor Downtown · Mercer St</span>
              </li>
              <li>
                <span className="text-[#71717A]">Astor Westside · 11th Ave</span>
              </li>
              <li>
                <span className="text-[#71717A]">Astor Heritage · Upper West</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-[#71717A] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Astor Film Hall LLC. All screening schedules & ticketing ready.</p>
          <p className="font-mono">PCI-Validated Demo Checkout · Local QR & PDF Engine</p>
        </div>
      </div>
    </footer>
  );
}
