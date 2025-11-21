export function navigateRoute ({
  path = null,
  newQueries = {},
  oldQueries = []
} : {
  path?: null | string,
  newQueries?: any,
  oldQueries?: string[]
}) {
  const route = useRoute()
  const router = useRouter()
  const localePath = useLocalePath()
  const queryWithout = { ...route.query }

  for (const key of oldQueries) {
    delete queryWithout[key]
  }

  router.push({
    path: path ? localePath(path) : router.currentRoute.value.path,
    query: {
      ...queryWithout,
      ...newQueries
    },
  })
}
