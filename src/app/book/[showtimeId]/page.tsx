import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveShowtimeById } from "@/data/cinemaData";
import { BookingFlowClient } from "@/components/booking/BookingFlowClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ showtimeId: string }>;
}): Promise<Metadata> {
  const { showtimeId } = await params;
  const resolved = resolveShowtimeById(decodeURIComponent(showtimeId));
  if (!resolved) return { title: "Showtime Not Found" };
  return {
    title: `Book ${resolved.film.title} (${resolved.showtime.timeLabel})`,
    description: `Select seats and pre-order concessions for ${resolved.film.title} at ${resolved.hall.name}.`,
  };
}

export default async function BookShowtimePage({
  params,
}: {
  params: Promise<{ showtimeId: string }>;
}) {
  const { showtimeId } = await params;
  const resolved = resolveShowtimeById(decodeURIComponent(showtimeId));
  if (!resolved) notFound();

  return (
    <BookingFlowClient
      showtime={resolved.showtime}
      film={resolved.film}
      hall={resolved.hall}
    />
  );
}
