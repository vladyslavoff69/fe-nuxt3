<script lang="ts" setup>
const emits = defineEmits<{
  (e: 'close:modal', value: boolean): void;
}>()

const { t } = useI18n()
const formData = reactive({
  name: '',
  id: '',
})

const onCloseModal = () => {
  emits('close:modal', true)
}
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center w-full border-b border-border pb-4 mb-4">
      <div class="text-white font-bold text-xl leading-none! flex items-center gap-x-1">
        {{ t("affiliate.create-campaign") }}
      </div>
      <UIcon
        class="w-5 h-5 cursor-pointer text-paragraph hover:text-white"
        name="i-heroicons-x-mark-20-solid"
        @click="onCloseModal"
      />
    </div>

    <div class="grid gap-y-1 text-left mb-4">
      <span class="text-sm font-bold text-white">{{
        t("affiliate.campaign-name")
      }}<span class="text-red-600">*</span></span>
      <UInput
        v-model="formData.name"
        :placeholder="t('affiliate.campaign-name-placeholder')"
        class="w-full bg-green-950! text-sm! border-none!"
        color="neutral"
        size="xl"
        type="text"
      />
    </div>

    <div class="grid gap-y-1 text-left mb-4">
      <span class="text-sm font-bold text-white">
        {{ t("affiliate.campaign-id") }}<span class="text-red-600">*</span>
      </span>
      <UInput
        v-model="formData.id"
        :placeholder="t('affiliate.campaign-id-placeholder')"
        class="w-full bg-green-950! text-sm! border-none!"
        color="neutral"
        size="xl"
        type="text"
      />
    </div>

    <div class="grid gap-y-1 text-left mb-4">
      <span class="text-sm font-bold text-white">
        {{ t("affiliate.copy-campaign-link") }}
      </span>
      <div class="flex-1 md:flex-none flex items-center bg-green-950 ring-1 ring-border rounded-md px-4 h-11">
        <div class="relative">
          <div class="absolute w-full h-full z-1 cursor-not-allowed" />
          <div class="block text-paragraph text-sm">
            <span>junglebet.com/{{ formData.id }}</span>
          </div>
        </div>
        <JbBlankButton class="ml-auto">
          <UIcon
            class="h-4 w-4 min-w-4 min-h-4 text-paragraph hover:text-white cursor-copy"
            name="ion:copy-sharp"
          />
        </JbBlankButton>
      </div>
    </div>

    <JButton
      class="block px-4 w-full text-white"
      shape="circle"
    >
      {{ t("affiliate.create-campaign") }}
    </JButton>
  </div>
</template>
