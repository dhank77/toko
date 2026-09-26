# JakartaNotebook / MakassarNotebook Design System

> **100% Fidelity Specification for MakassarNotebook (MKN)**
> Replicated directly from JakartaNotebook (jakartanotebook.com live production audit & high-density omnichannel retail design system).

---

## 1. Design Philosophy & Overview

MakassarNotebook employs JakartaNotebook's signature **high-speed, ultra-high-density omnichannel retail design language**. Unlike typical generic e-commerce templates that use excessive white space and bloated cards, JakartaNotebook's design system is engineered for power shoppers, tech enthusiasts, resellers, and Pick N Go branch visitors who want instant product scannability, transparent warehouse pricing, and real-time branch inventory.

### Key Characteristics:
1. **High Information Density**: 8 products per row on desktop/widescreen, 10 categories per row, 6 video shopping reels per row.
2. **Signature Colorway**:
   - **Primary Action Blue**: `#0099FF` (`rgb(0, 153, 255)`) with hover `#007ACC`.
   - **Brand Accent Orange**: `#FF6000` / `#F05A22` (used on the slogan `#SudahPastiMurahnya`, Shopping Cart badge, star ratings, and card hover highlights).
   - **Discount / Urgency Red**: `#FF0000` / `#D32F2F` (used on Flash Sale countdown badges, discount percentage `-%`, and clearance tags).
   - **Deep Teal Navy**: `#166397` / `#12527D` (used on the Contact Center header and institutional trust cards).
3. **Clean Crisp Neutral Surfaces**: Pure `#FFFFFF` card containers on a `#F0F0F0` / `#F7F7F7` neutral canvas, bordered with subtle `#E5E5E5` / `#CCCCCC` hairlines.
4. **Optimized Screen Real Estate**: Fluid scaling from mobile (360px) to standard desktop (1200px) and wide monitors (`max-w-[1620px]` at 1920px+).

---

## 2. Color System

### 2.1 Brand & Action Colors
| Token | Hex | RGB | Purpose & Usage |
|---|---|---|---|
| `color-primary` | `#0099FF` | `rgb(0, 153, 255)` | Primary interactive buttons, links, active state, icons |
| `color-primary-hover` | `#007ACC` | `rgb(0, 122, 204)` | Button hover, link hover |
| `color-primary-light` | `#E6F5FF` | `rgb(230, 245, 255)` | Outlined button hover, active category pill background |
| `color-orange-brand` | `#FF6000` | `rgb(255, 96, 0)` | `#SudahPastiMurahnya`, Cart badge, rating stars, card border hover |
| `color-red-discount` | `#D32F2F` | `rgb(211, 47, 47)` | Flash sale timer boxes, discount `%` tags (`-46%`), clearance badges |
| `color-red-light` | `#FFE6E6` | `rgb(255, 230, 230)` | Flash sale and promo background tints |
| `color-contact-navy` | `#166397` | `rgb(22, 99, 151)` | Contact center card header, offline branch service bar |
| `color-contact-deep` | `#12527D` | `rgb(18, 82, 125)` | Contact center header accent |

### 2.2 Surface & Neutral Canvas
| Token | Hex | RGB | Purpose & Usage |
|---|---|---|---|
| `surface-canvas` | `#F7F7F7` | `rgb(247, 247, 247)` | Overall application background behind cards |
| `surface-card` | `#FFFFFF` | `rgb(255, 255, 255)` | White card surfaces, section backgrounds, header |
| `surface-subtle` | `#FAFAFA` | `rgb(250, 250, 250)` | Product image containers, search pill background |
| `surface-input` | `#F0F0F0` | `rgb(240, 240, 240)` | Search input background, variant tag chips |
| `border-standard` | `#E5E5E5` | `rgb(229, 229, 229)` | Default 1px card and divider border |
| `border-medium` | `#CCCCCC` | `rgb(204, 204, 204)` | Search input border, input controls, table borders |
| `border-subtle` | `#F0F0F0` | `rgb(240, 240, 240)` | Section header bottom dividers |

### 2.3 Typography Colors
| Token | Hex | RGB | Purpose & Usage |
|---|---|---|---|
| `text-primary` | `#222222` | `rgb(34, 34, 34)` | Product titles, card headers, prices, main headings |
| `text-secondary` | `#444444` | `rgb(68, 68, 68)` | Category names, sub-navigation, footer links |
| `text-muted` | `#666666` | `rgb(102, 102, 102)` | Top header branch hours, article descriptions, body paragraphs |
| `text-strikethrough`| `#999999` | `rgb(153, 153, 153)` | Original crossed-out price, timestamp labels |
| `text-placeholder` | `#B3B3B3` | `rgb(179, 179, 179)` | Form field placeholder text |

---

## 3. Typography Scale & Fonts

