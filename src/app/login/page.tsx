import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthForm from '@/components/auth/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log in — Agents61',
  description: 'Log in to the Agents61 committee desk.',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <>
      <Navbar />
      <div className="section-container py-16 md:py-24">
        <AuthForm mode="login" next={next} oauthError={error} />
      </div>
      <Footer />
    </>
  );
}
