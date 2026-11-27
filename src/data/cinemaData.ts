import type {
  CinemaHall,
  ConcessionItem,
  Film,
  PromoCodeRule,
  Seat,
  SeatRow,
  SeatTier,
  Showtime,
} from "@/types/cinema";

export const CINEMA_HALLS: CinemaHall[] = [
  {
    id: "astor-downtown",
    name: "Astor Downtown Flagship",
    shortName: "Astor Downtown",
    neighborhood: "Arts District",
    address: "418 Mercer St, Arts District, NY 10013",
    city: "New York",
    screensCount: 8,
    amenities: ["IMAX 70mm", "Dolby Atmos", "Heated Recliners", "Valet & Garage"],
    transitNote: "2 min walk from Canal St Station · Validated 4h garage parking",
  },
  {
    id: "astor-westside",
    name: "Astor Westside Pavilion",
    shortName: "Astor Westside",
    neighborhood: "Hudson Yards",
    address: "215 Eleventh Ave, Westside, NY 10001",
    city: "New York",
    screensCount: 6,
    amenities: ["Dolby Vision", "4DX Motion", "In-Seat Lounge Dining", "Artisan Bar"],
    transitNote: "Direct elevator access from High Line Plaza · Step-free entry",
  },
  {
    id: "astor-heritage",
    name: "Astor Heritage 1929",
    shortName: "Astor Heritage",
    neighborhood: "Upper West",
    address: "890 Broadway Terrace, Upper West, NY 10024",
    city: "New York",
    screensCount: 4,
    amenities: ["35mm Archival", "Meyer Sound Acoustics", "Balcony Suites", "Espresso Salon"],
    transitNote: "Historic landmark hall · 1 block from 86th St subway entrance",
  },
];

