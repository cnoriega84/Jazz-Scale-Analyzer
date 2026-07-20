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
  libraryInput: document.querySelector("#libraryInput"),
  cameraInput: document.querySelector("#cameraInput"),
  libraryButton: document.querySelector("#libraryButton"),
  cameraButton: document.querySelector("#cameraButton"),
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

  symbol = symbol.replace(/O(?=7|$)/g, "dim");
  symbol = symbol.replace(/o(?=7|$)/g, "dim");

  const match = symbol.match(/^([A-Ga-g])([#b]?)(.*)$/);
  if (!match) return null;

  const root = formatRoot(match[1], match[2]);
  let suffix = match[3] || "";

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

function extractChordCandidates(text) {
  const cleaned = canonicalizeAccidentals(text)
    .replace(/\r/g, "\n")
    .replace(/([A-Ga-g][#b]?)(?=(?:maj|m|min|dim|aug|sus|add|alt|7|9|11|13|6|\||\s|$))/g, "$1")
    .replace(/[|/\\,;:\[\]{}()]/g, " ");

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const candidates = [];

  for (const token of tokens) {
    const stripped = token
      .replace(/^[^A-Ga-g]+/, "")
      .replace(/[^A-Za-z0-9#b+\-^]+$/g, "");

    const normalized = normalizeChordSymbol(stripped);
    if (!normalized) continue;

    const type = classifyChord(normalized);
    if (!type) continue;

    candidates.push({ ...normalized, type });
  }

  return candidates;
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
  if (!file) return;

  if (!file.type.startsWith("image/")) {
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

function getProcessedCanvas(image, mode) {
  const canvas = elements.processingCanvas;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  const maxDimension = 2200;
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
      value = gray > 175 ? 255 : 0;
    }

    pixels[index] = value;
    pixels[index + 1] = value;
    pixels[index + 2] = value;
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

  try {
    await elements.imagePreview.decode();
    const source = getProcessedCanvas(elements.imagePreview, elements.cleanupMode.value);

    const result = await Tesseract.recognize(source, "eng", {
      logger(message) {
        if (message.status === "recognizing text") {
          updateProgress("Reading chord symbols…", message.progress || 0);
        } else {
          updateProgress(message.status || "Working…", message.progress || 0.05);
        }
      }
    });

    const text = result?.data?.text?.trim() || "";
    elements.chordText.value = text;
    updateProgress("OCR complete", 1);
    analyzeChordText();
  } catch (error) {
    console.error(error);
    updateProgress("OCR failed", 0);
    alert("The image could not be analyzed. Try a sharper crop or enter the chord symbols manually.");
  } finally {
    elements.analyzeImageButton.disabled = false;
  }
}

function clearApp() {
  currentImageFile = null;
  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentObjectUrl = null;

  elements.libraryInput.value = "";
  elements.cameraInput.value = "";
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
  transposeIntervals
});

function handleImageSelection(event) {
  loadFile(event.target.files?.[0]);
}

[elements.libraryInput, elements.cameraInput].forEach(input => {
  input.addEventListener("click", () => {
    // Ensure choosing the same image again still fires a change event.
    input.value = "";
  });
  input.addEventListener("change", handleImageSelection);
});

elements.libraryButton.addEventListener("click", () => {
  elements.libraryInput.value = "";
  elements.libraryInput.click();
});

elements.cameraButton.addEventListener("click", () => {
  elements.cameraInput.value = "";
  elements.cameraInput.click();
});
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
