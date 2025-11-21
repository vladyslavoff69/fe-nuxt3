<script lang="ts" setup>
</script>

<template>
  <div class="w-full h-full rounded-md overflow-hidden aspect-100/52 sm:aspect-100/45 bg-green-950/60">
    <NuxtLinkLocale
      class="w-full"
      to="/vip-program"
    >
      <div class="flex relative w-full h-full ">
        <div class="h-full flex items-center gap-1.5 xl:gap-0.5 bg-transparent py-3 px-4 xl:py-5">
          <div class="w-full uppercase text-xl sm:text-xxl xl:text-3xl font-extrabold text-white flex flex-col">
            <span class="text-white leading-6 lg:leading-7">Junglebet <span class="text-primary flex items-center gap-0.5">
              Rewards
              <UIcon
                class="w-6 h-6 min-w-6 min-h-6 text-white"
                name="i-heroicons-arrow-up-right-20-solid"
              />
            </span>
            </span>
          </div>
        </div>
        <div class="flex-1 h-full flex items-end pt-5 justify-end">
          <NuxtImg
            class="max-h-full max-w-[300px] w-full h-auto min-h-1"
            loading="lazy"
            provider="cloudflare"
            alt="Junglebet Home Banner"
            src="a964e048-ed2c-4efe-15ea-0230f39a7600/sm"
          />
        </div>
      </div>
    </NuxtLinkLocale>
  </div>
</template>