export const FILMS: Film[] = [
  {
    id: "meridian-zero",
    slug: "meridian-zero",
    title: "Meridian Zero",
    tagline: "Beyond the orbital ring, silence keeps its own gravity.",
    director: "Claire Vance",
    cast: ["Devon Brooks", "Hana Sato", "Marcus Sterling", "Nora Lind"],
    genre: "Sci-Fi",
    secondaryGenre: "Architectural Thriller",
    durationMins: 148,
    rating: "PG-13",
    ratingNote: "Intense sequences, brief strong language",
    releaseStatus: "now_showing",
    releaseDateLabel: "Now Screening",
    isSpecial70mm: true,
    formats: ["IMAX 70mm", "Dolby Atmos", "4K Laser"],
    aspectRatio: "1.43:1 / 2.20:1",
    soundSystem: "12-Channel Dolby Atmos",
    language: "English",
    subtitles: "Open Captions at 14:15",
    synopsis:
      "When a deep-orbit telemetry station goes dark six hours before solar alignment, structural engineer Mara Vance enters an abandoned ring megastructure to recover the final acoustic black box before orbital decay.",
    posterUrl: "/images/posters/meridian-zero.jpg",
    heroUrl: "/images/meridian-hero.jpg",
    criticScore: 94,
    audienceScore: 96,
    trailerScenes: [
      {
        timestamp: "00:18",
        title: "Orbital Ring Approach",
        caption: "70mm wide aperture shot along the unlit steel truss perimeter.",
        cameraSpec: "IMAX MSM 9802 · 35mm Prime",
      },
      {
        timestamp: "01:04",
        title: "Airlock Telemetry Failure",
        caption: "Sub-bass acoustic resonance drops as hull pressure stabilizes.",
        cameraSpec: "Dolby Atmos Stem · 64-Track",
      },
      {
        timestamp: "01:49",
        title: "Gate Illumination",
        caption: "Amber horizon light cuts across the central horizon chamber.",
        cameraSpec: "Kodak 500T 65mm Stock",
      },
    ],
  },
  {
    id: "velvet-harbor",
    slug: "velvet-harbor",
    title: "Velvet Harbor",
    tagline: "Every tide leaves one witness behind.",
    director: "Tomas Lindqvist",
    cast: ["Elena Rostova", "Julian Cole", "Victor Hale", "Samira Patel"],
    genre: "Neo-Noir",
    secondaryGenre: "Mystery",
    durationMins: 124,
    rating: "R",
    ratingNote: "Noir violence, adult themes, language",
    releaseStatus: "now_showing",
    releaseDateLabel: "Now Screening",
    isSpecial70mm: false,
    formats: ["Dolby Vision", "35mm Print", "4K Laser"],
    aspectRatio: "2.39:1 Anamorphic",
    soundSystem: "Dolby Atmos",
    language: "English",
    subtitles: "English SDH Available",
    synopsis:
      "A dockside insurance investigator traces a missing shipping manifest through rain-soaked winter piers, uncovering a twenty-year pact between harbor pilots and a vanished jazz trumpeter.",
    posterUrl: "/images/posters/velvet-harbor.jpg",
    heroUrl: "/images/auditorium-hero.jpg",
    criticScore: 91,
    audienceScore: 89,
    trailerScenes: [
      {
        timestamp: "00:14",
        title: "Pier 19 Midnight Fog",
        caption: "Sodium vapor streetlamp cuts across wet basalt cobblestones.",
        cameraSpec: "Panavision C-Series Anamorphic",
      },
      {
        timestamp: "00:58",
        title: "The Drydock Ledger",
        caption: "An unmarked brass key reveals a sealed cargo vault.",
        cameraSpec: "35mm Kodak 250D",
      },
      {
        timestamp: "01:36",
        title: "Harbor Bell Resonance",
        caption: "Final confrontation beneath the foghorn tower at 03:00.",
        cameraSpec: "Dolby Vision 4K Master",
      },
    ],
  },
  {
    id: "glass-conservatory",
    slug: "glass-conservatory",
    title: "The Glass Conservatory",
    tagline: "Some architectures are built to shelter what cannot bloom in daylight.",
    director: "Sofia Marchetti",
    cast: ["Clara Bennett", "Lucas Moreau", "Helena Frost"],
    genre: "Drama",
    secondaryGenre: "Period Romance",
    durationMins: 116,
    rating: "PG-13",
    ratingNote: "Thematic elements",
    releaseStatus: "now_showing",
    releaseDateLabel: "Festival Selection",
    isSpecial70mm: true,
    formats: ["35mm Print", "4K Laser"],
    aspectRatio: "1.85:1 Spherical",
    soundSystem: "Meyer Sound Cinema",
    language: "English & French",
    subtitles: "English Subtitles",
    synopsis:
      "In 1898 Vienna, a botanical illustrator hired to catalog a crumbling royal glasshouse discovers letters hidden inside iron mullions that redraw the history of the estate.",
    posterUrl: "/images/posters/glass-conservatory.jpg",
    heroUrl: "/images/auditorium-hero.jpg",
    criticScore: 96,
    audienceScore: 92,
    trailerScenes: [
      {
        timestamp: "00:22",
        title: "Blue Hour Entrance",
        caption: "Lantern glow diffuses across misted glass panes in twilight rain.",
        cameraSpec: "Arriflex 535B · Cooke S4",
      },
      {
        timestamp: "01:12",
        title: "Folio IV Sketchbook",
        caption: "Candlelit restoration of botanical ink studies.",
        cameraSpec: "35mm Archival Print",
      },
    ],
  },
  {
    id: "kinetic-protocol",
    slug: "kinetic-protocol",
    title: "Kinetic Protocol",
    tagline: "Four minutes across the city grid. Zero margin.",
    director: "Kenji Takahashi",
    cast: ["Idris Vance", "Nadia Volkov", "Ryo Tanaka"],
    genre: "Action",
    secondaryGenre: "Espionage",
    durationMins: 138,
    rating: "R",
    ratingNote: "Sustained action choreography and intensity",
    releaseStatus: "now_showing",
    releaseDateLabel: "Now Screening",
    formats: ["4DX", "Dolby Atmos", "4K Laser"],
    aspectRatio: "2.39:1 Scope",
    soundSystem: "Dolby Atmos + 4DX Motion",
    language: "English / Japanese",
    subtitles: "Burned-in English Subtitles",
    synopsis:
      "When an encrypted transit courier loses clearance mid-route across Tokyo's elevated highways, a retired extraction specialist has until dawn to rewrite the city's signal grid.",
    posterUrl: "/images/posters/kinetic-protocol.jpg",
    heroUrl: "/images/auditorium-hero.jpg",
    criticScore: 87,
    audienceScore: 93,
    trailerScenes: [
      {
        timestamp: "00:11",
        title: "Overpass Intercept",
        caption: "Tungsten tail-lights streak beneath rain-lashed concrete spans.",
        cameraSpec: "RED V-Raptor XL · Hawk Anamorphic",
      },
      {
        timestamp: "00:55",
        title: "Signal Relay Blackout",
        caption: "Precision hand-to-hand sequence inside a glass skybridge.",
        cameraSpec: "120fps Shutter · 4DX Sync",
      },
    ],
  },
  {
    id: "canyon-echo",
    slug: "canyon-echo",
    title: "Canyon Echo",
    tagline: "Follow the wind where maps end.",
    director: "Maya Chen",
    cast: ["Leo Morales", "Aria Lin", "Owen Mercer"],
    genre: "Animation",
    secondaryGenre: "Adventure",
    durationMins: 102,
    rating: "PG",
    ratingNote: "Mild peril, family adventure",
    releaseStatus: "now_showing",
    releaseDateLabel: "Family Matinee",
    formats: ["RealD 3D", "4K Laser"],
    aspectRatio: "1.85:1",
    soundSystem: "Dolby Atmos",
    language: "English",
    subtitles: "Descriptive Audio Available",
    synopsis:
      "Equipped with a brass lantern and folded paper gliders that carry spoken memories, a young cartographer crosses the red-rock spires to return a lost melody to her valley.",
    posterUrl: "/images/posters/canyon-echo.jpg",
    heroUrl: "/images/auditorium-hero.jpg",
    criticScore: 95,
    audienceScore: 97,
    trailerScenes: [
      {
        timestamp: "00:19",
        title: "Sandstone Overlook",
        caption: "Hand-painted canyon light shifts from amber noon to slate dusk.",
        cameraSpec: "4K Hand-Inked Digital Frame",
      },
      {
        timestamp: "01:08",
        title: "Flight of the Paper Glider",
        caption: "Sweeping thermal glide through resonant desert arches.",
        cameraSpec: "RealD 3D Stereoscopic",
      },
    ],
  },
  {
    id: "nocturne-in-b",
    slug: "nocturne-in-b",
    title: "Nocturne in B Minor",
    tagline: "One stage. Ninety-six keys. Uncut in single-take acoustic clarity.",
    director: "Henrik Solberg",
    cast: ["Oslo Chamber Collective", "Soren Dahl"],
    genre: "Music",
    secondaryGenre: "Concert Film",
    durationMins: 109,
    rating: "G",
    ratingNote: "All ages concert presentation",
    releaseStatus: "coming_soon",
    releaseDateLabel: "Opens Dec 4",
    isSpecial70mm: true,
    formats: ["Dolby Atmos", "35mm Print"],
    aspectRatio: "1.66:1 European",
    soundSystem: "Uncompressed 96kHz Atmos",
    language: "Instrumental / Norwegian",
    subtitles: "Program Notes On-Screen",
    synopsis:
      "Recorded live without an audience inside Oslo's timber 1912 concert hall, this intimate concert film captures the preparation, silence, and thunderous resonance of a midnight solo recital.",
    posterUrl: "/images/posters/nocturne-in-b.jpg",
    heroUrl: "/images/auditorium-hero.jpg",
    criticScore: 98,
    audienceScore: 95,
    trailerScenes: [
      {
        timestamp: "00:25",
        title: "Tuning the Soundboard",
        caption: "Overhead tungsten beam reveals fine rosin dust above the strings.",
        cameraSpec: "Sony Venice 2 · Leica Summilux",
      },
      {
        timestamp: "01:15",
        title: "Movement III Cadenza",
        caption: "Unbroken seven-minute circular dolly around the Steinway D.",
        cameraSpec: "96kHz Spatial Microphones",
      },
    ],
  },
];

