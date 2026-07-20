"use strict";

const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const NOTE_TO_PC = {
  C: 0,
  "B#": 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  "E#": 5,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11
};

const SCALE_LIBRARY = {
  major: {
    label: "Major scale",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    note: "Classic major sound.",
    warningDegree: "The natural 4th can sound tense over the chord's major 3rd."
  },
  lydian: {
    label: "Lydian scale",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    note: "Go-to major 7 color; the #4 adds brightness without the natural-4 avoid note.",
    recommended: true
  },
  majorBlues: {
    label: "Major blues scale",
    intervals: [0, 2, 3, 4, 7, 9],
    note: "Use the b3 mainly as a passing or grace note."
  },
  naturalMinor: {
    label: "Natural minor scale",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    note: "A darker minor sound.",
    warningDegree: "The b6 is often treated as an avoid note over a minor 7 chord."
  },
  dorian: {
    label: "Dorian scale",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    note: "Go-to minor 7 sound; the natural 6 gives a more open jazz color.",
    recommended: true
  },
  minorBlues: {
    label: "Minor blues scale",
    intervals: [0, 3, 5, 6, 7, 10],
    note: "Use the b5 as a passing or grace note."
  },
  mixolydian: {
    label: "Mixolydian scale",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    note: "The basic dominant 7 sound."
  },
  lydianDominant: {
    label: "Lydian dominant scale",
    intervals: [0, 2, 4, 6, 7, 9, 10],
    note: "Go-to dominant sound in many major-key ii–V–I progressions; aim for the #11.",
    recommended: true
  },
  altered: {
    label: "Altered scale",
    intervals: [0, 1, 3, 4, 6, 8, 10],
    note: "Contains b9, #9, #11, and b13. Think melodic minor starting one half-step above the chord root.",
    recommended: true
  },
  diminishedHalfWhole: {
    label: "Half-whole diminished scale",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    note: "Strong altered-dominant option, especially for 7b9 sounds."
  },
  hybridBlues: {
    label: "Hybrid blues scale",
    intervals: [0, 2, 3, 4, 6, 7, 9, 10],
    note: "Combines blues language with dominant chord tones and the #11."
  },
  locrian: {
    label: "Locrian scale",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    note: "Standard half-diminished sound."
  },
  locrianNatural2: {
    label: "Locrian natural 2 / half-diminished scale",
    intervals: [0, 2, 3, 5, 6, 8, 10],
    note: "A smoother half-diminished option with a natural 2.",
    recommended: true
  },
  diminishedWholeHalf: {
    label: "Whole-half diminished scale",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    note: "Fits fully diminished 7 chords and repeats symmetrically every minor third.",
    recommended: true
  },
  melodicMinor: {
    label: "Melodic minor scale",
    intervals: [0, 2, 3, 5, 7, 9, 11],
    note: "The defining sound for minor-major 7 chords.",
    recommended: true
  }
};

const CHORD_TYPES = {
  major7: {
    label: "Major 7",
    formula: "Chord tones: 1, 3, 5, 7",
    intervals: [0, 4, 7, 11],
    scales: ["lydian", "major", "majorBlues"]
  },
  major6: {
    label: "Major 6",
    formula: "Chord tones: 1, 3, 5, 6",
    intervals: [0, 4, 7, 9],
    scales: ["lydian", "major", "majorBlues"]
  },
  minor7: {
    label: "Minor 7",
    formula: "Chord tones: 1, b3, 5, b7",
    intervals: [0, 3, 7, 10],
    scales: ["dorian", "naturalMinor", "minorBlues"]
  },
  dominant7: {
    label: "Dominant 7",
    formula: "Chord tones: 1, 3, 5, b7",
    intervals: [0, 4, 7, 10],
    scales: ["lydianDominant", "mixolydian", "altered", "diminishedHalfWhole", "hybridBlues"]
  },
  alteredDominant: {
    label: "Altered dominant",
    formula: "Chord tones: 1, 3, b7 plus altered tensions",
    intervals: [0, 4, 10],
    scales: ["altered", "diminishedHalfWhole", "lydianDominant", "hybridBlues"]
  },
  halfDiminished: {
    label: "Half-diminished",
    formula: "Chord tones: 1, b3, b5, b7",
    intervals: [0, 3, 6, 10],
    scales: ["locrianNatural2", "locrian"]
  },
  diminished7: {
    label: "Diminished 7",
    formula: "Chord tones: 1, b3, b5, bb7",
    intervals: [0, 3, 6, 9],
    scales: ["diminishedWholeHalf"]
  },
  minorMajor7: {
    label: "Minor-major 7",
    formula: "Chord tones: 1, b3, 5, 7",
    intervals: [0, 3, 7, 11],
    scales: ["melodicMinor"]
  },
  majorTriad: {
    label: "Major triad",
    formula: "Chord tones: 1, 3, 5",
    intervals: [0, 4, 7],
    scales: ["major", "lydian", "majorBlues"]
  },
  minorTriad: {
    label: "Minor triad",
    formula: "Chord tones: 1, b3, 5",
    intervals: [0, 3, 7],
    scales: ["dorian", "naturalMinor", "minorBlues"]
  }
};

