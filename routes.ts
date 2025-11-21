export const ROUTES = [
  '/maintenance',
  '/privacy-policy',
  '/tos',
  '/kyc-policy',
  '/aml-policy',
  '/responsible-gaming',

  // sitemap
  '/sitemap_index.xml',
  '/__sitemap__/style.xsl',
  '/__sitemap__/games.xml',
  '/__sitemap__/games.xml',
  '/sitemap.xml'
]

export const QUERY_ROUTES = [
  ...ROUTES,

  '/affiliate',

  '/',
  // casino routes
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

export const ROUTE_RULES = {
  '/casino': { redirect: '/casino/home', statusCode: 301 },
  '/geo-block': { redirect: '/casino/home?modal=region', statusCode: 301 },
  '/login': { redirect: '/casino/home?modal=auth&type=login', statusCode: 301 },
  '/register': { redirect: '/casino/home?modal=auth&type=register', statusCode: 301 },
  '/provably-fair': { redirect: '/casino/home?modal=/provably-fair', statusCode: 301 },
  '/provably-fair/overview': { redirect: '/casino/home?modal=/provably-fair/overview', statusCode: 301 },
  '/vip': { redirect: '/vip-program', statusCode: 301 },
  '/live/': { ssr: false }
}