export const CONCESSIONS: ConcessionItem[] = [
  {
    id: "combo-astor-duo",
    name: "The Astor Double Feature",
    category: "Combos",
    description: "Large artisan truffle or butter popcorn, two craft sodas, and warm spiced pretzels.",
    price: 24.5,
    calories: "1,180 kcal",
    dietaryTags: ["Best Value"],
    flavors: ["Cultured Butter", "Black Truffle Salt", "Salted Caramel"],
    badge: "Save $6.50",
  },
  {
    id: "combo-solo-noir",
    name: "Solo Screening Pairing",
    category: "Combos",
    description: "Medium signature popcorn paired with any cold-pressed sparkling tonic or iced brew.",
    price: 14.5,
    calories: "620 kcal",
    dietaryTags: ["Gluten-Free"],
    flavors: ["Cultured Butter", "Black Truffle Salt", "Sea Salt Olive Oil"],
  },
  {
    id: "popcorn-truffle",
    name: "Heirloom Kernel Popcorn",
    category: "Popcorn",
    description: "Air-popped mushroom kernels finished to order with clarified cultured butter or truffle.",
    price: 9.5,
    calories: "490 kcal",
    dietaryTags: ["Gluten-Free", "Vegan Option"],
    flavors: ["Black Truffle Salt", "Cultured Butter", "Smoked Paprika"],
    badge: "House Favorite",
  },
  {
    id: "popcorn-caramel",
    name: "Burnt Sugar & Pecan Kettle",
    category: "Popcorn",
    description: "Small-batch copper-kettle caramel glaze folded with toasted Georgia pecans and sea salt.",
    price: 10.75,
    calories: "640 kcal",
    dietaryTags: ["Vegetarian"],
  },
  {
    id: "drink-blood-orange",
    name: "Blood Orange Botanical Spritz",
    category: "Drinks",
    description: "Cold-pressed Sicilian blood orange, rosemary infusion, and crisp mineral fizz.",
    price: 6.75,
    calories: "110 kcal",
    dietaryTags: ["Vegan", "Zero Alcohol"],
  },
  {
    id: "drink-cold-brew",
    name: "Kyoto Single-Origin Cold Brew",
    category: "Drinks",
    description: "16-hour slow-drip dark roast served over hand-cut crystal ice with oat cream option.",
    price: 6.25,
    calories: "45 kcal",
    dietaryTags: ["Vegan", "Gluten-Free"],
    flavors: ["Black Over Ice", "Oat Cream", "Salted Maple"],
  },
  {
    id: "bite-brioche-sliders",
    name: "Wagyu & Aged Cheddar Sliders",
    category: "Bites",
    description: "Two toasted brioche sliders with caramelized shallot jam and truffle mustard.",
    price: 15.5,
    calories: "580 kcal",
    dietaryTags: ["Chef Special"],
    badge: "In-Seat Ready",
  },
  {
    id: "bite-chocolate-bark",
    name: "72% Valrhona Espresso Bark",
    category: "Bites",
    description: "Single-origin dark chocolate shards studded with roasted cacao nibs and flaky Maldon salt.",
    price: 7.5,
    calories: "290 kcal",
    dietaryTags: ["Vegan", "Gluten-Free"],
  },
];

