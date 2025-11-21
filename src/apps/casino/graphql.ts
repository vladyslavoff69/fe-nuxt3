import { gameCategoryFields, gameFields } from '~/graphql/fragments'

export const CASINO_CATEGORIES_QUERY = gql`
  query gameCategories(
    $gamesLimit: Int
    $orderBy: [GameCategoryGamesOrderByOrderByClause!]
  ) {
    gameCategories {
      ...gameCategoryFields
      games(limit: $gamesLimit, orderBy: $orderBy) {
        ...gameFields
        gameProvider {
          id
          slug
          display_name
        }
      }
    }
  }
  ${gameCategoryFields}
  ${gameFields}
`
