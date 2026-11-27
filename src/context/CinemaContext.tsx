"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type {
  BookingRecord,
  CinemaHall,
  SavedCard,
  SocialProvider,
  UserProfile,
} from "@/types/cinema";
import { CINEMA_HALLS, FILMS, buildShowtimesForFilm, getRollingDates } from "@/data/cinemaData";

interface ToastMessage {
  id: string;
  text: string;
  tone?: "default" | "success" | "warning";
}

interface CinemaContextValue {
  halls: CinemaHall[];
  selectedHallId: string;
  activeHall: CinemaHall;
  setSelectedHallId: (hallId: string) => void;
  user: UserProfile | null;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithSocial: (provider: SocialProvider) => void;
  signInWithEmail: (name: string, email: string) => void;
  signOut: () => void;
  addSavedCard: (card: Omit<SavedCard, "id">) => void;
  removeSavedCard: (cardId: string) => void;
  setDefaultCard: (cardId: string) => void;
  bookings: BookingRecord[];
  addBooking: (booking: BookingRecord) => void;
  cancelBooking: (bookingId: string) => void;
  getExtraOccupiedSeats: (showtimeId: string) => string[];
  notify: (text: string, tone?: ToastMessage["tone"]) => void;
}

const STORAGE_KEYS = {
  HALL: "astor_selected_hall_v1",
  USER: "astor_user_session_v1",
  BOOKINGS: "astor_bookings_v1",
};

const SOCIAL_PERSONAS: Record<Exclude<SocialProvider, "email">, { name: string; email: string }> = {
  google: { name: "Elena Vance", email: "elena.vance@gmail.com" },
  apple: { name: "Marcus Sterling", email: "m.sterling@icloud.com" },
  facebook: { name: "Claire Bennett", email: "claire.bennett@fb-mail.com" },
  github: { name: "Devon Brooks", email: "devon@github-users.dev" },
};

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function buildSeedBookings(): BookingRecord[] {
  const dates = getRollingDates();
  const hall = CINEMA_HALLS[0];
  const film = FILMS[0];
  const showtimes = buildShowtimesForFilm(film.id, hall.id, dates);
  const sampleShowtime = showtimes.find((s) => s.dayPart === "Evening") ?? showtimes[0];
  if (!sampleShowtime) return [];

  const seatPrice = Number((sampleShowtime.basePrice + 2.5).toFixed(2));
  const ticketsSubtotal = seatPrice * 2;
  const concessionsSubtotal = 24.5;
  const bookingFee = 3.9;
  const taxAmount = Number(((ticketsSubtotal + concessionsSubtotal) * 0.08875).toFixed(2));
  const totalPaid = Number((ticketsSubtotal + concessionsSubtotal + bookingFee + taxAmount).toFixed(2));

  return [
    {
      id: "seed-ast-8419",
      bookingRef: "AST-8419-MZ",
      createdAtIso: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      status: "confirmed",
      hall,
      film,
      showtime: sampleShowtime,
      seats: [
        {
          id: "E-06",
          row: "E",
          number: 6,
          tier: "executive",
          price: seatPrice,
          isAccessible: false,
          isCompanion: false,
          isOccupied: true,
        },
        {
          id: "E-07",
          row: "E",
          number: 7,
          tier: "executive",
          price: seatPrice,
          isAccessible: false,
          isCompanion: false,
          isOccupied: true,
        },
      ],
      concessions: [
        {
          item: {
            id: "combo-astor-duo",
            name: "The Astor Double Feature",
            category: "Combos",
            description: "Large artisan popcorn, two craft sodas, and warm spiced pretzels.",
            price: 24.5,
            calories: "1,180 kcal",
            dietaryTags: ["Best Value"],
          },
          quantity: 1,
          selectedFlavor: "Black Truffle Salt",
        },
      ],
      deliveryMode: "express_counter",
      customerName: "Guest Screening Pass",
      customerEmail: "tickets@astorfilmhall.com",
      ticketsSubtotal,
      concessionsSubtotal,
      bookingFee,
      taxAmount,
      discountAmount: 0,
      pointsRedeemed: 0,
      pointsEarned: Math.round(totalPaid * 10),
      totalPaid,
      payment: {
        method: "card",
        cardNetwork: "visa",
        last4: "4242",
        holderName: "ELENA VANCE",
        authCode: "AUTH90412",
        transactionId: "TXN-7710294-VS",
        paidAtIso: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      },
      qrPayload: JSON.stringify({
        ref: "AST-8419-MZ",
        film: film.id,
        showtime: sampleShowtime.id,
        seats: ["E-06", "E-07"],
        valid: true,
      }),
    },
  ];
}

