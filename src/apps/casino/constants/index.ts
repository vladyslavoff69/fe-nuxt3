import type { GameCategory } from '~/types'

export const CASINO_HOME = Symbol('CASINO_HOME') as InjectionKey<{
  gameCategories: ComputedRef<GameCategory[]>;
  categoriesLoading: Ref<boolean>;
}>

export const CASINO_SUB_PAGE_GAMES_LIMIT = 24

export const [POPULAR, AZ, ZA, NEWEST] = [
  'POPULAR',
  'A-Z',
  'Z-A',
  'NEWEST',
] as const

export const orderByMaps = {
  [POPULAR]: {
    column: 'GAME_CATEGORY_GAME_ORDER',
    order: 'ASC',
  },
  [AZ]: {
    column: 'TITLE',
    order: 'ASC',
  },
  [ZA]: {
    column: 'TITLE',
    order: 'DESC',
  },
  [NEWEST]: {
    column: 'RELEASED_AT',
    order: 'DESC',
  },
}

export const providerOrderByMaps = {
  [POPULAR]: {
    column: 'ORDER',
    order: 'ASC',
  },
  [AZ]: {
    column: 'NAME',
    order: 'ASC',
  },
  [ZA]: {
    column: 'NAME',
    order: 'DESC',
  },
  [NEWEST]: {
    column: 'RELEASED_AT',
    order: 'DESC',
  },
}
