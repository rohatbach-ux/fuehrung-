// Kleiner, sicherer Markdown-Renderer für aufbereitete Inhalte.
// Unterstützt: ## / ### Überschriften, **fett**, *kursiv*, Listen (-, *, •, 1.), > Zitate, Tabellen, --- Trenner, Absätze.
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}][\u{FE0F}\u{200D}\p{Extended_Pictographic}]*\s?/gu;

function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*(?!\s)(.+?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
}

export function md(src, { emoji = true } = {}) {
  let text = String(src ?? "").replace(/\r\n?/g, "\n");
  if (!emoji) text = text.replace(EMOJI, "");
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  const isSep = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^\s*(#{1,4})\s+(.*)$/))) {
      const lvl = Math.min(4, Math.max(3, m[1].length + 1)); // # → h3 … in Karten nie größer als h3
      out.push(`<h${lvl} class="md-h">${inline(m[2])}</h${lvl}>`); i++; continue;
    }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) { out.push('<hr class="md-hr">'); i++; continue; }
    if (/^\s*>/.test(l)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
      out.push(`<blockquote class="md-q">${buf.map(inline).join("<br>")}</blockquote>`); continue;
    }
    if (isTableRow(l) && i + 1 < lines.length && isSep(lines[i + 1])) {
      const cells = (r) => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const head = cells(l); i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) { rows.push(cells(lines[i])); i++; }
      out.push(`<div class="md-tw"><table class="md-t"><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^\s*([-*•]|\d+[.)])\s+/.test(l)) {
      const ordered = /^\s*\d+[.)]\s+/.test(l);
      const items = [];
      while (i < lines.length && /^\s*([-*•]|\d+[.)])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*•]|\d+[.)])\s+/, "")); i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*•]|\d+[.)])\s+/.test(lines[i])) { items[items.length - 1] += " " + lines[i].trim(); i++; }
      }
      out.push(`<${ordered ? "ol" : "ul"} class="md-l">${items.map((x) => `<li>${inline(x)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(#{1,4}\s|>|([-*•]|\d+[.)])\s+|-{3,}\s*$)/.test(lines[i]) && !(isTableRow(lines[i]) && isSep(lines[i + 1] || ""))) { buf.push(lines[i]); i++; }
    out.push(`<p>${buf.map(inline).join("<br>")}</p>`);
  }
  return `<div class="md">${out.join("")}</div>`;
}
export const stripEmoji = (s) => String(s ?? "").replace(EMOJI, "");
