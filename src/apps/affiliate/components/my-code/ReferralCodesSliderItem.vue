<script lang="ts" setup>
const props =
  defineProps<{
    item: {
      text: string;
      value: string | number | undefined;
      modal?: string;
    };
  }>()

defineEmits(['open-modal'])

const { t } = useI18n()
</script>
<template>
  <div>
    <div
      class="
        flex flex-col justify-between rounded-md bg-green-950 border-2 border-green-950 text-center
        md:h-[100px] h-20 md:gap-1 md:py-5 py-4
      "
    >
      <span class="text-white text-xl md:text-xxl">{{ item.value }}</span>
      <div
        :class="{ 'group/help cursor-pointer hover:text-white duration-150': item.modal }"
        class="md:text-sm text-xs flex items-center text-paragraph justify-center"
        @click="item.modal ? $emit('open-modal', props.item.modal) : false"
      >
        <div class="group-active/help:scale-95 flex items-center">
          <div
            v-if="item.modal"
            class="rounded-full w-3.5 h-3.5 md:w-4 md:h-4 bg-border flex items-center justify-center mr-[5px]"
          >
            <UIcon
              class="h-2.5 w-2.5 min-w-2.5 min-h-2.5 text-paragraph hover:text-white cursor-help"
              name="ic:round-question-mark"
            />
          </div>
          <span class="md:text-sm text-xs font-bold">
            {{ t(item.text) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
