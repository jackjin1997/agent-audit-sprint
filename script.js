document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "";
    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1300);
    } catch {
      if (target) {
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      button.textContent = "Select";
    }
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.getAttribute("data-copy-target") || "");
    const value = target?.textContent?.trim() || "";
    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1300);
    } catch {
      button.textContent = "Select";
    }
  });
});

const intakeForm = document.querySelector("[data-intake-form]");

function setButtonText(button, value) {
  const original = button.textContent;
  button.textContent = value;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1300);
}

function clean(value, fallback = "TBD") {
  const text = String(value || "").trim();
  return text || fallback;
}

function projectNameFromUrl(value) {
  const text = clean(value, "Project");
  try {
    const url = new URL(text);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.slice(-2).join("/") || url.hostname;
  } catch {
    return text.replace(/^https?:\/\//, "").split(/[?#]/)[0] || "Project";
  }
}

function buildBrief(form) {
  const data = new FormData(form);
  const project = clean(data.get("project"));
  const scope = clean(data.get("scope"));
  const visibility = clean(data.get("visibility"));
  const network = clean(data.get("network"));
  const targetDate = clean(data.get("targetDate"), "48h default after payment confirmation and scope acceptance");
  const risk = clean(data.get("risk"));

  return [
    "## Project or repo URL",
    project,
    "",
    "## Scope",
    scope,
    "",
    "## Delivery visibility",
    visibility,
    "",
    "## Target delivery date",
    targetDate,
    "",
    "## Payment network",
    network,
    "",
    "## Transaction hash",
    "Pending until scope is accepted and payment is sent.",
    "",
    "## Highest concern",
    risk,
    "",
    "## Confirmation",
    "- [x] I will not include secrets, credentials, cookies, private keys, or sensitive customer data.",
    "- [x] I understand this is a USD $1,000 fixed-price audit for one repo or product slice.",
    "- [x] I reviewed the Statement of Work: https://jackjin1997.github.io/agent-audit-sprint/terms.html",
  ].join("\n");
}

function updateBrief() {
  if (!intakeForm) return;
  const output = intakeForm.querySelector("[data-brief-output]");
  const openLink = intakeForm.querySelector("[data-open-brief]");
  const brief = buildBrief(intakeForm);
  const project = clean(new FormData(intakeForm).get("project"), "project name");
  const title = `Audit request: ${projectNameFromUrl(project)}`;
  output.value = brief;
  openLink.href = `https://github.com/jackjin1997/agent-audit-sprint/issues/new?labels=audit-request&title=${encodeURIComponent(title)}&body=${encodeURIComponent(brief)}`;
}

if (intakeForm) {
  updateBrief();
  intakeForm.addEventListener("input", updateBrief);
  intakeForm.addEventListener("change", updateBrief);
  intakeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateBrief();
    intakeForm.querySelector("[data-brief-output]").focus();
  });

  intakeForm.querySelector("[data-copy-brief]").addEventListener("click", async (event) => {
    updateBrief();
    const output = intakeForm.querySelector("[data-brief-output]");
    try {
      await navigator.clipboard.writeText(output.value);
      setButtonText(event.currentTarget, "Copied");
    } catch {
      output.select();
      setButtonText(event.currentTarget, "Select");
    }
  });
}

const jingleForm = document.querySelector("[data-jingle-form]");
let currentSketchUrl = "";

function compactTitle(value, fallback = "brand") {
  return clean(value, fallback).replace(/\s+/g, " ").slice(0, 80);
}

