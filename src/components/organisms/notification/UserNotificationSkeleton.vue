<template>
  <div
    class="
      bg-green-950 w-full md:max-w-md overflow-hidden rounded-md pointer-events-auto
      ring-1 ring-brand ring-opacity-5 group shadow-notification p-0.5
    "
  >
    <div class="flex items-stretch relative">
      <div class="flex-1 py-4 px-3">
        <p class="leading-none md:leading-none mb-3">
          <USkeleton class="w-20 h-3.5 bg-brand" />
        </p>
        <p class="flex flex-col text-xs md:text-sm font-semibold gap-2">
          <USkeleton class="w-full h-3.5 bg-brand" />
          <USkeleton class="w-full h-3.5 bg-brand" />
          <USkeleton class="w-full h-3.5 bg-brand" />
        </p>
      </div>
    </div>
  </div>
</template>
