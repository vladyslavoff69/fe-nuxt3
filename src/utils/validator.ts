import { helpers } from '@vuelidate/validators'
import CryptoJS from 'crypto-js'
import JsSHA from 'jssha'

export const checkNumberAndSymbol = helpers.regex(
  /^(?=.*\d)(?=.*[!$@?#%^&*~]).*$/
)
export const checkLetters = helpers.regex(/^(?=.*[a-z])(?=.*[A-Z]).*$/)
export const checkNameLetters = helpers.regex(/^[a-zA-Z0-9]+$/)
export const checkAtLetter = helpers.regex(/@/)
export const checkDotLetter = helpers.regex(/\./)

export const generateBinarySeed = (mnemonic: string): string => {
  const salt = 'mnemonic'
  const iterationCount = 2048
  const derivedKeyLength = 64

  const seed = CryptoJS.PBKDF2(mnemonic, salt, {
    iterations: iterationCount,
    keySize: derivedKeyLength / 4, // Key size is specified in words, so divide by 4
    hasher: CryptoJS.algo.SHA512,
  })

  const binarySeed = CryptoJS.enc.Hex.parse(seed?.toString())
  const hexStr = binarySeed?.toString(CryptoJS.enc.Hex)
  const bin2hex = (s: string) => {
    let i
    let l
    let o = ''
    let n
    s += ''
    for (i = 0, l = s.length; i < l; i++) {
      n = s?.charCodeAt(i)?.toString(16)
      o += n.length < 2 ? '0' + n : n
    }
    return o
  }
  const binStr = bin2hex(hexStr)

  return binStr.slice(0, 64)
}

type Props = {
  cursor?: number;
  count?: number;
  range?: [number, number];
  clientSeed: string;
  serverSeed: string;
  nonce: number;
  intOnly?: boolean;
  checkScaledResult?: boolean;
};

type IntegerProps = {
  cursor?: number;
  count?: number;
  minRange?: number;
  maxRange: number;
  clientSeed: string;
  serverSeed: string;
  nonce: number;
  additionalIndex?: boolean;
}

export const verifyGame = (() => {
  // Initiate variables here if needed
  // let ctx_clientSeed: string;
  // let ctx_serverSeed: string;
  // let ctx_nonce: number | null;
  const generateFloats = async ({
    cursor = 0,
    count = 1,
    range = [0, 1],
    clientSeed,
    serverSeed,
    nonce = 0,
    intOnly = false,
    checkScaledResult = true,
  }: Props) => {
    // Random number generator function
    const rng = byteGenerator(cursor, clientSeed, serverSeed, nonce)
    // Declare bytes as empty array
    const bytes = []

    // Populate bytes array with sets of 4 from RNG output
    while (bytes.length < count * 4) {
      const item = await rng.next()
      // @ts-ignore
      bytes.push(item.value)
    }
    // Return bytes as floats
    const floats: number[] = []
    const byteChunks = chunkArray(bytes, 4)

    for (const bytesChunk of byteChunks) {
      let result = 0
      // @ts-ignore
      for (let i = 0; i < bytesChunk.length; i++) {
        const divider = Math.pow(256, i + 1)
        const partialResult = bytesChunk[i] / divider
        result += partialResult
      }

      if (checkScaledResult) {
        // Scale the result to the desired range
        const scaledResult = result * (range[1] - range[0]) + range[0]
        let validResult = intOnly ? Math.floor(scaledResult) : scaledResult
        while (floats.includes(validResult)) {
          validResult++
          if (validResult > range[1]) {
            validResult = range[0]
          }
        }
        floats.push(validResult)
      } else {
        floats.push(result)
      }
    }

    return floats
  }

  const generateIntegers = async ({
    cursor = 0,
    count = 1,
    minRange = 0,
    maxRange = 100,
    clientSeed,
    serverSeed,
    nonce = 0,
    additionalIndex = false
  }: IntegerProps) => {
    let countFloats = maxRange - minRange
    if (additionalIndex) {
      countFloats = (maxRange - minRange) + 1
    }
    const floats: number[] = await generateFloats({ cursor, count: countFloats, clientSeed, serverSeed, nonce, checkScaledResult: false })
    const positions = [...Array(countFloats).keys()].map(i => i + minRange)

    for (let i = 0; i < positions.length; i++) {
      let j = i + Math.floor(floats[i] * (positions.length - i))
      j = Math.min(j, positions.length - 1)
      const temp = positions[i]
      positions[i] = positions[j]
      positions[j] = temp
    }
    return positions.slice(0, count)
  }

  const chunkArray = (array: Array<any>, chunkSize: number) => {
    const results = []

    while (array.length) {
      // @ts-ignore
      results.push(array.splice(0, chunkSize))
    }

    return results
  }

  const byteGenerator = async function* (
    cursor = 0,
    clientSeed: string | null = null,
    serverSeed: string | null = null,
    nonce: number | null = null
  ) {
    // Setup cursor variables
    let currentRound = Math.floor(cursor / 32)
    let currentRoundCursor = cursor
    currentRoundCursor -= currentRound * 32

    // Generate outputs until cursor requirement is fulfilled
    while (true) {
      // HMAC function used to output provided inputs into bytes
      const hmac = createHmac(
        'SHA-256',
        clientSeed + ':' + nonce + ':' + currentRound,
        serverSeed
      )
      const buffer = new Uint8Array(str2ab(hmac))
      // Update cursor for next iteration of loop
      while (currentRoundCursor < 32) {
        // The yield keyword is used in a Generator function, similar to JavaScript's function* syntax
        yield buffer[currentRoundCursor]
        currentRoundCursor++
      }
      currentRoundCursor = 0
      currentRound++
    }
  }

  const createHmac = (algorithm: string, text: string, key: string | null) => {
    // @ts-ignore
    const shaObj = new JsSHA(algorithm, 'TEXT')
    // @ts-ignore
    shaObj.setHMACKey(key, 'TEXT')
    shaObj.update(text)
    return shaObj.getHMAC('BYTES')
  }

  const str2ab = (str: string) => {
    const buf = new ArrayBuffer(str.length)
    const bufView = new Uint8Array(buf)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf
  }

  // Return the public methods of the class
  return {
    generateFloats,
    generateIntegers,
    chunkArray,
    byteGenerator,
    createHmac,
    str2ab,
    generateBinarySeed,
  }
})()
