<script lang="ts" setup>
import { CASINO_GAME } from '~/constants'
import HotkeyModal from '~/components/organisms/games/HotkeyModal.vue'
import Fairness from '~/apps/game/fairness/Fairness.vue'
import { FAIRNESS_ICON } from '~/components/symbols'
import DetailsModalHeader from '~/components/organisms/header/DetailsModalHeader.vue'
import BetDetailsModal from '~/components/organisms/bet-details/BetDetailsModal.vue'

const { ready } = inject(CASINO_GAME)!
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const fairnessModal = computed(() => route.query.modal === 'fairness')
const hotKeyModal = computed(() => route.query.modal === 'hotkey')
const betModal = computed(() => route.query.modal === 'bet')
const gameName = computed(() => route.query.game)

const onCloseModal = () => {
  const routeQuery = Object.assign({}, route.query)
  const keysToDelete = [
    'modal', 'type', 'ref', 'risk', 'rows', 'client_seed', 'server_seed', 'nonce',
    'tab', 'userId', 'game', 'maxBooster', 'betID', 'segment'
  ]
  keysToDelete.forEach(key => delete routeQuery[key])

  router.push({
    path: router.currentRoute.value.path,
    query: routeQuery
  })
}
</script>

<template>
  <slot />

  <template v-if="ready">
    <ClientOnly>
      <UModal
        v-model:open="fairnessModal"
        class="w-11/12 sm:max-w-[461px] bg-brand"
        :default-open="fairnessModal"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <div class="w-full flex flex-col gap-3 md:gap-4 overflow-y-auto h-full p-2 sm:p-4">
            <DetailsModalHeader
              :icon="FAIRNESS_ICON"
              :title="`${gameName} ${t('base.fairness')}`"
              @close:details-modal="onCloseModal"
            />

            <Fairness />
          </div>
        </template>
      </UModal>
    </ClientOnly>

    <ClientOnly>
      <UModal
        v-model:open="betModal"
        class="w-11/12 sm:max-w-[400px] bg-brand"
        :default-open="betModal"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <div class="w-full flex flex-col gap-3 md:gap-4 overflow-y-auto h-full p-2 sm:p-4">
            <DetailsModalHeader
              :title="t('bets.bet-details')"
              @close:details-modal="onCloseModal"
            />

            <BetDetailsModal />
          </div>
        </template>
      </UModal>
    </ClientOnly>

    <ClientOnly>
      <UModal
        v-model:open="hotKeyModal"
        class="w-11/12 sm:max-w-[346px] bg-brand"
        :default-open="hotKeyModal"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <div class="w-full flex flex-col gap-3 md:gap-4 overflow-y-auto h-full p-2 sm:p-4">
            <DetailsModalHeader
              :title="t('bets.hot-keys')"
              icon="i-bi-keyboard-fill"
              icon-type="ui"
              @close:details-modal="onCloseModal"
            />

            <HotkeyModal />
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </template>
</template>
