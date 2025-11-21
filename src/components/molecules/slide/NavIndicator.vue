<script lang="ts" setup>
const {
  activeIndex = 0,
  slideCount = 0,
} = defineProps<{
  activeIndex: number,
  slideCount: number,
}>()

const emits = defineEmits(['clickIndicator'])
</script>

<template>
  <ul
    class="flex items-center relative"
  >
    <li
      v-for="(slideItem, sInd) in slideCount"
      :key="`slideItem_${sInd}`"
      :class="{
        'w-12 bg-primary': activeIndex == slideItem - 1,
        'mr-2' : slideItem < slideCount
      }"
      class="w-5 h-2 slide-item cursor-pointer transition-all ease-in rounded-xl bg-green-950 duration-200"
      @click.stop="emits('clickIndicator', { index: slideItem - 1})"
    />
  </ul>
</template>
