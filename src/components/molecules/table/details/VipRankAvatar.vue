<script lang="ts" setup>
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import { AUTH, GHOST_MODE_USERNAME, UNRANKED_VIP } from '~/constants'

const {
  vipLevelName = UNRANKED_VIP,
  svgSize = 'w-6 h-6 min-w-6 min-h-6',
  displayName = '',
  showName = false,
  username = ''
} = defineProps<{
  vipLevelName?: string;
  svgSize?: string;
  displayName?: string;
  showName?: boolean;
  username?: string;
}>()

const openMiniProfile = () => {
  navigateRoute({
    newQueries: {
      name: username,
      modal: 'user',
    }
  })
}

const { t } = useI18n()
const { me } = inject(AUTH)!
const isModerator = computed(
  () => !!me.value?.roles?.some(role => [
    'superadmin', 'admin', 'developer', 'moderator'
  ].includes(role?.name?.toLowerCase()))
)

const isMyProfile = computed(() => me.value?.username === username)
</script>

<template>
  <div class="flex gap-x-1 items-center">
    <template v-if="vipLevelName && vipLevelName !== '' && vipLevelName.toUpperCase() !== UNRANKED_VIP">
      <UTooltip
        v-if="(displayName !== GHOST_MODE_USERNAME) || isMyProfile || isModerator"
        :content="{ side: 'top' }"
        arrow
        :text="vipLevelName.toUpperCase()"
      >
        <VipRankImg
          :class="svgSize"
          :vip-level-name="vipLevelName"
        />
      </UTooltip>
      <UIcon
        v-else
        class="w-5 h-5 min-w-5 min-h-5"
        name="fa6-solid:user-secret"
      />
    </template>
    <template v-if="showName">
      <JbBlankButton
        v-if="(displayName !== GHOST_MODE_USERNAME) || isMyProfile || isModerator"
        class="cursor-pointer hover:text-white duration-150 truncate font-bold"
        @click="openMiniProfile"
      >
        {{ username }}
      </JbBlankButton>
      <UTooltip
        v-else
        :content="{ side: 'top' }"
        arrow
        :text="t('auth.incognito_mode_desc')"
      >
        <span class="font-bold text-sm leading-none!">
          {{ t('auth.anonymous') }}
        </span>
      </UTooltip>
    </template>
  </div>
</template>
