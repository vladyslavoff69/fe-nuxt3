<script lang="ts" setup>
import type { Tab } from '~/atoms/types/tabs'

const {
  tabs,
  tabContainerClass = 'bg-green-950',
  modelValue = 0,
  width = 'auto',
  buttonProps = {
    variant: 'tab',
    class: 'text-sm font-bold',
    labelClass: '',
    size: 'md',
  }
} = defineProps<{
  modelValue: string | number,
  width?: string,
  tabs: Tab[];
  tabContainerClass?: string;
  buttonProps?: {
    variant?: 'primary' | 'alternative' | 'text' | 'outline' | 'tab',
    class?: string,
    labelClass?: string,
    size?: 'lg' | 'sm' | 'md'
  } | undefined,
}>()
const emits = defineEmits(['update:modelValue'])

const valueIndex = ref(0) // Assuming you have a reactive variable for the currently selected tab index
const tabRef = ref<HTMLElement | null>(null)

const onClickTab = (tab: string | number, index: number) => {
  valueIndex.value = index
  // @ts-ignore
  if (tabRef.value?.scrollToIndex) {
    // @ts-ignore
    tabRef.value?.scrollToIndex(index)
  }
  emits('update:modelValue', tab)
}
</script>
<template>
  <ClientOnly>
    <JScrollBar
      ref="tabRef"
      :content-box-class="['flex relative rounded-md bg-green-950 p-1', tabContainerClass]"
      :style="{ maxWidth: width }"
      inner-container-class="flex"
      round-class="rounded-md"
    >
      <JButton
        v-for="(tabItem, idx) in tabs"
        :key="`jt-1-${idx}`"
        class="
          min-w-0 shrink-0 grow flex items-center justify-center rounded-md gap-x-1 text-center transition
          ease-in-out duration-150 font-bold leading-[14px] text-sm py-0 md:py-2 lg:py-3 px-3 min-h-8 h-8
        "
        :class="[
          {
            'pointer-events-none': !!tabItem?.disabled,
          }, buttonProps.class
        ]"
        :disabled="!!tabItem?.disabled"
        :size="buttonProps.size"
        :variant="modelValue === tabItem.value ? buttonProps.variant : 'transparent'"
        hover-class="hover:shadow-transparent hover:text-white"
        @click="onClickTab(tabItem.value, idx)"
      >
        <template v-if="tabItem.icon === 'ellipseDiv'">
          <div
            class="inline-block w-4 h-4 min-w-4 min-h-4 rounded-full"
            :class="[
              modelValue === tabItem.value ? 'bg-white' : 'bg-primary'
            ]"
          />
        </template>
        <template v-if="tabItem.icon && tabItem.icon !== ''">
          <template v-if="tabItem.iconType === 'image'">
            <NuxtImg
              :alt="tabItem.icon"
              class="block text-current w-4 h-4 min-w-4 min-h-4"
              :class="[
                tabItem.iconClass
              ]"
              :src="tabItem.icon"
              loading="lazy"
              provider="cloudflare"
            />
          </template>
          <template v-else-if="tabItem.iconType === 'ui'">
            <UIcon
              class="block text-current w-4 h-4 min-w-4 min-h-4"
              :class="[
                tabItem.iconClass
              ]"
              :name="tabItem.icon || ''"
            />
          </template>
          <template v-else>
            <svg
              class="block text-current w-4 h-4 min-w-4 min-h-4"
              :class="[
                tabItem.iconClass
              ]"
            >
              <use :href="tabItem.icon" />
            </svg>
          </template>
        </template>
        <span
          class="font-bold leading-normal"
          :class="[
            {
              'block': tabItem.icon && tabItem.icon !== ''
            },
            buttonProps?.labelClass || ''
          ]"
        >
          {{ tabItem?.label || '' }}
        </span>
        <template v-if="tabItem.active">
          <span
            class="w-2 h-2 rounded-full relative top-px"
            :class="[
              {
                'bg-green-600': tabItem.active === 'online' && modelValue !== tabItem.value,
                'bg-linear-to-tr from-yellow-300 to-amber-400': tabItem.active === 'offline' || modelValue === tabItem.value
              }
            ]"
          />
        </template>
      </JButton>
    </JScrollBar>
  </ClientOnly>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: #6f6f6f5c;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

::-webkit-scrollbar-track {
  background-color: black;
}
</style>
