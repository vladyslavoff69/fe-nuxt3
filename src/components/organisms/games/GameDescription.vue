<script lang="ts" setup>
import { CMS_CONTENTS_QUERY } from '~/graphql'
import GameDescSkeleton from '~/components/organisms/games/GameDescSkeleton.vue'

const props = defineProps<{
  slug: string;
  provider: string;
}>()

const { t } = useI18n()
const { loading, result } = useQuery<{
  contentBySlug: {
    id: string;
    content: any;
    enabled: boolean;
    slug: string;
    title: string;
  };
}>(CMS_CONTENTS_QUERY, {
  slug: `casino-${props.slug}`
})

const contentData = computed(() => result.value?.contentBySlug)
const content = computed(() => contentData.value?.content)
</script>

<template>
  <div class="game-description w-full h-full">
    <GameDescSkeleton v-if="loading" />
    <div
      v-else-if="content"
      class="w-full h-full flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4"
    >
      <div
        v-if="content?.image"
        class="flex flex-col gap-y-2 w-full lg:w-28 min-w-28 h-full items-start sm:items-center justify-start"
      >
        <NuxtImg
          :src="content.image"
          class="w-28 h-36 rounded-md"
          loading="lazy"
          alt="Junglebet.com"
        />

        <UBadge
          class="w-28 py-1 text-center flex justify-center uppercase leading-normal text-xxs sm:text-xs"
          color="primary"
          size="md"
          variant="solid"
        >
          <span class="text-white font-semibold">
            {{ t('games.edge') }}: {{ content?.edge }}
          </span>
        </UBadge>
      </div>
      <div class="grid grid-cols-6 gap-3 lg:gap-4 text-sm">
        <h2 class="text-lg lg:text-xl text-white font-bold col-span-6 leading-none!">
          {{ content?.name }}
        </h2>
        <div class="uppercase col-span-2 lg:col-span-1 font-bold">
          {{ t('casino.provider') }}
        </div>
        <div class="col-span-4 lg:col-span-5">
          <span class="px-3 py-1 leading-normal bg-border rounded-full text-xxs sm:text-xs font-bold">
            {{ props.provider }}
          </span>
        </div>
        <div class="uppercase col-span-2 lg:col-span-1 font-bold">
          <div class="leading-6 sm:leading-loose">
            {{ t('base.keywords') }}
          </div>
        </div>
        <div class="col-span-4 lg:col-span-5">
          <div class="w-full flex items-center flex-wrap gap-1.5 lg:gap-2">
            <span
              v-for="(keyItem, k) in content.keywords?.split(',')"
              :key="`${keyItem}_${k}-hey-11`"
              class="leading-normal px-3 py-1 bg-border rounded-full text-xxs sm:text-xs font-bold"
            >
              {{ keyItem.trim() }}
            </span>
          </div>
        </div>
        <div class="text-lg lg:text-xl text-white font-bold col-span-6">
          <div>{{ t('base.about') }} {{ content?.name }}</div>
          <div class="text-sm text-paragraph leading-tight">
            {{ content?.description }}
          </div>
        </div>
        <div class="text-lg lg:text-xl text-white font-bold col-span-6">
          <div>{{ t('games.how-to-play') }} {{ content?.name }}</div>
          <template
            v-for="(hItem, h) in content?.howToPlay"
            :key="h"
          >
            <div
              class="text-sm text-paragraph leading-tight"
              :class="{
                'font-bold text-base': hItem.type === 'bold',
                'font-medium': hItem.type === 'normal',
                'font-semibold': hItem.type === 'semibold',
                'mb-3': hItem.newLine,
              }"
            >
              {{ hItem.description }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else>
      No data exists
    </div>
  </div>
</template>
