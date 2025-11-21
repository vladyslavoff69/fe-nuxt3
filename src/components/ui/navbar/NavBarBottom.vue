<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import { NAV_ITEMS } from '~/constants/navigations-config'
import type { MenuItem } from '~/types'
import { AUTH, SITE_SETTINGS, THEME } from '~/constants'

const { isOpen } = defineProps<{
  isOpen: boolean
}>()

const emits = defineEmits<{
  (e: 'openChartDrawer'): void;
  (e: 'openMobileSidebarPanel', value: boolean): void;
}>()

const { t } = useI18n()
const { isSidebarOpen, selectedMenuPath, selectedNavItem } = inject(SITE_SETTINGS)!
const { isLoggedIn, openAuthModal } = inject(AUTH)!
const { screen } = inject(THEME)!
const localePath = useLocalePath()
const navItemClass = 'w-full max-w-20 h-16 flex flex-col justify-center items-center hover:bg-border hover:text-white'

const clickNavItem = (item: MenuItem) => {
  selectedMenuPath.value = item.url || ''
  selectedNavItem.value = item.key || ''

  if (item.type === 'link') {
    if (!isLoggedIn.value) {
      if (item.key === 'games.my-bets') {
        openAuthModal()
        return
      }
    }

    navigateTo(localePath(item.url || '/'))
    emits('openMobileSidebarPanel', false)
  } else if (item.key === 'menu.menu' && item.type === 'sidebar') {
    emits('openMobileSidebarPanel', !isOpen)
    isSidebarOpen.value = !isOpen
  } else if (item.key === 'menu.chat') {
    if (isLoggedIn.value) {
      emits('openChartDrawer')
    } else {
      openAuthModal()
    }
  }
}
</script>

<template>
  <UContainer
    v-if="!screen.md"
    class="flex-auto w-full flex items-center justify-center px-0 pb-0 z-1 bg-green-950 sticky bottom-0"
  >
    <ul
      class="
        w-full xl:max-w-(--breakpoint-xl) text-xs font-bold list-none
        flex items-center justify-between relative
      "
    >
      <li
        v-for="(navItem, nInd) in NAV_ITEMS"
        :key="`${navItem.key}_${nInd}`"
        class="w-1/5 min-w-1/5 max-w-1/5"
        :class="[
          navItemClass,
          {
            'bg-transparent text-paragraph': selectedNavItem !== navItem?.key,
            'bg-border text-white': selectedNavItem === navItem?.key,
          }
        ]"
        @click="clickNavItem(navItem)"
      >
        <template v-if="navItem.key === 'menu.menu' && isOpen">
          <CloseButton class="w-[16px] h-[16px] min-w-[16px] min-h-[16px] mb-[2px] text-paragraph" />
        </template>
        <template v-else>
          <UIcon
            v-if="navItem?.iconType && navItem.iconType === 'ui'"
            :name="navItem?.icon || ''"
            class="w-5 h-5 min-w-5 min-h-5"
            :class="[
              navItem?.iconClass
            ]"
          />
          <svg
            v-else-if="navItem?.iconType && navItem.iconType === 'icon'"
            class="w-[19px] h-[19px] min-w-[19px] min-h-[19px]"
            :class="[
              navItem?.iconClass
            ]"
          >
            <use :href="navItem?.icon" />
          </svg>
        </template>
        {{ t(navItem.key) }}
      </li>
    </ul>
  </UContainer>
</template>
