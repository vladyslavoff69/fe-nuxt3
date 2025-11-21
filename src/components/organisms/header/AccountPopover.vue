<script lang="ts" setup>
import DropdownMenuItem from '~/components/molecules/menu/DropdownMenuItem.vue'
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import { AUTH } from '~/constants'
import { ACCOUNT_DROPDOWN } from '~/constants/navigations-config'
import type { MenuItem } from '~/types'
// import AccountProgressSlider from '~/components/organisms/header/AccountProgressSlider.vue'

const { t } = useI18n()
const { me } = inject(AUTH)!
const localePath = useLocalePath()
const { loading, logout } = useLogout()
const { toggleChat } = useCrisp()
const codes = computed(() => me.value?.sponsorCodes || [])
const onClickMenuItem = (menuItem: MenuItem) => {
  if (menuItem.type === 'link') {
    navigateTo(localePath(menuItem?.url || ''))
  } else if (menuItem.type === 'modal') {
    if (menuItem.key === 'menu.my-stats' || menuItem.key === 'profile.my-profile') {
      navigateRoute({
        newQueries: {
          name: me.value?.username,
          modal: 'user',
        }
      })
    } else if (menuItem.key === 'menu.my-vip') {
      navigateRoute({
        newQueries: {
          tab: 'rank',
          modal: 'vip',
        }
      })
    } else if (menuItem.key === 'menu.help-support') {
      toggleChat()
    }
  }
}

const accountMenus = computed(() => {
  const _menus = ACCOUNT_DROPDOWN
  const affiliateLink = _menus.filter(item => item.key === 'menu.affiliate')[0]
  if (affiliateLink) {
    if (codes.value?.length > 0) {
      affiliateLink.url = '/affiliate/overview'
    }
  }

  return _menus
})
</script>

<template>
  <JDropPopup
    menu-items-placement="right-0 sm:left-0"
  >
    <template #trigger>
      <div
        class="
          flex items-center bg-brand text-sm leading-none lg:p-1
          rounded-full cursor-pointer hover:text-white gap-x-2 min-h-8 min-w-8 md:min-w-10 md:min-h-10
        "
      >
        <VipRankImg
          :vip-level-name="me?.vip_level_name"
          class="rounded-full w-8 h-8 min-h-8 min-w-8"
        />
        <span class="hidden md:block font-bold">
          {{ me?.username }}
        </span>
        <div class="w-px hidden md:block" />
      </div>
    </template>

    <template #menuItems>
      <div class="px-1 py-1 text-sm lg:text-base leading-none">
        <DropdownMenuItem
          v-for="(aItem, aInd) in accountMenus"
          :key="`${aItem.key}_${aInd}-hey-14`"
          @click="onClickMenuItem(aItem)"
        >
          <template #startIcon>
            <UIcon
              v-if="aItem.iconType === 'ui'"
              :name="aItem.icon"
              class="h-4 w-4 min-w-4 min-h-4"
            />
            <svg
              v-else
              class="h-4 w-4 min-w-4 min-h-4"
            >
              <use :href="aItem.icon" />
            </svg>
          </template>
          <template #label>
            {{ t(aItem.key) }}
          </template>
        </DropdownMenuItem>
        <div class="w-full px-2 mt-1">
          <div class="bg-border w-full h-px" />
        </div>
        <DropdownMenuItem
          :loading="loading"
          @click="logout"
        >
          <template #startIcon>
            <UIcon
              class="h-4 w-4 min-w-4 min-h-4"
              name="heroicons:arrow-right-on-rectangle-20-solid"
            />
          </template>
          <template #label>
            {{ t('auth.logout') }}
          </template>
        </DropdownMenuItem>

        <!--        <AccountProgressSlider />-->
      </div>
    </template>
  </JDropPopup>
</template>
