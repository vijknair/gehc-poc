# Block Catalog

Tracks all blocks identified during migration analysis of the GE Healthcare website to AEM Edge Delivery Services. Updated as new pages are analyzed.

---

## Pages Analyzed

| Page | URL | Date Analyzed | Snapshot |
|---|---|---|---|
| UK Homepage | https://www.gehealthcare.com/en-gb | 2026-05-14 | `site-snapshots/` |
| Venue Fit PDP | https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit | 2026-05-14 | `site-snapshots/venue-fit/` |

---

## Summary Table

| Block | Status | Section(s) | Pages |
|---|---|---|---|
| `hero-carousel` | NEW (custom) | S1 — Hero | `/en-gb` |
| `cards (quick-links)` | EXISTING variant | S2 — Category Nav | `/en-gb` |
| `cards (stats)` | EXISTING variant | S3 — Key Stats | `/en-gb` |
| `cards (news)` | EXISTING variant | S4 — What's New; S9 — Insights | `/en-gb`, `/en-gb/...venue-fit` |
| default content | No block needed | S5 — Contact Us | `/en-gb`, `/en-gb/...venue-fit` |
| `breadcrumb` | NEW (custom) | S1 — Breadcrumb | `/en-gb/...venue-fit` |
| `sub-nav` | NEW (custom) | S1 — Sticky Sub-nav | `/en-gb/...venue-fit` |
| `hero (product)` | EXISTING variant | S2 — Product Hero | `/en-gb/...venue-fit` |
| `cards (at-a-glance)` | EXISTING variant | S3 — At a Glance; S7 — Feature Items | `/en-gb/...venue-fit` |
| `sticky-scroll` | NEW (custom) | S4 — FEATURES Sticky Scroll | `/en-gb/...venue-fit` |
| `cards (care-areas)` | EXISTING variant | S5 — Key Care Areas | `/en-gb/...venue-fit` |
| `carousel (product-media)` | Block Collection variant | S6 — Clinical Images | `/en-gb/...venue-fit` |
| `cards (feature-cards)` | EXISTING variant | S8 — Feature Cards | `/en-gb/...venue-fit` |
| `contact-form` | NEW (custom) | S10 — Contact Form | `/en-gb/...venue-fit` |

> `/en-gb/...venue-fit` = `/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit`

