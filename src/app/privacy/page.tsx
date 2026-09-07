import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LegalShell from '@/components/layout/LegalShell';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Agents61',
  description:
    'How Agents61 collects, uses, and shares personal data for the 61-master research desk. Preview, seating, and contact details included.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <LegalShell title="Privacy Policy" updated="September 5, 2026" active="/privacy">
        <p>
          This Privacy Policy explains how Agents61 (&quot;Agents61,&quot; &quot;we,&quot;
          &quot;us&quot;) handles personal information when you visit{' '}
          <a href="https://agents61.com">agents61.com</a>, use the committee desk, or contact
          us. It should be read with our{' '}
          <Link href="/terms">Terms of Use</Link>,{' '}
          <Link href="/disclaimer">Disclaimer</Link>, and{' '}
          <Link href="/ai-disclosure">AI Disclosure</Link>.
        </p>
        <p>
          The Service is a research simulation for intermediate US investors. It is not an
          adviser and not a brokerage. Isolated briefs never say &quot;you should buy.&quot;
        </p>

        <h2 id="who">1. Who we are</h2>
        <p>
          Agents61 operates the website and the 61-master committee product at agents61.com.
          For privacy requests, email{' '}
          <a href="mailto:privacy@agents61.com">privacy@agents61.com</a> or use the{' '}
          <Link href="/contact">contact form</Link> with topic &quot;Legal / privacy.&quot;
        </p>

        <h2 id="preview">2. Public preview</h2>
        <p>
          Parts of the Service remain in public preview. Login and register create an
          account. Paid seating is described on <Link href="/pricing">Pricing</Link> and
          completed on the checkout pages listed there. Card, Apple Pay, and Google Pay
          charges are processed by Waffo Pancake as Merchant of Record (see Payment and
          Sharing below). This Policy covers contact messages, tickers you type, ordinary
          web logs, account data, and billing metadata we receive from payment providers.
        </p>

        <h2 id="collect">3. Information we collect</h2>
        <h3>Account and profile</h3>
        <p>
          When accounts are enabled: email, password (stored hashed, never in plaintext),
          display name if you provide one, and the seating plan you hold (Analyst 16,
          Associate 29, Principal 48, Committee 61, Partners 61, or a limited preview desk).
        </p>
        <h3>Payment</h3>
        <p>
          Desk seating is paid on three rails, matching{' '}
          <Link href="/pricing">Pricing</Link>:
        </p>
        <ul>
          <li>
            <strong>Cards, Apple Pay, and Google Pay</strong> — processed by{' '}
            <strong>Waffo Pancake</strong>, our Merchant of Record, on their hosted checkout
            at <Link href="/checkout/waffo">/checkout/waffo</Link>. Waffo Pancake collects
            and processes cardholder payment data (PAN, expiry, CVC, wallet tokens). We
            receive your email, order or subscription status, and limited invoice metadata
            (for example last-four and card brand if they share it). We do not store full
            card numbers or CVCs on Agents61 servers.
          </li>
          <li>
            <strong>Crypto invoices</strong> — processed by <strong>NOWPayments</strong> at{' '}
            <Link href="/checkout/nowpayments">/checkout/nowpayments</Link>. We receive
            invoice identifiers and payment status. We do not custody your coins.
          </li>
          <li>
            <strong>Annual USDT (TRC-20) backup</strong> — you send USDT to a published
            address on <Link href="/checkout/usdt">/checkout/usdt</Link>. We verify a
            transaction hash. No card data is involved.
          </li>
        </ul>
        <h3>Research inputs</h3>
        <p>
          Tickers and names you submit to convene a report (for example AAPL). Reports
          pull public SEC EDGAR companyfacts (cached up to 7 days). Filing facts are
          public company data, not your personal data. We may keep the ticker, plan, and
          time of a run so we can enforce report caps and debug the pipeline.
        </p>
        <h3>Contact, affiliate, and support</h3>
        <p>
          Name, email, topic, and message if you write the desk or apply as an affiliate.
          Preview contact forms do not transmit email until we wire the mailbox; treat
          the on-screen address as the live channel.
        </p>
        <h3>Automatically collected</h3>
        <p>
          IP address, browser and device type, pages viewed, referring URL, timestamps,
          and coarse location derived from IP. We use this for security, uptime, and
          product improvement. We do not use it to profile you as an investor.
        </p>
        <h3>What we do not collect</h3>
        <ul>
          <li>Brokerage holdings, tax IDs, or a full financial picture — we do not ask</li>
          <li>Live quotes displayed as a terminal product</li>
          <li>Biometric data or government ID</li>
          <li>Data from children (see section 11)</li>
        </ul>

        <h2 id="use">4. How we use information</h2>
        <ul>
          <li>To run isolated briefs and clerk assembly on the tickers you submit</li>
          <li>To enforce seating (16 / 29 / 48 / 61) and monthly report caps</li>
          <li>To create and manage accounts and paid seating</li>
          <li>To answer support, press, legal, and affiliate requests</li>
          <li>To send product or newsletter email you opt into (unsubscribe on every message)</li>
          <li>To keep the Service secure, debug errors, and understand which pages are used</li>
          <li>To comply with law and respond to lawful requests</li>
        </ul>
        <p>
          We do not sell personal information. We do not use research inputs to give you
          personalized investment advice.
        </p>

        <h2 id="ai">5. AI processing</h2>
        <p>
          Unlocked master seats send the ticker, cached filing facts, and that persona&apos;s
          rules to commercially licensed language models. Masters do not see each other&apos;s
          drafts. A separate clerk pass assembles agreements and splits. Prompt content
          may be processed by those model providers under their data-processing terms. We
          do not use your prompts to fine-tune a public model. See the{' '}
          <Link href="/ai-disclosure">AI Disclosure</Link>.
        </p>

        <h2 id="share">6. Sharing</h2>
        <p>We share personal data only as needed to run the Service:</p>
        <ul>
          <li>
            <strong>Hosting and infrastructure</strong> — for example Vercel and cloud
            storage that host agents61.com
          </li>
          <li>
            <strong>Payments</strong> — Waffo Pancake (Merchant of Record for Visa,
            Mastercard, Apple Pay, and Google Pay) and NOWPayments (crypto invoices).
            Annual USDT backup is a self-send we verify by transaction hash; no card
            processor is used on that rail.
          </li>
          <li>
            <strong>Model providers</strong> — DeepSeek, to generate isolated briefs
            (ticker, question, and filing/crypto facts on the page — not your brokerage account)
          </li>
          <li>
            <strong>Email and support tools</strong> — if you write us or subscribe
          </li>
          <li>
            <strong>Analytics</strong> — aggregated or pseudonymous usage, if we enable a
            product analytics tool; we will not sell that data
          </li>
          <li>
            <strong>Legal</strong> — if required by law, to protect the Service, or in a
            merger or sale of assets (you would still be protected by this Policy or a
            successor policy)
          </li>
        </ul>
        <p>
          Public market data (EDGAR and similar) is not personal data and may be cached
          and displayed on reports.
        </p>

        <h2 id="cookies">7. Cookies and similar technology</h2>
        <p>
          We use essential cookies or local storage for session and security when accounts
          exist. We may use first-party analytics cookies to see which public pages are
          used. You can block non-essential cookies in your browser; the desk may then
          require a new login more often. We do not run third-party advertising cookies.
        </p>

        <h2 id="retention">8. Retention</h2>
        <ul>
          <li>Account data — while the account is open, then deleted or anonymized within 90 days of a deletion request unless law requires longer</li>
          <li>Billing records — as required for tax and accounting (typically up to 7 years)</li>
          <li>Report runs (ticker, plan, timestamp) — up to 24 months for caps, abuse, and debugging</li>
          <li>Contact messages — up to 24 months unless a legal hold applies</li>
          <li>EDGAR fact cache — up to 7 days, then refreshed</li>
          <li>Server logs — typically 30–90 days</li>
        </ul>

        <h2 id="security">9. Security</h2>
        <p>
          We use TLS in transit, access controls, and hashed passwords when accounts are
          stored. No method of transmission is 100% secure. Do not send card numbers or
          government IDs to our support inboxes.
        </p>

        <h2 id="intl">10. International transfers</h2>
        <p>
          The Service is built for English-speaking US investors and is hosted in the
          United States. If you access it from elsewhere, you transfer information to the
          US. Model providers may process prompts in the regions they operate.
        </p>

        <h2 id="rights">11. Your rights</h2>
        <p>
          Subject to law, you may request access, correction, deletion, or a copy of
          personal data we hold, and you may object to or restrict certain processing.
          Email <a href="mailto:privacy@agents61.com">privacy@agents61.com</a>. We may need
          to verify the request. You may also lodge a complaint with your local regulator.
        </p>
        <h3>California (CCPA / CPRA)</h3>
        <p>
          We do not sell or share personal information as those terms are used for
          cross-context behavioral advertising. California residents may request know,
          delete, and correct, and may use an authorized agent. We will not discriminate
          for exercising these rights.
        </p>
        <h3>EEA / UK (GDPR)</h3>
        <p>
          If GDPR applies, our legal bases are: contract (to run the desk you asked for),
          legitimate interests (security, product improvement, limited analytics), consent
          (newsletters; non-essential cookies), and legal obligation (tax, lawful
          requests). You may withdraw consent without affecting prior processing.
        </p>

        <h2 id="children">12. Children</h2>
        <p>
          The Service is not directed to children under 18, and we do not knowingly
          collect personal information from them. If you believe a minor has submitted
          data, contact us and we will delete it.
        </p>

        <h2 id="changes">13. Changes</h2>
        <p>
          We will update the &quot;Last updated&quot; date when this Policy changes. Material
          changes will be noted on this page or, if you have an account, by email.
        </p>

        <h2 id="contact">14. Contact</h2>
        <p>
          Privacy: <a href="mailto:privacy@agents61.com">privacy@agents61.com</a>
          <br />
          Legal: <a href="mailto:legal@agents61.com">legal@agents61.com</a>
          <br />
          Desk: <Link href="/contact">Contact form</Link>
        </p>
      </LegalShell>
      <Footer />
    </>
  );
}
