<script lang="ts" setup>
import TopBanner from '~/components/pages/players-charity/explore/details/TopBanner.vue'
import Content from '~/components/pages/players-charity/explore/details/Content.vue'
import SliderNavButtonGroup from '~/components/molecules/slide/SliderNavButtonGroup.vue'
import { SITE_SETTINGS, THEME } from '~/constants'
import { CHARITY_DETAILS_QUERY } from '~/graphql'

const { t } = useI18n()
const route = useRoute()
const { charities } = inject(SITE_SETTINGS)!
const { screen } = inject(THEME)!
const charityId = Number(route.params.slug)
const selectedCharityId = ref(charityId)
const navigateCharity = (direction: string) => {
  const charityIdx = charities.value?.findIndex(item => item.id === charityId)
  if (charityIdx > -1) {
    if (direction === 'prev') {
      navigateRoute({
        path: `/players-charity/${charities.value[charityIdx - 1].id}`
      })
    } else {
      navigateRoute({
        path: `/players-charity/${charities.value[charityIdx + 1].id}`
      })
    }
  } else {
    navigateRoute({
      path: `/players-charity/${charities.value[0].id}`
    })
  }
}
const disabledPrev = computed(() => {
  if (charities.value.length > 0) {
    const charityIdx = charities.value?.findIndex(item => item.id === charityId)
    return !charities.value[charityIdx - 1]
  }
  return false
})

const disabledNext = computed(() => {
  if (charities.value.length > 0) {
    const charityIdx = charities.value?.findIndex(item => item.id === charityId)
    return !charities.value[charityIdx + 1]
  }
  return false
})

const {
  result: charityDetailResult,
  load: loadCharityDetail,
  loading
} = useLazyQuery(
  CHARITY_DETAILS_QUERY,
  {
    id: charityId
  },
  {
    errorPolicy: (import.meta.server ? 'ignore' as const : 'all' as const),
    notifyOnNetworkStatusChange: true,
  }
)

const detailData = computed(() => {
  return charityDetailResult.value?.charityDetails || {}
})

watch(
  () => selectedCharityId.value,
  (_selectedCharityId) => {
    navigateRoute({
      path: `/players-charity/${_selectedCharityId}`
    })
  }
)

const charityName = computed(() => {
  const splittedWords = detailData.value?.name?.split(' ')
  if (screen.value.md || !(splittedWords && splittedWords?.length > 1)) {
    return detailData.value?.name
  }
  return splittedWords?.map(word => word[0])
    .join('')
})

const { sendFingerprint } = useSendFingerprint()
onMounted(async () => {
  loadCharityDetail()
  await sendFingerprint()
})
</script>

<template>
  <div class="flex flex-col gap-y-3 sm:gap-y-14">
    <div class="grid grid-cols-1 gap-y-2">
      <div class="flex items-center gap-x-2">
        <SliderNavButtonGroup
          :disabled-next="disabledNext"
          :disabled-prev="disabledPrev"
          @click:prev="navigateCharity('prev')"
          @click:next="navigateCharity('next')"
        />
        <JSelect
          v-model="selectedCharityId"
          :classes="{
            ListboxButton: 'w-auto rounded-md text-xs font-bold px-3 pr-1 capitalize',
            LabelOptLabel: 'normal-case',
            ListboxOptions: 'w-auto pr-2',
            Placeholder: 'text-xs normal-case',
          }"
          :options="charities"
          :placeholder="t('charity.select-the-charity')"
          class="max-w-sm"
          option-attribute="name"
          value-attribute="id"
        />
      </div>
      <TopBanner
        v-if="!loading"
        :charity-detail="detailData"
        :charity-name="charityName || ''"
      />
    </div>
    <ClientOnly>
      <Content
        :contents="detailData?.description ?? []"
      />
    </ClientOnly>
  </div>
</template>
