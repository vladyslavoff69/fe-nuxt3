import { PREFERENCE } from '~/constants'

/**
 *  Help modal open function
 * */
export const useHelpModal = () => {
  const router = useRouter()
  const openHelpModal = (slug = '') => {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        modal: 'help',
        slug,
      },
    })
  }

  return {
    openHelpModal,
  }
}

/**
 *  User mini profile modal
 */
export const useOpenMiniProfile = () => {
  const router = useRouter()
  const openMiniProfile = (name: string) => {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        name,
        modal: 'user',
      },
    })
  }

  return {
    openMiniProfile,
  }
}

/**
 *  User mini profile modal
 */
export const useOpenWallet = () => {
  const router = useRouter()
  const { activeCryptoCode } = inject(PREFERENCE)!
  const openWallet = (tab?: string) => {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        tab: tab || 'deposit',
        currency: activeCryptoCode.value,
        modal: 'wallet',
      },
    })
  }

  return {
    openWallet,
  }
}
