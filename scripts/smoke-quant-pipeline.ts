import { runQuantPipeline } from '../src/lib/quant-lab/pipeline';

async function main() {
  const r = await runQuantPipeline({
    masterSlug: 'william-oneil',
    poolId: 'etf-core',
    maxPositions: 3,
    topN: 6,
  });
  console.log(
    JSON.stringify(
      {
        screened: r.screened.slice(0, 5).map((s) => ({ t: s.ticker, score: s.score })),
        signals: r.signals.slice(0, 6),
        summary: r.summary,
        dataNote: r.dataNote,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
