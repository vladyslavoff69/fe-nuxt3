<script lang="ts" setup>
import LinkGroup from '~/components/molecules/menu/LinkGroup.vue'
import { ROUTES } from '~/constants/navigations-config'
import LanguageDropdown from '~/components/molecules/menu/LanguageDropdown.vue'
import type { MenuItem } from '~/types'
import { AUTH, SITE_SETTINGS } from '~/constants'

const emit = defineEmits(['update:linkValue'])

const { t } = useI18n()
const { me, isLoggedIn } = inject(AUTH)!
const { selectedMenuPath, isSidebarOpen, isMobileSidebarOpen, charities } = inject(SITE_SETTINGS)!
const { toggleChat } = useCrisp()
const codes = computed(() => me.value?.sponsorCodes || [])
const sponsorAffiliates = computed(() => me.value?.total_affiliates || 0)
const showLabels = ref(true)

const computedRoutes = computed<MenuItem[]>(() => {
  const _routes = ROUTES

  const charityGroup = _routes.filter(item => item.key === 'home.players-charity')[0]
  if (charities.value && charityGroup) {
    charityGroup.items = [{
      type: 'link',
      key: 'charity.donations',
      link: '/transactions?tabs=donations',
      icon: 'hugeicons:taxes',
      iconType: 'ui'
    },
    {
      type: 'divider',
      key: 'divider',
    }]

    for (const charity of charities.value) {
      charityGroup.items?.push({
        type: 'link',
        label: charity?.name,
        url: `/${charity?.id}`,
        icon: 'hugeicons:charity',
        iconType: 'ui'
      })
    }
  }

  const affiliateLink = _routes.filter(item => item.key === 'menu.affiliate')[0]
  if (affiliateLink && isLoggedIn.value) {
    if (codes.value?.length > 0 && sponsorAffiliates.value > 0) {
      affiliateLink.url = '/affiliate/overview'
    }
  }

  return _routes
})

const handleNuxtLinkLocaleClick = (path: any) => {
  isSidebarOpen.value = true
  selectedMenuPath.value = path
  emit('update:linkValue')
}

const handleSidebarButtonClick = (key: string) => {
  if (key === 'footer.live-support' && import.meta.client) {
    toggleChat()

    isMobileSidebarOpen.value = false
  }
}

watch(() => isSidebarOpen.value, () => {
  showLabels.value = false
  setTimeout(() => {
    showLabels.value = true
  }, 70)
}, { immediate: true })
</script>

<template>
  <div class="h-full w-full font-bold text-sm">
    <div
      v-for="(group, index) in computedRoutes"
      :key="`${group.key}_${index}-hey-15`"
    >
      <template v-if="group.type === 'divider' && showLabels">
        <div class="w-full px-2.5 py-1.5">
          <div class="bg-border w-full h-px" />
        </div>
      </template>
      <template v-else-if="group.type === 'button'">
        <div
          v-if="showLabels"
          class="overflow-hidden"
          @click="handleSidebarButtonClick(group.key)"
        >
          <div
            :class="{
              'gap-x-2 justify-start px-4': isSidebarOpen,
              'gap-x-1 justify-center': !isSidebarOpen,
            }"
            class="relative cursor-pointer rounded-md py-2.5 group flex items-center text-sm text-paragraph"
          >
            <template v-if="group.iconType === 'ui'">
              <UIcon
                :class="[group?.iconClass || '']"
                :name="group.icon"
                class="w-4 h-4"
              />
            </template>
            <svg
              v-else
              :class="[group?.iconClass || '']"
              class="w-4 h-4"
            >
              <use :href="group.icon" />
            </svg>
            <span v-if="group.key && isSidebarOpen">{{ t(group.key) }}</span>
          </div>
        </div>
      </template>
      <template v-else-if="group.key === 'menu.language'">
        <LanguageDropdown
          v-if="showLabels"
          :selected-path="selectedMenuPath"
          @update:selected-path="handleNuxtLinkLocaleClick"
        />
      </template>
      <template v-else>
        <LinkGroup
          v-if="showLabels"
          :group="group"
          :selected-path="selectedMenuPath"
          @update:selected-path="handleNuxtLinkLocaleClick"
        />
      </template>
    </div>
  </div>
</template>
