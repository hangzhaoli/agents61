import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGateLink from '@/components/auth/AuthGateLink';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="section-container py-24 text-center">
        <div className="badge badge-primary mb-4 mx-auto">404</div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">This seat is empty</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-8">
          That page is not on the desk. Try the committee, the masters, or a ticker report.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-secondary">Home</Link>
          <AuthGateLink href="/dashboard" className="btn-primary">Enter Desk</AuthGateLink>
          <Link href="/masters" className="btn-secondary">61 Masters</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
