<script lang="ts" setup>
import { COLOR_CASINO_ICON } from '~/icons'

const { t } = useI18n()
</script>
<template>
  <div>
    <div class="flex justify-center min-w-full md:min-w-[512px] md:min-h-[288px]">
      <NuxtImg
        alt="Affiliate campaign"
        class="w-full rounded"
        loading="lazy"
        provider="cloudflare"
        src="4adfcc5d-f9b1-4ab5-7fcf-be73e3becb00/lg"
      />
    </div>
    <div class="mt-4 md:mt-7">
      <h2 class="text-white text-xl font-bold leading-normal mb-3">
        {{ t('affiliate.refer_earn') }}
      </h2>
      <p class="text-sm">
        {{ t('affiliate.overview_text') }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-7">
        <div class="bg-green-950 p-4 rounded-md overflow-hidden h-full flex flex-col gap-3">
          <div class="flex items-center gap-x-2.5 text-lg text-white font-bold">
            <svg
              class="w-4 h-4 min-w-4 min-h-4"
            >
              <use :href="COLOR_CASINO_ICON" />
            </svg>
            <span>
              {{ t('games.casino') }}
            </span>
          </div>
          <p class="text-sm">
            {{ t('affiliate.overview-casino') }}
          </p>
          <div class="w-full rounded-md p-2.5 bg-brand text-center text-sm font-semibold">
            (edge as decimal * wagered / 2) * commission rate
          </div>
        </div>
      </div>
      <p class="text-sm mt-2.5">
        {{ t('affiliate.ip-note') }}
      </p>
    </div>
  </div>
</template>
