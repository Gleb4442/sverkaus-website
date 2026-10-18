# any — product site

A self-contained static module. Every URL inside is relative, so the folder works unchanged at `sverkaus.com/any/` and as the root of `any.<domain>`.

- `index.html` — the page. RU by default, EN via the switch (`data-en` / `data-en-html` attributes).
- `assets/css/any.css` — design tokens and components. Notch, colours and motion mirror the macOS app; values come from `web_handoff/` in the any repo.
- `assets/js/any.js` — language switch, release links, the notch HUD state machine and the live demos.
- `assets/js/sky.js` — the starfield.
- `assets/video/manifest.json` — optional recorded loops. Add `"hero": "hero.mp4"` (keys: `hero`, `task`, `translate`, `chain`) and drop the file next to it. The stage then shows the video instead of the live simulation.
- `assets/img/apps/*.svg` — app logos for the vocabulary demo, taken unchanged from the Iconify “logos” set (CC0). The marks belong to their owners and only name apps any can type into; any has no integration with them.
- `help.html`, `privacy.html`, `third-party-notices.txt` — text pages.

## Downloads

While `downloadURL` in the `<script id="release-config">` block of `index.html` is `null`, download buttons read «Релиз готовится». After a release, check that the DMG answers `200` and put its versioned URL there (see `release/README.md` in the any repo). This folder is the only copy of the site.

## Moving to a subdomain

Serve this folder as the document root of `any.<domain>`. Then redirect `/any/*` on the main domain to `https://any.<domain>/*` with your host's redirect rule (for example `_redirects`, a Cloudflare rule or nginx `return 301`), and update the link in the root `index.html`.

No other file needs editing.
