<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import VipRankUp from '~/apps/vip-program/components/dashboard/VipRankUp.vue'
import VipRakeback from '~/apps/vip-program/components/dashboard/VipRakeback.vue'
import VipReload from '~/apps/vip-program/components/dashboard/VipReload.vue'
import VipWeekly from '~/apps/vip-program/components/dashboard/VipWeekly.vue'
import VipDailySpin from '~/apps/vip-program/components/dashboard/VipDailySpin.vue'

const emits = defineEmits<{
  (e: 'close:modal', value: boolean): void;
}>()

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { sendFingerprint } = useSendFingerprint()
const tabs = computed(() => ([
  {
    value: 'rank',
    label: t('vip.rank'),
  },
  {
    value: 'rakeback',
    label: t('vip.rake'),
  },
  {
    value: 'drip',
    label: t('vip.drip'),
  },
  {
    value: 'dailySpin',
    label: 'Daily Spin',
  },
  {
    value: 'weekly',
    label: t('vip.weekly'),
  },
]))

const selectedTab = computed({
  get() {
    return route.query.tab ? String(route.query.tab) : ''
  },
  set(v) {
    router.push({
      path: router.currentRoute.value.path,
      query: { ...route.query, tab: v }
    })
  }
})

const onCloseModal = () => {
  emits('close:modal', true)
}

onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div class="w-full h-full p-0 m-0">
    <div class="px-4 py-2.5 flex justify-between items-center w-full bg-green-950">
      <div
        class="text-base text-white gap-2 font-bold flex items-center"
      >
        <UIcon
          class="w-5 h-5 cursor-pointer text-white"
          name="mdi:crown"
        />
        <span>{{ t("vip.vip") }}</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div class="p-3 md:p-4 flex flex-col gap-4">
      <JTabs
        v-model="selectedTab"
        :tabs="tabs"
        tab-container-class="sm:flex-1"
        width="100%"
      />
      <VipRankUp v-if="selectedTab === 'rank'" />
      <VipRakeback
        v-if="selectedTab === 'rakeback'"
        :hide-head="true"
        :hide-zero-value="true"
      />
      <VipReload
        v-if="selectedTab === 'drip'"
        :hide-head="true"
      />
      <VipWeekly
        v-if="selectedTab === 'weekly'"
        :hide-head="true"
      />
      <VipDailySpin
        v-if="selectedTab === 'dailySpin'"
        :hide-head="true"
        @close:modal="onCloseModal"
      />
    </div>
  </div>
</template>
