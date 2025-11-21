<script lang="ts" setup>
import { useCountDown } from './hooks'
// import AccessSuspended from './AccessSuspended.vue'
import { AUTH } from '~/constants'
// import { microphoneSlashIcon } from '@/icons'

const { me, refetch } = inject(AUTH)!
const { timeLeft, timeLeftFormatted, onEndTimeout } = useCountDown(
  me.value!.active_timeout?.due_datetime
)
const suspendedVisible = ref(false)

onEndTimeout(() => {
  // cron jobs in backend does not update banned users on time properly, so it needs some re-try refetch
  setTimeout(() => {
    refetch()
  }, 1000)
  setTimeout(() => {
    refetch()
  }, 30 * 1000)
  setTimeout(() => {
    refetch()
  }, 60 * 1000)
})
</script>
<template>
  <div class="ChatMuted">
    <div class="flex items-center justify-center gap-x-3 mb-[5px]">
      <UIcon
        class="w-4 h-5 min-w-4 min-h-5"
        name="ion:mic-off-sharp"
      />
      <div class="text-white">
        You have been <span class="text-error">Muted</span>
      </div>
    </div>
    <div class="mb-[5px]">
      <div
        class="
          mx-auto
          flex
          items-center
          justify-center
          bg-secondary-gradient
          rounded-lg
          border-t border-secondary-color
          text-white text-lg
        "
        style="width: 156px; height: 45px"
      >
        {{ timeLeft ? timeLeftFormatted : "A few minutes..." }}
      </div>
    </div>
    <div class="flex justify-center">
      <button
        class="active:scale-95 text-paragraph hover:text-white duration-150"
        @click="suspendedVisible = true"
      >
        View Reason
      </button>
    </div>
    <!--    <GModal-->
    <!--      v-model="suspendedVisible"-->
    <!--      width="461px"-->
    <!--    >-->
    <!--      <template #title>-->
    <!--        <div class="flex items-center gap-2.5">-->
    <!--          <UIcon-->
    <!--            name="ion:mic-off-sharp"-->
    <!--            class="w-4 h-5 min-w-4 min-h-5"-->
    <!--          />-->
    <!--          <h4 class="text-white">-->
    <!--            Chat Access Temporarily Suspended-->
    <!--          </h4>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--      <div class="g-p-modal mt-5 md:mt-[30px]">-->
    <!--        <AccessSuspended />-->
    <!--      </div>-->
    <!--    </GModal>-->
  </div>
</template>
