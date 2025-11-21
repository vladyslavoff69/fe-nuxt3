<script lang="ts" setup>
import type { Tab } from '~/atoms/types/tabs'
import { BETS_TICKET_ICON, HOME_CROWN_ICON } from '~/components/symbols'
import MyBetsTable from '~/apps/casino/components/MyBetsTable.vue'
import HighRollersTable from '~/components/pages/home/table/HighRollersTable.vue'
import { AUTH } from '~/constants'

const { isLoggedIn } = inject(AUTH)!
const { t } = useI18n()
const route = useRoute()

const tabs = computed<Tab[]>(() => [
  { label: t('games.high-rollers'), value: 'HIGH_ROLLERS', icon: HOME_CROWN_ICON, iconClass: 'relative bottom-px' },
])

const authTabs = computed<Tab[]>(() => [
  { label: t('games.my-bets'), value: 'MY_BETS', icon: BETS_TICKET_ICON },
  ...tabs.value,
])

const selTab = computed(() => route.params.feedTab ? String(route.params.feedTab) : 'HIGH_ROLLERS')
const feedTabs = ref<Tab[]>(tabs.value)
const currentTab = ref(selTab.value || 'HIGH_ROLLERS')
const countPerPage = ref(10)

watch(() => isLoggedIn.value, (v) => {
  feedTabs.value = (v ? authTabs.value : tabs.value)
  currentTab.value = (v ? 'MY_BETS' : 'HIGH_ROLLERS')
}, { immediate: true })
</script>

<template>
  <UPage class="w-full pt-8 md:pt-10 pl-1.5 pr-2.5 md:pl-0 md:pr-0">
    <div class="bg-brand grid gap-y-1 md:gap-y-4">
      <div class="w-full flex flex-row md:justify-between md:items-center gap-x-2 md:gap-x-0 gap-y-1">
        <JTabs
          v-model="currentTab"
          :tabs="feedTabs"
          class="flex-1"
        />
        <div class="md:max-w-[100px]">
          <JSelect
            v-model="countPerPage"
            :classes="{
              ListboxButton: 'bg-green-950 w-full h-10 py-2 px-2.5 pr-1! font-bold text-paragraph',
              Placeholder: 'text-xs',
              LabelOptLabel: 'text-xs'
            }"
            :has-check-box="false"
            :options="[
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
            ]"
            class="ml-2"
          />
        </div>
      </div>

      <HighRollersTable
        v-if="currentTab === 'HIGH_ROLLERS'"
        :count-per-page="countPerPage"
        type="CASINO"
      />
      <MyBetsTable
        v-else-if="currentTab === 'MY_BETS'"
        :count-per-page="countPerPage"
        type="CASINO"
      />
    </div>
  </UPage>
</template>
