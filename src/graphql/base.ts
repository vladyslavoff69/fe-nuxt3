export const CMS_CONTENTS_QUERY = gql`
  query contentBySlug($slug: String) {
    contentBySlug(slug: $slug) {
      id
      content
      enabled
      slug
      title
      games {
        cover
        id
        image
        slug
        title
        video
      }
    }
  }
`
