# Earlier Work Archive — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `/earlier-work/` archive section to timkoppers.com listing 11 older Strafwerk-era projects (2004–2012), each with its own small case-study page, linked quietly from the bottom of the homepage.

**Architecture:** Plain static HTML/CSS, zero build step, following the exact patterns already used by the 10 existing project pages (`racoon/index.html` is the reference template). One new index page (`earlier-work/index.html`) lists all 11 in a smaller, muted grid; each project gets its own folder + `index.html` reusing the existing `.page-header` / `.slides` / `.project-nav` CSS verbatim. A small amount of new CSS covers only the muted archive grid and the homepage link — the individual project pages need no new CSS at all.

**Tech Stack:** HTML, CSS (`assets/css/style.css`), no JS changes needed (existing `assets/js/main.js` progressive-enhancement hooks — `reveal`, `ink-on-scroll`, marker — apply automatically via class names). Images processed with macOS `sips` (resize + format convert), no other tooling.

## Global Constraints

- No build step — plain HTML/CSS, self-hosted assets, same as the rest of the repo (see `README.md`).
- Every project page is a folder + `index.html`, using relative paths (`../assets/...`, `../.`), exactly like `racoon/index.html`.
- Design tokens (from `assets/css/style.css:29-39`): `--ink:#141414`, `--paper:#fff`, `--muted:#f4f4f2`, `--yellow:#fee500`, `--border-w:3px`, `--maxw:1280px`.
- Images are self-hosted under `assets/img/`, resized to max ~1600px on the longest side (site convention, matches `assets/img/racoon/*.jpg` at 1500×1125 / 1280×960).
- Deliberate simplification vs. existing project pages: new `.slide-media figure` elements do **not** set an inline `aspect-ratio` style (existing pages do, e.g. `racoon/index.html:56`). Computing exact post-resize pixel ratios up front isn't worth the overhead here; the existing CSS (`.slide-media img { width:100% }`) still renders correctly without it, just with a little more layout shift while images load. Do not "fix" this by guessing ratios.
- Homepage entry point is a **single quiet text link** below the current 10 cards — do **not** add "Earlier work" to the main nav (`Work` / `Hello` stays as-is).
- The 11 pages' prev/next chain loops within itself only, in this fixed order (does not interleave with the main 10 projects' chain):
  1. Feyenoord → 2. Lowlands → 3. Design Invaders (`space-invaders/`) → 4. BMW → 5. Volvo → 6. Doritos 4 Life → 7. Philips Senseo → 8. Marlies Dekkers → 9. Natural (`natural/`) → 10. Lotuk (`arsenal/`) → 11. Buutvrij → (loops back to 1. Feyenoord)
- Spec: `docs/superpowers/specs/2026-07-20-earlier-work-design.md`.

---

## Task 1: CSS + `/earlier-work/` index scaffold + homepage link

**Files:**
- Modify: `assets/css/style.css` (append new rules at end of file)
- Create: `earlier-work/index.html`
- Modify: `index.html:169-170` (insert link after the closing `</ul>` of `.cards`, before `</main>`)
- Modify: `sitemap.xml` (add one `<url>` line before `</urlset>`)

**Interfaces:**
- Produces: `.earlier-grid`, `.earlier-card-link`, `.earlier-media`, `.earlier-caption`, `.earlier-title`, `.earlier-year` CSS classes and the `<ul class="earlier-grid">` container in `earlier-work/index.html` that Tasks 2–12 each append one `<li>` to (always immediately before the `</ul>` closing tag, so append order determines display order — Task 2 appends first, Task 12 last).
- Produces: `.earlier-work-link` CSS class and homepage link markup.

- [ ] **Step 1: Append the new CSS to `assets/css/style.css`**

Add this block at the very end of the file:

```css

/* ---- Earlier work: muted archive grid ------------------------------------------ */
.earlier-header {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: clamp(36px, 6vw, 72px) var(--pad) clamp(24px, 4vw, 40px);
  border-bottom: var(--border-w) solid var(--ink);
}
.earlier-header .page-title { margin: 0; }
.earlier-header .page-intro { max-width: 62ch; margin: 18px 0 0; font-size: 16.5px; font-weight: 450; }
.earlier-grid {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: clamp(28px, 4vw, 48px) var(--pad) clamp(56px, 9vw, 104px);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: clamp(18px, 2.6vw, 28px);
  list-style: none;
}
.earlier-card-link { display: block; text-decoration: none; color: inherit; }
.earlier-media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid var(--ink);
  background: var(--muted);
}
.earlier-media img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(45%);
  transition: filter .2s linear;
}
.earlier-card-link:hover .earlier-media img,
.earlier-card-link:focus-visible .earlier-media img { filter: grayscale(0%); }
.earlier-caption {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  padding: 10px 2px 0;
}
.earlier-title { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: .01em; }
.earlier-year { font-size: 13px; font-weight: 500; opacity: .6; white-space: nowrap; }

/* ---- Homepage: link to the archive ---------------------------------------------- */
.earlier-work-link {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--pad) clamp(48px, 8vw, 88px);
}
.earlier-work-link a {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--yellow);
  text-decoration-thickness: 3px;
  text-underline-offset: 3px;
}
.earlier-work-link a:hover { background: var(--yellow); }
```

