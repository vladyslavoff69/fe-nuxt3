<template>
  <div class="w-full h-full flex items-center justify-end">
    <div class="w-3/4 h-full flex flex-col gap-2 md:gap-4">
      <div class="p-2 bg-green-950 rounded-md h-full flex items-center justify-between gap-2">
        <div class="flex flex-col gap-y-2 w-1/2">
          <USkeleton class="w-24 h-7 bg-brand" />
          <USkeleton class="w-1/2 h-5 bg-brand" />
          <USkeleton class="w-full h-5 bg-brand" />
          <USkeleton class="w-full h-5 bg-brand" />
        </div>
        <USkeleton class="w-1/2 h-full rounded-lg bg-brand" />
      </div>
      <div class="flex items-center justify-center gap-1">
        <USkeleton class="w-10 h-2 bg-brand" />
        <USkeleton class="w-6 h-2 bg-brand" />
        <USkeleton class="w-6 h-2 bg-brand" />
      </div>
    </div>
  </div>
</template>
