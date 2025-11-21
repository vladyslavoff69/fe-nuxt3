<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import type { MenuItem } from '~/types'
import { SITE_SETTINGS } from '~/constants'

const props =
  defineProps<{
    group: MenuItem;
    selectedPath: string;
  }>()

const emits = defineEmits(['update:selectedPath'])

const { t } = useI18n()
const { isSidebarOpen, toggleSidebar } = inject(SITE_SETTINGS)!
const router = useRouter()
const localePath = useLocalePath()
const group = computed(() => props.group)
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!
const selectedPath = computed({
  get () {
    return props.selectedPath || redirectHome
  },
  set (v) {
    emits('update:selectedPath', v)
  }
})

const openState = ref(false)

const isOpened = computed({
  get () {
    if (openState.value && group.value.type === 'group') {
      return true
    } else if (group.value.type === 'dropdown' || group.value.type === 'button') {
      return openState.value
    } else if (['link', 'group'].includes(group.value.type)) {
      if (group.value?.url) {
        return (
          selectedPath.value &&
          (
            group.value?.url === selectedPath.value ||
            router.currentRoute.value.path.includes(String(group.value.path))
          )
        ) || false
      } else {
        return (group.value.path && selectedPath.value.includes(group.value.path)) || false
      }
    }

    return false
  },
  set (v: boolean) {
    openState.value = v
  }
})

const handleSidebar = () => {
  toggleSidebar()
}

const handleNuxtLinkLocaleClick = (newUrl: string, v: boolean) => {
  openState.value = v
  if (newUrl) {
    selectedPath.value = newUrl
  }
}

const [menuParent] = useAutoAnimate({
  duration: 150
})

const clickLinkGroup = () => {
  handleNuxtLinkLocaleClick(group.value?.url || '', !openState.value)
  if (group.value?.type !== 'link') {
    if (!isSidebarOpen.value) {
      handleSidebar()
    }
  }

  if (group.value?.url) {
    navigateTo(localePath(group.value?.url))
  }
}

const toggleDropIcon = (e: any) => {
  e.stopPropagation()
  openState.value = !openState.value
  isSidebarOpen.value = true
}
</script>
<template>
  <div class="overflow-hidden">
    <JbBlankButton
      :class="{
        'bg-border text-white!': isOpened && group.url === selectedPath,
        'gap-x-2 justify-between px-4': isSidebarOpen,
        'gap-x-1 justify-center': !isSidebarOpen,
      }"
      class="w-full relative cursor-pointer rounded-md py-2 group flex items-center text-sm text-paragraph"
      @click="clickLinkGroup"
    >
      <div
        :class="{
          'justify-center': !isSidebarOpen,
          'gap-x-2': isSidebarOpen,
          'ml-4': !isSidebarOpen && ['group', 'dropdown'].indexOf(group.type) > -1,
        }"
        class="md:group-hover:text-white min-h-[21px] flex items-center w-full"
      >
        <template v-if="group.iconType === 'ui'">
          <UIcon
            :class="[group?.iconClass || '']"
            :name="group.icon"
            class="w-4 h-4 min-w-4 min-h-4"
          />
        </template>
        <svg
          v-else
          :class="[group?.iconClass || '']"
          class="w-4 h-4 min-w-4 min-h-4"
        >
          <use :href="group.icon" />
        </svg>
        <span v-if="isSidebarOpen">
          {{ t(group.key) }}
        </span>
        <span
          v-if="['group', 'dropdown'].indexOf(group.type) > -1"
          :class="{
            'bg-border ml-auto': isSidebarOpen,
            'text-white bg-primary': isSidebarOpen && isOpened && openState,
            'text-paragraph group-hover:text-white': !openState,
          }"
          :style="{ transform: `rotate(${isOpened && openState ? '0deg' : '-90deg'})` }"
          class="
            flex items-center justify-center
            transition-transform duration-100 rounded-full
          "
          @click="toggleDropIcon"
        >
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
            name="i-heroicons-chevron-down-20-solid"
          />
        </span>
      </div>
    </JbBlankButton>
    <div ref="menuParent">
      <div
        v-if="openState && isOpened && isSidebarOpen && ['group', 'dropdown'].includes(group.type)"
        class="pt-2.5"
      >
        <div
          v-for="(item, itx) in group?.items"
          :key="`lg-5-${itx}`"
          :class="{
            'bg-border rounded-md': `${group?.path}${item.url}` === selectedPath || (item.link && item.link === router.currentRoute.value.path)
          }"
          class="px-3"
        >
          <template v-if="item.type === 'divider'">
            <div
              :key="item.key"
              class="w-full py-1"
            >
              <div class="bg-border w-full h-px" />
            </div>
          </template>
          <template v-else>
            <NuxtLinkLocale
              v-if="item.type === 'link'"
              :class="{
                'text-white w-full': `${group?.path}${item.url}` === selectedPath,
              }"
              :to="item.link ? item.link : `${group?.path}${item.url}`"
              class="
                flex items-center gap-x-2 py-2.5 leading-none
                text-paragraph hover:text-white text-sm
                active:scale-95 group pl-1 cursor-pointer
              "
              @click="handleNuxtLinkLocaleClick(`${(group?.path || '')}${(item.url || '')}`, true)"
            >
              <template v-if="item.iconType === 'ui'">
                <UIcon
                  :class="[item?.iconClass || '']"
                  :name="item.icon"
                  class="w-4 h-4"
                />
              </template>
              <svg
                v-else
                :class="[item?.iconClass || '']"
                class="w-4 h-4"
              >
                <use :href="item.icon" />
              </svg>
              <span v-if="item.key">{{ t(item.key) }}</span>
              <span v-else>
                {{ item?.label || '' }}
              </span>
            </NuxtLinkLocale>
          </template>
        </div>
      </div>
      <div
        v-if="openState && isOpened && isSidebarOpen && group.type === 'dropdown'"
        class="mx-3 pt-1"
      >
        <div class="w-full h-px bg-primary mb-2.5" />
      </div>
    </div>
  </div>
</template>
