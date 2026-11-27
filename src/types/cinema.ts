export type ScreeningFormat =
  | "IMAX 70mm"
  | "Dolby Atmos"
  | "Dolby Vision"
  | "35mm Print"
  | "4DX"
  | "RealD 3D"
  | "4K Laser";

export type FilmGenre =
  | "Sci-Fi"
  | "Neo-Noir"
  | "Drama"
  | "Action"
  | "Animation"
  | "Music";

export interface CinemaHall {
  id: string;
  name: string;
  shortName: string;
  neighborhood: string;
  address: string;
  city: string;
  screensCount: number;
  amenities: string[];
  transitNote: string;
}

export interface TrailerScene {
  timestamp: string;
  title: string;
  caption: string;
  cameraSpec: string;
}

export interface Film {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  director: string;
  cast: string[];
  genre: FilmGenre;
  secondaryGenre: string;
  durationMins: number;
  rating: "G" | "PG" | "PG-13" | "R";
  ratingNote: string;
  releaseStatus: "now_showing" | "coming_soon";
  releaseDateLabel: string;
  isSpecial70mm?: boolean;
  formats: ScreeningFormat[];
  aspectRatio: string;
  soundSystem: string;
  language: string;
  subtitles: string;
  synopsis: string;
  posterUrl: string;
  heroUrl: string;
  criticScore: number;
  audienceScore: number;
  trailerScenes: TrailerScene[];
}

export type AvailabilityLevel = "plenty" | "filling_fast" | "almost_full" | "sold_out";

export interface Showtime {
  id: string;
  filmId: string;
  hallId: string;
  screenName: string;
  dateIso: string; // YYYY-MM-DD
  time24: string; // HH:mm
  timeLabel: string; // e.g., 19:30
  dayPart: "Morning" | "Matinee" | "Evening" | "Late";
  format: ScreeningFormat;
  languageTag: string;
  basePrice: number;
  availability: AvailabilityLevel;
  seatsRemaining: number;
  totalSeats: number;
}

export type SeatTier = "standard" | "executive" | "vip_recliner";
export type SeatStatus = "available" | "occupied" | "selected";

export interface Seat {
  id: string; // e.g., "D-07"
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  isAccessible: boolean;
  isCompanion: boolean;
  isOccupied: boolean;
}

export interface SeatRow {
  rowLabel: string;
  tier: SeatTier;
  tierLabel: string;
  seats: Seat[];
}

export type ConcessionCategory = "Combos" | "Popcorn" | "Drinks" | "Bites";

export interface ConcessionItem {
  id: string;
  name: string;
  category: ConcessionCategory;
  description: string;
  price: number;
  calories: string;
  dietaryTags: string[];
  flavors?: string[];
  badge?: string;
}

export interface SelectedConcession {
  item: ConcessionItem;
  quantity: number;
  selectedFlavor?: string;
}

export type DeliveryMode = "express_counter" | "in_seat";

export type SocialProvider = "google" | "apple" | "facebook" | "github" | "email";

export type CardNetwork = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export interface SavedCard {
  id: string;
  network: CardNetwork;
  last4: string;
  expiry: string;
  holderName: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider: SocialProvider;
  initials: string;
  tier: "Silver" | "Gold" | "Noir Member";
  points: number;
  savedCards: SavedCard[];
}

export interface PromoCodeRule {
  code: string;
  description: string;
  type: "percent_tickets" | "flat_order" | "percent_all";
  value: number;
  minTickets?: number;
}

export interface PaymentSummary {
  method: "card" | "apple_pay" | "google_pay";
  cardNetwork?: CardNetwork;
  last4?: string;
  holderName?: string;
  authCode: string;
  transactionId: string;
  paidAtIso: string;
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  createdAtIso: string;
  status: "confirmed" | "cancelled";
  hall: CinemaHall;
  film: Film;
  showtime: Showtime;
  seats: Seat[];
  concessions: SelectedConcession[];
  deliveryMode: DeliveryMode;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ticketsSubtotal: number;
  concessionsSubtotal: number;
  bookingFee: number;
  taxAmount: number;
  discountAmount: number;
  pointsRedeemed: number;
  pointsEarned: number;
  promoApplied?: string;
  totalPaid: number;
  payment: PaymentSummary;
  qrPayload: string;
}
