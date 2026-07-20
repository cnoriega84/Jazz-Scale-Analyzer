# Jazz Scale Analyzer

A static browser-only MVP that:

- accepts a photo or screenshot of a lead sheet;
- uses Tesseract.js OCR to read printed chord symbols;
- lets the musician correct the OCR result;
- recognizes common major 7, major 6, minor 7, dominant 7, altered dominant, half-diminished, diminished 7, and minor-major 7 symbols;
- transposes scale recommendations into all 12 keys;
- runs without a custom backend.

## Run locally

Because browsers may restrict some features when opening a file directly, serve the folder with a simple local server:

```bash
cd jazz-scale-analyzer
python3 -m http.server 8000
```

Then open `http://localhost:8000`.


## Dominant chord detection improvements

This build uses a chord-focused two-pass OCR process and repairs common dominant-chord OCR errors, including:

- `G 7` → `G7`
- `G?`, `GT`, `GZ`, or `G/` → `G7` when the symbol is in a chord position
- `B b 7` → `Bb7`
- `E67` → `Eb7` when OCR mistakes a flat sign for `6`
- `G 7 b9` → `G7b9`
- slash chords such as `G7/B` are analyzed as `G7`

The high-contrast pass also removes long staff lines before the second OCR attempt so the printed `7` is less likely to be confused with notation.

## Important limitation

Tesseract.js is text OCR, not full optical music recognition. This MVP works best when chord names are printed above a staff. It does not reliably infer harmony from noteheads written directly on the staff.

## Hosting

The folder can be deployed as-is to GitHub Pages, Netlify, Cloudflare Pages, or another static host.
