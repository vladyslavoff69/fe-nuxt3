<script lang="ts" setup>
import SearchInput from '~/components/molecules/inputs/SearchInput.vue'
import { GAME_SEARCH_QUERY } from '~/graphql'
import GameRows from '~/apps/casino/components/GameRows.vue'
import type { ID } from '~/types'

const props = defineProps<{
  resultPanel?: string,
  searchId?: boolean
}>()

const emits = defineEmits<{
  (e: 'searchGame', value: ID): void;
}>()

const { t } = useI18n()
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
    } else if (props.searchId) {
      emits('searchGame', 'ALL')
    }
  }
)

const games = computed(() => {
  return (result.value?.gameSearch?.data || [])
})

const searchResult = (id: ID) => {
  emits('searchGame', id)

  if (props.searchId) {
    openSearchPanel.value = false
  }
}
</script>

<template>
  <div>
    <div class="relative w-full z-999">
      <SearchInput
        v-model="searchGameWord"
        :placeholder="t('casino.search-games')"
        class="w-full lg:w-auto lg:flex-auto"
        @focus="openSearchPanel = true"
        @update:model-value="(v) => searchGameWord = v"
      />
    </div>
    <div
      :class="[
        { 'opacity-100 z-999': openSearchPanel},
        resultPanel || ''
      ]"
      class="
        w-full overflow-auto
        absolute top-24 mt-2 md:mt-0 md:top-12 right-0
        opacity-0 bg-brand border border-border rounded
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
          :search-id="searchId"
          @search-game="searchResult"
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
      class="fixed z-99 w-full h-0 opacity-0 top-0 left-0 bg-green-950/60 transition duration-200 ease-in-out"
      @click="openSearchPanel = false"
    />
  </div>
</template>
