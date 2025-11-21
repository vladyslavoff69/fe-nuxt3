<template>
  <div class="w-full flex flex-col gap-y-2">
    <div class="flex items-center justify-center w-full">
      <USkeleton class="w-1/3 h-4 bg-green-950" />
    </div>
    <div class="flex items-center justify-center gap-x-2 w-full">
      <USkeleton class="w-10/12 lg:w-9/12 h-4 bg-green-950" />
      <USkeleton class="w-4 h-4 bg-border" />
      <USkeleton class="w-4 h-4 bg-border" />
    </div>
    <div class="flex items-center justify-center w-full">
      <USkeleton class="w-1/2 h-3 bg-green-950" />
    </div>
    <div class="flex items-center justify-center w-full">
      <USkeleton class="w-1/3 h-3 bg-green-950" />
    </div>
    <div class="flex items-center justify-center gap-x-4 w-full">
      <hr class="border border-border w-1/3">
      <JbLogo class="w-24 lg:w-[156px] lg:h-8" />
      <hr class="border border-border w-1/3">
    </div>
    <div class="flex items-center justify-center w-full bg-green-950 rounded-md p-3">
      <div
        v-for="i in 3"
        :key="`r_${i}-hey-6`"
        :class="{
          'border-l border-border': i > 1
        }"
        class="w-1/3 flex items-center justify-center flex-col gap-y-1 py-3 px-4"
      >
        <USkeleton class="w-full h-3 bg-brand" />
        <USkeleton class="w-full h-3 bg-brand" />
      </div>
    </div>
    <div class="flex items-center justify-center w-full">
      <USkeleton class="w-full h-32 bg-green-950" />
    </div>
    <div class="flex items-center justify-center w-full">
      <div class="flex items-center justify-center gap-x-2 w-1/2 rounded-md">
        <div
          v-for="i in 2"
          :key="`key-${i}-hey-7`"
          class="w-1/2 flex items-center justify-center flex-col gap-y-1 p-3"
        >
          <USkeleton class="w-full h-3 bg-green-950" />
          <USkeleton class="w-full h-3 bg-green-950" />
        </div>
      </div>
    </div>
    <USkeleton class="w-full h-10 bg-border" />
    <USkeleton class="w-full h-10 bg-green-950" />
  </div>
</template>
