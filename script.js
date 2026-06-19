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