function buildJinglePacket(form) {
  const data = new FormData(form);
  const brand = clean(data.get("brand"), "Brand TBD");
  const selectedPackage = clean(data.get("package"), "USD $149 Ad Music Pack");
  const usage = clean(data.get("usage"), "30 second social ad");
  const timing = clean(data.get("timing"), "48h target");
  const mood = clean(data.get("mood"), "catchy, brand-safe, memorable");
  const style = clean(data.get("style"), "clear vocal hook with polished ad music bed");
  const audience = clean(data.get("audience"), "Audience and offer TBD");
  const tagline = clean(data.get("tagline"), "No required tagline provided");

  const productionPrompt = [
    `Create a ${usage.toLowerCase()} for "${brand}".`,
    `Mood: ${mood}.`,
    `Voice or style: ${style}.`,
    `Audience and offer: ${audience}.`,
    `Required line or tagline: ${tagline}.`,
    "Keep the hook simple, pronounce the brand clearly, avoid known-artist soundalikes, avoid third-party lyrics, and end cleanly for ad placement.",
  ].join("\n");

  return [
    "## AI jingle order",
    "",
    `Package: ${selectedPackage}`,
    `Brand/show: ${brand}`,
    `Primary use: ${usage}`,
    `Timing: ${timing}`,
    "",
    "## Brand brief",
    "",
    audience,
    "",
    "## Required line or tagline",
    "",
    tagline,
    "",
    "## Production prompt",
    "",
    productionPrompt,
    "",
    "## Delivery expectations",
    "",
    "- AI-assisted generation with human selection for pronunciation, hook clarity, length fit, and obvious artifacts.",
    "- Deliver prompt/lyric sheet, selected cut notes, source tool summary, and commercial-use assumptions.",
    "- Do not imitate named artists, clone living voices, or include third-party lyrics unless rights are provided.",
    "- Payment is requested only after the brief and package are accepted in writing.",
    "- AI-generated music may have copyright-registration limits; this is not legal clearance.",
  ].join("\n");
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function midiToHz(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function jingleSketchPlan(form) {
  const data = new FormData(form);
  const brand = clean(data.get("brand"), "Brand TBD");
  const usage = clean(data.get("usage"), "30 second social ad");
  const mood = clean(data.get("mood"), "catchy");
  const seed = hashString(`${brand}|${usage}|${mood}`);
  const roots = [
    { name: "C", midi: 60 },
    { name: "D", midi: 62 },
    { name: "E", midi: 64 },
    { name: "G", midi: 67 },
    { name: "A", midi: 69 },
  ];
  const root = roots[seed % roots.length];
  const bpm = 104 + (seed % 29);
  const scale = [0, 2, 4, 7, 9, 12];
  const melody = Array.from({ length: 12 }, (_, index) => {
    const step = (seed >> (index % 16)) + index * 3;
    return root.midi + scale[step % scale.length] + (index % 4 === 3 ? 12 : 0);
  });
  return {
    brand,
    usage,
    mood,
    root: root.name,
    bpm,
    durationSeconds: 8,
    sampleRate: 44100,
    melody,
  };
}

function synthesizeJingleSketch(plan) {
  const totalSamples = plan.sampleRate * plan.durationSeconds;
  const samples = new Float32Array(totalSamples);
  const beatSeconds = 60 / plan.bpm;
  const noteSeconds = beatSeconds * 0.78;

  for (let noteIndex = 0; noteIndex < plan.melody.length; noteIndex += 1) {
    const start = Math.floor(noteIndex * beatSeconds * plan.sampleRate);
    const length = Math.floor(noteSeconds * plan.sampleRate);
    const freq = midiToHz(plan.melody[noteIndex]);
    const harmony = midiToHz(plan.melody[noteIndex] - 12);
    for (let offset = 0; offset < length && start + offset < totalSamples; offset += 1) {
      const time = offset / plan.sampleRate;
      const envelope = Math.min(1, offset / 700) * Math.max(0, 1 - offset / length);
      const tone = Math.sin(2 * Math.PI * freq * time) * 0.22 + Math.sin(2 * Math.PI * harmony * time) * 0.08;
      samples[start + offset] += tone * envelope;
    }
  }

  for (let beat = 0; beat < Math.floor(plan.durationSeconds / beatSeconds); beat += 1) {
    const start = Math.floor(beat * beatSeconds * plan.sampleRate);
    const isAccent = beat % 4 === 0;
    const length = Math.floor((isAccent ? 0.1 : 0.045) * plan.sampleRate);
    for (let offset = 0; offset < length && start + offset < totalSamples; offset += 1) {
      const time = offset / plan.sampleRate;
      const envelope = Math.max(0, 1 - offset / length);
      const freq = isAccent ? 64 - time * 90 : 180;
      samples[start + offset] += Math.sin(2 * Math.PI * freq * time) * envelope * (isAccent ? 0.32 : 0.12);
    }
  }

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.max(-0.92, Math.min(0.92, samples[index]));
  }

  return samples;
}

function writeAscii(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function encodeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
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
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let index = 0; index < samples.length; index += 1) {
    const value = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true);
    offset += 2;
  }
  return new Blob([view], { type: "audio/wav" });
}

