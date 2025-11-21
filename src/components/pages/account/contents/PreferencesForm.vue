<script lang="ts" setup>
import InputCheckbox from '~/components/molecules/common/InputCheckbox.vue'
import { AUTH, SITE_SETTINGS } from '~/constants'
import { SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'

const { t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const { me, isLoggedIn } = inject(AUTH)!
const { languages } = inject(SITE_SETTINGS)!

const existingPreferenceData: any = computed(() => me.value?.preferences || {})

const formData = reactive({
  displayInfiatEnabled: existingPreferenceData.value.displayInfiatEnabled || false,
  hideAllProfileInformation: existingPreferenceData.value.hideAllProfileInformation || false,
  languageCode: existingPreferenceData.value.languageCode || 'en',
  hideMyUsername: existingPreferenceData.value.hideMyUsername || false,
  ghostMode: existingPreferenceData.value.ghostMode || false,
  hideMyBio: existingPreferenceData.value.hideMyBio || false,
  hideMysocialLinks: existingPreferenceData.value.hideMysocialLinks || false,
  hideOnlineStatus: existingPreferenceData.value.hideOnlineStatus || false,
  hideMyGamingActivity: existingPreferenceData.value.hideMyGamingActivity || false,
  hideMyBattleRewards: existingPreferenceData.value.hideMyBattleRewards || false,
  hideBets: existingPreferenceData.value.hideBets || false,
  hideWageredAmounts: existingPreferenceData.value.hideWageredAmounts || false,
  hideFollowers: existingPreferenceData.value.hideFollowers || false,
  hideFollowedUsers: existingPreferenceData.value.hideFollowedUsers || false,
})

watch(
  () => existingPreferenceData.value,
  (_exisintPreferenceData) => {
    if (_exisintPreferenceData) {
      formData.displayInfiatEnabled = existingPreferenceData.value.displayInfiatEnabled || false
      formData.languageCode = existingPreferenceData.value.languageCode || 'en'
      formData.hideAllProfileInformation = existingPreferenceData.value.hideAllProfileInformation || false
      formData.hideMyUsername = existingPreferenceData.value.hideMyUsername || false
      formData.ghostMode = existingPreferenceData.value.ghostMode || false
      formData.hideMyBio = existingPreferenceData.value.hideMyBio || false
      formData.hideMysocialLinks = existingPreferenceData.value.hideMysocialLinks || false
      formData.hideOnlineStatus = existingPreferenceData.value.hideOnlineStatus || false
      formData.hideMyGamingActivity = existingPreferenceData.value.hideMyGamingActivity || false
      formData.hideMyBattleRewards = existingPreferenceData.value.hideMyBattleRewards || false
      formData.hideBets = existingPreferenceData.value.hideBets || false
      formData.hideWageredAmounts = existingPreferenceData.value.hideWageredAmounts || false
      formData.hideFollowers = existingPreferenceData.value.hideFollowers || false
      formData.hideFollowedUsers = existingPreferenceData.value.hideFollowedUsers || false
    }
  }
)

const langFlag = computed(() => {
  if (formData.languageCode !== '') {
    return languages.value?.filter(item => item.code === formData.languageCode)[0]?.icon || 'i-ion-globe-outline'
  }

  return 'i-ion-globe-outline'
})

const {
  mutate: saveUserPreferences,
  onDone,
  onError,
  loading,
} = useMutation(SAVE_USER_PREFERENCES_MUTATION)

const onSubmit = () => {
  if (!isLoggedIn.value) {
    return
  }

  saveUserPreferences({
    ...me.value?.preferences,
    ...formData
  })
}

onDone(async () => {
  try {
    useGeneralNotify({
      type: 'success',
      title: t('notifications.success'),
      description: t('notifications.your-changes-updated')
    })

    navigateTo(switchLocalePath(formData.languageCode))
  } catch (e) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-modification'),
      description: t('errors.SOMETHING_WENT_WRONG_RELOAD')
    })
  }
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message,
  })
})
</script>

