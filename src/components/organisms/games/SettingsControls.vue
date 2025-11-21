<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { GAME } from '~/constants'
import { useGameSettingStore } from '~/store/games/settings'
import { BETS_TICKET_ICON } from '~/components/symbols'

const { open = false } = defineProps<{
  open: boolean;
}>()

const emit = defineEmits(['close'])

const { t } = useI18n()
const router = useRouter()
const store = useGameSettingStore()
const { instantMode } = inject(GAME)!
const volume = computed({
  get () {
    return store.audioVolume.value
  },
  set (v) {
    store.setAudioVolume((typeof v === 'object') ? v[0] : v)
  }
})
const hotKey = computed({
  get () {
    return store.hotKey.value
  },
  set () {
    store.toggleHotKey()
  }
})

const openHotkeyModal = () => {
  if (hotKey.value) {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        modal: 'hotkey',
      },
    })

    nextTick(() => {
      emit('close')
    })
  }
}

const mute = () => {
  const vol = volume.value === 0 ? 0.1 : 0
  store.setAudioVolume(vol)
}

const handleInstantBet = () => {
  store.toggleInstantBet()
  instantMode.value = !instantMode.value
}

const handleHotkey = () => {
  hotKey.value = !hotKey.value
}

const [popoverParent] = useAutoAnimate({
  duration: 150
})

const volIcon = computed(() => {
  if (volume.value <= 0) {
    return 'bxs:volume-mute'
  }

  if (volume.value <= 1) {
    return 'bxs:volume'
  }

  if (volume.value <= 30) {
    return 'bxs:volume-low'
  }

  return 'bxs:volume-full'
})
</script>

<template>
  <div
    ref="popoverParent"
    class="w-full h-full p-0 m-0"
    @click.stop
  >
    <div
      v-if="open"
      class="flex flex-col gap-1.5 p-2 lg:p-3 w-[200px] relative text-paragraph text-xs font-bold"
    >
      <div class="flex items-center gap-x-1">
        <UIcon
          :name="volIcon"
          class="w-4 h-4 min-w-4 min-h-4 hover:text-white"
          @click="mute"
        />

        <USlider
          v-model="volume"
          size="sm"
        />

        <span class="leading-none">{{ Math.round(volume) }}%</span>
      </div>
      <div
        class="flex items-center justify-between w-full"
        @click="handleHotkey"
      >
        <span class="flex items-center gap-x-1 leading-none hover:text-white">
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
            name="bi:keyboard-fill"
          />

          {{ hotKey ? t('games.tool-hotkeys-disable') : t('games.tool-hotkeys') }}

          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
            name="i-heroicons-information-circle-20-solid"
            @click="openHotkeyModal"
            @click.stop
          />
        </span>

        <JbCheckbox
          :model-value="hotKey"
        />
      </div>
      <div
        class="flex items-center justify-between w-full"
        @click="handleInstantBet"
      >
        <span class="flex items-center gap-x-1 leading-none hover:text-white">
          <svg
            class="w-4 h-4 min-w-4 min-h-4"
          >
            <use :href="BETS_TICKET_ICON" />
          </svg>

          {{ instantMode ? t('games.tool-instant-bets-disable') : t('games.tool-instant-bets') }}
        </span>

        <JbCheckbox
          :model-value="instantMode"
        />
      </div>
    </div>
  </div>
</template>
