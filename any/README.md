# any — product site

A self-contained static module. Every URL inside is relative, so the folder works unchanged at `sverkaus.com/any/` and as the root of `any.<domain>`.

- `index.html` — the page. RU by default, EN via the switch (`data-en` / `data-en-html` attributes).
- `assets/css/any.css` — design tokens and components. Notch, colours and motion mirror the macOS app; values come from `web_handoff/` in the any repo.
- `assets/js/any.js` — language switch, release links, the notch HUD state machine and the live demos.
- `assets/js/sky.js` — the starfield.
- `assets/video/manifest.json` — optional recorded loops. Add `"hero": "hero.mp4"` (keys: `hero`, `task`, `translate`, `chain`) and drop the file next to it. The stage then shows the video instead of the live simulation.
- `help.html`, `privacy.html`, `third-party-notices.txt` — text pages.

## Downloads

The `<script id="release-config">` block in `index.html` keeps the contract of `scripts/build-website.py` in the any repo. While `downloadURL` is `null`, download buttons read «Релиз готовится». Set it to the verified DMG URL to enable them.

Note: that script still generates the previous landing page from the any repo's `website/` folder. Do not copy its output over this folder.

## Moving to a subdomain

Serve this folder as the document root of `any.<domain>`. Then redirect `/any/*` on the main domain to `https://any.<domain>/*` with your host's redirect rule (for example `_redirects`, a Cloudflare rule or nginx `return 301`), and update the link in the root `index.html`.

No other file needs editing.
