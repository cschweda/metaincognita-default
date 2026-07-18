import { describe, it, expect } from 'vitest'
import { allItems } from '~/data/catalog'
import { buildJsonLd } from '~/utils/jsonLd'

describe('structured data (JSON-LD)', () => {
  const jsonLd = buildJsonLd(allItems)

  it('has a @graph with WebSite and ItemList nodes', () => {
    expect(jsonLd).toHaveProperty('@context', 'https://schema.org')
    expect(jsonLd).toHaveProperty('@graph')
    expect(Array.isArray(jsonLd['@graph'])).toBe(true)
    expect(jsonLd['@graph']).toHaveLength(2)

    const types = jsonLd['@graph'].map((node: any) => node['@type'])
    expect(types).toContain('WebSite')
    expect(types).toContain('ItemList')
  })

  it('has a WebSite node with required properties', () => {
    const webSite = jsonLd['@graph'].find((node: any) => node['@type'] === 'WebSite')
    expect(webSite).toBeDefined()
    expect(webSite).toHaveProperty('@id', 'https://metaincognita.com/#website')
    expect(webSite).toHaveProperty('name', 'metaincognita')
    expect(webSite).toHaveProperty('url', 'https://metaincognita.com')
    expect(webSite).toHaveProperty('inLanguage', 'en')
    expect(webSite).toHaveProperty('description')
    expect(webSite.description).toBeTruthy()
  })

  it('has an ItemList with numberOfItems matching catalog length', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')
    expect(itemList).toBeDefined()
    expect(itemList).toHaveProperty('numberOfItems', allItems.length)
    expect(itemList.numberOfItems).toBe(11)
  })

  it('has itemListElement with one entry per app', () => {
    expect(allItems.length).toBeGreaterThan(0)
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')
    expect(itemList.itemListElement).toBeDefined()
    expect(Array.isArray(itemList.itemListElement)).toBe(true)
    expect(itemList.itemListElement).toHaveLength(allItems.length)
  })

  it('ensures every WebApplication has all seven required fields', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')
    const requiredFields = [
      'name',
      'url',
      'description',
      'applicationCategory',
      'operatingSystem',
      'isAccessibleForFree',
      'offers'
    ]

    for (const listItem of itemList.itemListElement) {
      expect(listItem.item).toBeDefined()
      const app = listItem.item

      for (const field of requiredFields) {
        expect(app).toHaveProperty(field)
        expect(app[field]).toBeTruthy()
      }
    }
  })

  it('ensures every offers object has correct structure', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')

    for (const listItem of itemList.itemListElement) {
      const offers = listItem.item.offers
      expect(offers['@type']).toBe('Offer')
      expect(offers.price).toBe('0')
      expect(offers.priceCurrency).toBe('USD')
    }
  })

  it('ensures every url matches catalog domain with https prefix', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')

    for (let i = 0; i < itemList.itemListElement.length; i++) {
      const listItem = itemList.itemListElement[i]
      const catalogItem = allItems[i]
      expect(listItem.item.url).toBe(`https://${catalogItem.domain}`)
    }
  })

  it('ensures position is 1-based and sequential', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')

    for (let i = 0; i < itemList.itemListElement.length; i++) {
      const listItem = itemList.itemListElement[i]
      expect(listItem.position).toBe(i + 1)
    }
  })

  it('ensures every WebApplication name matches catalog title', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')

    for (let i = 0; i < itemList.itemListElement.length; i++) {
      const listItem = itemList.itemListElement[i]
      const catalogItem = allItems[i]
      expect(listItem.item.name).toBe(catalogItem.title)
    }
  })

  it('carries each app’s repository as sameAs exactly when it has one', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')

    for (let i = 0; i < itemList.itemListElement.length; i++) {
      const app = itemList.itemListElement[i].item
      const catalogItem = allItems[i]!
      if (catalogItem.repo) {
        expect(app.sameAs, catalogItem.domain).toEqual([catalogItem.repo])
      } else {
        // the private repo gets no phantom URL in the structured data either
        expect(app.sameAs, catalogItem.domain).toBeUndefined()
      }
    }
  })

  it('ensures every WebApplication description matches catalog description', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')

    for (let i = 0; i < itemList.itemListElement.length; i++) {
      const listItem = itemList.itemListElement[i]
      const catalogItem = allItems[i]
      expect(listItem.item.description).toBe(catalogItem.description)
    }
  })

  it('ensures all apps have consistent application category and operating system', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')

    for (const listItem of itemList.itemListElement) {
      expect(listItem.item.applicationCategory).toBe('GameApplication')
      expect(listItem.item.operatingSystem).toBe('Web')
      expect(listItem.item.isAccessibleForFree).toBe(true)
    }
  })

  it('catches missing apps by verifying ItemList length equals catalog length', () => {
    const itemList = jsonLd['@graph'].find((node: any) => node['@type'] === 'ItemList')
    // This will fail if someone adds an app to catalog.ts without adding to itemListElement
    expect(itemList.itemListElement.length).toBe(allItems.length)
  })
})
