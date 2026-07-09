# timkoppers.com rebuild — design spec

**Datum:** 2026-07-09 · **Status:** goedgekeurd door Tim ("helemaal akkoord")

## Doel

De huidige Squarespace-site (timkoppers.com) nabouwen als statische site in een
publieke GitHub-repo (`timbowicz/tim-koppers-website`), gehost op GitHub Pages
met het eigen domein. Het bestaande design blijft behouden; daarbovenop komt een
speelse laag met animatie en interactiviteit.

## Structuur & URLs

- Puur statisch HTML/CSS/JS, geen build-stap, geen dependencies.
- Huidige URL-paden blijven identiek via mappen met `index.html`:
  - `/` — Work (home, 10 projectkaarten)
  - `/hello/` — over/contact
  - `/heart-valve/`, `/take-control-of-the-tower/`, `/madame-tussauds-chaplin/`,
    `/gouda-vuurvast-virtual-reality/`, `/psv-100-year/`, `/extrema-outdoor-xo/`,
    `/mitsubishi-control-10/`, `/racoon/`, `/claudia-de-breij-1/`, `/bruynzeel/`
- Template-restanten (`/work-york`, `/contact-york`, oude `/projects`-galerij) vervallen.
- `404.html` in dezelfde stijl; `CNAME`-bestand met `timkoppers.com`; `.nojekyll`.

## Assets

- Alle afbeeldingen worden van de Squarespace CDN gedownload naar de repo
  (geoptimaliseerd, max ~1600px breed) — volledig onafhankelijk van Squarespace.
- Vimeo/YouTube-video's blijven embeds, maar als click-to-play facade
  (thumbnail + play-knop) voor snelheid.
- Logo ("koppers tim." in zwarte cirkel, gele underline + sparkle) nagebouwd als SVG.
- Font Europa (Adobe/Typekit) vervangen door **Jost** (OFL-licentie), self-hosted woff2.
- Accentkleur geel: `#fee500`; verder wit/zwart zoals origineel.

## Design & speelse laag

Design 1-op-1: wit, gecentreerd logo, nav Work links / Hello rechts, full-width
projectkaarten met gele titel-labels, projectpagina's met gecentreerde titel,
intro en afwisselende beeld/tekstsecties, prev/next-navigatie onderaan.

Speelse laag (gekozen door Tim):

1. **Marker-effect** — gele labels en sectiekoppen worden "live aangestreept"
   zodra ze in beeld scrollen (gele-stift-animatie).
2. **Speels logo** — underline tekent zichzelf, sparkle twinkelt, logo reageert
   op hover.
3. **Custom cursor** — gele stip met subtiele trail, groeit over links.
4. **Scroll & transitions** — kaarten glijden binnen, lichte parallax in
   projectbeelden, paginaovergangen via View Transitions API.

Expliciet niet gekozen: physics/easter eggs. Alles respecteert
`prefers-reduced-motion` en de site werkt zonder JS als nette statische site.

## Content

- Teksten licht opgefrist: consistent Engels (Heart Valve NL→EN vertaald),
  typo's gefixt ("Portoflio"), verouderde verwijzingen genormaliseerd
  (bijv. "at the time of writing (Februari 2019)").
- "Contact me" op Hello wordt `mailto:hello@timkoppers.com`.
  **Open punt:** Tim bevestigt het exacte adres; adres moet bestaan/doorsturen.

## Oplevering

1. Repo aanmaken via `gh` (publiek), alles committen en pushen.
2. GitHub Pages aanzetten (main branch, root).
3. DNS-instructies voor Tim: 4× A-record naar GitHub Pages-IP's + `www` CNAME
   naar `timbowicz.github.io`, daarna custom domain + HTTPS in repo-settings.

## Verificatie

- Lokale server + Playwright-screenshots van alle pagina's, vergeleken met origineel.
- Alle interne links en afbeeldingen gevalideerd; reduced-motion gecheckt.
