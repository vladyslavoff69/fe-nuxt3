import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3'

export default async function () {
  const visitorToken = ref<string>('')
  const visitorFound = ref<boolean>(false)
  const visitorOs = ref<string>('')
  const visitorIp = ref<string>('')
  const requestId = ref<string>('')
  const visitorBrowser = ref<string>('')

  const { data, error, isLoading, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: false }
  )

  if (import.meta.client) {
    await getData({ ignoreCache: true })

    if (!isLoading.value && !error.value && data.value) {
      visitorToken.value = data.value?.visitorId
      visitorFound.value = data.value?.visitorFound
      requestId.value = data.value?.requestId
      visitorOs.value = `${data.value?.os} ${data.value?.osVersion}`
      visitorIp.value = data.value?.ip
      visitorBrowser.value = `${data.value?.browserName} ${data.value?.browserVersion}`
    }
  }

  return {
    visitorToken: visitorToken.value,
    visitorFound: visitorFound.value,
    visitorOs: visitorOs.value,
    visitorIp: visitorIp.value,
    visitorBrowser: visitorBrowser.value,
    requestId: requestId.value,
  }
}
