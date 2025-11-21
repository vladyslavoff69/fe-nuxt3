<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import VipRankAvatar from '~/components/molecules/table/details/VipRankAvatar.vue'
import { AUTH, BET_DETAIL, GHOST_MODE_USERNAME } from '~/constants'
import type { Bet, Game, GameProvider, User } from '~/types'

const { t } = useI18n()
const { betDetail, modalType } = inject(BET_DETAIL)!
const betData = computed<Bet>(() => betDetail.value?.bet)
const betUser = computed<User>(() => betDetail.value?.user)
const betGame = computed<Game>(() => betDetail.value?.game)
const betGameProvider = computed<GameProvider>(() => betDetail.value?.provider)
const copyVisible = ref<boolean>(false)
const linkVisible = ref<boolean>(false)
let timer: ReturnType<typeof setTimeout> | undefined

const performClipboardAction = (
  textToCopy: string,
  action: 'copy' | 'link'
) => {
  navigator.clipboard.writeText(textToCopy)
  copyVisible.value = action === 'copy'
  linkVisible.value = action === 'link'

  clearTimeout(timer)
  timer = setTimeout(() => {
    copyVisible.value = linkVisible.value = false
  }, 1000)
}

const copyToClipboard = () => {
  const textToCopy = `/betid ${betData.value?.transaction_id}`
  performClipboardAction(textToCopy, 'copy')
}

const copyLink = () => {
  const textToCopy = `${window.location.origin}/?modal=bet&type=${modalType.value}&ref=${betData.value?.transaction_id}`
  performClipboardAction(textToCopy, 'link')
}

const { me } = inject(AUTH)!
const isModerator = computed(
  () => !!me.value?.roles?.some(role => [
    'superadmin', 'admin', 'developer', 'moderator'
  ].includes(role?.name?.toLowerCase()))
)

const isMyProfile = computed(() => {
  return me.value?.username === betUser.value?.username
})
</script>

<template>
  <div class="w-full flex flex-col justify-center items-center gap-y-3 lg:gap-y-4">
    <div class="w-full flex flex-col justify-center items-center gap-y-2 lg:gap-y-2.5">
      <div class="flex items-center gap-x-0.5">
        <NuxtLinkLocale
          :to="`/casino/games/${betGameProvider.slug}/${betGame.slug}`"
          class="text-white font-bold text-base"
        >
          {{ betData.game }}
        </NuxtLinkLocale>
        <NuxtLinkLocale
          :to="`/casino/provider/${betGameProvider.slug}`"
          class="font-bold hover:text-white"
        >
          ({{ betGameProvider.display_name }})
        </NuxtLinkLocale>
      </div>
      <div
        v-if="betUser?.display_name !== GHOST_MODE_USERNAME || isModerator || isMyProfile"
        class="text-center flex justify-center items-center gap-1 text-sm leading-none"
      >
        {{ t('games.bet') }} {{ t('base.id') }}: <span class="text-white font-bold">{{ betData.transaction_id }}</span>

        <UTooltip
          :content="{ side: 'top' }"
          arrow
          :text="copyVisible ? `${t('base.copied-chat')}!` : `${t('base.copy')} & Share`"
        >
          <div
            class="cursor-copy text-paragraph hover:text-white"
            @click="copyToClipboard"
          >
            <UIcon
              class="w-4 h-4 min-h-4 min-w-4"
              name="icon-park-solid:copy"
            />
          </div>
        </UTooltip>
        <UTooltip
          :content="{ side: 'top' }"
          arrow
          :text="linkVisible ? `${t('base.copied-link')}!` : `${t('base.copy')} Link`"
        >
          <div
            class="cursor-copy text-paragraph hover:text-white"
            @click="copyLink"
          >
            <UIcon
              class="w-4 h-4 min-h-4 min-w-4"
              name="ph:link-bold"
            />
          </div>
        </UTooltip>
      </div>

      <div
        v-if="betUser?.display_name !== GHOST_MODE_USERNAME || isModerator || isMyProfile"
        class="text-center flex justify-center items-center gap-1 text-sm leading-none"
      >
        On <span class="text-white font-semibold">
          {{ useDateFormat(new Date(betData.processed_at), "DD MMM, YYYY").value }} at
          {{ useDateFormat(new Date(betData.processed_at), "HH:mm A").value }}
        </span>
      </div>
    </div>
    <div class="w-full flex flex-col items-center gap-y-1 justify-center text-sm leading-none">
      <div class="w-full flex items-center gap-x-1 justify-center">
        <span>{{ t('casino.placed-by') }}</span>
        <VipRankAvatar
          :display-name="betUser?.display_name"
          :show-name="true"
          :username="betUser?.username"
          :vip-level-name="betUser?.vip_level_name"
        />
      </div>
    </div>
    <div class="flex items-center justify-center gap-x-4 w-full py-1">
      <hr class="border border-border w-1/3">
      <JbLogo class="w-24 lg:w-[156px] lg:h-8" />
      <hr class="border border-border w-1/3">
    </div>
  </div>
</template>
