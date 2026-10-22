# Project: Any Landing Page Redesign & Dual Archetype Prototypes

## Architecture
The project is a high-performance static web application served at `/any/`. It has no Node.js compilation or bundler overhead, operating with pure modern semantic HTML5, CSS3 with hardware-accelerated transforms and backdrop-filters, and vanilla ES6+ JavaScript.

- **Server Runtime**: Python dev server (`dev_server.py`) on `http://127.0.0.1:3000/any/` emulating Vercel rewrites and `cleanUrls`.
- **Global Design Systems**: Two distinct aesthetic archetypes:
  1. **Cyber-Cockpit**: Retro-futuristic operator deck, obsidian/aerospace navy palette, amber/cyan telemetry accents, wrap-around console environment.
  2. **Surrealist Grid**: Architectural perspective room, infinite wireframe vanishing grid, desert flora/dusk skies, lavender/rose palette, gallery-grade soft lighting.
- **Shared Components & Interfaces**:
  - Frameless Navigation Header: `border: none`, optical lens refraction, continuous cubic-bezier scroll morphing to compact dock.
  - Variant Switcher Pill: Minimalist segmented pill in navigation (`[Cockpit | Grid]`), one-click instantaneous toggling.
  - Footer Native Language Dropdown: Native `<select id="footer-lang-select">`, zero popover container clipping on mobile.
  - Shared Bilingual Storage: `localStorage["any-site-language"]` automatically synchronized between pages and footer dropdown.
  - Interactive HUD / Demo Stages: Safe `#hero-stage` dictation simulation with null-guarded `#hero-fn`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Frameless Glass Header | Header container has `border: none`, floating with optical lens refraction | M2 | R1 § 13 |
| 2 | Continuous Dock Morphing | Smooth scroll-driven morphing between expanded bar and compact dock with hysteresis | M2 | R1 § 14 |
| 3 | Soft Physics & Easing | Spring/cubic-bezier easing without height snaps or layout jumps (desktop & mobile) | M2 | R1 § 14, AC § 38 |
| 4 | Directional Auto-Hide | Downward scroll hides dock past 240px; upward scroll reveals; hero safe zone | M2 | Spec § 33 |
| 5 | Relocated Footer Lang Select | Language switcher moved from header to footer as native minimalist dropdown | M2 | R1 § 15, AC § 39 |
| 6 | Native Select UX | OS-native wheel/sheet selector on mobile with zero custom popovers | M2 | R1 § 15 |
| 7 | Starfield Particle Removal | Complete removal of `#sky` canvas particles and floating snow clutter | M2 | R2 § 18, AC § 42 |
| 8 | Utility Badge Elimination | Removal of `fn` key badge, "hold" label, and trial pills from hero | M2 | R2 § 18, AC § 42 |
| 9 | Script Stability & Null-Guards | Ensure `#hero-fn` null safety in `any.js` so demo stage and notch continue running | M2 | Spec § 62, Survey 1 |
| 10 | Cockpit Creator Narrative | Hero headline and subline focused on operator empowerment & command deck (RU/EN) | M2, M3 | R2 § 19, AC § 43 |
| 11 | Grid Creator Narrative | Hero headline and subline focused on architectural thought & pure expression (RU/EN) | M2, M4 | R2 § 19, AC § 43 |
| 12 | Cockpit Visual Art Generation | Atmospheric retro-futuristic wrap-around display tunnel background environment | M1 | R3 § 22-23 |
| 13 | Grid Visual Art Generation | Architectural surrealist perspective room with grid wireframes & desert cacti | M1 | R3 § 22-24 |
| 14 | Asset Size Budget (<500KB) | Generated WebP/PNG background environments strictly under 500,000 bytes | M1 | R3 § 25 |
| 15 | Layered Gradient Scrim & WCAG | Multi-stop CSS gradient scrims guaranteeing >= 4.5:1 text contrast | M1, M3, M4 | R3 § 25, Spec § 45 |
| 16 | Prototype: Cyber-Cockpit | Standalone prototype page `/any/variant-cockpit.html` with Cockpit styling | M3 | R4 § 28-29, AC § 47 |
| 17 | Prototype: Surrealist Grid | Standalone prototype page `/any/variant-grid.html` with Grid styling | M4 | R4 § 28-30, AC § 47 |
| 18 | Nav Variant Switcher Pill | Minimal segmented pill in nav allowing 1-click toggling between prototypes | M3, M4 | R4 § 31, AC § 48 |
| 19 | Bilingual Persistence | Preserving active language selection across prototype switches via localStorage | M3, M4 | R4 § 32, AC § 50 |
| 20 | Mobile Responsiveness (>=375px)| 0px horizontal overflow across all viewports down to 375px on both variants | M3, M4 | R4 § 32, AC § 49 |
| 21 | Interactive Demo Resiliency | All interactive demo stages (hero, tasks, translate, chain) fully operational | M3, M4 | AC § 44 |
| 22 | Physical 'F' Hold-to-Talk | Interactive keyboard hold-to-talk demo preserved in both variants | M3, M4 | Spec § 41 |
| 23 | E2E Automated Verification | Opaque-box test suite verifying all acceptance criteria across Tiers 1-4 | E2E Track, M5 | Project Pattern |
| 24 | Adversarial Coverage Hardening | Tier 5 white-box stress testing and edge-case verification | M5 | Project Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Suite | Requirements-driven opaque-box test suite covering Tiers 1-4, `TEST_INFRA.md`, runner, `TEST_READY.md` | none | DONE |
| M1 | Visual Art & Environments | Generate Cockpit and Grid background environments, WebP optimization (<500KB), CSS scrims | none | DONE |
| M2 | Frameless Nav & Cleaned Hero | Borderless glass nav, optical refraction, continuous dock morphing, footer native lang select, cleaned hero, script null-guards | none | DONE |
| M3 | Cyber-Cockpit Prototype | `/any/variant-cockpit.html`, Cockpit theme, switcher pill, bilingual persistence, demo stages, responsive >=375px | M1, M2 | DONE |
| M4 | Surrealist Grid Prototype | `/any/variant-grid.html`, Grid theme, switcher pill, bilingual persistence, demo stages, responsive >=375px | M1, M2 | DONE |
| M5 | E2E Pass & Coverage Hardening | Pass 100% of E2E test suite from `TEST_READY.md` (Phase 1) + Tier 5 adversarial hardening (Phase 2) + Forensic Audit | E2E, M3, M4 | DONE |

