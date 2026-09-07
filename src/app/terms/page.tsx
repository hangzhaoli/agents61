import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LegalShell from '@/components/layout/LegalShell';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use — Agents61',
  description:
    'Agents61 terms of use: research simulation, seating 16 / 29 / 48 / 61, acceptable use, billing via Waffo Pancake, NOWPayments, and USDT. Not investment advice.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <LegalShell title="Terms of Use" updated="September 5, 2026" active="/terms">
        <p>
          These Terms of Use (&quot;Terms&quot;) govern access to agents61.com and the
          Agents61 committee desk (the &quot;Service&quot;). By using the Service you agree
          to these Terms, the <Link href="/privacy">Privacy Policy</Link>, the{' '}
          <Link href="/disclaimer">Disclaimer</Link>, and the{' '}
          <Link href="/ai-disclosure">AI Disclosure</Link>. If you do not agree, do not
          use the Service.
        </p>

        <h2 id="who">1. Who may use the Service</h2>
        <p>
          You must be at least 18 years old. The Service is built for English-speaking
          intermediate US investors. You are responsible for complying with securities
          and other laws where you live. The Service is not offered to anyone we are
          prohibited from serving.
        </p>

        <h2 id="what">2. What the Service is</h2>
        <p>
          Agents61 is a <strong>research simulation and educational tool</strong>.
          Sixty-one master personas sit in a six-step pipeline. Unlocked seats write
          isolated briefs from filings and their own rules. A clerk assembles agreements
          and splits. Empty seats stay empty. Isolated briefs never say &quot;you should
          buy.&quot;
        </p>
        <p>Paid seating is the product:</p>
        <ul>
          <li>
            <strong>Analyst</strong> — 16-master working committee; debate after isolation
          </li>
          <li>
            <strong>Associate</strong> — 29 masters (working 16 plus 13 specialists). $49 is 29 seats, not 61.
          </li>
          <li>
            <strong>Principal</strong> — 48 masters (working 16 plus 32 specialists)
          </li>
          <li>
            <strong>Committee</strong> — all 61 masters; standard report quota; still isolated first, never a 61-way chat
          </li>
          <li>
            <strong>Partners</strong> — the same 61 masters with higher report volume, priority queue, and API, priced for model cost
          </li>
        </ul>
        <p>
          A limited preview desk (three isolated seats and one report cap) may be offered
          without marketing it as a free plan. Caps are shown on{' '}
          <Link href="/pricing">Pricing</Link>.
        </p>
        <p>
          US stocks first; US ETFs adjacent; US-listed emerging-market names and crypto/on-chain
          research as additional boards; A-shares later. The Service is not a data terminal,
          broker, exchange, or registered investment adviser. There is no buy button. See the{' '}
          <Link href="/disclaimer">Disclaimer</Link>.
        </p>

        <h2 id="preview">3. Public preview</h2>
        <p>
          Login and register create an account. Preview features can change or end. Paid
          seating, when you complete checkout, matches <Link href="/pricing">Pricing</Link>{' '}
          unless we post a change.
        </p>

        <h2 id="accounts">4. Accounts</h2>
        <p>
          When accounts exist, you must provide accurate email, keep credentials secret,
          and tell us if you lose access. You are responsible for activity under your
          account. We may refuse, suspend, or close an account for breach, abuse, or
          legal risk.
        </p>

        <h2 id="plans">5. Plans, caps, and Founding seating</h2>
        <p>
          Plan prices, seat counts, and report caps are shown on Pricing. Paid desks are
          Analyst, Associate, Principal, Committee, and Partners. Founding Committee, while offered,
          is a Committee-priced annual lock for early subscribers (preview $1,190/year)
          and does not change these Terms&apos; research-simulation nature.
        </p>
        <p>
          Caps, queues, and model routing may vary with load. We may throttle or refuse
          runs that look automated or that circumvent seating.
        </p>

        <h2 id="billing">6. Billing and cancellation</h2>
        <p>
          Paid plans bill monthly or annually through the channels shown on{' '}
          <Link href="/pricing">Pricing</Link>. The three rails are:
        </p>
        <ul>
          <li>
            <strong>Cards, Apple Pay, and Google Pay</strong> — Visa, Mastercard, and wallet
            pay on <Link href="/checkout/waffo">/checkout/waffo</Link>.{' '}
            <strong>Waffo Pancake</strong> is the Merchant of Record. They run the hosted
            checkout, collect cardholder payment data, and handle tax and compliance on that
            rail. A charge from Waffo Pancake (or their acquiring partners) is the card
            receipt for your desk seating.
          </li>
          <li>
            <strong>Crypto invoice</strong> — NOWPayments at{' '}
            <Link href="/checkout/nowpayments">/checkout/nowpayments</Link> (USDT-TRC20 and
            other coins they list).
          </li>
          <li>
            <strong>Annual USDT (TRC-20) backup</strong> — a published-address send on{' '}
            <Link href="/checkout/usdt">/checkout/usdt</Link>. You withdraw the transfer
            yourself; we unlock after we verify the hash.
          </li>
        </ul>
        <p>
          Taxes may apply. You may cancel at any time; access continues through the end of
          the paid period unless we terminate for cause. Annual plans are eligible for a
          full refund within 30 days of first purchase if you have not materially exceeded
          fair-use caps — email{' '}
          <a href="mailto:legal@agents61.com">legal@agents61.com</a>. Chargebacks after a
          refund may result in account closure. We do not prorate unused reports.
        </p>
        <p>
          Payment buys seating and report volume for a research publication. It does not buy a
          trade, a signal, or an advisory relationship. See the{' '}
          <Link href="/disclaimer">Disclaimer</Link>.
        </p>

        <h2 id="license">7. License to you</h2>
        <p>
          We grant a limited, revocable, non-exclusive, non-transferable license to use
          the Service for your own research and education. You may not resell seats,
          scrape the roster or reports, or present committee output as a live quote,
          a trade ticket, or personalized advice.
        </p>

        <h2 id="acceptable">8. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service as investment, tax, or legal advice, or as a signal service</li>
          <li>Say or imply that a report is a buy/sell order or that we manage money</li>
          <li>Attempt to reverse-engineer prompts, personas, or model routing</li>
          <li>Redistribute reports as your original analysis or as a paid tip sheet</li>
          <li>Use outputs to manipulate a market or to impersonate a Master</li>
          <li>Exceed rate limits, bypass seating, or automate mass ticker runs without written permission</li>
          <li>Upload malware, scrape in a way that degrades EDGAR or our hosts, or attack other users</li>
          <li>Submit unlawful content or personal data of others without a right to do so</li>
        </ul>

        <h2 id="your-content">9. Your inputs</h2>
        <p>
          Tickers, messages, and other content you submit remain yours. You grant us a
          worldwide license to process them solely to provide, secure, and improve the
          Service (including sending ticker + filing context to model providers). We do
          not claim your investment ideas. Do not submit secrets, account numbers, or
          anyone else&apos;s personal data.
        </p>

        <h2 id="ip">10. Our intellectual property and the Masters</h2>
        <p>
          The Agents61 name, logo, pipeline, seating design, report format, and software
          are ours or our licensors&apos;. You get no rights except the license in section 7.
        </p>
        <p>
          Master names, biographies, and methodologies are used to simulate publicly
          described investment approaches for education. Personas are <strong>not</strong>{' '}
          endorsed by, affiliated with, or the voice of those people, their estates, or
          their firms. You may not use the Service to claim otherwise.
        </p>

        <h2 id="data-sources">11. Market data and filings</h2>
        <p>
          Filing facts come from SEC EDGAR (cached) and, internally, other licensed
          sources. Crypto snapshots use a public API when that board is open. We do not
          display a live quote product and there is no buy button. Facts can be late, missing,
          or wrong. Missing companyfacts stay inconclusive; we do not invent numbers.
          Third-party data remains subject to those providers&apos; terms.
        </p>

        <h2 id="ai">12. AI-generated reports</h2>
        <p>
          Reports, briefs, debate text, and cycle readings are generated by AI. They can
          be incomplete or incorrect. Debate, when unlocked, runs only after isolated
          work exists. Locked seats stay empty — we do not ghost-fill trend, cycle, timing,
          quant, or exit layers. Details: <Link href="/ai-disclosure">AI Disclosure</Link>.
        </p>

        <h2 id="affiliates">13. Affiliates</h2>
        <p>
          Affiliate terms (if we accept you) are additional. You may not promote Agents61
          as a hot-ticker service or guaranteed return. Commission, if any, is on paid
          seating after clawback as described on the{' '}
          <Link href="/affiliate">Affiliate</Link> page.
        </p>

        <h2 id="warranty">14. Disclaimer of warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; WE DISCLAIM ALL
          WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant that reports are
          accurate, that the desk will be uninterrupted, or that any security will
          perform in any way.
        </p>

        <h2 id="liability">15. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Agents61 and its operators are not
          liable for investment losses, trading decisions, lost profits, or indirect,
          incidental, special, consequential, or punitive damages. Our total liability
          for any claim relating to the Service is limited to the greater of (a) amounts
          you paid us for the Service in the 12 months before the claim or (b) USD $50
          if you only used a limited preview desk. Some jurisdictions do not allow certain limits;
          in those places our liability is limited to the maximum allowed.
        </p>

        <h2 id="indemnity">16. Indemnity</h2>
        <p>
          You will defend and indemnify Agents61 against claims arising from your misuse
          of the Service, your redistribution of reports, or your violation of these
          Terms or of law — except to the extent caused by our willful misconduct.
        </p>

        <h2 id="termination">17. Suspension and termination</h2>
        <p>
          You may stop using the Service at any time. We may suspend or terminate access
          for breach, legal risk, or if we shut down the product. Sections that should
          survive (including 10–16, 18–19) survive termination.
        </p>

        <h2 id="changes">18. Changes</h2>
        <p>
          We may update these Terms. The &quot;Last updated&quot; date will change. Continued
          use after the update is acceptance. If you do not agree, stop using the
          Service and cancel any paid plan.
        </p>

        <h2 id="law">19. Governing law</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware, excluding
          conflict-of-law rules. Courts located in Delaware have exclusive jurisdiction,
          except that we may seek injunctive relief anywhere to protect intellectual
          property or the Service. If a provision is unenforceable, the rest remains in
          effect. These Terms are the entire agreement for use of the Service.
        </p>

        <h2 id="contact">20. Contact</h2>
        <p>
          Legal: <a href="mailto:legal@agents61.com">legal@agents61.com</a>
          <br />
          Privacy: <a href="mailto:privacy@agents61.com">privacy@agents61.com</a>
          <br />
          Desk: <Link href="/contact">Contact form</Link>
        </p>
      </LegalShell>
      <Footer />
    </>
  );
}
