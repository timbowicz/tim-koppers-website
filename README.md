# timkoppers.com

Portfolio site of Tim Koppers — digital creative since 2002.

Rebuilt from the original Squarespace site as a **plain static site**: no build
step, no frameworks, no dependencies. Hosted on GitHub Pages.

## Structure

```
index.html              Work (home) — 10 project cards
hello/                  About / contact
<project-slug>/         One folder per project (same URLs as the old site)
404.html                Not-found page
assets/css/style.css    All styling (design tokens at the top)
assets/js/main.js       Progressive enhancement: reveal, marker ink, cursor, video facades
assets/img/             All images, self-hosted
assets/fonts/           Jost (variable, OFL license) — replaces Europa
```

## Editing

Every page is plain HTML — edit and push to `main`, GitHub Pages redeploys
automatically. The yellow marker effect is a `<span class="marker">…</span>`;
scroll-reveal is `class="reveal"`. Everything degrades gracefully without JS
and respects `prefers-reduced-motion`.

Videos are click-to-play facades (poster + play button) that load the
Vimeo/YouTube player on demand.

## Local preview

```
python3 -m http.server 8000
```
