<script lang="ts" setup>
import copy from 'copy-to-clipboard'

const {
  border = false,
  modelValue,
  readonly = true,
  backgroundClass = 'bg-green-950'
} = defineProps<{
  border?: boolean;
  modelValue: string | number;
  readonly?: boolean;
  backgroundClass?: string;
}>()

const emits =
  defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
  }>()

const { t } = useI18n()
const copyValue = computed({
  get () {
    return modelValue
  },
  set (v) {
    emits('update:modelValue', v)
  }
})

const isTooltipVisible = ref<boolean>(false)
const copyToClipboard = () => {
  if (copyValue.value === '') {
    return
  }

  copy(String(copyValue.value))
  isTooltipVisible.value = true
  setTimeout(() => {
    isTooltipVisible.value = false
  }, 1000)
}
</script>

<template>
  <div class="w-full flex items-center rounded-md">
    <UInput
      v-model="copyValue"
      :readonly="readonly"
      class="w-full relative"
      :class="[backgroundClass]"
      size="xl"
      placeholder="#"
    >
      <template #trailing>
        <UTooltip
          :content="{ side: 'top' }"
          arrow
          :text="isTooltipVisible ? `${t('base.copied')}!` : t('base.copy')"
        >
          <div
            :class="{
                'cursor-copy text-paragraph hover:text-white': !!copyValue,
                'pointer-events-none cursor-not-allowed text-disabled-paragraph': copyValue === '',
              }"
            @click="copyToClipboard"
          >
            <UIcon
              class="w-4 h-4 min-h-4 min-w-4"
              name="icon-park-solid:copy"
            />
          </div>
        </UTooltip>
      </template>
    </UInput>
  </div>
</template>
