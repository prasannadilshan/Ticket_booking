"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCinema } from "@/context/CinemaContext";
import {
  FILMS,
  buildShowtimesForFilm,
  getRollingDates,
} from "@/data/cinemaData";
import type { Film, FilmGenre, ScreeningFormat, Showtime } from "@/types/cinema";
import { formatDuration } from "@/lib/cardUtils";
import {
  CalendarLineIcon,
  ChevronRightIcon,
  ClockLineIcon,
  ConcessionTrayIcon,
  MapPinLineIcon,
  PlayFrameIcon,
  SearchLineIcon,
  TicketStubIcon,
} from "@/components/icons/CinemaIcons";
import { ShowtimeChip } from "@/components/ShowtimeChip";
import { TrailerModal } from "@/components/TrailerModal";

const GENRES: Array<"All" | FilmGenre> = [
  "All",
  "Sci-Fi",
  "Neo-Noir",
  "Drama",
  "Action",
  "Animation",
  "Music",
];

const FORMATS: Array<"All" | ScreeningFormat> = [
  "All",
  "IMAX 70mm",
  "Dolby Atmos",
  "Dolby Vision",
  "35mm Print",
  "4DX",
  "RealD 3D",
];

export function HomeClient() {
  const { halls, activeHall, setSelectedHallId, user, openAuthModal } = useCinema();

  const dates = useMemo(() => getRollingDates(), []);
  const [selectedDateIso, setSelectedDateIso] = useState(dates[0]?.dateIso ?? "");
  const [catalogTab, setCatalogTab] = useState<"now_showing" | "special_70mm" | "coming_soon">(
    "now_showing"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<"All" | FilmGenre>("All");
  const [selectedFormat, setSelectedFormat] = useState<"All" | ScreeningFormat>("All");
  const [dayPartFilter, setDayPartFilter] = useState<"All" | Showtime["dayPart"]>("All");
  const [trailerFilm, setTrailerFilm] = useState<Film | null>(null);

  const featuredFilm = FILMS[0];

  const filmShowtimesMap = useMemo(() => {
    const map = new Map<string, Showtime[]>();
    FILMS.forEach((film) => {
      map.set(film.id, buildShowtimesForFilm(film.id, activeHall.id, dates));
    });
    return map;
  }, [activeHall.id, dates]);

  const featuredEveningShowtime = useMemo(() => {
    const list = filmShowtimesMap.get(featuredFilm.id) ?? [];
    return (
      list.find((s) => s.dateIso === dates[0]?.dateIso && s.dayPart === "Evening") ??
      list[0]
    );
  }, [dates, featuredFilm.id, filmShowtimesMap]);

  const filteredFilms = useMemo(() => {
    return FILMS.filter((film) => {
      if (catalogTab === "now_showing" && film.releaseStatus !== "now_showing") return false;
      if (catalogTab === "coming_soon" && film.releaseStatus !== "coming_soon") return false;
      if (catalogTab === "special_70mm" && !film.isSpecial70mm) return false;

      if (selectedGenre !== "All" && film.genre !== selectedGenre) return false;
      if (selectedFormat !== "All" && !film.formats.includes(selectedFormat)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${film.title} ${film.director} ${film.cast.join(" ")} ${film.genre} ${film.secondaryGenre}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [catalogTab, searchQuery, selectedFormat, selectedGenre]);

  return (
    <div className="pb-16">
      {/* EDITORIAL SPLIT HERO */}
      <section className="border-b border-white/10 bg-[#09090B]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
                <span className="rounded-md bg-white px-2.5 py-0.5 font-semibold text-[#09090B]">
                  70mm Featured
                </span>
                <span>{featuredFilm.rating}</span>
                <span>·</span>
                <span>{formatDuration(featuredFilm.durationMins)}</span>
                <span>·</span>
                <span>{featuredFilm.genre}</span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {featuredFilm.title}
              </h1>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#D4D4D8]">
                {featuredFilm.synopsis}
              </p>

              <p className="mt-4 text-xs text-[#A1A1AA]">
                Dir. <span className="text-white">{featuredFilm.director}</span> ·{" "}
                {featuredFilm.cast.slice(0, 3).join(", ")}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={
                    featuredEveningShowtime
                      ? `/book/${featuredEveningShowtime.id}`
                      : `/movies/${featuredFilm.slug}`
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-[#DC2626] px-5 py-3 text-sm font-semibold text-white hover:bg-[#EF4444] transition-colors"
                >
                  <TicketStubIcon className="w-4 h-4" />
                  <span>
                    {featuredEveningShowtime
                      ? `Book ${featuredEveningShowtime.timeLabel} Screening`
                      : "Book Tickets"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setTrailerFilm(featuredFilm)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#141418] px-4 py-3 text-sm font-medium text-white hover:border-white/40 transition-colors cursor-pointer"
                >
                  <PlayFrameIcon className="w-4 h-4 text-[#DC2626]" />
                  <span>Preview Reel</span>
                </button>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-[#111114]">
                <Image
                  src={featuredFilm.heroUrl}
                  alt={`${featuredFilm.title} still frame`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMA BRANCH SELECTOR */}
      <section className="border-b border-white/[0.08] bg-[#0B0B0D]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <MapPinLineIcon className="w-4 h-4 text-[#DC2626]" />
              <span>Cinema Location</span>
            </div>
            <p className="text-xs text-[#71717A]">{activeHall.transitNote}</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {halls.map((hall) => {
              const active = hall.id === activeHall.id;
              return (
                <button
                  key={hall.id}
                  type="button"
                  onClick={() => setSelectedHallId(hall.id)}
                  className={`flex items-start justify-between gap-3 rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                    active
                      ? "border-white bg-[#18181D]"
                      : "border-white/10 bg-[#121216] hover:border-white/25"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{hall.name}</p>
                    <p className="mt-0.5 text-xs text-[#A1A1AA] truncate">{hall.address}</p>
                  </div>
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      active ? "bg-[#DC2626]" : "bg-white/20"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FILM CATALOG (2 CARDS PER ROW MOBILE, COMPACT 4 PER ROW DESKTOP) */}
      <section id="catalog" className="mx-auto max-w-7xl px-4 pt-9 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Playing at {activeHall.shortName}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#A1A1AA]">
              Select a screening time to reserve auditorium seats.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative">
              <SearchLineIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, director, cast..."
                className="w-full sm:w-60 rounded-lg border border-white/12 bg-[#121216] pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:border-[#DC2626] focus:outline-none"
              />
            </div>

            <select
              aria-label="Filter by projection format"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as "All" | ScreeningFormat)}
              className="rounded-lg border border-white/12 bg-[#121216] px-3 py-2 text-sm text-[#E4E4E7] focus:border-[#DC2626] focus:outline-none"
            >
              {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt === "All" ? "All Formats" : fmt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs + Genre Filter */}
        <div className="mt-5 flex flex-col gap-3 border-b border-white/[0.08] pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "now_showing", label: "Now Showing" },
              { id: "special_70mm", label: "70mm & Archival" },
              { id: "coming_soon", label: "Coming Soon" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setCatalogTab(tab.id as "now_showing" | "special_70mm" | "coming_soon")
                }
                className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  catalogTab === tab.id
                    ? "bg-white text-[#09090B] font-semibold"
                    : "bg-[#141418] text-[#A1A1AA] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  selectedGenre === genre
                    ? "border-white bg-white text-[#09090B] font-semibold"
                    : "border-white/10 bg-transparent text-[#A1A1AA] hover:border-white/25 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Film Grid: 2 cols on mobile, 3 on tablet, 4 compact cols on desktop */}
        {filteredFilms.length === 0 ? (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#111114] p-8 text-center">
            <p className="text-sm font-semibold text-white">
              No screenings match your active filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setCatalogTab("now_showing");
                setSelectedGenre("All");
                setSelectedFormat("All");
                setSearchQuery("");
              }}
              className="mt-3 rounded-lg bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredFilms.map((film) => {
              const allShows = filmShowtimesMap.get(film.id) ?? [];
              const todayShows = allShows.filter((s) => s.dateIso === dates[0]?.dateIso).slice(0, 4);

              return (
                <article
                  key={film.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111114] transition-colors hover:border-white/25"
                >
                  <Link
                    href={`/movies/${film.slug}`}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-[#09090B] block"
                  >
                    <Image
                      src={film.posterUrl}
                      alt={`${film.title} poster`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <Link href={`/movies/${film.slug}`} className="min-w-0 flex-1">
                          <h3 className="truncate text-sm sm:text-base font-semibold text-white hover:text-[#DC2626] transition-colors">
                            {film.title}
                          </h3>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setTrailerFilm(film)}
                          className="shrink-0 rounded border border-white/12 p-1 text-[#A1A1AA] hover:border-[#DC2626] hover:text-white cursor-pointer"
                          title="Preview reel"
                          aria-label={`Preview ${film.title}`}
                        >
                          <PlayFrameIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="mt-1 truncate text-[11px] text-[#A1A1AA]">
                        {film.rating} · {formatDuration(film.durationMins)} · {film.genre}
                      </p>
                    </div>

                    <div className="mt-3 border-t border-white/[0.08] pt-2.5">
                      <div className="flex items-center justify-between gap-1 text-[11px] mb-2">
                        <span className="truncate font-medium text-[#A1A1AA]">
                          {film.releaseStatus === "coming_soon"
                            ? film.releaseDateLabel
                            : "Today"}
                        </span>
                        <Link
                          href={`/movies/${film.slug}`}
                          className="inline-flex items-center gap-0.5 shrink-0 font-medium text-white hover:underline"
                        >
                          <span>All Times</span>
                          <ChevronRightIcon className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {todayShows.map((show) => (
                          <ShowtimeChip key={show.id} showtime={show} compact />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* DAILY SCHEDULE MATRIX */}
      <section id="schedule" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-white/10 bg-[#111114] p-4 sm:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#A1A1AA]">
                <CalendarLineIcon className="w-4 h-4 text-[#DC2626]" />
                <span>Showtime Schedule</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
                {activeHall.name}
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(["All", "Morning", "Matinee", "Evening", "Late"] as const).map((part) => (
                <button
                  key={part}
                  type="button"
                  onClick={() => setDayPartFilter(part)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    dayPartFilter === part
                      ? "bg-[#DC2626] text-white font-semibold"
                      : "bg-[#18181D] text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {dates.map((d, idx) => {
              const selected = d.dateIso === selectedDateIso;
              return (
                <button
                  key={d.dateIso}
                  type="button"
                  onClick={() => setSelectedDateIso(d.dateIso)}
                  className={`flex min-w-[78px] flex-col items-center rounded-lg border px-3 py-2 transition-colors cursor-pointer ${
                    selected
                      ? "border-white bg-white text-[#09090B]"
                      : "border-white/10 bg-[#16161B] text-[#A1A1AA] hover:border-white/25 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase">
                    {idx === 0 ? "Today" : idx === 1 ? "Tmrw" : d.dayShort}
                  </span>
                  <span
                    className={`mt-0.5 font-mono text-sm font-bold ${
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

          <div className="mt-5 divide-y divide-white/[0.08]">
            {FILMS.map((film) => {
              const dayShows = (filmShowtimesMap.get(film.id) ?? []).filter(
                (s) =>
                  s.dateIso === selectedDateIso &&
                  (dayPartFilter === "All" || s.dayPart === dayPartFilter)
              );

              if (dayShows.length === 0) return null;

              return (
                <div
                  key={film.id}
                  className="py-4 first:pt-2 last:pb-0 flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0 lg:w-72 shrink-0">
                    <Link
                      href={`/movies/${film.slug}`}
                      className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-white/10"
                    >
                      <Image
                        src={film.posterUrl}
                        alt={film.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/movies/${film.slug}`}
                        className="text-sm sm:text-base font-semibold text-white hover:text-[#DC2626] transition-colors truncate block"
                      >
                        {film.title}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
                        <span>{film.rating}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <ClockLineIcon className="w-3.5 h-3.5" />
                          {formatDuration(film.durationMins)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                    {dayShows.map((show) => (
                      <ShowtimeChip key={show.id} showtime={show} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AUDITORIUM & CONCESSIONS SPOTLIGHT */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-white/10 bg-[#111114] lg:grid-cols-12">
          <div className="relative min-h-[240px] lg:col-span-6">
            <Image
              src="/images/auditorium-hero.jpg"
              alt="Astor Film Hall auditorium interior"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-9 lg:col-span-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Auditorium Seating & Dining
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#A1A1AA]">
              Choose from Standard front rows, Executive Prime center acoustic rows, or heated VIP
              Recliners. Concessions can be picked up at Express Counter A or brought straight to
              your seat before trailers begin.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-lg border border-white/12 bg-[#18181D] p-3">
                <p className="font-semibold text-white">Standard</p>
                <p className="mt-0.5 text-[#A1A1AA]">Rows A–B</p>
              </div>
              <div className="rounded-lg border border-white/30 bg-[#18181D] p-3">
                <p className="font-semibold text-white">Executive</p>
                <p className="mt-0.5 text-[#D4D4D8]">Rows C–F</p>
              </div>
              <div className="rounded-lg border border-[#DC2626] bg-[#18181D] p-3">
                <p className="font-semibold text-white">VIP Recliner</p>
                <p className="mt-0.5 text-[#D4D4D8]">Rows G–H</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/concessions"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#18181D] px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:border-[#DC2626]"
              >
                <ConcessionTrayIcon className="w-4 h-4 text-[#DC2626]" />
                <span>View Concessions Menu</span>
              </Link>
              {!user && (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#09090B] hover:bg-[#F4F4F5] cursor-pointer"
                >
                  <span>Sign In with Social Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <TrailerModal film={trailerFilm} onClose={() => setTrailerFilm(null)} />
    </div>
  );
}
