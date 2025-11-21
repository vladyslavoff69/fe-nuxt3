// @ts-ignore
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { prerenderRoutes, getUseQuery } from '../../utils/prerender'

export default defineSitemapEventHandler(async () => {
  try {
    const gameProvidersQuery = `
      query gameProviders {
        gameProviders(enabled: true) {
          id
          slug
          game_count
        }
      }
    `

    const gameCategoriesQuery = `
      query gameCategories {
        gameCategories {
          slug
        }
      }
    `

    const promoCampaignsQuery = `
      query promoCampaigns {
        promoCampaigns {
          id
          slug
        }
      }
    `

    const { gameCategories } = await getUseQuery(gameCategoriesQuery)
    const { gameProviders } = await getUseQuery(gameProvidersQuery)
    const { promoCampaigns } = await getUseQuery(promoCampaignsQuery)

    const providers = gameProviders.map((iProvider: { slug: string }) => asSitemapUrl({
      loc: `/casino/provider/${iProvider.slug}`,
      __sitemap: 'pages',
      priority: prerenderRoutes.includes(`/casino/provider/${iProvider.slug}`) ? 0.8 : 0.5
    }))

    const pSlugs = promoCampaigns.map((promo: { slug: string }) => asSitemapUrl({
      loc: `/promotions/${promo.slug}`,
      __sitemap: 'pages',
      priority: prerenderRoutes.includes(`/casino/provider/${promo.slug}`) ? 0.8 : 0.5
    }))

    const gameCategoriesSitemap = gameCategories.map((iCategory: { slug: string }) => asSitemapUrl({
      loc: `/casino/category/${iCategory.slug}`,
      __sitemap: 'pages',
      priority: prerenderRoutes.includes(`/casino/category/${iCategory.slug}`) ? 0.8 : 0.5
    }))

    return [
      ...providers,
      ...gameCategoriesSitemap,
      ...pSlugs
    ]
  } catch (e) {
    return []
  }
})
