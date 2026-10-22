# Test Infrastructure & Specification Verification Framework
**Project:** Any Landing Page Redesign & Dual Archetype Prototypes  
**Test Suite Path:** `/Users/pro/Developer/sverkaus-site-polish/tests/e2e/`  
**Target Environment:** `http://127.0.0.1:3000/any/`  
**Document Version:** 1.0  
**Author:** Test Writer (`teamwork_preview_test_writer_e2e_1`)  
**Authority:** `ORIGINAL_REQUEST.md`, `PROJECT.md`, `spec_requirements.md`

---

## 1. Testing Philosophy & Methodology

### 1.1 Requirements-Driven, Opaque-Box Validation
The test suite operates strictly as an **opaque-box validator**. Tests evaluate the application from the perspective of an end user and browser layout engine. Tests interact via standard DOM events, scroll dispatch, network requests, and computed CSS properties without relying on internal variable exposure or mocking implementation internals.

Every test case is derived from an explicit authoritative source:
- `ORIGINAL_REQUEST.md` (R1-R4, Acceptance Criteria)
- `PROJECT.md` (Feature Inventory F1-F24, Interface Contracts)
- `spec_requirements.md` (Quantitative thresholds, CSS specifications, hysteresis boundaries)

### 1.2 Zero-Dependency Native CDP Architecture
To maintain repository purity in a static web application without `node_modules` clutter, the test harness is built on **Node.js (v26.7.0)** native capabilities:
- Native `WebSocket` (standard in Node 22+) for real-time Chrome DevTools Protocol communication.
- Native `node:child_process` to control `chrome-headless-shell` (v151) or Google Chrome (v155).
- Native `node:http` to discover DevTools targets via `http://127.0.0.1:${port}/json/list`.
- Built-in assertion engine and structured test runner reporting detailed execution metrics, pass/fail status, and diagnostic traces.

### 1.3 Test Independence & Progressive Verifiability
Each test is fully isolated:
- Viewports, localStorage states, and scroll positions are explicitly set and reset per test.
- No test depends on the execution order or side effects of preceding tests.
- When run against unimplemented features, tests fail with unambiguous diagnostic messages indicating exactly which requirement or threshold was unmet.

---

## 2. Directory Layout

The automated testing framework is structured under `/Users/pro/Developer/sverkaus-site-polish/tests/e2e/`:

```
tests/e2e/
├── harness/
│   ├── cdp-client.js             # Low-level Chrome DevTools Protocol controller via WebSocket
│   ├── test-runner.js            # Zero-dependency test runner (describe, it, expect, reporting)
│   └── assertions.js             # Domain-specific assertions (overflow, styles, layout, persistence)
├── tier1-feature-coverage/
│   ├── f1-f4-frameless-nav.test.js       # Frameless header, lens blur, morphing, auto-hide
│   ├── f5-f7-footer-lang.test.js         # Footer native lang select, header removal, select UX
│   ├── f8-f10-hero-cleanup.test.js       # Particles, utility badges, individualistic narratives
│   └── f16-f22-prototypes-demos.test.js  # Cockpit/Grid routes, switcher pill, persistence, demos
├── tier2-boundary-corner/
│   ├── responsive-viewports.test.js      # 375px, 414px, 768px, 1024px, 1440px 0px overflow
│   ├── scroll-hysteresis.test.js         # Enter >48px, exit <=18px, oscillation jitter, hero safe zone
│   ├── private-mode-storage.test.js      # SecurityError resilience, in-memory language fallback
│   ├── missing-dom-guards.test.js        # Script safety when #hero-fn, #sky, or select are missing
│   └── asset-budget.test.js              # Background WebP sizes (<500KB), contrast scrims
├── tier3-cross-feature/
│   └── pairwise-matrix.test.js           # Variant toggle + language sync + dock morph interactions
├── tier4-real-world/
│   └── user-scenarios.test.js            # 5 end-to-end user journeys (Russian, English, mobile, compare)
└── run-all.js                            # Master test suite runner executing Tiers 1-4
```

---

## 3. Feature Inventory & Test Mapping Matrix

