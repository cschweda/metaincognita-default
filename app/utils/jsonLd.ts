import type { CatalogItem } from '~/data/catalog'

const SITE = 'https://metaincognita.com'

/** Structured data: the site, plus every simulation/tool as a free web application. */
export function buildJsonLd(items: CatalogItem[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'metaincognita',
        url: SITE,
        description: 'A small, curated collection of open-source projects, built out of curiosity — casino simulations that show their math, memory trainers, and games for fun. No real money, no accounts, no generative AI.',
        inLanguage: 'en'
      },
      {
        '@type': 'ItemList',
        name: 'metaincognita simulations & tools',
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'WebApplication',
            name: item.title,
            url: `https://${item.domain}`,
            description: item.description,
            applicationCategory: 'GameApplication',
            operatingSystem: 'Web',
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
          }
        }))
      }
    ]
  }
}
