import type { CardNetwork } from "@/types/cinema";

export function detectCardNetwork(rawNumber: string): CardNetwork {
  const digits = rawNumber.replace(/\D/g, "");
  if (!digits) return "unknown";
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(6011|65|64[4-9])/.test(digits)) return "discover";
  return "unknown";
}

export function formatCardNumber(rawNumber: string): string {
  const digits = rawNumber.replace(/\D/g, "").slice(0, 16);
  const network = detectCardNetwork(digits);
  if (network === "amex") {
    const trimmed = digits.slice(0, 15);
    const p1 = trimmed.slice(0, 4);
    const p2 = trimmed.slice(4, 10);
    const p3 = trimmed.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function isValidCardLuhn(rawNumber: string): boolean {
  const digits = rawNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 16) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function formatCardExpiry(rawExpiry: string): string {
  const digits = rawExpiry.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isValidCardExpiry(expiry: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim());
  if (!match) return false;
  const month = Number.parseInt(match[1], 10);
  const year = 2000 + Number.parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function formatReadableDate(dateIso: string): string {
  const d = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateIso;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getCardNetworkLabel(network?: CardNetwork): string {
  switch (network) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    case "discover":
      return "Discover";
    default:
      return "Card";
  }
}