- [ ] **Step 2: Create `earlier-work/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Earlier work — Tim Koppers</title>
  <meta name="description" content="Selected earlier projects, 2004–2012 — before Tim Koppers went full-time on games and interactive learning.">
  <link rel="canonical" href="https://timkoppers.com/earlier-work/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Earlier work — Tim Koppers">
  <meta property="og:description" content="Selected earlier projects, 2004–2012 — before Tim Koppers went full-time on games and interactive learning.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/medu-game-tiva.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <header class="earlier-header swiss-grid-pattern reveal in-view">
      <h1 class="page-title">Earlier work</h1>
      <div class="page-intro">
        <p>A selection from 2004–2012, before games and interactive learning became the full-time focus. Client campaigns, microsites and a couple of experiments — kept here for the record, not the front page.</p>
      </div>
    </header>

    <ul class="earlier-grid">
    </ul>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Add the homepage link**

In `index.html`, find the closing `</ul>` of the `.cards` list (right before `</main>`) and insert this immediately after it:

```html
    <p class="earlier-work-link"><a href="earlier-work/">&rarr; Earlier work, 2004&ndash;2012</a></p>
```

- [ ] **Step 4: Add the sitemap entry**

In `sitemap.xml`, add this line before `</urlset>`:

```xml
  <url><loc>https://timkoppers.com/earlier-work/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/earlier-work/ | grep -q "<title>Earlier work" && echo "PASS: title" || echo "FAIL: title"
curl -s http://localhost:8000/earlier-work/ | grep -q 'class="earlier-grid"' && echo "PASS: grid present" || echo "FAIL: grid"
curl -s http://localhost:8000/ | grep -q 'href="earlier-work/"' && echo "PASS: homepage link" || echo "FAIL: homepage link"
kill $SERVER_PID
```
Expected: all three lines print `PASS`.

- [ ] **Step 6: Commit**

```bash
git add assets/css/style.css earlier-work/index.html index.html sitemap.xml
git commit -m "Add Earlier work archive scaffold, CSS and homepage link"
```

---

## Task 2: Feyenoord

**Files:**
- Create: `assets/img/cards/feyenoord-lounge.jpg`, `assets/img/feyenoord/01-feyenoord-1.jpg`, `assets/img/feyenoord/02-feyenoord-2.jpg`
- Create: `feyenoord/index.html`
- Modify: `earlier-work/index.html` (append `<li>` before `</ul>`)
- Modify: `sitemap.xml` (add `<url>` line)

**Interfaces:**
- Consumes: `.earlier-grid` container from Task 1.
- Produces: `feyenoord/index.html`, reachable at `/feyenoord/`. Prev = `buutvrij/` (added in Task 12), Next = `lowlands/` (added in Task 3).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/feyenoord
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/feyenoord"
sips -Z 1600 -s format jpeg "$SRC/2082977399_a826142ce9_o.jpg" --out assets/img/cards/feyenoord-lounge.jpg
sips -Z 1600 -s format jpeg "$SRC/2083759072_b15d9d9760_o.jpg" --out assets/img/feyenoord/01-feyenoord-1.jpg
sips -Z 1600 -s format jpeg "$SRC/2082976033_6a720e5e21_o.jpg" --out assets/img/feyenoord/02-feyenoord-2.jpg
```

- [ ] **Step 2: Create `feyenoord/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Feyenoord — Tim Koppers</title>
  <meta name="description" content="A Second Life build for Feyenoord: a virtual hospitality lounge inside the stadium.">
  <link rel="canonical" href="https://timkoppers.com/feyenoord/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Feyenoord — Tim Koppers">
  <meta property="og:description" content="A Second Life build for Feyenoord: a virtual hospitality lounge inside the stadium.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/feyenoord-lounge.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Feyenoord</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2009&ndash;2012</span></p>
          <div class="page-intro">
            <p>A Second Life build for Feyenoord: a virtual hospitality lounge inside the stadium, from the era when brands experimented with 3D virtual worlds.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/feyenoord-lounge.jpg" alt="3D-rendered Feyenoord stadium hospitality lounge">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Virtual hospitality lounge</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/feyenoord/01-feyenoord-1.jpg" alt="Feyenoord virtual world render, view two" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/feyenoord/02-feyenoord-2.jpg" alt="Feyenoord virtual world render, view three" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../buutvrij/"><small>Previous</small><span class="arrow">&larr;</span> Buutvrij</a>
      <a class="next" href="../lowlands/"><small>Next</small>Lowlands <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

Insert immediately before the grid's closing `</ul>`:

```html
      <li><a class="earlier-card-link" href="../feyenoord/">
        <div class="earlier-media"><img src="../assets/img/cards/feyenoord-lounge.jpg" alt="Feyenoord — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Feyenoord</h2><span class="earlier-year">2009&ndash;2012</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

Add before `</urlset>` in `sitemap.xml`:

