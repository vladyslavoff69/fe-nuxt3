<script lang="ts" setup>
import { AUTH } from '~/constants'
import CloseButton from '~/components/molecules/button/CloseButton.vue'

const { isUserModalNotify, userModalNotification } = inject(AUTH)!
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isUserModalNotify"
      :default-open="isUserModalNotify"
      :dismissible="false"
      class="bg-background w-full md:max-w-sm"
      @update:open="(v) => {
      if (!v) {
        isUserModalNotify = false
      }
    }"
    >
      <template #content>
        <div class="w-full h-full p-2 md:p-4 flex flex-col gap-2 md:gap-4">
          <div
            v-if="userModalNotification?.header"
            class="w-full text-2xl font-bold text-white flex items-center justify-between"
          >
            <div class="w-full">
              {{ userModalNotification.header }}
            </div>
            <CloseButton
              class="w-3 h-3 min-w-3 min-h-3"
              @click="isUserModalNotify = false"
            />
          </div>
          <div
            v-if="userModalNotification?.body"
            class="w-full"
            v-html="userModalNotification.body"
          />
          <NuxtImg
            v-if="userModalNotification?.image"
            alt="Ray"
            class="w-full h-auto"
            loading="lazy"
            :src="userModalNotification?.image"
          />
          <div
            v-if="userModalNotification?.action"
            class="w-full"
          >
            <a
              :href="userModalNotification?.action_url"
              target="_blank"
              class="w-full h-full bg-bet-gradient py-1 px-3 text-nowrap text-brand"
            >
              {{ userModalNotification?.action }}
            </a>
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
