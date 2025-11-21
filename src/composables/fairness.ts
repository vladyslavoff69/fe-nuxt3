import { generateBinarySeed, verifyGame } from '~/utils/validator'

export const useVerifyFairness = (props: {
  serverSeed: Ref<string>;
  clientSeed: Ref<string>;
  nonce: Ref<number>;
  range?: [number, number] | Ref<[number, number]>;
  cursors?: number;
  count: Ref<number>;
  intOnly?: boolean;
  isGenerateIntegers?: boolean;
  additionalIndex?: boolean;
}): {
  loading: Ref<boolean>;
  result: Ref<(number | number[])[]>;
  first: ComputedRef<number | number[]>;
  canVerify: ComputedRef<boolean>;
  verified: Ref<boolean>;
} => {
  const {
    serverSeed,
    clientSeed,
    nonce,
    range = [0, 1],
    count,
    intOnly = false,
    cursors = 1,
    isGenerateIntegers = false,
    additionalIndex
  } = props
  const loading = ref(false)
  const result = ref<(number | number[])[]>([])

  const canVerify = computed<boolean>(
    () => (!!serverSeed.value && !!clientSeed.value && count.value > 0)
  )
  const verified = ref(false)

  const verify = async () => {
    const unwrappedRange = unref(range)
    try {
      loading.value = true
      let newResult: (number | number[])[] = []
      for (let i = 0; i < cursors; i++) {
        let stepResult: number[] = []
        if (!isGenerateIntegers) {
          stepResult = await verifyGame.generateFloats({
            cursor: i,
            count: count.value,
            range: unwrappedRange,
            clientSeed: generateBinarySeed(clientSeed.value),
            serverSeed: generateBinarySeed(serverSeed.value),
            nonce: nonce.value,
            intOnly
          })
        } else {
          stepResult = await verifyGame.generateIntegers({
            cursor: i,
            count: count.value,
            minRange: unwrappedRange[0],
            maxRange: unwrappedRange[1],
            clientSeed: generateBinarySeed(clientSeed.value),
            serverSeed: generateBinarySeed(serverSeed.value),
            nonce: nonce.value,
            additionalIndex
          })
          stepResult.sort()
        }
        if (cursors > 1) {
          newResult = [...newResult, stepResult]
        } else {
          newResult = stepResult
        }
      }
      if (canVerify.value) {
        result.value = newResult
        verified.value = true
      }
    } catch (e) {
      result.value = []
    } finally {
      loading.value = false
    }
  }

  const verifyDfn = useDebounceFn(() => verify(), 1000)
  watchEffect(async () => {
    if (serverSeed.value && clientSeed.value && count.value > 0 && unref(range)) {
      loading.value = true
      if (nonce.value) {
        // for only track nonce
      }
      verified.value = false
      await verifyDfn()
    } else {
      verified.value = false
    }
  })

  return {
    loading,
    result,
    first: computed(() => result.value?.[0] || 0),
    canVerify,
    verified,
  }
}
