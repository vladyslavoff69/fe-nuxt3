<script lang="ts" setup>
import MarkDownContent from '~/components/molecules/cms/MarkDownContent.vue'

const { contents = [] } = defineProps<{
  contents?: any[]
}>()
</script>

<template>
  <div class="columns-1 sm:columns-2 gap-y-10 gap-x-5">
    <template
      v-for="(content, idx) in contents"
      :key="idx"
    >
      <div class="flex flex-col gap-y-3 break-inside-avoid mb-5 sm:mb-10 sm:mr-5">
        <h2
          v-if="content.title"
          class="text-2xl font-bold leading-6 pt-5 pb-3"
        >
          {{ content.title }}
        </h2>

        <MarkDownContent
          :content="content.description"
        />
      </div>
    </template>
  </div>
</template>
