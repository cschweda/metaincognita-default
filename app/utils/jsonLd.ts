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
        name: 'Metaincognita Workshop',
        url: SITE,
        description: 'The Metaincognita Workshop: open-source projects, built out of curiosity: tools for writing screenplays, a TRS-80 reverse-engineering toolkit, a self-hosted picture frame, a photo publishing platform, an in-browser file converter, a DNS watchdog, an IPv6 readiness test, a coffee-brewer dashboard reachable only over Tailscale, a Markdown editor, a lorem ipsum generator, an image compressor, a document accessibility checker and an accessibility-deadline portal; playable homages to the VogelTronics catalog; casino simulations that show their math; frotz, Inc. (browser tools for 1980s Infocom-style interactive fiction on the Z-machine); and retro games. Free, with no sign-ups.',
        inLanguage: 'en'
      },
      {
        '@type': 'ItemList',
        name: 'Metaincognita Workshop: simulations, tools & games',
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
