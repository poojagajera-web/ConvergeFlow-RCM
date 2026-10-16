#!/usr/bin/env node
/**
 * Imports the SEO team's revision package (content/rcm-revision-2026-10-15)
 * into structured JSON the site renders from.
 *
 *   node scripts/import-content.mjs
 *
 * Public copy only: developer notes, status lines, keyword briefs, layout
 * markers ([HERO], [THANK YOU], …) and dynamic placeholders are dropped.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "content", "rcm-revision-2026-10-15");
const OUT = path.join(ROOT, "src", "content", "generated");

const tracker = fs
  .readFileSync(path.join(SRC, "reference", "Content Tracker.csv"), "utf8")
  .replace(/^﻿/, "")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => {
    const [page, url, folder, status] = line.split(",");
    return { page, url, folder, status };
  });

const nav = JSON.parse(fs.readFileSync(path.join(SRC, "reference", "Navigation Specification.json"), "utf8"));
const navLabel = new Map();
for (const item of nav.primary) {
  navLabel.set(item.url, item.label);
  for (const child of item.children ?? []) navLabel.set(child.url, child.label);
}

const CATEGORY = { Core: "company", Industries: "industries", Resources: "resources", Services: "services", Technology: "technology" };
const SHORT_LABEL = {
  "/services/": "Services overview",
  "/technology/": "Technology overview",
  "/resources/": "Resources",
  "/about/": "About",
  "/contact/": "Contact",
  "/how-it-works/": "How It Works",
  "/pricing/": "Pricing",
  "/demo/": "Schedule a Demo",
  "/why-convergeflow/": "Why ConvergeFlow",
  "/industries/medical/": "Medical Clinics",
};

const BUTTON = /^\*\*\[Button\]\s*(.+?)\*\*\s*→\s*`([^`]+)`/;
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

function parsePage(md) {
  const lines = md.replace(/\r/g, "").split("\n");
  const page = { seo: {}, breadcrumb: null, hero: null, sections: [], faq: null, form: null, finalCta: null };
  let mode = "skip"; // skip | hero | section | final | form | drop
  let current = null; // active section or hero/final container
  let sub = null; // active ### subsection
  let para = [];

  const target = () => (sub ? sub.blocks : current?.blocks);
  const flush = () => {
    if (!para.length) return;
    const text = para.join(" ").trim();
    para = [];
    if (!text || !current) return;
    target()?.push({ type: "p", text });
  };
  const closeSection = () => {
    flush();
    sub = null;
    if (mode === "section" && current) page.sections.push(current);
    current = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    // metadata lines anywhere
    let m;
    if ((m = line.match(/^- \*\*Title tag:\*\*\s*(.+)$/))) {
      page.seo.title = m[1].trim();
      continue;
    }
    if ((m = line.match(/^- \*\*Meta description:\*\*\s*(.+)$/))) {
      page.seo.description = m[1].trim();
      continue;
    }
    if ((m = line.match(/^\*\*Breadcrumb:\*\*\s*(.+)$/))) {
      page.breadcrumb = m[1].split("/").map((s) => s.trim());
      continue;
    }
    if (/^\*Developer:/.test(line) || /^\*\*(Status|URL):\*\*/.test(line)) continue;
    if (line === "---") {
      flush();
      continue;
    }

    // headings
    if (line.startsWith("## ")) {
      const h = line.slice(3).trim();
      closeSection();
      if (h === "SEO fields") mode = "skip";
      else if (h === "[HERO]") {
        mode = "hero";
        page.hero = { title: "", blocks: [], buttons: [] };
        current = page.hero;
      } else if (h === "[FINAL CTA]") {
        mode = "final";
        page.finalCta = { title: "", blocks: [], buttons: [] };
        current = page.finalCta;
      } else if (h === "[FORM SECTION]") {
        mode = "form";
        page.form = { title: "", blocks: [], fields: [], submit: "", id: "demo-request" };
        current = page.form;
      } else if (/^\[(THANK YOU|APPROVED RESOURCE CARDS)/.test(h)) {
        mode = "drop";
      } else if ((mode === "final" || mode === "form") && !(mode === "final" ? page.finalCta : page.form).title) {
        // the heading that follows a marker belongs to it
        const box = mode === "final" ? page.finalCta : page.form;
        box.title = h;
        current = box;
      } else {
        mode = "section";
        current = { id: slugify(h), title: h, blocks: [] };
      }
      continue;
    }
    if (line.startsWith("# ")) {
      if (mode === "hero" && page.hero && !page.hero.title) page.hero.title = line.slice(2).trim();
      continue; // the file title "# X: Page Content" is never public
    }
    if (line.startsWith("### ")) {
      if (mode !== "section") continue;
      flush();
      sub = { title: line.slice(4).trim(), blocks: [] };
      current.blocks.push({ type: "sub", ...sub, blocks: sub.blocks });
      // keep a live reference so later paragraphs land in the subsection
      sub = current.blocks[current.blocks.length - 1];
      continue;
    }
    if (mode === "skip" || mode === "drop" || !current) continue;

    // buttons / form spec
    if ((m = line.match(BUTTON))) {
      flush();
      (current.buttons ??= []).push({ label: m[1].trim(), href: m[2].trim() });
      continue;
    }
    if ((m = line.match(/^\*\*\[Form\][^*]*\*\*\s*\((.+)\)\s*$/))) {
      flush();
      for (const part of m[1].split(";")) {
        const t = part.trim();
        const idm = t.match(/^id="([^"]+)"/);
        if (idm) {
          page.form.id = idm[1];
          continue;
        }
        const fm = t.match(/^(.+?)\s+(required|optional)$/i);
        if (fm) page.form.fields.push({ label: fm[1].trim(), required: fm[2].toLowerCase() === "required" });
      }
      continue;
    }
    if ((m = line.match(/^\*\*Form submit label:\*\*\s*(.+)$/))) {
      page.form.submit = m[1].trim();
      continue;
    }
    if (/^\*\*\[Link\]/.test(line)) continue;

    // tables
    if (line.startsWith("|")) {
      flush();
      const cells = line
        .slice(1, line.endsWith("|") ? -1 : undefined)
        .split("|")
        .map((c) => c.trim());
      if (cells.every((c) => /^-+$/.test(c))) continue;
      const blocks = target();
      const last = blocks[blocks.length - 1];
      if (last?.type === "table") last.rows.push(cells);
      else blocks.push({ type: "table", head: cells, rows: [] });
      continue;
    }

    // lists
    if (/^[-*] /.test(line)) {
      flush();
      const blocks = target();
      const last = blocks[blocks.length - 1];
      const item = line.slice(2).trim();
      if (last?.type === "list") last.items.push(item);
      else blocks.push({ type: "list", items: [item] });
      continue;
    }

    if (!line) {
      flush();
      continue;
    }
    para.push(line);
  }
  closeSection();

  // A section made only of question subsections is the FAQ.
  const faqIndex = page.sections.findIndex((s) => {
    const subs = s.blocks.filter((b) => b.type === "sub");
    return subs.length > 0 && subs.every((b) => b.title.trim().endsWith("?"));
  });
  if (faqIndex >= 0) {
    const s = page.sections.splice(faqIndex, 1)[0];
    page.faq = {
      title: s.title,
      intro: s.blocks.filter((b) => b.type === "p").map((b) => b.text),
      items: s.blocks.filter((b) => b.type === "sub").map((b) => ({ q: b.title, a: b.blocks.filter((x) => x.type === "p").map((x) => x.text) })),
    };
  }
  return page;
}