```xml
  <url><loc>https://timkoppers.com/feyenoord/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/feyenoord/ | grep -q "<h1 class=\"page-title\">Feyenoord</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/earlier-work/ | grep -q 'href="../feyenoord/"' && echo "PASS: index link" || echo "FAIL: index link"
kill $SERVER_PID
```
Expected: both `PASS`.

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/feyenoord-lounge.jpg assets/img/feyenoord/ feyenoord/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Feyenoord to Earlier work"
```

---

## Task 3: Lowlands

**Files:**
- Create: `assets/img/cards/lowlands-secondlife.jpg`, `assets/img/lowlands/01-lowlands-1.jpg`, `assets/img/lowlands/02-lowlands-2.jpg`
- Create: `lowlands/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`
- Modify: `feyenoord/index.html:110` — the `next` link already points to `../lowlands/`, no change needed there. **Modify** `feyenoord/index.html` is NOT touched by this task (link already correct from Task 2).

**Interfaces:**
- Prev = `feyenoord/` (exists), Next = `space-invaders/` (added in Task 4).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/lowlands
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/lowlands"
sips -Z 1600 -s format jpeg "$SRC/962706598_0a370f5a47_o.jpg" --out assets/img/cards/lowlands-secondlife.jpg
sips -Z 1600 -s format jpeg "$SRC/1146732920_82c6351810_o.jpg" --out assets/img/lowlands/01-lowlands-1.jpg
sips -Z 1600 -s format jpeg "$SRC/914642353_16fc1adb13_o.jpg" --out assets/img/lowlands/02-lowlands-2.jpg
```

- [ ] **Step 2: Create `lowlands/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lowlands — Tim Koppers</title>
  <meta name="description" content="A Second Life island for Lowlands Festival: a virtual campsite with branded avatar outfits and props.">
  <link rel="canonical" href="https://timkoppers.com/lowlands/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Lowlands — Tim Koppers">
  <meta property="og:description" content="A Second Life island for Lowlands Festival: a virtual campsite with branded avatar outfits and props.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/lowlands-secondlife.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Lowlands</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2009&ndash;2012</span></p>
          <div class="page-intro">
            <p>A Second Life island for Lowlands Festival: a virtual campsite with branded avatar outfits and props, part of the 'Campingflight to Lowlands Paradise' identity.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/lowlands-secondlife.jpg" alt="Avatar wearing a Lowlands-branded outfit in the Second Life island">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Lowlands Second Life island</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/lowlands/01-lowlands-1.jpg" alt="Lowlands-branded avatar props in Second Life" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/lowlands/02-lowlands-2.jpg" alt="Lowlands Second Life island, additional view" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../feyenoord/"><small>Previous</small><span class="arrow">&larr;</span> Feyenoord</a>
      <a class="next" href="../space-invaders/"><small>Next</small>Design Invaders <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../lowlands/">
        <div class="earlier-media"><img src="../assets/img/cards/lowlands-secondlife.jpg" alt="Lowlands — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Lowlands</h2><span class="earlier-year">2009&ndash;2012</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/lowlands/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/lowlands/ | grep -q "<h1 class=\"page-title\">Lowlands</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/feyenoord/ | grep -q 'href="../lowlands/"' && echo "PASS: prev/next chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/lowlands-secondlife.jpg assets/img/lowlands/ lowlands/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Lowlands to Earlier work"
```

---

## Task 4: Design Invaders (slug `space-invaders/`)

**Files:**
- Create: `assets/img/cards/design-invaders-hero.jpg`, `assets/img/space-invaders/01-space-invaders-1.jpg`, `assets/img/space-invaders/02-space-invaders-2.jpg`
- Create: `space-invaders/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `lowlands/` (exists), Next = `bmw/` (added in Task 5).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/space-invaders
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/spaceinvaders"
sips -Z 1600 -s format jpeg "$SRC/space1.JPG" --out assets/img/cards/design-invaders-hero.jpg
sips -Z 1600 -s format jpeg "$SRC/space2.JPG" --out assets/img/space-invaders/01-space-invaders-1.jpg
sips -Z 1600 -s format jpeg "$SRC/space3.JPG" --out assets/img/space-invaders/02-space-invaders-2.jpg
```

- [ ] **Step 2: Create `space-invaders/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Design Invaders — Tim Koppers</title>
  <meta name="description" content="A self-initiated browser game: shoot down bad design, Space-Invaders-style.">
  <link rel="canonical" href="https://timkoppers.com/space-invaders/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Design Invaders — Tim Koppers">
  <meta property="og:description" content="A self-initiated browser game: shoot down bad design, Space-Invaders-style.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/design-invaders-hero.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Design Invaders</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2004</span></p>
          <div class="page-intro">
            <p>A self-initiated browser game: shoot down bad design — Comic Sans, WordArt, clip art — arcade-style, made for/with B-Total Hot Creative Concepts.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/design-invaders-hero.jpg" alt="Design Invaders gameplay screen, shooting down Comic Sans and WordArt">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Protect the world from bad design</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/space-invaders/01-space-invaders-1.jpg" alt="Design Invaders, additional screen" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/space-invaders/02-space-invaders-2.jpg" alt="Design Invaders, additional screen" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../lowlands/"><small>Previous</small><span class="arrow">&larr;</span> Lowlands</a>
      <a class="next" href="../bmw/"><small>Next</small>BMW <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../space-invaders/">
        <div class="earlier-media"><img src="../assets/img/cards/design-invaders-hero.jpg" alt="Design Invaders — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Design Invaders</h2><span class="earlier-year">2004</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/space-invaders/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/space-invaders/ | grep -q "<h1 class=\"page-title\">Design Invaders</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/lowlands/ | grep -q 'href="../space-invaders/"' && echo "PASS: chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/design-invaders-hero.jpg assets/img/space-invaders/ space-invaders/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Design Invaders to Earlier work"
```

---

## Task 5: BMW

