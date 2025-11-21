<script lang="ts" setup>
const { height = '100%', sizeClass = 'w-[104px] md:w-[130px] lg:w-[150px] h-full' } = defineProps<{
  height?: string;
  sizeClass?: string;
}>()
</script>

<template>
  <div
    :class="[
      sizeClass
    ]"
  >
    <div
      :class="[
        height === '' && 'pb-[134%] aspect-3/4'
      ]"
      :style="{
        height: height
      }"
      class="relative aspect-3/4"
    >
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden rounded-md bg-green-950">
        <div
          class="j-card-details absolute opacity-100 h-full w-full px-1 py-1 sm:px-2 sm:py-2.5 flex flex-col justify-between"
        >
          <USkeleton
            class="ml-auto w-5 h-5 rounded-full bg-brand"
          />
          <div class="flex-1 flex flex-col items-center justify-center mb-5 sm:mb-[25px] md:mb-[20%]">
            <USkeleton
              class="w-20 h-5 bg-brand"
            />
            <div class="sm:mt-2 md:mt-2.5 lg:mt-4">
              <USkeleton
                class="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-brand"
              />
            </div>
          </div>
          <div
            class="flex mt-auto w-full justify-between text-[9px] lg:text-xxs font-semibold"
          >
            <USkeleton
              v-for="i in 2"
              :key="`${i}_c_c`"
              class="h-4 sm:h-5 w-10 bg-brand"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
