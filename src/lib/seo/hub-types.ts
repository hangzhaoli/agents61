export type SeoFaq = { question: string; answer: string };
export type SeoLink = { label: string; href: string };
export type SeoSection = { heading: string; body: string };

export type SeoHub = {
  slug: string;
  path: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  bullets: string[];
  sections: SeoSection[];
  faqs: SeoFaq[];
  related: SeoLink[];
  ctaTitle?: string;
  ctaBody?: string;
  ctaHref?: string;
  ctaGuestHref?: string;
};

export type CompareRow = { feature: string; a61: string; competitor: string };

export type CompareHub = {
  slug: string;
  competitor: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  whenCompetitorWins: string;
  whenA61Wins: string;
  rows: CompareRow[];
  /** Optional narrative sections between the table and FAQs */
  sections?: SeoSection[];
  faqs: SeoFaq[];
  related: SeoLink[];
  /** End-of-page register CTA overrides */
  ctaTitle?: string;
  ctaBody?: string;
  ctaHref?: string;
  ctaGuestHref?: string;
};

export type LearnGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  minutes: number;
  intro?: string;
  steps: { heading: string; body: string }[];
  next: SeoLink[];
  ctaTitle?: string;
  ctaBody?: string;
  ctaHref?: string;
  ctaGuestHref?: string;
};
