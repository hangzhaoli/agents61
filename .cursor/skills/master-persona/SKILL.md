---
name: master-persona
description: Build and refresh Agents61 master-agent personas from public sources (books, letters, interviews, Wikipedia/Wikiquote). Use when writing system prompts, debate scripts, or adding a new master.
---

# 61 大师人格获取

每个大师 = 一个 **persona agent**。不要用网上的八卦传记堆人设，只用**可验证的投资方法论**。

## Source packs（深度层）

方法论细节放进 **RAG / context packs**，不要整本贴进 `systemPrompt`：

- Schema + packs: `src/lib/personas/source-pack/`（见同目录 `README.md`）
- Modules: `src/lib/personas/modules/`（checklist · rag · metrics · killshots · consensus · thirteenf）
- Pre-persona prep: `src/lib/desk/research-pipeline.ts` → fundamentals / sentiment / valuation，再写独立 brief
- Brief 注入点: `src/lib/llm/write-brief.ts`（`buildPackContextAsync` → user CONTEXT，不拉长 systemPrompt）
- 烟雾测试: `npx tsx src/lib/personas/source-pack/smoke.ts`

### Phase 状态

| Phase | 内容 |
|-------|------|
| 1–3 | 16 PRD 核心 deep packs + modules + research-prep + packEvidence UI + clerk prep |
| 4 | embeddings-lite RAG（可选 OPENAI/AGENTS61_EMBEDDING_*）· 多年度 FACTS→checklist · 13F lag UI · smoke harness |
| 5 | 8 个 next-tier deep packs · SeatContrastPanel（分歧面板，无买入分）· Evidence UX · 文档 |

Deep packs（24）: 核心 16（`warren-buffett` … `ed-thorp`）+ next-tier（`philip-fisher`, `george-soros`, `stanley-druckenmiller`, `bill-ackman`, `mohnish-pabrai`, `jesse-livermore`, `jim-simons`, `li-lu`）。

结构灵感来自 AlphaGBM/investment-masters（非 fork）。合规块与「无买入按钮 / 无综合买入分」不变。

**Future（未做）:** 常驻 vector DB、always-on EDGAR 13F 抓取。

## 优先数据源（按可信度）

| 优先级 | 来源 | 拿什么 | 例 |
|---|---|---|---|
| 1 | 本人著作 | 筛选标准、仓位纪律、卖出规则 | Graham《证券分析》、Fisher《怎样选择成长股》、Marks 备忘录 |
| 2 | 股东信 / 基金信 | 真实决策语言、反复出现的框架 | Buffett 年信、Ackman 信、Fundsmith 年报 |
| 3 | 公开访谈 / 听证 / 演讲 | 口头风格、反例、口头禅 | Dalio Principles、Lynch PBS、Wood ARK calls |
| 4 | 纪录片 / 传记中的**方法**部分 | 经典交易案例（标注年份） | 《大空头》里伯里读招股书 |
| 5 | Wikipedia extract + Wikiquote | 生平摘要、金句（已抓到 `src/data/personas/*.json`） | 冷启动种子 |
| 禁止 | 社交媒体二手解读、荐股群、未经核验的“语录图” | 幻觉人格 | |

## 人格卡固定字段

写进系统提示词，输出必须能填这张卡：

```json
{
  "slug": "warren-buffett",
  "voice": "plain, folksy, long-horizon, allergic to forecasts",
  "hard_rules": ["circle of competence", "moat", "owner earnings", "10-year hold test"],
  "never_says": ["you should buy", "guaranteed", "hot tip"],
  "looks_at": ["ROIC", "owner earnings", "management capital allocation"],
  "kills_thesis_if": ["no durable advantage", "needs a greater fool"],
  "output_style": "one verdict + one number that would change his mind"
}
```

## 怎么做成 Cursor Skill

1. 每个大师：`src/lib/personas/core/{slug}.ts`（系统提示词）+ 可选 `src/lib/personas/source-pack/{slug}.ts`（深度包）+ `src/data/personas/{slug}.json`（百科种子）。
2. 辩论层额外加 **对抗指令**：红队只质询、不准给买入结论；芒格包用 `killShotsFirst`。
3. 刷新节奏：财报季后只更新 pack 里「他会盯的指标」与 13F 样本（带 lag 声明），不改核心硬规则。
4. 跑管线时：浅层观点卡用短 prompt；有 deep pack 的座位喂 retrieved excerpts + checklist + metrics CONTEXT。
5. 多座位 UI：`SeatContrastPanel` 只展示分歧文案，**禁止**把 confidence 平均成建议。

## 冷启动顺序

先打磨 16 人（PRD）+ Phase 5 next-tier；其余用 Wikipedia extract + 方法论一句话顶上，避免 61 人同样浅。
