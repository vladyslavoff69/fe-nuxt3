<script lang="ts" setup>
import TransactionsPage from '~/components/pages/transactions/index.vue'
import { AUTH, CURRENCY } from '~/constants'
import PageLoader from '~/components/molecules/common/PageLoader.vue'

const { loading } = inject(CURRENCY)!

const { me } = inject(AUTH)!
const { sendFingerprint } = useSendFingerprint()
onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <UPage
    v-if="!loading"
    class="w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0"
  >
    <TransactionsPage v-if="!!me" />
  </UPage>
  <PageLoader v-else />
</template>
