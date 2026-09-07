import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthForm from '@/components/auth/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register — Agents61',
  description: 'Create an Agents61 desk account. Paid seating unlocks after checkout on the same email.',
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; next?: string }>;
}) {
  const { plan, next } = await searchParams;
  return (
    <>
      <Navbar />
      <div className="section-container py-16 md:py-24">
        <AuthForm mode="register" plan={plan} next={next} />
      </div>
      <Footer />
    </>
  );
}
