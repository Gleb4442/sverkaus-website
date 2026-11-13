# any — product site

A self-contained static module. Every URL inside is relative, so the folder works unchanged at `sverkaus.com/any/` and as the root of `any.<domain>`.

- `index.html` — the page. RU by default, EN via the switch (`data-en` / `data-en-html` attributes).
- `assets/css/any.css` — design tokens and components. Notch, colours and motion mirror the macOS app; values come from `web_handoff/` in the any repo.
- `assets/js/any.js` — language switch, release links, the notch HUD state machine and the live demos.
- `assets/js/sky.js` — the starfield.
- `assets/js/orbit.js` — the feature orbit (`#features`): a Saturn-like ring under the screen; the satellites ride its front in a row and the middle one is the feature on screen (tap a satellite or swipe the screen to switch). Each feature is a satellite + slide + caption with the same `data-i`. Put a video path in the slide's `data-video` (still in `data-poster`); an empty `data-video` shows the slide's own placeholder. It animates even with Reduce Motion on, like the rest of the page (`RESPECT_REDUCED_MOTION` in orbit.js); `?motion=live` / `?motion=static` forces a mode for review.
- `assets/video/manifest.json` — optional recorded loops. Add `"hero": "hero.mp4"` (keys: `hero`, `task`, `translate`, `chain`) and drop the file next to it. The stage then shows the video instead of the live simulation.
- `assets/img/apps/*.svg` — app logos for the vocabulary demo, taken unchanged from the Iconify “logos” set (CC0). The marks belong to their owners and only name apps any can type into; any has no integration with them.
- `help.html`, `privacy.html`, `terms.html`, `refund.html`, `third-party-notices.txt` — text pages (RU and EN side by side). `/terms` and `/refund` on the main domain redirect here (`vercel.json`).

## Downloads

While `downloadURL` in the `<script id="release-config">` block of `index.html` is `null`, download buttons read «Релиз готовится». After a release, check that the DMG answers `200` and put its versioned URL there (see `release/README.md` in the any repo). This folder is the only copy of the site.

## Moving to a subdomain

Serve this folder as the document root of `any.<domain>`. Then redirect `/any/*` on the main domain to `https://any.<domain>/*` with your host's redirect rule (for example `_redirects`, a Cloudflare rule or nginx `return 301`), and update the link in the root `index.html`.

No other file needs editing.
