<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import CharityCard from '~/components/molecules/card/CharityCard.vue'
import SkeletonCharityCard from '~/components/molecules/skeletons/SkeletonCharityCard.vue'
import { usePlayerCharities } from '~/composables/charity'
import SliderNavButtonGroup from '~/components/molecules/slide/SliderNavButtonGroup.vue'
import SearchInput from '~/components/molecules/inputs/SearchInput.vue'

import { CHARITY_CATEGORIES } from '~/graphql'
import { PREFERENCE } from '~/constants'
import { charitiesIcon } from '~/components/symbols'

const { container, swiper, slidesPerView, onSwiper, init, destroy, onSlideChange } = useSwiperCards({
  default: 180,
  md: 180,
  lg: 224,
  spaceBetween: 8
})

const { t } = useI18n()
const category = ref('')
const loading = ref(true)
const searchWord = ref('')
const { currentCharity, currentCharityRefetch } = inject(PREFERENCE)!
const currentCharityId = ref(currentCharity.value?.charityInstitution?.id)

watch(
  () => currentCharity.value?.charityInstitution?.id,
  (_newCurrentCharityId) => {
    currentCharityId.value = _newCurrentCharityId
  }
)

const {
  result: categoriesResult,
  load: loadCategories,
} = useLazyQuery(
  CHARITY_CATEGORIES,
  {
    first: 100
  }
)

const searchOptions = computed(() => {
  const _options: any = {
    limit: 10
  }

  if (searchWord.value) {
    _options.name = searchWord.value
  }

  if (category.value && category.value !== '') {
    _options.category = category.value
  }

  return _options
})

const {
  charitiesLoading,
  refetchCharities,
  loadCharities,
  charities: initialCharities
} = usePlayerCharities(searchOptions.value)

onMounted(() => {
  init()
  loadCategories()
  loadCharities()
  loading.value = false
})

onBeforeUnmount(() => {
  destroy()
})

watch(
  () => [category.value, searchWord.value],
  ([_category, _name]: any) => {
    refetchCharities({
      ...searchOptions.value
    })
  },
  { immediate: true }
)

const formattedCategories = computed(() => {
  if (categoriesResult.value?.charityCategories) {
    return categoriesResult.value?.charityCategories?.data?.map(item => ({
      label: item?.name?.split('-').join(' '),
      value: item?.name
    }))
  }

  return []
})

const charities = computed(() => {
  const _charities = [...initialCharities.value]
  const _currentCharityId = Number(currentCharityId.value)
  if (_currentCharityId > 0) {
    return _charities.sort((a, b) => {
      if (a.id === _currentCharityId) {
        return -1
      }
      if (b.id === _currentCharityId) {
        return 1
      }
      return 0
    })
  }

  return initialCharities.value
})
</script>

<template>
  <div
    ref="container"
    class="flex flex-col gap-y-6 sm:gap-y-[25px]"
  >
    <div
      class="w-full flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between mr-0 sm:mr-2 relative"
    >
      <div
        class="
          w-full sm:w-auto
          flex sm:flex-none
          items-start sm:items-center
          flex-col sm:flex-row
          justify-between flex-1
        "
      >
        <div class="mb-0.5 sm:mb-0 flex items-center gap-x-2">
          <svg class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6">
            <use :href="charitiesIcon" />
          </svg>
          <span
            class="text-white text-2xl sm:text-3xl font-bold leading-8 sm:leading-10 mr-1 sm:mr-6"
          >
            {{ t('charity.the-charities') }}
          </span>
        </div>
      </div>
      <div class="flex w-full sm:w-auto gap-x-2">
        <div class="flex-1 sm:flex-none mt-2 sm:mt-0">
          <SearchInput
            v-model="searchWord"
            class="w-auto mt-2 xs:mt-0"
          />
        </div>
        <div class="absolute sm:static -top-[2px] right-0 flex items-center gap-x-2">
          <JSelect
            v-model="category"
            :classes="{
              ListboxButton: `
                w-full
                w-24 sm:w-28
                ml-auto
                rounded
                text-xs
                font-bold
                px-3 pr-1
                capitalize
              `,
              ListboxOptions: 'min-w-24 sm:min-w-52 w-full',
              Placeholder: 'text-xs',
            }"
            :has-check-box="false"
            :options="formattedCategories"
            :placeholder="t('games.category')"
          />
          <div
            :class="{
            }"
            class="hidden lg:flex gap-x-2"
          >
            <SliderNavButtonGroup
              :disabled-next="charities?.length < 2"
              :disabled-prev="charities?.length < 2"
              @click:prev="swiper?.slidePrev()"
              @click:next="swiper?.slideNext()"
            />
          </div>
        </div>
      </div>
    </div>

    <ClientOnly>
      <Swiper
        :free-mode="true"
        :navigation="true"
        :slides-per-view="slidesPerView"
        :space-between="8"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <template v-if="charitiesLoading">
          <SwiperSlide
            v-for="idx in 8"
            :key="`key-${idx}-hey-a-5`"
          >
            <SkeletonCharityCard
              class="flex-none block w-full"
              width="'100%'"
            />
          </SwiperSlide>
        </template>
        <template v-else-if="charities?.length > 0">
          <SwiperSlide
            v-for="charity in charities"
            :key="`${charity.id}_${currentCharityId}-why-1`"
          >
            <CharityCard
              :charity="charity"
              :current-charity-id="Number(currentCharityId)"
              class="flex-none block w-full"
              @update:subscribe="(_val) => {
                currentCharityId = _val
                currentCharityRefetch()
              }"
            />
          </SwiperSlide>
        </template>
        <template v-else>
          <div class="text-paragraph text-xs">
            {{ t('charity.no-registered-charities') }}
          </div>
        </template>
      </Swiper>
    </ClientOnly>
  </div>
</template>
