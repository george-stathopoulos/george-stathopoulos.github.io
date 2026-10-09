# george-stathopoulos.github.io

George Stathopoulos's personal site. Live at https://george-stathopoulos.github.io/

## Files

| File | What it is |
|---|---|
| `index.html` | The whole page: hero, about, approach to AI, experience, skills, projects, contact |
| `assets/site.css` | Design: colours, layout, light and dark mode (same style as the Gatehouse website) |
| `assets/site.js` | Theme switch, mobile menu, gentle reveals and the smoke animation in the hero |
| `assets/img/` | Portrait and project screenshots |
| `george-stathopoulos-cv.pdf` | The downloadable CV (George's own latest PDF; replace this file to update it) |
| `cv/cv.html` | An older HTML source of the CV; not used for the current PDF, so don't rebuild over it |

## Add a project

1. Put a screenshot (about 1400px wide, JPG) in `assets/img/`.
2. In `index.html`, find the `<!-- To add a project … -->` comment in the Projects section.
3. Copy the Gatehouse `<article class="project featured reveal">…</article>` block below it, and change the text, image and links.

Cards sit one per row. For a dark card like Fixpass, add `project--lightsout` to the article; a `<video data-autoplay muted loop playsinline poster="…">` in place of the image plays only while it's on screen (never for people who prefer reduced motion).
   - Keep `featured` for a wide card with a screenshot.
   - Use `class="project reveal"` for a half-width card.
4. Delete one of the dashed "Next project in progress" placeholders if you no longer need it.

## Update the CV

1. Edit `cv/cv.html`.
2. Run `node cv/build-cv.mjs`. This rebuilds `george-stathopoulos-cv.pdf` with headless Chrome.

## Publish

Commit and push to `main`. GitHub Pages updates the site within a minute or two.
