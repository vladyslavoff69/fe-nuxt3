<template>
  <div class="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
    <div class="flex flex-col gap-y-2 w-28 h-full">
      <USkeleton class="w-full h-36 bg-brand" />
      <USkeleton class="w-full h-9 bg-brand" />
    </div>

    <div class="flex flex-col gap-y-4 flex-auto">
      <USkeleton class="w-40 h-5 bg-brand" />

      <div class="flex items-center gap-x-2 w-full">
        <USkeleton class="w-40 h-5 bg-brand" />
        <USkeleton class="w-28 h-5 bg-brand" />
      </div>

      <div class="flex items-center gap-x-2 w-full">
        <USkeleton class="w-40 h-5 bg-brand" />
        <USkeleton
          v-for="j in 4"
          :key="`key-${j}-hey-10`"
          class="w-20 h-5 bg-brand"
        />
      </div>

      <div
        v-for="j in 2"
        :key="j"
        class="flex flex-col gap-y-2"
      >
        <USkeleton class="w-40 h-5 bg-brand" />
        <USkeleton
          v-for="i in 2"
          :key="i"
          class="w-full h-4 bg-brand"
        />
      </div>
    </div>
  </div>
</template>