| Feature ID | Feature Name | Tier & Test File | Authoritative Requirement |
|:---|:---|:---|:---|
| **F1** | Frameless Glass Header | Tier 1: `f1-f4-frameless-nav.test.js` | R1 § 13, AC § 37 (`border: none`, 0px) |
| **F2** | Continuous Dock Morphing | Tier 1: `f1-f4-frameless-nav.test.js` | R1 § 14, AC § 38 (max-width 1120px -> 610px) |
| **F3** | Soft Physics & Easing | Tier 1: `f1-f4-frameless-nav.test.js` | R1 § 14, Spec § 32 (cubic-bezier easing) |
| **F4** | Directional Auto-Hide | Tier 1: `f1-f4-frameless-nav.test.js` | Spec § 33 (downward hide >240px, reveal up) |
| **F5** | Relocated Footer Lang Select | Tier 1: `f5-f7-footer-lang.test.js` | R1 § 15, AC § 39 (`#footer-lang-select`) |
| **F6** | Native Select UX | Tier 1: `f5-f7-footer-lang.test.js` | R1 § 15, Spec § 35 (zero custom popovers) |
| **F7** | Starfield Particle Removal | Tier 1: `f8-f10-hero-cleanup.test.js` | R2 § 18, AC § 42 (no canvas clutter) |
| **F8** | Utility Badge Elimination | Tier 1: `f8-f10-hero-cleanup.test.js` | R2 § 18, AC § 42 (no `#hero-fn`, no trial pill) |
| **F9** | Script Stability & Null-Guards | Tier 2: `missing-dom-guards.test.js` | Spec § 62 (`if (fnKey)` resilience) |
| **F10** | Cockpit Creator Narrative | Tier 1: `f8-f10-hero-cleanup.test.js` | R2 § 19, AC § 43 (Command deck copy RU/EN) |
| **F11** | Grid Creator Narrative | Tier 1: `f8-f10-hero-cleanup.test.js` | R2 § 19, AC § 43 (Architecture copy RU/EN) |
| **F12** | Cockpit Visual Art | Tier 2: `asset-budget.test.js` | R3 § 22-23 (`cockpit-bg.webp` present) |
| **F13** | Grid Visual Art | Tier 2: `asset-budget.test.js` | R3 § 22-24 (`grid-bg.webp` present) |
| **F14** | Asset Size Budget (<500KB) | Tier 2: `asset-budget.test.js` | R3 § 25 (each image asset < 500,000 bytes) |
| **F15** | Layered Gradient Scrim | Tier 2: `asset-budget.test.js` | R3 § 25, Spec § 45 (WCAG AA contrast >= 4.5:1) |
| **F16** | Prototype: Cyber-Cockpit | Tier 1: `f16-f22-prototypes-demos.test.js` | R4 § 28-29, AC § 47 (`variant-cockpit.html`) |
| **F17** | Prototype: Surrealist Grid | Tier 1: `f16-f22-prototypes-demos.test.js` | R4 § 28-30, AC § 47 (`variant-grid.html`) |
| **F18** | Nav Switcher Pill | Tier 1: `f16-f22-prototypes-demos.test.js` | R4 § 31, AC § 48 (segmented pill in `.nav-actions`) |
| **F19** | Bilingual Persistence | Tier 1 & 3: `pairwise-matrix.test.js` | R4 § 32, AC § 50 (`localStorage["any-site-language"]`) |
| **F20** | Mobile Responsiveness (>=375px)| Tier 2: `responsive-viewports.test.js` | R4 § 32, AC § 49 (`scrollWidth <= clientWidth`) |
| **F21** | Interactive Demo Resiliency | Tier 1: `f16-f22-prototypes-demos.test.js` | AC § 44 (dynamic notch loop) |
| **F22** | Physical 'F' Hold-to-Talk | Tier 1: `f16-f22-prototypes-demos.test.js` | Spec § 41 (window keydown/keyup 'f' listener) |

---

## 4. Test Tier Hierarchy & Coverage Scope

### Tier 1: Feature Coverage (>=5 test cases per feature area)
1. **F1-F4 Frameless Navigation**:
   - `test_header_border_none_expanded`: Nav container has `border: none` / `0px` in expanded top state.
   - `test_dock_border_none_scrolled`: Nav container has `border: none` / `0px` in scrolled dock state.
   - `test_dock_backdrop_blur_threshold`: Scrolled dock `backdrop-filter` contains `blur(...)` with radius >= 30px.
   - `test_scroll_morphing_dimensions`: Scrolled dock narrows from 1120px to <= 610px.
   - `test_directional_auto_hide_and_reveal`: Scrolling down >32px below 240px applies `.nav-hidden`; scrolling up >12px reveals.
   - `test_optical_lens_specular_glow`: Refraction highlight / specular glow pseudo-element present on dock.

2. **F5-F7 Footer Language Selector**:
   - `test_header_language_selector_removed`: Header `.nav-actions` has no `#lang-selector`, `#lang-btn`, or `#lang-menu`.
   - `test_footer_native_select_present`: Footer contains `<select id="footer-lang-select">`.
   - `test_footer_select_options_inventory`: Options include `ru`, `en`, `es`, `fr`, `de`, `zh`, `hi`.
   - `test_footer_select_change_updates_lang`: Changing value triggers `applyLanguage()` and sets `html[lang]`.
   - `test_footer_select_native_no_popover_clipping`: Uses native select elements without heavy popover containers.