**Files:**
- Create: `assets/img/cards/bmw-kiosk.jpg`, `assets/img/bmw/01-bmw-splash.jpg`, `assets/img/bmw/02-bmw-series.jpg`
- Create: `bmw/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `space-invaders/` (exists), Next = `volvo/` (added in Task 6).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/bmw
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/2007/bmw"
sips -Z 1600 -s format jpeg "$SRC/Screen Shot 2014-04-01 at 20.13.53.png" --out assets/img/cards/bmw-kiosk.jpg
sips -Z 1600 -s format jpeg "$SRC/bmw_splash.png" --out assets/img/bmw/01-bmw-splash.jpg
sips -Z 1600 -s format jpeg "$SRC/bmw_detail1.jpg" --out assets/img/bmw/02-bmw-series.jpg
```

- [ ] **Step 2: Create `bmw/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BMW — Tim Koppers</title>
  <meta name="description" content="An outdoor touchscreen kiosk for a BMW/MINI dealership: a model finder built at Strafwerk.">
  <link rel="canonical" href="https://timkoppers.com/bmw/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="BMW — Tim Koppers">
  <meta property="og:description" content="An outdoor touchscreen kiosk for a BMW/MINI dealership: a model finder built at Strafwerk.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/bmw-kiosk.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">BMW</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2007</span></p>
          <div class="page-intro">
            <p>An outdoor touchscreen kiosk for a BMW/MINI dealership: a model finder built at Strafwerk, mounted in a shipping-container showroom.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/bmw-kiosk.jpg" alt="Person using the BMW/MINI touchscreen kiosk, mounted outdoors against a shipping container">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">In the showroom</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/bmw/01-bmw-splash.jpg" alt="BMW and MINI logo tiles on the kiosk's start screen" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/bmw/02-bmw-series.jpg" alt="BMW series selector (1/3/5/6/7/M/X/Z) on the touchscreen kiosk" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../space-invaders/"><small>Previous</small><span class="arrow">&larr;</span> Design Invaders</a>
      <a class="next" href="../volvo/"><small>Next</small>Volvo <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../bmw/">
        <div class="earlier-media"><img src="../assets/img/cards/bmw-kiosk.jpg" alt="BMW — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">BMW</h2><span class="earlier-year">2007</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/bmw/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/bmw/ | grep -q "<h1 class=\"page-title\">BMW</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/space-invaders/ | grep -q 'href="../bmw/"' && echo "PASS: chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/bmw-kiosk.jpg assets/img/bmw/ bmw/index.html earlier-work/index.html sitemap.xml
git commit -m "Add BMW to Earlier work"
```

---

## Task 6: Volvo

**Files:**
- Create: `assets/img/cards/volvo-kiosk.jpg`, `assets/img/volvo/01-volvo-1.jpg`, `assets/img/volvo/02-volvo-logo.jpg`
- Create: `volvo/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `bmw/` (exists), Next = `doritos-4-life/` (added in Task 7).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/volvo
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/2008/volvo"
sips -Z 1600 -s format jpeg "$SRC/volvo1.jpg" --out assets/img/cards/volvo-kiosk.jpg
sips -Z 1600 -s format jpeg "$SRC/Volvo-folio-2.jpg" --out assets/img/volvo/01-volvo-1.jpg
sips -Z 1600 -s format jpeg "$SRC/volvo_front.jpg" --out assets/img/volvo/02-volvo-logo.jpg
```

- [ ] **Step 2: Create `volvo/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Volvo — Tim Koppers</title>
  <meta name="description" content="A touchscreen dealer kiosk for Volvo: a model finder across the C/S/V/XC series.">
  <link rel="canonical" href="https://timkoppers.com/volvo/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Volvo — Tim Koppers">
  <meta property="og:description" content="A touchscreen dealer kiosk for Volvo: a model finder across the C/S/V/XC series.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/volvo-kiosk.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Volvo</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2008</span></p>
          <div class="page-intro">
            <p>The same kind of touchscreen dealer kiosk, built for Volvo: a model finder across the C/S/V/XC series, with a direct dial to a salesperson.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/volvo-kiosk.jpg" alt="Volvo touchscreen kiosk showing the C/S/V/XC series selector">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Model finder</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/volvo/01-volvo-1.jpg" alt="Volvo dealer kiosk, additional screen" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/volvo/02-volvo-logo.jpg" alt="Volvo logo on a motion-blurred background" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../bmw/"><small>Previous</small><span class="arrow">&larr;</span> BMW</a>
      <a class="next" href="../doritos-4-life/"><small>Next</small>Doritos 4 Life <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../volvo/">
        <div class="earlier-media"><img src="../assets/img/cards/volvo-kiosk.jpg" alt="Volvo — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Volvo</h2><span class="earlier-year">2008</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/volvo/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/volvo/ | grep -q "<h1 class=\"page-title\">Volvo</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/bmw/ | grep -q 'href="../volvo/"' && echo "PASS: chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/volvo-kiosk.jpg assets/img/volvo/ volvo/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Volvo to Earlier work"
```

---

## Task 7: Doritos 4 Life

**Files:**
- Create: `assets/img/cards/doritos-4-life-splash.jpg`, `assets/img/doritos-4-life/01-doritos-4-life-1.jpg`, `assets/img/doritos-4-life/02-doritos-4-life-2.jpg`
- Create: `doritos-4-life/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `volvo/` (exists), Next = `philips-senseo/` (added in Task 8).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/doritos-4-life
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/2008/doritos4life"
sips -Z 1600 -s format jpeg "$SRC/d4l_splash.jpg" --out assets/img/cards/doritos-4-life-splash.jpg
sips -Z 1600 -s format jpeg "$SRC/d4l_detail1.jpg" --out assets/img/doritos-4-life/01-doritos-4-life-1.jpg
sips -Z 1600 -s format jpeg "$SRC/d4l_detail2.jpg" --out assets/img/doritos-4-life/02-doritos-4-life-2.jpg
```

