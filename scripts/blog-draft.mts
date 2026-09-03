/**
 * Monthly blog draft agent — one script, one workflow, the same shape in every sibling repo
 * (aisuru, avantconcepts, eddiebarretta, onspec, real-estate). The shared architecture is
 * documented in the umbrella repo (~/Websites/home/docs/blog-pipeline.md); this repo's blog doc
 * covers where posts live and how to review a draft.
 *
 *   GitHub Actions (1st of the month) → this script → Claude (web search + structured output)
 *   → SITE ADAPTER writes the post into the repo → the workflow commits to blog/draft-<slug>
 *   and opens a pull request. Nothing publishes without a human merge.
 *
 * Run locally:
 *   npx tsx scripts/blog-draft.mts --dry-run             research + draft, write nothing, print the draft
 *   npx tsx scripts/blog-draft.mts --lookback 60         widen the source-recency window (days)
 *   npx tsx scripts/blog-draft.mts --from-draft d.json   skip research; run the adapter on a saved draft
 *
 * Env: ANTHROPIC_API_KEY (required unless --from-draft), BLOG_MODEL (default claude-sonnet-5),
 *      BLOG_LOOKBACK_DAYS (default 45), BLOG_DRY_RUN=1, BLOG_OUT_DIR (draft.json / summary.json / pr-body.md).
 *
 * Only the block between the SITE ADAPTER markers differs between repos. Everything else is
 * byte-identical across the five repos — fix it in one place, then copy it to the others.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

// ───────────────────────────── Shared: the draft contract ─────────────────────────────

/** "code": text is the code, items[0] is the language. Sites opt in via SITE.blockTypes. */
type BlockType = "lead" | "h2" | "p" | "pull" | "list" | "code" | "closing";

interface DraftSource {
  id: string;
  title: string;
  publication: string;
  author: string | null;
  /** YYYY-MM-DD */
  date: string;
  url: string;
}

interface DraftBlock {
  type: BlockType;
  /** Copy for every type except "list". May contain [cite:id] markers. */
  text: string;
  /** Bullet items for "list" blocks; [] otherwise. */
  items: string[];
}

interface Draft {
  slug: string;
  title: string;
  dek: string;
  description: string;
  tags: string[];
  sources: DraftSource[];
  blocks: DraftBlock[];
}

const ALL_BLOCK_TYPES: BlockType[] = ["lead", "h2", "p", "pull", "list", "code", "closing"];
const MAX_SEARCHES = 8;

/**
 * Read a voice guide out of a markdown file, dropping the human-facing header so only the
 * guide itself reaches the prompt. Markdown rather than a TypeScript constant on purpose: the
 * script runs under tsx in five repos whose tsconfig `include` patterns differ, and a plain
 * file read behaves the same in all of them.
 */
function loadVoice(file: string): string {
  const src = fs.readFileSync(file, "utf8");
  const start = src.search(/^VOICE\b/m);
  return (start === -1 ? src : src.slice(start)).trim();
}

const DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["slug", "title", "dek", "description", "tags", "sources", "blocks"],
  properties: {
    slug: { type: "string", description: "kebab-case, 3-6 words" },
    title: { type: "string", description: "concrete and specific; no colons, no clickbait" },
    dek: { type: "string", description: "one or two sentences shown under the title" },
    description: { type: "string", description: "meta description, under 160 characters" },
    tags: { type: "array", items: { type: "string" } },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "publication", "author", "date", "url"],
        properties: {
          id: { type: "string", description: "short kebab-case handle used in [cite:id] markers" },
          title: { type: "string" },
          publication: { type: "string" },
          author: { type: ["string", "null"] },
          date: { type: "string", description: "publication date, YYYY-MM-DD" },
          url: { type: "string" },
        },
      },
    },
    blocks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "text", "items"],
        properties: {
          type: { type: "string", enum: ALL_BLOCK_TYPES },
          text: { type: "string", description: "the copy; for code blocks, the code itself; empty for list blocks" },
          items: { type: "array", items: { type: "string" }, description: "bullet items for list blocks; [language] for code blocks; [] otherwise" },
        },
      },
    },
  },
} as const;

// ═══════════════════════════ SITE ADAPTER: eddiebarretta ═══════════════════════════
// Everything between these markers is repo-specific: where posts live, the site brief, the
// research scope, the voice, and how a draft becomes a file in this repo.

const BLOG_FILE = "lib/blog.ts";
const VOICE_FILE = "lib/blog-voice.md";
const TAGS = ["Sound & genres", "Tech & craft", "Scene & culture"];