export const PROMO_CODES: PromoCodeRule[] = [
  {
    code: "ASTOR15",
    description: "15% off movie tickets",
    type: "percent_tickets",
    value: 15,
  },
  {
    code: "MATINEE10",
    description: "$10 off bookings with 2+ seats",
    type: "flat_order",
    value: 10,
    minTickets: 2,
  },
  {
    code: "VIP20",
    description: "20% off total tickets & concessions",
    type: "percent_all",
    value: 20,
  },
];

export interface RollingDateOption {
  dateIso: string;
  dayShort: string;
  dateNum: string;
  monthShort: string;
  relativeLabel: string;
}

/**
 * Generates 7 rolling screening dates starting from today (or a stable client/server anchor).
 */
export function getRollingDates(anchorDate: Date = new Date()): RollingDateOption[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result: RollingDateOption[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(anchorDate);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    result.push({
      dateIso: `${yyyy}-${mm}-${dd}`,
      dayShort: days[d.getDay()],
      dateNum: dd,
      monthShort: months[d.getMonth()],
      relativeLabel: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${days[d.getDay()]} ${months[d.getMonth()]} ${dd}`,
    });
  }
  return result;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const TIME_SLOTS: Array<{
  time24: string;
  timeLabel: string;
  dayPart: Showtime["dayPart"];
}> = [
  { time24: "11:15", timeLabel: "11:15", dayPart: "Morning" },
  { time24: "14:15", timeLabel: "14:15", dayPart: "Matinee" },
  { time24: "17:00", timeLabel: "17:00", dayPart: "Matinee" },
  { time24: "19:30", timeLabel: "19:30", dayPart: "Evening" },
  { time24: "21:45", timeLabel: "21:45", dayPart: "Late" },
];

export function getFormatBasePrice(format: Film["formats"][number], dayPart: Showtime["dayPart"]): number {
  const formatPrice: Record<string, number> = {
    "IMAX 70mm": 22.0,
    "Dolby Atmos": 18.5,
    "Dolby Vision": 18.5,
    "4DX": 23.0,
    "35mm Print": 17.5,
    "RealD 3D": 18.0,
    "4K Laser": 15.5,
  };
  const base = formatPrice[format] ?? 16.0;
  if (dayPart === "Morning") return Math.max(12.5, base - 3.0);
  if (dayPart === "Matinee") return Math.max(13.5, base - 1.5);
  return base;
}

/**
 * Deterministically builds showtimes for any film + hall + date combination,
 * guaranteeing stable shareable showtime IDs across page navigations.
 */
export function buildShowtimesForFilm(
  filmId: string,
  hallId: string,
  dates: RollingDateOption[]
): Showtime[] {
  const film = FILMS.find((f) => f.id === filmId);
  if (!film) return [];

  const screenNamesByHall: Record<string, string[]> = {
    "astor-downtown": ["Screen 1 · IMAX Hall", "Screen 2 · Atmos Vault", "Screen 4 · Studio"],
    "astor-westside": ["Screen A · Dolby Pavilion", "Screen B · 4DX Arena", "Screen C · Suites"],
    "astor-heritage": ["Grand Hall · Balcony", "Salon 2 · 35mm Booth"],
  };

  const screens = screenNamesByHall[hallId] ?? ["Screen 1"];
  const showtimes: Showtime[] = [];

  dates.forEach((dateObj, dayIdx) => {
    TIME_SLOTS.forEach((slot, slotIdx) => {
      const seed = hashSeed(`${filmId}-${hallId}-${dayIdx}-${slotIdx}`);
      // Keep 3-4 showtimes per day per film so schedule looks authentic and varied
      if ((seed + dayIdx) % 5 === 0 && slotIdx !== 3) {
        return;
      }

      const format = film.formats[(slotIdx + dayIdx) % film.formats.length];
      const screenName = screens[(slotIdx + seed) % screens.length];
      const totalSeats = 96; // 8 rows x 12 seats

      // Vary occupancy realistically (evening shows fuller)
      const occupancyBias = slot.dayPart === "Evening" ? 58 : slot.dayPart === "Late" ? 44 : 26;
      const occupiedCount = Math.min(91, Math.max(10, occupancyBias + (seed % 34)));
      const seatsRemaining = totalSeats - occupiedCount;

      let availability: Showtime["availability"] = "plenty";
      if (seatsRemaining <= 8) availability = "almost_full";
      else if (seatsRemaining <= 28) availability = "filling_fast";

      const id = `${filmId}__${hallId}__${dateObj.dateIso}__${slot.time24.replace(":", "")}`;
      const languageTag =
        slotIdx === 1 && film.subtitles.includes("Open Captions")
          ? "Open Captions"
          : film.language.includes("French") || film.language.includes("Japanese")
          ? "Subtitled"
          : "Original Audio";

      showtimes.push({
        id,
        filmId,
        hallId,
        screenName,
        dateIso: dateObj.dateIso,
        time24: slot.time24,
        timeLabel: slot.timeLabel,
        dayPart: slot.dayPart,
        format,
        languageTag,
        basePrice: getFormatBasePrice(format, slot.dayPart),
        availability,
        seatsRemaining,
        totalSeats,
      });
    });
  });

  return showtimes;
}

export function resolveShowtimeById(showtimeId: string): {
  showtime: Showtime;
  film: Film;
  hall: CinemaHall;
} | null {
  const parts = showtimeId.split("__");
  if (parts.length !== 4) return null;
  const [filmId, hallId, dateIso, timeCompact] = parts;
  const film = FILMS.find((f) => f.id === filmId);
  const hall = CINEMA_HALLS.find((h) => h.id === hallId);
  if (!film || !hall) return null;

  const anchor = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(anchor.getTime())) return null;

  const dates = getRollingDates(anchor);
  const generated = buildShowtimesForFilm(filmId, hallId, dates);
  const match = generated.find(
    (s) => s.dateIso === dateIso && s.time24.replace(":", "") === timeCompact
  );
  if (match) return { showtime: match, film, hall };

  // Fallback synthesis if someone shares an older/custom showtime link
  const time24 = `${timeCompact.slice(0, 2)}:${timeCompact.slice(2, 4)}`;
  const slot = TIME_SLOTS.find((t) => t.time24 === time24) ?? TIME_SLOTS[3];
  const fallback: Showtime = {
    id: showtimeId,
    filmId,
    hallId,
    screenName: "Screen 1 · Main Hall",
    dateIso,
    time24: slot.time24,
    timeLabel: slot.timeLabel,
    dayPart: slot.dayPart,
    format: film.formats[0],
    languageTag: "Original Audio",
    basePrice: getFormatBasePrice(film.formats[0], slot.dayPart),
    availability: "plenty",
    seatsRemaining: 54,
    totalSeats: 96,
  };
  return { showtime: fallback, film, hall };
}

/**
 * Generates an 8-row x 12-seat auditorium map with Standard, Executive Prime,
 * VIP Recliner tiers, plus dedicated Accessible & Companion bays.
 */
export function buildSeatMapForShowtime(
  showtime: Showtime,
  extraOccupiedSeatIds: string[] = []
): SeatRow[] {
  const rowsConfig: Array<{ rowLabel: string; tier: SeatTier; tierLabel: string; surcharge: number }> = [
    { rowLabel: "A", tier: "standard", tierLabel: "Standard Front", surcharge: -1.5 },
    { rowLabel: "B", tier: "standard", tierLabel: "Standard", surcharge: 0 },
    { rowLabel: "C", tier: "executive", tierLabel: "Executive Prime", surcharge: 2.5 },
    { rowLabel: "D", tier: "executive", tierLabel: "Executive Prime", surcharge: 2.5 },
    { rowLabel: "E", tier: "executive", tierLabel: "Executive Prime", surcharge: 2.5 },
    { rowLabel: "F", tier: "executive", tierLabel: "Executive Prime", surcharge: 2.5 },
    { rowLabel: "G", tier: "vip_recliner", tierLabel: "VIP Recliner Suite", surcharge: 6.5 },
    { rowLabel: "H", tier: "vip_recliner", tierLabel: "VIP Recliner Suite", surcharge: 6.5 },
  ];

  const occupiedTarget = showtime.totalSeats - showtime.seatsRemaining;
  const seed = hashSeed(showtime.id);
  const extraSet = new Set(extraOccupiedSeatIds);

  // Build weighted list of seat coordinates preferring center rows D-F first for natural realism
  const candidates: Array<{ id: string; weight: number }> = [];
  rowsConfig.forEach((r, rIdx) => {
    for (let num = 1; num <= 12; num++) {
      const id = `${r.rowLabel}-${String(num).padStart(2, "0")}`;
      const centerDist = Math.abs(num - 6.5) + Math.abs(rIdx - 4) * 1.4;
      const noise = (hashSeed(`${showtime.id}-${id}`) % 100) / 18;
      candidates.push({ id, weight: centerDist + noise });
    }
  });

  candidates.sort((a, b) => a.weight - b.weight);
  const preBooked = new Set(candidates.slice(0, Math.max(8, occupiedTarget)).map((c) => c.id));
  // Keep accessible seats mostly available unless extra-booked
  if (seed % 3 !== 0) {
    preBooked.delete("A-01");
    preBooked.delete("A-02");
  }
  preBooked.delete("G-01");
  preBooked.delete("G-02");

  return rowsConfig.map((r) => {
    const seats: Seat[] = [];
    for (let num = 1; num <= 12; num++) {
      const id = `${r.rowLabel}-${String(num).padStart(2, "0")}`;
      const isAccessible =
        (r.rowLabel === "A" && (num === 1 || num === 12)) ||
        (r.rowLabel === "G" && num === 1);
      const isCompanion =
        (r.rowLabel === "A" && (num === 2 || num === 11)) ||
        (r.rowLabel === "G" && num === 2);

      const price = Number(Math.max(11.0, showtime.basePrice + r.surcharge).toFixed(2));
      seats.push({
        id,
        row: r.rowLabel,
        number: num,
        tier: r.tier,
        price,
        isAccessible,
        isCompanion,
        isOccupied: preBooked.has(id) || extraSet.has(id),
      });
    }
    return {
      rowLabel: r.rowLabel,
      tier: r.tier,
      tierLabel: r.tierLabel,
      seats,
    };
  });
}

/**
 * Finds contiguous optimal seats prioritizing acoustic sweet-spot rows (D, E, F, G, C, B).
 */
export function findBestAvailableSeats(rows: SeatRow[], count: number): Seat[] {
  const rowPriority = ["E", "D", "F", "G", "C", "H", "B", "A"];
  const rowMap = new Map(rows.map((r) => [r.rowLabel, r]));

  for (const label of rowPriority) {
    const row = rowMap.get(label);
    if (!row) continue;

    // Score contiguous runs of length `count` without crossing center aisle (between 6 and 7) if avoidable
    const validRuns: Array<{ seats: Seat[]; score: number }> = [];
    for (let i = 0; i <= row.seats.length - count; i++) {
      const slice = row.seats.slice(i, i + count);
      if (slice.some((s) => s.isOccupied || s.isAccessible)) continue;
      const crossesAisle = slice.some((s) => s.number === 6) && slice.some((s) => s.number === 7);
      const avgNum = slice.reduce((acc, s) => acc + s.number, 0) / count;
      const centerDist = Math.abs(avgNum - 6.5) + (crossesAisle ? 3.5 : 0);
      validRuns.push({ seats: slice, score: centerDist });
    }

    if (validRuns.length > 0) {
      validRuns.sort((a, b) => a.score - b.score);
      return validRuns[0].seats;
    }
  }

  // Fallback: any available non-occupied seats
  return rows
    .flatMap((r) => r.seats)
    .filter((s) => !s.isOccupied)
    .slice(0, count);
}
