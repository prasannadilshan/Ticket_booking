"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCinema } from "@/context/CinemaContext";
import {
  buildShowtimesForFilm,
  getRollingDates,
} from "@/data/cinemaData";
import type { Film, ScreeningFormat } from "@/types/cinema";
import { formatDuration } from "@/lib/cardUtils";
import {
  ArrowLeftIcon,
  CalendarLineIcon,
  ClockLineIcon,
  MapPinLineIcon,
  PlayFrameIcon,
} from "@/components/icons/CinemaIcons";
import { ShowtimeChip } from "@/components/ShowtimeChip";
import { TrailerModal } from "@/components/TrailerModal";

export function MovieDetailClient({ film }: { film: Film }) {
  const { halls, activeHall, setSelectedHallId } = useCinema();
  const dates = useMemo(() => getRollingDates(), []);
  const [selectedDateIso, setSelectedDateIso] = useState(dates[0]?.dateIso ?? "");
  const [formatFilter, setFormatFilter] = useState<"All" | ScreeningFormat>("All");
  const [trailerOpen, setTrailerOpen] = useState(false);

  const showtimes = useMemo(() => {
    return buildShowtimesForFilm(film.id, activeHall.id, dates).filter(
      (s) =>
        s.dateIso === selectedDateIso &&
        (formatFilter === "All" || s.format === formatFilter)
    );
  }, [activeHall.id, dates, film.id, formatFilter, selectedDateIso]);

  return (
    <div className="pb-16">
      {/* Backdrop Hero */}
      <section className="relative border-b border-white/10 bg-[#09090B]">
        <div className="absolute inset-0">
          <Image
            src={film.heroUrl}
            alt={film.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[#09090B]/75" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to All Screenings</span>
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/15 bg-[#111114] shadow-2xl">
                <Image
                  src={film.posterUrl}
                  alt={`${film.title} poster`}
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#09090B]">
                  {film.releaseDateLabel}
                </span>
                <span className="rounded bg-white/[0.08] px-2.5 py-0.5 font-mono text-[11px] text-white">
                  {film.rating}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#D4D4D8]">
                  <ClockLineIcon className="w-3.5 h-3.5 text-[#DC2626]" />
                  {formatDuration(film.durationMins)}
                </span>
                <span className="text-xs text-[#A1A1AA]">· {film.genre} / {film.secondaryGenre}</span>
              </div>

              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {film.title}
              </h1>
              <p className="mt-2 text-base sm:text-lg font-medium text-[#D4D4D8]">
                {film.tagline}
              </p>
              <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-[#E4E4E7]">
                {film.synopsis}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-[#111114]/90 p-4 sm:grid-cols-4">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Director
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm font-semibold text-white">
                    {film.director}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Aspect Ratio
                  </span>
                  <span className="mt-1 block font-mono text-xs text-white">
                    {film.aspectRatio}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Sound Mix
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm font-semibold text-white">
                    {film.soundSystem}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Captions & Audio
                  </span>
                  <span className="mt-1 block text-xs text-[#D4D4D8]">{film.subtitles}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[#141418] px-5 py-3 text-sm font-semibold text-white hover:border-[#DC2626] transition-colors cursor-pointer"
                >
                  <PlayFrameIcon className="w-4 h-4 text-[#DC2626]" />
                  <span>Watch Reel Preview</span>
                </button>
                <div className="text-xs text-[#A1A1AA]">
                  Cast: <span className="text-white">{film.cast.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWTIMES & VENUE PICKER */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-white/10 bg-[#111114] p-5 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA]">
                <CalendarLineIcon className="w-4 h-4 text-[#DC2626]" />
                <span>Step 1 · Choose Screening Time</span>
              </span>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Showtimes for {film.title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {halls.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHallId(h.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    h.id === activeHall.id
                      ? "border-white bg-white text-[#09090B]"
                      : "border-white/10 bg-[#18181D] text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <MapPinLineIcon
                    className={`w-3.5 h-3.5 ${
                      h.id === activeHall.id ? "text-[#DC2626]" : "text-[#A1A1AA]"
                    }`}
                  />
                  <span>{h.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {dates.map((d, idx) => {
              const selected = d.dateIso === selectedDateIso;
              return (
                <button
                  key={d.dateIso}
                  type="button"
                  onClick={() => setSelectedDateIso(d.dateIso)}
                  className={`flex min-w-[84px] flex-col items-center rounded-xl border px-3.5 py-2.5 transition-colors cursor-pointer ${
                    selected
                      ? "border-white bg-white text-[#09090B]"
                      : "border-white/10 bg-[#18181D] text-[#A1A1AA] hover:border-white/25"
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {idx === 0 ? "Today" : idx === 1 ? "Tmrw" : d.dayShort}
                  </span>
                  <span
                    className={`mt-0.5 font-mono text-base font-bold ${
                      selected ? "text-[#09090B]" : "text-white"
                    }`}
                  >
                    {d.dateNum}
                  </span>
                  <span className={`text-[10px] ${selected ? "text-[#52525B]" : "text-[#71717A]"}`}>
                    {d.monthShort}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
            <span className="text-xs font-medium text-[#71717A] mr-1">Format:</span>
            <button
              type="button"
              onClick={() => setFormatFilter("All")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold cursor-pointer ${
                formatFilter === "All"
                  ? "border-white bg-white text-[#09090B]"
                  : "border-white/12 text-[#A1A1AA] hover:text-white"
              }`}
            >
              All ({film.formats.length})
            </button>
            {film.formats.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormatFilter(fmt)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold cursor-pointer ${
                  formatFilter === fmt
                    ? "border-white bg-white text-[#09090B]"
                    : "border-white/12 text-[#A1A1AA] hover:text-white"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {showtimes.length === 0 ? (
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#18181D] p-8 text-center text-sm text-[#A1A1AA]">
              No showtimes match that format filter on this date. Select &ldquo;All&rdquo; formats to view available screenings.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {showtimes.map((show) => (
                <ShowtimeChip key={show.id} showtime={show} />
              ))}
            </div>
          )}

          <p className="mt-5 text-xs text-[#71717A]">
            {activeHall.name} · {activeHall.address} · {activeHall.transitNote}
          </p>
        </div>
      </section>

      <TrailerModal film={trailerOpen ? film : null} onClose={() => setTrailerOpen(false)} />
    </div>
  );
}
