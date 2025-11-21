<script lang="ts" setup>
import { VIP, MODALS } from '~/constants'

const { wageredAllTime, refetch } = inject(VIP)!

const { chatLockedModalVisible } = inject(MODALS)!
const router = useRouter()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!

const handlePlay = () => {
  chatLockedModalVisible.value = false
  nextTick(() => {
    router.push(localePath(redirectHome))
  })
}

onMounted(() => {
  refetch()
})
</script>
<template>
  <div class="LiveChatLocked">
    <div
      class="g-mb-md text-sm"
      style="line-height: 18px"
    >
      Sorry! To ensure the quality of our community chat, users are required to
      have wagered a minimum of
      <span class="text-primary">$50</span> before sending messages.<br><br>Total
      Wagered: <span class="text-primary">${{ wageredAllTime.toFixed(2) }}</span><br><br>
      Keep playing, and you'll gain chat access soon! If you have any questions
      or need assistance, please reach out to our support team.
    </div>
    <div class="flex gap-4">
      <JButton
        class="flex-1"
        @click="handlePlay"
      >
        Play Now
      </JButton>
    </div>
  </div>
</template>