- [ ] **Step 2: Create `doritos-4-life/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Doritos 4 Life — Tim Koppers</title>
  <meta name="description" content="A Doritos microsite for the Dance4Life campaign: design your own Doritos bag.">
  <link rel="canonical" href="https://timkoppers.com/doritos-4-life/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Doritos 4 Life — Tim Koppers">
  <meta property="og:description" content="A Doritos microsite for the Dance4Life campaign: design your own Doritos bag.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/doritos-4-life-splash.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Doritos 4 Life</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2008</span></p>
          <div class="page-intro">
            <p>A Doritos microsite for the Dance4Life campaign (with Tiësto): design your own Doritos bag and invite the world to Dance4Life, an HIV-awareness initiative.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/doritos-4-life-splash.jpg" alt="Doritos Dance4Life bag-design contest homepage">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Design your bag</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/doritos-4-life/01-doritos-4-life-1.jpg" alt="Doritos 4 Life campaign, additional screen" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/doritos-4-life/02-doritos-4-life-2.jpg" alt="Doritos 4 Life campaign, additional screen" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../volvo/"><small>Previous</small><span class="arrow">&larr;</span> Volvo</a>
      <a class="next" href="../philips-senseo/"><small>Next</small>Philips Senseo <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../doritos-4-life/">
        <div class="earlier-media"><img src="../assets/img/cards/doritos-4-life-splash.jpg" alt="Doritos 4 Life — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Doritos 4 Life</h2><span class="earlier-year">2008</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/doritos-4-life/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/doritos-4-life/ | grep -q "<h1 class=\"page-title\">Doritos 4 Life</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/volvo/ | grep -q 'href="../doritos-4-life/"' && echo "PASS: chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/doritos-4-life-splash.jpg assets/img/doritos-4-life/ doritos-4-life/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Doritos 4 Life to Earlier work"
```

---

## Task 8: Philips Senseo

**Files:**
- Create: `assets/img/cards/philips-senseo-flavors.jpg`, `assets/img/philips-senseo/01-philips-senseo-1.jpg`, `assets/img/philips-senseo/02-philips-senseo-2.jpg`
- Create: `philips-senseo/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `doritos-4-life/` (exists), Next = `marlies-dekkers/` (added in Task 9).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/philips-senseo
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/2009/philipssenseo"
sips -Z 1600 -s format jpeg "$SRC/image_senseo_flavors1.jpg" --out assets/img/cards/philips-senseo-flavors.jpg
sips -Z 1600 -s format jpeg "$SRC/image_senseo_flavors2.jpg" --out assets/img/philips-senseo/01-philips-senseo-1.jpg
sips -Z 1600 -s format jpeg "$SRC/image_senseo_flavors3.jpg" --out assets/img/philips-senseo/02-philips-senseo-2.jpg
```

- [ ] **Step 2: Create `philips-senseo/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Philips Senseo — Tim Koppers</title>
  <meta name="description" content="A Philips/Douwe Egberts Senseo microsite: design your own Senseo machine.">
  <link rel="canonical" href="https://timkoppers.com/philips-senseo/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Philips Senseo — Tim Koppers">
  <meta property="og:description" content="A Philips/Douwe Egberts Senseo microsite: design your own Senseo machine.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/philips-senseo-flavors.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Philips Senseo</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2009</span></p>
          <div class="page-intro">
            <p>A Philips/Douwe Egberts Senseo microsite: design your own Senseo machine to match your personal style.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/philips-senseo-flavors.jpg" alt="Senseo Flavors microsite: design your own Senseo machine">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Design your Senseo</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/philips-senseo/01-philips-senseo-1.jpg" alt="Senseo Flavors microsite, additional screen" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/philips-senseo/02-philips-senseo-2.jpg" alt="Senseo Flavors microsite, additional screen" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../doritos-4-life/"><small>Previous</small><span class="arrow">&larr;</span> Doritos 4 Life</a>
      <a class="next" href="../marlies-dekkers/"><small>Next</small>Marlies Dekkers <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../philips-senseo/">
        <div class="earlier-media"><img src="../assets/img/cards/philips-senseo-flavors.jpg" alt="Philips Senseo — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Philips Senseo</h2><span class="earlier-year">2009</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/philips-senseo/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/philips-senseo/ | grep -q "<h1 class=\"page-title\">Philips Senseo</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/doritos-4-life/ | grep -q 'href="../philips-senseo/"' && echo "PASS: chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/philips-senseo-flavors.jpg assets/img/philips-senseo/ philips-senseo/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Philips Senseo to Earlier work"
```

---

## Task 9: Marlies Dekkers

**Files:**
- Create: `assets/img/cards/marlies-dekkers-campaign.jpg`, `assets/img/marlies-dekkers/01-marlies-dekkers-1.jpg`, `assets/img/marlies-dekkers/02-marlies-dekkers-2.jpg`
- Create: `marlies-dekkers/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `philips-senseo/` (exists), Next = `natural/` (added in Task 10).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/marlies-dekkers
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/2006/marliesdekkers"
sips -Z 1600 -s format jpeg "$SRC/marliesdekkers1.jpg" --out assets/img/cards/marlies-dekkers-campaign.jpg
sips -Z 1600 -s format jpeg "$SRC/marliesdekkers5.jpg" --out assets/img/marlies-dekkers/01-marlies-dekkers-1.jpg
sips -Z 1600 -s format jpeg "$SRC/marliesdekkers6.jpg" --out assets/img/marlies-dekkers/02-marlies-dekkers-2.jpg
```

