# DiskPulse — product site

A self-contained static module, built like `/any/`: every URL inside is relative, so the folder works at
`sverkaus.com/diskpulse/` and as the root of a subdomain. No external fonts, scripts or trackers.

- `index.html` — the page. RU by default (EN for non-Russian browsers), switch via `data-en` / `data-en-html`.
- `help.html` — every step after the download (DMG window, Gatekeeper prompt, «Move to Applications», welcome,
  menu bar, troubleshooting, uninstall). `privacy.html` — short privacy summary.
- `assets/css/diskpulse.css` — palette mirrors the app (`PulseTheme.swift`), light and dark.
- `assets/js/diskpulse.js` — language, release state, install tabs, copy buttons, the menu-bar demo (fictional numbers).
- `assets/img/` — the app icon exported from `AppIcon.icns` of the DiskPulse repository.

## Release switch

While `"released": false` in the `<script id="release-config">` block of `index.html`, download buttons read
«Релиз готовится» and command chips are dimmed. While `"repoPublic": false`, every GitHub link is hidden
(the repository is private, a link would show GitHub's 404). After the first public release:

1. check that `https://github.com/Gleb4442/diskpulse/releases/latest/download/DiskPulse.dmg` answers 200;
2. set `"released": true`, `"repoPublic": true` and optionally `"version": "1.2.0"` in `index.html`;
3. set `"repoPublic": true` in `help.html` and `privacy.html` too.

The DMG link always points at the latest release, so later releases need no change here.
The Homebrew command works once `github.com/Gleb4442/homebrew-tap` contains `Casks/diskpulse.rb`
(written by `scripts/release.py` in the DiskPulse repository).
