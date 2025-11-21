<script lang="ts" setup>
import { ON_AIR_ICON } from '~/components/symbols'
import { CHARITY_INSTITUTION_SUBSCRIBE, CHARITY_INSTITUTION_UNSUBSCRIBE } from '~/graphql'
import { AUTH, PREFERENCE, THEME } from '~/constants'
import SendDonationModal from '~/components/pages/players-charity/detail/SendDonationModal.vue'

const { t } = useI18n()
const route = useRoute()
const { charityDetail, charityName } = defineProps<{
  charityDetail: any,
  charityName?: string
}>()
const { isLoggedIn, me }: any = inject(AUTH)!
const { currentCharity, currentCharityRefetch, activeCryptoCode } = inject(PREFERENCE)!
const { screen } = inject(THEME)!
const charityId = Number(route.params.slug)
const showDonationModal = ref<boolean>(false)
const currentCharityId = computed(() => Number(currentCharity.value?.charityInstitution?.id))
const mouseEnterShow = ref<boolean>(false)

const handleMouseEnter = () => {
  mouseEnterShow.value = true
}

const handleMouseLeave = () => {
  mouseEnterShow.value = false
}

const openDonationModal = () => {
  showDonationModal.value = true
  navigateRoute({
    newQueries: {
      currency: activeCryptoCode.value,
    }
  })
}

const closeDonationModal = () => {
  navigateRoute({
    oldQueries: [
      'currency',
    ]
  })
  showDonationModal.value = false
}

const {
  mutate: subscribeMutate,
  loading: subscribeLoading,
  onDone: subscribeDone,
  onError: subscribeError,
} = useMutation(CHARITY_INSTITUTION_SUBSCRIBE)

const {
  mutate: unsubscribeMutate,
  loading: unsubscribeLoading,
  onDone: unsubscribeDone,
  onError: unsubscribeError,
} = useMutation(CHARITY_INSTITUTION_UNSUBSCRIBE)

const onClickSelect = async () => {
  if (currentCharityId.value) {
    await unsubscribeMutate({
      charityInstitutionId: Number(currentCharityId.value)
    })
  } else {
    await subscribeMutate({
      charityInstitutionId: Number(charityId)
    })
  }
}
subscribeDone(() => {
  currentCharityRefetch()
  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: t('notifications.subscription-success')
  })
})
subscribeError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

unsubscribeDone(() => {
  subscribeMutate({
    charityInstitutionId: Number(charityId)
  })
})

unsubscribeError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

</script>

<template>
  <div
    class="
    flex flex-col xl:flex-row xl:items-center justify-between
    p-4 sm:px-8 sm:py-6
    bg-green-950
    gap-y-4 xl:gap-y-0
    rounded
   "
  >
    <div class="flex gap-x-4 sm:gap-x-6">
      <div class="bg-white rounded-md">
        <NuxtImg
          v-if="charityDetail.image"
          :src="charityDetail.image"
          alt="Curriculum"
          class="w-auto h-16 min-w-32 min-h-16 rounded-md"
          loading="lazy"
        />
      </div>
      <div class="max-w-lg truncate flex flex-col justify-center gap-y-2">
        <h2 class="text-xxl md:text-2xl font-bold leading-9! truncate grid grid-cols-1 normal-case">
          {{ charityName }}
          <span class="text-sm leading-1! text-paragraph">
            {{ charityDetail?.short_description }}
          </span>
        </h2>
        <div class="flex items-center flex-wrap text-base md:text-xxl text-paragraph leading-normal truncate gap-x-1">
          <UBadge
            v-for="(country, idx) in charityDetail?.countries"
            :key="idx"
            :size="screen.md ? 'xs' : 'sm'"
            class="w-auto text-center text-xxs font-bold uppercase bg-disabled-paragraph py-0 px-3 h-5 rounded-full"
            color="primary"
            variant="solid"
          >
            <span class="text-3xs xs:text-xxs font-bold tracking-card-chip text-white uppercase leading-none py-0.5">
              {{ country?.iso3 }}
            </span>
          </UBadge>
        </div>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row sm:items-center gap-y-4">
      <div class="flex items-center justify-center">
        <div class="px-6 border-r border-r-border">
          <h4 class="text-base sm:text-xl text-white font-bold leading-6 sm:leading-8 text-center">
            {{ charityDetail?.usersDonated || 0 }}
          </h4>
          <div class="">
            <span class="text-sm leading-5 sm:leading-6 font-bold">{{ t('charity.users-donated') }}</span>
          </div>
        </div>
        <div class="px-6">
          <h4 class="text-base sm:text-xl text-white font-bold leading-6 sm:leading-8 text-center">
            {{ charityDetail?.totalDonations ? charityDetail?.totalDonations : `$0` }}
          </h4>
          <div class="flex items-center justify-center gap-x-2">
            <svg
              class="w-4 h-4 min-w-4 min-h-4 sm:w-5 sm:h-5 text-red-600"
            >
              <use :href="ON_AIR_ICON" />
            </svg>
            <span class="text-sm leading-5 sm:leading-6 font-bold">{{ t('charity.donations') }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-x-2">
        <JButton
          v-if="currentCharityId === charityId"
          class="py-2 px-4 w-full sm:w-32"
          variant="bet-gradient"
        >
          <span class="text-sm font-bold">{{ t('base.selected') }}</span>
        </JButton>
        <JButton
          v-else
          :loading="subscribeLoading || unsubscribeLoading"
          class="py-2 px-4 w-full sm:w-32 bg-brand"
          variant="outline"
          @click="onClickSelect"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <span
            class="text-xs sm:text-sm font-bold transition-all ease-in duration-100"
          >{{ t('charity.select-charity') }}</span>
        </JButton>
        <JButton
          v-if="currentCharityId === charityId"
          class="py-2 px-4 w-full sm:w-auto bg-brand"
          variant="outline"
          @click="openDonationModal"
        >
          <span class="text-sm">{{ t('charity.send-donation') }}</span>
        </JButton>
      </div>
    </div>

    <SendDonationModal
      v-if="showDonationModal && isLoggedIn && !!me"
      :charity-id="charityId"
      :modal-visible="showDonationModal"
      @close:donation-modal="closeDonationModal"
    />
  </div>
</template>
