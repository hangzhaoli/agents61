import type { SourcePack } from './types';
import { warrenBuffettPack } from './warren-buffett';
import { howardMarksPack } from './howard-marks';
import { charlieMungerPack } from './charlie-munger';
import { benjaminGrahamPack } from './benjamin-graham';
import { peterLynchPack } from './peter-lynch';
import { sethKlarmanPack } from './seth-klarman';
import { rayDalioPack } from './ray-dalio';
import { duanYongpingPack } from './duan-yongping';
import { cathieWoodPack } from './cathie-wood';
import { philippeLaffontPack } from './philippe-laffont';
import { johnTempletonPack } from './john-templeton';
import { joelGreenblattPack } from './joel-greenblatt';
import { davidEinhornPack } from './david-einhorn';
import { michaelBurryPack } from './michael-burry';
import { williamOneilPack } from './william-oneil';
import { edThorpPack } from './ed-thorp';
import { philipFisherPack } from './philip-fisher';
import { georgeSorosPack } from './george-soros';
import { stanleyDruckenmillerPack } from './stanley-druckenmiller';
import { billAckmanPack } from './bill-ackman';
import { mohnishPabraiPack } from './mohnish-pabrai';
import { jesseLivermorePack } from './jesse-livermore';
import { jimSimonsPack } from './jim-simons';
import { liLuPack } from './li-lu';

const PACKS: SourcePack[] = [
  warrenBuffettPack,
  howardMarksPack,
  charlieMungerPack,
  benjaminGrahamPack,
  peterLynchPack,
  sethKlarmanPack,
  rayDalioPack,
  duanYongpingPack,
  cathieWoodPack,
  philippeLaffontPack,
  johnTempletonPack,
  joelGreenblattPack,
  davidEinhornPack,
  michaelBurryPack,
  williamOneilPack,
  edThorpPack,
  // Phase 5 next-tier
  philipFisherPack,
  georgeSorosPack,
  stanleyDruckenmillerPack,
  billAckmanPack,
  mohnishPabraiPack,
  jesseLivermorePack,
  jimSimonsPack,
  liLuPack,
];

const BY_SLUG = new Map(PACKS.map((p) => [p.slug, p]));

export function getSourcePack(slug: string): SourcePack | undefined {
  return BY_SLUG.get(slug);
}

export function listSourcePackSlugs(): string[] {
  return PACKS.map((p) => p.slug);
}

export function listDeepSourcePackSlugs(): string[] {
  return PACKS.filter((p) => p.status === 'deep').map((p) => p.slug);
}

export {
  warrenBuffettPack,
  howardMarksPack,
  charlieMungerPack,
  benjaminGrahamPack,
  peterLynchPack,
  sethKlarmanPack,
  rayDalioPack,
  duanYongpingPack,
  cathieWoodPack,
  philippeLaffontPack,
  johnTempletonPack,
  joelGreenblattPack,
  davidEinhornPack,
  michaelBurryPack,
  williamOneilPack,
  edThorpPack,
  philipFisherPack,
  georgeSorosPack,
  stanleyDruckenmillerPack,
  billAckmanPack,
  mohnishPabraiPack,
  jesseLivermorePack,
  jimSimonsPack,
  liLuPack,
};

export type * from './types';
