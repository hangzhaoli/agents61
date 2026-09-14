/**
 * Lightweight pack quality smoke harness (no vitest/jest).
 * Run: npx tsx src/lib/personas/source-pack/smoke.ts
 * Exit non-zero on any failure.
 */

import {
  getSourcePack,
  listDeepSourcePackSlugs,
} from './index';
import { buildPackContext, retrieveExcerpts } from '../modules';

const SAMPLE_QUERIES = [
  'moat and owner earnings',
  'margin of safety and leverage',
  'growth PEG and earnings',
  'cycle credit and consensus',
  'kill shots inversion forensic',
];

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function main(): void {
  const slugs = listDeepSourcePackSlugs();
  assert(slugs.length >= 16, `expected ≥16 deep packs, got ${slugs.length}`);

  const failures: string[] = [];

  for (const slug of slugs) {
    const pack = getSourcePack(slug);
    if (!pack) {
      failures.push(`${slug}: missing pack`);
      continue;
    }
    if (pack.status !== 'deep') {
      failures.push(`${slug}: status=${pack.status}, expected deep`);
      continue;
    }
    if (!pack.screeningChecklist?.length) failures.push(`${slug}: empty checklist`);
    if (!pack.cases?.length) failures.push(`${slug}: empty cases`);
    if (!pack.excerpts?.length) failures.push(`${slug}: empty excerpts`);
    if (!pack.metricsBound?.length) failures.push(`${slug}: empty metricsBound`);

    let retrievedAny = false;
    for (const q of SAMPLE_QUERIES) {
      const hits = retrieveExcerpts(slug, q, 3);
      if (hits.length > 0) retrievedAny = true;
    }
    if (!retrievedAny) {
      // Thin query fallback should still return top excerpts
      const fallback = retrieveExcerpts(slug, 'methodology', 2);
      if (!fallback.length) failures.push(`${slug}: retrieveExcerpts returned empty`);
    }

    const { block, evidence } = buildPackContext({
      slug,
      question: `Research a sample name with ${slug} method`,
      subject: 'SAMPLE',
    });
    if (!block || block.length < 40) failures.push(`${slug}: buildPackContext block too thin`);
    if (!evidence) failures.push(`${slug}: buildPackContext evidence null`);
    else {
      if (!evidence.checklist.length) failures.push(`${slug}: evidence checklist empty`);
      if (!evidence.excerpts.length) failures.push(`${slug}: evidence excerpts empty`);
      if (!evidence.metricsBound?.length) failures.push(`${slug}: evidence metricsBound empty`);
    }
  }

  if (failures.length) {
    console.error('persona-pack-smoke FAILED:');
    for (const f of failures) console.error(`  - ${f}`);
    console.error(`\n${failures.length} failure(s); ${slugs.length} deep packs checked.`);
    process.exit(1);
  }

  console.log(`persona-pack-smoke OK — ${slugs.length} deep packs`);
  console.log(slugs.join(', '));
}

main();
