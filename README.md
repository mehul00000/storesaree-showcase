# NOOLAM · Kanchipuram Silk — Saree Showcase Website

A luxury Kanchipuram silk saree storefront concept — deep maroon, temple gold and ivory — with nine interactive sections. Built as a pure static site (HTML + CSS + vanilla JS, no frameworks, no build step).

Live demo: https://noolam-saree-gm03.zai-ai.site

## Sections

1. **Hero** — full-bleed showroom image, glass pill navbar, gold scrolling ticker
2. **Six Moods** — saree photos framed in golden temple-arch (gopuram) windows with finials
3. **Try the Look** — drag carousel of 8 styled models (centre sharp, sides blurred) + "In this look" panel with bundle pricing
4. **Pick a Silk** — fanned arc of solid-colour cards with huge condensed titles; cards tilt toward the cursor
5. **The Rack** — a real clothes rail: 27 hand-coded SVG garments (sarees, half sarees, blouses) on wooden hangers, with filter chips
6. **Rack Detail** — click a hanger to lift it centre-stage; Front/Back toggle, sizes 34–42, add-to-bag flow
7. **The Muse Film** — gold-framed 16:9 brand film, corner brackets, sound pill, photo columns scrolling in opposite directions
8. **The Muse Reels** — vertical reel cards on a 3D curved arc; centre reel opens fullscreen
9. **The Bridal Collection** — arch-topped cards on a curved carousel with gold-bordered centre card

## Run locally

Just open `index.html`, or serve the folder:

```bash
python -m http.server 8137
# → http://127.0.0.1:8137
```

## Structure

```
index.html        # all nine sections
css/styles.css    # full styling (maroon / gold / ivory design system)
js/main.js        # carousels, 3D arcs, filters, overlays, SVG garment generator
assets/img/       # royalty-free Unsplash photography
```

## Credits

- Design concept inspired by the NOOLAM showcase reel (genz.webdeveloper)
- Photography: Unsplash (free license)
- Garments on the rack: hand-drawn SVG, generated in `js/main.js`
