import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FILMS } from "@/data/cinemaData";
import { MovieDetailClient } from "@/components/MovieDetailClient";

export function generateStaticParams() {
  return FILMS.map((film) => ({ slug: film.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const film = FILMS.find((f) => f.slug === slug);
  if (!film) return { title: "Film Not Found" };
  return {
    title: `${film.title} — Showtimes & Tickets`,
    description: film.synopsis,
  };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const film = FILMS.find((f) => f.slug === slug);
  if (!film) notFound();

  return <MovieDetailClient film={film} />;
}
