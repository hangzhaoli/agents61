import type { Fundamentals } from '@/lib/data/fundamentals';
import type { ChecklistScore, ChecklistScoreItem, SourcePack } from '@/lib/personas/source-pack/types';

export type ChecklistFacts = {
  /** Filing / desk fundamentals when available. */
  fundamentals?: Fundamentals | null;
  /** Free-text facts already gathered (filings notes, news digests, etc.). */
  textFacts?: string;
};

function hasText(hay: string, needles: string[]): boolean {
  const h = hay.toLowerCase();
  return needles.some((n) => h.includes(n.toLowerCase()));
}

function netMargin(f: Fundamentals | null): number | null {
  if (f?.netMargin != null) return f.netMargin;
  if (f?.netIncome == null || f?.revenue == null || f.revenue === 0) return null;
  return f.netIncome / f.revenue;
}

/** Heuristic PEG from trailing P/E ÷ (revenue YoY % as growth proxy). Not a forward PEG. */
function pegProxy(f: Fundamentals | null): number | null {
  if (f?.pe == null || f.pe <= 0 || f?.revenueYoY == null || f.revenueYoY <= 0.01) return null;
  return f.pe / (f.revenueYoY * 100);
}

/** FCF-ish: OCF positive and (when NI present) not wildly below NI — forensic screen only. */
function fcfLikePass(f: Fundamentals | null, text: string): 'pass' | 'fail' | 'unknown' {
  const ocf = f?.operatingCashFlow;
  const fcfHint = hasText(text, ['fcf', 'free cash', 'owner earnings', 'cash from operations']);
  if (ocf == null && !fcfHint) return 'unknown';
  if (ocf != null && ocf < 0) return 'fail';
  if (ocf != null && f?.netIncome != null && f.netIncome > 0 && ocf < f.netIncome * 0.3) return 'fail';
  if (ocf != null && ocf > 0) return 'pass';
  return fcfHint ? 'unknown' : 'unknown';
}

/**
 * Rule-based checklist scorer — no LLM. Uses numeric FACTS when present
 * (growth, margins, debt, PEG proxy, ROE/ROIC-like, FCF-ish text), otherwise
 * keyword hints in textFacts; defaults to unknown.
 */
export function scoreChecklist(pack: SourcePack, facts: ChecklistFacts): ChecklistScore {
  const f = facts.fundamentals ?? null;
  const text = facts.textFacts ?? '';
  const items: ChecklistScoreItem[] = pack.screeningChecklist.map((item) =>
    scoreItem(item.id, item.label, item.howToJudge, f, text)
  );
  return {
    slug: pack.slug,
    items,
    passCount: items.filter((i) => i.verdict === 'pass').length,
    failCount: items.filter((i) => i.verdict === 'fail').length,
    unknownCount: items.filter((i) => i.verdict === 'unknown').length,
  };
}

