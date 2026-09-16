import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { BLOG_POSTS, getPost } from '@/lib/blog';
import JsonLd from '@/components/seo/JsonLd';
import SeoRegisterCta from '@/components/seo/SeoRegisterCta';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `https://agents61.com/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
}

export default async function BlogPostPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = (post.relatedSlugs ?? [])
    .map((s) => getPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <Navbar />
      <article className="section-container py-16 max-w-3xl">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.date,
            description: post.excerpt,
            keywords: post.tags.join(', '),
            url: `https://agents61.com/blog/${post.slug}`,
            publisher: { '@type': 'Organization', name: 'Agents61', url: 'https://agents61.com' },
          }}
        />
        {post.faqs && post.faqs.length > 0 ? (
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: post.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            }}
          />
        ) : null}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0052d9] mb-8"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          All notes
        </Link>
        <p className="text-xs text-slate-400 mb-3">
          {post.date}
          {post.readingMinutes ? ` · ${post.readingMinutes} min` : ''}
          {post.category ? (
            <>
              {' · '}
              <Link href={`/blog/category/${post.category}`} className="hover:text-[#0052d9]">
                {post.category}
              </Link>
            </>
          ) : null}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">{post.title}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((t) => (
            <span key={t} className="badge badge-neutral text-[11px]">
              {t}
            </span>
          ))}
        </div>
        {post.keyTakeaway ? (
          <div className="card-flat p-5 mb-8 text-sm text-slate-700 leading-relaxed">
            <strong>Takeaway: </strong>
            {post.keyTakeaway}
          </div>
        ) : null}
        <div className="prose-legal">
          {post.body.map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
          {post.sections?.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
        {post.faqs && post.faqs.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">FAQ</h2>
            <dl className="space-y-5">
              {post.faqs.map((f) => (
                <div key={f.question}>
                  <dt className="font-semibold text-slate-900">{f.question}</dt>
                  <dd className="text-sm text-slate-600 mt-1 leading-relaxed">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        {related.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related notes</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="text-sm text-[#0052d9] font-medium">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <SeoRegisterCta
          title="Put the note into practice on your desk"
          body="Register to staff isolated masters on a ticker, or open Prediction Markets for probability-gap research. Same compliance line as this post — simulation, not advice."
          label="Create account"
        />
        <p className="mt-10 text-xs text-slate-400">
          Agents61 is a research simulation. Not investment advice.
        </p>
      </article>
      <Footer />
    </>
  );
}
