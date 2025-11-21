import { CURRENCY } from '~/constants'

export const useUsdToFiatAmount = () => {
  const { usdToFiat, currentFiatCurrency } = inject(CURRENCY)!
  const usdToFiatAmount = (amount: number = 0) => {
    return `${amount < 0 ? '-' : ''}${currentFiatCurrency.value?.symbol}${Number(
      Math.abs(amount) * usdToFiat.value[currentFiatCurrency.value?.code]
    ).toFixed(2)}`
  }

  return {
    usdToFiatAmount,
  }
}