- [ ] **Step 2: Create `marlies-dekkers/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Marlies Dekkers — Tim Koppers</title>
  <meta name="description" content="A campaign site for lingerie brand Marlies Dekkers.">
  <link rel="canonical" href="https://timkoppers.com/marlies-dekkers/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Marlies Dekkers — Tim Koppers">
  <meta property="og:description" content="A campaign site for lingerie brand Marlies Dekkers.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/marlies-dekkers-campaign.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Marlies Dekkers</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2006</span></p>
          <div class="page-intro">
            <p>A campaign site for lingerie brand Marlies Dekkers.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/marlies-dekkers-campaign.jpg" alt="Marlies Dekkers campaign photography and wordmark">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Marlies Dekkers</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/marlies-dekkers/01-marlies-dekkers-1.jpg" alt="Marlies Dekkers campaign, additional image" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/marlies-dekkers/02-marlies-dekkers-2.jpg" alt="Marlies Dekkers campaign, additional image" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../philips-senseo/"><small>Previous</small><span class="arrow">&larr;</span> Philips Senseo</a>
      <a class="next" href="../natural/"><small>Next</small>Natural High <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../marlies-dekkers/">
        <div class="earlier-media"><img src="../assets/img/cards/marlies-dekkers-campaign.jpg" alt="Marlies Dekkers — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Marlies Dekkers</h2><span class="earlier-year">2006</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/marlies-dekkers/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/marlies-dekkers/ | grep -q "<h1 class=\"page-title\">Marlies Dekkers</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/philips-senseo/ | grep -q 'href="../marlies-dekkers/"' && echo "PASS: chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/marlies-dekkers-campaign.jpg assets/img/marlies-dekkers/ marlies-dekkers/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Marlies Dekkers to Earlier work"
```

---

## Task 10: Natural High (L&D, slug `natural/`)

**Files:**
- Create: `assets/img/cards/natural-home.jpg`, `assets/img/natural/01-natural-1.jpg`, `assets/img/natural/02-natural-2.jpg`
- Create: `natural/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `marlies-dekkers/` (exists), Next = `arsenal/` (added in Task 11).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/natural
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/2007/l-d"
sips -Z 1600 -s format jpeg "$SRC/42_natural2010-home.jpg" --out assets/img/cards/natural-home.jpg
sips -Z 1600 -s format jpeg "$SRC/ld_splash.jpg" --out assets/img/natural/01-natural-1.jpg
sips -Z 1600 -s format jpeg "$SRC/42_natural2010-about.jpg" --out assets/img/natural/02-natural-2.jpg
```

- [ ] **Step 2: Create `natural/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Natural High — Tim Koppers</title>
  <meta name="description" content="A website for dj duo Lance &amp; Donny: their 'Natural High' beach-club nights.">
  <link rel="canonical" href="https://timkoppers.com/natural/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Natural High — Tim Koppers">
  <meta property="og:description" content="A website for dj duo Lance &amp; Donny: their 'Natural High' beach-club nights.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/natural-home.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Natural High</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2007&ndash;2010</span></p>
          <div class="page-intro">
            <p>A website for dj duo Lance &amp; Donny (L&amp;D): a colourful homepage for their 'Natural High' beach-club nights, mixing electro, house and disco.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/natural-home.jpg" alt="Natural High website homepage, colourful collage design">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Natural High 2010</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/natural/01-natural-1.jpg" alt="L-D.nl splash screen" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/natural/02-natural-2.jpg" alt="Natural High website, about page" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../marlies-dekkers/"><small>Previous</small><span class="arrow">&larr;</span> Marlies Dekkers</a>
      <a class="next" href="../arsenal/"><small>Next</small>Lotuk <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../natural/">
        <div class="earlier-media"><img src="../assets/img/cards/natural-home.jpg" alt="Natural High — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Natural High</h2><span class="earlier-year">2007&ndash;2010</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/natural/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/natural/ | grep -q "<h1 class=\"page-title\">Natural High</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/marlies-dekkers/ | grep -q 'href="../natural/"' && echo "PASS: chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/natural-home.jpg assets/img/natural/ natural/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Natural High to Earlier work"
```

---

## Task 11: Lotuk (slug `arsenal/`)

**Files:**
- Create: `assets/img/cards/lotuk-splash.jpg`, `assets/img/arsenal/01-lotuk-1.jpg`, `assets/img/arsenal/02-lotuk-2.jpg`
- Create: `arsenal/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `natural/` (exists), Next = `buutvrij/` (added in Task 12).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/arsenal
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/2008/lotuk"
sips -Z 1600 -s format jpeg "$SRC/lotuk_splash.jpg" --out assets/img/cards/lotuk-splash.jpg
sips -Z 1600 -s format jpeg "$SRC/lotuk_detail1.jpg" --out assets/img/arsenal/01-lotuk-1.jpg
sips -Z 1600 -s format jpeg "$SRC/lotuk1.jpg" --out assets/img/arsenal/02-lotuk-2.jpg
```

