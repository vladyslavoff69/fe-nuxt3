<script lang="ts" setup>
import type { SponsorCode } from '@/types'
import { AUTH } from '~/constants'
import AffiliateCodeHelpModal from '~/apps/vip-program/components/dashboard/AffiliateCodeHelpModal.vue'
import { ref } from 'vue'
import CommissionShareHelpModal from '~/apps/vip-program/components/dashboard/CommissionShareHelpModal.vue'
import ViewCommissionModal from '~/apps/vip-program/components/dashboard/ViewCommissionModal.vue'

defineProps<{
  sponsorCode: SponsorCode;
}>()

const { t } = useI18n()
const { me } = inject(AUTH)!
const isAffModalVisible = ref<boolean>(false)
const isComModalVisible = ref<boolean>(false)
const isViewModalVisible = ref<boolean>(false)

const openCommissionModal = () => {
  isViewModalVisible.value = true
}

const openHelpModal = () => {
  isAffModalVisible.value = true
}

const openComHelpModal = () => {
  isComModalVisible.value = true
}

const onCloseModal = () => {
  isAffModalVisible.value = false
  isComModalVisible.value = false
  isViewModalVisible.value = false
}
</script>
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 z-10">
    <div class="col-span-1 flex flex-col h-full gap-y-2.5">
      <div
        class="text-sm md:text-base flex items-center group cursor-pointer gap-2"
        @click="openHelpModal()"
      >
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-paragraph cursor-help hover:text-white"
          name="material-symbols:help-outline"
        />
        <span class="inline-block font-bold text-nowrap text-white">
          {{ t("vip.aff-code") }}
        </span>
      </div>
      <p class="text-xs md:text-sm text-paragraph">
        {{ t("vip.aff-code-applied") }}
      </p>
      <div
        class="h-10 bg-form-input text-paragraph rounded-full flex items-center justify-center mt-auto border border-form-input"
      >
        {{ sponsorCode.code }}
      </div>
    </div>
    <div class="col-span-1 flex flex-col h-full gap-y-2.5">
      <div
        class="text-sm md:text-base flex items-center group cursor-pointer duration-150 gap-2"
        @click="openComHelpModal()"
      >
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-paragraph cursor-help hover:text-white"
          name="material-symbols:help-outline"
        />
        <span class="inline-block group-active:scale-95 font-bold text-nowrap text-white">
          {{ t("vip.comm-earning") }}
        </span>
      </div>
      <p class="text-xs md:text-sm text-primary">
        {{ sponsorCode.percent_back }}% {{ t("vip.comm-share") }}
      </p>
      <JButton
        class="w-full mt-auto font-bold"
        shape="circle"
        @click="openCommissionModal()"
      >
        {{ t("vip.view-comm") }}
      </JButton>
    </div>
    <ClientOnly>
      <UModal
        v-model:open="isAffModalVisible"
        :default-open="isAffModalVisible"
        class="w-11/12 sm:w-[400px] bg-brand p-2 sm:p-4"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <AffiliateCodeHelpModal @close:modal="onCloseModal" />
        </template>
      </UModal>
    </ClientOnly>
    <ClientOnly>
      <UModal
        v-model:open="isComModalVisible"
        :default-open="isComModalVisible"
        class="w-11/12 sm:w-[400px] bg-brand p-2 sm:p-4"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <CommissionShareHelpModal @close:modal="onCloseModal" />
        </template>
      </UModal>
    </ClientOnly>
    <ClientOnly>
      <UModal
        v-model:open="isViewModalVisible"
        :default-open="isViewModalVisible"
        class="w-11/12 sm:w-[400px] bg-brand p-2 sm:p-4"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <ViewCommissionModal
            :user="me!"
            @close:modal="onCloseModal"
          />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
