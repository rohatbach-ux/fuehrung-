// Lädt die Podcast-Feeds aus feeds/sources.json und schreibt data/podcasts.json.
// Läuft in GitHub Actions (Node 22, keine Abhängigkeiten).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";

const SRC = "feeds/sources.json";
const OUT = "data/podcasts.json";
const UA = "Mozilla/5.0 (compatible; Fuehrungskompass/1.0; +https://github.com)";

const { podcasts: sources } = JSON.parse(await readFile(SRC, "utf8"));
let previous = { podcasts: [] };
try { previous = JSON.parse(await readFile(OUT, "utf8")); } catch { /* erster Lauf */ }

async function get(url, accept) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: accept || "*/*" }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} für ${url}`);
  return res.text();
}

async function resolveFeed(src) {
  if (src.feed) return { feed: src.feed };
  const q = new URLSearchParams({ term: src.search, media: "podcast", entity: "podcast", country: src.country || "de", limit: "15" });
  const data = JSON.parse(await get(`https://itunes.apple.com/search?${q}`, "application/json"));
  const re = new RegExp(src.match, "i");
  const cands = (data.results || []).filter((r) => r.feedUrl);
  console.log(`  Kandidaten für "${src.search}":`);
  cands.slice(0, 8).forEach((r) => console.log(`   - ${r.collectionName} | ${r.artistName} | ${r.feedUrl}`));
  const hit = cands.find((r) => re.test(`${r.collectionName} ${r.artistName}`));
  if (!hit) return null;
  return { feed: hit.feedUrl, name: hit.collectionName, author: hit.artistName, image: hit.artworkUrl600 || hit.artworkUrl100, apple: hit.collectionViewUrl };
}

const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const stripHtml = (s) => decode(decode(s).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]).trim() : "";
}
function attr(xml, name, a) {
  const m = xml.match(new RegExp(`<${name}\\s[^>]*?${a}\\s*=\\s*["']([^"']+)["']`, "i"));
  return m ? decode(m[1]) : "";
}
function duration(s) {
  if (!s) return 0;
  if (/^\d+$/.test(s)) return +s;
  return s.split(":").map(Number).reduce((t, n) => t * 60 + (n || 0), 0);
}
const https = (u) => (u || "").replace(/^http:\/\//i, "https://");

function parseFeed(xml, src) {
  const channel = xml.split(/<item[\s>]/i)[0];
  const items = xml.split(/<item[\s>]/i).slice(1).map((x) => x.split(/<\/item>/i)[0]);
  const episodes = [];
  for (const it of items) {
    const audio = attr(it, "enclosure", "url");
    if (!audio) continue;
    const guid = tag(it, "guid") || audio;
    const date = new Date(tag(it, "pubDate"));
    const desc = stripHtml(tag(it, "itunes:summary") || tag(it, "description") || tag(it, "content:encoded"));
    episodes.push({
      id: `${src.id}-${createHash("sha1").update(guid).digest("hex").slice(0, 10)}`,
      title: stripHtml(tag(it, "title")),
      date: isNaN(date) ? "" : date.toISOString(),
      duration: duration(tag(it, "itunes:duration")),
      audio: https(audio),
      link: tag(it, "link"),
      desc: desc.length > 600 ? desc.slice(0, 597) + "…" : desc,
    });
  }
  episodes.sort((a, b) => b.date.localeCompare(a.date));
  return {
    title: stripHtml(tag(channel, "title")),
    author: stripHtml(tag(channel, "itunes:author")),
    image: https(attr(channel, "itunes:image", "href") || tag(tag(channel, "image"), "url")),
    link: tag(channel, "link"),
    episodes: episodes.slice(0, src.max || 30),
  };
}

const out = { updated: new Date().toISOString(), podcasts: [], missing: [] };
for (const src of sources) {
  console.log(`▶ ${src.name}`);
  try {
    const r = await resolveFeed(src);
    if (!r) {
      console.log("  ✗ Kein passender Podcast gefunden – Feed-Adresse in feeds/sources.json eintragen.");
      out.missing.push(src.name);
      continue;
    }
    console.log(`  Feed: ${r.feed}`);
    const feed = parseFeed(await get(r.feed, "application/rss+xml, application/xml, text/xml"), src);
    if (!feed.episodes.length) throw new Error("Feed ohne Folgen");
    out.podcasts.push({
      id: src.id, name: src.name, short: src.short || src.name, category: src.category,
      author: feed.author || r.author || "", image: feed.image || r.image || "", link: feed.link || r.apple || "", feed: r.feed,
      episodes: feed.episodes,
    });
    console.log(`  ✓ ${feed.episodes.length} Folgen, neueste: ${feed.episodes[0].title} (${feed.episodes[0].date.slice(0, 10)})`);
  } catch (e) {
    console.log(`  ✗ Fehler: ${e.message}`);
    const old = previous.podcasts.find((p) => p.id === src.id);
    if (old) { out.podcasts.push(old); console.log("  → alte Daten beibehalten"); }
    else out.missing.push(src.name);
  }
}

await mkdir("data", { recursive: true });
const sameAsBefore = JSON.stringify({ ...previous, updated: 0 }) === JSON.stringify({ ...out, updated: 0 });
if (sameAsBefore) console.log("Keine Änderungen.");
else await writeFile(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`Fertig: ${out.podcasts.length} Podcasts, fehlend: ${out.missing.join(", ") || "–"}`);
