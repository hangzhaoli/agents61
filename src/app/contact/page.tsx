import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/contact/ContactForm';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Contact',
  description: PAGE_DESCRIPTIONS.contact,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-2xl mb-10">
          <div className="badge badge-primary mb-4">Contact</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Write the desk</h1>
          <p className="text-slate-600">
            Product questions, seating, affiliates, and press. For privacy requests use{' '}
            <a href="mailto:privacy@agents61.com" className="font-semibold text-[#0052d9]">
              privacy@agents61.com
            </a>
            . For legal,{' '}
            <a href="mailto:legal@agents61.com" className="font-semibold text-[#0052d9]">
              legal@agents61.com
            </a>
            .
          </p>
        </div>
        <div className="max-w-2xl">
          <ContactForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
