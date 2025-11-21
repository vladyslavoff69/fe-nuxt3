<template>
  <div class="flex items-center justify-center gap-x-2 w-1/2 rounded-md">
    <div
      v-for="i in 2"
      :key="i"
      class="w-1/2 flex items-center justify-center flex-col gap-y-1 p-3"
    >
      <USkeleton
        v-for="j in 2"
        :key="j"
        class="w-full h-3 bg-green-950"
      />
    </div>
  </div>
</template>