- [ ] **Step 2: Create `arsenal/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lotuk — Tim Koppers</title>
  <meta name="description" content="A website and CD/vinyl artwork for Lotuk, Belgian music artists.">
  <link rel="canonical" href="https://timkoppers.com/arsenal/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Lotuk — Tim Koppers">
  <meta property="og:description" content="A website and CD/vinyl artwork for Lotuk, Belgian music artists.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/lotuk-splash.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Lotuk</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2008</span></p>
          <div class="page-intro">
            <p>A website and CD/vinyl artwork for Lotuk, Belgian music artists ('Arsenal').</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/lotuk-splash.jpg" alt="Lotuk Arsenal logo over dune grass">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Lotuk</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/arsenal/01-lotuk-1.jpg" alt="Lotuk website or artwork, additional image" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/arsenal/02-lotuk-2.jpg" alt="Lotuk website or artwork, additional image" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../natural/"><small>Previous</small><span class="arrow">&larr;</span> Natural High</a>
      <a class="next" href="../buutvrij/"><small>Next</small>Buutvrij <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../arsenal/">
        <div class="earlier-media"><img src="../assets/img/cards/lotuk-splash.jpg" alt="Lotuk — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Lotuk</h2><span class="earlier-year">2008</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/arsenal/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/arsenal/ | grep -q "<h1 class=\"page-title\">Lotuk</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/natural/ | grep -q 'href="../arsenal/"' && echo "PASS: chain" || echo "FAIL: chain"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/lotuk-splash.jpg assets/img/arsenal/ arsenal/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Lotuk to Earlier work"
```

---

## Task 12: Buutvrij

**Files:**
- Create: `assets/img/cards/buutvrij-ar.jpg`, `assets/img/buutvrij/01-buutvrij-1.jpg`, `assets/img/buutvrij/02-buutvrij-spin.jpg`
- Create: `buutvrij/index.html`
- Modify: `earlier-work/index.html`, `sitemap.xml`

**Interfaces:**
- Prev = `arsenal/` (exists), Next = `feyenoord/` (exists, closes the loop — this task does NOT modify `feyenoord/index.html`, its prev link already points to `../buutvrij/` from Task 2).

- [ ] **Step 1: Prepare images**

```bash
cd /Users/timbo/Projects/tim-koppers-website
mkdir -p assets/img/buutvrij
SRC="/Users/timbo/Library/Mobile Documents/com~apple~CloudDocs/Work/Strafwerk/Portfolio/2011/buutvrij"
sips -Z 1600 -s format jpeg "$SRC/overview.png" --out assets/img/cards/buutvrij-ar.jpg
sips -Z 1600 -s format jpeg "$SRC/detail1.png" --out assets/img/buutvrij/01-buutvrij-1.jpg
sips -Z 1600 -s format jpeg "$SRC/spin_2012_inzending.png" --out assets/img/buutvrij/02-buutvrij-spin.jpg
```

- [ ] **Step 2: Create `buutvrij/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Buutvrij — Tim Koppers</title>
  <meta name="description" content="A webcam augmented-reality campaign for Buutvrij, submitted for a SPIN Award.">
  <link rel="canonical" href="https://timkoppers.com/buutvrij/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Buutvrij — Tim Koppers">
  <meta property="og:description" content="A webcam augmented-reality campaign for Buutvrij, submitted for a SPIN Award.">
  <meta property="og:image" content="https://timkoppers.com/assets/img/cards/buutvrij-ar.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <a class="logo-link" href="../." aria-label="Tim Koppers — home">
      <svg class="logo" viewBox="0 0 118 110" role="img" aria-label="koppers tim.">
  <g class="logo-sparkle" aria-hidden="true">
    <path d="M103 7v16M95 15h16" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="58" r="47" fill="#141414"/>
  <text x="54" y="55" class="logo-word">koppers</text>
  <text x="54" y="76" class="logo-word">tim.</text>
  <path class="logo-underline" d="M39 82h31" stroke="#fee500" stroke-width="3.4" stroke-linecap="round"/>
</svg>
    </a>
    <nav aria-label="Main">
      <a class="nav-link" href="../." data-label="Work"><span class="nav-label">Work</span></a>
      <a class="nav-link" href="../hello/" data-label="Hello"><span class="nav-label">Hello</span></a>
    </nav>
  </header>

  <main id="main">
    <article>
      <header class="page-header swiss-grid-pattern reveal in-view">
        <div>
          <h1 class="page-title">Buutvrij</h1>
        </div>
        <div class="header-side">
          <p class="page-year"><span class="marker">2011</span></p>
          <div class="page-intro">
            <p>A webcam-based augmented-reality campaign for Buutvrij: hold up a paper camera prop to unlock the 'Doorgeefdag' moving-day story. Submitted for a SPIN Award.</p>
          </div>
        </div>
      </header>

      <div class="slides">
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/cards/buutvrij-ar.jpg" alt="Webcam AR experience: holding up a paper camera prop for Buutvrij's Doorgeefdag campaign">
          </figure>
          <div class="slide-text">
            <h2 class="slide-heading">Doorgeefdag</h2>
          </div>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/buutvrij/01-buutvrij-1.jpg" alt="Buutvrij Doorgeefdag campaign, additional screen" loading="lazy">
          </figure>
        </section>
        <section class="slide reveal ink-on-scroll">
          <figure class="slide-media">
            <img src="../assets/img/buutvrij/02-buutvrij-spin.jpg" alt="SPIN Award 2012 submission for the Buutvrij campaign" loading="lazy">
          </figure>
        </section>
      </div>
    </article>

    <nav class="project-nav" aria-label="More earlier work">
      <a class="prev" href="../arsenal/"><small>Previous</small><span class="arrow">&larr;</span> Lotuk</a>
      <a class="next" href="../feyenoord/"><small>Next</small>Feyenoord <span class="arrow">&rarr;</span></a>
      <a class="all" href="../earlier-work/">All earlier work</a>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; 2026 Tim Koppers <span class="footer-spark">&#10022;</span> Digital Creative</span>
      <a href="mailto:hola@timkoppers.com">hola@timkoppers.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Append to `earlier-work/index.html`'s grid**

```html
      <li><a class="earlier-card-link" href="../buutvrij/">
        <div class="earlier-media"><img src="../assets/img/cards/buutvrij-ar.jpg" alt="Buutvrij — view project" loading="lazy"></div>
        <div class="earlier-caption"><h2 class="earlier-title">Buutvrij</h2><span class="earlier-year">2011</span></div>
      </a></li>
