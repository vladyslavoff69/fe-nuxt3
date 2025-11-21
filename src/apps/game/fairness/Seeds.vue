<script lang="ts" setup>
import { FAIRNESS } from '~/apps/game/fairness/constants'
import { CREATE_NEW_SEED_PAIR_MUTATION, CURRENT_SEED_PAIR_QUERY } from '~/graphql'
import type { SeedPair } from '~/types'
import SkeletonSeedsRow from '~/components/molecules/skeletons/SkeletonSeedsRow.vue'
import CopyInput from '~/components/molecules/inputs/CopyInput.vue'

const { t } = useI18n()
const { gameSlug } = inject(FAIRNESS)!
const {
  loading: seedLoading,
  result: seedResult,
  load: loadSeed,
  refetch: refetchSeed
} = useLazyQuery(
  CURRENT_SEED_PAIR_QUERY,
  { gameKey: gameSlug },
  { fetchPolicy: 'no-cache' },
)

const currentSeedPair = computed(() => seedResult.value?.currentSeedPair)
const {
  mutate: newSeedMutate,
  loading: seedChangeLoading,
  onDone: onChangedSeed,
  onError: onSeedChangeError,
} = useMutation<{createNewSeedPair: SeedPair}>(CREATE_NEW_SEED_PAIR_MUTATION)
const newClientSeed = ref<string>(currentSeedPair.value?.clientSeed?.client_seed || '')

const generateSeed = async (length = 16) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)

  return Array.from(array, byte => charset[byte % charset.length]).join('')
}

const handleSubmitNewClientSeed = async () => {
  if (!newClientSeed.value || newClientSeed.value === '') {
    newClientSeed.value = await generateSeed()
  }

  await newSeedMutate({
    newClientSeed: newClientSeed.value,
    gameKey: gameSlug.value,
  })
}

onChangedSeed((result) => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: t('notifications.client-seed-changed-desc'),
  })

  newClientSeed.value = ''
  refetchSeed()
})

onSeedChangeError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: 'Server Error!',
    description: parsedError.message,
  })
})

onMounted(() => {
  loadSeed()
})
</script>

<template>
  <div class="FairnessSeeds w-full">
    <SkeletonSeedsRow v-if="seedLoading" />

    <div
      v-else-if="currentSeedPair"
      class="w-full flex flex-col gap-y-3 lg:gap-y-4"
    >
      <div class="w-full text-sm">
        <label class="font-bold text-white">
          {{ t('bets.active-server-seed-hashed') }}
        </label>
        <CopyInput
          :model-value="currentSeedPair.serverSeed.server_seed_hashed"
        />
      </div>
      <div class="w-full text-sm">
        <label class="font-bold text-white">
          {{ t('bets.active-client-seed') }}
        </label>
        <CopyInput
          :model-value="currentSeedPair.clientSeed.client_seed"
        />
      </div>
      <div class="w-full text-sm">
        <label class="font-bold text-white">
          {{ t('bets.nonce') }}
        </label>
        <CopyInput
          :model-value="currentSeedPair.clientSeed.nonce"
        />
      </div>
      <hr class="w-full border border-border">
      <div class="w-full flex flex-col gap-1">
        <label class="font-bold text-white text-base leading-none!">
          {{ t('bets.rotate-seed-pair') }}
        </label>
        <div class="text-paragraph text-xs leading-none!">
          Rotating your seed pair re-randomizes results in the game and allows you to verify bets placed under the
          previous seed. Each game has its own seed pair.
        </div>
      </div>
      <form
        class="w-full text-sm"
        @submit.prevent="handleSubmitNewClientSeed"
      >
        <label class="font-bold text-white">
          {{ t('bets.set-new-client-seed') }}
        </label>
        <div class="w-full flex items-center justify-between gap-x-1 lg:gap-x-2">
          <UInput
            v-model="newClientSeed"
            autofocus
            class="w-9/12"
            placeholder="Enter a client seed or leave blank to randomize"
            size="xl"
          />
          <JButton
            :loading="seedChangeLoading"
            class="h-10 w-3/12"
            type="submit"
          >
            {{ t('base.change') }}
          </JButton>
        </div>
      </form>
    </div>
    <div v-else>
      {{ t('errors.SOMETHING_WENT_WRONG') }}
    </div>
  </div>
</template>
