<script lang="ts" setup>
import type { BetDetail } from '~/types'
import { BET_DETAIL } from '~/constants'

const props = defineProps<{
  betDetail: BetDetail
}>()

const route = useRoute()
const modalType = computed(() => (props.betDetail?.type ? props.betDetail?.type?.toLowerCase() : (route.query.type ? String(route.query.type) : '')))
const betDetail = computed(() => props.betDetail)

provide(BET_DETAIL, {
  betDetail,
  modalType,
})
</script>
<template>
  <slot />
</template>
