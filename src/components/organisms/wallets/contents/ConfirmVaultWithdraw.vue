<script lang="ts" setup>
import { maxLength, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import VerificationCode from '~/components/molecules/inputs/VerificationCode.vue'
import { AUTH, THEME } from '~/constants'

const props = defineProps({
  loading: Boolean,
  enable2fa: Boolean
})

const emit = defineEmits<{
  (e: 'close:modal'): void;
  (e: 'confirm:withdrawConfirm', value: any): void;
}>()

const { me } = inject(AUTH)!
const { screen } = inject(THEME)!
const verifyCode = ref<string>('')

const enabledGoogle2fa = computed(() => (props.enable2fa || me.value?.enable2fa))

const updateVerifyCode = async (value: string) => {
  verifyCode.value = value
  await v$.value.$validate()
}

const rules = computed(() => {
  return {
    verifyCode: { required, minLength: minLength(6), maxLength: maxLength(6) },
  }
})

const v$ = useVuelidate(rules, { verifyCode })

watch(() => verifyCode.value, (v) => {
  if (v && v.length === 6) {
    emit('confirm:withdrawConfirm', v)
  }
}, { immediate: true })
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4">
    <div class="w-full flex items-center justify-center p-3 lg:p-4 rounded-xl bg-paragraph/60">
      <div v-if="screen.lg">
        <VerificationCode
          input-class="bg-white! text-brand!"
          width="w-full h-auto min-h-12"
          @update:code="updateVerifyCode"
        />
      </div>
      <div v-else>
        <JInput
          v-model="verifyCode"
          :classes="{
            Input: 'w-full bg-white! px-4 text-sm! border-none! h-11! rounded! text-center text-brand!'
          }"
          type="text"
        />
      </div>
    </div>

    <JbInputMessage v-if="v$.verifyCode.$error">
      <UIcon
        class="w-4 h-4 min-w-4 min-h-4 text-red-600"
        name="i-heroicons-information-circle-20-solid"
      />
      {{ v$.verifyCode.$errors[0].$message }}
    </JbInputMessage>
  </div>
</template>
