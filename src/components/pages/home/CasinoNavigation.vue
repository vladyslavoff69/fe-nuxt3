<script lang="ts" setup>
import type { Tab as TabItemType } from '~/atoms/types/tabs'
import SearchPopper from '~/apps/casino/components/details/SearchPopper.vue'
import {
  FEATURED_SLOTS_ICON,
  JUNGLEBET_ORIGINALS_ICON,
  LIVE_CASINO_ICON,
  NEWEST_ICON,
} from '~/components/symbols'

const props = defineProps<{
  selTab?: string;
}>()

const emits = defineEmits<{
  (e: 'selHomeTab', value: string): void;
}>()

const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!
const forcePromo = runtimeConfig.public.forcePromo
const forcePromoCode = runtimeConfig.public.forcePromoCode
const homeUrl = `${redirectHome}${forcePromo ? '?promo=' + forcePromoCode : ''}`

const selectedTab = computed({
  get () {
    return props.selTab || router.currentRoute.value.path || localePath(homeUrl)
  },
  set (v) {
    if (v === localePath('/')) {
      emits('selHomeTab', v)
    } else {
      router.push({
        path: v,
      })
    }
  },
})

const tabs = computed<TabItemType[]>(() => [
  {
    label: t('casino.lobby'),
    value: localePath('/'),
    icon: 'ion:list-sharp',
    iconType: 'ui'
  },
  {
    label: t('casino.originals'),
    value: localePath('/casino/home/junglebet'),
    icon: JUNGLEBET_ORIGINALS_ICON,
  },
  {
    label: t('casino.new-releases'),
    value: localePath('/casino/home/new-releases'),
    icon: NEWEST_ICON,
  },
  {
    label: t('casino.slots'),
    value: localePath('/casino/home/slots'),
    icon: FEATURED_SLOTS_ICON,
  },
  {
    label: t('casino.live-casino'),
    value: localePath('/casino/home/live-casino'),
    icon: LIVE_CASINO_ICON,
  }
])

const handleLinkClick = (v: string) => {
  selectedTab.value = v
}
</script>

<template>
  <div
    class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 w-full relative"
  >
    <JTabs
      v-model="selectedTab"
      :tabs="tabs"
      class="w-full lg:w-auto"
      width="auto"
      @update:model-value="(v) => handleLinkClick(v)"
    />

    <SearchPopper class="flex-1 max-w-sm" />
  </div>
</template>