const elements = {
  imageInput: document.querySelector("#imageInput"),
  dropZone: document.querySelector("#dropZone"),
  previewWrap: document.querySelector("#previewWrap"),
  imagePreview: document.querySelector("#imagePreview"),
  cleanupMode: document.querySelector("#cleanupMode"),
  analyzeImageButton: document.querySelector("#analyzeImageButton"),
  progressPanel: document.querySelector("#progressPanel"),
  progressLabel: document.querySelector("#progressLabel"),
  progressPercent: document.querySelector("#progressPercent"),
  ocrProgress: document.querySelector("#ocrProgress"),
  chordText: document.querySelector("#chordText"),
  analyzeChordsButton: document.querySelector("#analyzeChordsButton"),
  exampleButton: document.querySelector("#exampleButton"),
  clearButton: document.querySelector("#clearButton"),
  detectedChords: document.querySelector("#detectedChords"),
  results: document.querySelector("#results"),
  summary: document.querySelector("#summary"),
  processingCanvas: document.querySelector("#processingCanvas"),
  resultCardTemplate: document.querySelector("#resultCardTemplate")
};

let currentImageFile = null;
let currentObjectUrl = null;

function canonicalizeAccidentals(value) {
  return value
    .replace(/[♭]/g, "b")
    .replace(/[♯]/g, "#")
    .replace(/[−–—]/g, "-")
    .replace(/[Δ△]/g, "maj")
    .replace(/[øØ]7/g, "m7b5")
    .replace(/[øØ]/g, "m7b5")
    .replace(/[º°]/g, "dim");
}

function formatRoot(letter, accidental = "") {
  return `${letter.toUpperCase()}${accidental}`;
}

