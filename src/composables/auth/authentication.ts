import { LOGOUT_MUTATION } from '~/graphql'
import type { RuntimeConfig } from 'nuxt/schema'
import type { ID } from '~/types'
import { AUTH } from '~/constants'
import { Crisp } from 'crisp-sdk-web'

export const useLogout = () => {
  const { freeSpinsCode } = inject(AUTH)!
  const { mutate, onDone, loading, onError } = useMutation(LOGOUT_MUTATION)
  const { onLogout } = useApollo()
  const { t } = useI18n()
  const cookie = getAuthCookie()
  const route = useRoute()
  const router = useRouter()

  const logout = async () => {
    if (loading.value) {
      return
    }

    await mutate()
  }

  const logoutAPI = async () => {
    await useFetch('/api/auth/logout', { method: 'POST', body: {} })
  }

  onDone(() => {
    cookie.value = null
    onLogout()

    if (!route.path?.includes('/r/') && freeSpinsCode.value === '') {
      useGeneralNotify({
        type: 'success',
        title: t('auth.sign_out'),
        description: t('notifications.your-account-signed-out'),
      })
    }

    if (typeof Crisp !== 'undefined' && import.meta.client) {
      Crisp.setTokenId()
      Crisp.session.reset()
    }

    logoutAPI()

    if (freeSpinsCode.value === '') {
      router.push({
        path: router.currentRoute.value.path,
        query: {
          ...route.query,
        },
      })
    }
  })

  onError((error) => {
    const parsedError = parseGraphqlError(error)
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-log-out'),
      description: parsedError.message,
    })
  })

  return {
    loading,
    logout,
  }
}

export const usePasskeys = () => {
  const config: RuntimeConfig = useRuntimeConfig()
  const cookie = getAuthCookie()
  const { logout } = useLogout()
  const { t } = useI18n()

  const loading = ref(true)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookie.value}`,
  }

  const listKeys = async () => {
    loading.value = true
    try {
      const response = await fetch(
        `${config.public?.graphqlBaseUrl}/api/webauthn/list-keys`,
        {
          method: 'POST',
          headers,
        },
      )

      loading.value = false

      return await response.json()
    } catch (e) {
      loading.value = false

      await logout()

      return []
    }
  }

  const deleteKey = async (id: ID) => {
    loading.value = true

    try {
      const response = await fetch(
        `${config.public?.graphqlBaseUrl}/api/webauthn/delete-key`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ id })
        }
      )

      loading.value = false

      const re = await response.json()

      useGeneralNotify({
        type: 'success',
        title: t('notifications.success'),
        // @ts-ignore
        description: re?.message
      })
    } catch (e) {
      loading.value = false

      useGeneralNotify({
        type: 'error',
        title: 'Server Error!',
        description: t('errors.SOMETHING_WENT_WRONG')
      })

      await logout()
    }
  }

  const updateKeyName = async (id: ID, name: string) => {
    loading.value = true

    try {
      const response = await fetch(
        `${config.public?.graphqlBaseUrl}/api/webauthn/update-key-name`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ id, name })
        }
      )

      loading.value = false

      const re = await response.json()

      useGeneralNotify({
        type: 'success',
        title: t('notifications.success'),
        // @ts-ignore
        description: re?.message
      })
    } catch (e) {
      loading.value = false

      useGeneralNotify({
        type: 'error',
        title: 'Server Error!',
        description: t('errors.SOMETHING_WENT_WRONG')
      })

      await logout()
    }
  }

  return {
    listKeys,
    deleteKey,
    updateKeyName,
    loading,
  }
}

const generatePublicKey = (
  challenge: ArrayBuffer,
  options: {
    rp: any;
    timeout: any;
    user: any;
    authenticatorSelection: any;
    pubKeyCredParams: any;
  }
) => {
  return {
    challenge,
    rp: {
      name: options.rp?.name,
      id: options.rp?.id,
    },
    user: {
      id: new Uint8Array(16),
      name: options.user?.name,
      displayName: options.user?.displayName,
    },
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    authenticatorSelection: {
      userVerification: options.authenticatorSelection?.userVerification,
      authenticatorAttachment: 'platform',
    },
  }
}

export const usePasskeyLogin = () => {
  const config: RuntimeConfig = useRuntimeConfig()
  const loading = ref(false)
  const { t } = useI18n()
  const { login, me } = inject(AUTH)!
  const { onLogin } = useApollo()

  const loginByPasskey = async () => {
    loading.value = true
    try {
      const response = await fetch(
        `${config.public?.graphqlBaseUrl}/api/webauthn/authenticate/options`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        },
      )

      const options = await response.json()

      if (!options) {
        return null
      }

      // @ts-ignore
      const challenge = base64urlToArrayBuffer(options.challenge)
      // @ts-ignore
      const publicKey = generatePublicKey(challenge, options)

      // Step 2: Get an assertion from the client
      const assertion = await navigator.credentials.get({ publicKey })

      // Step 3: Send the assertion to the backend for verification
      const assertionResponse = {
        id: assertion?.id,
        // @ts-ignore
        rawId: arrayBufferToBase64Url(assertion?.rawId),
        type: assertion?.type,
        response: {
          // @ts-ignore
          clientDataJSON: arrayBufferToBase64Url(assertion?.response?.clientDataJSON),
          // @ts-ignore
          authenticatorData: arrayBufferToBase64Url(assertion?.response?.authenticatorData),
          // @ts-ignore
          signature: assertion?.response.signature,
          // @ts-ignore
          userHandle: assertion?.response.userHandle,
        },
      }

      const verificationResponse = await fetch(
        `${config.public?.graphqlBaseUrl}/api/webauthn/authenticate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...assertionResponse,
          }),
        },
      )

      const result = await verificationResponse.json()

      // @ts-ignore
      onLogin(result?.token)

      login()

      loading.value = false

      useGeneralNotify({
        type: 'success',
        title: t('notifications.welcome'),
        description: `${t('notifications.lets-have-fun')}, ${me.value?.username}`
      })
    } catch (error) {
      loading.value = false

      useGeneralNotify({
        type: 'error',
        title: t('notifications.error'),
        // @ts-ignore
        description: error?.message
      })
    }
  }

  return {
    loginByPasskey,
    loginLoading: loading
  }
}