const pages = [];
for (const row of tracker) {
  if (row.url === "/") continue;
  const rel = row.folder.replace(/^02 Priority Pages\//, "");
  const dir = path.join(SRC, "pages", rel);
  const md = fs.readFileSync(path.join(dir, "02 Content.md"), "utf8");
  const parsed = parsePage(md);
  const schemaPath = path.join(dir, "schema.jsonld");
  const schema = fs.existsSync(schemaPath) ? JSON.parse(fs.readFileSync(schemaPath, "utf8")) : null;
  const group = rel.split("/")[0];
  const route = row.url;
  const label = SHORT_LABEL[route] ?? navLabel.get(route) ?? row.page.replace(/^\d+\s+/, "");
  pages.push({
    route,
    segments: route.split("/").filter(Boolean),
    category: CATEGORY[group] ?? "company",
    label,
    ...parsed,
    schema,
  });
}

// Homepage: the JSON is the implementation source; drop internal notes.
const home = JSON.parse(fs.readFileSync(path.join(SRC, "homepage", "Homepage Content.json"), "utf8"));
const homeSchema = JSON.parse(fs.readFileSync(path.join(SRC, "homepage", "schema.jsonld"), "utf8"));
const strip = (o) => {
  if (Array.isArray(o)) return o.map(strip);
  if (o && typeof o === "object") {
    const out = {};
    for (const [k, v] of Object.entries(o)) if (!["notes", "status", "basis", "publication_note", "date"].includes(k)) out[k] = strip(v);
    return out;
  }
  return o;
};
const homepage = { ...strip(home), schema: homeSchema };

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "pages.json"), JSON.stringify(pages, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "homepage.json"), JSON.stringify(homepage, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "navigation.json"), JSON.stringify(nav, null, 2) + "\n");

// Leak check: nothing internal may survive into public JSON.
const all = JSON.stringify({ pages: pages.map(({ schema, ...p }) => p), homepage: { ...homepage, schema: null } });
const leaks = ["Developer:", "[HERO]", "[FINAL CTA]", "[THANK YOU]", "[Form]", "Draft—", "Draft —", "for human review", "Page Content", "marketing-domain.invalid"].filter((t) => all.includes(t));
console.log(`Imported ${pages.length} pages + homepage → src/content/generated/`);
for (const p of pages) {
  console.log(
    `  ${p.route.padEnd(38)} ${p.category.padEnd(10)} sections=${p.sections.length} faq=${p.faq?.items.length ?? 0} form=${p.form ? p.form.fields.length : "-"} cta=${p.finalCta ? "y" : "n"}`,
  );
}
if (leaks.length) {
  console.error("Internal text leaked into public content:", leaks);
  process.exit(1);
}
