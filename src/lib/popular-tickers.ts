/**
 * High-intent US names for sitemap + unique /stocks/[ticker] copy.
 * Each profile is written so crawlers and readers do not see a duplicate shell.
 * Research simulation — not a rating, not a quote feed, not advice.
 */

export type TickerKind = 'equity' | 'etf';

export interface TickerProfile {
  symbol: string;
  name: string;
  kind: TickerKind;
  sector: string;
  exchange: string;
  /** Unique 2–3 sentence lede: why this name sits on the committee board. */
  whyOnDesk: string;
  /** Unique angle the isolated masters actually argue about. */
  committeeAngle: string;
  /** Unique risk / filing caveats for this listing. */
  risksToWatch: string;
  relatedMasters: string[];
}

export const POPULAR_TICKERS: TickerProfile[] = [
  {
    symbol: 'SPCX',
    name: 'SpaceX',
    kind: 'equity',
    sector: 'Aerospace / launch / Starlink',
    exchange: 'Nasdaq',
    whyOnDesk:
      'SpaceX (SPCX) graduated from the private desk after its June 2026 IPO. The public equity case is launch cadence, Starlink cash conversion, Starship optionality, and AI/orbital compute capex — now with EDGAR instead of secondary marks.',
    committeeAngle:
      'Wood-style disruption vs. Buffett-style capital intensity. Value seats ask whether free cash flow can fund Starship and xAI-adjacent compute without permanent dilution; growth seats map Starlink ARPU and launch share.',
    risksToWatch:
      'Musk voting control, lock-up overhang, Starship FAA licensing, defense/commercial mix, and whether post-IPO filings still look like a growth story or a mega-cap utility. Confirm Class A (SPCX) — not a private secondary mark.',
    relatedMasters: ['cathie-wood', 'warren-buffett', 'ray-dalio', 'stanley-druckenmiller'],
  },
  {
    symbol: 'AAPL',
    name: 'Apple',
    kind: 'equity',
    sector: 'Consumer electronics / services',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Apple is the default quality-compounder test on a US desk: services mix, buybacks, and a hardware cycle that still sets the cash-flow floor. Isolated value seats ask whether the moat is still priced; growth seats ask whether the installed base can keep expanding ARPU.',
    committeeAngle:
      'Buffett-style quality vs. Fisher-style product pipeline. The debate is not “is Apple famous” — it is whether capital returns are masking a slower unit cycle, and whether services justify a consumer-tech multiple.',
    risksToWatch:
      'China mix, App Store regulation, and whether iPhone units or services gross profit is the real driver in the latest 10-K. Share-class is straightforward; EDGAR companyfacts are usually complete.',
    relatedMasters: ['warren-buffett', 'terry-smith', 'philip-fisher', 'charlie-munger'],
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    kind: 'equity',
    sector: 'Semiconductors',
    exchange: 'Nasdaq',
    whyOnDesk:
      'NVIDIA is the AI-infrastructure stress test: exponential demand language meets a supplier with real gross margin and a CUDA lock-in story. Trend seats map the S-curve; quant seats ask whether the print is a cycle peak dressed as a secular trend.',
    committeeAngle:
      'Wood/Laffont adoption curves vs. Dalio/Marks cycle placement. Red team will invert: what if capex pauses, custom ASICs bite, or the customer concentration is one cloud buyer’s budget?',
    risksToWatch:
      'Customer concentration, export controls, inventory at hyperscalers, and how much of “data center” revenue is one generation of GPU. Filings are dense; read the concentration footnote before cheering TAM.',
    relatedMasters: ['cathie-wood', 'philippe-laffont', 'ed-thorp', 'michael-burry'],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    kind: 'equity',
    sector: 'Software / cloud',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Microsoft is the enterprise-compounder that sits between quality value and platform growth: Azure, Office, and GitHub/OpenAI distribution. The desk uses it to test whether a mega-cap software name is still a “buy good, do nothing” business or a capex-heavy utility.',
    committeeAngle:
      'Akre/Smith compounding-machine screen vs. growth seats on Azure share and AI attach. Debate layer asks if the cloud margin is being spent to keep the narrative intact.',
    risksToWatch:
      'Capex for AI, regulatory overlap with search and productivity suites, and how much of Intelligent Cloud growth is price vs. volume. 10-K segment notes matter more than the keynote.',
    relatedMasters: ['chuck-akre', 'terry-smith', 'lee-ainslie', 'stanley-druckenmiller'],
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet',
    kind: 'equity',
    sector: 'Internet / advertising',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Alphabet (Class A) is the advertising-cycle plus AI-disruption case: Search cash still funds cloud and Other Bets. Growth seats track YouTube and Cloud; value seats track FCF after TPU and data-center spend.',
    committeeAngle:
      'Lynch “you use it every day” vs. Einhorn earnings-quality on traffic-acquisition cost and one-time items. The live argument is whether generative search is a tax on the core cash engine.',
    risksToWatch:
      'Share class (GOOGL vs GOOG), antitrust remedies, TAC, and Other Bets losses. Confirm which class you typed — the desk treats the ticker literally.',
    relatedMasters: ['peter-lynch', 'chase-coleman', 'david-einhorn', 'bill-ackman'],
  },
  {
    symbol: 'AMZN',
    name: 'Amazon',
    kind: 'equity',
    sector: 'E-commerce / cloud',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Amazon is a two-business puzzle: retail operating leverage and AWS high-ROIC infrastructure. Isolated briefs should split the segments instead of averaging them into one “tech” multiple.',
    committeeAngle:
      'Miller/Mandel growth-at-a-price vs. Greenblatt magic-formula screens that choke on low reported earnings. Red team: is AWS still funding retail, or is retail funding AI capex?',
    risksToWatch:
      'Retail vs AWS mix, labor and logistics cost, advertising attach, and how “AI” spend shows up in capex vs opex. Filings need segment-level reading.',
    relatedMasters: ['bill-miller', 'stephen-mandel', 'joel-greenblatt', 'ron-baron'],
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    kind: 'equity',
    sector: 'Social / advertising',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Meta is a cash-flow rebound story with a Reality Labs drag: ads efficiency vs. a multi-year metaverse option. The desk uses it to separate a working ads engine from a speculative second act.',
    committeeAngle:
      'Coleman penetration vs. Burry inversion on Reality Labs cumulative losses. Debate: is the multiple for Family of Apps, or are you paying for a call option that has not cleared a kill-test?',
    risksToWatch:
      'App-tracking headwinds, Reality Labs run-rate, regulatory ads restrictions, and whether Reels monetization is real or a mix shift. Confirm class A listing.',
    relatedMasters: ['chase-coleman', 'michael-burry', 'dan-loeb', 'cliff-asness'],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla',
    kind: 'equity',
    sector: 'Auto / energy',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Tesla is the decade-compounder that never sits quietly in one pipeline group: auto margin, energy storage, autonomy optionality, and a cult multiple. Trend and growth seats write first; value and debate write the kill-shot.',
    committeeAngle:
      'Baron/Wood S-curve vs. Graham margin-of-safety (usually fails) vs. Munger inversion. The committee is useful here because the room disagrees — isolation keeps that disagreement honest.',
    risksToWatch:
      'Delivery vs. ASP, regulatory credits, FSD legal language, China price wars, and energy-storage mix. Narrative density is high; filings still have units and warranty notes.',
    relatedMasters: ['ron-baron', 'cathie-wood', 'charlie-munger', 'william-oneil'],
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom',
    kind: 'equity',
    sector: 'Semiconductors / infrastructure software',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Broadcom is custom silicon plus a serial-acquirer software stack (VMware). The desk tests whether AI networking ASICs are a cycle or a durable design-win book, and whether leverage from deals still compounds.',
    committeeAngle:
      'Laffont commercialization vs. Singer/Icahn governance on deal integration. Quant: how much of EPS is buybacks and purchase accounting vs. organic networking growth.',
    risksToWatch:
      'Customer concentration (hyperscalers), VMware integration, debt from deals, and custom-ASIC program risk. Read the backlog and customer footnotes.',
    relatedMasters: ['philippe-laffont', 'paul-singer', 'ken-griffin', 'andreas-halvorsen'],
  },
  {
    symbol: 'BRK-B',
    name: 'Berkshire Hathaway',
    kind: 'equity',
    sector: 'Conglomerate / insurance',
    exchange: 'NYSE',
    whyOnDesk:
      'Berkshire Class B is the desk’s own mirror: insurance float, operating subsidiaries, and a cash pile that is itself a cycle call. Value seats treat it as a quality hold; cycle seats treat the cash as a thermometer.',
    committeeAngle:
      'Buffett/Munger method applied to the vehicle that published the method. The useful question is succession, capital allocation after the founder era, and whether the cash is a feature or a drag.',
    risksToWatch:
      'Use BRK-B not BRK-A. Insurance float and unrealized investment swings dominate GAAP. EDGAR is complete; the 10-K is a teaching document, not a simple P/E.',
    relatedMasters: ['warren-buffett', 'charlie-munger', 'li-lu', 'duan-yongping'],
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    kind: 'equity',
    sector: 'Banks',
    exchange: 'NYSE',
    whyOnDesk:
      'JPMorgan is the US money-center quality screen: NIM, credit costs, and a fortress balance-sheet claim. Cycle and credit seats (Paulson, Gross, Howard) belong on this name more than a software growth seat.',
    committeeAngle:
      'Schloss/Neff cheap-vs-book vs. Dalio short-term debt cycle. Debate: is “fortress” already in the multiple, and what does a recession do to wholesale vs. consumer credit?',
    risksToWatch:
      'CET1, reserve build, trading revenue volatility, and commercial real estate. Bank filings are not consumer-tech filings — start with credit quality, not TAM.',
    relatedMasters: ['walter-schloss', 'john-paulson', 'bill-gross', 'ray-dalio'],
  },
  {
    symbol: 'V',
    name: 'Visa',
    kind: 'equity',
    sector: 'Payments',
    exchange: 'NYSE',
    whyOnDesk:
      'Visa is a tollbooth on global card volume: high incremental margin, regulatory overhang, and almost no credit risk vs. issuers. Quality-compounder seats treat it as a three-legged stool test.',
    committeeAngle:
      'Akre/Smith buy-and-hold vs. growth seats on volume vs. yield. Red team: interchange regulation, fintech routing, and whether cross-border is a cycle not a trend.',
    risksToWatch:
      'Volume vs. yield, Europe/US interchange cases, and partner concentration. Asset-light does not mean regulation-light.',
    relatedMasters: ['chuck-akre', 'terry-smith', 'stephen-mandel', 'philip-fisher'],
  },
  {
    symbol: 'MA',
    name: 'Mastercard',
    kind: 'equity',
    sector: 'Payments',
    exchange: 'NYSE',
    whyOnDesk:
      'Mastercard is Visa’s twin with a different mix (more services, different geography). The desk keeps both so isolated briefs cannot copy-paste a “payments oligopoly” paragraph.',
    committeeAngle:
      'Same quality screen as Visa, different volume/yield and services mix. Useful for testing whether a master is reading the 10-K or reciting the sector.',
    risksToWatch:
      'Do not treat MA as a clone of V. Services mix, Europe mix, and partnership deals differ. Compare segments, not the logo.',
    relatedMasters: ['chuck-akre', 'lee-ainslie', 'julian-robertson', 'ed-thorp'],
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth',
    kind: 'equity',
    sector: 'Managed care',
    exchange: 'NYSE',
    whyOnDesk:
      'UnitedHealth is the US healthcare-system compounder: insurance plus Optum services. Quality seats like the cash; debate seats ask about medical-loss ratios, political risk, and vertical integration.',
    committeeAngle:
      'Buffett-style essential service vs. Icahn/Loeb governance and political kill-shots. Cycle seats watch utilization, not the S&P multiple.',
    risksToWatch:
      'MLR, CMS rates, Optum vs. UnitedHealthcare mix, and litigation/political headlines. Healthcare policy can invalidate a quality screen overnight.',
    relatedMasters: ['warren-buffett', 'seth-klarman', 'carl-icahn', 'howard-marks'],
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil',
    kind: 'equity',
    sector: 'Energy',
    exchange: 'NYSE',
    whyOnDesk:
      'Exxon is a cycle-and-capital-return name: upstream volumes, refining, and a dividend/buyback machine tied to the oil tape. Value/GARP seats belong here; ARK-style trend seats should say so if they pass.',
    committeeAngle:
      'Neff/Graham cash-flow cheapness vs. Templeton/Dalio commodity cycle. Debate: stranded-asset vs. energy-security premium.',
    risksToWatch:
      'Oil and gas price, capex discipline, and Guyana/Permian concentration. Do not apply a software growth screen to a supermajor.',
    relatedMasters: ['john-neff', 'john-templeton', 'bill-gross', 'hetty-green'],
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    kind: 'equity',
    sector: 'Healthcare',
    exchange: 'NYSE',
    whyOnDesk:
      'J&J is the split-era quality staple: MedTech vs. remaining pharma after the consumer spin. The desk uses it to test “forever hold” language against litigation and pipeline cliffs.',
    committeeAngle:
      'Smith/Buffett quality vs. Klarman legal-overhang special situation. Growth seats should be quiet unless a pipeline print is the actual thesis.',
    risksToWatch:
      'Talcum and other legal reserves, patent cliffs, and which segment still drives the 10-K after Kenvue. Confirm you are on JNJ, not the spun consumer name.',
    relatedMasters: ['terry-smith', 'seth-klarman', 'benjamin-graham', 'philip-fisher'],
  },
  {
    symbol: 'WMT',
    name: 'Walmart',
    kind: 'equity',
    sector: 'Retail',
    exchange: 'NYSE',
    whyOnDesk:
      'Walmart is US consumer-staple retail with a growing advertising and marketplace mix. Lynch seats see it in daily life; quality seats watch ROIC after e-commerce spend.',
    committeeAngle:
      'Lynch six-type classification (stalwart?) vs. Ackman platform-plus-catalyst. Debate: is Walmart+ and ads a real second engine or a margin footnote?',
    risksToWatch:
      'US vs. international mix, wage inflation, and how much “growth” is advertising vs. ticket. Supercenter economics still dominate the filing.',
    relatedMasters: ['peter-lynch', 'bill-ackman', 'duan-yongping', 'ken-fisher'],
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble',
    kind: 'equity',
    sector: 'Consumer staples',
    exchange: 'NYSE',
    whyOnDesk:
      'P&G is the textbook brand-moat staple: pricing power, category share, and a dividend culture. Value/quality seats write first; trend seats should explain why a household-goods name is on an innovation board.',
    committeeAngle:
      'Graham/Buffett consumer franchise vs. Fisher scuttlebutt on category share. The argument is price discipline vs. private-label and China mix — not TAM slides.',
    risksToWatch:
      'Organic sales vs. pricing, commodity input costs, and emerging-market FX. Staples can look cheap on P/E and still be expensive on growth.',
    relatedMasters: ['warren-buffett', 'benjamin-graham', 'terry-smith', 'hetty-green'],
  },
  {
    symbol: 'HD',
    name: 'Home Depot',
    kind: 'equity',
    sector: 'Retail / housing',
    exchange: 'NYSE',
    whyOnDesk:
      'Home Depot is a housing-cycle quality retailer: pro vs. DIY mix, ticket size, and rate sensitivity. Cycle seats belong beside quality seats on this ticker.',
    committeeAngle:
      'Akre compounding vs. Marks pendulum (housing). Timing seats may talk rates; they still do not issue a buy ticket.',
    risksToWatch:
      'Housing turnover, pro-customer mix, and ticket deflation if goods inflation reverses. Same-store sales need a cycle footnote.',
    relatedMasters: ['chuck-akre', 'howard-marks', 'alan-howard', 'william-oneil'],
  },
  {
    symbol: 'COST',
    name: 'Costco',
    kind: 'equity',
    sector: 'Retail',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Costco is membership-fee quality: thin merchandise margin, high inventory turns, and a cult of the Kirkland SKU. Quality seats love the model; value seats choke on the multiple.',
    committeeAngle:
      'Smith/Akre “do nothing” vs. Graham margin of safety (rarely present). Useful teaching name: a wonderful business can fail a cheapness screen.',
    risksToWatch:
      'Membership-fee growth vs. merchandise, new-club cadence, and e-commerce mix. The multiple is the whole argument — say so.',
    relatedMasters: ['terry-smith', 'chuck-akre', 'duan-yongping', 'john-bogle'],
  },
  {
    symbol: 'NFLX',
    name: 'Netflix',
    kind: 'equity',
    sector: 'Streaming',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Netflix is a completed S-curve test: paid sharing, ads tier, and content spend vs. FCF. Growth seats must classify the type (fast grower vs. stalwart); trend seats must say if penetration is done.',
    committeeAngle:
      'Lynch type-classification vs. O’Neil/Minervini timing (is Stage 2 over?). Red team: content cost, password-crack hangover, and live-sports bids.',
    risksToWatch:
      'Paid membership vs. ARPU, content amortization, and competition from bundles. FCF conversion is the filing fact that kills or saves the story.',
    relatedMasters: ['peter-lynch', 'william-oneil', 'chase-coleman', 'david-einhorn'],
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    kind: 'equity',
    sector: 'Semiconductors',
    exchange: 'Nasdaq',
    whyOnDesk:
      'AMD is the second-source AI and CPU story against NVIDIA and Intel: MI300/MI350 design wins vs. a foundry model with no in-house fab. It exists on the desk so NVDA briefs cannot stand alone.',
    committeeAngle:
      'Laffont inflection vs. Thorp/Simons statistical “is share gain persistent.” Debate: CUDA moat vs. price/performance at hyperscalers.',
    risksToWatch:
      'Gross margin vs. NVIDIA, TSMC concentration, and data-center vs. client mix. Do not paste an NVDA paragraph onto AMD.',
    relatedMasters: ['philippe-laffont', 'jim-simons', 'andreas-halvorsen', 'mark-minervini'],
  },
  {
    symbol: 'ORCL',
    name: 'Oracle',
    kind: 'equity',
    sector: 'Enterprise software / cloud',
    exchange: 'NYSE',
    whyOnDesk:
      'Oracle is database incumbency plus a late cloud conversion and a very public AI-capex partnership story. Quality seats test remaining-performance obligations; growth seats test whether cloud is real or a rebadge.',
    committeeAngle:
      'Ackman catalyst/platform vs. Einhorn accounting on remaining performance and buybacks. Cycle seats watch capex guidance like a utility.',
    risksToWatch:
      'Cloud vs. license mix, debt, and customer concentration in AI cloud deals. Guidance language can outrun billings.',
    relatedMasters: ['bill-ackman', 'david-einhorn', 'lee-ainslie', 'cliff-asness'],
  },
  {
    symbol: 'CRM',
    name: 'Salesforce',
    kind: 'equity',
    sector: 'Enterprise software',
    exchange: 'NYSE',
    whyOnDesk:
      'Salesforce is the subscription-operating-system test: cRPO, operating margin after the “profitable growth” turn, and AI attach (Agentforce) that may or may not show in billings.',
    committeeAngle:
      'Mandel/Ainslie fundamental growth vs. Greenblatt quality+cheapness. Red team: M&A hangover and whether AI features are a pricing umbrella or a discount.',
    risksToWatch:
      'cRPO vs. revenue, stock-based compensation, and large-deal concentration. SaaS metrics in the K, not the Dreamforce keynote.',
    relatedMasters: ['stephen-mandel', 'lee-ainslie', 'joel-greenblatt', 'william-oneil'],
  },
  {
    symbol: 'KO',
    name: 'Coca-Cola',
    kind: 'equity',
    sector: 'Beverages',
    exchange: 'NYSE',
    whyOnDesk:
      'Coca-Cola is the original Buffett staple: concentrate economics, bottler system, and emerging-market volume. It is on the desk as a teaching name for quality vs. growth, not as a momentum toy.',
    committeeAngle:
      'Graham/Buffett franchise vs. Mobius EM volume. Bogle seat asks whether you needed a committee to own a beverage staple.',
    risksToWatch:
      'Concentrate vs. finished-goods mix, FX, and volume vs. price. Simple business, still a filing.',
    relatedMasters: ['warren-buffett', 'benjamin-graham', 'mark-mobius', 'john-bogle'],
  },
  {
    symbol: 'PEP',
    name: 'PepsiCo',
    kind: 'equity',
    sector: 'Beverages / snacks',
    exchange: 'Nasdaq',
    whyOnDesk:
      'PepsiCo is KO’s diversified cousin: Frito-Lay cash plus beverages. Isolated briefs must not clone the Coca-Cola write-up — snacks mix and bottler structure differ.',
    committeeAngle:
      'Same staple school, different volume drivers. Useful pair trade thinking for Robertson/Ainslie without implying an order.',
    risksToWatch:
      'Snacks vs. beverage margin, health-policy overhang on salty snacks, and concentrate economics vs. KO. Compare segments.',
    relatedMasters: ['julian-robertson', 'terry-smith', 'ken-fisher', 'hetty-green'],
  },
  {
    symbol: 'DIS',
    name: 'Walt Disney',
    kind: 'equity',
    sector: 'Media / parks',
    exchange: 'NYSE',
    whyOnDesk:
      'Disney is a three-engine puzzle: parks, ESPN, and streaming losses turning toward profit. Special-situation and activist seats have more to say than a simple GARP screen.',
    committeeAngle:
      'Ackman/Icahn catalyst vs. Lynch “you take the kids to the park.” Debate: is streaming a completed investment cycle or a perpetual subsidy?',
    risksToWatch:
      'Parks attendance vs. per-cap, DTC operating income, and sports-rights inflation. Conglomerate filings hide the argument in segments.',
    relatedMasters: ['bill-ackman', 'carl-icahn', 'peter-lynch', 'dan-loeb'],
  },
  {
    symbol: 'BAC',
    name: 'Bank of America',
    kind: 'equity',
    sector: 'Banks',
    exchange: 'NYSE',
    whyOnDesk:
      'Bank of America is the rate-and-deposit-beta name vs. JPM’s quality premium. Schloss-style cheap-to-book screens live here; credit-cycle seats watch consumer delinquencies.',
    committeeAngle:
      'Schloss cigar-butt bank vs. Dalio/Howard rates. Not a clone of JPM — NII sensitivity and wealth mix differ.',
    risksToWatch:
      'Deposit beta, AOCI / securities book, and consumer credit. Pair it with JPM only after reading both Ks.',
    relatedMasters: ['walter-schloss', 'ray-dalio', 'alan-howard', 'john-neff'],
  },
  {
    symbol: 'CVX',
    name: 'Chevron',
    kind: 'equity',
    sector: 'Energy',
    exchange: 'NYSE',
    whyOnDesk:
      'Chevron is the GARP supermajor with a different project book than XOM (including large M&A). Neff-style low P/E plus modest growth is the native screen.',
    committeeAngle:
      'Neff GARP vs. Templeton commodity cycle. Integration risk on large deals is a debate-layer item, not a trend-layer item.',
    risksToWatch:
      'Deal close and synergy language, production guidance, and carbon-project optionality. Do not reuse the Exxon paragraph.',
    relatedMasters: ['john-neff', 'john-paulson', 'bill-gross', 'seth-klarman'],
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly',
    kind: 'equity',
    sector: 'Pharmaceuticals',
    exchange: 'NYSE',
    whyOnDesk:
      'Lilly is the GLP-1 capacity-and-pricing story: real volume, real capex, and a multiple that assumes the franchise stays scarce. Growth and trend seats write first; value seats usually pass with a reason.',
    committeeAngle:
      'Wood/Fisher product cycle vs. Klarman/Graham “no margin of safety.” Red team: compounding competition, reimbursement, and manufacturing constraints.',
    risksToWatch:
      'Incretin competition, payer mix, manufacturing, and how much of the print is Mounjaro/Zepbound. Pipeline concentration is the filing fact.',
    relatedMasters: ['cathie-wood', 'philip-fisher', 'seth-klarman', 'stanley-druckenmiller'],
  },
  {
    symbol: 'ABBV',
    name: 'AbbVie',
    kind: 'equity',
    sector: 'Pharmaceuticals',
    exchange: 'NYSE',
    whyOnDesk:
      'AbbVie is the post-Humira cliff test: immunology follow-ons, aesthetics, and a dividend that has to be earned again. Special-situation value belongs here more than mega-cap growth.',
    committeeAngle:
      'Klarman/Tepper distress-to-normal vs. Fisher scuttlebutt on the new immunology stack. Debate: is the cliff already in the price?',
    risksToWatch:
      'Humira erosion vs. Skyrizi/Rinvoq ramp, IRA negotiation, and aesthetics cyclicality. Patent language in the K, not the dividend yield.',
    relatedMasters: ['seth-klarman', 'david-tepper', 'joel-greenblatt', 'michael-burry'],
  },
  {
    symbol: 'ADBE',
    name: 'Adobe',
    kind: 'equity',
    sector: 'Application software',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Adobe is creative-cloud incumbency plus Firefly generative attach: net new ARR vs. a multiple that already assumed AI would lift seats. Software growth seats vs. timing seats on the failed Figma deal hangover.',
    committeeAngle:
      'Mandel/Ainslie SaaS quality vs. O’Neil stage analysis after a broken deal. Red team: generative competitors inside the same enterprise budget.',
    risksToWatch:
      'RPO, mix of Digital Media vs. Experience, and AI pricing. Deal-break language still matters for governance seats.',
    relatedMasters: ['stephen-mandel', 'william-oneil', 'lee-ainslie', 'dan-loeb'],
  },
  {
    symbol: 'INTC',
    name: 'Intel',
    kind: 'equity',
    sector: 'Semiconductors',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Intel is a foundry-turnaround and CHIPS-Act industrial-policy name, not an AI darling. Value, cycle, and activist seats have more work than a momentum growth seat.',
    committeeAngle:
      'Tepper/Klarman turnaround vs. Druckenmiller “would you concentrate.” Debate: foundry customers vs. internal process delays.',
    risksToWatch:
      'Gross margin, foundry losses, government grants, and x86 share. This is a cycle/turnaround filing, not an S-curve filing.',
    relatedMasters: ['david-tepper', 'seth-klarman', 'stanley-druckenmiller', 'carl-icahn'],
  },
  {
    symbol: 'BA',
    name: 'Boeing',
    kind: 'equity',
    sector: 'Aerospace',
    exchange: 'NYSE',
    whyOnDesk:
      'Boeing is a quality-franchise that failed operationally: deliveries, cash burn, and regulatory oversight. Special situations and red team belong; “wonderful company” language does not.',
    committeeAngle:
      'Klarman/Icahn distress and governance vs. Lynch “you see the planes.” Cycle seats watch dual-source duopoly; they do not ignore MAX/quality holds.',
    risksToWatch:
      'Delivery rates, advances from customers, debt, and FAA/DoD language. Cash flow, not TAM.',
    relatedMasters: ['seth-klarman', 'carl-icahn', 'david-tepper', 'paul-singer'],
  },
  {
    symbol: 'CAT',
    name: 'Caterpillar',
    kind: 'equity',
    sector: 'Industrials',
    exchange: 'NYSE',
    whyOnDesk:
      'Caterpillar is a late-cycle industrial: construction, mining, and a dealer-inventory tell. Cycle and GARP seats write natively; ARK-style innovation seats should pass or explain the stretch.',
    committeeAngle:
      'Dalio/Marks cycle thermometer vs. Neff GARP. Services attach is the quality argument; machine volumes are the cycle argument.',
    risksToWatch:
      'Dealer inventories, mining capex, and China construction. Industrial cycle ≠ software S-curve.',
    relatedMasters: ['ray-dalio', 'howard-marks', 'john-neff', 'bill-gross'],
  },
  {
    symbol: 'GE',
    name: 'GE Aerospace',
    kind: 'equity',
    sector: 'Aerospace',
    exchange: 'NYSE',
    whyOnDesk:
      'GE (post-split aerospace) is a high-ROIC installed-base after a multi-year conglomerate cleanup. Quality and special-situation seats meet here; do not analyze it as old GE Capital.',
    committeeAngle:
      'Ackman/Greenblatt simplification vs. Fisher scuttlebutt on engine shop visits. Confirm you are on the aerospace listing, not a legacy conglomerate memory.',
    risksToWatch:
      'Shop-visit rates, spares, and remaining spin/split footnotes. Ticker meaning changed — the desk treats the current 10-K, not the 1990s name.',
    relatedMasters: ['bill-ackman', 'joel-greenblatt', 'philip-fisher', 'chuck-akre'],
  },
  {
    symbol: 'UBER',
    name: 'Uber',
    kind: 'equity',
    sector: 'Mobility / delivery',
    exchange: 'NYSE',
    whyOnDesk:
      'Uber is a marketplace that finally prints FCF: mobility take rate, delivery, and advertising. Growth seats classify it; value seats ask if the margin is cyclical or structural.',
    committeeAngle:
      'Coleman/Lynch everyday use vs. Einhorn quality of bookings-to-revenue. Debate: insurance, classification, and whether ads are a third engine.',
    risksToWatch:
      'Take rate vs. incentives, legal classification, and segment contribution. Marketplace metrics in the K, not trip-count tweets.',
    relatedMasters: ['chase-coleman', 'peter-lynch', 'david-einhorn', 'bill-miller'],
  },
  {
    symbol: 'PLTR',
    name: 'Palantir',
    kind: 'equity',
    sector: 'Software',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Palantir is a government-plus-commercial AIP story with a multiple that assumes bootcamp conversion stays high. Trend/growth write; value and Bogle seats usually dissent in writing.',
    committeeAngle:
      'Wood disruptive software vs. Graham/Bogle “this is not a margin-of-safety name.” Isolation is the point — they will not meet in the middle.',
    risksToWatch:
      'US commercial vs. government mix, remaining performance, and customer concentration. Narrative density is extreme; filings still have numbers.',
    relatedMasters: ['cathie-wood', 'philippe-laffont', 'benjamin-graham', 'john-bogle'],
  },
  {
    symbol: 'COIN',
    name: 'Coinbase',
    kind: 'equity',
    sector: 'Crypto exchange',
    exchange: 'Nasdaq',
    whyOnDesk:
      'Coinbase is a listed crypto-cycle operating company: transaction revenue vs. subscription, and a balance sheet with crypto assets. Crypto board and equity desk overlap — still no buy button.',
    committeeAngle:
      'Wood/Mobius adoption vs. Thorp/Asness “this is beta to bitcoin, not a moat.” Cycle seats treat volume as a thermometer.',
    risksToWatch:
      'Transaction vs. subscription mix, asset custody, regulatory status, and crypto on the balance sheet. EDGAR will not look like a bank 10-K.',
    relatedMasters: ['cathie-wood', 'mark-mobius', 'ed-thorp', 'cliff-asness'],
  },
  {
    symbol: 'MSTR',
    name: 'Strategy (MicroStrategy)',
    kind: 'equity',
    sector: 'Software / bitcoin treasury',
    exchange: 'Nasdaq',
    whyOnDesk:
      'MSTR is a software stub plus a leveraged bitcoin treasury. Isolated briefs must separate operating software from the BTC NAV — mixing them is how this page becomes a slogan.',
    committeeAngle:
      'Wood bitcoin vehicle vs. Graham “this is not a business at the treasury layer.” Quant: factor exposure is BTC, not SaaS.',
    risksToWatch:
      'BTC holdings, convertible/debt, and software ARR that is not the stock. Treat the 10-K’s digital-asset notes as the whole argument.',
    relatedMasters: ['cathie-wood', 'ed-thorp', 'michael-burry', 'cliff-asness'],
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    kind: 'etf',
    sector: 'US large-cap growth ETF',
    exchange: 'Nasdaq',
    whyOnDesk:
      'QQQ is the Nasdaq-100 wrapper the desk uses when the question is “the growth complex,” not one issuer. It is an ETF trust — us-gaap companyfacts are usually empty; the fact card should say so instead of inventing P/E.',
    committeeAngle:
      'Bogle accountability (why not own the index?) vs. Wood/O’Neil concentration in mega-cap tech. Cycle seats treat NDX as a risk-appetite thermometer.',
    risksToWatch:
      'Top-heavy mega-cap weights, trust structure (not a 1940 Act open-end in the same way as every ETF), and no EDGAR companyfacts. Do not apply a single-stock moat screen to QQQ.',
    relatedMasters: ['john-bogle', 'william-oneil', 'ken-fisher', 'cathie-wood'],
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    kind: 'etf',
    sector: 'US large-cap blend ETF',
    exchange: 'NYSE Arca',
    whyOnDesk:
      'SPY is the Bogle-accountability benchmark on this site: if isolated masters cannot beat a plain S&P 500 wrapper in the research argument, the Friday seat should say so. Not a stock; not a moat.',
    committeeAngle:
      'Bogle plan-zero vs. every active seat. Useful for teaching that a committee report on SPY is a method test, not a stock pick.',
    risksToWatch:
      'Unit investment trust structure, expense ratio vs. IVV/VOO, and empty companyfacts. No single-name thesis.',
    relatedMasters: ['john-bogle', 'cliff-asness', 'ed-thorp', 'ken-fisher'],
  },
  {
    symbol: 'IWM',
    name: 'iShares Russell 2000 ETF',
    kind: 'etf',
    sector: 'US small-cap ETF',
    exchange: 'NYSE Arca',
    whyOnDesk:
      'IWM is the US small-cap cycle thermometer: rate sensitivity, unprofitable share, and relative strength vs. SPY. Cycle and quant factor seats belong; Buffett-style moat language usually does not.',
    committeeAngle:
      'Dalio/Howard liquidity vs. Asness size/value factors. Templeton pessimism tests often show up in small caps first.',
    risksToWatch:
      'Index composition (banks, biotech, unprofitables), and no issuer 10-K. Relative strength is a research input, not a trade ticket.',
    relatedMasters: ['ray-dalio', 'cliff-asness', 'john-templeton', 'alan-howard'],
  },
  {
    symbol: 'TLT',
    name: 'iShares 20+ Year Treasury ETF',
    kind: 'etf',
    sector: 'US long duration bonds',
    exchange: 'Nasdaq',
    whyOnDesk:
      'TLT is the duration signal Gross/Howard/Dalio actually read: long-end rates, not an equity moat. On this desk it is a cycle instrument, never a “stock analysis” clone.',
    committeeAngle:
      'Gross “bonds are the smarter market” vs. equity growth seats that should stay silent. Duration risk is the whole page.',
    risksToWatch:
      'Interest-rate duration, no earnings, no EDGAR companyfacts. Do not compute P/E.',
    relatedMasters: ['bill-gross', 'alan-howard', 'ray-dalio', 'paul-tudor-jones'],
  },
  {
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    kind: 'etf',
    sector: 'Gold trust',
    exchange: 'NYSE Arca',
    whyOnDesk:
      'GLD is a gold-bullion trust, not a miner and not a company. Cycle and macro seats use it as a real-rate / fear gauge; value seats should not invent a ROE.',
    committeeAngle:
      'Dalio/Templeton store-of-value vs. Bogle “this is not a productive asset.” Useful for teaching instrument type.',
    risksToWatch:
      'Trust structure, bullion custody, and empty us-gaap facts. Miners (not listed here) are a different filing.',
    relatedMasters: ['ray-dalio', 'john-templeton', 'hetty-green', 'john-bogle'],
  },
  {
    symbol: 'SMH',
    name: 'VanEck Semiconductor ETF',
    kind: 'etf',
    sector: 'Semiconductor ETF',
    exchange: 'Nasdaq',
    whyOnDesk:
      'SMH is the chip-cycle basket: NVDA-heavy, but still a wrapper. Use it when the question is the complex, then open NVDA/AVGO/AMD as single names. Empty companyfacts expected.',
    committeeAngle:
      'Wood/Laffont theme vs. Dalio “this is a capex cycle.” Concentration in a few issuers is the risk, not a moat.',
    risksToWatch:
      'Issuer weights, rebalance, and no single 10-K. Do not treat SMH as NVIDIA.',
    relatedMasters: ['cathie-wood', 'philippe-laffont', 'william-oneil', 'jim-simons'],
  },
];

const BY_SYMBOL = new Map(POPULAR_TICKERS.map((t) => [t.symbol.toUpperCase(), t]));

export function getTickerProfile(raw: string): TickerProfile {
  const symbol = raw.trim().toUpperCase();
  const hit = BY_SYMBOL.get(symbol);
  if (hit) return hit;
  return {
    symbol,
    name: symbol,
    kind: 'equity',
    sector: 'Unclassified US listing',
    exchange: 'US',
    whyOnDesk: `${symbol} is on the committee board as a typed US ticker. Isolated masters still write from SEC companyfacts when they exist; trusts and foreign issuers may show an empty fact card instead of invented ratios.`,
    committeeAngle: `Unlocked seats write alone on ${symbol}: value vs growth vs kill-shot. The clerk assembles after. Empty seats stay empty. This page is not a rating.`,
    risksToWatch: `Confirm share class, listing venue, and whether EDGAR has us-gaap facts for ${symbol} before treating multiples as real. Not advice.`,
    relatedMasters: ['warren-buffett', 'peter-lynch', 'charlie-munger', 'john-bogle'],
  };
}

export function isPopularTicker(raw: string): boolean {
  return BY_SYMBOL.has(raw.trim().toUpperCase());
}
