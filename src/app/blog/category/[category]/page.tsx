import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BLOG_CATEGORIES, postsByCategory, type BlogCategory } from '@/lib/blog';
import { pageMeta } from '@/lib/seo/meta';
import type { Metadata } from 'next';

const LABELS: Record<BlogCategory, { title: string; intro: string }> = {
  method: {
    title: 'Method notes',
    intro: 'Isolation, inversion, and how the desk writes. Not a trade diary.',
  },
  compare: {
    title: 'Compare notes',
    intro: 'ChatGPT, Seeking Alpha, terminals, and what a committee is not.',
  },
  markets: {
    title: 'Markets notes',
    intro: 'ETFs, crypto, pre-IPO — research simulation on the right file.',
  },
  desk: {
    title: 'Desk notes',
    intro: 'Seating, personas, and why empty chairs stay empty.',
  },
};

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!BLOG_CATEGORIES.includes(category as BlogCategory)) return {};
  const meta = LABELS[category as BlogCategory];
  return pageMeta({
    title: `${meta.title} — Agents61 blog`,
    description: meta.intro,
    path: `/blog/category/${category}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!BLOG_CATEGORIES.includes(category as BlogCategory)) notFound();
  const cat = category as BlogCategory;
  const posts = postsByCategory(cat);
  const meta = LABELS[cat];

  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <Link href="/blog" className="text-sm text-slate-500 hover:text-[#0052d9]">
            All notes
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4 mb-3">{meta.title}</h1>
          <p className="text-slate-600">{meta.intro}</p>
        </div>
        <div className="space-y-5 max-w-3xl">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-6 md:p-8 block group">
              <div className="text-xs text-slate-400 mb-2">{p.date}</div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#0052d9] transition-colors">
                {p.title}
              </h2>
              <p className="text-sm text-slate-600 mt-2">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
