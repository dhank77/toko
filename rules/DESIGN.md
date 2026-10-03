# MakassarNotebook Design System Specification

> **Official Design Rules & Token Fidelity Specification**
> Diadaptasi dari model referensi JakartaNotebook (jakartanotebook.com): high-density omnichannel retail design system.

---

## 1. Design Philosophy & Core Principles

MakassarNotebook employs an **ultra-high-density, high-speed omnichannel retail design language**. Unlike typical generic e-commerce templates that suffer from bloated whitespace and oversized cards, MakassarNotebook's design system (diadaptasi dari model referensi JakartaNotebook) is engineered specifically for power shoppers, tech enthusiasts, resellers, and Pick N Go branch visitors who demand instant product scannability, warehouse pricing transparency, and real-time branch inventory.

### Key Architectural Pillars:
1. **Maximum Information Density**:
   - 8 product cards per row on standard desktop / widescreen (`min-w-[1200px]` to `1920px+`).
   - 10 category cards per row in the Popular Categories grid.
   - 6 video shopping reels per row in the Viral Products section.
   - 13 circular category bubbles in the quick-browse bar.
2. **Signature Colorway**:
   - **Primary Action Blue**: `#0099FF` (hover `#007ACC`, active `#0066CC`, light tint `#E6F5FF`).
   - **Brand Accent Orange**: `#FF6000` / `#FF8500` (used on the slogan `#SudahPastiMurahnya`, Shopping Cart badge, star ratings, and card hover border highlight).
   - **Discount / Urgency Red**: `#D32F2F` / `#FF0000` (used on Flash Sale countdown boxes, discount percentage tags `-%`, and clearance labels).
   - **Contact Center Navy**: `#166397` / `#12527D` (used on the Contact Center header, offline branch service bar, and institutional trust cards).
3. **Clean Crisp Neutral Surfaces**:
   - Canvas background: `#F7F7F7` (soft light neutral canvas).
   - Card container surfaces: `#FFFFFF` (crisp white).
   - Input fields & variant chips: `#F0F0F0` / `#F2F2F2` (subtle gray).
   - Borders & dividers: `#E5E5E5` (standard 1px hairline border) and `#CCCCCC` (inputs & controls).
4. **Card Radius & Geometry**:
   - Card containers: `8px` (`rounded-lg`), subtle hairline border `#E5E5E5`.
   - Buttons: `8px` (`rounded-lg`) or `6px` (`rounded-md`), never circular pill buttons.
   - Badges & Chips: `4px` (`rounded`) or `9999px` (`rounded-full` only for circular bubbles and numerical count badges).

---

## 2. Color System & Design Tokens

### 2.1 Brand & Action Colors
| Token Name | Hex Code | RGB | Purpose & Usage |
|---|---|---|---|
| `color-primary` | `#0099FF` | `rgb(0, 153, 255)` | Primary interactive buttons, hyperlinks, active states, search triggers, brand logo |
| `color-primary-hover` | `#007ACC` | `rgb(0, 122, 204)` | Button hover state, link hover |
| `color-primary-light` | `#E6F5FF` | `rgb(230, 245, 255)` | Outlined button hover, active category pill background, subtle highlight tint |
| `color-orange-brand` | `#FF6000` | `rgb(255, 96, 0)` | Slogan `#SudahPastiMurahnya`, Cart badge, star ratings, product card hover border |
| `color-orange-hover` | `#E05500` | `rgb(224, 85, 0)` | Hover state for orange CTA buttons and badges |
| `color-red-discount` | `#D32F2F` | `rgb(211, 47, 47)` | Flash sale countdown timer boxes, discount percentage tags (`-46%`), clearance badges |
| `color-red-light` | `#FFE6E6` | `rgb(255, 230, 230)` | Flash sale promo background tints and urgency alerts |
| `color-contact-navy` | `#166397` | `rgb(22, 99, 151)` | Contact Center card header, offline branch service bar |
| `color-contact-deep` | `#12527D` | `rgb(18, 82, 125)` | Contact Center header gradient and dark accent |

### 2.2 Neutral Surfaces & Borders
| Token Name | Hex Code | RGB | Purpose & Usage |
|---|---|---|---|
| `surface-canvas` | `#F7F7F7` | `rgb(247, 247, 247)` | Main page background behind cards and sections |
| `surface-card` | `#FFFFFF` | `rgb(255, 255, 255)` | White card surfaces, section backgrounds, header bar |
| `surface-subtle` | `#FAFAFA` | `rgb(250, 250, 250)` | Product image containers, search pill background |
| `surface-input` | `#F0F0F0` | `rgb(240, 240, 240)` | Search input background, variant tag chips |
| `border-standard` | `#E5E5E5` | `rgb(229, 229, 229)` | Default 1px card border, horizontal dividers |
| `border-medium` | `#CCCCCC` | `rgb(204, 204, 204)` | Search input border, input controls, table borders |
| `border-subtle` | `#F0F0F0` | `rgb(240, 240, 240)` | Section header bottom dividers, table row separator |

