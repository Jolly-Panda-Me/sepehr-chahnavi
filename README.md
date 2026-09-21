<div align="center">

# 🕹️ Sepehr Chahnavi

### Senior Game Developer

[![Live Site](https://img.shields.io/badge/Live-Demo-2de2e6?style=for-the-badge)](https://usef-farahmand.github.io/sepehr-chahnavi/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sepehr-chahnavi/)
[![Email](https://img.shields.io/badge/Email-Say%20Hi-ff2fb9?style=for-the-badge&logo=gmail&logoColor=white)](mailto:skyhex.spr@gmail.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-9dfc4a?style=for-the-badge)](LICENSE)

</div>

---

Gameplay programming, multiplayer networking, and AR/VR — from core RTS mechanics running
400+ active units to a 50x50 tile isometric strategy game. This repository is the source for
my personal résumé site: a bilingual (English / فارسی), single-page, cyberpunk-styled portfolio
built to show the work rather than talk about it.

## ✨ Highlights

- 🌐 **Bilingual by default** — full English / Persian experience with proper RTL layout, not a
  translated afterthought
- 🕶️ **Cyberpunk hero** — a 3D, mouse-reactive emblem over an animated synthwave grid floor
- ⚡ **Genuinely lightweight** — vanilla HTML/CSS/JS, no framework, no build step, no bundler
- 🧩 **Content-driven** — every section, skill, project, and image path lives in
  [`data/content.json`](data/content.json), so the site updates without touching a line of markup
- ♿ **Built to be usable** — responsive down to small phones, reduced-motion support, real focus states
- 🔍 **SEO-ready** — Open Graph / Twitter cards, JSON-LD structured data, `sitemap.xml`, `robots.txt`

## 🗂️ Structure

```
.
├── index.html              # markup only
├── css/style.css            # all styling
├── js/main.js                # all behaviour (i18n, 3D hero, rendering)
├── data/content.json         # every string and image path, in English and Persian
├── assets/images/            # logo, favicons, about photo, project screenshots
├── sitemap.xml
├── robots.txt
└── LICENSE
```

HTML, CSS, and JS are kept in separate files by design — nothing is inlined or bundled together.

## 🚀 Running locally

Because the page loads `data/content.json` with `fetch()`, open it through a local server rather
than double-clicking `index.html` (browsers block `fetch()` on the `file://` protocol):

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then visit the printed local address.

## ✍️ Editing content

Open [`data/content.json`](data/content.json). It has one `en` block and one `fa` block with the
same shape — headline, about text, experience, skills, projects, education, and contact info —
plus a shared `site` block for the logo and favicons. Every image on the page (the about photo,
each project screenshot) is a path inside this file under `assets/images/`, so swapping a picture
is a one-line change. Placeholder images currently sit in `assets/images/` and
`assets/images/projects/` until real photos/screenshots are dropped in at the same file names (or
new files referenced from the JSON).

## 🕹️ Selected Work

Personal projects — book shop app, an online blackjack game, a 3D take on Pac-Man, and an AR
storybook for kids — see the [live site](https://usef-farahmand.github.io/sepehr-chahnavi/#projects)
for details on each.

## 📬 Get in Touch

- **Email:** [skyhex.spr@gmail.com](mailto:skyhex.spr@gmail.com)
- **LinkedIn:** [sepehr-chahnavi](https://www.linkedin.com/in/sepehr-chahnavi/)

---

<div align="center">
<sub>Code in this repository is MIT licensed. Personal content — name, likeness, career history,
and project details — is not licensed for reuse.</sub>
</div>

<div align="center">
<sub>Built by <a href="https://jollypanda.ir">Jolly Panda Studio</a></sub>
</div>