### Font Families
- **Primary Body & Titles**: `"inter-ui", "poppins", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Buttons & Badges**: `"poppins", "inter-ui", sans-serif`
- **Numbers & Prices**: `"inter-ui", sans-serif` (tabular numbers with clear punctuation)

### Hierarchy Table
| Context | Size | Weight | Line Height | Color | Usage |
|---|---|---|---|---|---|
| **Header Logo** | `24px` | 900 (Black) | 1.1 | `#222222` + `#0099FF` | Brand name MakassarNotebook |
| **Slogan** | `10px` | 700 (Bold) | 1.0 | `#FF6000` | `#SudahPastiMurahnya` |
| **Section Title** | `14px` | 700 (Bold) | 1.2 | `#222222` | Flash Sale, Rekomendasi, Kategori Populer |
| **Section Action** | `11px` | 600 (Semibold)| 1.2 | `#0099FF` | "Lihat Semua", "Ganti Cabang" |
| **Product Title** | `11px - 12px` | 500 (Medium) | 1.3 | `#222222` | 2-line clamp product title |
| **Product Price** | `13px - 14px` | 700 (Bold) | 1.2 | `#222222` | Current discounted retail price |
| **Original Price** | `10px - 11px` | 400 (Regular)| 1.2 | `#999999` | Strikethrough price |
| **Discount Badge** | `10px - 11px` | 700 (Bold) | 1.0 | `#D32F2F` | `-46%` discount percentage |
| **Category Label** | `11px` | 600 (Semibold)| 1.2 | `#444444` | Category text under icon |
| **Article Excerpt** | `11px` | 400 (Regular)| 1.4 | `#777777` | 2-line clamp info blog summary |

---

## 4. Components & Micro-interactions

### 4.1 Buttons
- **Contained Primary (`data-variant="contained" data-color="primary"`)**:
  - `bg-[#0099FF] text-white font-medium rounded-lg px-4 py-2 hover:bg-[#007ACC] transition-all`
- **Outlined Primary (`data-variant="outlined" data-color="primary"`)**:
  - `border border-[#0099FF] text-[#0099FF] bg-white rounded-lg px-6 py-2 hover:bg-[#E6F5FF] transition-all`
- **Category Trigger Button**:
  - `border border-[#D6D6D6] bg-[#FAFAFA] rounded px-3.5 py-2 text-xs font-semibold text-[#444444] hover:bg-[#F0F0F0]`
  - Features hamburger icon with orange accent `#FF6000`.

### 4.2 Product Cards (Signature 8-Column Grid)
- **Container**: `bg-white rounded-lg border border-[#E9E9E9] p-2 hover:border-[#FF6000] hover:shadow-xs transition-all flex flex-col justify-between`
- **Image Area**: `aspect-square overflow-hidden rounded bg-[#FAFAFA] relative group-hover:scale-102`
- **Category Badge**: `absolute top-1 left-1 bg-[#0099FF] text-white text-[8px] font-bold px-1 py-0.5 rounded uppercase`
- **Variant Pill**: `bg-[#F2F2F2] text-[#666666] text-[9px] px-1.5 py-0.5 rounded inline-block mt-1`
- **Price Block**:
  - Main price: `text-xs 2xl:text-sm font-bold text-[#222222]`
  - Discount line: `text-[10px] text-[#999999] line-through mr-1`
  - Discount tag: `text-[10px] font-bold text-[#D32F2F]`

### 4.3 Flash Sale Countdown Timer
- Red rectangular blocks: `bg-[#D32F2F] text-white rounded px-1.5 py-0.5 font-mono text-xs font-bold`
- Separator colon: `text-[#D32F2F] font-bold`

### 4.4 Video Shopping Reels (Produk Viral)
- Aspect Ratio: `aspect-9/16`
- Dark gradient overlay: `bg-gradient-to-t from-black/90 via-black/40 to-transparent`
- Play button indicator: `size-6 rounded-full bg-white/70 text-black flex items-center justify-center top-3 left-3`
- Highlight yellow category tag: `text-[#FFD166] text-[10px] font-bold uppercase`

### 4.5 Branch Contact Center Card
- Deep blue top bar: `bg-[#166397] p-3 text-white font-bold text-sm`
- Border: `border border-[#005580]`
- Interactive branch dropdown: updates phone number, WhatsApp sales link, physical address, and Google Maps direction pin.
- Offline opening hours breakdown: Senin - Sabtu 09:00 - 20:00, Minggu / Libur Nasional 12:00 - 20:00.

---

## 5. Responsive Grid & Container Breakpoints

| Breakpoint | Container `max-width` | Product Columns | Category Columns |
|---|---|---|---|
| `< 640px` (Mobile) | `100%` (padding `12px`) | 2 columns | 2 columns |
| `>= 640px` (Tablet) | `640px` | 4 columns | 5 columns |
| `>= 768px` (Small Laptop) | `768px` | 4 columns | 5 columns |
| `>= 1024px` (Desktop) | `1024px` | 8 columns | 10 columns |
| `>= 1200px` (Full HD) | `1200px` - `1440px` | 8 columns | 10 columns |
| `>= 1920px` (Wide Monitor) | `1620px` | 8 columns (spacious density) | 10 columns |

---

## 6. Omnichannel Retail Touchpoints (Makassar Specific)
- **Pick N Go Makassar**: Maricaya Baru (Jl. Kijang No. 5C), Panakkukang (Jl. Pengayoman No. 42), AP Pettarani (Ruko Blok B-7), and Perintis Kemerdekaan KM 10.
- **Service Center**: Hotline `(0411) 39 700 200`, WhatsApp CS `0899 721 7050`, WhatsApp Sales/COD `0896 135 222 00`.
- **Dropshipper Feature**: Blind drop-shipping with neutral shipping label (`resi netral`) without MKN logos for reseller orders across South Sulawesi and Eastern Indonesia.
