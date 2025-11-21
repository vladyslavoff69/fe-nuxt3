<script lang="ts" setup>
import { AUTH, CURRENCY, PREFERENCE } from '~/constants'
import { SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'
import FiatCurrencyPopover from '~/components/organisms/wallets/popovers/FiatCurrencyPopover.vue'

const {
  contentHeight = 0,
  buttonClass = 'w-full pl-3 lg:pl-4 pr-2 lg:pr-3 py-3 rounded-md bg-green-950!',
} = defineProps<{
  contentHeight?: number;
  buttonClass?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}>()

const emits = defineEmits<{
  (e: 'update:fiatValue', value: string): void;
}>()

const { t } = useI18n()
const { me } = inject(AUTH)!
const { activeFiatCode, changedActiveCode } = inject(PREFERENCE)!
const { currentFiatCurrency } = inject(CURRENCY)!
const { mutate, onDone, onError, loading } = useMutation(SAVE_USER_PREFERENCES_MUTATION)
const openPopover = ref(false)

const form = reactive({
  activeFiatCode: activeFiatCode.value || 'USD',
})

const onSelect = async (code: string) => {
  form.activeFiatCode = code
  await mutate({
    ...me.value?.preferences,
    activeFiatCode: form.activeFiatCode,
  }, {
    optimisticResponse: {
      saveUserPreferences: {
        __typename: me.value?.__typename || 'User',
        id: me.value?.id || 0,
        preferences: {
          ...me.value?.preferences,
          activeFiatCode: form.activeFiatCode
        }
      }
    }
  })

  openPopover.value = false
}

onDone(({ data }) => {
  changedActiveCode.value = true

  emits('update:fiatValue', data?.saveUserPreferences?.preferences?.activeFiatCode)
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})
</script>

<template>
  <ClientOnly>
    <UPopover
      v-model:open="openPopover"
      :content="{
      side: !!position ? position : 'bottom'
    }"
      :arrow="true"
      class="w-[calc(100%-56px)]"
    >
      <JButton
        :class="[buttonClass]"
        :disabled="loading"
        label-class="justify-between gap-x-2 sm:gap-x-3"
        variant="alternative"
      >
      <span
        v-if="currentFiatCurrency"
        class="inline-flex gap-x-1.5 sm:gap-x-2 items-center w-full"
      >
        <UIcon
          v-if="currentFiatCurrency?.iconType === 'ui'"
          :name="currentFiatCurrency?.icon"
          class="h-6 w-6 min-w-6 min-h-6"
        />
        <svg
          v-else-if="currentFiatCurrency?.iconType === 'symbol'"
          class="h-6 w-6 min-w-6 min-h-6"
        >
          <use :href="currentFiatCurrency?.icon" />
        </svg>
        <UAvatar
          v-else
          :alt="currentFiatCurrency?.name || 'fiat'"
          :src="currentFiatCurrency?.logo"
          class="h-6 w-6 min-w-6 min-h-6"
          img-class="w-6 h-6"
          size="sm"
        />
        <span
          class="text-sm text-white font-bold"
        >{{ currentFiatCurrency?.code }}</span>
      </span>

        <template #endIcon>
        <span class="w-6 h-6 min-w-6 min-h-6 text-paragraph hover:text-white p-0 flex items-center">
          <UIcon
            v-if="openPopover"
            class="h-6 w-6 min-w-6 min-h-6"
            name="i-heroicons-chevron-up-20-solid"
          />
          <UIcon
            v-else
            class="h-6 w-6 min-w-6 min-h-6"
            name="i-heroicons-chevron-down-20-solid"
          />
        </span>
        </template>
      </JButton>

      <template #content>
        <FiatCurrencyPopover
          :content-height="contentHeight"
          @selected:currency="onSelect($event)"
        />
      </template>
    </UPopover>
  </ClientOnly>
</template>
