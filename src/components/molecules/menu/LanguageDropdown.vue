<script lang="ts" setup>
import { AUTH, SITE_SETTINGS, THEME } from '~/constants'
import { SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'

const {
  selectedPath = ''
} = defineProps<{
  selectedPath?: string;
}>()

const emits = defineEmits([
  'update:selectedPath'
])

const { screen } = inject(THEME)!
const { me, isLoggedIn } = inject(AUTH)!
const { t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const { isSidebarOpen, languages, toggleSidebar } = inject(SITE_SETTINGS)!
const existingPreferenceData: any = computed(() => me.value?.preferences || {})

const isOpened = computed(() => selectedPath && selectedPath === 'languages-dropdown')

const {
  mutate: saveUserPreferences,
  onDone,
  onError,
  loading,
} = useMutation(SAVE_USER_PREFERENCES_MUTATION)

onDone(async () => {
  try {
    useGeneralNotify({
      type: 'success',
      title: t('notifications.success'),
      description: t('notifications.your-changes-updated')
    })
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

const handleSidebar = () => {
  toggleSidebar()
}

const state = ref(false)
const setState = (v: boolean) => {
  state.value = v
  emits('update:selectedPath', 'languages-dropdown')
}

const formData = reactive({
  languageCode: (
    (existingPreferenceData.value.languageCode && typeof existingPreferenceData.value.languageCode !== 'string')
      ? 'en'
      : (existingPreferenceData.value.languageCode ? existingPreferenceData.value.languageCode : 'en')
  )
})

watch(
  () => existingPreferenceData.value.languageCode,
  (_updatedLang) => {
    formData.languageCode = _updatedLang
  },
)

const selectedLang = computed(() => {
  return languages.value?.filter(item => item.code === formData.languageCode)[0] || { icon: 'i-ion-globe-outline' }
})

const onSubmit = (value: string) => {
  if (isLoggedIn.value) {
    if (!loading.value) {
      const existingPreferences = me.value?.preferences
      formData.languageCode = value
      saveUserPreferences({
        ...existingPreferences,
        languageCode: value
      })
    }
  }

  // @ts-ignore
  navigateTo(switchLocalePath(value))

  close()
}

const toggleState = () => {
  setState(!state.value)
  if (!isSidebarOpen.value) {
    handleSidebar()
  }
}
</script>
<template>
  <ClientOnly>
    <div
      :class="{
        'bg-border text-white!': isOpened, // || state
        'gap-x-2 md:justify-between px-4': isSidebarOpen,
        'gap-x-1 md:justify-center': !isSidebarOpen,
      }"
      class="relative cursor-pointer rounded-md md:py-2 group flex items-center text-sm text-paragraph min-h-10"
      @click="toggleState"
    >
      <UPopover
        class="w-full group"
        :content="{ side: screen.md ? 'bottom' : 'top' }"
      >
        <div
          :class="{
            'md:justify-center': !isSidebarOpen,
            'gap-x-2': isSidebarOpen,
          }"
          class="md:group-hover:text-white min-h-6 transition-all duration-100 ease-in-out flex items-center w-full"
          @click.stop
        >
          <UIcon
            :name="selectedLang.icon || 'i-ion-globe-outline'"
            class="w-4 h-4 min-w-4 min-h-4"
          />
          <span
            v-if="isSidebarOpen"
          >
            {{ selectedLang?.label ? selectedLang.label : t('menu.language') }}
          </span>
        </div>
        <template #content>
          <div class="min-w-52 md:py-2">
            <div
              v-for="(item, i) in languages"
              :key="`ld-4-${i}`"
              class="px-3"
            >
              <div
                :class="{
                  'bg-green-950': item.lang === formData.languageCode
                }"
                class="
                  flex flex-row items-center gap-x-2 py-1.5 md:py-2 text-paragraph cursor-pointer hover:text-white
                  active:scale-95 group text-sm pl-1
                "
                @click.prevent="onSubmit(item.lang)"
              >
                <UIcon
                  :name="item.icon"
                  class="w-3.5 h-3.5"
                />
                <span>{{ item.display }}</span>
              </div>
            </div>
          </div>
        </template>
      </UPopover>
    </div>
  </ClientOnly>
</template>
