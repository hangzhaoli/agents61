import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';

export type IndexCard = { href: string; title: string; blurb: string };

export default function SeoIndexPage({
  eyebrow,
  h1,
  intro,
  path,
  cards,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  path: string;
  cards: IndexCard[];
}) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: h1,
          description: intro,
          url: `https://agents61.com${path}`,
        }}
      />
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <p className="badge badge-primary mb-4">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{h1}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">{intro}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="card p-6 block group">
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0052d9]">{c.title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
