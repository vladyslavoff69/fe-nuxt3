<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4 text-sm bg-green-950 rounded-md p-2 lg:p-3 relative">
    <USkeleton class="w-full h-7 my-6 bg-brand" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2.5 mb-5">
      <USkeleton
        v-for="i in 3"
        :key="i"
        class="h-10 lg:h-11 bg-brand"
      />
    </div>
    <USkeleton
      class="h-10 lg:h-11 bg-brand"
    />
  </div>
</template>
