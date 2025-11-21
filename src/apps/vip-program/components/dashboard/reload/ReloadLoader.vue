<script lang="ts" setup>
import { VIP_RELOAD_QUERY } from '~/graphql'
import { VIP_DRIP } from '~/constants'
import type { ReloadRank } from '~/types'

const { loading, result, refetch } = useQuery(VIP_RELOAD_QUERY, {})

onMounted(() => {
  if (!loading.value) {
    refetch()
  }
})

provide(VIP_DRIP, {
  refetch,
  loading,
  reload: computed<ReloadRank>(() => result.value.vipReload)
})
</script>
<template>
  <div class="CashbackLoader flex-1">
    <template v-if="result">
      <slot :reload="result.vipReload" />
    </template>
    <template v-else-if="loading">
      <div class="pt-5 md:pt-[30px]">
        <USkeleton
          class="h-4 w-1/2 mb-4 bg-brand"
        />
        <USkeleton
          class="h-10 w-full mb-4 mx-auto bg-brand"
        />
        <USkeleton
          class="h-[100px] w-full mb-4 mx-auto bg-brand"
        />
        <div class="flex justify-between items-center mb-4">
          <USkeleton
            class="h-4 w-[100px] bg-brand"
          />
          <USkeleton
            class="h-4 w-[100px] bg-brand"
          />
        </div>
        <USkeleton
          class="h-4 w-full mb-4 bg-brand"
        />
        <USkeleton
          class="h-4 w-full bg-brand"
        />
      </div>
    </template>
  </div>
</template>
