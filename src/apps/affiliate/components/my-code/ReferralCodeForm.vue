<script lang="ts" setup>
import { helpers, maxLength, maxValue, minLength, minValue, required, } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { CONTAINER } from '~/constants'
import { CREATE_SPONSOR_CODE_MUTATION } from '~/graphql'
import CommissionShareModal from '~/apps/affiliate/components/my-code/CommissionShareModal.vue'

const emits = defineEmits<{ (e: 'refetch-codes'): void; }>()
const { t } = useI18n()
const checkNameLetters = helpers.regex(/^[a-zA-Z0-9]+$/)

const { containerScreen } = inject(CONTAINER)!
const isModalVisible = ref<boolean>(false)
const codeErrorString = ref<string>('')
const percentBackErrorString = ref<string>('')
const isCodeCreated = ref<boolean>(false)
const isCodeError = computed(() => !!codeErrorString.value)
const isPercentBackError = computed(() => !!percentBackErrorString.value)

const form = reactive({
  percentBack: '',
  code: '',
})

const rules = {
  percentBack: {
    required,
    minValue: minValue(0),
    maxValue: maxValue(95),
  },
  code: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(15),
    checkNameLetters,
  },
}

const v$ = useVuelidate(rules, form)

const {
  loading: codeCreationLoading,
  onDone: onCodeCreated,
  onError: onCodeCreationError,
  mutate: codeCreateMutate,
} = useMutation(CREATE_SPONSOR_CODE_MUTATION)

const createCode = async () => {
  if (codeCreationLoading.value) {
    return
  }

  const validate = await v$.value.$validate()
  if (validate) {
    await codeCreateMutate({
      code: form.code,
      percentBack: Number(form.percentBack),
    })
  }
}

onCodeCreated(() => {
  emits('refetch-codes')
  isCodeCreated.value = true
  form.percentBack = ''
  form.code = ''
})

onCodeCreationError(({ graphQLErrors }) => {
  if (
    Array.isArray(graphQLErrors) &&
    graphQLErrors[0]?.extensions?.validation
  ) {
    const validationErrors = graphQLErrors[0]?.extensions?.validation
    if (Array.isArray(validationErrors['input.code'])) {
      codeErrorString.value = validationErrors['input.code'][0]
    }
    if (Array.isArray(validationErrors['input.percentBack'])) {
      percentBackErrorString.value = validationErrors['input.percentBack'][0]
    }
  } else {
    useGeneralNotify({
      type: 'error',
      title: 'Server Error!',
      description: t('errors.SOMETHING_WENT_WRONG_RELOAD')
    })
  }
})
const inputPercentBack = async () => {
  percentBackErrorString.value = ''
  if (!isCodeCreated.value) {
    await v$.value.percentBack.$validate()
  }
  isCodeCreated.value = false
}

const inputCode = async () => {
  percentBackErrorString.value = ''
  if (!isCodeCreated.value) {
    await v$.value.code.$validate()
  }
  isCodeCreated.value = false
}

const openModal = () => {
  isModalVisible.value = true
}

const onCloseModal = () => {
  isModalVisible.value = false
}
</script>
<template>
  <div class="bg-green-950 rounded-md p-4 md:p-5">
    <form @submit.prevent="createCode">
      <div
        class="flex gap-4 md:gap-5 items-start flex-col md:flex-row"
      >
        <div class="flex flex-col justify-center gap-2.5 w-full">
          <span
            class="text-white text-sm font-bold"
          >
            {{ t('affiliate.set-sc-code') }}
          </span>
          <UInput
            v-model="form.code"
            :status="v$.code.$error && !isCodeCreated ? 'error' : 'normal'"
            class="w-full bg-brand! h-10 text-sm! border-none!"
            color="neutral"
            placeholder="Enter Code"
            size="xl"
            type="text"
            @update:model-value="inputCode"
          />
          <JbInputMessage
            v-if="(v$.code.$error || isCodeError) && !isCodeCreated"
            class="mt-0!"
          >
            {{
              isCodeError
                ? codeErrorString
                : v$.code.minLength.$invalid
                  ? t('affiliate.sc-min-length')
                  : v$.code.maxLength.$invalid
                    ? t('affiliate.sc-max-length')
                    : v$.code.checkNameLetters.$invalid
                      ? t('affiliate.sc-invalid')
                      : t('affiliate.sc-required')
            }}
          </JbInputMessage>
        </div>
        <div class="flex flex-col justify-center w-full gap-2.5">
          <div class="flex flex-row gap-2 items-center group/help">
            <div
              class="
                text-sm md:text-base flex items-center group-active/help:scale-95 cursor-pointer
                hover:text-white text-paragraph duration-150
              "
              @click="openModal()"
            >
              <div
                class="
                  rounded-full w-3.5 h-3.5 md:w-4 md:h-4 bg-border flex items-center justify-center mr-[5px]
                "
              >
                <UIcon
                  class="h-2.5 w-2.5 min-w-2.5 min-h-2.5 text-paragraph hover:text-white cursor-help"
                  name="ic:round-question-mark"
                />
              </div>
              <span
                v-if="containerScreen.md"
                class="text-white text-sm font-bold"
              >
                {{
                  containerScreen.lxl
                    ? "Commission Share Percentage (%)"
                    : "Commission Share"
                }}
              </span>
              <span
                v-else
                class="text-white text-sm"
              >
                {{ t('affiliate.cmm-share-percent') }} (%)
              </span>
            </div>
          </div>
          <UInput
            v-model="form.percentBack"
            :status="v$.percentBack.$error && !isCodeCreated ? 'error' : 'normal'"
            class="w-full bg-brand! h-10 text-sm! border-none!"
            color="neutral"
            placeholder="0-95%"
            size="xl"
            type="number"
            @update:model-value="inputPercentBack"
          />
          <JbInputMessage
            v-if="
              (v$.percentBack.$error || isPercentBackError) && !isCodeCreated
            "
            class="mt-0!"
          >
            {{
              isPercentBackError
                ? percentBackErrorString
                : v$.percentBack.required.$invalid
                  ? t('affiliate.sp-required')
                  : t('affiliate.sc-invalid')
            }}
          </JbInputMessage>
        </div>
        <JButton
          :disabled="codeCreationLoading"
          :loading="codeCreationLoading"
          class="md:w-auto w-full flex-none md:mt-8 min-w-24"
          type="submit"
          variant="outline"
        >
          {{ t("affiliate.create") }}
        </JButton>
      </div>
    </form>
    <!--  modal  -->
    <ClientOnly>
      <UModal
        v-model:open="isModalVisible"
        :default-open="isModalVisible"
        class="bg-brand w-11/12 md:w-[416px] p-2 sm:p-4"
      >
        <template #content>
          <CommissionShareModal @close:modal="onCloseModal" />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
