export default defineNuxtPlugin(async (nuxtApp) => {
  const referrer = useRequestHeaders()

  useState('jbReferrer', () => referrer)
})
