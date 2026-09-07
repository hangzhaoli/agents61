import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MastersDirectory from '@/components/masters/MastersDirectory';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: '61 investment masters as AI stock-analysis agents',
  description: PAGE_DESCRIPTIONS.masters,
  path: '/masters',
});

export default function MastersPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            The 61 Masters
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Each master is a dedicated AI agent persona. Analyst 16, Associate 29, Principal 48, Committee and Partners all 61.
            Every seat still writes alone before the clerk assembles.
          </p>
        </div>

        <MastersDirectory />
      </div>
      <Footer />
    </>
  );
}
