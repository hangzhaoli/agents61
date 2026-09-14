# Persona source packs

Structured methodology context for Agents61 master seats.

## What this is

- **RAG / context packs** — screening checklists, exit rules, short excerpts, bound metrics, optional 13F facts.
- Injected into the **brief user message** as FACTS/CONTEXT blocks.
- **Not** pasted wholesale into `systemPrompt`.
- Research simulation only: no buy button, no composite buy score, no auto-trade.

## Inspiration

Pack *shape* (selection → risk → exit → optional 13F) is inspired by
[AlphaGBM/investment-masters](https://github.com/AlphaGBM/investment-masters).
This is **not a fork** — content is re-authored for Agents61 types and compliance.

Tool-chain idea (fundamentals / sentiment / valuation → then isolated persona brief)
echoes multi-agent research prep patterns (e.g. ai-hedge-fund spirit); seats still write alone.

## API

```ts
import { getSourcePack, listSourcePackSlugs, listDeepSourcePackSlugs } from '@/lib/personas/source-pack';
import { buildPackContext, buildPackContextAsync, buildPackContextBlocks } from '@/lib/personas/modules';
import { runResearchPrep } from '@/lib/desk/research-pipeline';

const pack = getSourcePack('warren-buffett');
const { block, evidence } = await buildPackContextAsync({ slug: 'warren-buffett', question, fundamentals });
const prep = runResearchPrep({ fundamentals, news });
```

`evidence` (checklist chips + short excerpt citations + optional 13F lag note + metricsBound) is attached to briefs as optional `packEvidence` for the desk UI.

## Pack fields

| Field | Role |
|-------|------|
| `screeningChecklist` | Heuristic-scored before the seat writes |
| `positionRisk` / `exitRules` | Method memory (cited in packs; seats use via excerpts/prompts) |
| `cases` | Classic / counterexample lessons |
| `excerpts` | Short fair-use quotes or paraphrases + tags (keyword RAG; optional embeddings-lite) |
| `metricsBound` | Which desk FACTS to surface |
| `layerHints` | e.g. `consensusPriceContrast`, `killShotsFirst` |
| `thirteenF` | Optional FACT sample + **mandatory lag disclaimer** |

## Status

### Deep (Phase 1–3) — 16 PRD core seats

| Slug | Layer hints / notes |
|------|---------------------|
| `warren-buffett` | 13F sample (illustrative / lagged) |
| `howard-marks` | `consensusPriceContrast` |
| `charlie-munger` | `killShotsFirst` |
| `benjamin-graham` | value + metrics |
| `peter-lynch` | growth + PEG |
| `seth-klarman` | value |
| `ray-dalio` | cycle + consensus |
| `duan-yongping` | value (bilingual excerpts) |
| `cathie-wood` | trend / TAM / S-curve |
| `philippe-laffont` | trend / stack inflection |
| `john-templeton` | cycle + `consensusPriceContrast` |
| `joel-greenblatt` | Magic Formula EY + ROC |
| `david-einhorn` | debate + `killShotsFirst` |
| `michael-burry` | debate/value + `killShotsFirst` |
| `william-oneil` | timing / CANSLIM |
| `ed-thorp` | quant / Kelly sizing (no trade orders) |

### Deep (Phase 5) — next-tier

| Slug | Notes |
|------|-------|
| `philip-fisher` | scuttlebutt growth / rare sales |
| `george-soros` | reflexivity + `consensusPriceContrast` |
| `stanley-druckenmiller` | liquidity / conviction + kill-shots |
| `bill-ackman` | quality + catalyst; 13F sample |
| `mohnish-pabrai` | Dhandho / cloning |
| `jesse-livermore` | tape / iron stops |
| `jim-simons` | statistical signal discipline |
| `li-lu` | circle + civilization cycle |

Run `npx tsx src/lib/personas/source-pack/smoke.ts` (or `node scripts/persona-pack-smoke.mjs`) to assert pack completeness.

## RAG (Phase 4a) — embeddings-lite

Default path is **keyword/tag** overlap (`retrieveExcerpts`) — no infra required.

Optional **embeddings-lite** (in-memory cosine over pack excerpts):

| Env | Role |
|-----|------|
| `OPENAI_API_KEY` or `AGENTS61_EMBEDDING_API_KEY` | Enables embeddings API |
| `AGENTS61_EMBEDDING_BASE_URL` or `OPENAI_BASE_URL` | OpenAI-compatible `/embeddings` base (default `https://api.openai.com/v1`) |
| `AGENTS61_EMBEDDING_MODEL` | Default `text-embedding-3-small` |

- Cache: process-local `Map` keyed by `slug::excerptId`.
- `retrieveExcerptsAsync` / `buildPackContextAsync` warm + cosine when keyed; else keyword.
- Sync `retrieveExcerpts` stays keyword (schedules background warm when keyed).
- Full vector DB / persistent index = **future**.

DeepSeek chat keys are separate (`DEEPSEEK_API_KEY`); they do not imply embeddings.

## 13F (Phase 4c)

- Pack-static sample holdings (Buffett, Ackman, …) always labeled **illustrative / lagged**.
- Desk UI (`PackEvidenceBlock`) always shows a lag chip when a pack carries `thirteenF`.
- Optional env fetch (timeout-bounded, never blocks builds):
  - `AGENTS61_FETCH_13F=1` — attempt live JSON fetch
  - `AGENTS61_13F_JSON_URL` — pre-normalized holdings JSON (`[{symbol, approxWeightNote?, note?}]` or `{holdings:[…]}`)
  - Requires pack `thirteenF.cik`; on any failure → pack-static sample
- We do **not** scrape EDGAR HTML in-process. Always-on EDGAR = **future**.

## Modules

See `src/lib/personas/modules/` — checklist, rag, metrics, killshots, consensus, thirteenf.

## Research prep (Phase 4b)

`src/lib/desk/research-pipeline.ts` pulls desk FACTS (EDGAR multi-year when tagged: rev CAGR~, EPS YoY, OCF/FCF-like + optional FMP ratios). Heuristic growth / margin / debt / Magic Formula / PEG / CANSLIM-adjacent layers only — never a buy score.

Clerk: `prep TICKER` or `prep MSFT for committee` runs prep then offers convene — seats stay isolated.

## UX (Phase 5b–c)

- `SeatContrastPanel` — “Where they disagree” (stance / kill-vs-bull heuristic). Copy: isolated views — not a vote and not advice. No averaged confidence.
- `PackEvidenceBlock` — fails first, muted `metricsBound` chips, link to `/masters/[slug]`, 13F lag note.