const SITE = {
  name: "Eddie Barretta — EDM Trends",
  url: "https://eddiebarretta.com",
  blogPath: "/blog",
  voiceFile: VOICE_FILE,
  brief:
    "eddiebarretta.com is the site of Eddie Barretta, a house and trance DJ in Jacksonville Beach, Florida (the Transcend mix series; regular sets at Jax Beach and Atlantic Beach bars and lounges). The blog, EDM Trends, publishes one post a month on where the EDM and DJ scene is heading — sounds, booth technology, nightlife culture — written from the booth.",
  research: `Find 3-5 sources on ONE emerging trend in electronic dance music or DJ culture: a genre movement, a booth-technology shift, a change in how nightlife, festivals or bookings work, or industry data on streaming, touring and venues. Prefer Mixmag, DJ Mag, Resident Advisor, Billboard (dance), Rolling Stone, DJ TechTools, Digital DJ Tips, the IMS Business Report, Pollstar, Eventbrite or Skiddle industry data, and manufacturer or platform announcements (AlphaTheta / Pioneer DJ, Serato, Native Instruments, Beatport). Skip listicles, affiliate gear roundups and press-release rewrites.`,
  writing: `${loadVoice(VOICE_FILE)}
- "tags": the FIRST tag must be exactly one of ${TAGS.map((t) => `"${t}"`).join(", ")}.
- Do not put citation markers in the text; the sources are shown as "Further reading" under the post.`,
  words: [600, 900] as const,
  blockTypes: ["lead", "h2", "p", "closing"] as BlockType[],
  checklist: [
    "First person, working-DJ voice; ties back to Jax Beach / Transcend only where natural",
    "Industry claims are general and defensible — no fabricated statistics or invented quotes",
    "Sources are real pages that back the trend (they render as \"Further reading\")",
  ],
  lint(draft: Draft): string[] {
    return TAGS.includes(draft.tags[0] ?? "") ? [] : [`Tag "${draft.tags[0] ?? ""}" is not one of ${TAGS.join(" / ")}; the adapter used "${TAGS[2]}"`];
  },
};

