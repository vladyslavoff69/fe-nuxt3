<script lang="ts" setup>
import type { PromoCard } from '~/types/promotion'

const { promoData } = defineProps<{
  promoData: PromoCard
}>()

const { t } = useI18n()
const validFor = 'CASINO'
</script>

<template>
  <NuxtLinkLocale
    :to="`/promotions/${promoData?.slug}`"
    class="block rounded-md relative overflow-hidden box-border aspect-100/53"
  >
    <NuxtImg
      v-if="promoData?.image"
      :src="`${promoData?.image}/md`"
      alt="PLINKO"
      class="w-full"
      loading="lazy"
      provider="cloudflare"
    />
    <div class="p-4 md:p-5 lg:p-[30.6px] absolute inset-0 flex flex-col justify-between items-start">
      <div class="font-semibold flex flex-col gap-y-1 justify-center h-full">
        <div>
          <UBadge
            class="min-w-10 text-center inline-flex justify-center"
            color="primary"
            size="xs"
            variant="solid"
          >
            <span class="text-3xs xs:text-xxs font-bold tracking-card-chip text-white uppercase leading-none py-0.5">
              {{ validFor }}
            </span>
          </UBadge>
        </div>
        <div class="text-lg font-bold text-white">
          <div class="uppercase text-xxl font-extrabold leading-none">
            <h1
              class="leading-7 sm:leading-6 tracking-primary"
            >
              {{ promoData?.name }}
            </h1>
          </div>
        </div>
        <JButton
          class="max-w-[100px] h-9! group mt-1.5"
          size="md"
          variant="outline"
        >
          {{ t('vip.learn-more') }}
        </JButton>
      </div>
    </div>
  </NuxtLinkLocale>
</template>
