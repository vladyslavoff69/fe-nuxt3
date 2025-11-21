<template>
  <div class="w-full flex items-center justify-center flex-col gap-2">
    <div class="w-full flex items-center justify-center gap-2">
      <USkeleton
        class="w-7 h-7 rounded-full bg-green-950"
      />

      <USkeleton
        class="w-1/3 h-7 bg-green-950"
      />
    </div>

    <USkeleton
      v-for="i in 2"
      :key="`nm-s-${i}`"
      :class="{'w-1/2': i > 1, 'w-1/3': i === 1}"
      class="h-3 bg-green-950"
    />

    <hr class="w-full border border-border mb-2">

    <div
      v-for="k in 2"
      :key="`${k}_j`"
      class="w-full flex items-center gap-x-2 mt-1"
    >
      <div
        v-for="j in 2"
        :key="`${j}_k`"
        class="w-6/12 flex flex-col px-4 py-2 bg-green-950 rounded-md gap-1"
      >
        <USkeleton
          class="w-24 h-4"
        />
        <USkeleton
          class="w-20 h-4"
        />
      </div>
    </div>
  </div>
</template>
