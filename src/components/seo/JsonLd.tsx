export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://agents61.com/#org',
      name: 'Agents61',
      url: 'https://agents61.com',
      logo: 'https://agents61.com/brand/mark-61.png',
      sameAs: ['https://github.com/hangzhaoli/agents61'],
      description:
        '61-master AI investment committee. Isolated or division-of-labor research simulation for US stocks, ETFs, and on-chain names. Not advice.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://agents61.com/#site',
      url: 'https://agents61.com',
      name: 'Agents61',
      publisher: { '@id': 'https://agents61.com/#org' },
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://agents61.com/#app',
      name: 'Agents61',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      url: 'https://agents61.com',
      description:
        '61-master AI investment committee for US stock research. Isolated briefs or division of labor. Research simulation, not advice.',
      offers: {
        '@type': 'Offer',
        price: '19',
        priceCurrency: 'USD',
      },
      featureList: [
        'Isolated master-agent stock research',
        'Division of labor pipeline handoff',
        'Red-team investment debate',
        'US stocks, ETFs, crypto, emerging ADRs',
      ],
      publisher: { '@id': 'https://agents61.com/#org' },
    },
    {
      '@type': 'DefinedTerm',
      name: 'Agents61',
      description:
        'A 61-seat AI investment research committee. Named master agents write isolated briefs or a pipeline handoff. A clerk stacks splits. No buy button.',
      url: 'https://agents61.com/llms.txt',
    },
  ],
};
