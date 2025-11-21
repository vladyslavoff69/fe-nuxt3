<script lang="ts" setup>
const { width = '317px' } = defineProps<{
  width: string
}>()

</script>

<template>
  <div
    :style="{ width }"
    class="bg-green-950 py-2 px-3 rounded-md"
  >
    <div class="flex items-center justify-between gap-x-4">
      <div class="flex-1">
        <USkeleton
          class="w-full h-4 bg-brand"
        />
      </div>
      <div class="w-1/3">
        <USkeleton
          class="w-full h-4 bg-brand"
        />
      </div>
    </div>
    <div class="flex items-center justify-between my-3">
      <div class="flex flex-col gap-y-3">
        <USkeleton
          class="h-8 w-8 rounded-full bg-brand"
        />
        <USkeleton class="h-4 w-[50px]" />
      </div>
      <div class="flex items-center gap-x-2">
        <USkeleton
          v-for="i in 2"
          :key="`${i}_1_s_c`"
          class="h-7 w-7 bg-brand"
        />
      </div>
      <div class="flex flex-col items-end gap-y-3">
        <USkeleton
          class="h-8 w-8 rounded-full bg-brand"
        />
        <USkeleton
          class="h-4 w-[50px] bg-brand"
        />
      </div>
    </div>
    <div class="flex items-center justify-between gap-x-2">
      <USkeleton
        v-for="i in 3"
        :key="`${i}_1_sb_c`"
        class="h-10 flex-1 bg-brand"
      />
    </div>
  </div>
</template>
