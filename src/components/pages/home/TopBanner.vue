<script lang="ts" setup>
import HeaderTxtSwiper from '~/components/pages/home/swiper/HeaderTxtSwiper.vue'
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import { AUTH, UNRANKED_VIP, VIP } from '~/constants'
import HeaderPromoSwiper from '~/components/pages/home/swiper/HeaderPromoSwiper.vue'
import { usePromotions } from '~/composables/promos'
import SkeletonPromoCard from '~/components/pages/home/cards/SkeletonPromoCard.vue'

const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { isLoggedIn, me }: any = inject(AUTH)!
const { vip } = inject(VIP)!
const meXp = computed(() => (Math.round((vip.value?.dualRank?.percentage || 0) * 10) / 10))

const {
  loading: loadingPromotions,
  promotions: promotionsData,
} = usePromotions({ promoId: null, category: 'active', enabled: true })
</script>

<template>
  <div class="flex flex-col gap-y-4 sm:gap-y-5">
    <div class="lg:grid lg:grid-cols-2 gap-y-4 sm:gap-y-5 flex flex-col">
      <div class="relative w-full mx-auto lg:mx-0 max-w-[560px] flex justify-between flex-col lg:min-h-[260px]">
        <div class="flex flex-col gap-y-4 sm:gap-y-5 h-full">
          <template v-if="!isLoggedIn && !me">
            <HeaderTxtSwiper />
          </template>
          <template v-else>
            <div class="flex flex-col justify-center items-center h-full">
              <div class="flex flex-col gap-y-3">
                <div class="flex gap-x-2 items-center">
                  <VipRankImg
                    :vip-level-name="me?.vip_level_name || UNRANKED_VIP"
                    class="rounded-full w-10 h-10 sm:w-14 sm:h-14"
                  />
                  <h2 class="text-xl sm:text-3xl font-bold leading-7! sm:leading-8!">
                    <span>{{ t("home.hey") }}, </span>
                    <span
                      :class="{
                        'text-paragraph': !!me?.incomplete_profile,
                        'text-primary': !me?.incomplete_profile,
                      }"
                    >
                      {{ me?.username }}
                    </span>
                  </h2>
                </div>
                <div class="flex flex-col gap-y-4">
                  <div class="flex gap-x-2">
                    <JProgressBar
                      :max="100"
                      :value="meXp"
                      class="flex-1"
                      color="bg-primary-gradient"
                    />
                    <span class="text-white font-bold leading-5">
                      {{ meXp }}%
                    </span>
                  </div>
                  <div class="flex items-center gap-x-1.5">
                    <JButton
                      button-class="py-1.5! pl-3!"
                      label-class="justify-center gap-x-0.5 text-center"
                      variant="outline"
                      @click="router.push({ path: localePath('/vip-program/dashboard') })"
                    >
                      {{ t('home.dashboard') }}
                      <UIcon
                        class="w-5 h-4 min-w-5 min-h-4"
                        name="heroicons:arrow-right-20-solid"
                      />
                    </JButton>
                    <JButton
                      button-class="py-1.5! pl-3!"
                      label-class="justify-center gap-x-0.5 text-center"
                      variant="outline"
                      @click="router.push({ path: router.currentRoute.value.path, query: { modal: 'vip', tab: 'rank' } })"
                    >
                      {{ t('menu.my-vip') }}
                    </JButton>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="w-full flex items-center justify-center lg:justify-end">
        <template v-if="loadingPromotions">
          <SkeletonPromoCard />
        </template>
        <HeaderPromoSwiper
          v-else
          :promos-data="promotionsData"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient-section {
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(-1deg, rgba(1, 23, 1, 0.80) 7.3%, rgba(1, 23, 1, 0.00) 46.35%);
  }
}

.most-played-game-section {
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 70px;
    width: 100%;
    background: linear-gradient(0deg, rgba(1, 23, 1, 0.80) 7.3%, rgba(1, 23, 1, 0.00) 87.35%);
  }
}
</style>
