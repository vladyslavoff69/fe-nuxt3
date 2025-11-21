// @ts-ignore
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { prerenderRoutes, getUseQuery } from '../../utils/prerender'

type ID = string | number

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

    const gamesByProviderQuery = `
      query gamesByProvider($game_provider_id: ID, $first: Int!) {
        gamesByProvider(game_provider_id: $game_provider_id, first: $first, enabled: true) {
          data {
            slug
          }
        }
      }
    `

    const { gameProviders } = await getUseQuery(gameProvidersQuery)

    const gamesByProviderTask = gameProviders.map(
      (iProvider: { id: ID, slug: string, game_count: number }) => getUseQuery(
        gamesByProviderQuery, { game_provider_id: iProvider.id, first: 20 }
      ).then((result) => {
        const { gamesByProvider: { data: gamesByProvider } } = result
        return {
          provider: iProvider.slug,
          games: gamesByProvider
        }
      }))

    const gamesByProvider = await Promise.all(gamesByProviderTask)
    const games = gamesByProvider.reduce((acc, iProvider) => [
      ...acc,
      ...iProvider.games.map((iGame: { slug: string }) => asSitemapUrl({
        loc: `/casino/games/${iProvider.provider}/${iGame.slug}`,
        __sitemap: 'games',
        priority: prerenderRoutes.includes(`/casino/games/${iProvider.provider}/${iGame.slug}`) ? 0.8 : 0.5
      }))
    ], [])

    return [
      ...games
    ]
  } catch (e) {
    return []
  }
})
