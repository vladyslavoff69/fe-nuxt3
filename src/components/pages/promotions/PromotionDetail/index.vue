<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import SkeletonPromotionCard from '~/components/molecules/skeletons/SkeletonPromotionCard.vue'
import MarkDownContent from '~/components/molecules/cms/MarkDownContent.vue'
import TableComponent from '~/components/pages/promotions/PromotionDetail/Table.vue'
import TimeCounter from '~/components/pages/promotions/PromotionDetail/TimeCounter.vue'
import { CALENDAR_ICON } from '~/components/symbols'
import { AUTH, THEME } from '~/constants'
import {
  APPLY_PROMO_CODE_MUTATION,
  JOINING_CAMPAIGNS,
  USER_SUBSCRIBED_CAMPAIGNS_QUERY
} from '~/graphql'

const route = useRoute()
const { t } = useI18n()
const promoId = computed(() => route.params.slug ? String(route.params.slug) : '')
const { screen } = inject(THEME)!
const { isLoggedIn, openAuthModal } = inject(AUTH)!

const {
  promotions: promotionsData,
  loading: promotionsLoading,
  refetchPromotions
} = usePromotions({ promoId: promoId.value, category: null, enabled: null })
const promoDetail = computed(() => promotionsData.value[0])

const {
  result: subscribedResult,
  refetch,
  loading: loadingSubscribes,
  options
} = useQuery(USER_SUBSCRIBED_CAMPAIGNS_QUERY, {}, {
  enabled: isLoggedIn.value
})

const {
  mutate: joinMutate,
  loading: loadJoining,
  onDone: onDoneJoin,
  onError: onErrorJoin,
} = useMutation(JOINING_CAMPAIGNS, { fetchPolicy: 'no-cache' })

onErrorJoin((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: 'Server Error!',
    description: parsedError.message
  })
})

onDoneJoin(() => {
  refetchPromotions()
  refetch()

  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: t('notifications.promotion-join-success')
  })
})

const isSubscribed = computed(() => (subscribedResult.value?.userSubscribedCampaigns || []).find((item: any) => (item.id === promoDetail.value?.id)))
const prizeDistributions = computed(() => (promotionsData.value[0]?.promotion_prizes || []))
const eligibility = computed(() => {
  if (promotionsData.value[0]) {
    return JSON.parse(promotionsData.value[0].eligibility)
  }

  return {}
})

const clickJoin = async () => {
  if (!isLoggedIn.value) {
    openAuthModal()
    return
  }

  if (promoDetail.value) {
    await joinMutate({ promoCampaignId: Number(promoDetail.value?.id) })
  }
}

const playGame = () => {
  if (promoDetail.value?.redirect_url) {
    navigateRoute({
      path: promoDetail.value.redirect_url
    })
  }
}

const form = reactive({ redeemCode: '' })
const rules = { redeemCode: { required } }
const v$ = useVuelidate(rules, form)

const {
  mutate: applyCodeMutate,
  onDone,
  onError,
  loading,
} = useMutation(APPLY_PROMO_CODE_MUTATION, { fetchPolicy: 'no-cache' })

const applyPromo = async () => {
  if (!(await v$.value.$validate()) || loading.value) {
    return
  }

  await applyCodeMutate({
    code: form.redeemCode,
  })
}

onDone(({ data }) => {
  useConfetti()
})

onError(() => {
  useGeneralNotify({
    type: 'error',
    title: 'Server Error!',
    description: t('notifications.code-unusable-message'),
  })
})

const formatScore = (score: number) => {
  if (score % 10 === 1) {
    return `${score}st Place`
  } else if (score % 10 === 2) {
    return `${score}nd Place`
  } else if (score % 10 === 3) {
    return `${score}rd Place`
  } else {
    return `${score}th Place`
  }
}

const isStarted = computed(() => {
  const date1 = new Date(promoDetail.value?.start_date)
  const date2 = new Date()

  return (date2.getTime() - date1.getTime()) > 0
})

const remainTime = ref()
const remainingTime = ref<any>({})

