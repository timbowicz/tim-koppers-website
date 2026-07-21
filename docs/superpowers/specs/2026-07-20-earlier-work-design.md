# "Earlier work" archief — design spec

**Datum:** 2026-07-20 · **Status:** goedgekeurd door Tim ("ziet er goed uit!")

## Doel

Een deel van Tims oudere Strafwerk-portfolio (2002–2013), nu alleen als losse
bestanden in iCloud, een plek geven op timkoppers.com — zichtbaar, maar
duidelijk minder prominent dan de 10 huidige projectkaarten op de homepage.

## Bron

`Strafwerk/Portfolio/` bevat twee lagen: een chronologisch archief
(`2002/`…`2017/`, `awards/`) en een eerder gecureerde top-level selectie van
~15 named folders. Beide zijn doorgenomen; alles wat al live staat
(Take Control of the Tower, Heart Valve, PSV, Bruynzeel, Extrema, Gouda
vuurvast, Mitsubishi Control 10, Racoon, Madame Tussauds) is genegeerd.
Claudia de Breij (`iclaudia`) is hetzelfde project als het huidige
`claudia-de-breij-1/` — niet apart toegevoegd.

## Scope — 11 projecten, elk een eigen paginaatje

Doorgenomen project voor project met Tim (batches, keuze per project). Alle
11 krijgen een volwaardige mini-projectpagina — geen losse lijst-only
entries, dat idee is losgelaten toen bleek dat Tim voor elk project genoeg
materiaal en interesse had.

| Project | Werkslug | Jaar | Bronmap | Omschrijving |
|---|---|---|---|---|
| Feyenoord | `feyenoord/` | ~2009–2012 | `Portfolio/feyenoord/` | Virtuele 3D-stadion-hospitalitylounge, Second Life-tijdperk (zoals Lowlands) |
| Lowlands | `lowlands/` | ~2009–2012 | `Portfolio/lowlands/` | Merk/site-werk voor Lowlands Festival, alien-mascotte-beeldmerk ("Campingflight to Lowlands Paradise") |
| Space Invaders | `space-invaders/` | ~2004 | `Portfolio/spaceinvaders/` | "Design Invaders" — eigen viral browsergame in Space Invaders-stijl, "protect our world from bad design" (Comic Sans, WordArt als vijand), voor/met B-Total Hot Creative Concepts |
| BMW | `bmw/` | 2007 | `Portfolio/2007/bmw/` | Interactieve touchscreen dealer-kiosk (auto-configurator/modellenkiezer) voor BMW/MINI, gebouwd bij Strafwerk |
| Volvo | `volvo/` | 2008 | `Portfolio/2008/volvo/` | Zelfde soort touchscreen dealer-kiosk, modellenkiezer (C/S/V/XC-serie) voor Volvo |
| Doritos 4 Life | `doritos-4-life/` | 2008 | `Portfolio/2008/doritos4life/` | Doritos-microsite voor de Dance4Life-campagne (Tiësto) — "ontwerp je eigen Doritos-zak" |
| Philips Senseo | `philips-senseo/` | 2009 | `Portfolio/2009/philipssenseo/` | Senseo "flavors"-microsite — ontwerp je eigen Senseo-apparaat |
| Marlies Dekkers | `marlies-dekkers/` | 2006 | `Portfolio/2006/marliesdekkers/` | Lingeriemerk-campagnesite |
| L&D / Natural | `natural/` | 2007–2010 | `Portfolio/2007/l-d/` | Website voor dj-/eventduo "Lance & Donny" — promo voor hun "Natural High" strandclub-avonden |
| Lotuk / Arsenal | `arsenal/` | 2008 | `Portfolio/2008/lotuk/` | Website voor Belgische muziekartiesten + design voor cd's/platen |
| Buutvrij | `buutvrij/` | 2011 | `Portfolio/2011/buutvrij/` | Webcam-AR-campagne ("Doorgeefdag") met een papieren camera-prop, genomineerd voor een SPIN Award |

**Expliciet niet meegenomen:** Eastpak, Quiksilver, Red Bull (Take One +
Magazine), Pepsi Truck, Deathdisco/Arbeid Adelt, Andrea C, Marmottenrace,
Admiral Freebee, Tante Bep, dpdk, fnac, rhinofly, slionhead, iclaudia.
Evo/Mitsubishi Lancer Evolution (2008) is dezelfde campagne als het
bestaande Mitsubishi Control 10-project — niet apart toegevoegd (evt. losse
taak om die beelden alsnog in de bestaande pagina te verwerken, buiten scope
hier).

## Architectuur & routing

- Nieuwe pagina `/earlier-work/`, zelfde statische HTML-aanpak, geen build-stap.
- Elk project een eigen map + `index.html`, zelfde URL-conventie als nu
  (zie slugs hierboven).
- Hoofdnav blijft **Work / Hello** — ongewijzigd. Eén sobere tekstlink
  onderaan de homepage, ná de 10 huidige kaarten: bijv. "→ Earlier work,
  2002–2012." Dat is het enige entry point — dat maakt het "minder
  prominent".
- Prev/next-navigatie op de 11 pagina's loopt alleen binnen zichzelf rond,
  mengt niet met de prev/next-keten van de 10 hoofdprojecten.

## Visueel — de "minder prominent"-laag

- `/earlier-work/`-index: zelfde header/footer-shell, korte titel + één
  introregel, dan een **dichtere, kleinere grid** (meerdere per rij i.p.v.
  homepage's één-volle-breedte-kaart-per-rij), sobere styling — geen geel
  marker-effect op het jaartal, geen hover-zoom, kleinere typografie. Leest
  als een appendix, geen voortzetting van het hoofdwerk.
- Individuele projectpagina's hergebruiken het **bestaande
  projectpagina-template 1-op-1** (titel, jaar, introregel, afwisselende
  beeld/tekst-secties, prev/next) maar compacter — één introregel i.p.v. een
  volledig verhaal, passend bij werk van 15+ jaar oud zonder de diepgang van
  recente case studies.

## Content

Aanpak gewijzigd tijdens brainstorming: in plaats van dat Tim zelf briefjes
schrijft, heeft Claude per project de bronbeelden bekeken (splash/logo/
screenshot) en op basis daarvan een voorstel voor jaar + omschrijving
gedaan. Tim heeft dit gecorrigeerd waar nodig (Feyenoord en Lowlands vallen
beide in het Second Life-tijdperk ~2009–2012; Space Invaders is veel ouder,
~2004; Lotuk/Arsenal is een website + cd/vinyl-design voor Belgische
muziekartiesten). De tabel hierboven bevat de definitieve versie. Dit dekt
alleen jaar + korte omschrijving — de uiteindelijke lopende tekst per
projectpagina wordt tijdens implementatie geschreven (kort, factueel, geen
opsmuk die niet te verifiëren is).

## Assets

- Bronmappen zitten vol duplicaten (`" copy"`, `" 2"`-suffixen — dezelfde
  afbeelding dubbel opgeslagen). Per project: dedupliceren, één hero-beeld +
  2-4 detailbeelden kiezen, resizen naar de bestaande ~1600px-breed-conventie
  van de site, self-hosted onder `assets/img/<slug>/`.

## Verificatie

- Lokale server + screenshots van de nieuwe indexpagina en alle 11
  projectpagina's.
- Alle interne links (homepage → earlier-work → elk project → prev/next)
  gevalideerd.
- Reduced-motion en no-JS fallback gecheckt, zelfde als de rest van de site.