function existingPosts(): { title: string; date: string }[] {
  const src = fs.readFileSync(BLOG_FILE, "utf8");
  const out: { title: string; date: string }[] = [];
  for (const m of src.matchAll(/slug:\s*"[^"]+",\s*title:\s*"((?:[^"\\]|\\.)*)",\s*date:\s*"(\d{4}-\d{2}-\d{2})"/g)) {
    out.push({ title: JSON.parse(`"${m[1]}"`) as string, date: m[2] });
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

const strip = (t: string) => t.replace(/\s*\[cite:[a-z0-9-]+\]/g, "").trim();
const q = (s: string) => JSON.stringify(s);

/** Draft → the `Post` object literal that lib/blog.ts holds (intro / sections / outro / sources). */
function buildEntry(draft: Draft, today: string): string {
  const intro: string[] = [];
  const sections: { heading: string; paragraphs: string[] }[] = [];
  let outro = "";
  for (const b of draft.blocks) {
    if (b.type === "h2") sections.push({ heading: strip(b.text), paragraphs: [] });
    else if (b.type === "closing") outro = strip(b.text);
    else {
      const text = b.type === "list" ? b.items.map(strip).join(" ") : strip(b.text);
      if (!text) continue;
      if (sections.length === 0) intro.push(text);
      else sections[sections.length - 1].paragraphs.push(text);
    }
  }
  if (!outro) {
    const last = sections[sections.length - 1];
    outro = last?.paragraphs.pop() ?? intro.pop() ?? "";
  }
  const tag = TAGS.includes(draft.tags[0] ?? "") ? draft.tags[0] : TAGS[2];
  const list = (items: string[], indent: string) => items.map((s) => `${indent}${q(s)},`).join("\n");
  return `  {
    slug: ${q(draft.slug)},
    title: ${q(draft.title)},
    date: ${q(today)},
    tag: ${q(tag)},
    excerpt: ${q(draft.dek)},
    intro: [
${list(intro, "      ")}
    ],
    sections: [
${sections.map((s) => `      {
        heading: ${q(s.heading)},
        paragraphs: [
${list(s.paragraphs, "          ")}
        ],
      },`).join("\n")}
    ],
    outro: ${q(outro)},
    sources: [
${draft.sources.map((s) => `      {
        title: ${q(s.title)},
        publisher: ${q(s.publication)},
        url: ${q(s.url)},
      },`).join("\n")}
    ],
  },
`;
}

/** Prepend the post to the `posts` array in lib/blog.ts. Returns the files touched. */
function writePost(draft: Draft, today: string, _words: number): string[] {
  const src = fs.readFileSync(BLOG_FILE, "utf8");
  if (src.includes(`slug: ${q(draft.slug)}`)) throw new Error(`A post with slug "${draft.slug}" already exists in ${BLOG_FILE}`);
  const anchor = "export const posts: Post[] = [\n";
  if (!src.includes(anchor)) throw new Error(`${BLOG_FILE}: posts array anchor not found`);
  fs.writeFileSync(BLOG_FILE, src.replace(anchor, anchor + buildEntry(draft, today)));
  return [BLOG_FILE];
}

// ═══════════════════════════ END SITE ADAPTER ═══════════════════════════

// ───────────────────────────── Shared: pipeline ─────────────────────────────

function parseArgs(argv: string[]) {
  const out = { dryRun: false, lookback: 0, fromDraft: "" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--lookback") out.lookback = parseInt(argv[++i] ?? "", 10);
    else if (a === "--from-draft") out.fromDraft = argv[++i] ?? "";
    else throw new Error(`Unknown argument: ${a}`);
  }
  return out;
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const readingTime = (words: number) => `${Math.max(1, Math.round(words / 220))} min read`;
const countWords = (s: string) => s.split(/\s+/).filter(Boolean).length;
const allText = (d: Draft) => d.blocks.map((b) => (b.type === "list" ? b.items.join(" ") : b.type === "code" ? "" : b.text)).join(" ");
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").split("-").slice(0, 6).join("-");

function buildPrompt(opts: { existing: { title: string; date: string }[]; today: string; cutoff: string; lookbackDays: number }) {
  const allows = (t: BlockType) => SITE.blockTypes.includes(t);
  return `You are the research and drafting agent for the ${SITE.name} blog (${SITE.url}${SITE.blogPath}). ${SITE.brief}

TODAY'S DATE: ${opts.today}
PUBLICATION CUTOFF: only cite sources published on or after ${opts.cutoff} (the last ${opts.lookbackDays} days). This is a HARD requirement.

STEP 1 — RESEARCH (use the web_search tool; several queries, up to ${MAX_SEARCHES}):
${SITE.research}

Source discipline:
- Append "after:${opts.cutoff}" to search queries.
- For each candidate source, confirm its publication date from the page or the result. If you cannot confirm the date is on or after ${opts.cutoff}, DROP the source. Do not guess.
- When a page repeats data that someone else published first, follow it back and cite the original publisher, not the summary.
- If fewer than 3 qualifying sources exist, narrow to a related sub-topic rather than citing stale material.

EXISTING POST TITLES (do not repeat these topics):
${opts.existing.length ? opts.existing.map((p) => `- ${p.title} (${p.date})`).join("\n") : "(none yet)"}

STEP 2 — WRITE the post, synthesizing across ALL sources (never a source-by-source summary):
${SITE.writing}
- ${SITE.words[0]}-${SITE.words[1]} words across the blocks.
- Structure: one "lead" block (the thesis, no throat-clearing), then 2-4 "h2" sections of "p" blocks${allows("pull") ? ', at most one "pull" block (a single-sentence pull quote)' : ""}${allows("list") ? ', a "list" block where a short bulleted list beats a paragraph' : ""}${allows("code") ? ', a "code" block where a concrete example strengthens the point ("text" is the code, "items" is [language])' : ""}, ending with one "closing" block of one or two sentences.
- Allowed block types: ${SITE.blockTypes.join(", ")}. "text" carries the copy for every type except "list", which uses "items" (leave "text" empty there). Set "items" to [] for every other block${allows("code") ? " except code" : ""}.
- Citations: place a marker like [cite:source-id] immediately after the claim it supports. Every marker's id must exist in "sources". Cite generously: every number and every industry fact gets a marker.
- "sources": "id" is a short kebab-case handle; "date" is the source's publication date as YYYY-MM-DD; "author" is null when unknown; "url" is the page you actually read.
- "slug": kebab-case, 3-6 words. "description": under 160 characters. "dek": one or two sentences shown under the title. "tags": 2-4 short labels.

STEP 3 — Return the finished post in the required JSON shape and nothing else.`;
}

/**
 * Pull the draft object out of the model's text.
 *
 * A web-search turn returns several text blocks — the running commentary between searches and
 * then the final JSON — and the commentary can itself contain braces. Slicing from the first "{"
 * to the last "}" therefore grabs the wrong span. Instead, scan for balanced top-level objects
 * (string- and escape-aware) and take the last one that parses and has a draft's shape.
 */
function extractDraftJson(text: string): Draft {
  const candidates: string[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        candidates.push(text.slice(start, i + 1));
        start = -1;
      } else if (depth < 0) depth = 0;
    }
  }
  for (let i = candidates.length - 1; i >= 0; i--) {
    try {
      const parsed = JSON.parse(candidates[i]) as Draft;
      if (Array.isArray(parsed.blocks) && Array.isArray(parsed.sources)) return parsed;
    } catch {
      // Not this one — keep looking backwards.
    }
  }
  throw new Error(`No draft JSON in the model output (${candidates.length} balanced object(s) in ${text.length} chars; see raw.txt)`);
}

async function researchAndDraft(opts: { existing: { title: string; date: string }[]; today: string; cutoff: string; lookbackDays: number; model: string; outDir: string }): Promise<Draft> {
  const client = new Anthropic();
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: buildPrompt(opts) }];
  let message: Anthropic.Message | undefined;
  // Server-side web search runs its own sampling loop; a long research turn can come back as
  // pause_turn. Re-send the conversation as-is and the server resumes where it left off.
  for (let turn = 0; turn < 4; turn++) {
    const stream = client.messages.stream({
      model: opts.model,
      max_tokens: 32000,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_SEARCHES }],
      output_config: { format: { type: "json_schema", schema: DRAFT_SCHEMA } },
      messages,
    });
    message = await stream.finalMessage();
    if (message.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: message.content as unknown as Anthropic.ContentBlockParam[] });
  }
  if (!message) throw new Error("No response from the model");
  if (message.stop_reason === "refusal") throw new Error(`Model refused: ${message.stop_details?.explanation ?? "(no explanation)"}`);
  if (message.stop_reason === "max_tokens") throw new Error("Model output was truncated at max_tokens");
  const u = message.usage;
  console.error(`[blog-draft] ${opts.model}: ${u.input_tokens} in / ${u.output_tokens} out, ${u.server_tool_use?.web_search_requests ?? 0} web searches, stop=${message.stop_reason}`);

  const text = message.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("\n");
  // Always kept, so a parse failure is debuggable from the workflow's run artifact.
  fs.writeFileSync(path.join(opts.outDir, "raw.txt"), text);
  return extractDraftJson(text);
}