**Status key:**
- `NEW (custom)` — Block does not exist locally or in Block Collection; must be built from scratch
- `EXISTING variant` — Block already exists; new CSS class drives a different visual presentation, no new block file needed
- `EXISTING + variant needed` — Block exists but needs a new variant to support additional content fields
- `Block Collection` — Not local but available from [aem-block-collection](https://github.com/adobe/aem-block-collection); can be adopted
- `Block Collection variant` — Block Collection block adopted; new CSS class drives a different visual presentation
- `No block needed` — Rendered as default content with section metadata styling

> **David's Model note:** Per [David's Model Rules #1, #9, #11](https://www.aem.live/docs/davidsmodel), blocks should not be created purely for developer convenience. Visual differences (layout, animation, scroll behavior) belong in CSS/JS, not the authoring model. Blocks are only justified when the content model itself is novel.

---

## Block Details

---

### `hero-carousel`

| Field | Value |
|---|---|
| Status | NEW (custom) |
| Section | S1 — Hero |
| Background | Light (white) |
| Pages | `/en-gb` |
| Block Collection reference | [`carousel`](https://main--aem-block-collection--adobe.aem.live/block-collection/carousel) |

**Content sequences:**
- Full-width rotating carousel with one or more slides
- Each slide: full-bleed background image, eyebrow text, large heading, single CTA link
- Navigation: previous/next arrow buttons, pause/play toggle, indicator dots

**Why new block:**
The standard `hero` block is static (single slide, no rotation). The Block Collection `carousel` supports rotation but has no hero layout (full-bleed image with overlaid text). This component combines both patterns and warrants a dedicated block.

**Author content model (proposed):**
Each row in the block table = one slide:

| Image | Eyebrow | Heading | CTA Label | CTA Link |
|---|---|---|---|---|
| hero-banner.jpg | Join us @ ECR 2026 | Our Boldest Ideas Yet | Learn more | /en-gb/ecr-2026 |

---

### `cards (quick-links)` — variant of `cards`

| Field | Value |
|---|---|
| Status | EXISTING variant |
| Section | S2 — Category Navigation |
| Background | Light (white) |
| Pages | `/en-gb` |
| Local path | `blocks/cards/` |
| Block Collection reference | [`cards`](https://main--aem-block-collection--adobe.aem.live/block-collection/cards) |

**Content sequences:**
- Intro label "Explore by category" on the left
- Horizontally scrollable row of 11 items, each with small square image and short text label
- Categories: Imaging, Ultrasound, Perioperative Care, Diagnostic Cardiology, Maternal & Infant Care, Patient Monitoring, Contrast Media, Molecular Imaging Agents, Digital Solutions, Clinical Accessories, Parts
- Previous/next arrow buttons on either side

**Why a variant, not a new block (David's Model):**
The content model is identical to `cards` — each row is one item with an image, label, and link. The horizontal scrolling carousel layout is purely a presentation concern handled in CSS/JS. Per Rules #1, #9, #11, creating a new block here would sacrifice authoring simplicity for developer aesthetics.

**Dev work required:**
Add `.cards.quick-links` CSS rules to `blocks/cards/cards.css` for horizontal scroll layout and arrow navigation.

**Author content model:**
Block header row uses variant name `Cards (quick-links)`. Each subsequent row = one category:

```
+-----------------------------------------------+
| Cards (quick-links)                            |
+----------------+-------------------+-----------+
| [image]        | Imaging           | /en-gb/products/imaging |
| [image]        | Ultrasound        | /en-gb/products/ultrasound |
| [image]        | Perioperative Care| /en-gb/products/perioperative |
| [image]        | Patient Monitoring| /en-gb/products/patient-monitoring |
+----------------+-------------------+-----------+
```

---

### `cards (stats)` — variant of `cards`

| Field | Value |
|---|---|
| Status | EXISTING variant |
| Section | S3 — Key Statistics |
| Background | Light (white) |
| Pages | `/en-gb` |
| Local path | `blocks/cards/` |
| Block Collection reference | [`cards`](https://main--aem-block-collection--adobe.aem.live/block-collection/cards) |

**Content sequences:**
- Row of 4 stat counters
- Each counter: large bold animated value + short description label + thin decorative divider line
- Stats: `$1B` Invested in R&D annually · `259K` Patients supported daily · `4M` Devices worldwide · `2B+` Patient scans annually

**Why a variant, not a new block (David's Model):**
Two cells per row (value + description) is a natural two-column `cards` table with no images. The animated count-up and 4-up horizontal layout are presentation concerns in CSS/JS. Per Rules #1, #9, #11, a separate block is unwarranted.

**Dev work required:**
Add `.cards.stats` CSS rules to `blocks/cards/cards.css` for 4-up row layout and count-up animation hook.

**Author content model:**
Block header row uses variant name `Cards (stats)`. Each row = one stat:

```
+---------------------------------------------+
| Cards (stats)                               |
+--------+------------------------------------+
| $1B    | Invested in R&D annually           |
| 259K   | Patients supported daily           |
| 4M     | Imaging and monitoring devices     |
| 2B+    | Patient scans managed annually     |
+--------+------------------------------------+
```

---

### `cards (news)` — variant of `cards`

| Field | Value |
|---|---|
| Status | EXISTING variant |
| Section | S4 — What's New (`/en-gb`); S9 — Insights (`/en-gb/...venue-fit`) |
| Background | Light (white) |
| Pages | `/en-gb`, `/en-gb/...venue-fit` |
| Local path | `blocks/cards/` |
| Block Collection reference | [`cards`](https://main--aem-block-collection--adobe.aem.live/block-collection/cards) |

**Content sequences:**
1. Eyebrow text (e.g. "What's new", "ULTRASOUND")
2. Grid of 3–4 article cards — each with: image, heading (h3), category tag, publish date
3. Trailing text link with arrow icon

**Why variant:**
The base `cards` block supports image + heading + description. This usage adds a section-level eyebrow label and a trailing link CTA below the grid, which require augmenting the block's authoring model to optionally accept a header row and footer row.

**Sample articles on `/en-gb`:**
- "A hidden driver of ultrasound efficiency: shared expertise" — Feb 11, 2026
- "Carving out a quick(er) win for ultrasound efficiency" — Feb 03, 2026
- "Sustainable Imaging Starts with Circularity" — Jan 27, 2026
- "Verisound makes a play for ultrasound efficiency: 2025 in review" — Jan 07, 2026

**Sample articles on `/en-gb/...venue-fit`:**
- "Now everywhere is point of care with Venue family"
- "New to cardiac ultrasound? Diagnostic-quality images are still in reach"
- "How POCUS supports clinicians where they work"

**Author content model (proposed):**
First row = section header (eyebrow); each subsequent row = one card; last row = trailing CTA:

| Image | Heading | Category | Date | Link |
|---|---|---|---|---|
| _(eyebrow)_ | What's new | | | |
| article-1.jpg | A hidden driver of ultrasound efficiency | | Feb 11, 2026 | /en-gb/insights/article/... |
| _(cta)_ | More Insights from GE HealthCare | | | /en-gb/insights/article |

---

### Section 5 / S10 — Contact Us (default content)

| Field | Value |
|---|---|
| Status | No block needed |
| Section | S5 — Contact Us (`/en-gb`); S10 — Contact Us (`/en-gb/...venue-fit` — heading only) |
| Background | Purple/accent (section metadata) |
| Pages | `/en-gb`, `/en-gb/...venue-fit` |

**Content sequences:**
- Centered heading: "Have a question? We would love to hear from you."
- Primary CTA button: "Contact us" → `/en-gb/about/contact-us`

**Why no block:**
Simple heading + button can be authored as default content. The purple background is applied via section metadata (`style: purple`) rather than a custom block.

**Authored as:**
```
## Have a question? We would love to hear from you.

[Contact us](/en-gb/about/contact-us)

---
style: purple
```

> Note: On the Venue Fit PDP (`/en-gb/...venue-fit`), the S10 "Contact Us" section includes an embedded Marketo form in addition to the heading. The heading defaults to default content; the form is handled by the `contact-form` block (see below).

---

### `breadcrumb`

| Field | Value |
|---|---|
| Status | NEW (custom) |
| Section | S1 — Breadcrumb |
| Background | Light (white) |
| Pages | `/en-gb/...venue-fit` |

**Content sequences:**
- Hierarchical path trail: e.g. "Point of Care Ultrasound (POCUS) Systems > Venue Fit™ Ultrasound"
- Each ancestor is a link; current page label is plain text

**Why new block:**
Breadcrumb markup requires structured `<nav aria-label="Breadcrumb">` / `<ol>` semantics for accessibility, and consistent visual styling. Could also be auto-blocked in `scripts.js` from the URL path structure.

**Auto-block note:**
Consider implementing as an auto-block in `buildAutoBlocks()` (scripts.js) derived from the URL path rather than requiring authors to explicitly author it. This would make it appear on all deep-linked pages without any authoring effort.

**Author content model (if explicitly authored):**
Single-row block where each cell is one crumb (link or plain text):

```
+----------------------------------------------------------+
| Breadcrumb                                               |
+---------------------------------+------------------------+
| [Point of Care Ultrasound (POCUS) Systems](/en-gb/products/ultrasound/point-of-care-ultrasound) | Venue Fit™ Ultrasound |
+---------------------------------+------------------------+
```

---

### `sub-nav`

| Field | Value |
|---|---|
| Status | NEW (custom) |
| Section | S1 — Sticky Sub-nav |
| Background | Light (white), becomes sticky on scroll |
| Pages | `/en-gb/...venue-fit` |

**Content sequences:**
- Horizontal row of 4–6 anchor links that scroll the page to named sections
- Items: Overview · Features · Image Gallery · Video Tutorial Gallery · Book a demo · Request a quote
- Becomes sticky (fixed to top) when the user scrolls past it

**Why new block:**
This is an anchor-navigation strip, distinct from the Block Collection `tabs` block (which switches content visibility). The sticky positioning and smooth-scroll-to-anchor behavior require dedicated JavaScript. The authoring model — a flat list of label+anchor pairs — is novel enough to warrant its own block.

**Author content model (proposed):**
Each row = one nav item:

```
+--------------------------------------------+
| Sub Nav                                    |
+--------------+-----------------------------+
| Overview     | #overview                   |
| Features     | #features                   |
| Image Gallery| #image-gallery              |
| Book a demo  | /en-gb/contact              |
| Request a quote | /en-gb/contact?type=quote |
+--------------+-----------------------------+
```

---

### `hero (product)` — variant of `hero`

| Field | Value |
|---|---|
| Status | EXISTING variant |
| Section | S2 — Product Hero |
| Background | Light (white) |
| Pages | `/en-gb/...venue-fit` |
| Local path | `blocks/hero/` |
| Block Collection reference | [`hero`](https://main--aem-block-collection--adobe.aem.live/block-collection/hero) |

**Content sequences:**
- H1 product name: "Venue Fit™ Ultrasound"
- Tagline paragraph: "Streamlined yet powerful. Designed to fit your space and fit your needs."
- Two CTA buttons: "Get a quote" (primary), "Book a demo" (secondary)
- Large product device image

**Why a variant, not a new block (David's Model):**
The content model is identical to the standard `hero` — image, heading, text, buttons. The PDP-specific layout (product image on right, left-aligned text, smaller type scale) is purely a CSS concern. Same authoring model, different visual treatment.

**Dev work required:**
Add `.hero.product` CSS rules to `blocks/hero/hero.css` for PDP layout (image right, text left, adjusted type scale).

**Author content model:**
Block header row uses variant name `Hero (product)`. Single content row:

```
+--------------------------------------------------+
| Hero (product)                                   |
+------------------------+-------------------------+
| [venue-fit-device.jpg] | Venue Fit™ Ultrasound   |
|                        | Streamlined yet powerful. Designed to fit your space and fit your needs. |
|                        | [Get a quote](/en-gb/contact?type=quote) [Book a demo](/en-gb/contact?type=demo) |
+------------------------+-------------------------+
```

---

### `cards (at-a-glance)` — variant of `cards`

| Field | Value |
|---|---|
| Status | EXISTING variant |
| Section | S3 — At a Glance; S7 — Additional Key Features |
| Background | Light (white) |
| Pages | `/en-gb/...venue-fit` |
| Local path | `blocks/cards/` |
| Block Collection reference | [`cards`](https://main--aem-block-collection--adobe.aem.live/block-collection/cards) |

**Content sequences:**
- Eyebrow label (e.g. "At a Glance", "Additional key features of Venue Fit™")
- Row of 4 items, each with: small icon or illustration, short headline, one-sentence description

**S3 items (At a Glance):**
- Small and powerful — "Without losing features, the smallest footprint in the Venue family"
- Customize for your needs — "Configurable cart to keep two active probes accessible and in good condition"
- Quick assessment with confidence — "Built on Windows 10 with powerful imaging engine utilizing cSound technology"
- Probe configurations — "2 wired probe ports plus wireless dual probe connectivity"

**S7 items (Additional Key Features):**
- Optimized for comfort — foot pedal for height adjustment
- Fits your space — cart, tabletop or boom VESA options
- 14-inch touch screen monitor — simple screen mode, 18% image increase
- Configured for you — adjustable probe, gel, barcode reader locations

**Why a variant, not a new block (David's Model):**
Icon + short heading + one-liner maps directly to the `cards` content model (image cell, heading cell, text cell per row). The 4-up horizontal strip layout and eyebrow header are CSS/HTML concerns.

**Dev work required:**
Add `.cards.at-a-glance` CSS rules to `blocks/cards/cards.css` for 4-up horizontal strip, icon sizing, and eyebrow styling.

**Author content model:**
Block header row uses variant name `Cards (at-a-glance)`. Each row = one item:

```
+---------------------------------------------+
| Cards (at-a-glance)                         |
+-----------+-------------------+--------------+
| [icon.svg]| Small and powerful| Without losing features, the smallest footprint in the Venue family |
| [icon.svg]| Customize for your needs | Configurable cart... |
| [icon.svg]| Quick assessment  | Built on Windows 10... |
| [icon.svg]| Probe configurations | 2 wired probe ports... |
+-----------+-------------------+--------------+
```

---

### `sticky-scroll`

| Field | Value |
|---|---|
| Status | NEW (custom) |
| Section | S4 — FEATURES Sticky Scroll |
| Background | Dark |
| Pages | `/en-gb/...venue-fit` |

**Content sequences:**
- Section eyebrow: "FEATURES"
- Intro heading: "Uniquely adaptable" + overview paragraph
- 4 panels, each with: image, eyebrow label, heading, body paragraph
  1. MOVES WITH YOU — "Allowing for cart, kickstand or standard VESA connection options, it's designed for flexibility."
  2. AUTOMATED TOOLS — "Simplify your workflow with AI-enabled clinical tools."
  3. COMPLETELY ADAPTABLE — "Configure the system cart exactly how you want it."
- As the user scrolls, the image column stays fixed (sticky) while text panels scroll past; the active image swaps per panel

**Why new block (not a `cards` variant):**
The sticky scroll is not just a visual treatment — it's a structurally different authoring intent and interaction model. In `cards`, all items are simultaneously visible as a grid. Here, items are revealed one at a time through scroll position, and the image is spatially decoupled from its text panel in the rendered DOM (image lives in a fixed-position column; text scrolls independently). The block JS must build a split-panel layout and manage active-panel state from scroll position — nothing like the cards grid. An author who sees "Cards (features)" would have no idea they're creating a sticky scroll experience; the block name must signal the intent.

**Author content model (proposed):**
Each row = one panel (image + eyebrow + heading + body):

```
+----------------------------------------------------------+
| Sticky Scroll                                            |
+-----------------+----------------+-------+--------------+
| [panel-img1.jpg]| MOVES WITH YOU | Moves with you | Allowing for cart, kickstand or VESA options... |
| [panel-img2.jpg]| AUTOMATED TOOLS| Simplify your workflow | AI-enabled clinical tools help clinicians... |
| [panel-img3.jpg]| COMPLETELY ADAPTABLE | Configure the cart | Detachable holders and bins allow you to... |
+-----------------+----------------+-------+--------------+
```

---

### `cards (care-areas)` — variant of `cards`

| Field | Value |
|---|---|
| Status | EXISTING variant |
| Section | S5 — KEY CARE AREAS |
| Background | Light (white) |
| Pages | `/en-gb/...venue-fit` |
| Local path | `blocks/cards/` |
| Block Collection reference | [`cards`](https://main--aem-block-collection--adobe.aem.live/block-collection/cards) |

**Content sequences:**
- Eyebrow: "KEY CARE AREAS"
- Subtitle: "Discover the point of care ultrasound family"
- 3 care area cards, each with: heading, body paragraph
  1. Regional Anesthesia — "From improved nerve block efficacy to cardiac monitoring..."
  2. Musculoskeletal (MSK) — "Venue Fit is made for practitioners who need to assess tendons, muscles, and joints..."
  3. NICU/PICU — "Venue Fit enables confident diagnostic scans without ionizing radiation..."

**Why a variant, not a new block (David's Model):**
Heading + body paragraph per card maps directly to `cards`. The 3-up grid layout with eyebrow and subtitle are CSS concerns.

**Dev work required:**
Add `.cards.care-areas` CSS rules to `blocks/cards/cards.css` for 3-up grid and eyebrow/subtitle styling.

**Author content model:**
Block header row uses variant name `Cards (care-areas)`. Intro row + content rows:

```
+--------------------------------------------------+
| Cards (care-areas)                               |
+-----+--------------------------------------------+
| KEY CARE AREAS | Discover the point of care ultrasound family |
| Regional Anesthesia | From improved nerve block efficacy... |
| Musculoskeletal (MSK) | Venue Fit is made for practitioners... |
| NICU/PICU | Venue Fit enables confident diagnostic scans... |
+-----+--------------------------------------------+
```

---

### `carousel (product-media)` — variant of Block Collection `carousel`

| Field | Value |
|---|---|
| Status | Block Collection variant |
| Section | S6 — CLINICAL IMAGES |
| Background | Dark/neutral |
| Pages | `/en-gb/...venue-fit` |
| Block Collection reference | [`carousel`](https://main--aem-block-collection--adobe.aem.live/block-collection/carousel) |

**Content sequences:**
- Eyebrow: "CLINICAL IMAGES"
- Section heading: "Venue Fit™ at work"
- Description: "Utilizing proprietary algorithms, our AI-driven tools deliver accurate calculations and a clear view of your patient."
- CTA: "See all clinical images"
- Carousel of ~11 clinical images, each with a short caption (tool name / probe model)

**Why Block Collection variant:**
The Block Collection `carousel` handles rotating images with navigation. This usage adds a section intro (eyebrow + heading + description + CTA) before the carousel items, and uses clinical image captions. The section intro is default content above the block; the carousel itself is adopted from Block Collection with `.carousel.product-media` CSS overrides for the clinical image styling.

**Dev work required:**
Adopt `carousel` block from Block Collection. Add `.carousel.product-media` CSS rules for clinical image sizing, caption typography, and dark-background treatment.

**Author content model:**
Section intro as default content, then block. Each carousel row = one image + caption:

```
+---------------------------------------------+
| Carousel (product-media)                    |
+--------------------+------------------------+
| [clinical-img1.jpg]| Caption Guidance       |
| [clinical-img2.jpg]| Bladder Volume Tool    |
| [clinical-img3.jpg]| Brachial Plexus nerve landmark highlighted with cNerve |
+--------------------+------------------------+
```

---

### `cards (feature-cards)` — variant of `cards`

| Field | Value |
|---|---|
| Status | EXISTING variant |
| Section | S8 — Feature Cards |
| Background | Light (white) |
| Pages | `/en-gb/...venue-fit` |
| Local path | `blocks/cards/` |
| Block Collection reference | [`cards`](https://main--aem-block-collection--adobe.aem.live/block-collection/cards) |

**Content sequences:**
- 3 cards: first spans full width, next two sit side-by-side below
  1. **Venue Fit brochure** (full width) — image + description + "Download brochure" CTA + "Explore POCUS bibliography" link
  2. **Venue probes** (half width) — image + text + "Learn more"
  3. **Total support** (half width) — image + text + CTA

**Why a variant, not a new block (David's Model):**
Each card has image + heading + description + CTA — the standard `cards` content model. The 1-full + 2-half layout is two CSS Grid rules:

```css
.cards.feature-cards { grid-template-columns: repeat(2, 1fr); }
.cards.feature-cards > div:first-child { grid-column: 1 / -1; }
```

No new block JS, no new authoring model needed.

**Dev work required:**
Add `.cards.feature-cards` CSS rules to `blocks/cards/cards.css` as above.

**Author content model:**
Block header row uses variant name `Cards (feature-cards)`. Each row = one card (first row renders full width automatically):

```
+--------------------------------------------------+
| Cards (feature-cards)                            |
+------------------+-------------------------------+
| [brochure.jpg]   | Venue Fit brochure            |
|                  | Download and read this brochure for a more in-depth understanding... |
|                  | [Download brochure](/en-gb/...) [Explore POCUS bibliography](/en-gb/...) |
| [probes.jpg]     | Venue probes                  |
|                  | Experience clear images on a range of patients... |
|                  | [Learn more](/en-gb/...)      |
| [support.jpg]    | Total support                 |
|                  | We promise to be with you every step of the way... |
+------------------+-------------------------------+
```

---

### `contact-form`

| Field | Value |
|---|---|
| Status | NEW (custom) |
| Section | S10 — Contact Form |
| Background | Purple/accent |
| Pages | `/en-gb/...venue-fit` |

**Content sequences:**
- Heading: "Have a question? We would love to hear from you."
- Embedded Marketo form with fields:
  - What can we help you with? (dropdown: Price Quote, Product Info, Product Demo, Training/Education)
  - First Name, Last Name
  - Email, Phone Number
  - Country (dropdown)
  - Company, Zip/Postal Code
  - Job Title (dropdown), Clinical Specialty (dropdown)
  - Marketing consent checkbox
  - Submit button

**Why new block:**
The Marketo form embed requires custom JavaScript to load the Marketo Forms 2.0 library, initialize the form with a Marketo instance ID, and handle submission/thank-you states. This is a genuinely novel content model (not representable as simple heading + paragraph) and interaction pattern that warrants a dedicated block.

**Author content model (proposed):**
The heading is default content. The block encapsulates the Marketo form configuration:

```
+--------------------------------------------------+
| Contact Form                                     |
+---------------------+----------------------------+
| Marketo Instance ID | 413-ZSG-867                |
| Form ID             | 1234                       |
+---------------------+----------------------------+
```

---

## Block Inventory

### Local Project Blocks

| Block | Purpose |
|---|---|
| `hero` | Static hero — image, heading, text, buttons |
| `cards` | Grid of items with image, heading, description |
| `columns` | Side-by-side content in 2–3 columns |
| `fragment` | Reusable embeddable content section |
| `header` | Global site header (auto-populated) |
| `footer` | Global site footer (auto-populated) |

### Block Collection (available to adopt)

| Block | Purpose | Example |
|---|---|---|
| `hero` | Large heading, text, CTA at page top | [view](https://main--aem-block-collection--adobe.aem.live/block-collection/hero) |
| `cards` | Content grid with images and text | [view](https://main--aem-block-collection--adobe.aem.live/block-collection/cards) |
| `carousel` | Rotating image/content slides | [view](https://main--aem-block-collection--adobe.aem.live/block-collection/carousel) |
| `tabs` | Switchable content panels | [view](https://main--aem-block-collection--adobe.aem.live/block-collection/tabs) |
| `columns` | Side-by-side layout | [view](https://main--aem-block-collection--adobe.aem.live/block-collection/columns) |
| `accordion` | Expandable Q&A sections | [view](https://main--aem-block-collection--adobe.aem.live/block-collection/accordion) |
| `quote` | Highlighted testimonial or pullquote | [view](https://main--aem-block-collection--adobe.aem.live/block-collection/quote) |
| `fragment` | Reusable content section | [view](https://main--aem-block-collection--adobe.aem.live/block-collection/fragment) |