function scoreItem(
  id: string,
  label: string,
  howToJudge: string,
  f: Fundamentals | null,
  text: string
): ChecklistScoreItem {
  const base = { id, label };

  switch (id) {
    case 'leverage':
    case 'balance_sheet_ok':
    case 'balance_sheet_first': {
      if (f?.debtToEquity == null) {
        return { ...base, verdict: 'unknown', notes: 'LT debt/equity not on file.' };
      }
      if (f.debtToEquity > 2.5) {
        return {
          ...base,
          verdict: 'fail',
          notes: `LT debt/equity ${f.debtToEquity.toFixed(2)} — elevated vs owner-test comfort.`,
        };
      }
      if (f.debtToEquity > 1.5) {
        return {
          ...base,
          verdict: 'unknown',
          notes: `LT debt/equity ${f.debtToEquity.toFixed(2)} — needs business-model context.`,
        };
      }
      return {
        ...base,
        verdict: 'pass',
        notes: `LT debt/equity ${f.debtToEquity.toFixed(2)} — not screaming distress on this print.`,
      };
    }

    case 'owner_earnings':
    case 'moat':
    case 'margin_durability':
    case 'good_business':
    case 'earnings_story':
    case 'earnings_stability': {
      const nm = netMargin(f);
      const roe = f?.roe;
      const yoy = f?.revenueYoY;
      const cagr = f?.revenueCagrApprox;
      const epsY = f?.epsYoY;
      const fcf = fcfLikePass(f, text);
      const fcfHint = hasText(text, ['fcf', 'free cash', 'owner earnings', 'operating cash', 'cash from operations']);
      const multiYear =
        cagr != null ||
        hasText(text, ['cagr', '3-year', '5-year', 'multi-year', 'three year', 'five year']);

      if (roe == null && yoy == null && nm == null && cagr == null && fcf === 'unknown' && !fcfHint) {
        return { ...base, verdict: 'unknown', notes: 'ROE / growth / margin / OCF not on file — cannot proxy quality.' };
      }
      if (fcf === 'fail') {
        return {
          ...base,
          verdict: 'fail',
          notes: `Operating cash flow print weak vs earnings — FCF-like forensic flag (not a buy score).`,
        };
      }
      if (roe != null && roe < 0.05) {
        return { ...base, verdict: 'fail', notes: `ROE ${(roe * 100).toFixed(1)}% — weak owner return proxy.` };
      }
      if (nm != null && nm < -0.05) {
        return {
          ...base,
          verdict: 'fail',
          notes: `Net margin ${(nm * 100).toFixed(1)}% — loss-making on this print.`,
        };
      }
      if (cagr != null && cagr < -0.05) {
        return {
          ...base,
          verdict: 'fail',
          notes: `Approx multi-year rev CAGR ${(cagr * 100).toFixed(1)}% — durability screen fails.`,
        };
      }
      if (roe != null && roe >= 0.15 && (yoy == null || yoy > -0.05) && (cagr == null || cagr > -0.02)) {
        const bits = [
          `ROE ${(roe * 100).toFixed(1)}%`,
          yoy != null ? `revenue YoY ${(yoy * 100).toFixed(1)}%` : null,
          cagr != null ? `rev CAGR~ ${(cagr * 100).toFixed(1)}%` : null,
          epsY != null ? `EPS YoY ${(epsY * 100).toFixed(1)}%` : null,
          nm != null ? `NI/rev ${(nm * 100).toFixed(1)}%` : null,
          multiYear ? 'multi-year FACTS on file' : null,
          fcf === 'pass' ? 'OCF positive (FCF-like)' : fcfHint ? 'FCF/cash language in FACTS' : null,
        ].filter(Boolean);
        return {
          ...base,
          verdict: 'pass',
          notes: `${bits.join('; ')} — quality proxy only, not a moat proof.`,
        };
      }
      return {
        ...base,
        verdict: 'unknown',
        notes: 'Mixed or thin quality proxies — need moat / cash homework.',
      };
    }

    case 'peg_screen': {
      const peg = pegProxy(f);
      const pegText = hasText(text, ['peg']);
      if (peg == null && !pegText) {
        if (f?.pe != null && (f.revenueYoY == null || f.revenueYoY <= 0)) {
          return {
            ...base,
            verdict: 'fail',
            notes: `P/E ${f.pe.toFixed(1)} without positive revenue YoY — PEG homework fails on this print.`,
          };
        }
        return { ...base, verdict: 'unknown', notes: 'PEG not on file (need P/E + positive growth).' };
      }
      if (peg != null && peg > 2.5) {
        return {
          ...base,
          verdict: 'fail',
          notes: `Heuristic PEG ~${peg.toFixed(1)} (P/E ÷ rev YoY%) — rich vs growth proxy.`,
        };
      }
      if (peg != null && peg <= 1.5) {
        return {
          ...base,
          verdict: 'pass',
          notes: `Heuristic PEG ~${peg.toFixed(1)} — screen only, not forward PEG.`,
        };
      }
      return {
        ...base,
        verdict: 'unknown',
        notes: peg != null ? `Heuristic PEG ~${peg.toFixed(1)} — borderline; seat must judge.` : 'PEG mentioned in text — seat must judge.',
      };
    }

    case 'canslim_c':
    case 'canslim_a':
    case 'breakout_discipline':
    case 'platform_fit':
    case 's_curve':
    case 'tam_expansion':
    case 'cost_decline':
    case 'horizon_discipline':
    case 'stack_layer':
    case 'inflection_evidence':
    case 'unit_economics':
    case 'unit_economics_path':
    case 'growth_quality':
    case 'margin_trajectory': {
      const yoy = f?.revenueYoY;
      const epsY = f?.epsYoY;
      const cagr = f?.revenueCagrApprox;
      const nm = netMargin(f);
      const growthLang = hasText(text, [
        'tam',
        's-curve',
        'adoption',
        'inflection',
        'canslim',
        'breakout',
        'acceleration',
        'platform',
        'disruption',
      ]);
      if (yoy == null && epsY == null && cagr == null && nm == null && !growthLang) {
        return { ...base, verdict: 'unknown', notes: 'Growth / adoption FACTS thin — seat must judge.' };
      }
      // CANSLIM C/A: current + annual earnings — use EPS YoY / rev YoY when present
      if (id === 'canslim_c' || id === 'canslim_a') {
        if (epsY != null && epsY < -0.05) {
          return {
            ...base,
            verdict: 'fail',
            notes: `EPS YoY ${(epsY * 100).toFixed(1)}% — CANSLIM earnings letter weak on this print.`,
          };
        }
        if ((epsY != null && epsY > 0.15) || (yoy != null && yoy > 0.2)) {
          return {
            ...base,
            verdict: 'pass',
            notes: [
              epsY != null ? `EPS YoY ${(epsY * 100).toFixed(1)}%` : null,
              yoy != null ? `rev YoY ${(yoy * 100).toFixed(1)}%` : null,
              cagr != null ? `rev CAGR~ ${(cagr * 100).toFixed(1)}%` : null,
              '— single/multi-period growth proxy only, not a breakout proof',
            ]
              .filter(Boolean)
              .join('; '),
          };
        }
      }
      if (yoy != null && yoy < -0.1) {
        return {
          ...base,
          verdict: 'fail',
          notes: `Revenue YoY ${(yoy * 100).toFixed(1)}% — weak vs growth/CANSLIM-style screen.`,
        };
      }
      if (id === 'inflection_evidence' || id === 'growth_quality') {
        if (yoy != null && yoy > 0.15 && (nm == null || nm > -0.02)) {
          return {
            ...base,
            verdict: 'pass',
            notes: `Revenue YoY ${(yoy * 100).toFixed(1)}%${cagr != null ? `; CAGR~ ${(cagr * 100).toFixed(1)}%` : ''} — growth proxy only.`,
          };
        }
      }
      if (yoy != null && yoy > 0.2) {
        return {
          ...base,
          verdict: 'pass',
          notes: `Revenue YoY ${(yoy * 100).toFixed(1)}% — growth print only; not an S-curve proof.`,
        };
      }
      return {
        ...base,
        verdict: 'unknown',
        notes: [
          yoy != null ? `rev YoY ${(yoy * 100).toFixed(1)}%` : null,
          epsY != null ? `EPS YoY ${(epsY * 100).toFixed(1)}%` : null,
          cagr != null ? `rev CAGR~ ${(cagr * 100).toFixed(1)}%` : null,
          nm != null ? `NI/rev ${(nm * 100).toFixed(1)}%` : null,
          growthLang ? 'growth/TAM language in FACTS' : null,
          'seat must still judge platform / CANSLIM letters',
        ]
          .filter(Boolean)
          .join('; '),
      };
    }

    case 'canslim_n':
    case 'canslim_s':
    case 'canslim_l':
    case 'canslim_i':
    case 'canslim_m':
    case 'cut_loss_rule': {
      if (hasText(text, ['volume', 'breakout', 'relative strength', 'distribution', 'follow-through', 'sponsorship', 'new product', 'new high'])) {
        return { ...base, verdict: 'unknown', notes: 'Tape/sponsorship/newness language in FACTS — seat must score the letter.' };
      }
      return { ...base, verdict: 'unknown', notes: 'Chart / market FACTS not on this desk run — letter unknown.' };
    }

    // Magic Formula–ish
    case 'earnings_yield':
    case 'high_roic':
    case 'formula_legs':
    case 'earnings_quality': {
      const roe = f?.roe;
      const pe = f?.pe;
      const nm = netMargin(f);
      const ocf = f?.operatingCashFlow;
      const roicHint = hasText(text, ['roic', 'return on capital', 'return on invested', 'magic formula', 'earnings yield']);
      if (roe == null && pe == null && ocf == null && !roicHint) {
        return { ...base, verdict: 'unknown', notes: 'ROE / P/E / OCF not on file for Magic Formula proxies.' };
      }
      if (id === 'high_roic' || id === 'formula_legs') {
        if (roe != null && roe < 0.08) {
          return { ...base, verdict: 'fail', notes: `ROE ${(roe * 100).toFixed(1)}% — weak ROC proxy.` };
        }
        if (roe != null && roe >= 0.15 && (pe == null || pe < 25)) {
          return {
            ...base,
            verdict: 'pass',
            notes: `ROE ${(roe * 100).toFixed(1)}%${pe != null ? `; P/E ${pe.toFixed(1)} as crude EY inverse proxy` : ''} — formula heuristic only.`,
          };
        }
      }
      if (id === 'earnings_yield' && pe != null) {
        if (pe > 40) {
          return { ...base, verdict: 'fail', notes: `P/E ${pe.toFixed(1)} — low earnings-yield proxy on this print.` };
        }
        if (pe > 0 && pe <= 15) {
          return { ...base, verdict: 'pass', notes: `P/E ${pe.toFixed(1)} — crude high earnings-yield proxy (not EBIT/EV).` };
        }
      }
      if (id === 'earnings_quality') {
        if (nm != null && nm < -0.05) {
          return { ...base, verdict: 'fail', notes: `Net margin ${(nm * 100).toFixed(1)}% — quality proxy fails.` };
        }
        if (ocf != null && f?.netIncome != null && f.netIncome > 0 && ocf < 0) {
          return {
            ...base,
            verdict: 'fail',
            notes: 'OCF negative while NI positive — forensic earnings-quality flag.',
          };
        }
      }
      return {
        ...base,
        verdict: 'unknown',
        notes: 'Magic Formula legs need EBIT/EV + true ROIC — proxies only on this desk.',
      };
    }

    case 'special_sit': {
      if (hasText(text, ['spinoff', 'spin-off', 'merger', 'recap', 'stub', 'special situation'])) {
        return { ...base, verdict: 'unknown', notes: 'Special-sit language in FACTS — process checklist for the seat.' };
      }
      return { ...base, verdict: 'unknown', notes: 'No special-situation FACTS — formula mode unless seat finds one.' };
    }

    case 'forensic_flags':
    case 'cash_vs_accrual':
    case 'incentive_alignment':
    case 'filing_homework':
    case 'edge_exists':
    case 'kelly_inputs':
    case 'fractional_kelly':
    case 'ruin_check':
    case 'correlation_book':
    case 'no_hero_bet':
    case 'patience_mispricing':
    case 'maximum_pessimism':
    case 'global_bargain':
    case 'horizon_patience': {
      if (id === 'forensic_flags' || id === 'cash_vs_accrual') {
        const fcf = fcfLikePass(f, text);
        if (fcf === 'fail') {
          return {
            ...base,
            verdict: 'fail',
            notes: 'OCF vs NI mismatch — forensic cash-vs-accrual flag (heuristic only).',
          };
        }
        if (fcf === 'pass') {
          return {
            ...base,
            verdict: 'pass',
            notes: 'OCF not screaming vs NI on this print — still requires footnote homework.',
          };
        }
      }
      const hint = hasText(text, [
        'forensic',
        'restatement',
        'related party',
        'footnote',
        'kelly',
        'edge',
        'bankroll',
        'pessimism',
        'bargain',
      ]);
      return {
        ...base,
        verdict: 'unknown',
        notes: hint
          ? 'Relevant language in FACTS — still requires seat judgment (not auto-scored).'
          : 'Qualitative method check — not auto-scored from filings.',
      };
    }

    case 'price_vs_quality':
    case 'price_vs_assumption':
    case 'ten_year':
    case 'margin_of_safety':
    case 'downside_first': {
      if (f?.pe == null && f?.pb == null) {
        return { ...base, verdict: 'unknown', notes: 'P/E and P/B not on file.' };
      }
      if (f.pe != null && f.pe > 45 && (f.revenueYoY == null || f.revenueYoY < 0.1)) {
        return {
          ...base,
          verdict: 'fail',
          notes: `P/E ${f.pe.toFixed(1)} with soft growth print — price may embed heroics.`,
        };
      }
      if (f.pb != null && f.pb < 1.2 && f.roe != null && f.roe > 0.1) {
        return {
          ...base,
          verdict: 'pass',
          notes: `P/B ${f.pb.toFixed(2)} with ROE ${(f.roe * 100).toFixed(1)}% — statistical screen only.`,
        };
      }
      if (f.pb != null && f.pb < 0.8) {
        return {
          ...base,
          verdict: 'unknown',
          notes: `P/B ${f.pb.toFixed(2)} — classic cheapness screen; still need appraisal / trap check.`,
        };
      }
      return {
        ...base,
        verdict: 'unknown',
        notes: 'Multiples on file but need second-level price-vs-assumption work.',
      };
    }

    case 'short_debt_cycle':
    case 'long_debt_cycle':
    case 'funding_map':
    case 'regime':
    case 'second_level':
    case 'pendulum':
    case 'credit_thermometer':
    case 'asymmetric':
    case 'diversify_risk':
    case 'liquidity': {
      if (hasText(text, ['spread', 'credit', 'euphoria', 'fear', 'pendulum', 'consensus', 'yield curve', 'qe', 'qt', 'deleverag', 'liquidity'])) {
        return { ...base, verdict: 'unknown', notes: 'Cycle/credit/liquidity language present in FACTS text — seat must still judge.' };
      }
      if (f?.debtToEquity != null && f.debtToEquity > 2) {
        return {
          ...base,
          verdict: 'unknown',
          notes: `LT debt/equity ${f.debtToEquity.toFixed(2)} — funding sensitivity worth cycle overlay.`,
        };
      }
      return { ...base, verdict: 'unknown', notes: 'No cycle/credit FACTS — qualitative judgment only.' };
    }

    case 'invert':
    case 'kill_shots': {
      return {
        ...base,
        verdict: 'unknown',
        notes: 'Kill-shots are a writing discipline — not auto-scored from filings.',
      };
    }

    case 'scuttlebutt':
    case 'rd_effectiveness':
    case 'sales_org':
    case 'profit_margins':
    case 'management_depth':
    case 'reflexivity':
    case 'bias_map':
    case 'falsifier':
    case 'path_resistance':
    case 'conviction_one_shot':
    case 'protect':
    case 'simple_predictable':
    case 'fcf_quality':
    case 'catalyst':
    case 'heads_i_win':
    case 'clone_check':
    case 'few_bets':
    case 'tape_confirm':
    case 'pivot':
    case 'no_average_down':
    case 'sit_tight':
    case 'timing':
    case 'signal_test':
    case 'no_override':
    case 'capacity':
    case 'costs':
    case 'business_nature':
    case 'civilization_cycle':
    case 'owner_mindset':
    case 'classify':
    case 'know_what_you_own':
    case 'understand_first':
    case 'buy_company':
    case 'benfen':
    case 'hold_discipline':
    case 'local_edge':
    case 'cash_optionality':
    case 'forced_seller':
    case 'complexity_discount':
    case 'investment_vs_speculation':
    case 'mr_market':
    case 'circle':
    case 'capital_allocation':
    case 'incentives':
    case 'psychology':
    case 'multidisciplinary':
    case 'honesty':
    case 'risk_definition': {
      if (id === 'fcf_quality' || id === 'owner_mindset') {
        const fcf = fcfLikePass(f, text);
        if (fcf === 'fail') {
          return { ...base, verdict: 'fail', notes: 'OCF/FCF-like print weak — cash quality homework.' };
        }
        if (fcf === 'pass') {
          return { ...base, verdict: 'pass', notes: 'OCF positive on this print — still not free-cash proof.' };
        }
      }
      // ROIC-ish / FCF strings can still inform notes
      const roicHint = hasText(text, ['roic', 'return on invested', 'return on capital']);
      const fcfHint = hasText(text, ['fcf', 'free cash', 'owner earnings']);
      if (f?.error && f.revenue == null) {
        return { ...base, verdict: 'unknown', notes: `Filing gap: ${f.error}` };
      }
      const extras = [
        roicHint ? 'ROIC language in FACTS' : null,
        fcfHint ? 'FCF/cash language in FACTS' : null,
        f?.revenueYoY != null ? `rev YoY ${(f.revenueYoY * 100).toFixed(1)}%` : null,
        f?.revenueCagrApprox != null ? `rev CAGR~ ${(f.revenueCagrApprox * 100).toFixed(1)}%` : null,
        f?.epsYoY != null ? `EPS YoY ${(f.epsYoY * 100).toFixed(1)}%` : null,
      ].filter(Boolean);
      return {
        ...base,
        verdict: 'unknown',
        notes: extras.length
          ? `${extras.join('; ')} — still requires seat judgment.`
          : `${howToJudge.slice(0, 120)}${howToJudge.length > 120 ? '…' : ''} — requires seat judgment.`,
      };
    }

    default: {
      if (!f || (f.error && f.revenue == null)) {
        return { ...base, verdict: 'unknown', notes: 'Insufficient FACTS for heuristic.' };
      }
      // Generic growth / margin / debt hooks for new checklist ids
      if (id.includes('growth') && f.revenueYoY != null) {
        if (f.revenueYoY < -0.1) {
          return { ...base, verdict: 'fail', notes: `Revenue YoY ${(f.revenueYoY * 100).toFixed(1)}%.` };
        }
        if (f.revenueYoY > 0.12) {
          return { ...base, verdict: 'pass', notes: `Revenue YoY ${(f.revenueYoY * 100).toFixed(1)}% — single-period only.` };
        }
      }
      return { ...base, verdict: 'unknown', notes: 'No dedicated heuristic — seat judgment.' };
    }
  }
}

export function formatChecklistSummary(score: ChecklistScore): string {
  const lines = score.items.map(
    (i) => `- [${i.verdict.toUpperCase()}] ${i.label}: ${i.notes}`
  );
  return [
    `CHECKLIST SCORE (${score.slug}): ${score.passCount} pass / ${score.failCount} fail / ${score.unknownCount} unknown — heuristic only, not a buy score.`,
    ...lines,
  ].join('\n');
}
