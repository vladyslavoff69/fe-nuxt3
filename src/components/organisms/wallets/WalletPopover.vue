<script lang="ts" setup>
import { AUTH, CURRENCY, META, PREFERENCE, SITE_SETTINGS, THEME } from '~/constants'
import { SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'
import Balances from '~/components/organisms/wallets/popovers/Balances.vue'
import { numberWithCommas } from '~/utils'

const { me } = inject(AUTH)!
const { t } = useI18n()
const { screen } = inject(THEME)!
const { isInHousePlaying } = inject(SITE_SETTINGS)!
const inHouseCasinoPlaying = computed(() => isInHousePlaying.value)
const { activeCryptoCode, displayInfiatEnabled, changedActiveCode } = inject(PREFERENCE)!
const {
  currentCryptoBalance,
  currentFiatBalance,
  currentFiatCurrency,
  currentCryptoCurrency,
  prevCryptoBalance,
  prevFiatBalance,
} = inject(CURRENCY)!
const { inGamePage } = inject(META)!
const { mutate, onError, onDone } = useMutation(SAVE_USER_PREFERENCES_MUTATION)
const currentFiatBalanceFormatted = computed(() => numberWithCommas(Number((Math.floor(currentFiatBalance.value * 100) / 100).toFixed(2))))
const router = useRouter()
const openPopover = ref(false)
const pCryptoBalance = computed(() => prevCryptoBalance.value)
const pFiatBalance = computed(() => prevFiatBalance.value)
const pFiatBalanceFormatted = computed(() => numberWithCommas(Number((Math.floor(pFiatBalance.value * 100) / 100).toFixed(2))))

const onSelect = (code: string) => {
  mutate({
    ...me.value?.preferences,
    activeCryptoCode: code,
  }, {
    optimisticResponse: {
      saveUserPreferences: {
        __typename: me.value?.__typename || 'User',
        id: me.value?.id || 0,
        preferences: {
          ...me.value?.preferences,
          activeCryptoCode: code
        }
      }
    }
  })

  openPopover.value = false
}

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

onDone(() => {
  changedActiveCode.value = true
})
</script>

<template>
  <ClientOnly>
    <UPopover
      v-model:open="openPopover"
      :arrow="screen.md"
    >
      <div
        class="
        flex items-center justify-center gap-x-2
        rounded-md lg:rounded-tr-none lg:rounded-br-none
        bg-brand px-2 sm:px-3 py-0.5 text-xxs sm:text-sm
        font-medium text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white/75
        relative h-10 ring-1 ring-brand
      "
      >
        <div
          v-if="!inGamePage"
          class="flex items-center gap-x-1 w-full text-xs sm:text-sm font-bold leading-none!"
        >
          <template v-if="displayInfiatEnabled && !!currentFiatCurrency">
            <UIcon
              v-if="currentFiatCurrency?.iconType === 'ui'"
              :name="currentFiatCurrency?.icon"
              class="w-5 h-5 min-h-5 min-w-5"
            />
            <svg
              v-else-if="currentFiatCurrency?.iconType === 'symbol'"
              class="w-5 h-5 min-h-5 min-w-5"
            >
              <use :href="currentFiatCurrency?.icon" />
            </svg>
            <UAvatar
              v-else
              :alt="currentFiatCurrency?.name"
              :src="currentFiatCurrency?.logo"
              class="w-5 h-5 min-h-5 min-w-5"
              img-class="w-5 h-5"
              size="sm"
            />
          </template>
          <template v-else-if="!!currentCryptoCurrency">
            <UIcon
              v-if="currentCryptoCurrency?.iconType === 'ui'"
              :name="currentCryptoCurrency?.icon"
              class="w-5 h-5 min-h-5 min-w-5"
            />
            <svg
              v-else-if="currentCryptoCurrency?.iconType === 'symbol'"
              class="w-5 h-5 min-h-5 min-w-5"
            >
              <use :href="currentCryptoCurrency?.icon" />
            </svg>
            <UAvatar
              v-else
              :alt="currentCryptoCurrency?.name"
              :src="currentCryptoCurrency?.logo"
              class="w-5 h-5 min-h-5 min-w-5"
              img-class="w-5 h-5"
              size="sm"
            />
          </template>

          <div
            v-if="displayInfiatEnabled && !!currentFiatCurrency"
            class="leading-none! max-w-20 lg:max-w-full text-md truncate"
          >
            {{ currentFiatCurrency?.symbol }}{{ inHouseCasinoPlaying ? pFiatBalanceFormatted : currentFiatBalanceFormatted }}
          </div>

          <template v-if="!displayInfiatEnabled">
            <div
              v-if="inHouseCasinoPlaying"
              class="leading-none! max-w-20 lg:max-w-full text-md truncate"
            >
              {{
                Math.floor(pCryptoBalance)
              }}.{{
                (pCryptoBalance - Math.floor(pCryptoBalance)).toFixed(8).slice(2)
              }}
            </div>
            <div
              v-else
              class="leading-none! max-w-20 lg:max-w-full text-md truncate"
            >
              {{
                Math.floor(currentCryptoBalance)
              }}.{{
                (currentCryptoBalance - Math.floor(currentCryptoBalance)).toFixed(8).slice(2)
              }}
            </div>
          </template>
        </div>
        <div
          v-else-if="!!currentCryptoCurrency"
          class="flex items-center gap-x-1 w-full text-xs sm:text-sm font-bold leading-none"
        >
          <span class="">({{ t('games.in-play') }})</span>

          <UIcon
            v-if="currentCryptoCurrency?.iconType === 'ui'"
            :name="currentCryptoCurrency?.icon"
            class="w-5 h-5 min-h-5 min-w-5"
          />
          <svg
            v-else-if="currentCryptoCurrency?.iconType === 'symbol'"
            class="w-5 h-5 min-h-5 min-w-5"
          >
            <use :href="currentCryptoCurrency?.icon" />
          </svg>
          <UAvatar
            v-else
            :alt="currentCryptoCurrency?.name"
            :src="currentCryptoCurrency?.logo"
            class="w-5 h-5 min-h-5 min-w-5"
            img-class="w-5 h-5"
            size="sm"
          />

          <span>{{ activeCryptoCode }}</span>
        </div>

        <div
          v-if="!inGamePage && displayInfiatEnabled && !!currentFiatCurrency"
          class="leading-none! text-sm font-bold text-paragraph hidden sm:block"
        >
          {{ currentFiatCurrency?.code }}
        </div>

        <div
          v-if="!inGamePage && !displayInfiatEnabled"
          class="leading-none! text-sm font-bold text-paragraph hidden sm:block"
        >
          {{ activeCryptoCode }}
        </div>

        <div class="w-5 h-5 text-paragraph hover:text-white p-0 flex items-center">
          <UIcon
            v-if="openPopover"
            class="w-5 h-5 min-h-5 min-w-5"
            name="i-heroicons-chevron-up-20-solid"
          />
          <UIcon
            v-else
            class="w-5 h-5 min-h-5 min-w-5"
            name="i-heroicons-chevron-down-20-solid"
          />
        </div>
      </div>

      <template #content>
        <Balances
          :open="openPopover"
          @selected:token="onSelect($event)"
        />
      </template>
    </UPopover>
  </ClientOnly>
</template>
