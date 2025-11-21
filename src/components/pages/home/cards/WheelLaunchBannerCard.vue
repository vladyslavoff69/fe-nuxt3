<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <div class="w-full h-full rounded-md overflow-hidden aspect-100/52 sm:aspect-100/45 bg-green-950/60">
    <div class="flex relative w-full h-full ">
      <div class="h-full flex items-center gap-1.5 xl:gap-0.5 bg-transparent py-3 px-4 xl:py-5">
        <div class="w-full uppercase text-xl sm:text-xxl xl:text-3xl font-extrabold flex flex-col gap-2 sm:gap-3">
          <span class="text-primary leading-6 lg:leading-7">
            New!
            <span class="flex flex-col justify-center text-white">
              <span>{{ t('base.junglebet') }}</span>
              <span>Originals</span>
            </span>
          </span>
          <NuxtLinkLocale
            class="w-full"
            to="/casino/games/junglebet/wheel"
          >
            <JButton
              class="w-full min-w-full uppercase"
              button-class="h-9! md:h-11!"
              label-class="font-extrabold! flex items-center justify-center"
              size="lg"
              variant="bet-gradient"
            >
              {{ t('games.play') }} {{ t('casino.wheel') }}
            </JButton>
          </NuxtLinkLocale>
        </div>
      </div>
      <div class="w-full flex-1 h-full flex items-end justify-end min-w-[259px]">
        <NuxtImg
          class="max-h-full w-auto h-full min-h-1"
          loading="lazy"
          provider="cloudflare"
          alt="Junglebet Wheel In-house Banner"
          src="f52f1313-a1f0-404c-3ee1-af1eb5a63100/sm"
        />
      </div>
    </div>
  </div>
</template>