export const usePasskeyRegister = () => {
  const config: RuntimeConfig = useRuntimeConfig()
  const cookie = getAuthCookie()
  const loading = ref(false)

  const registerKey = async (name: string | null) => {
    loading.value = true

    try {
      // Step 1: Get registration options from the backend
      const response = await fetch(
        `${config.public?.graphqlBaseUrl}/api/webauthn/register/options`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookie.value}`,
          },
        },
      )

      const options = await response.json()

      if (!options) {
        return null
      }

      // @ts-ignore
      const challenge = base64urlToArrayBuffer(options.challenge)
      // @ts-ignore
      const publicKey = generatePublicKey(challenge, options)

      // Step 2: Create a new credential on the client
      // @ts-ignore
      const credential = await navigator.credentials.create({ publicKey })

      // Step 3: Send the credential to the backend for verification
      const attestationResponse = {
        id: credential?.id,
        // @ts-ignore
        rawId: arrayBufferToBase64Url(credential?.rawId),
        type: credential?.type,
        response: {
          // @ts-ignore
          clientDataJSON: arrayBufferToBase64Url(credential?.response?.clientDataJSON),
          // @ts-ignore
          attestationObject: arrayBufferToBase64Url(credential?.response?.attestationObject),
        },
        name,
      }

      const verificationResponse = await fetch(
        `${config.public?.graphqlBaseUrl}/api/webauthn/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookie.value}`,
          },
          body: JSON.stringify({
            ...attestationResponse,
          }),
        },
      )

      const result = await verificationResponse.json()

      loading.value = false
      // @ts-ignore
      if (result.key) {
        return result
      } else {
        return null
      }
    } catch (error) {
      loading.value = false

      return null
    }
  }

  return {
    registerKey,
    loading,
  }
}
