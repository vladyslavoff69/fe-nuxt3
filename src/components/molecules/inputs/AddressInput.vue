<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { minLength } from '@vuelidate/validators'
import { SAVE_ADDRESS_MUTATION } from '~/graphql'
import type { Address } from '~/types'
import { THEME } from '~/constants'

const { modelValue } = defineProps<{
  modelValue: number | string;
  disabled?: boolean
  inputClass?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | ''): void;
}>()

const { t } = useI18n()
const { screen } = inject(THEME)!
const showAddressPopup = ref<boolean>(false)
const searchedAddresses = ref<Address[] | null>()
const addressFirstLoad = ref<boolean>(true)
const addressInputted = ref<boolean>(false)
const searchTimer = ref<any>(null)
const formData = reactive({
  address: modelValue,
  formatted_address: '',
  latitude: 0,
  longitude: 0,
  number: '',
  street: '',
  postalcode: '',
  subLocality: '',
  country_id: 0,
  state_id: 0,
  city_id: 0,
})
const v$ = useVuelidate({
  address: {
    minLength: minLength(3)
  }
}, formData)
const {
  addressLoad,
  addressLoading,
  addressReFetch,
  onAddressResult,
} = useAddress({
  input: formData.address || t('errors.WHITELIST_ADDRESS_REQUIRED')
})

const {
  mutate: mutateAddress,
  loading: loadingAddressMutate,
  onDone: onDoneAddressMutate,
} = useMutation(SAVE_ADDRESS_MUTATION)

watch(
  () => modelValue,
  (_address: string | number) => {
    formData.address = _address
  }
)

const inputAddress = async () => {
  addressInputted.value = true
  await v$.value.address.$validate()
}

const incorrectAddress = (val: Address) => {
  return val.formatted_address === '' || !val.formatted_address || !val.longitude || !val.latitude ||
    !val.country_id || !val.state_id || !val.city_id
}

onAddressResult(({ data }) => {
  searchedAddresses.value = data?.geocodeAddress?.filter(el => !(incorrectAddress(el)))
  showAddressPopup.value = true
})

onDoneAddressMutate(async ({ data }) => {
  showAddressPopup.value = false
  addressInputted.value = false
  formData.address = data?.saveAddress?.formatted_address
  emits('update:modelValue', data?.saveAddress?.formatted_address)
  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: t('notifications.your-address-changed')
  })
})

const clickAddressItem = (item: Address) => {
  showAddressPopup.value = false
  mutateAddress({
    formatted_address: item.formatted_address,
    latitude: item.latitude,
    longitude: item.longitude,
    number: item.number,
    street: item.street,
    postalcode: item.postalcode,
    subLocality: item.subLocality,
    country_id: typeof item.country_id === 'string' ? parseInt(item.country_id) : item.country_id,
    state_id: typeof item.state_id === 'string' ? parseInt(item.state_id) : item.state_id,
    city_id: typeof item.city_id === 'string' ? parseInt(item.city_id) : item.city_id,
  })
}

watch(
  () => formData.address,
  (_address) => {
    clearTimeout(searchTimer.value)
    if (!v$.value.address.$error && addressInputted.value) {
      searchTimer.value = setTimeout(() => {
        if (addressFirstLoad.value) {
          addressFirstLoad.value = false
          addressLoad()
        } else if (_address !== '' && String(_address).length > 2) {
          addressReFetch({
            input: _address
          })
        }
      }, 500)
    }
  }
)
</script>

<template>
  <UPopover
    v-model:open="showAddressPopup"
    :content="{ side: screen.md ? 'bottom' : 'top' }"
    :ui="{ content: 'w-(--reka-popper-anchor-width) p-1' }"
  >
    <template #default>
      <UInput
        v-model="formData.address"
        leading-icon="heroicons:magnifying-glass-20-solid"
        class="w-full h-11"
        color="primary"
        size="xl"
        type="text"
        :ui="{
          base: `border-none! bg-green-950 text-sm! h-11 text-paragraph! pl-10! ${inputClass}`
        }"
        :disabled="disabled"
        :placeholder="t('base.search')"
        @update:model-value="inputAddress"
      />
      <JbInputMessage
        v-if="v$.address.$error"
        class="h-4"
      >
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{ v$.address.minLength.$invalid ? t('errors.SPONSOR_CODE_MIN_LENGTH') : '' }}
      </JbInputMessage>
    </template>
    <template #content>
      <div class="py-2 px-3 w-full">
        <template v-if="!addressLoading && !loadingAddressMutate">
          <template
            v-if="searchedAddresses && searchedAddresses.length"
          >
            <div
              v-for="(addressEl, a) in searchedAddresses"
              :key="`ad-2-${a}`"
              class="
                flex items-center relative cursor-pointer select-none
                py-0.5 sm:py-2 hover:text-white pr-1 gap-x-2 hover:bg-border
              "
              @click="clickAddressItem(addressEl)"
            >
              <UIcon
                class="w-4 h-4 min-w-4 min-h-4"
                name="ion:location-sharp"
              />
              <p class="text-xs font-bold leading-4">
                {{ addressEl.formatted_address }}
              </p>
            </div>
          </template>
          <div
            v-else
            class="flex items-center"
            @click="showAddressPopup = false"
          >
            <UIcon
              class="w-4 h-4 min-w-4 min-h-4"
              name="ion:location-sharp"
            />
            <p class="text-xs font-bold leading-4">
              Hmm...looks like you don't live on Earth? Please enter a valid address (on Earth).
            </p>
          </div>
        </template>
        <p
          v-else
          class="text-xs font-bold leading-4"
        >
          Loading...
        </p>
      </div>
    </template>
  </UPopover>
</template>