```

- [ ] **Step 4: Add sitemap entry**

```xml
  <url><loc>https://timkoppers.com/buutvrij/</loc></url>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/buutvrij/ | grep -q "<h1 class=\"page-title\">Buutvrij</h1>" && echo "PASS: page" || echo "FAIL: page"
curl -s http://localhost:8000/arsenal/ | grep -q 'href="../buutvrij/"' && echo "PASS: chain in" || echo "FAIL: chain in"
curl -s http://localhost:8000/buutvrij/ | grep -q 'href="../feyenoord/"' && echo "PASS: chain closes loop" || echo "FAIL: loop"
kill $SERVER_PID
```

- [ ] **Step 6: Commit**

```bash
git add assets/img/cards/buutvrij-ar.jpg assets/img/buutvrij/ buutvrij/index.html earlier-work/index.html sitemap.xml
git commit -m "Add Buutvrij to Earlier work"
```

---

## Task 13: Full verification pass

**Files:** none created/modified — this task only verifies.

- [ ] **Step 1: Validate the full link graph**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1

SLUGS="feyenoord lowlands space-invaders bmw volvo doritos-4-life philips-senseo marlies-dekkers natural arsenal buutvrij"

echo "--- homepage link ---"
curl -s http://localhost:8000/ | grep -q 'href="earlier-work/"' && echo PASS || echo FAIL

echo "--- earlier-work index lists all 11 ---"
for s in $SLUGS; do
  curl -s http://localhost:8000/earlier-work/ | grep -q "href=\"../$s/\"" && echo "PASS: $s in index" || echo "FAIL: $s missing from index"
done

echo "--- every page loads with HTTP 200 ---"
for s in $SLUGS earlier-work; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/$s/")
  [ "$code" = "200" ] && echo "PASS: $s -> 200" || echo "FAIL: $s -> $code"
done

echo "--- sitemap has all 12 new URLs ---"
for s in $SLUGS earlier-work; do
  grep -q "https://timkoppers.com/$s/" sitemap.xml && echo "PASS: $s in sitemap" || echo "FAIL: $s missing from sitemap"
done

kill $SERVER_PID
```

Expected: every line prints `PASS`. If any `FAIL` appears, go back to the task that owns that file and fix it before continuing.

- [ ] **Step 2: Visual spot-check**

Start the local server (`python3 -m http.server 8000`) and open these three in a browser to confirm they render correctly (muted grid on the index, no broken images, prev/next arrows work): `http://localhost:8000/earlier-work/`, `http://localhost:8000/feyenoord/`, `http://localhost:8000/buutvrij/`. Click through prev/next on a couple of pages to confirm the loop closes correctly (Buutvrij's "Next" goes to Feyenoord).

- [ ] **Step 3: Confirm homepage is unaffected**

```bash
cd /Users/timbo/Projects/tim-koppers-website
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/ | grep -c 'class="card reveal' # expect 10 (unchanged main project cards)
kill $SERVER_PID
```
Expected output: `10`.

- [ ] **Step 4: Confirm reduced-motion and no-JS fallback are inherited, not skipped**

None of the new pages add any new JavaScript or motion-specific CSS — they only reuse existing classes (`reveal`, `ink-on-scroll`, `marker`, `swiss-grid-pattern`) that are already covered by the site-wide `prefers-reduced-motion` rules and no-JS fallback in `assets/css/style.css`. Confirm this is actually true rather than assumed:

```bash
cd /Users/timbo/Projects/tim-koppers-website
grep -c "prefers-reduced-motion" assets/css/style.css   # expect > 0, unchanged by this plan
grep -rL "assets/js/main.js" earlier-work/index.html feyenoord/index.html lowlands/index.html space-invaders/index.html bmw/index.html volvo/index.html doritos-4-life/index.html philips-senseo/index.html marlies-dekkers/index.html natural/index.html arsenal/index.html buutvrij/index.html
```
Expected: the `grep -c` prints a number greater than 0 (the existing reduced-motion rules are untouched). The `grep -rL` (list files that do **not** contain the string) prints nothing — every new page includes the same `<script src="../assets/js/main.js" defer>` progressive-enhancement include as the rest of the site, so it degrades the same way with JS disabled.

- [ ] **Step 5: Final commit (only if Step 1-4 required fixes)**

If everything passed with no fixes needed, there is nothing to commit here — Tasks 1–12 already committed everything. If fixes were needed, commit them now with a message describing what was fixed, e.g.:

```bash
git add -A
git commit -m "Fix broken links found in Earlier work verification pass"
```
