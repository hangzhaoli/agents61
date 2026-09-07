import type { Persona } from './types';
import { MASTERS, getMasterBySlug } from '@/lib/masters';
import { personaFromMaster } from './from-master';
import { benjaminGraham } from './core/benjamin-graham';
import { cathieWood } from './core/cathie-wood';
import { charlieMunger } from './core/charlie-munger';
import { davidEinhorn } from './core/david-einhorn';
import { duanYongping } from './core/duan-yongping';
import { edThorp } from './core/ed-thorp';
import { howardMarks } from './core/howard-marks';
import { joelGreenblatt } from './core/joel-greenblatt';
import { johnTempleton } from './core/john-templeton';
import { michaelBurry } from './core/michael-burry';
import { peterLynch } from './core/peter-lynch';
import { philippeLaffont } from './core/philippe-laffont';
import { rayDalio } from './core/ray-dalio';
import { sethKlarman } from './core/seth-klarman';
import { warrenBuffett } from './core/warren-buffett';
import { williamOneil } from './core/william-oneil';

/** PRD v1 committee: 16 masters, not 61. */
export const CORE_PERSONAS: Persona[] = [
  cathieWood,
  philippeLaffont,
  rayDalio,
  howardMarks,
  johnTempleton,
  benjaminGraham,
  warrenBuffett,
  peterLynch,
  duanYongping,
  sethKlarman,
  joelGreenblatt,
  davidEinhorn,
  michaelBurry,
  charlieMunger,
  williamOneil,
  edThorp,
];

export const CORE_PERSONA_SLUGS = CORE_PERSONAS.map((p) => p.slug);

const BY_SLUG = new Map(CORE_PERSONAS.map((p) => [p.slug, p]));
const SYNTH = new Map<string, Persona>();

export function getCorePersona(slug: string): Persona | undefined {
  return BY_SLUG.get(slug);
}

/** Full digital twin: 16 source-backed cores, remaining 45 methodology cards. Always 61. */
export function getPersona(slug: string): Persona | undefined {
  const core = BY_SLUG.get(slug);
  if (core) return core;
  const cached = SYNTH.get(slug);
  if (cached) return cached;
  const master = getMasterBySlug(slug);
  if (!master) return undefined;
  const persona = personaFromMaster(master);
  SYNTH.set(slug, persona);
  return persona;
}

export function allPersonas(): Persona[] {
  return MASTERS.map((m) => getPersona(m.slug)!);
}

export function corePersonasByLayer(layer: Persona['layer']): Persona[] {
  return CORE_PERSONAS.filter((p) => p.layer === layer);
}

export {
  benjaminGraham,
  cathieWood,
  charlieMunger,
  davidEinhorn,
  duanYongping,
  edThorp,
  howardMarks,
  joelGreenblatt,
  johnTempleton,
  michaelBurry,
  peterLynch,
  philippeLaffont,
  rayDalio,
  sethKlarman,
  warrenBuffett,
  williamOneil,
};
