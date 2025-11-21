<script lang="ts" setup>
import { CONTAINER, GAME } from '~/constants'
import type { Game } from '~/types'
import striptags from 'striptags'

const props = defineProps<{
  game: Game;
}>()

const { containerScreen } = inject(CONTAINER)!
const theatreMode = ref(false)
const paneCss = 'bg-brand rounded-md'
const instantMode = ref(false)
const audioVolume = ref(20)
const nuxtApp = useNuxtApp()
const { sendFingerprint } = useSendFingerprint()

provide(GAME, {
  game: props.game,
  identifier: props.game.identifier,
  theatreMode: computed({
    get() {
      return containerScreen.value.lg && theatreMode.value
    },
    set(v) {
      theatreMode.value = v
    }
  }),
  paneCss,
  instantMode,
  audioVolume,
})

nuxtApp.hook('page:finish', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

const product = {
  title: `${props.game?.title?.replace(/-/g, '')?.toUpperCase() || 'Casino Game'} by ${props.game?.gameProvider?.display_name || 'Junglebet'} | Play ${props.game?.gameCategories?.[0]?.name?.toLowerCase()?.replace('junglebet', 'Exclusive In-House games') || 'Games'} at Junglebet Casino`,
  description: props.game?.description || '',
}

const textDescription = computed(() => striptags(product.description)?.replace(/&nbsp;/g, ' '))

const homeCategories = ['junglebet', 'new-releases', 'slots', 'table-games', 'live', 'game-shows']
const categorySlug = computed(() => props.game?.gameCategories?.[0]?.slug || 'junglebet')

useHead({
  title: product.title,
  meta: [
    {
      name: 'description',
      content: textDescription.value
    },
    {
      property: 'og:title',
      content: product.title
    },
    {
      property: 'og:description',
      content: textDescription.value
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://junglebet.com/casino/${homeCategories.includes(categorySlug.value) ? 'home' : 'category'}/${categorySlug.value === '' ? 'new-releases' : categorySlug.value}`
    }
  ]
})

useSeoMeta({
  title: product.title,
  description: textDescription.value,
  ogTitle: product.title,
  ogDescription: textDescription.value,
})

onMounted(async () => {
  await sendFingerprint()
})
</script>
<template>
  <div class="w-full h-full p-0 m-0">
    <slot />
  </div>
</template>