3. **F8-F10 Hero Cleanup & Narrative**:
   - `test_starfield_canvas_removed_or_neutralized`: No active `#sky` canvas flakes in hero fold.
   - `test_misplaced_fn_badge_removed`: No visible interactive `#hero-fn` button or hold label in hero.
   - `test_hero_trial_meta_pill_removed`: No "30-day free trial · No card required" meta string.
   - `test_cockpit_hero_narrative_ru_en`: Cockpit hero displays operator command headline and subline.
   - `test_grid_hero_narrative_ru_en`: Grid hero displays architectural thought headline and subline.
   - `test_hero_primary_download_cta_intact`: CTA button `.btn-primary.download` is visible with dynamic label.

4. **F16-F22 Prototypes & Interactive Demos**:
   - `test_variant_cockpit_route_status_200`: HTTP GET `/any/variant-cockpit.html` returns 200.
   - `test_variant_grid_route_status_200`: HTTP GET `/any/variant-grid.html` returns 200.
   - `test_switcher_pill_rendered_with_active_tab`: Segmented switcher pill present with active dot indicator.
   - `test_switcher_pill_bidirectional_navigation`: Clicking switcher toggles between Cockpit and Grid.
   - `test_interactive_notch_simulation_executing`: Notch state machine runs without unhandled exceptions.
   - `test_keyboard_hold_to_talk_listener`: 'F' keydown initiates dictation simulation.

### Tier 2: Boundary & Corner Cases (>=5 test cases per feature area)
1. **Responsive Viewport Containment**:
   - `test_viewport_375px_zero_overflow`: 375px (iPhone SE) has 0px horizontal overflow (`scrollWidth <= clientWidth`).
   - `test_viewport_414px_zero_overflow`: 414px (iPhone XR/Plus) has 0px overflow.
   - `test_viewport_768px_zero_overflow`: 768px (iPad portrait) has 0px overflow.
   - `test_viewport_1024px_zero_overflow`: 1024px (iPad landscape / small laptop) has 0px overflow.
   - `test_viewport_1440px_zero_overflow`: 1440px (Desktop Retina) has 0px overflow.
   - `test_no_individual_element_bounding_box_overflow`: Scans all DOM nodes to verify `rect.right <= innerWidth + 1`.

2. **Scroll Physics & Hysteresis Stability**:
   - `test_morph_enter_hysteresis_threshold`: Enters dock morph strictly when `scrollY > 48px`.
   - `test_morph_exit_hysteresis_threshold`: Stays docked between 19px and 48px; exits to top bar only at `scrollY <= 18px`.
   - `test_rapid_scroll_oscillation_stability`: Rapid oscillations between 0px and 200px produce zero layout snapping.
   - `test_hero_safe_zone_immunity`: Nav remains pinned while scrolling within hero fold (`scrollY <= 240px`).
   - `test_downward_scroll_auto_hide_threshold`: Downward scroll delta > 32px below 240px triggers hide.

3. **Storage & Private Mode Resilience**:
   - `test_localstorage_disabled_no_crash`: Mocking `localStorage.getItem` throwing `SecurityError` does not crash page.
   - `test_localstorage_disabled_language_change_functional`: Language updates continue in-memory when storage is blocked.
   - `test_missing_storage_defaults_cleanly`: Defaults safely to 'ru' without throwing unhandled exceptions.
   - `test_storage_sync_across_pages`: Storage value set in Cockpit is read and applied by Grid.

4. **DOM Mutation & Script Null-Guards**:
   - `test_missing_hero_fn_null_guard`: Removing `#hero-fn` from DOM does not throw unhandled `TypeError` in `any.js`.
   - `test_missing_sky_canvas_null_guard`: Script handles missing `#sky` cleanly.
   - `test_missing_footer_select_null_guard`: Script handles missing `#footer-lang-select` without halting.
   - `test_missing_hero_stage_elements_null_guard`: Stage simulator runs safely without crashing subsequent scripts.

5. **Asset Budgets & Contrast Scrims**:
   - `test_cockpit_bg_file_size_under_500kb`: File size of `cockpit-bg.webp` is strictly < 500,000 bytes.
   - `test_grid_bg_file_size_under_500kb`: File size of `grid-bg.webp` is strictly < 500,000 bytes.
   - `test_background_image_format_webp`: Background assets use optimized WebP format.
   - `test_contrast_scrim_overlay_present`: Hero background CSS contains multi-stop dark gradient scrim.

