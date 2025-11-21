<script lang="ts" setup>
import { CURRENCY, PREFERENCE } from '~/constants'

const {
  contentHeight = 0,
} = defineProps<{
  contentHeight?: number;
}>()

const emits =
  defineEmits<{
    (e: 'selected:currency', code: string): void;
    (e: 'toggle:fiat'): void;
  }>()

const { activeFiatCode } = inject(PREFERENCE)!
const { fiatCurrencies } = inject(CURRENCY)!
const searchWord = ref<string>('')
const onSelect = (code: string) => {
  emits('selected:currency', code)
  searchWord.value = ''
}

const searchedCurrencyItems = computed(
  () => fiatCurrencies.value.filter(
    item =>
      item?.code?.includes(searchWord.value.toUpperCase()) ||
      item?.name?.toLowerCase().includes(searchWord.value.toLowerCase())
  ))
</script>

<template>
  <div
    class="px-2 pt-2 flex flex-col gap-y-2.5 w-full lg:w-[250px] pb-2 lg:p-2"
  >
    <UInput
      v-model="searchWord"
      color="neutral"
      icon="i-heroicons-magnifying-glass-20-solid"
      placeholder="Search currencies"
      size="md"
      type="text"
    />

    <JbScrollbar
      :height="contentHeight ? contentHeight + 'px' : '150px'"
      :scroll-x="false"
      style-type="invisible"
    >
      <div
        v-for="(cItem, c) in searchedCurrencyItems"
        :key="`key-${c}-hey-23`"
        :class="{
          'bg-border': cItem.code === activeFiatCode,
        }"
        class="
          flex items-center w-full
          p-2.5 rounded-md text-sm font-semibold leading-none
          cursor-pointer hover:bg-border duration-150
        "
        @click="onSelect(cItem.code)"
      >
        <div
          v-if="cItem"
          class="flex items-center gap-x-2"
        >
          <div class="w-4 min-w-4 p-0 flex items-center">
            <UIcon
              v-if="cItem?.icon && cItem.iconType === 'ui'"
              :name="cItem?.icon"
              class="w-4 h-4 min-w-4 min-h-4"
            />
            <svg
              v-else-if="cItem?.iconType === 'symbol'"
              class="w-4 h-4 min-w-4 min-h-4"
            >
              <use :href="cItem?.icon" />
            </svg>
            <UAvatar
              v-else
              :alt="cItem?.name || ''"
              :src="cItem?.logo"
              class="w-4 h-4 min-w-4 min-h-4"
              img-class="w-4 h-4"
              size="sm"
            />
          </div>

          <span
            :class="{
              'text-white': cItem.code === activeFiatCode,
              'text-paragraph': cItem.code !== activeFiatCode,
            }"
            class="flex items-center"
          >{{ cItem.code }}</span>
        </div>
      </div>
    </JbScrollbar>
  </div>
</template>