### 2.3 Typography Colors
| Token Name | Hex Code | RGB | Purpose & Usage |
|---|---|---|---|
| `text-primary` | `#222222` | `rgb(34, 34, 34)` | Product titles, card headers, prices, main headings |
| `text-secondary` | `#444444` | `rgb(68, 68, 68)` | Category names, sub-navigation, footer links |
| `text-muted` | `#666666` | `rgb(102, 102, 102)` | Top header branch hours, article descriptions, body paragraphs |
| `text-strikethrough`| `#999999` | `rgb(153, 153, 153)` | Original crossed-out price, timestamp labels |
| `text-placeholder` | `#B3B3B3` | `rgb(179, 179, 179)` | Form field placeholder text |

---

## 3. Typography Scale & Fonts

### 3.1 Font Stacks
- **Primary Body, Headings, and Titles**:
  `"inter-ui", "poppins", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Buttons, Badges, and Navigation**:
  `"poppins", "inter-ui", sans-serif`
- **Numbers, Prices, and Timers**:
  `"inter-ui", monospace, sans-serif` (tabular numbers with clear Indonesian currency formatting `Rp 198.000`)

### 3.2 Type Hierarchy
| Context | Size | Weight | Line Height | Color | Usage |
|---|---|---|---|---|---|
| **Header Logo Text** | `22px - 24px` | 900 (Black) | 1.1 | `#222222` + `#0099FF` | Brand name MakassarNotebook |
| **Slogan** | `9px - 10px` | 700 (Bold) | 1.0 | `#FF6000` | `#SudahPastiMurahnya` |
| **Section Title** | `14px - 16px` | 700 (Bold) | 1.2 | `#222222` | Flash Sale, Rekomendasi, Kategori Populer |
| **Section Action Link**| `11px - 12px` | 600 (Semibold)| 1.2 | `#0099FF` | "Lihat Semua", "Ganti Cabang" |
| **Product Card Title** | `11px - 12px` | 500 (Medium) | 1.3 | `#222222` | 2-line clamp product title |
| **Current Retail Price**| `13px - 14px` | 700 (Bold) | 1.2 | `#222222` | Current discounted price |
| **Original Price** | `10px - 11px` | 400 (Regular)| 1.2 | `#999999` | Strikethrough price |
| **Discount Badge** | `10px - 11px` | 700 (Bold) | 1.0 | `#D32F2F` | `-46%` discount percentage tag |
| **Category Label** | `11px` | 600 (Semibold)| 1.2 | `#444444` | Category text under icon |
| **Article Excerpt** | `11px` | 400 (Regular)| 1.4 | `#666666` | 2-line clamp blog summary |

---

## 4. Layout & Structural Components

### 4.1 Top Utility Bar
- Height: `32px` - `36px`
- Background: `#FFFFFF` or `#F7F7F7`, border bottom `#E5E5E5`
- Left: Active store branch selector (`Cabang: Panakkukang (Pengayoman)`), operational hours badge (`Buka: 09:00 - 20:00 WITA`).
- Right: Quick links to "Pusat Bantuan", "Panduan Pick N Go", "Cek Resi", and "Mitra Dropship".

### 4.2 Main Sticky Header
- Height: `64px` - `70px`
- Background: `#FFFFFF` (sticky top with subtle shadow-xs and border-b `#E5E5E5`).
- **Brand Mark**: MakassarNotebook signature glasses smile SVG logo (`#0099FF` & `#FF8500`) paired with bold logotype and `#SudahPastiMurahnya` slogan.
- **Search Bar**:
  - Full-width flexible container with `#F0F0F0` background and `#CCCCCC` border.
  - Left category selector dropdown (`Semua Kategori`).
  - Input field placeholder: "Cari produk, merk, atau SKU...".
  - Right search button in `#0099FF` with magnifying glass.
- **Action Triggers**:
  - Pick N Go branch locator trigger (`Toko Terdekat`).
  - Cart trigger with shopping bag icon and floating `#FF6000` count badge.
  - User Login / Register button or User Avatar menu.

### 4.3 Hero Section (5+3 Layout)
- Left Carousel (75% width on desktop): 5-slide dynamic banner rotating warehouse promotions, brand days, and seasonal campaigns.
- Right Column (25% width on desktop): 3 stacked promo tiles featuring high-conversion featured product deals.

### 4.4 Quick-Browse Category Bubbles
- 13 rounded circular icons representing signature categories (Aksesoris Komputer, Gadget, Audio & Video, Perkakas, Rumah Tangga, Outdoor, Dapur, Lampu LED, Fotografi, Otomotif, Gaming, Jam Tangan, Mainan).
- Circular icon container: `size-12` or `size-14` with soft background `#F0F0F0` and hover scale transition.

### 4.5 Flash Sale Section
- Header with Flash icon, bold title "FLASH SALE", and real-time countdown timer:
  - 3 red boxes for `HH`, `MM`, and `SS`: `bg-[#D32F2F] text-white px-2 py-0.5 rounded font-mono font-bold text-xs`.
