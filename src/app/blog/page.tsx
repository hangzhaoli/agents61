import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Investment research notes',
  description: PAGE_DESCRIPTIONS.blog,
  path: '/blog',
});

export default function BlogIndexPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">Blog</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Research notes</h1>
          <p className="text-slate-600 mb-5">
            How the desk thinks about isolation, seating, and sources. Not a trade diary.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog/category/method" className="badge badge-neutral text-[11px]">
              Method
            </Link>
            <Link href="/blog/category/compare" className="badge badge-neutral text-[11px]">
              Compare
            </Link>
            <Link href="/blog/category/markets" className="badge badge-neutral text-[11px]">
              Markets
            </Link>
            <Link href="/blog/category/desk" className="badge badge-neutral text-[11px]">
              Desk
            </Link>
          </div>
        </div>
        <div className="space-y-5 max-w-3xl">
          {BLOG_POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-6 md:p-8 block group">
              <div className="text-xs text-slate-400 mb-2">{p.date}</div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#0052d9] transition-colors">
                {p.title}
              </h2>
              <p className="text-sm text-slate-600 mt-2">{p.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 4).map((t) => (
                  <span key={t} className="text-[11px] text-slate-400">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
