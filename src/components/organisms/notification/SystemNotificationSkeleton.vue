<template>
  <div
    class="w-full rounded-lg bg-green-950 flex flex-col font-medium"
  >
    <div class="flex flex-col gap-2.5 p-[15px]">
      <div class="flex flex-row gap-2 justify-start items-center">
        <USkeleton class="w-3.5 md:w-4 h-3.5 md:h-4 mt-0.5 bg-brand" />
        <USkeleton class="w-40 h-3.5 md:h-4 mt-0.5 bg-brand" />
      </div>
    </div>
    <div
      class="flex flex-row justify-between items-center bg-green-950 px-4 py-2.5 border-t border-border"
    >
      <div class="flex flex-row gap-2.5 items-center ">
        <USkeleton class="w-4 h-4 bg-brand" />
        <USkeleton class="w-10 h-3.5 md:h-4 mt-0.5 bg-brand" />
      </div>
      <USkeleton class="w-10 h-3.5 md:h-4 mt-0.5 bg-brand" />
    </div>
    <div
      class="text-left bg-green-950 rounded-b-lg border-t border-border px-4 py-3"
    >
      <USkeleton class="w-20 h-3.5 md:h-4 mt-0 bg-brand" />
      <div class="flex flex-col gap-2 g-text-sm mt-2.5">
        <USkeleton class="w-full h-3.5 md:h-4 mt-0.5 bg-brand" />
        <USkeleton class="w-full h-3.5 md:h-4 mt-0.5 bg-brand" />
      </div>
    </div>
  </div>
</template>