const CinemaContext = createContext<CinemaContextValue | undefined>(undefined);

export function CinemaProvider({ children }: { children: React.ReactNode }) {
  const [selectedHallId, setSelectedHallIdState] = useState<string>(CINEMA_HALLS[0].id);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedHall = localStorage.getItem(STORAGE_KEYS.HALL);
        if (savedHall && CINEMA_HALLS.some((h) => h.id === savedHall)) {
          setSelectedHallIdState(savedHall);
        }

        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (savedUser) {
          setUser(JSON.parse(savedUser) as UserProfile);
        }

        const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        if (savedBookings) {
          setBookings(JSON.parse(savedBookings) as BookingRecord[]);
        } else {
          const seeded = buildSeedBookings();
          setBookings(seeded);
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(seeded));
        }
      } catch {
        setBookings(buildSeedBookings());
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const notify = useCallback((text: string, tone: ToastMessage["tone"] = "default") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const setSelectedHallId = useCallback(
    (hallId: string) => {
      setSelectedHallIdState(hallId);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.HALL, hallId);
      }
      const hall = CINEMA_HALLS.find((h) => h.id === hallId);
      if (hall) {
        notify(`Switched cinema branch to ${hall.shortName}`);
      }
    },
    [notify]
  );

  const persistUser = useCallback((nextUser: UserProfile | null) => {
    setUser(nextUser);
    if (typeof window !== "undefined") {
      if (nextUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  }, []);

  const signInWithSocial = useCallback(
    (provider: SocialProvider) => {
      const persona =
        provider === "email"
          ? { name: "Astor Member", email: "member@astorfilmhall.com" }
          : SOCIAL_PERSONAS[provider];

      const profile: UserProfile = {
        id: `usr-${provider}-01`,
        name: persona.name,
        email: persona.email,
        phone: "+1 (212) 555-0194",
        provider,
        initials: computeInitials(persona.name),
        tier: "Gold",
        points: 1250,
        savedCards: [
          {
            id: "card-visa-4242",
            network: "visa",
            last4: "4242",
            expiry: "09/28",
            holderName: persona.name.toUpperCase(),
            isDefault: true,
          },
          {
            id: "card-mc-8810",
            network: "mastercard",
            last4: "8810",
            expiry: "04/29",
            holderName: persona.name.toUpperCase(),
            isDefault: false,
          },
        ],
      };

      persistUser(profile);
      setAuthModalOpen(false);
      const label = provider.charAt(0).toUpperCase() + provider.slice(1);
      notify(`Signed in with ${label} as ${profile.name}`, "success");
    },
    [notify, persistUser]
  );

  const signInWithEmail = useCallback(
    (name: string, email: string) => {
      const cleanName = name.trim() || email.split("@")[0] || "Astor Member";
      const profile: UserProfile = {
        id: `usr-email-${Date.now()}`,
        name: cleanName,
        email: email.trim(),
        provider: "email",
        initials: computeInitials(cleanName),
        tier: "Silver",
        points: 600,
        savedCards: [
          {
            id: "card-visa-4242",
            network: "visa",
            last4: "4242",
            expiry: "09/28",
            holderName: cleanName.toUpperCase(),
            isDefault: true,
          },
        ],
      };
      persistUser(profile);
      setAuthModalOpen(false);
      notify(`Welcome back, ${cleanName}`, "success");
    },
    [notify, persistUser]
  );

  const signOut = useCallback(() => {
    persistUser(null);
    notify("Signed out of your Astor Film Pass");
  }, [notify, persistUser]);

  const addSavedCard = useCallback(
    (card: Omit<SavedCard, "id">) => {
      if (!user) return;
      const newCard: SavedCard = {
        ...card,
        id: `card-${Date.now()}`,
      };
      const updatedCards = card.isDefault
        ? [...user.savedCards.map((c) => ({ ...c, isDefault: false })), newCard]
        : [...user.savedCards, newCard];
      persistUser({ ...user, savedCards: updatedCards });
      notify(`Saved ${card.network.toUpperCase()} •••• ${card.last4}`, "success");
    },
    [notify, persistUser, user]
  );

  const removeSavedCard = useCallback(
    (cardId: string) => {
      if (!user) return;
      const filtered = user.savedCards.filter((c) => c.id !== cardId);
      if (filtered.length > 0 && !filtered.some((c) => c.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      persistUser({ ...user, savedCards: filtered });
      notify("Removed payment method");
    },
    [notify, persistUser, user]
  );

  const setDefaultCard = useCallback(
    (cardId: string) => {
      if (!user) return;
      persistUser({
        ...user,
        savedCards: user.savedCards.map((c) => ({
          ...c,
          isDefault: c.id === cardId,
        })),
      });
      notify("Updated default card");
    },
    [notify, persistUser, user]
  );

  const addBooking = useCallback(
    (booking: BookingRecord) => {
      setBookings((prev) => {
        const next = [booking, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
        }
        return next;
      });
      if (user) {
        const nextPoints = Math.max(
          0,
          user.points - booking.pointsRedeemed + booking.pointsEarned
        );
        persistUser({
          ...user,
          points: nextPoints,
          tier: nextPoints >= 2500 ? "Noir Member" : nextPoints >= 1000 ? "Gold" : "Silver",
        });
      }
    },
    [persistUser, user]
  );

  const cancelBooking = useCallback(
    (bookingId: string) => {
      setBookings((prev) => {
        const next = prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" as const } : b
        );
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
        }
        return next;
      });
      notify("Booking cancelled and card refund initiated", "warning");
    },
    [notify]
  );

  const getExtraOccupiedSeats = useCallback(
    (showtimeId: string): string[] => {
      return bookings
        .filter((b) => b.status === "confirmed" && b.showtime.id === showtimeId)
        .flatMap((b) => b.seats.map((s) => s.id));
    },
    [bookings]
  );

  const activeHall = useMemo(
    () => CINEMA_HALLS.find((h) => h.id === selectedHallId) ?? CINEMA_HALLS[0],
    [selectedHallId]
  );

  return (
    <CinemaContext.Provider
      value={{
        halls: CINEMA_HALLS,
        selectedHallId,
        activeHall,
        setSelectedHallId,
        user,
        authModalOpen,
        openAuthModal: () => setAuthModalOpen(true),
        closeAuthModal: () => setAuthModalOpen(false),
        signInWithSocial,
        signInWithEmail,
        signOut,
        addSavedCard,
        removeSavedCard,
        setDefaultCard,
        bookings,
        addBooking,
        cancelBooking,
        getExtraOccupiedSeats,
        notify,
      }}
    >
      {children}

      {/* Global Toast Stack */}
      <div
        aria-live="polite"
        className="fixed bottom-20 md:bottom-6 right-4 z-[80] flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg border text-sm font-medium shadow-2xl backdrop-blur-md transition-all ${
              toast.tone === "success"
                ? "bg-white border-white text-[#09090B]"
                : toast.tone === "warning"
                ? "bg-[#DC2626] border-[#DC2626] text-white"
                : "bg-[#141418]/95 border-white/20 text-white"
            }`}
          >
            {toast.text}
          </div>
        ))}
      </div>
    </CinemaContext.Provider>
  );
}

export function useCinema(): CinemaContextValue {
  const ctx = useContext(CinemaContext);
  if (!ctx) {
    throw new Error("useCinema must be used inside CinemaProvider");
  }
  return ctx;
}
