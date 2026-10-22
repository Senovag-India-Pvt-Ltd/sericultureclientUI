import React from "react";

// Colour-coded pill for a ticket status name (display only — the status value
// itself is never changed here).
const TONES = {
  new: { bg: "#e8f3ff", fg: "#1e67a8", border: "#bcd8f5" },
  open: { bg: "#fff5e1", fg: "#a86400", border: "#f5d9a0" },
  escalated: { bg: "#f0e8ff", fg: "#6a3fb5", border: "#d6c2f5" },
  resolved: { bg: "#e3f6f4", fg: "#0f766e", border: "#b3e3dd" },
  closed: { bg: "#e6f6ea", fg: "#1f7a36", border: "#b8e0c2" },
  other: { bg: "#eef2f7", fg: "#475569", border: "#d3dce8" },
};

const toneFor = (name) => {
  const n = String(name || "").toLowerCase();
  if (n.includes("new")) return TONES.new;
  if (n.includes("escalat")) return TONES.escalated;
  if (n.includes("resolv")) return TONES.resolved;
  if (n.includes("clos")) return TONES.closed;
  if (n.includes("open") || n.includes("pending")) return TONES.open;
  return TONES.other;
};

export function StatusBadge({ name }) {
  if (!name) return <span>—</span>;
  const tone = toneFor(name);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "999px",
        background: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.border}`,
        fontSize: "11.5px",
        fontWeight: 700,
        letterSpacing: "0.2px",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </span>
  );
}

// Escapes text before it is placed inside a SweetAlert `html` string.
export const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
