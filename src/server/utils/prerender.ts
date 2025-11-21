export const prerenderRoutes = [
  '/maintenance',
  '/privacy-policy',
  '/tos',
  '/kyc-policy',
  '/aml-policy',
  '/responsible-gaming',

  '/affiliate',

  // casino routes
  '/',
  '/casino/home',
  '/casino/home/junglebet',
  '/casino/home/new-releases',
  '/casino/home/slots',
  '/casino/home/live-casino',

  // Category Pages
  '/casino/category/roulette',
  '/casino/category/poker',
  '/casino/category/blackjack',
  '/casino/category/roulette',
  '/casino/category/baccarat',
  '/casino/categories',

  // Game Pages
  '/casino/games/junglebet/dice',
  '/casino/games/junglebet/limbo',
  '/casino/games/junglebet/keno',
  '/casino/games/junglebet/plinko',
  '/casino/games/junglebet/wheel',

  '/casino/provider/junglebet',
  '/casino/provider/pragmatic-play',
  '/casino/provider/evolution',
  '/casino/provider/hacksaw-gaming',
  '/casino/provider/playn-go',
  '/casino/provider/relax-gaming',
  '/casino/provider/nolimit-city',
  '/casino/provider/push-gaming',
  '/casino/provider/pg-soft',
  '/casino/provider/gamzix',
  '/casino/provider/big-time-gaming',
  '/casino/provider/high5-games',
  '/casino/provider/print-studios',
  '/casino/provider/pragmatic-play-live',
  '/casino/provider/thunderkick',
  '/casino/provider/p-g-soft',
  '/casino/providers',
  '/players-charity',

  '/promotions',

  '/vip-program',
  '/verify-email',

  '/account',
  '/affiliate/overview',
  '/affiliate/overview/campaigns',
  '/affiliate/overview/claims',
  '/affiliate/overview/commissions',
  '/affiliate/overview/my-code',
  '/affiliate/overview/statistics',

  '/casino/favorites',
  '/casino/recents',
  '/casino/my-bets',

  '/vip-program/dashboard',
  '/transactions'
]

export const getUseQuery = async (query: string, variables: Record<string, any> = {}) => {
  const url = `${process.env.GRAPHQL_BASE_URL}/@`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age: 1800'
    },
    body: JSON.stringify({ query, variables })
  }

  // @ts-ignore
  const request = new Request(url, options)
  // @ts-ignore
  const { data } = await fetch(request)
    .then((response) => {
      return response.json()
    })

  return data
}
