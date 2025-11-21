<script lang="ts" setup>
interface GameProvider {
  id: number
  enabled: boolean
  name: string
  display_name: string
  slug: string
  image: string
  game_count: number
}

const runtimeConfig = useRuntimeConfig()
const storageUrl = runtimeConfig.public.storage_url

const { gameProvider } = defineProps<{
  gameProvider: GameProvider
}>()
</script>

<template>
  <div
    class="
      bg-green-950 max-w-[153px] w-full px-4 h-16 flex items-center justify-center
      rounded-md transition-all duration-200 hover:-translate-y-2
      cursor-pointer
    "
  >
    <NuxtLinkLocale
      :to="`/casino/provider/${gameProvider.slug}`"
      class="flex items-center w-full h-full justify-center"
    >
      <NuxtImg
        :src="(gameProvider.image.includes('http') ? gameProvider.image : `${storageUrl}${gameProvider.image}`)"
        :title="gameProvider.display_name"
        class="max-h-[80%] w-auto"
        loading="lazy"
        alt="Junglebet.com"
      />
    </NuxtLinkLocale>
  </div>
</template>