/** Normalize the draft in place and return what a reviewer should know. Throws only when the post is unusable. */
function validateDraft(draft: Draft, cutoff: string): { words: number; warnings: string[] } {
  const warnings: string[] = [];
  if (!draft.title?.trim() || !draft.dek?.trim() || !draft.description?.trim()) throw new Error("Draft is missing title, dek or description");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug ?? "")) {
    draft.slug = slugify(draft.title);
    warnings.push(`Slug was invalid; derived "${draft.slug}" from the title`);
  }
  if (draft.description.length > 160) warnings.push(`Meta description is ${draft.description.length} characters (target under 160)`);
  draft.tags = [...new Set((draft.tags ?? []).map((t) => t.trim()).filter(Boolean))].slice(0, 4);

  const kept: DraftSource[] = [];
  for (const s of draft.sources ?? []) {
    if (!/^https?:\/\//.test(s.url ?? "")) { warnings.push(`Dropped source "${s.id}": not an http(s) URL`); continue; }
    const day = /^\d{4}-\d{2}-\d{2}$/.test(s.date ?? "") ? s.date : "";
    if (!day) warnings.push(`Source "${s.id}" has no parseable date (${JSON.stringify(s.date)}); verify it by hand`);
    else if (day < cutoff) { warnings.push(`Dropped source "${s.id}" dated ${day}, before the ${cutoff} cutoff`); continue; }
    kept.push({ ...s, author: s.author || null });
  }
  draft.sources = kept;
  if (kept.length < 2) throw new Error(`Only ${kept.length} usable source(s) after the date cutoff — not publishing`);

  const ids = new Set(kept.map((s) => s.id));
  const scrub = (t: string) => t.replace(/\[cite:([a-z0-9-]+)\]/g, (m, id: string) => (ids.has(id) ? m : ""));
  const blocks: DraftBlock[] = [];
  for (const raw of draft.blocks ?? []) {
    let type: BlockType = ALL_BLOCK_TYPES.includes(raw.type) ? raw.type : "p";
    let text = type === "code" ? (raw.text ?? "") : scrub(raw.text ?? "");
    let items = (raw.items ?? []).map((s) => (type === "code" ? s : scrub(s))).filter(Boolean);
    if (type === "list" && !SITE.blockTypes.includes("list")) { type = "p"; text = items.join(" "); items = []; }
    if (type === "code" && !SITE.blockTypes.includes("code")) { warnings.push("Dropped a code block (not supported on this site)"); continue; }
    if (!SITE.blockTypes.includes(type)) type = "p";
    if (type === "code") items = items.slice(0, 1);
    else if (type !== "list") items = [];
    if (type === "list" ? items.length === 0 : !text.trim()) continue;
    blocks.push({ type, text: type === "code" ? text.replace(/\s+$/, "") : text.trim(), items });
  }
  draft.blocks = blocks;
  if (blocks.length < 4) throw new Error(`Draft has only ${blocks.length} content blocks`);
  if (blocks[0].type !== "lead") warnings.push("Draft does not open with a lead block");

  const words = countWords(allText(draft));
  if (words < 600) throw new Error(`Draft too short: ${words} words`);
  if (words < SITE.words[0] || words > SITE.words[1] * 1.3) warnings.push(`Draft is ${words} words (target ${SITE.words[0]}-${SITE.words[1]})`);
  // Only meaningful on sites that render inline citations; where the voice guide tells the agent
  // to omit markers entirely, an empty set means "sources are further reading", not a problem.
  const cited = new Set([...allText(draft).matchAll(/\[cite:([a-z0-9-]+)\]/g)].map((m) => m[1]));
  if (cited.size) for (const s of kept) if (!cited.has(s.id)) warnings.push(`Source "${s.id}" is listed but never cited in the text`);
  warnings.push(...SITE.lint(draft));
  return { words, warnings };
}

