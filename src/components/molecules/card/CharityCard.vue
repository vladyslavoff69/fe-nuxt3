<script lang="ts" setup>
import { CHARITY_INSTITUTION_SUBSCRIBE, CHARITY_INSTITUTION_UNSUBSCRIBE } from '~/graphql'
import type { Charity } from '~/types/charity'
import { AUTH } from '~/constants'

const { t } = useI18n()
const { charity, currentCharityId } = defineProps<{ charity: Charity, currentCharityId?: number }>()
const emits = defineEmits<{
  (e: 'update:subscribe', value: number): void;
}>()

const { isLoggedIn, openAuthModal } = inject(AUTH)!
const mouseEnterShow = ref<boolean>(false)
const isSelected = computed(() => currentCharityId === charity.id)
const handleMouseEnter = () => {
  mouseEnterShow.value = true
}

const handleMouseLeave = () => {
  mouseEnterShow.value = false
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

const onClickSelect = async (e) => {
  e.stopPropagation()
  if (!isLoggedIn.value) {
    openAuthModal()

    return
  }

  if (currentCharityId) {
    await unsubscribeMutate({
      charityInstitutionId: Number(currentCharityId)
    })
  } else {
    await subscribeMutate({
      charityInstitutionId: Number(charity.id)
    })
  }
}

subscribeDone(() => {
  emits('update:subscribe', Number(charity.id))
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
    charityInstitutionId: Number(charity.id)
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

const onClickCharityCard = () => {
  navigateRoute({
    path: `/players-charity/${charity.id}`
  })
}
</script>

<template>
  <div
    class="w-full flex flex-col gap-y-1 max-w-44 sm:max-w-52"
    @click="onClickCharityCard"
  >
    <h2 class="text-sm font-bold leading-5 w-full truncate">
      {{ charity?.name }}
    </h2>
    <div class="w-full grid gap-y-3 bg-green-950 p-2 sm:p-3 rounded-md">
      <div class="w-full flex items-center justify-center">
        <NuxtImg
          :src="charity?.image"
          alt="Curriculum"
          class="w-full rounded-md"
          loading="lazy"
        />
      </div>
      <div class="flex">
        <div class="flex flex-1 flex-col">
          <h3 class="text-xs sm:text-sm text-paragraph leading-4 sm:leading-5 font-bold">
            {{ t('charity.donations') }}
          </h3>
          <div class="text-sm sm:text-lg text-white font-bold leading-5 sm:leading-7">
            {{ charity.totalDonations }}
          </div>
        </div>
        <div
          v-if="charity.totalPlayers"
          class="flex-1 flex flex-col justify-end border-l border-l-border"
        >
          <h3 class="text-xs sm:text-sm text-paragraph leading-4 sm:leading-5 text-right font-bold">
            {{ t('charity.total-votes') }}
          </h3>
          <div class="flex items-center justify-end gap-x-2">
            <div class="text-sm sm:text-lg text-white font-bold leading-5 sm:leading-7">
              {{ charity.totalPlayers }}
            </div>
            <div class="flex -space-x-3 rtl:space-x-reverse">
              <template
                v-for="i in charity?.playersImage"
                :key="`chc-1-${i}`"
              >
                <template v-if="charity.playersImage && charity.playersImage[i]">
                  <NuxtImg
                    :src="charity?.playersImage[i]"
                    class="h-6 w-6 min-w-6 min-h-6"
                    loading="lazy"
                    alt="Junglebet.com"
                  />
                </template>
                <template v-else>
                  <UIcon
                    class="h-6 w-6 min-w-6 min-h-6"
                    name="heroicons:user-circle-20-solid"
                  />
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <JButton
          v-if="isSelected"
          class="w-full"
          variant="bet-gradient"
        >
          <span class="text-xs sm:text-sm font-bold">
            {{ t('base.selected') }}
          </span>
        </JButton>
        <JButton
          v-else
          :loading="subscribeLoading || unsubscribeLoading"
          class="w-full bg-brand"
          variant="outline"
          @click="onClickSelect"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <span
            :class="[
              mouseEnterShow ? 'visible' : 'hidden'
            ]"
            class="text-xs sm:text-sm font-bold transition-all ease-in duration-100"
          >
            {{ t('charity.select-the-charity') }}
          </span>
          <span
            :class="[
              !mouseEnterShow ? 'visible' : 'hidden'
            ]"
            class="text-xs sm:text-sm font-bold transition-all ease-in duration-100"
          >
            {{ t('base.select') }}
          </span>
        </JButton>
      </div>
    </div>
  </div>
</template>
