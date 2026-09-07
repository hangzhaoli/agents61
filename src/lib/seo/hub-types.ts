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
  faqs: SeoFaq[];
  related: SeoLink[];
};

export type LearnGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  minutes: number;
  steps: { heading: string; body: string }[];
  next: SeoLink[];
};