function prBody(opts: { draft: Draft; words: number; warnings: string[]; cutoff: string; lookbackDays: number; model: string }) {
  const { draft } = opts;
  const checks = [
    "Every source URL loads and says what the post claims",
    `Source dates are on or after ${opts.cutoff} (no stale sources dressed as new)`,
    `Voice matches \`${SITE.voiceFile}\``,
    ...SITE.checklist,
    "Title, meta description and slug are sharp",
    `Preview deploy renders ${SITE.url}${SITE.blogPath}/${draft.slug}`,
  ];
  return [
    "Auto-generated draft from the monthly blog agent (`scripts/blog-draft.mts` via `.github/workflows/blog-draft.yml`). Nothing publishes until this PR is merged; edit the post in place if it needs changes.",
    "",
    "**Review before merging**",
    ...checks.map((c) => `- [ ] ${c}`),
    ...(opts.warnings.length ? ["", "**Agent warnings**", ...opts.warnings.map((w) => `- Warning: ${w}`)] : []),
    "",
    `Slug \`${draft.slug}\` · ${opts.words} words · ${draft.sources.length} sources · ${opts.model} · lookback ${opts.lookbackDays}d`,
    "",
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = args.dryRun || process.env.BLOG_DRY_RUN === "1";
  const lookbackDays = Math.max(7, args.lookback || parseInt(process.env.BLOG_LOOKBACK_DAYS || "45", 10) || 45);
  const model = process.env.BLOG_MODEL || "claude-sonnet-5";
  const outDir = process.env.BLOG_OUT_DIR || path.join(os.tmpdir(), "blog-draft");
  fs.mkdirSync(outDir, { recursive: true });

  const now = new Date();
  const today = isoDay(now);
  const cutoff = isoDay(new Date(now.getTime() - lookbackDays * 86400000));
  const existing = existingPosts();

  const draft: Draft = args.fromDraft
    ? (JSON.parse(fs.readFileSync(args.fromDraft, "utf8")) as Draft)
    : await researchAndDraft({ existing, today, cutoff, lookbackDays, model, outDir });
  if (existing.some((p) => p.title.toLowerCase() === draft.title.toLowerCase())) throw new Error(`Draft duplicates an existing title: ${draft.title}`);
  const { words, warnings } = validateDraft(draft, cutoff);
  fs.writeFileSync(path.join(outDir, "draft.json"), JSON.stringify(draft, null, 2));

  const files = dryRun ? [] : writePost(draft, today, words);
  const summary = { slug: draft.slug, title: draft.title, words, sources: draft.sources.length, files, dryRun, warnings, model, lookbackDays, cutoff };
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(outDir, "pr-body.md"), prBody({ draft, words, warnings, cutoff, lookbackDays, model }));

  console.error(`[blog-draft] ${dryRun ? "DRY RUN — " : ""}"${draft.title}" (${draft.slug}) · ${words} words · ${draft.sources.length} sources`);
  for (const w of warnings) console.error(`[blog-draft] warning: ${w}`);
  if (files.length) console.error(`[blog-draft] wrote ${files.join(", ")}`);
  console.error(`[blog-draft] outputs in ${outDir}`);
  if (dryRun) console.log(JSON.stringify(draft, null, 2));
}

main().catch((err) => {
  console.error(`[blog-draft] failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
