<script lang="ts" setup>
import type { SponsorAnalyticsFilter, SponsorCode } from '~/types'
import { AUTH } from '~/constants'

const emits = defineEmits<{
  (e: 'search:filters', filters: SponsorAnalyticsFilter): void;
}>()

const { t } = useI18n()
const { me, loading: sponsorCodeLoading }: any = inject(AUTH)
const codes = computed(() => me.value?.sponsorCodes || [])
const codeOptions = computed(() => {
  const newArray = codes.value.map((item: SponsorCode) => ({
    label: item.code,
    value: item.code,
  }))

  return [
    {
      label: t('base.all'),
      value: 'ALL',
    },
    ...newArray,
  ]
})

const sortList = [
  {
    label: t('base.newest'),
    value: 'NEWEST',
  },
  {
    label: t('affiliate.h-wagered'),
    value: 'HIGHEST_WAGERED',
  },
  {
    label: t('affiliate.h-commission'),
    value: 'HIGHEST_COMMISSION',
  },
  {
    label: t('affiliate.h-shared'),
    value: 'HIGHEST_SHARED',
  },
]

const filters = reactive({
  username: '',
  code: 'ALL',
  sortBy: 'NEWEST',
})

const handleSearchInput = useDebounceFn(() => {
  emits('search:filters', filters)
}, 500)
</script>
<template>
  <div class="bg-green-950 rounded-md p-4 md:p-5">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-[15px] md:gap-[30px]">
      <div class="flex flex-col gap-y-2.5">
        <div class="text-white text-sm font-bold">
          {{ t("affiliate.ref-code") }}
        </div>
        <template v-if="sponsorCodeLoading">
          <USkeleton
            class="h-10 bg-brand w-full"
          />
        </template>
        <template v-else-if="codeOptions">
          <USelect
            v-model="filters.code"
            :items="codeOptions"
            :arrow="true"
            class="w-full text-sm h-10 text-white bg-brand! leading-none"
            label-key="label"
            size="lg"
            value-key="value"
            @update:model-value="emits('search:filters', filters)"
          />
        </template>
      </div>
      <div class="flex flex-col gap-y-2.5">
        <div class="text-white text-sm font-bold">
          {{ t("affiliate.sort-by") }}
        </div>
        <USelect
          v-model="filters.sortBy"
          :items="sortList"
          :arrow="true"
          class="w-full text-sm h-10 text-white bg-brand! leading-none"
          label-key="label"
          size="lg"
          value-key="value"
          @update:model-value="emits('search:filters', filters)"
        />
      </div>
      <div class="flex flex-col gap-y-2.5">
        <div class="text-white text-sm font-bold">
          {{ t("affiliate.search-user") }}
        </div>
        <UInput
          v-model="filters.username"
          :placeholder="t('affiliate.search-user')"
          class="w-full text-sm! h-10 ring-0! border-none!"
          color="neutral"
          size="xl"
          type="text"
          :ui="{
            base: 'border-none!'
          }"
          @change="handleSearchInput"
        />
      </div>
    </div>
  </div>
</template>