const calculateRemainingTime = (dateTime) => {
  if (!dateTime) {
    remainingTime.value = {}
    return
  }

  const now = new Date()
  const expiration = new Date(dateTime)
  const difference = expiration.getTime() - now.getTime()

  if (difference <= 0) {
    remainingTime.value.is_expired = true
    return
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  remainingTime.value = {
    total: difference,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    days,
    hours,
    minutes,
    seconds
  }
}

watch(() => promoDetail.value, (v) => {
  if (v) {
    calculateRemainingTime(v?.start_date)
    remainTime.value = setInterval(() => {
      calculateRemainingTime(v?.start_date)
    }, 1000)
  }
}, { immediate: true })

watch(() => isLoggedIn.value, (v) => {
  if (v) {
    // @ts-ignore
    options.enabled = true
  }
}, { immediate: true })

const { sendFingerprint } = useSendFingerprint()
onMounted(async () => {
  await sendFingerprint()
})

onBeforeUnmount(() => {
  if (remainTime.value) {
    clearInterval(remainTime.value)
  }
})
</script>

<template>
  <div class="flex flex-col gap-y-4 lg:pb-8 w-full max-w-full xl:max-w-[70%] mx-auto">
    <template v-if="promoDetail && !promotionsLoading && !loadingSubscribes">
      <div class="relative py-4 px-4 sm:py-11 sm:px-12">
        <div class="absolute top-0 left-0 w-full h-full bg-green-950 rounded-md bg-promo-gradient">
          <NuxtImg
            v-if="screen.md"
            :src="`${promoDetail?.cover}/xxl`"
            alt="Cover"
            class="rounded-md h-full ml-auto"
            loading="lazy"
          />
          <NuxtImg
            v-else
            :src="`${promoDetail?.image}/md`"
            alt="Image"
            class="rounded-md h-full ml-auto"
            loading="lazy"
          />
        </div>
        <div class="w-full h-full relative flex flex-col gap-y-4">
          <div>
            <UBadge
              :size="screen.md ? 'xs' : 'sm'"
              class="w-auto text-center bg-disabled-paragraph items-center justify-center gap-x-0.5 tracking-wider rounded-md py-2 px-1"
              color="primary"
              variant="solid"
            >
              <svg class="w-3 h-3 min-w-3 min-h-3 text-white">
                <use :href="CALENDAR_ICON" />
              </svg>
              <span
                class="text-xxs uppercase text-white"
              >
                {{ promoDetail?.time_frame }}
              </span>
            </UBadge>
          </div>
          <div class="flex flex-col gap-y-2 relative">
            <div class="uppercase text-3xl sm:text-5xl font-extrabold leading-none">
              <h1
                class="leading-[90%] w-1/2"
              >
                {{ promoDetail?.name }}
              </h1>
            </div>
            <span
              class="text-lg text-white"
              v-html="promoDetail?.subHeader"
            />
            <div class="w-auto">
              <JButton
                class="w-auto p-2"
                variant="bet-gradient"
              >
                <span class="flex items-center font-extrabold px-0.5 gap-x-1">
                  <span class="uppercase flex flex-col text-xxs xm:text-sm mr-0.5">
                    <span class="leading-1 sm:leading-3">{{ t('promotions.top') }}</span>
                    <span class="leading-1 sm:leading-3">{{ prizeDistributions.length || 1 }}</span>
                  </span>
                  <span
                    class="text-xl sm:text-2xl"
                  >
                    ${{ promoDetail.total_prize }}
                  </span>
                </span>
              </JButton>
            </div>

            <div
              v-if="promoDetail.active && promoDetail.enabled"
              class="flex items-center gap-x-2 justify-end absolute bottom-0 right-0 p-0.5"
            >
              <JButton
                v-if="!isSubscribed"
                :loading="loadingSubscribes || loadJoining"
                button-class="bg-brand"
                class="px-7"
                variant="outline"
                @click="clickJoin"
              >
                {{ t('base.join') }}
              </JButton>
              <JbBlankButton
                v-else
                class="px-4 bg-brand text-white font-bold border! border-primary h-9 rounded-md text-sm cursor-not-allowed"
              >
                {{ t('base.joined') }}
              </JbBlankButton>
              <JButton
                class="px-7"
                variant="bet-gradient"
                @click="playGame"
              >
                {{ t('games.play') }}
              </JButton>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full text-xs font-bold text-white flex-none -mt-2 -mb-2 flex items-center flex-wrap lg:flex-nowrap gap-1">
        <span>Starts: {{ useDateFormat(new Date(promoDetail.start_date), "YYYY/MM/DD, HH:mm A").value }},</span>
        <span class="w-full lg:w-auto">
          Ends: {{ useDateFormat(new Date(promoDetail.end_date), "YYYY/MM/DD, HH:mm A").value }}
        </span>
      </div>
      <div class="flex justify-between sm:items-center flex-col sm:flex-row gap-2 flex-wrap lg:flex-nowrap">
        <TimeCounter
          v-if="promoDetail.active && promoDetail.enabled && isStarted"
          :promo-end-date="promoDetail.end_date"
        />
        <div
          v-else-if="promoDetail.enabled && !isStarted"
          class="text-white text-xs sm:text-sm p-2 sm:p-3 bg-green-950 rounded-md flex items-center gap-x-1"
        >
          <span>This promotion starts in</span>
          <div
            v-if="remainingTime?.total"
            :class="{
              'text-error': (1000 * 60 * 60) > remainingTime.total
            }"
            class="flex items-center gap-x-1 text-sm"
          >
            <span v-if="remainingTime?.days">{{ remainingTime?.days }}d</span>
            <span v-if="remainingTime?.hours">{{ remainingTime?.hours }}h</span>
            <span v-if="remainingTime?.minutes">{{ remainingTime?.minutes }}m</span>
            <span class="inline-block min-w-6">{{ remainingTime?.seconds || 0 }}s</span>
          </div>
        </div>
        <div
          v-else
          class="text-white text-xs sm:text-sm p-2 sm:p-3 bg-green-950 rounded-md"
        >
          This promotion ended on {{ useDateFormat(new Date(promoDetail.end_date), "YYYY/MM/DD, HH:mm A").value }}
        </div>
        <div
          v-if="promoDetail?.promo_code && (promoDetail.active && promoDetail.enabled && isStarted)"
          class="flex flex-col gap-y-0.5 mt-2 w-full md:w-auto"
        >
          <div class="flex items-center gap-x-2">
            <JInput
              v-model="form.redeemCode"
              :classes="{
                Input: 'border bg-green-950 border-border rounded-md px-3 py-2! h-10! text-sm'
              }"
              :placeholder="t('promotions.enter-code')"
              class="w-auto xs:mt-0 sm:max-w-48"
            >
              <template #startIcon>
                <UIcon
                  class="w-5 h-4"
                  name="heroicons:tag-20-solid"
                />
              </template>
            </JInput>
            <JButton
              class="h-10 px-6"
              variant="outline"
              @click="applyPromo"
            >
              {{ t('base.claim') }}
            </JButton>
          </div>
          <JbInputMessage v-if="v$.redeemCode.$error">
            {{ t('errors.PROMO_CODE_REQUIRED') }}
          </JbInputMessage>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-y-9">
        <ClientOnly>
          <TableComponent
            :ended="!(promoDetail.active && promoDetail.enabled && isStarted)"
            :promo-detail="promoDetail"
            :promo-id="(promoDetail?.id ? Number(promoDetail?.id) : 0)"
          />
        </ClientOnly>

        <div class="flex flex-col gap-y-5 text-sm">
          <h1
            class="text-lg font-bold leading-6"
            v-html="promoDetail?.caption"
          />
          <ClientOnly>
            <MarkDownContent
              :content="promoDetail.description"
            />
          </ClientOnly>
          <h1
            class="text-lg font-bold leading-6"
          >
            {{ t('promotions.prize-distribution') }}:
          </h1>
          <ul class="list-disc text-white pl-4">
            <li
              v-for="(distribution, idx) in prizeDistributions"
              :key="idx"
            >
              <span class="font-bold mr-1">{{ formatScore(Number(distribution.position)) }}:</span>
              <span class="text-paragraph">${{ distribution.prize }}</span>
            </li>
          </ul>
          <h1
            class="text-lg font-bold leading-6"
          >
            {{ t('promotions.additional-details') }}:
          </h1>
          <ul class="list-disc text-white pl-4">
            <li
              v-for="(label, key) of eligibility"
              :key="key"
            >
              <span class="font-bold mr-1">{{ key }}:</span>
              <span class="text-paragraph">{{ label }}</span>
            </li>
          </ul>
          <NuxtLinkLocale
            v-if="promoDetail.button"
            :to="promoDetail.button?.link"
          >
            <JButton
              class="px-6"
              variant="bet-gradient"
            >
              <span>{{ promoDetail?.button?.label || '' }}</span>
            </JButton>
          </NuxtLinkLocale>
        </div>
      </div>
    </template>
    <SkeletonPromotionCard
      v-else
      class="w-full!"
    />
  </div>
</template>
