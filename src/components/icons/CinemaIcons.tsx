import React from "react";
import type { CardNetwork } from "@/types/cinema";

interface IconProps {
  className?: string;
}

/**
 * Simple two-letter architectural monogram for Astor Film Hall.
 */
export function AstorTitleMark({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" fill="#DC2626" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="800"
        fontSize="14.5"
        letterSpacing="-0.5"
      >
        AF
      </text>
    </svg>
  );
}

export function SearchLineIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="8.75" cy="8.75" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function MapPinLineIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 17.25C10 17.25 15.25 12.6 15.25 8.5C15.25 5.6 12.9 3.25 10 3.25C7.1 3.25 4.75 5.6 4.75 8.5C4.75 12.6 10 17.25 10 17.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="8.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CalendarLineIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8.5H17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.75 2.75V5.25M13.25 2.75V5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ClockLineIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="6.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.25V10.25L12.75 11.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TicketStubIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 6.25C3 5.42 3.67 4.75 4.5 4.75H15.5C16.33 4.75 17 5.42 17 6.25V8.25C16.03 8.25 15.25 9.03 15.25 10C15.25 10.97 16.03 11.75 17 11.75V13.75C17 14.58 16.33 15.25 15.5 15.25H4.5C3.67 15.25 3 14.58 3 13.75V11.75C3.97 11.75 4.75 10.97 4.75 10C4.75 9.03 3.97 8.25 3 8.25V6.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M11.5 5.25V14.75" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
    </svg>
  );
}

export function PlayFrameIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 7.25L13.25 10L8.5 12.75V7.25Z" fill="currentColor" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M5.5 7.75L10 12.25L14.5 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M15.5 10H4.5M4.5 10L9 5.5M4.5 10L9 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseMarkIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CheckMarkIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 10.5L8.25 14.25L15.75 6.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M10 4.5V15.5M4.5 10H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MinusIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 10H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DownloadDocIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M10 3.75V12.5M10 12.5L6.75 9.25M10 12.5L13.25 9.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14.25V15.5C4 16.05 4.45 16.5 5 16.5H15C15.55 16.5 16 16.05 16 15.5V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PrinterIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M6 7V3.75H14V7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3.5" y="7" width="13" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6" y="11.5" width="8" height="4.75" fill="#0B0C0F" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function LockShieldIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="4.5" y="9" width="11" height="7.75" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9V6.75C7 5.09 8.34 3.75 10 3.75C11.66 3.75 13 5.09 13 6.75V9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CardChipIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="2.75" y="4.75" width="14.5" height="10.5" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.75 8.5H17.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 12.25H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function UserProfileIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="7" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.25 16.5C4.85 13.75 7.15 12.25 10 12.25C12.85 12.25 15.15 13.75 15.75 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MenuLinesIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 6H16.5M3.5 10H16.5M3.5 14H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AccessibleSeatIcon({ className = "w-3.5 h-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10.25" cy="4.25" r="1.5" fill="currentColor" />
      <path
        d="M9.5 7.5V11.5H13.5L15 15.5M8.25 10.25C6.45 10.75 5.25 12.35 5.25 14.25C5.25 16.5 7.05 18.25 9.25 18.25C11.15 18.25 12.75 16.9 13.15 15.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CinemaSeatGlyph({
  variant = "standard",
  className = "w-7 h-7",
}: {
  variant?: "standard" | "executive" | "vip_recliner";
  className?: string;
}) {
  if (variant === "vip_recliner") {
    return (
      <svg viewBox="0 0 28 26" fill="none" className={className} aria-hidden="true">
        <rect x="5" y="3" width="18" height="13" rx="3.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 10.5C3 9.4 3.9 8.5 5 8.5V19H23V8.5C24.1 8.5 25 9.4 25 10.5V19.5C25 21.15 23.65 22.5 22 22.5H6C4.35 22.5 3 21.15 3 19.5V10.5Z" fill="currentColor" fillOpacity="0.28" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 16H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4.5" y="3.5" width="15" height="11.5" rx="3" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.35" />
      <path d="M3.5 14.5H20.5V18.5C20.5 19.6 19.6 20.5 18.5 20.5H5.5C4.4 20.5 3.5 19.6 3.5 18.5V14.5Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

export function ConcessionTrayIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M5.25 7.5L6.5 16.25H13.5L14.75 7.5H5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.25 7.5C6.25 5.8 7.5 4.75 8.85 5.15C9.3 4.05 10.7 4.05 11.15 5.15C12.5 4.75 13.75 5.8 13.75 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8.5 10.25V13.75M11.5 10.25V13.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function SunBoostIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3V4.5M10 15.5V17M3 10H4.5M15.5 10H17M5.05 5.05L6.1 6.1M13.9 13.9L14.95 14.95M14.95 5.05L13.9 6.1M6.1 13.9L5.05 14.95" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function TrashLineIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 6H15.5M7.5 6V4.25H12.5V6M6.5 6L7.25 16H12.75L13.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Official Minimal Brand Icons for Social Logins */
export function GoogleBrandIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.45c-.24 1.26-.96 2.33-2.04 3.04l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.72-.06-1.41-.19-2.02H12z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.75 0 5.06-.91 6.75-2.46l-3.3-2.56c-.91.61-2.08.98-3.45.98-2.65 0-4.9-1.79-5.7-4.2H2.89v2.64C4.57 19.74 8.01 22 12 22z"
      />
      <path
        fill="#4A90E2"
        d="M6.3 13.76c-.2-.61-.32-1.26-.32-1.93s.12-1.32.32-1.93V7.26H2.89A9.96 9.96 0 0 0 2 11.83c0 1.61.39 3.13.89 4.57l3.41-2.64z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.7c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.05 2.68 14.74 1.67 12 1.67 8.01 1.67 4.57 3.93 2.89 7.26L6.3 9.9c.8-2.41 3.05-4.2 5.7-4.2z"
      />
    </svg>
  );
}

export function AppleBrandIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.36 12.7c-.02-2.26 1.85-3.35 1.93-3.4-1.06-1.54-2.7-1.75-3.27-1.78-1.38-.14-2.72.83-3.42.83-.72 0-1.8-.81-2.97-.79-1.51.02-2.92.89-3.7 2.25-1.59 2.75-.41 6.81 1.13 9.04.76 1.09 1.66 2.31 2.84 2.27 1.15-.05 1.59-.74 2.98-.74 1.38 0 1.79.74 2.99.71 1.24-.02 2.02-1.1 2.77-2.2.89-1.28 1.24-2.53 1.26-2.6-.03-.01-2.51-.96-2.54-3.59zM14.12 6.06c.62-.76 1.04-1.8.92-2.85-.89.04-1.99.59-2.63 1.34-.57.66-1.08 1.73-.94 2.75 1 .08 2.02-.48 2.65-1.24z" />
    </svg>
  );
}

