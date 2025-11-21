<script lang="ts" setup>
import SearchInput from '~/components/molecules/inputs/SearchInput.vue'
import { GAME_SEARCH_QUERY } from '~/graphql'
import GameRows from '~/apps/casino/components/GameRows.vue'
import { THEME } from '~/constants'

defineProps<{
  resultPanel?: string
}>()

const { t } = useI18n()
const { screen } = inject(THEME)!
const searchGameWord = ref('')
const openSearchPanel = ref(false)
const searchOptions = computed(() => ({
  first: 20,
  keyword: searchGameWord.value
}))

const { result, loading, load, refetch } = useLazyQuery(GAME_SEARCH_QUERY, searchOptions)
watch(
  () => searchGameWord.value,
  (_searchWord) => {
    if (_searchWord.length > 2) {
      if (!result.value) {
        load()
      } else {
        refetch()
      }
    }
  }
)

const games = computed(() => {
  return (result.value?.gameSearch?.data || [])
})
</script>

<template>
  <div v-if="!screen.md">
    <div class="relative w-full z-1000">
      <SearchInput
        v-model="searchGameWord"
        :placeholder="t('casino.global-search')"
        class="w-full lg:w-auto lg:flex-auto"
        class-name="text-xs"
        @focus="openSearchPanel = true"
        @update:model-value="(v) => searchGameWord = v"
      />
    </div>
    <div
      :class="[
        { 'opacity-100 z-1000': openSearchPanel},
        { 'opacity-0': !openSearchPanel},
        resultPanel || ''
      ]"
      class="
        w-full overflow-auto
        absolute top-12 right-0
        bg-brand border border-border rounded
        transition duration-200 ease-in-out
      "
    >
      <JbScrollbar
        v-if="searchGameWord.length > 2"
        :scroll-x="false"
        class="w-full max-h-80 p-3"
        height="320px"
        style-type="content"
      >
        <GameRows
          :games="games"
          :loading="loading"
        />
      </JbScrollbar>
      <p
        v-else
        class="text-paragraph text-xs p-3"
      >
        {{ t('casino.to-begin-search-text') }}
      </p>
    </div>
    <div
      :class="{
        'opacity-100 h-full': openSearchPanel
      }"
      class="fixed z-999 w-full h-0 opacity-0 top-0 left-0 bg-green-950/60 transition duration-200 ease-in-out"
      @click="openSearchPanel = false"
    />
  </div>
</template>
