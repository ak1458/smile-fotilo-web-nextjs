type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

export function StructuredData({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function serviceSchema({
  name,
  description,
  url,
  offersFrom,
  areaServed = ['India', 'United States', 'Mexico'],
}: {
  name: string;
  description: string;
  url: string;
  offersFrom?: string;
  areaServed?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    url,
    provider: {
      '@id': 'https://smilefotilo.com/#organization',
    },
    areaServed: areaServed.map((name) => ({
      '@type': 'Place',
      name,
    })),
    ...(offersFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: offersFrom,
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function itemListSchema({
  id,
  name,
  description,
  url,
  items,
}: {
  id: string;
  name: string;
  description: string;
  url: string;
  items: Array<{ name: string; url: string; description?: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': id,
    name,
    description,
    url,
    isPartOf: {
      '@id': 'https://smilefotilo.com/#website',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: item.url,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
      })),
    },
  };
}
