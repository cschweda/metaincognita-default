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
        description: 'A collection of open-source projects, built out of curiosity: casino simulations that show their math, tools for writing screenplays and interactive fiction, a TRS-80 reverse-engineering toolkit, a self-hosted picture frame, games for fun, and playable homages to the VogelTronics catalog. Free, with no sign-ups.',
        inLanguage: 'en'
      },
      {
        '@type': 'ItemList',
        name: 'metaincognita simulations, tools & games',
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'WebApplication',
            name: item.title,
            url: `https://${item.domain}`,
            description: item.description,
            applicationCategory: item.category ?? 'GameApplication',
            operatingSystem: 'Web',
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            // every app is open source; the repository is the same work, elsewhere
            ...(item.repo ? { sameAs: [item.repo] } : {})
          }
        }))
      }
    ]
  }
}
