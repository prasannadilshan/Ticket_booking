# Astor Film Hall — Cinema Ticket Booking Platform

A modern, mobile-responsive cinema ticket booking web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Implemented Features

- **Film Hall Branch & Screen Selection**: Switch across three cinema branches (*Astor Downtown*, *Astor Westside*, *Astor Heritage*) with auditorium amenities and transit details.
- **Film Discovery & Daily Schedule**: Browse *Now Showing*, *70mm & Archival*, and *Coming Soon* titles, filter by genre or projection format (`IMAX 70mm`, `Dolby Atmos`, `Dolby Vision`, `35mm Print`, `4DX`, `RealD 3D`), search by cast/director, and inspect a 7-day rolling showtime matrix.
- **Interactive Auditorium Seat Map**: Tiered seating (*Standard*, *Executive Prime*, *VIP Recliner Suite*), wheelchair & companion accessible bays, quick "Best Seats" auto-selection, mobile zoom controls, and an 8-minute temporary seat hold countdown timer.
- **Concessions Pre-Order**: Categorized cinema food & beverage menu (*Combos*, *Popcorn*, *Drinks*, *Bites*) with dietary badges, flavor selectors, and *Express Counter Pickup* vs *Quiet In-Seat Delivery*.
- **Social Login & Astor Film Pass**: Instant OAuth-style sign-in with **Google**, **Apple**, **Facebook**, and **GitHub** (plus email sign-in or guest checkout), loyalty tier tracking (`Silver` / `Gold` / `Noir Member`), and saved card management.
- **Card Payment Options**: Interactive 3D credit/debit card preview with live front/back flip, automatic Visa/Mastercard/Amex/Discover network detection, Luhn validation, expiry & CVC checks, saved cards, promo codes (`ASTOR15`, `MATINEE10`, `VIP20`), and Apple Pay / Google Pay express tabs.
- **QR E-Tickets & Downloadable PDF Receipts**: Real scannable QR codes (`qrcode`), lobby brightness boost toggle, browser print styling, and client-side PDF tax receipt & boarding pass downloads (`jspdf`) stored in the `/bookings` ticket wallet.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
