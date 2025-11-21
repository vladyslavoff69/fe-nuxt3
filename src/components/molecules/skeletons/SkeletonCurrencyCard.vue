<template>
  <div class="w-[241px]">
    <div class="w-full h-full">
      <div
        class="
          flex items-center justify-between gap-x-2
          bg-green-950 px-3 rounded-md overflow-hidden h-full
          py-4
        "
      >
        <USkeleton
          class="h-8 w-8 min-w-8 rounded-full bg-brand"
        />
        <div class="flex flex-col gap-y-1 w-full">
          <USkeleton
            class="h-5 w-full bg-brand"
          />
          <USkeleton
            class="h-4 w-full bg-brand"
          />
        </div>
        <div class="flex flex-col gap-y-2 w-8">
          <USkeleton
            v-for="i in 3"
            :key="`${i}_cu_c`"
            class="h-4 w-4 bg-brand"
          />
        </div>
      </div>
    </div>
  </div>
</template>
