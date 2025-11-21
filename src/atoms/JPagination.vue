<script lang="ts" setup>
const {
  maxVisible = 5,
  currentPage = 1,
  lastPage = 1
} = defineProps<{
  maxVisible?: number
  currentPage?: number
  lastPage?: number
}>()

const emits = defineEmits<{
  (e: 'update:current', v: number): void;
}>()

const currPage = computed(() => currentPage)
const laPage = computed(() => lastPage)
const mVisible = computed(() => maxVisible)
const clickPrev = () => {
  if (currPage.value > 1) {
    emits('update:current', (currPage.value - 1))
  }
}

const clickNext = () => {
  if (currPage.value < laPage.value) {
    emits('update:current', (currPage.value + 1))
  }
}

const clickCurr = (v: number | string) => {
  if (v !== '...') {
    emits('update:current', Number(v))
  }
}

// Computed property to display a limited range of pages with "..."
const visiblePages = computed(() => {
  const pages: any[] = []

  if (laPage.value <= mVisible.value) {
    // If total pages are less than or equal to maxVisible, show all
    for (let i = 1; i <= laPage.value; i++) { pages.push(i) }
  } else {
    // Show the first, last, and a range around the current page with "..."
    // eslint-disable-next-line no-lonely-if
    if (currPage.value <= 3) {
      pages.push(1, 2, 3, 4, '...', laPage.value)
    } else if (currPage.value >= laPage.value - 2) {
      pages.push(1, '...', laPage.value - 3, laPage.value - 2, laPage.value - 1, laPage.value)
    } else {
      pages.push(1, '...', currPage.value - 1, currPage.value, currPage.value + 1, '...', laPage.value)
    }
  }

  return pages
})
</script>

<template>
  <div class="flex items-center">
    <JButton
      :disabled="currPage === 1"
      class="p-0! w-9 md:w-10 h-9 md:h-10 rounded-r-none! rounded-l-sm!"
      role="button"
      shape="circle"
      size="sm"
      variant="alternative"
      @click.stop="clickPrev"
    >
      <UIcon
        class="h-6 w-6"
        name="i-heroicons-chevron-left-20-solid"
      />
    </JButton>
    <JButton
      v-for="page in visiblePages"
      :key="`${page}-paginator`"
      class="p-0! w-9 md:w-10 h-9 md:h-10 rounded-none!"
      :class="{
        'bg-primary!': page === currPage
      }"
      role="button"
      shape="circle"
      size="sm"
      variant="alternative"
      @click.stop="clickCurr(page)"
    >
      {{ page }}
    </JButton>
    <JButton
      :disabled="currPage >= laPage"
      class="p-0! w-9 md:w-10 h-9 md:h-10 rounded-l-none! rounded-r-sm!"
      role="button"
      shape="circle"
      size="sm"
      variant="alternative"
      @click.stop="clickNext"
    >
      <UIcon
        class="h-6 w-6"
        name="i-heroicons-chevron-right-20-solid"
      />
    </JButton>
  </div>
</template>
