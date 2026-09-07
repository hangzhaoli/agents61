import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LegalShell from '@/components/layout/LegalShell';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer — Agents61',
  description:
    'Agents61 disclaimer: research simulation, no buy button, not investment advice. Publisher’s 1940 Act positioning.',
};

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <LegalShell title="Disclaimer" updated="September 5, 2026" active="/disclaimer">
        <div className="legal-callout">
          <p>
            <strong>In one screen:</strong> Agents61 is a research simulation and educational
            publication. Isolated briefs never say “you should buy.” There is no buy button, no
            order ticket, no brokerage, and no portfolio management. This page is{' '}
            <em>our own</em> publisher positioning under the Investment Advisers Act of 1940 — it
            does not bind card networks or merchant-of-record processors, and it is not a legal
            opinion for your facts.
          </p>
        </div>

        <h2>1. Research simulation and educational publication</h2>
        <p>
          Agents61 (&quot;the Service&quot;) publishes general, impersonal research. Artificial
          intelligence simulates the publicly described methods of 61 historical and contemporary
          investment figures (&quot;Masters&quot;). Unlocked masters write isolated briefs; a clerk
          stacks agreements and splits. Empty seats stay empty. All content is for information and
          education.
        </p>

        <h2>2. Not investment advice — no personalized recommendation</h2>
        <p>
          Nothing on Agents61 is investment advice, financial advice, trading advice, tax advice,
          or legal advice. The Service does not recommend that <em>you</em> purchase, sell, or hold
          any security, crypto-asset, or other instrument. You should not make an investment
          decision based solely on Agents61. Isolated briefs never say &quot;you should buy.&quot;
        </p>

        <h2>3. No buy button, no brokerage, no execution</h2>
        <p>Agents61 does not:</p>
        <ul>
          <li>Display a buy, sell, or swap button for any security or token</li>
          <li>Route, place, or execute orders, or hold customer assets as a broker or exchange</li>
          <li>Connect to a brokerage API to trade on your behalf</li>
          <li>Provide real-time trading signals or a model portfolio you are told to copy</li>
          <li>Tailor a report to your net worth, tax lot, risk questionnaire, or account</li>
        </ul>
        <p>
          Paying for seating — cards, Apple Pay, or Google Pay via Waffo Pancake (Merchant of
          Record) on <Link href="/checkout/waffo">/checkout/waffo</Link>; a NOWPayments crypto
          invoice; or the annual USDT backup — buys access to more isolated research seats and
          report volume. It is not a wrap-fee advisory account and not an order.
        </p>

        <h2>4. Publisher&apos;s exclusion — Investment Advisers Act of 1940</h2>
        <p>
          We operate the Service as a bona fide publisher of general and regular publications of
          impersonal commentary, consistent with the publisher&apos;s exclusion from the definition
          of &quot;investment adviser&quot; in Section 202(a)(11)(D) of the Investment Advisers Act
          of 1940, as discussed by the U.S. Supreme Court in <em>Lowe v. SEC</em>, 472 U.S. 181
          (1985). In our own words, that means our content is intended to be:
        </p>
        <ul>
          <li>
            <strong>General and impersonal:</strong> the same desk rules run for a ticker or a
            question. We do not interview your finances or output “for your portfolio, do X.”
          </li>
          <li>
            <strong>Bona fide publication:</strong> analysis and commentary, not a tout for a
            security we are selling you, and not a tout disguised as a newsletter.
          </li>
          <li>
            <strong>Regularly published:</strong> a standing research product on a published
            seating schedule — not a one-off letter timed to a deal we are distributing.
          </li>
        </ul>
        <p>
          We are not a registered investment adviser, broker-dealer, or commodity trading advisor.
          <em>Lowe</em> and the statute turn on facts. This section is how we describe the product.
          It is not a warranty that a regulator, a court, or a payments company will agree. Card
          merchant-of-record policies are separate contracts; their acceptable-use lists are not
          rewritten by this disclaimer.
        </p>

        <h2>5. Markets we write about</h2>
        <p>
          US-listed stocks and ETFs first. US-listed emerging-market ADRs as a window, not a local
          exchange. Crypto and on-chain subjects as research when you ask — still no buy button,
          still not a venue. A-shares later. Missing SEC facts or missing on-chain series stay
          inconclusive; we do not invent P/E, P/B, MVRV, or TVL.
        </p>

        <h2>6. AI-generated content</h2>
        <p>
          Reports, tables, and charts are generated by models simulating public methodologies. They
          are not the Masters, their estates, or their firms. They can be wrong, stale, or
          incomplete. See the <Link href="/ai-disclosure">AI Disclosure</Link>.
        </p>

        <h2>7. No guarantee of accuracy</h2>
        <p>
          We do not warrant completeness, accuracy, or fitness of any figure, including cached
          filing facts and cached model-input ratios (P/E, P/B, P/S) or public crypto snapshots.
          Reliance is your own risk.
        </p>

        <h2>8. Past performance</h2>
        <p>
          Past performance of any strategy, master, or committee mix does not predict future
          results. Historical returns cited in personas come from public sources and can be wrong.
        </p>

        <h2>9. Consult a professional</h2>
        <p>
          Before any investment decision, consult a qualified adviser, tax professional, or
          attorney who knows your facts. Agents61 will not be that adviser.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          In no event shall Agents61, its operators, or its affiliates be liable for damages
          arising out of use of the Service, including trading losses. Additional terms:{' '}
          <Link href="/terms">Terms of Use</Link> and <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalShell>
      <Footer />
    </>
  );
}
