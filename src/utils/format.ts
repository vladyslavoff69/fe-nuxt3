export const integerFormat = (n: number) => {
  return String(n).replace(/(.)(?=(\d{3})+$)/g, '$1,')
}

/* Convert to numbers. ex: 123,123,123.123 */
export const numberWithCommas = (x: number, fractionDigits: number = 2) => {
  if (!x || isNaN(x)) {
    return 0
  }

  return x.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })
}

export function getParsedJwt<T extends object = { [k: string]: string | number }> (
  token: string,
): T | undefined {
  try {
    return JSON.parse(atob(token?.split('.')[1]))
  } catch {
    return undefined
  }
}

export const formatLongFloat = (n: number, fractionDigits: number = 2) => {
  const x = String(n)?.split('.')
  if (!x[1]) {
    return n
  }

  if (x[1].length > fractionDigits * 2) {
    return n.toFixed(fractionDigits * 2)
  }

  return n
}

export function formatShortNumber (num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'BN'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }

  return num.toString()
}
