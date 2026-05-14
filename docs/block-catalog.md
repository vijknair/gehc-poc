# Block Catalog

Tracks all blocks identified during migration analysis of the GE Healthcare website to AEM Edge Delivery Services. Updated as new pages are analyzed.

---

## Pages Analyzed

| Page | URL | Date Analyzed | Snapshot |
|---|---|---|---|
| UK Homepage | https://www.gehealthcare.com/en-gb | 2026-05-14 | `site-snapshots/` |

---

## Summary Table

| Block | Status | Section(s) | Pages |
|---|---|---|---|
| `hero-carousel` | NEW (custom) | S1 — Hero | `/en-gb` |
| `cards (quick-links)` | EXISTING variant | S2 — Category Nav | `/en-gb` |
| `cards (stats)` | EXISTING variant | S3 — Key Stats | `/en-gb` |
| `cards (news)` | EXISTING variant | S4 — What's New | `/en-gb` |
| default content | No block needed | S5 — Contact Us | `/en-gb` |

**Status key:**
- `NEW (custom)` — Block does not exist locally or in Block Collection; must be built from scratch
- `EXISTING variant` — Block already exists; new CSS class drives a different visual presentation, no new block file needed
- `EXISTING + variant needed` — Block exists but needs a new variant to support additional content fields
- `Block Collection` — Not local but available from [aem-block-collection](https://github.com/adobe/aem-block-collection); can be adopted
- `No block needed` — Rendered as default content with section metadata styling

> **David's Model note:** Per [David's Model Rules #1, #9, #11](https://www.aem.live/docs/davidsmodel), blocks should not be created purely for developer convenience. `cards (quick-links)` and `cards (stats)` were initially identified as custom blocks but revised to `cards` variants — the content model is identical to `cards` (rows of items) and the visual difference (horizontal scroll, animated counters) belongs in CSS/JS, not the authoring model.

---

## Block Details

### `hero-carousel`

| Field | Value |
|---|---|
| Status | NEW (custom) |
| Section | Section 1 — Hero |
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
| Section | Section 2 — Category Navigation |
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
| Section | Section 3 — Key Statistics |
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
| Section | Section 4 — What's New |
| Background | Light (white) |
| Pages | `/en-gb` |
| Local path | `blocks/cards/` |
| Block Collection reference | [`cards`](https://main--aem-block-collection--adobe.aem.live/block-collection/cards) |

**Content sequences:**
1. Eyebrow text "What's new"
2. Grid of 4 article cards — each with: image, heading (h3), category tag, publish date
3. Trailing text link with arrow icon "More Insights from GE HealthCare"

**Why variant:**
The base `cards` block supports image + heading + description. This usage adds a section-level eyebrow label and a trailing link CTA below the grid, which require either a new `cards (news)` variant or augmenting the block's authoring model to optionally accept a header row and footer row.

**Sample articles on `/en-gb`:**
- "A hidden driver of ultrasound efficiency: shared expertise" — Feb 11, 2026
- "Carving out a quick(er) win for ultrasound efficiency" — Feb 03, 2026 — Healthcare Technology Management
- "Sustainable Imaging Starts with Circularity" — Jan 27, 2026 — News and Trends
- "Verisound makes a play for ultrasound efficiency: 2025 in review" — Jan 07, 2026 — Healthcare Technology Management

**Author content model (proposed):**
First row = section header (eyebrow); each subsequent row = one card; last row = trailing CTA:

| Image | Heading | Category | Date | Link |
|---|---|---|---|---|
| _(eyebrow)_ | What's new | | | |
| article-1.jpg | A hidden driver of ultrasound efficiency | | Feb 11, 2026 | /en-gb/insights/article/... |
| _(cta)_ | More Insights from GE HealthCare | | | /en-gb/insights/article |

---

### Section 5 — Contact Us (default content)

| Field | Value |
|---|---|
| Status | No block needed |
| Section | Section 5 — Contact Us |
| Background | Purple/accent (section metadata) |
| Pages | `/en-gb` |

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