function normalizeChordSymbol(rawSymbol) {
  let symbol = canonicalizeAccidentals(rawSymbol.trim())
    .replace(/^\(+|\)+$/g, "")
    .replace(/^[|:\[\]{},;]+|[|:\[\]{},;]+$/g, "")
    .replace(/\s+/g, "");

  // Ignore inversion bass notes while preserving the actual chord quality.
  // Examples: G7/B -> G7, C/E -> C.
  symbol = symbol.replace(/\/([A-Ga-g])([#b]?)$/, "");

  symbol = symbol.replace(/O(?=7|$)/g, "dim");
  symbol = symbol.replace(/o(?=7|$)/g, "dim");

  let match = symbol.match(/^([A-Ga-g])([#b]?)(.*)$/);
  if (!match) return null;

  let root = formatRoot(match[1], match[2]);
  let suffix = match[3] || "";

  // OCR frequently reads a flat sign as the digit 6: E67 -> Eb7.
  // Restrict this repair to common extension endings to avoid changing normal C6 chords.
  if (!match[2] && /^6(7|9|11|13)(.*)$/i.test(suffix)) {
    const flatRepair = suffix.match(/^6(7|9|11|13)(.*)$/i);
    root = `${match[1].toUpperCase()}b`;
    suffix = `${flatRepair[1]}${flatRepair[2] || ""}`;
  }

  // The printed digit 7 is commonly recognized as ?, /, T, Z, I, l, or ].
  // Only repair these when they occupy the dominant-extension position.
  suffix = suffix
    .replace(/^[?\\/TtZzIil\]](?=([#b](?:5|9|11|13))|alt|sus|$)/, "7")
    .replace(/^7[?](?=([#b](?:5|9|11|13))|alt|sus|$)/, "7");

  suffix = suffix
    .replace(/Major/gi, "maj")
    .replace(/minor/gi, "m")
    .replace(/^min/i, "m")
    .replace(/^mi/i, "m")
    .replace(/^-(?=maj|M|7|6|9|11|13|$)/, "m")
    .replace(/^M(?=7|9|11|13)/, "maj")
    .replace(/\^/g, "maj")
    .replace(/\+/g, "aug");

  if (/^mmaj$/i.test(suffix)) suffix = "mMaj7";
  else suffix = suffix.replace(/^mmaj/i, "mMaj");

  return { raw: rawSymbol, root, suffix, normalized: `${root}${suffix}` };
}

function classifyChord(chord) {
  const suffixOriginal = chord.suffix;
  const suffix = suffixOriginal.toLowerCase();

  if (/^(mmaj7|mmaj9|mmaj|mmaj13|mmaj11)/.test(suffix) || /^mmaj/.test(suffix)) {
    return "minorMajor7";
  }

  if (/^(m7b5|m9b5|m11b5|half-dim|halfdim)/.test(suffix)) {
    return "halfDiminished";
  }

  if (/^(dim7|dim|o7)/.test(suffix)) {
    return "diminished7";
  }

  if (/alt/.test(suffix) || /7(b9|#9|b13|#11)/.test(suffix)) {
    return "alteredDominant";
  }

  if (/^(maj7|maj9|maj11|maj13|maj)/.test(suffix)) {
    return "major7";
  }

  if (/^(6|69|6\/9)/.test(suffix)) {
    return "major6";
  }

  if (/^(m7|m9|m11|m13)/.test(suffix)) {
    return "minor7";
  }

  if (/^(7|9|11|13|sus7|7sus)/.test(suffix)) {
    return "dominant7";
  }

  if (/^(m|m6|madd)/.test(suffix)) {
    return "minorTriad";
  }

  if (suffix === "" || /^(add|5|maj6)/.test(suffix)) {
    return "majorTriad";
  }

  return null;
}

function repairDominantOcrText(text) {
  return canonicalizeAccidentals(text)
    // Flat roots are often split into three tokens: B b 7.
    // Run this before other repairs so the lowercase b is not mistaken for a B root.
    .replace(/\b([A-G])\s+([#b])\s+(7|9|11|13|6)(?=\s|[|,;:]|$)/g, "$1$2$3")
    // Repair a lone misread 7 after a root, but do not touch slash chords such as G/B.
    .replace(/\b([A-G][#b]?)[?\\/TtZzIil\]](?=\s|[|,;:]|$)/g, "$17")
    // OCR sometimes places a space between the root and its extension.
    .replace(/\b([A-G][#b]?)\s+(7|9|11|13)(?=\s|[|,;:#b()\-]|$)/g, "$1$2");
}

function isChordRootFragment(token) {
  return /^[A-Ga-g](?:[#b])?$/.test(token);
}

function isChordSuffixFragment(token) {
  return /^(?:m|min|maj|M|dim|o|alt|aug|sus|sus2|sus4|add|[+^\-]|\d{1,2}|[#b](?:5|9|11|13)|(?:m|min|maj|M|dim|alt|sus|add)?\d{1,2}(?:[#b](?:5|9|11|13))*)$/i.test(token);
}

function coalesceChordFragments(tokens) {
  const combined = [];

  for (let index = 0; index < tokens.length; index += 1) {
    let token = tokens[index];

    // Join alterations that OCR separates from an already complete dominant root:
    // G7 b9 -> G7b9, C7 #11 -> C7#11.
    if (/^[A-Ga-g][#b]?(?:7|9|11|13)$/i.test(token)) {
      let dominantToken = token;
      let lookahead = index + 1;
      let alterationsAdded = 0;

      while (lookahead < tokens.length && alterationsAdded < 2 && /^(?:[#b](?:5|9|11|13)|alt|sus|sus4)$/i.test(tokens[lookahead])) {
        dominantToken += tokens[lookahead];
        lookahead += 1;
        alterationsAdded += 1;
      }

      combined.push(dominantToken);
      index = lookahead - 1;
      continue;
    }

    if (!isChordRootFragment(token)) {
      combined.push(token);
      continue;
    }

    let chordToken = token;
    let lookahead = index + 1;

    // Handle B b 7 or F # 7.
    if (/^[A-Ga-g]$/.test(chordToken) && /^[#b]$/.test(tokens[lookahead] || "")) {
      chordToken += tokens[lookahead];
      lookahead += 1;
    }

    // Join split suffixes such as G 7, G 7 b9, D m 7, or C maj 7.
    let fragmentsAdded = 0;
    while (lookahead < tokens.length && fragmentsAdded < 3 && isChordSuffixFragment(tokens[lookahead])) {
      chordToken += tokens[lookahead];
      lookahead += 1;
      fragmentsAdded += 1;
    }

    combined.push(chordToken);
    index = lookahead - 1;
  }

  return combined;
}

function extractChordCandidates(text) {
  const cleaned = repairDominantOcrText(text)
    .replace(/\r/g, "\n")
    .replace(/([A-Ga-g][#b]?)(?=(?:maj|m|min|dim|aug|sus|add|alt|7|9|11|13|6|\||\s|$))/g, "$1")
    // Keep slash characters so normalizeChordSymbol can correctly handle inversions.
    .replace(/[|\\,;:\[\]{}()]/g, " ");

  const rawTokens = cleaned.split(/\s+/).filter(Boolean);
  const tokens = coalesceChordFragments(rawTokens);
  const candidates = [];

  for (const token of tokens) {
    const stripped = token
      .replace(/^[^A-Ga-g]+/, "")
      .replace(/[^A-Za-z0-9#b+\-^?/\\\]]+$/g, "");

    const normalized = normalizeChordSymbol(stripped);
    if (!normalized) continue;

    const type = classifyChord(normalized);
    if (!type) continue;

    candidates.push({ ...normalized, type });
  }

  return candidates;
}

function scoreOcrText(text) {
  const chords = extractChordCandidates(text);
  const score = chords.reduce((total, chord) => {
    if (chord.type === "dominant7" || chord.type === "alteredDominant") return total + 8;
    if (["major7", "minor7", "halfDiminished", "diminished7", "minorMajor7"].includes(chord.type)) return total + 6;
    if (chord.type === "major6") return total + 4;
    return total + 1;
  }, 0);

  return { text, chords, score };
}

function prefersFlats(root) {
  return root.includes("b") || ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"].includes(root);
}

function noteNameForPc(pc, useFlats) {
  const normalizedPc = ((pc % 12) + 12) % 12;
  return (useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP)[normalizedPc];
}

function transposeIntervals(root, intervals) {
  const rootPc = NOTE_TO_PC[root];
  if (typeof rootPc !== "number") return [];
  const useFlats = prefersFlats(root);
  return intervals.map(interval => noteNameForPc(rootPc + interval, useFlats));
}

function renderDetectedChords(chords) {
  elements.detectedChords.innerHTML = "";

  if (!chords.length) {
    elements.detectedChords.innerHTML = '<span class="empty-state">No supported chord symbols found. Correct the OCR text and try again.</span>';
    return;
  }

  chords.forEach(chord => {
    const pill = document.createElement("span");
    pill.className = "chord-pill";
    pill.textContent = chord.normalized;
    pill.title = CHORD_TYPES[chord.type].label;
    elements.detectedChords.appendChild(pill);
  });
}

function renderResults(chords) {
  elements.results.innerHTML = "";

  if (!chords.length) {
    elements.summary.hidden = true;
    elements.results.innerHTML = `
      <div class="empty-results">
        <span>?</span>
        <p>No supported chords were found. Try entering them manually, separated by spaces or bar lines.</p>
      </div>
    `;
    return;
  }

  elements.summary.hidden = false;
  const uniqueCount = new Set(chords.map(chord => chord.normalized)).size;
  elements.summary.textContent = `Found ${chords.length} chord ${chords.length === 1 ? "symbol" : "symbols"} (${uniqueCount} unique). The first scale marked “Go-to” is the default recommendation from your rules.`;

  chords.forEach((chord, index) => {
    const type = CHORD_TYPES[chord.type];
    const fragment = elements.resultCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".result-card");

    fragment.querySelector(".result-index").textContent = `Chord ${index + 1}`;
    fragment.querySelector(".result-chord").textContent = chord.normalized;
    fragment.querySelector(".quality-badge").textContent = type.label;

    const chordNotes = transposeIntervals(chord.root, type.intervals);
    fragment.querySelector(".chord-formula").textContent = `${type.formula} · Notes: ${chordNotes.join(" ")}`;

    const scaleList = fragment.querySelector(".scale-list");

    type.scales.forEach(scaleKey => {
      const scale = SCALE_LIBRARY[scaleKey];
      const scaleItem = document.createElement("section");
      scaleItem.className = "scale-item";
      const notes = transposeIntervals(chord.root, scale.intervals);

      scaleItem.innerHTML = `
        <div class="scale-item__topline">
          <h4>${chord.root} ${scale.label}</h4>
          ${scale.recommended ? '<span class="scale-item__tag">Go-to</span>' : ""}
        </div>
        <p class="scale-notes">${notes.join(" · ")}</p>
        <p class="scale-note">${scale.note}</p>
        ${scale.warningDegree ? `<p class="scale-warning">${scale.warningDegree}</p>` : ""}
      `;

      scaleList.appendChild(scaleItem);
    });

    card.dataset.chord = chord.normalized;
    elements.results.appendChild(fragment);
  });
}

function analyzeChordText() {
  const chords = extractChordCandidates(elements.chordText.value);
  renderDetectedChords(chords);
  renderResults(chords);
}

function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    return;
  }

  currentImageFile = file;
  elements.analyzeImageButton.disabled = false;

  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentObjectUrl = URL.createObjectURL(file);
  elements.imagePreview.src = currentObjectUrl;
  elements.previewWrap.hidden = false;
}

function calculateOtsuThreshold(pixels) {
  const histogram = new Array(256).fill(0);
  let pixelCount = 0;

  for (let index = 0; index < pixels.length; index += 4) {
    const gray = Math.round(0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2]);
    histogram[gray] += 1;
    pixelCount += 1;
  }

  let totalIntensity = 0;
  for (let value = 0; value < 256; value += 1) totalIntensity += value * histogram[value];

  let backgroundWeight = 0;
  let backgroundSum = 0;
  let bestVariance = -1;
  let bestThreshold = 175;

  for (let value = 0; value < 256; value += 1) {
    backgroundWeight += histogram[value];
    if (!backgroundWeight) continue;

    const foregroundWeight = pixelCount - backgroundWeight;
    if (!foregroundWeight) break;

    backgroundSum += value * histogram[value];
    const backgroundMean = backgroundSum / backgroundWeight;
    const foregroundMean = (totalIntensity - backgroundSum) / foregroundWeight;
    const variance = backgroundWeight * foregroundWeight * Math.pow(backgroundMean - foregroundMean, 2);

    if (variance > bestVariance) {
      bestVariance = variance;
      bestThreshold = value;
    }
  }

  return Math.max(115, Math.min(215, bestThreshold));
}

function removeLongHorizontalLines(imageData, width, height) {
  const pixels = imageData.data;
  const rowsToClear = [];

  for (let y = 0; y < height; y += 1) {
    let darkPixels = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if (pixels[offset] < 40) darkPixels += 1;
    }
    if (darkPixels / width > 0.48) rowsToClear.push(y);
  }

  rowsToClear.forEach(y => {
    for (let clearY = Math.max(0, y - 1); clearY <= Math.min(height - 1, y + 1); clearY += 1) {
      for (let x = 0; x < width; x += 1) {
        const offset = (clearY * width + x) * 4;
        pixels[offset] = 255;
        pixels[offset + 1] = 255;
        pixels[offset + 2] = 255;
      }
    }
  });
}

function getProcessedCanvas(image, mode) {
  const canvas = elements.processingCanvas;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  const maxDimension = 2800;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  if (mode === "none") return canvas;

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const gray = Math.round(0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2]);
    let value = gray;

    if (mode === "grayscale") {
      value = Math.max(0, Math.min(255, (gray - 128) * 1.55 + 128));
    } else if (mode === "threshold") {
      // Applied after the grayscale histogram is measured below.
      value = gray;
    }

    pixels[index] = value;
    pixels[index + 1] = value;
    pixels[index + 2] = value;
  }

  if (mode === "threshold") {
    const threshold = calculateOtsuThreshold(pixels);
    for (let index = 0; index < pixels.length; index += 4) {
      const gray = pixels[index];
      const value = gray > threshold ? 255 : 0;
      pixels[index] = value;
      pixels[index + 1] = value;
      pixels[index + 2] = value;
    }
    removeLongHorizontalLines(imageData, canvas.width, canvas.height);
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function updateProgress(message, progress = 0) {
  const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));
  elements.progressPanel.hidden = false;
  elements.progressLabel.textContent = message;
  elements.progressPercent.textContent = `${percent}%`;
  elements.ocrProgress.value = percent;
}

async function analyzeImage() {
  if (!currentImageFile) return;
  if (!window.Tesseract) {
    alert("The OCR library could not load. Check your internet connection and refresh the page.");
    return;
  }

  elements.analyzeImageButton.disabled = true;
  updateProgress("Preparing image…", 0.03);
  let worker = null;

  try {
    await elements.imagePreview.decode();

    worker = await Tesseract.createWorker("eng", 1, {
      logger(message) {
        if (message.status === "recognizing text") {
          updateProgress("Reading jazz chord symbols…", 0.12 + (message.progress || 0) * 0.72);
        } else {
          updateProgress(message.status || "Preparing OCR…", Math.max(0.05, (message.progress || 0) * 0.12));
        }
      },
      // Chord symbols are not dictionary words. Disabling dictionary correction
      // reduces substitutions such as G7 -> GT.
      config: {
        load_system_dawg: "0",
        load_freq_dawg: "0",
        load_number_dawg: "0",
        load_punc_dawg: "0"
      }
    });

    const psm = Tesseract.PSM || {};
    await worker.setParameters({
      tessedit_pageseg_mode: psm.SPARSE_TEXT || "11",
      tessedit_char_whitelist: "ABCDEFGabcdefg0123456789#bMmajinordugsltDIMAJNORUGSLT+-^?/\\()|[] øØ°ºΔ△♭♯",
      preserve_interword_spaces: "1",
      user_defined_dpi: "300"
    });

    const selectedMode = elements.cleanupMode.value;
    const alternateMode = selectedMode === "threshold" ? "grayscale" : "threshold";
    const attempts = [];

    const firstSource = getProcessedCanvas(elements.imagePreview, selectedMode);
    const firstResult = await worker.recognize(firstSource);
    attempts.push(scoreOcrText(firstResult?.data?.text?.trim() || ""));

    updateProgress("Double-checking dominant 7 chords…", 0.86);
    await worker.setParameters({
      tessedit_pageseg_mode: psm.SINGLE_BLOCK || "6"
    });

    const secondSource = getProcessedCanvas(elements.imagePreview, alternateMode);
    const secondResult = await worker.recognize(secondSource);
    attempts.push(scoreOcrText(secondResult?.data?.text?.trim() || ""));

    attempts.sort((left, right) => right.score - left.score || right.chords.length - left.chords.length);
    const bestAttempt = attempts[0];

    // Show the cleaned progression instead of noisy page text whenever chords were found.
    elements.chordText.value = bestAttempt.chords.length
      ? bestAttempt.chords.map(chord => chord.normalized).join(" | ")
      : bestAttempt.text;

    updateProgress("OCR complete", 1);
    analyzeChordText();
  } catch (error) {
    console.error(error);
    updateProgress("OCR failed", 0);
    alert("The image could not be analyzed. Try a sharper crop or enter the chord symbols manually.");
  } finally {
    if (worker) await worker.terminate().catch(() => {});
    elements.analyzeImageButton.disabled = false;
  }
}

function clearApp() {
  currentImageFile = null;
  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentObjectUrl = null;

  elements.imageInput.value = "";
  elements.imagePreview.removeAttribute("src");
  elements.previewWrap.hidden = true;
  elements.analyzeImageButton.disabled = true;
  elements.progressPanel.hidden = true;
  elements.chordText.value = "";
  renderDetectedChords([]);
  renderResults([]);
}


window.JazzScaleAnalyzer = Object.freeze({
  normalizeChordSymbol,
  classifyChord,
  extractChordCandidates,
  repairDominantOcrText,
  coalesceChordFragments,
  scoreOcrText,
  transposeIntervals
});

elements.imageInput.addEventListener("change", event => loadFile(event.target.files?.[0]));
elements.analyzeImageButton.addEventListener("click", analyzeImage);
elements.analyzeChordsButton.addEventListener("click", analyzeChordText);
elements.clearButton.addEventListener("click", clearApp);

elements.exampleButton.addEventListener("click", () => {
  elements.chordText.value = "Dm7 | G7 | Cmaj7 | A7alt | Dm7b5 | G7b9 | CmMaj7";
  analyzeChordText();
});

elements.chordText.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    analyzeChordText();
  }
});

["dragenter", "dragover"].forEach(eventName => {
  elements.dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    elements.dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach(eventName => {
  elements.dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    elements.dropZone.classList.remove("is-dragging");
  });
});

elements.dropZone.addEventListener("drop", event => {
  const file = event.dataTransfer?.files?.[0];
  loadFile(file);
});
