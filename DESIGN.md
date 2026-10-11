---
name: MakassarNotebook — Selebaran Harian Pasar
description: Storefront homepage as a warm daily-market broadsheet proving cheapest price per line.
colors:
  paper: "#f5efe1"
  paper-deep: "#e9dfc9"
  press-ink: "#1c1917"
  body-ink: "#2b2620"
  muted-ink: "#5b554b"
  faint-ink: "#8a8175"
  stamp: "#0099ff"
  stamp-deep: "#007acc"
  marker: "#ff6000"
  marker-deep: "#e05500"
  urgent: "#d32f2f"
  contact-navy: "#166397"
  hairline: "#e5e5e5"
  ink-ground: "#141210"
  kolofon-ground: "#1a1714"
typography:
  display:
    fontFamily: "'Archivo Black', 'Archivo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.65rem–2rem (sampul clamp up on sm+)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Archivo', 'Inter', 'Instrument Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px base, 13px SEO measure"
    fontWeight: 400
    lineHeight: 1.5
  ticket:
    fontFamily: "'Archivo Narrow', 'Archivo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "10px–16px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  measure:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace"
    fontSize: "9px–11px"
    fontWeight: 700
    letterSpacing: "0.14em"
rounded:
  sm: "8px"
  md: "12px"
  pill: "9999px"
spacing:
  sm: "8px"
  md: "12px"
  lg: "24px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.marker}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.marker-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-ink:
    backgroundColor: "{colors.press-ink}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "10px 32px"
  pill-active:
    backgroundColor: "{colors.press-ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  pill-idle:
    backgroundColor: "{colors.press-ink}/[0.06]"
    textColor: "{colors.body-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  stamp-badge:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.press-ink}"
    rounded: "6px"
    padding: "2px 6px"
  input-search:
    backgroundColor: "#f0f0f0"
    textColor: "{colors.body-ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  wa-float:
    backgroundColor: "{colors.press-ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
---

# Design System: MakassarNotebook — Selebaran Harian Pasar

## Overview

**Creative North Star: "Selebaran Harian Pasar"**

The homepage is a warm daily-market broadsheet, not a catalogue: paper ground, press ink, and stamp-blue proof on every price line. Density is editorial — hairline rules and numbered rows carry the rhythm, while imagery lives inside a single cover panel and a three-slot ad rail. Urgency is rationed: only the Banjir Harga band and its countdown are allowed to shout in red.

