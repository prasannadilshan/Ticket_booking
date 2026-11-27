import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CinemaProvider } from "@/context/CinemaContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Astor Film Hall — Cinema Tickets, Showtimes & Concessions",
    template: "%s · Astor Film Hall",
  },
  description:
    "Reserve auditorium seats, pre-order artisan cinema concessions, pay securely by card or digital wallet, and download instant QR PDF receipts.",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#09090B] text-white selection:bg-[#DC2626]/35 selection:text-white">
        <CinemaProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </CinemaProvider>
      </body>
    </html>
  );
}
