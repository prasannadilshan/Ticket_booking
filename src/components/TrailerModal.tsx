"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Film } from "@/types/cinema";
import { CloseMarkIcon, PlayFrameIcon } from "@/components/icons/CinemaIcons";

interface TrailerModalProps {
  film: Film | null;
  onClose: () => void;
}

function TrailerModalContent({ film, onClose }: { film: Film; onClose: () => void }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSceneIdx((prev) => (prev + 1) % film.trailerScenes.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [film.trailerScenes.length, isPlaying]);

  const scene = film.trailerScenes[sceneIdx] ?? film.trailerScenes[0];

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${film.title} theatrical trailer preview`}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#09090B] shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-[#09090B]">
              TRAILER PREVIEW
            </span>
            <h3 className="truncate text-sm sm:text-base font-bold text-white">
              {film.title}
            </h3>
            <span className="hidden sm:inline font-mono text-xs text-[#A1A1AA]">
              {film.aspectRatio} · {film.soundSystem}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#A1A1AA] hover:bg-white/[0.08] hover:text-white cursor-pointer"
            aria-label="Close trailer"
          >
            <CloseMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Theatrical Letterbox Screen */}
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <Image
            src={film.heroUrl}
            alt={`${film.title} screening still`}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-[#09090B]/55" />

          {/* Letterbox cinema bars */}
          <div className="absolute inset-x-0 top-0 h-5 sm:h-7 bg-black" />
          <div className="absolute inset-x-0 bottom-0 h-5 sm:h-7 bg-black" />

          {/* Center scene overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
            <div className="flex items-center justify-between pt-3">
              <span className="font-mono text-xs tracking-widest text-white">
                {scene.timestamp} · REEL {sceneIdx + 1}/{film.trailerScenes.length}
              </span>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-xs font-medium text-white hover:bg-black/85 cursor-pointer"
              >
                <PlayFrameIcon className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>{isPlaying ? "Pause Reel" : "Resume Reel"}</span>
              </button>
            </div>

            <div className="pb-4 max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA]">
                {scene.cameraSpec}
              </p>
              <h4 className="mt-1 text-xl sm:text-3xl font-bold text-white">
                {scene.title}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-[#E4E4E7] leading-relaxed">
                {scene.caption}
              </p>
            </div>
          </div>
        </div>

        {/* Chapter Scrubber & CTA */}
        <div className="flex flex-col gap-4 border-t border-white/10 bg-[#111114] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap gap-2">
            {film.trailerScenes.map((item, idx) => (
              <button
                key={item.timestamp}
                type="button"
                onClick={() => {
                  setSceneIdx(idx);
                  setIsPlaying(false);
                }}
                className={`rounded-lg border px-3 py-1.5 text-left transition-colors cursor-pointer ${
                  idx === sceneIdx
                    ? "border-white bg-white text-[#09090B]"
                    : "border-white/10 bg-[#18181D] text-[#A1A1AA] hover:text-white"
                }`}
              >
                <span
                  className={`font-mono text-[10px] block ${
                    idx === sceneIdx ? "text-[#52525B]" : "text-[#A1A1AA]"
                  }`}
                >
                  {item.timestamp}
                </span>
                <span className="text-xs font-medium">{item.title}</span>
              </button>
            ))}
          </div>

          <Link
            href={`/movies/${film.slug}`}
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-[#DC2626] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#EF4444] transition-colors shrink-0"
          >
            Select Showtime
          </Link>
        </div>
      </div>
    </div>
  );
}

export function TrailerModal({ film, onClose }: TrailerModalProps) {
  if (!film) return null;
  return <TrailerModalContent key={film.id} film={film} onClose={onClose} />;
}
