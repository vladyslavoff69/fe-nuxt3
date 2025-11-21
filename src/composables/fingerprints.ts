import { AUTH } from '~/constants';
import { CREATE_USER_FINGERPRINT_MUTATION } from '~/graphql';
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

export const useSendFingerprint = () => {
  const router = useRouter()
  const { me }: any = inject(AUTH)!
  const { mutate: fingerprintMutate } = useMutation(CREATE_USER_FINGERPRINT_MUTATION)

  let sendFingerprint: Function = async () => {}

  if (import.meta.client) {
    const {
      data: fingerprintData,
      error: fingerprintError,
      isLoading: fingerprintIsLoading,
      getData
    } = useVisitorData(
      {
        extendedResult: true,
        linkedId: me.value?.username || '',
        tag: {
          userAction: router.currentRoute.value.fullPath,
          analyticsId: `USER_ID:: ${me.value?.id || ''}`,
        }
      },
      { immediate: false }
    )

    sendFingerprint = async () => {
      await getData({ ignoreCache: true })

      if (!fingerprintIsLoading.value && !fingerprintError.value && fingerprintData.value && !!me.value?.id) {
        await fingerprintMutate({
          fingerprint: fingerprintData.value?.visitorId,
          user_id: Number(me.value?.id),
          os: `${fingerprintData.value?.os} ${fingerprintData.value?.osVersion}`,
          browser: `${fingerprintData.value?.browserName} ${fingerprintData.value?.browserVersion}`,
          ip: fingerprintData.value?.ip,
          requestId: fingerprintData.value?.requestId,
          payload: JSON.stringify((fingerprintData.value || {}))
        })
      }
    }

    return {
      sendFingerprint
    }
  }

  return {
    sendFingerprint
  }
}