### Tier 3: Cross-Feature Combinations (Pairwise)
1. `test_variant_switch_preserves_ru_language`: User on Cockpit with RU active switches to Grid -> Grid loads in RU.
2. `test_variant_switch_preserves_en_language`: User on Cockpit with EN active switches to Grid -> Grid loads in EN.
3. `test_footer_language_change_updates_all_cards`: Changing language on variant page translates hero, cards, and footer.
4. `test_scroll_morph_during_variant_transition`: Dock morph state initializes and animates consistently across variants.
5. `test_mobile_375px_variant_switch_zero_overflow`: Mobile user toggles variants without any horizontal layout shift.
6. `test_interactive_demos_operational_on_both_variants`: Demo stage runs typing simulation correctly on both variants.

### Tier 4: Real-World Application Scenarios
1. **Scenario 1 (Russian Operator Flow)**: User lands on `/any/variant-cockpit.html`, verifies Russian operator headline, scrolls down observing smooth dock morphing, reviews telemetry cards, interacts with demo, and verifies footer selector.
2. **Scenario 2 (English Thought Architecture Flow)**: User lands on `/any/variant-grid.html`, toggles to English via footer selector, verifies English avant-garde copy across hero and cards, scrolls to bottom and back with zero layout jump.
3. **Scenario 3 (Aesthetic Comparison Flow)**: User arrives at Cockpit, clicks Grid pill, evaluates architectural theme, clicks Cockpit pill to return, verifying active pill state and retained language.
4. **Scenario 4 (Mobile 375px Navigation Flow)**: User on 375px iPhone navigates TOC anchors, checks frameless dock auto-hide, switches variants via compact pill, and selects language from native footer picker.
5. **Scenario 5 (Keyboard Dictation & Feature Exploration Flow)**: User activates physical 'F' hold-to-talk dictation, observes dynamic notch HUD expansion, inspects typed text output in hero card, and explores app integration cards.

---

## 5. Execution Commands & Invocation Guide

### 5.1 Run Full Master Test Suite
```bash
node tests/e2e/run-all.js
```

### 5.2 Run Specific Test Tiers
```bash
# Tier 1: Feature Coverage
node tests/e2e/run-all.js --tier=1

# Tier 2: Boundary & Corner Cases
node tests/e2e/run-all.js --tier=2

# Tier 3: Cross-Feature Combinations
node tests/e2e/run-all.js --tier=3

# Tier 4: Real-World Scenarios
node tests/e2e/run-all.js --tier=4
```

### 5.3 Run Individual Test Specs
```bash
node tests/e2e/tier1-feature-coverage/f1-f4-frameless-nav.test.js
node tests/e2e/tier1-feature-coverage/f5-f7-footer-lang.test.js
node tests/e2e/tier1-feature-coverage/f8-f10-hero-cleanup.test.js
node tests/e2e/tier1-feature-coverage/f16-f22-prototypes-demos.test.js
node tests/e2e/tier2-boundary-corner/responsive-viewports.test.js
node tests/e2e/tier2-boundary-corner/scroll-hysteresis.test.js
node tests/e2e/tier2-boundary-corner/private-mode-storage.test.js
node tests/e2e/tier2-boundary-corner/missing-dom-guards.test.js
node tests/e2e/tier2-boundary-corner/asset-budget.test.js
node tests/e2e/tier3-cross-feature/pairwise-matrix.test.js
node tests/e2e/tier4-real-world/user-scenarios.test.js
```

### 5.4 Custom Port / Headless Configuration
```bash
# Override target URL or CDP port:
TARGET_URL=http://127.0.0.1:3000/any/ CDP_PORT=9345 node tests/e2e/run-all.js
```

---

## 6. Expected Output Derivation & Acceptance Thresholds

| Metric | Minimum / Exact Threshold | Method of Verification |
|:---|:---|:---|
| **Horizontal Overflow** | `scrollWidth - clientWidth == 0` | Computed DOM properties across all viewports |
| **Nav Border Width** | `border-width == 0px` or `border-style == none` | `window.getComputedStyle(navBar)` |
| **Backdrop Filter Blur** | Radius `>= 30px` | `window.getComputedStyle(navBar).backdropFilter` |
| **Scroll Hysteresis Enter** | Morph activates at `scrollY > 48px` | Class `.is-scrolled` added at 49px |
| **Scroll Hysteresis Exit** | Morph reverts at `scrollY <= 18px` | Class `.is-scrolled` removed at 18px |
| **Auto-Hide Delta** | Disappears when scroll down > 32px below 240px | Class `.nav-hidden` added |
| **Asset Size Budget** | `< 500,000` bytes | `fs.statSync(filePath).size` |
| **Bilingual Key Synchronization** | All cards update `innerText` on lang toggle | DOM text node comparison against localization dictionary |
| **Console Errors** | 0 unhandled runtime errors | `Runtime.consoleAPICalled` and `Runtime.exceptionThrown` CDP listeners |
