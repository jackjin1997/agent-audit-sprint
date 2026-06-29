#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, "assets/audio");
const sampleRate = 22050;

const samples = [
  {
    file: "coffee-shop-30s-hook.wav",
    bpm: 118,
    root: 60,
    seconds: 7,
    melody: [0, 4, 7, 9, 7, 4, 2, 0, 4, 7, 12, 9],
    accent: 0.34,
  },
  {
    file: "business-show-intro.wav",
    bpm: 104,
    root: 57,
    seconds: 7,
    melody: [0, 3, 7, 10, 7, 5, 3, 0, 7, 10, 12, 10],
    accent: 0.26,
  },
  {
    file: "radio-id-drop.wav",
    bpm: 132,
    root: 62,
    seconds: 5,
    melody: [0, 7, 12, 14, 12, 7, 5, 2],
    accent: 0.38,
  },
  {
    file: "product-demo-hook.wav",
    bpm: 124,
    root: 64,
    seconds: 7,
    melody: [0, 4, 7, 11, 9, 7, 4, 2, 0, 7, 9, 12],
    accent: 0.31,
  },
];

function midiToHz(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function synthesize({ bpm, root, seconds, melody, accent }) {
  const totalSamples = Math.floor(sampleRate * seconds);
  const output = new Float32Array(totalSamples);
  const beatSeconds = 60 / bpm;
  const noteSeconds = beatSeconds * 0.82;

  for (let noteIndex = 0; noteIndex < melody.length; noteIndex += 1) {
    const start = Math.floor(noteIndex * beatSeconds * sampleRate);
    const length = Math.floor(noteSeconds * sampleRate);
    const main = midiToHz(root + melody[noteIndex]);
    const bass = midiToHz(root + melody[noteIndex] - 24);
    for (let offset = 0; offset < length && start + offset < totalSamples; offset += 1) {
      const time = offset / sampleRate;
      const envelope = Math.min(1, offset / 260) * Math.max(0, 1 - offset / length);
      const tone =
        Math.sin(2 * Math.PI * main * time) * 0.22 +
        Math.sin(2 * Math.PI * main * 2 * time) * 0.04 +
        Math.sin(2 * Math.PI * bass * time) * 0.08;
      output[start + offset] += tone * envelope;
    }
  }

  const beatCount = Math.floor(seconds / beatSeconds);
  for (let beat = 0; beat < beatCount; beat += 1) {
    const start = Math.floor(beat * beatSeconds * sampleRate);
    const isDownbeat = beat % 4 === 0;
    const length = Math.floor((isDownbeat ? 0.11 : 0.04) * sampleRate);
    for (let offset = 0; offset < length && start + offset < totalSamples; offset += 1) {
      const time = offset / sampleRate;
      const envelope = Math.max(0, 1 - offset / length);
      const freq = isDownbeat ? 72 - time * 100 : 210;
      output[start + offset] += Math.sin(2 * Math.PI * freq * time) * envelope * (isDownbeat ? accent : 0.12);
    }
  }

  for (let index = 0; index < output.length; index += 1) {
    output[index] = Math.max(-0.94, Math.min(0.94, output[index]));
  }

  return output;
}

function writeAscii(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function encodeWav(floatSamples) {
  const bytes = new ArrayBuffer(44 + floatSamples.length * 2);
  const view = new DataView(bytes);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + floatSamples.length * 2, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, floatSamples.length * 2, true);

  let offset = 44;
  for (const sample of floatSamples) {
    const value = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true);
    offset += 2;
  }

  return Buffer.from(bytes);
}

mkdirSync(outDir, { recursive: true });

for (const sample of samples) {
  const bytes = encodeWav(synthesize(sample));
  const outputPath = resolve(outDir, sample.file);
  writeFileSync(outputPath, bytes);
  console.log(`wrote ${outputPath}`);
}
