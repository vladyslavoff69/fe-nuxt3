<script
  generic="T extends {id: ID, transactionId: string, status: GameMatchStatus, text: string | number, isFree?: boolean}"
  lang="ts"
  setup
>
import type { GameMatchStatus, ID } from '~/types'
import { THEME } from '~/constants'

const props = defineProps<{ history: T[]; }>()
const route = useRoute()
const { screen } = inject(THEME)!
const maxVisibleLen = computed(() => screen.value.width < 394 ? 4 : 5)
const historyVisible = computed<T[]>(() => props.history.slice(screen.value.width < 394 ? -5 : -6))
</script>

<template>
  <ClientOnly>
    <div class="GameHistory w-full flex items-center justify-center">
      <div
        class="flex flex-nowrap justify-center gap-1 overflow-hidden px-1"
        :style="screen.width > 393 ? '--element-width: 70px; max-width: 393px;' : '--element-width: 50px;'"
      >
        <div
          v-for="(item, index) in historyVisible"
          :key="item.transactionId"
          class="py-0.5"
          :class="{
            'fadeout-first-item': index === 0 && historyVisible.length > maxVisibleLen,
            'element-width-item': index >= (historyVisible.length - 1)
          }"
          :style="{ width: screen.width > 393 ? '70px' : '50px' }"
        >
          <NuxtLinkLocale
            :to="!item.isFree ? `${route.path}?modal=bet&type=inhouse&ref=${item.transactionId}` : ''"
            class="pb-0 flex items-center leading-none w-full"
            :style="{ width: screen.width > 393 ? '70px' : '50px' }"
          >
            <JButton
              v-if="item.status === 'won'"
              class="py-1! w-full"
              variant="primary"
            >
              {{ item.text }}
            </JButton>
            <JButton
              v-else
              class="py-1! w-full text-white border-paragraph! before:bg-paragraph hover:before:bg-paragraph hover:text-brand"
              variant="outline"
            >
              {{ item.text }}
            </JButton>
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
<style lang="scss">
.GameHistory {
  @keyframes fadeInToLeft {
    0% {
      opacity: 0;
      width: var(--element-width);
      transform: translateX(30%);
    }
    100% {
      opacity: 1;
      width: var(--element-width) !important;
      transform: translateX(0);
    }
  }

  @keyframes fadeOutToLeft {
    0% {
      opacity: 1;
      width: var(--element-width) !important;
      transform: translateX(0);
    }
    30% {
      opacity: 0;
      width: var(--element-width);
      transform: translateX(-30%);
    }
    100% {
      opacity: 0;
      width: 0;
      transform: translateX(-100%);
    }
  }

  .fadeout-first-item {
    animation: fadeOutToLeft 0.5s ease forwards;
  }

  .element-width-item {
    animation: fadeInToLeft 0.5s ease forwards;
  }
}
</style>
