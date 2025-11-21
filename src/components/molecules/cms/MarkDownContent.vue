<script setup lang="ts">
const { content = '' } = defineProps<{
  content?: string | null
}>()
</script>

<template>
  <div class="leading-6 grid col-span-1 list-disc markContent">
    <!-- MDC for parsing & rendering -->
    <MDC
      :value="content"
      tag="div"
      v-bind="$attrs"
      class="flex flex-col gap-y-4"
    />
  </div>
</template>

<style lang="scss">
.markContent {
  ul {
    list-style: disc;
    padding-left: 16px;
  }

  strong {
    color: white;
  }

  img {
    border-radius: 8px;
    width: 100%;
  }

  iframe {
    border-radius: 8px;
  }
}
</style>
