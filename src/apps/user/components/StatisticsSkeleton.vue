<template>
  <div
    class="w-full flex flex-col gap-3 lg:gap-4 items-center justify-center"
  >
    <USkeleton
      class="w-full h-12 bg-green-950"
    />
    <div class="grid grid-cols-2 gap-3 lg:gap-4 w-full">
      <USkeleton
        v-for="i in 2"
        :key="`nm-s-1-${i}`"
        class="w-full h-20 bg-green-950"
      />
    </div>
    <USkeleton
      class="w-full h-48 bg-green-950"
    />
  </div>
</template>
