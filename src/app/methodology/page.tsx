import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PersonaTrustSection from '@/components/landing/PersonaTrustSection';
import ResearchMethodSection from '@/components/landing/ResearchMethodSection';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'How master personas and isolated briefs are built',
  description: PAGE_DESCRIPTIONS.methodology,
  path: '/methodology',
});

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <div className="section-container pt-16 pb-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="badge badge-primary mb-4 mx-auto">Methodology</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            How the desk is built
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Personas from books and letters. Isolated briefs, then clerk assembly.
            Never a 61-way group chat.
          </p>
        </div>
      </div>
      <PersonaTrustSection />
      <ResearchMethodSection />
      <Footer />
    </>
  );
}
