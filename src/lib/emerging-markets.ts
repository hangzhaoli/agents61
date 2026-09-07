/**
 * Emerging-market opportunity board.
 * US-listed ADRs / EM ETFs first — English-speaking US investors.
 * Research simulation, not a local-exchange order ticket.
 */

export type EmName = {
  ticker: string;
  name: string;
  region: string;
  theme: string;
  whyOnBoard: string;
  killShot: string;
};

export const EM_NAMES: EmName[] = [
  {
    ticker: 'TSM',
    name: 'Taiwan Semiconductor',
    region: 'Taiwan',
    theme: 'Foundry / AI capex',
    whyOnBoard: 'The foundry is the scarce asset in the AI stack; US listing is the window.',
    killShot: 'Geopolitical interruption or a customer that can actually dual-source at scale.',
  },
  {
    ticker: 'BABA',
    name: 'Alibaba',
    region: 'China',
    theme: 'Platform + cloud',
    whyOnBoard: 'ADR is the US window. Research the franchise, the regulator, and the listing structure separately.',
    killShot: 'The variable-interest structure or policy makes residual claims unownable.',
  },
  {
    ticker: 'PDD',
    name: 'PDD Holdings',
    region: 'China',
    theme: 'Value commerce',
    whyOnBoard: 'Growth classification first: unit economics versus a multiple that assumes no competition.',
    killShot: 'Take-rate collapse or a policy hit to the overseas arm.',
  },
  {
    ticker: 'MELI',
    name: 'MercadoLibre',
    region: 'LatAm',
    theme: 'Commerce + fintech',
    whyOnBoard: 'A compounder in under-banked markets. Still a growth test, not a cigar butt.',
    killShot: 'Credit losses in the fintech arm overwhelm marketplace cash.',
  },
  {
    ticker: 'NU',
    name: 'Nu Holdings',
    region: 'LatAm',
    theme: 'Digital bank',
    whyOnBoard: 'Scale in Brazil/Mexico. Research credit cycle and funding, not app downloads.',
    killShot: 'A real credit downcycle with thin equity.',
  },
  {
    ticker: 'IBN',
    name: 'ICICI Bank',
    region: 'India',
    theme: 'Private bank',
    whyOnBoard: 'India compounding via a bank you can underwrite from US filings.',
    killShot: 'Asset-quality shock or political credit direction.',
  },
  {
    ticker: 'INFY',
    name: 'Infosys',
    region: 'India',
    theme: 'IT services',
    whyOnBoard: 'Dollar revenue, Indian cost base. Classify growth versus a wage/FX squeeze.',
    killShot: 'Structural pricing pressure from AI substitution without volume offset.',
  },
  {
    ticker: 'VALE',
    name: 'Vale',
    region: 'Brazil',
    theme: 'Iron ore / copper',
    whyOnBoard: 'Cycle name. Templeton-style: price versus pessimism, not a story stock.',
    killShot: 'China steel demand breaks and the dividend is the only thesis.',
  },
  {
    ticker: 'PBR',
    name: 'Petrobras',
    region: 'Brazil',
    theme: 'Energy + policy',
    whyOnBoard: 'Cash engine with a government as co-owner. Policy is the research.',
    killShot: 'Capital allocation becomes a fiscal tool.',
  },
  {
    ticker: 'ITUB',
    name: 'Itaú Unibanco',
    region: 'Brazil',
    theme: 'Bank',
    whyOnBoard: 'Franchise bank. Research ROE, NPL, and the real rate, not the logo.',
    killShot: 'A credit cycle the balance sheet cannot absorb.',
  },
  {
    ticker: 'SE',
    name: 'Sea Limited',
    region: 'Southeast Asia',
    theme: 'Commerce + gaming + digital bank',
    whyOnBoard: 'Three engines. Classify which one still earns its keep.',
    killShot: 'Gaming fades and commerce never covers the cost of growth.',
  },
  {
    ticker: 'HDB',
    name: 'HDFC Bank',
    region: 'India',
    theme: 'Private bank',
    whyOnBoard: 'Quality India compounding. Merger integration is a diligence item, not a slogan.',
    killShot: 'Funding cost or asset quality after the merger stays broken.',
  },
];

export const EM_THEMES = [
  {
    id: 'india-compounders',
    title: 'India private banks and IT still pass a quality screen first',
    strength: 7,
    regions: ['India'],
  },
  {
    id: 'china-adr',
    title: 'China ADRs are a structure-and-policy test, not a multiple test alone',
    strength: 5,
    regions: ['China'],
  },
  {
    id: 'latam-platforms',
    title: 'LatAm platforms price the credit cycle inside the growth story',
    strength: 6,
    regions: ['LatAm'],
  },
  {
    id: 'em-commodities',
    title: 'EM commodities are Templeton work: pessimism versus cash, not GDP slogans',
    strength: 6,
    regions: ['Brazil', 'Chile'],
  },
];

const TICKERS = new Set(EM_NAMES.map((n) => n.ticker));

export function isEmergingTicker(ticker: string): boolean {
  return TICKERS.has(ticker.trim().toUpperCase());
}

export function getEmName(ticker: string): EmName | undefined {
  const t = ticker.trim().toUpperCase();
  return EM_NAMES.find((n) => n.ticker === t);
}
