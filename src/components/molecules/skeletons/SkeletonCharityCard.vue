<template>
  <div class="flex flex-col gap-y-1 w-full max-w-44 sm:max-w-52">
    <USkeleton
      class="w-24 h-5 bg-brand"
    />
    <div class="w-full grid gap-y-3 bg-green-950 p-2 sm:p-3 rounded-md">
      <USkeleton
        class="w-full h-20 sm:h-24 bg-brand"
      />
      <div class="flex">
        <div class="flex flex-col border-r border-r-border pr-6 gap-y-1">
          <USkeleton
            class="w-8 h-4 bg-brand"
          />
          <USkeleton
            class="w-4 h-4 bg-brand"
          />
        </div>
        <div class="flex-1 flex flex-col justify-end">
          <USkeleton
            class="w-16 h-4 ml-auto bg-brand"
          />
          <div class="flex items-center justify-end gap-x-2 gap-y-1">
            <div class="text-sm sm:text-lg text-white font-bold leading-5 sm:leading-7">
              <USkeleton
                class="w-7 h-4 bg-brand"
              />
            </div>
            <div class="flex items-center">
              <USkeleton
                v-for="i in 3"
                :key="`scc-6-${i}`"
                :class="[{'-ml-3': i > 1}, `z-${i}`]"
                class="relative h-6 w-6 min-w-6 min-h-6 rounded-full bg-brand"
              />
            </div>
          </div>
        </div>
      </div>
      <USkeleton
        class="w-full h-10 bg-brand"
      />
    </div>
  </div>
</template>
