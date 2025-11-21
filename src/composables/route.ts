export const useRouteChange = (enable: Ref<boolean>) => {
  let unwatch
  const route = useRoute()
  let callbacks: Function[] = []

  const onPathChange = (fn: Function): Function => {
    callbacks.push(fn)
    return () => {
      callbacks = callbacks.filter(iFn => iFn !== fn)
    }
  }

  watch(
    () => enable.value,
    (enabled) => {
      if (enabled) {
        unwatch = watch(
          () => route.path,
          (currPath, prevPath) => {
            if (currPath.split('/')[1] !== prevPath.split('/')[1]) {
              callbacks.forEach((fn) => {
                fn(currPath)
              })
              // in case of casino
            } else if (currPath.split('/')[1] === 'casino') {
              if (currPath.split('/')[2] !== prevPath.split('/')[2]) {
                callbacks.forEach((fn) => {
                  fn(currPath)
                })
                // in case of casino
              }
            }
          }
        )
      } else {
        unwatch! && unwatch()
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    unwatch! && unwatch()
  })

  return {
    onPathChange
  }
}