function updateSketchDownload(form) {
  const link = form.querySelector("[data-download-jingle-sketch]");
  const status = form.querySelector("[data-jingle-sketch-status]");
  const plan = jingleSketchPlan(form);
  const samples = synthesizeJingleSketch(plan);
  const blob = encodeWav(samples, plan.sampleRate);
  if (currentSketchUrl) URL.revokeObjectURL(currentSketchUrl);
  currentSketchUrl = URL.createObjectURL(blob);
  link.href = currentSketchUrl;
  link.download = `${plan.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ai-jingle"}-sketch.wav`;
  status.textContent = `Browser sketch ready: ${plan.root} major, ${plan.bpm} BPM, ${plan.durationSeconds}s draft for ${plan.usage}. Paid delivery uses selected AI-assisted generations and a usage memo.`;
  return { plan, samples };
}

async function playJingleSketch(form) {
  const status = form.querySelector("[data-jingle-sketch-status]");
  const { plan, samples } = updateSketchDownload(form);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    status.textContent = "Audio preview is not supported in this browser, but the WAV sketch download is ready.";
    return;
  }
  const context = new AudioContextClass();
  const buffer = context.createBuffer(1, samples.length, plan.sampleRate);
  buffer.copyToChannel(samples, 0);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
  status.textContent = `Playing browser sketch: ${plan.root} major, ${plan.bpm} BPM, ${plan.durationSeconds}s draft for ${plan.brand}.`;
}

function updateJingleBrief() {
  if (!jingleForm) return;
  const output = jingleForm.querySelector("[data-jingle-output]");
  const openLink = jingleForm.querySelector("[data-open-jingle-brief]");
  const packet = buildJinglePacket(jingleForm);
  const brand = compactTitle(new FormData(jingleForm).get("brand"), "brand");
  const title = `AI jingle order: ${brand}`;
  output.value = packet;
  openLink.href = `https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=ai-jingle-order.yml&labels=ai-jingle-order&title=${encodeURIComponent(title)}&body=${encodeURIComponent(packet)}`;
  updateSketchDownload(jingleForm);
}

if (jingleForm) {
  updateJingleBrief();
  jingleForm.addEventListener("input", updateJingleBrief);
  jingleForm.addEventListener("change", updateJingleBrief);
  jingleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateJingleBrief();
    jingleForm.querySelector("[data-jingle-output]").focus();
  });

  jingleForm.querySelector("[data-copy-jingle-brief]").addEventListener("click", async (event) => {
    updateJingleBrief();
    const output = jingleForm.querySelector("[data-jingle-output]");
    try {
      await navigator.clipboard.writeText(output.value);
      setButtonText(event.currentTarget, "Copied");
    } catch {
      output.select();
      setButtonText(event.currentTarget, "Select");
    }
  });

  jingleForm.querySelector("[data-play-jingle-sketch]").addEventListener("click", async () => {
    await playJingleSketch(jingleForm);
  });

  jingleForm.querySelector("[data-download-jingle-sketch]").addEventListener("click", () => {
    updateSketchDownload(jingleForm);
  });
}
