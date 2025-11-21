<template>
  <div
    class="w-full flex flex-col gap-y-3 md:gap-y-4"
  >
    <div
      v-for="ind in 4"
      :key="`ssr-7-${ind}`"
      class="w-full flex flex-col gap-y-1 md:gap-y-1.5"
    >
      <hr
        v-if="ind === 4"
        class="w-full border border-border mb-1 md:mb-1.5"
      >
      <USkeleton
        v-if="ind === 4"
        class="w-1/2 h-4 bg-border"
      />
      <USkeleton
        class="w-1/2 h-4 bg-border"
      />
      <div class="w-full flex items-center justify-between gap-x-1 px-2 md:px-3 h-12 bg-green-950 rounded-md">
        <USkeleton
          class="w-full h-4 bg-border"
        />
        <USkeleton
          class="w-4 h-4 min-w-4 max-w-4 bg-border"
        />
      </div>
    </div>
  </div>
</template>
