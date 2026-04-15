# PersonaFeed

Your bio → your news feed. Paste who you are (or build a profile via the
onboarding wizard) and PersonaFeed returns a live, AI-curated briefing of
the 5 stories that actually matter to you today — each tagged with a short
explanation of *why* it matters to you specifically.

Built on Next.js 15, Tailwind v4, and the OpenAI Responses API with the
built-in `web_search` tool. Streams progress over SSE so the loading state
feels alive.

---

## What it does

1. **Onboarding** — a 6-step wizard collects life stage, industry,
   location/school, personality traits, intent, and past interests via
   tappable chips. The draft is assembled into a natural-language bio.
2. **Profile extraction** — `gpt-4o-mini` parses the bio into a structured
   profile: role, industry, focus sentence, and 3-5 concrete searchable
   topics.
3. **Live web search** — `gpt-4o-mini` via the Responses API runs targeted
   searches (`web_search_preview` tool, forced via `tool_choice`, anchored
   to today's date so results are genuinely recent) across the extracted
   topics.
4. **Synthesis** — the model returns a ranked JSON briefing: 5 articles
   with title, source, url, date, 2-sentence summary, relevance reasoning,
   and tags. URLs are backfilled from citation annotations if needed.
5. **Render** — profile summary card + ranked news grid; each card has a
   "why this matters to you" callout.

The whole flow streams: a `status` event per step, then `profile`, then
`articles`, then `done` — so the loading UI animates through the pipeline
in real time.

---

## Features

- **Two themes, runtime-switchable** — a dark "Neon" default and a warm
  "Reading Room" light theme (cream paper, ink navy, oxblood + brass,
  serif headings). Toggle in the header. Theme persists via
  `localStorage` and is applied pre-paint to avoid FOUC.
- **Onboarding persistence** — completed profile is saved to
  `localStorage`, so returning visitors skip straight to their feed. A
  reset gear in the header clears it.
- **Streaming pipeline** — Server-Sent Events from `/api/analyze`. The UI
  animates through Reading → Searching → Curating as the server progresses.
- **Forced tool use + date anchoring** — `tool_choice: { type: "web_search_preview" }`
  stops the model from hallucinating from training data. The current date is
  injected into instructions and prompt, with strict rules to return only
  articles from the last 30 days.

---

## Stack

- **Next.js 15.5** (App Router, Route Handlers)
- **Tailwind CSS v4** (`@theme` tokens + CSS custom properties for theming)
- **React 19**
- **OpenAI SDK** (Chat Completions for JSON-mode profile extraction +
  Responses API with `web_search_preview` for live news)
- **TypeScript**

---

## Getting started

```bash
# 1. Install
npm install

# 2. Environment
cp .env.local.example .env.local
# Edit .env.local and set OPENAI_API_KEY=sk-...

# 3. Run
npm run dev
```

Visit [localhost:3000](http://localhost:3000).

Grab an OpenAI key at
[platform.openai.com/api-keys](https://platform.openai.com/api-keys).

---

## Deployment (Vercel)

1. Import this repo on Vercel.
2. Under **Project → Settings → Environment Variables**, add
   `OPENAI_API_KEY` for all environments.
3. Deploy. The `/api/analyze` route runs as a Node serverless function
   (`maxDuration: 60`).

---

## Project structure

```
app/
  page.tsx                ← main UI: onboarding / loading / results / error
  layout.tsx              ← root layout + pre-paint theme script
  globals.css             ← Tailwind v4 + theme tokens for neon & reading
  api/analyze/route.ts    ← SSE: OpenAI profile extract → web_search synth

components/
  NewsCard.tsx            ← ranked article card with relevance callout
  ProfileSummary.tsx      ← extracted profile header
  LoadingSteps.tsx        ← animated streaming progress
  onboarding/
    OnboardingShell.tsx   ← progress bar, step router, nav, validation
    Step1Identity.tsx     ← life stage + gender chips
    Step2Context.tsx      ← location input + industry chip grid
    Step3Personality.tsx  ← trait chips + freeform line
    Step4Intent.tsx       ← intent card chips
    Step5Interests.tsx    ← grouped interest chips
    Step6Preview.tsx      ← assembled profile preview
    Chip.tsx              ← Chip + CardChip primitives
    types.ts              ← ProfileDraft, option catalogs, assembleBio
```

---

## Theming

Both themes are pure CSS. To add a third theme, add a new
`:root[data-theme="yourname"] { ... }` block in `app/globals.css`
overriding the tokens you want to change, then add a button to the
`ThemeToggle` in `app/page.tsx`. No component changes needed.

---

## Development notes

- The route deliberately uses `gpt-4o-mini` to keep per-request cost and
  latency low. Swap to `gpt-4o` or `gpt-4.1` in
  `app/api/analyze/route.ts` for deeper synthesis.
- The recency constraint ("last 30 days, never substitute older
  articles") is enforced in the system prompt. If the model returns fewer
  than 5 because recent material is thin, that's intentional.
- `localStorage` keys in use: `personafeed_profile` (onboarding draft),
  `personafeed_theme` (neon | reading).