## Code Layout
- `/any/index.html` — Baseline landing page
- `/any/variant-cockpit.html` — Cyber-Cockpit prototype page (Owned by M3)
- `/any/variant-grid.html` — Surrealist Grid prototype page (Owned by M4)
- `/any/assets/css/any.css` — Core styles, frameless nav, dock morphing, footer dropdown (Owned by M2)
- `/any/assets/css/variant-cockpit.css` — Scoped Cyber-Cockpit theme overrides (Owned by M3)
- `/any/assets/css/variant-grid.css` — Scoped Surrealist Grid theme overrides (Owned by M4)
- `/any/assets/js/any.js` — Core interactions, null-guarded `#hero-fn`, footer select binding (Owned by M2)
- `/any/assets/img/cockpit-bg.webp` — Cyber-Cockpit background environment (<500KB) (Owned by M1)
- `/any/assets/img/grid-bg.webp` — Surrealist Grid background environment (<500KB) (Owned by M1)
- `/tests/e2e/` — E2E test suite harness, runner, and test specs (Owned by E2E Track)

## Interface Contracts

### 1. Navigation Variant Switcher Contract (M2 ↔ M3, M4)
The navigation switcher pill markup must be located in `.nav-actions`:
```html
<div class="variant-switcher-pill" role="navigation" aria-label="Design variant">
  <a href="variant-cockpit.html" class="variant-tab [active]" [aria-current="page"]>
    <span class="variant-dot" aria-hidden="true"></span>
    <span>Cockpit</span>
  </a>
  <a href="variant-grid.html" class="variant-tab [active]" [aria-current="page"]>
    <span class="variant-dot" aria-hidden="true"></span>
    <span>Grid</span>
  </a>
</div>
```
Class `.variant-tab.active` marks the current page.

### 2. Footer Language Selector Contract (M2 ↔ M3, M4)
The native language selector must reside in `footer.footer`:
```html
<div class="footer-lang-wrap">
  <label for="footer-lang-select" class="sr-only">Language</label>
  <div class="footer-select-shell">
    <select id="footer-lang-select" class="footer-lang-select" aria-label="Select language">
      <option value="ru">Русский (RU)</option>
      <option value="en">English (EN)</option>
      <option value="es">Español (ES)</option>
      <option value="fr">Français (FR)</option>
      <option value="de">Deutsch (DE)</option>
      <option value="zh">中文 (ZH)</option>
      <option value="hi">हिन्दी (HI)</option>
    </select>
  </div>
</div>
```
`any.js` synchronizes `#footer-lang-select.value` with `store.get("any-site-language")` on load and updates `localStorage["any-site-language"]` upon `change`.

### 3. Background Artwork Contract (M1 ↔ M3, M4)
- File paths: `/any/assets/img/cockpit-bg.webp` and `/any/assets/img/grid-bg.webp`.
- Size ceiling: strictly `< 500,000` bytes each.
- Aspect ratio: Retina-ready 16:9 or 3:2 landscape.
- Scrim overlay classes: `.cockpit-environment` and `.grid-environment` providing radial and linear dark gradients ensuring >= 4.5:1 text contrast.