<template>
  <div class="flex flex-col gap-y-6">
    <div class="grid gap-y-2 sm:gap-y-3">
      <h3 class="text-base sm:text-lg font-bold">
        {{ t('currency.currencies') }}
      </h3>
      <div class="grid gap-y-2 sm:gap-y-4">
        <InputCheckbox
          v-model="formData.displayInfiatEnabled"
        >
          <span
            class="cursor-pointer text-sm text-white m-0"
          >{{ t('account.view-in-fiat') }}</span>
        </InputCheckbox>
      </div>
    </div>
    <div class="grid gap-y-2 sm:gap-y-3">
      <h3 class="text-base sm:text-lg font-bold">
        {{ t('menu.language') }}
      </h3>
      <USelect
        v-model="formData.languageCode"
        :icon="langFlag"
        :items="languages"
        :placeholder="t('base.choose-language')"
        :arrow="true"
        class="w-full max-w-[300px] bg-green-950! text-sm! border-none! h-12! font-bold text-white"
        label-key="label"
        size="xl"
        value-key="code"
      />
    </div>
    <div class="grid gap-y-5">
      <div class="grid gap-y-3">
        <h3 class="text-base sm:text-lg font-bold">
          {{ t('base.privacy') }}
        </h3>
        <p class="text-sm">
          {{ t('account.profile-public-appearance-limits') }}
        </p>
      </div>
      <div class="grid gap-y-5">
        <div class="grid gap-y-2 sm:gap-y-3">
          <h4 class="text-sm sm:text-base font-bold">
            {{ t('base.hide-all') }}
          </h4>
          <div class="flex items-center">
            <InputCheckbox
              v-model="formData.hideAllProfileInformation"
            >
              <div class="cursor-pointer text-sm">
                <span
                  class="sm:text-white m-0 mr-1"
                >{{ t('account.hide-profile-information') }} </span>
              </div>
            </InputCheckbox>
            <JbBlankButton class="text-sm">
              {{ t('account.appear-anonymous') }}.
            </JbBlankButton>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-y-5">
          <div class="flex-1 flex flex-col gap-y-2 sm:gap-y-3">
            <h4 class="text-sm sm:text-base font-bold">
              {{ t('account.user-information') }}
            </h4>
            <div class="grid gap-y-2 sm:gap-y-4">
              <div class="flex items-center">
                <InputCheckbox
                  v-model="formData.hideMyUsername"
                >
                  <div class="cursor-pointer text-sm">
                    <span
                      class="sm:text-white m-0 mr-1"
                    >{{ t('account.hide-username') }}</span>
                  </div>
                </InputCheckbox>
                <JbBlankButton class="text-sm">
                  {{ t('account.appear-anonymous') }}.
                </JbBlankButton>
              </div>
              <InputCheckbox
                v-model="formData.ghostMode"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-profile-photo') }}</span>
              </InputCheckbox>
              <InputCheckbox
                v-model="formData.hideMyBio"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-bio') }}</span>
              </InputCheckbox>
              <InputCheckbox
                v-model="formData.hideMysocialLinks"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-social-links') }}</span>
              </InputCheckbox>
            </div>
          </div>
          <div class="flex-1 grid gap-y-2 sm:gap-y-3">
            <h4 class="text-sm sm:text-base font-bold">
              {{ t('base.activity') }}
            </h4>
            <div class="grid gap-y-2 sm:gap-y-4">
              <InputCheckbox
                v-model="formData.hideOnlineStatus"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-online-status') }}</span>
              </InputCheckbox>
              <InputCheckbox
                v-model="formData.hideMyGamingActivity"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-gaming-activity') }}</span>
              </InputCheckbox>
              <InputCheckbox
                v-model="formData.hideMyBattleRewards"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-battles-rewards') }}</span>
              </InputCheckbox>
              <InputCheckbox
                v-model="formData.hideBets"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-bets') }}</span>
              </InputCheckbox>
              <InputCheckbox
                v-model="formData.hideWageredAmounts"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-wagered-amounts') }}</span>
              </InputCheckbox>
              <InputCheckbox
                v-model="formData.hideFollowers"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-followers') }}</span>
              </InputCheckbox>
              <InputCheckbox
                v-model="formData.hideFollowedUsers"
              >
                <span
                  class="cursor-pointer text-sm sm:text-white m-0"
                >{{ t('account.hide-followed-users') }}</span>
              </InputCheckbox>
            </div>
          </div>
        </div>
        <div>
          <JButton
            :loading="loading"
            class="sm:max-w-[300px] w-full h-11"
            variant="primary"
            @click="onSubmit"
          >
            {{ t('base.save-change') }}
          </JButton>
        </div>
      </div>
    </div>
  </div>
</template>
