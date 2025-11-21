<template>
  <div class="w-full xs:w-96 flex flex-col py-2 gap-y-2">
    <div class="relative h-64 p-5 pb-2 bg-green-950 rounded-md">
      <div class="w-full h-full relative flex flex-col gap-y-4">
        <div>
          <USkeleton
            class="w-16 h-7 bg-brand"
          />
        </div>
        <div class="flex flex-col gap-y-2">
          <div class="max-w-56 flex flex-col gap-y-1">
            <USkeleton
              class="w-24 h-7 bg-brand"
            />
            <USkeleton
              class="w-20 h-7 bg-brand"
            />
            <USkeleton
              class="w-full h-7 bg-brand"
            />
          </div>
          <USkeleton
            class="w-36 h-4 bg-brand"
          />
          <USkeleton
            class="w-28 h-11 bg-brand"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-y-4">
      <div
        class="flex gap-x-0.5"
      >
        <USkeleton
          class="w-10 h-5 bg-green-950 rounded-full"
        />
      </div>
      <USkeleton
        class="w-72 h-6 bg-green-950"
      />
      <div>
        <USkeleton
          class="w-28 h-10 bg-green-950"
        />
      </div>
    </div>
  </div>
</template>