Brand commitments from PRODUCT.md that constrain this system: makassarbook/notebook wordmark, stamp blue (#0099FF) for interaction, marker orange (#FF6000) for trade accent, #SudahPastiMurahnya tagline, and untouched factual copy (addresses, hours, prices). Everything else on this surface is the new replacement world.

**Key Characteristics:**
- Paper ground (#f5efe1 / #e9dfc9) with press-ink (#1c1917) rules, never nested cards
- Every cheap-price claim carries proof: strikethrough + rotated ink % stamp + midnight-WITA deadline
- Condensed ticket numerals (Archivo Narrow, tabular) for all prices
- Ink pills for etalase tabs; numbered rows for Paling dicari and Redaksi
- Dark world is a functional ink-black counterpart, not a separate brand

## Colors

Warm newsprint ground with ink text; blue is the proof stamp, orange the marker, red the countdown-only alarm.

### Primary
- **Press Ink** (#1c1917): Display headlines, section rules (2px), active pills, ink buttons, toast and WA float grounds.
- **Stamp Blue** (#0099FF / deep #007ACC): Price-proof links, brand kicker, badge mono labels, map/contact accents.

### Secondary
- **Marker Orange** (#FF6000 / hover #E05500): Primary trade action only — "Serbu edisi ini" CTA, sampul price-tag stamp border, category glyph.

### Tertiary
- **Contact Navy** (#166397): Contact-center module header only; never a second CTA color.

### Neutral
- **Paper** (#f5efe1): Page ground.
- **Paper Deep** (#e9dfc9): Kolofon footer ground, ticket image wells.
- **Body Ink** (#2b2620): Body copy on paper.
- **Muted Ink** (#5b554b): Dateline, captions, bukti sublabels.
- **Faint Ink** (#8a8175): Struck originals, count metadata.
- **Hairline** (#e5e5e5): Borders, dividers (`/12` ink tints for row rules).
- **Ink Ground** (#141210): Dark-mode page ground; kolofon deep (#1a1714).
- **Urgent Red** (#D32F2F): Countdown-only. Never badges, prices, or decoration.

### Named Rules
**The Countdown-Only Red Rule.** Urgent red appears solely in the Banjir Harga deadline context; anywhere else it is a defect.
**The No-Nested-Cards Rule.** Rows, rails, and strips are separated by hairlines and rules, never cards inside cards.

## Typography

**Display Font:** Archivo Black (with Archivo fallback)
**Body Font:** Archivo 400–800 (with Inter, Instrument Sans fallback)
**Label/Mono Font:** System mono stack (ui-monospace, SF Mono, Cascadia Mono, Menlo, Consolas) for measurement only (datelines, countdowns, counts, badges)

**Character:** Loud condensed display on the cover, narrow tabular tickets for money, quiet mono for anything measured.

### Hierarchy
- **Display** (Archivo Black 400, 1.65rem–2rem+, 1.02): Sampul cover title and section heads (Jelajahi edisi, Banjir Harga, Etalase pilihan, Sorotan redaksi).
- **Title** (Archivo 700, 13–14px): Redaksi headlines, contact module titles.
- **Body** (Archivo 400–500, 12px; SEO column 13px relaxed): Descriptions, footer links, branch addresses.
- **Ticket** (Archivo Narrow 600–700, 10–16px, tabular): All prices, % stamps, payment chips.
- **Label** (mono 700, 9–11px, 0.14em uppercase): Dateline, countdown, badge kickers, counts.

### Named Rules
**The Tickets-Are-Narrow Rule.** Money is always set in Archivo Narrow with tabular numerals; body/mono faces never price anything.
**The 75ch Measure Rule.** Long reading (SEO column) caps at 75ch; redaksi excerpts cap near 72ch.

## Layout

Twelve-column page on a 1200px container (1400px xl, 1620px 2xl). First viewport: sticky masthead dateline, header row (Kategori / wordmark / "cari di edisi ini" / cart / account), then sampul cover (8 cols) + iklan rail (4 cols: two side-by-side tiles over one wide tile). Below: indeks rail, Banjir Harga band, direktori rail, video strip, numbered Paling dicari rows, etalase tab grid (2 / 4 / 8 cols), numbered redaksi rows, bukti strip, 75ch SEO column, kolofon footer with contact-center module. Section rhythm is 32px (mt-8) with 2px ink section rules; row dividers are hairline ink tints. Responsive: rails scroll horizontally with arrow controls on small screens; etalase grid collapses 8→4→2.

## Elevation & Depth

Flat-by-default newsprint; depth comes from ink rules and tonal paper steps, not shadows.

### Shadow Vocabulary
- **Cover lift** (`box-shadow: 0 24px 44px -24px rgb(28 25 23 / 0.5)`): Sampul cover panel only.
- **Toast/float lift** (`box-shadow: 0 18px 36px -16px rgb(28 25 23 / 0.55)`): Cart toast and ink WA float only.

### Named Rules
**The Flat-By-Default Rule.** No card shadows anywhere in the rails, grids, or rows; the two lifts above are the entire vocabulary.

## Shapes

Gently rounded print artifacts on a hard-ruled sheet: cover, ad tiles, image wells, and inputs at 12px; buttons, search, and newsletter fields at 8px; tabs, counts, and the WA float as full pills. Signature geometry: the rotated ink % stamp (2px ink border, -3deg rotation) and the -2deg marker-bordered price tag on the sampul. Hairline dividers (`divide-ink/12`) are the default separator; 2px ink rules open every section and frame the masthead and kolofon.

## Components

### Buttons
- **Shape:** Gently rounded (8px); pills only for tabs.
- **Primary:** Marker orange ground, white bold 12px text (10px 20px); hover marker-deep; active presses to 0.98/0.95 scale.
- **Hover / Focus:** Underline for text links; scale press for solid buttons; global `:focus-visible` 2px stamp ring offset 2px.
- **Secondary / Ink:** Press-ink ground, white text (10px 32px); hover stamp-deep; dark-world inverse (paper ground, ink text).

### Chips
- **Etalase pills:** Idle ink/6 wash with body-ink text; selected solid press-ink with white text; stamp-blue "Buka Halaman Kategori" link follows when filtered.
- **Search suggestion chips:** Grey wash pills turning stamp wash + stamp text on hover.

### Cards / Containers
- **Corner Style:** No cards. Product ticket = 12px paper-deep image well + unboxed text stack (badge kicker, 2-line title, ticket price, struck original).
- **Background:** Paper wells (#e9dfc9); dark-world grey-800/70.
- **Shadow Strategy:** None (see Flat-By-Default Rule).
- **Border:** None on tickets; 2px ink border on % stamps only.

### Inputs / Fields
- **Style:** 8px rounded, grey wash ground, hairline border; search 36–40px with inner shadow; newsletter white field on paper-deep footer.
- **Focus:** Stamp border + white ground; caret stamp blue; global focus-visible ring.
- **Error / Disabled:** None evidenced; newsletter resolves inline to an emerald-bordered success status, never a toast.

### Navigation
- Masthead dateline (mono date + branch switcher + rotating branch-hours ticker); sticky white header; category drawer (left slide-in, department list + sub-list, quick search, empty states); branch modal (card picker). Rail arrows are 28px ink-ringed circles. Skip link targets the etalase grid.

### Sampul Cover + Iklan Rail
- Cover: full-bleed photo with black-gradient ticket panel (marker-bordered price tag, display title, subtitle, mono WITA deadline, Serbu CTA), manual dots + arrows, no autorotate, rise-in on slide change. Rail: three ad tiles with bottom-gradient captions, hover 1.04 image scale.

### Banjir Harga Band
- Section rule + mono countdown-to-midnight-WITA (`role=timer`); ticket grid with rotated ink % stamps running stamp-pulse motion; struck mono originals under narrow ticket prices; "Serbu" anchors to this band.

### Paling Dicari Rows
- Ten numbered ticket-numeral rows (thumb well + bold title + mono count), hairline dividers, hover underline.

### Sorotan Redaksi Rows
- Five numbered rows (01–05 + read time in mono), 64/120px thumb, bold headline with hover underline, 2-line excerpt.

### Bukti Strip
- Five proof pillars in one bordered strip (icon + bold label + caption), no cards; dividers only at lg.

### Kolofon Footer + Contact Center
- Paper-deep footer with 2px ink top rule: app badges, three link columns, newsletter module (inline success), navy-headed contact-center module (branch select, address, map link, sales WA, hours, Idul Fitri closure note), payment chips (BCA/Mandiri/BNI/BRI/QRIS), copyright line.

### WA Float
- Fixed ink pill (MessageCircle icon + "Butuh bantuan? Hubungi kami"), wa.me link, hover stamp-deep, active press.

## Do's and Don'ts

### Do:
- **Do** prove every cheap-price claim with strikethrough + % stamp + WITA deadline on the same ticket.
- **Do** set all money in Archivo Narrow tabular and all measurement in system mono.
- **Do** separate rows and rails with hairline ink dividers; reserve 2px rules for section openings, masthead, and kolofon.
- **Do** keep urgent red inside the countdown context only.
- **Do** resolve newsletter signup inline with the emerald success status; keep empty states (category, drawer) with icon + recovery link.

### Don't:
- **Don't** use nested cards anywhere on this surface — wells and rules, not boxes in boxes.
- **Don't** add autorotate to the sampul, shadows to tickets, or red outside the countdown.
- **Don't** price anything in body or mono faces, or measure anything in display/ticket faces.
- **Don't** invent testimonials, ratings, or new numeric claims — PRODUCT.md forbids fabricated proof.
- **Don't** restyle the wordmark, stamp blue, marker orange, tagline, or factual copy (addresses, hours, prices).