- 8-column high-density product card grid showing current discount percentage and remaining stock indicator.

### 4.6 Video Shopping Reels (Produk Viral)
- 6 vertical reels per row on desktop (Aspect Ratio `9:16`).
- Video thumbnail with dark gradient overlay, play icon in `white/80`, category tag in `#FFD166`, and product title + price overlay.
- Clicking opens interactive reel modal with video preview and instant "Beli Sekarang / Pick N Go" action.

### 4.7 High-Density Product Card Specification
- **Container**: `bg-white rounded-lg border border-[#E5E5E5] p-2 hover:border-[#FF6000] hover:shadow-xs transition-all flex flex-col justify-between`
- **Image Area**: `aspect-square overflow-hidden rounded bg-[#FAFAFA] relative group-hover:scale-102`
- **Category Badge**: `absolute top-1 left-1 bg-[#0099FF] text-white text-[8px] font-bold px-1 py-0.5 rounded uppercase`
- **Rating**: Star icon in `#FF6000` + rating number (`4.8 (124)`)
- **Product Title**: 2-line clamp, `text-xs font-medium text-[#222222]`
- **Variant Pill**: `bg-[#F2F2F2] text-[#666666] text-[9px] px-1.5 py-0.5 rounded inline-block mt-1`
- **Pricing Block**:
  - Main price: `text-xs 2xl:text-sm font-bold text-[#222222]`
  - Strikethrough price: `text-[10px] text-[#999999] line-through mr-1`
  - Discount tag: `text-[10px] font-bold text-[#D32F2F]`
- **In-Store Stock Tag**: Green indicator `● Tersedia di Toko` or `Stok Cabang Siap Ambil`.
- **Card Hover Effect**: Border changes smoothly from `#E5E5E5` to `#FF6000`.

### 4.8 Trust & Service Proposition Strip (5 SVGs)
1. **100% Produk Original**: Garansi produk asli langsung dari pabrik & distributor resmi.
2. **Garansi Toko & Resmi**: Fasilitas klaim garansi ganti baru atau servis di seluruh cabang.
3. **Pengiriman Cepat & Aman**: Dukungan Instant Courier (Grab/Gojek) dan ekspedisi terpercaya.
4. **Ambil di Toko (Pick N Go)**: Pesan online dalam hitungan detik, ambil langsung tanpa antre.
5. **Customer Service Responsif**: Layanan bantuan pelanggan via WhatsApp dan Call Center setiap hari.

### 4.9 Branch Contact Center Card
- Header bar: `bg-gradient-to-r from-[#166397] to-[#12527D] p-3 text-white font-bold text-sm rounded-t-lg`
- Interactive branch selector updating phone number, WhatsApp link, physical address, and Google Maps direction pin.
- Offline operating hours breakdown:
  - Senin - Sabtu: 09:00 - 20:00 WITA
  - Minggu / Libur Nasional: 12:00 - 20:00 WITA

---

## 5. Responsive Grid & Breakpoint Matrix

| Breakpoint | Minimum Width | Max Container Width | Product Columns | Category Columns | Video Reels |
|---|---|---|---|---|---|
| **Mobile (xs/sm)** | `< 640px` | `100%` (`px-3`) | 2 columns | 4 columns | 2 columns |
| **Tablet (md)** | `>= 640px` | `640px` - `768px` | 4 columns | 5 columns | 3 columns |
| **Laptop (lg)** | `>= 1024px` | `1024px` | 6 columns | 8 columns | 4 columns |
| **Desktop (xl)** | `>= 1280px` | `1280px` - `1440px` | 8 columns | 10 columns | 6 columns |
| **Widescreen (2xl)**| `>= 1600px` | `1620px` | 8 columns (spacious density) | 10 columns | 6 columns |

---

## 6. Strict Banned Anti-Patterns (Zero-Tolerance Rules)

When developing any frontend, page, component, or layout in this project:

1. **NO Emerald Green CTAs (`#00ED64`)**: Never use vibrant neon green buttons or badges. All primary CTAs must use MakassarNotebook Blue (`#0099FF`) or Brand Orange (`#FF6000`).
2. **NO Dark Teal Canvas (`#001E2B`)**: Never use dark teal backgrounds. All canvas backgrounds must be `#F7F7F7` (or `#111827` in dark mode), with clean `#FFFFFF` card surfaces.
3. **NO Cliché AI Violet/Purple Gradients**: Never use arbitrary purple glow meshes or futuristic cyberpunk gradients. MakassarNotebook uses crisp retail white, blue, orange, and red.
4. **NO Low-Density Generic E-commerce Templates**: Never display 3 or 4 oversized cards per row on desktop screens. Always maintain the authentic 8-column high-density grid.
5. **NO Full-Rounded Pill Buttons**: All action buttons must use `rounded-lg` (`8px`) or `rounded-md` (`6px`), not circular stadium pills.
6. **NO Generic Placeholder Blocks**: Never render gray empty placeholder blocks. Always render authentic products with real imagery, Indonesian prices (`Rp ...`), and stock status.
