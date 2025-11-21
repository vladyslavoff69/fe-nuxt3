<script lang="ts" setup>
import { CONTAINER } from '~/constants'

const { enable = true } =
  defineProps<{
    enable?: boolean;
  }>()

const { containerScreen } = inject(CONTAINER)!
const styles = computed(() => ({
  marginLeft: `calc((100% - ${containerScreen.value.width}px)/2)`,
  marginRight: `calc((100% - ${containerScreen.value.width}px)/2)`,
}))
</script>

<template>
  <div
    :style="enable ? styles : {}"
    class="EscapeContainer"
  >
    <slot />
  </div>
</template>