export function FacebookBrandIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        fill="#FFFFFF"
        d="M15.4 15.2l.45-2.9h-2.78v-1.88c0-.79.39-1.56 1.64-1.56h1.27V6.39s-1.15-.2-2.25-.2c-2.3 0-3.8 1.39-3.8 3.91v2.2H7.4v2.9h2.53v7h3.14v-7h2.33z"
      />
    </svg>
  );
}

export function GitHubBrandIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.337 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
      />
    </svg>
  );
}

/* Custom Card Network Marks */
export function CardNetworkBadge({
  network,
  className = "h-5 w-8",
}: {
  network: CardNetwork;
  className?: string;
}) {
  if (network === "visa") {
    return (
      <svg viewBox="0 0 48 30" className={className} aria-label="Visa">
        <rect width="48" height="30" rx="5" fill="#17244A" stroke="rgba(255,255,255,0.16)" />
        <text
          x="24"
          y="19.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="sans-serif"
          fontWeight="800"
          fontStyle="italic"
          fontSize="12"
          letterSpacing="0.8"
        >
          VISA
        </text>
      </svg>
    );
  }
  if (network === "mastercard") {
    return (
      <svg viewBox="0 0 48 30" className={className} aria-label="Mastercard">
        <rect width="48" height="30" rx="5" fill="#1A1D24" stroke="rgba(255,255,255,0.16)" />
        <circle cx="19" cy="15" r="7.5" fill="#EB001B" />
        <circle cx="29" cy="15" r="7.5" fill="#F79E1B" fillOpacity="0.88" />
      </svg>
    );
  }
  if (network === "amex") {
    return (
      <svg viewBox="0 0 48 30" className={className} aria-label="American Express">
        <rect width="48" height="30" rx="5" fill="#1F6CB0" stroke="rgba(255,255,255,0.16)" />
        <text
          x="24"
          y="18.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="sans-serif"
          fontWeight="800"
          fontSize="9.5"
          letterSpacing="0.6"
        >
          AMEX
        </text>
      </svg>
    );
  }
  if (network === "discover") {
    return (
      <svg viewBox="0 0 48 30" className={className} aria-label="Discover">
        <rect width="48" height="30" rx="5" fill="#23252C" stroke="rgba(255,255,255,0.16)" />
        <circle cx="32" cy="15" r="5" fill="#E57224" />
        <text x="15" y="18" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="700" fontSize="6.5">
          DISC
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 30" className={className} aria-label="Card">
      <rect width="48" height="30" rx="5" fill="#18181B" stroke="rgba(255,255,255,0.16)" />
      <rect x="7" y="9" width="9" height="6.5" rx="1.2" stroke="#DC2626" strokeWidth="1.2" />
      <path d="M7 21H23" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
