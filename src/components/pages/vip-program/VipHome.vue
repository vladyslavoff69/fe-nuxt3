<script lang="ts" setup>
import VipTreatmentSlider from '~/apps/vip-program/components/VipTreatmentSlider.vue'
import VipLevelSlider from '~/apps/vip-program/components/VipLevelSlider.vue'
import VipBenefitsTable from '~/apps/vip-program/components/VipBenefitsTable.vue'
import { AUTH, LOGIN } from '~/constants'
import { VIP_LEVELS_QUERY } from '~/graphql'
import type { VipLevel } from '~/types'

const titleClass = 'text-white text-lg md:text-xl lg:text-2xl font-bold leading-normal uppercase'
const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()
const { isLoggedIn } = inject(AUTH)!

const { result, loading } = useQuery(
  VIP_LEVELS_QUERY,
  {
    first: 100,
    orderBy: [{ column: 'ORDER', order: 'ASC' }],
  }
)

const vipLevels = computed(() => result.value?.vipLevels?.data?.filter((v: VipLevel) => v.xp_threshold && v.xp_threshold > 0))

const openLoginModal = () => {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      tab: LOGIN,
      modal: 'auth',
    },
  })
}

const handleBtnClick = () => {
  if (!isLoggedIn.value) {
    openLoginModal()
  } else {
    router.push({
      path: localePath('/vip-program/dashboard')
    })
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-y-4 w-full lg:gap-y-8">
    <!--  VIP Banner  -->
    <div
      class="
        grid grid-cols-7 md:grid-cols-3 gap-x-2 md:gap-x-4 w-full h-full md:min-h-64 lg:min-h-96
        bg-banner-vip bg-cover bg-bottom-left relative rounded-lg p-4
      "
    >
      <div class="text-start flex flex-col justify-center gap-y-3 md:gap-y-4 col-span-4 md:col-span-2 pl-0 md:pl-10">
        <h4
          class="
            text-primary uppercase font-extrabold
            text-sm sm:text-base leading-[15px] lg:leading-none tracking-primary
          "
        >
          {{ t('vip.exclusive-offer') }}
        </h4>
        <h1
          class="text-2xl sm:text-xxl lg:text-3xl leading-[90%] font-extrabold tracking-[0.64px] uppercase"
        >
          {{ t('vip.home-title') }}
        </h1>
        <div class="text-xs md:text-base text-paragraph leading-none max-w-96">
          {{ t('vip.access-advantages-instant-withdrawal-bonuses') }}
        </div>
        <div class="w-full">
          <JButton
            class="w-[200px] sm:w-[242px] block"
            shape="circle"
            @click="handleBtnClick"
          >
            {{ isLoggedIn ? t('home.dashboard') : t('vip.join-vip') }}
          </JButton>
        </div>
      </div>
      <div class="col-span-3 md:col-span-1 flex justify-center items-center">
        <NuxtImg
          alt="VIP Clup"
          class="w-full max-w-[107px] max-h-[105px] md:max-w-36 lg:max-w-[253px] h-auto md:max-h-32 lg:max-h-[250px]"
          loading="lazy"
          provider="cloudflare"
          src="ec70d90d-bc54-4cd0-d4f0-c1c570a48000/md"
        />
      </div>
    </div>

    <!--  VIP Treatment  -->
    <div class="flex flex-col gap-y-4 md:gap-y-5 z-20">
      <div class="text-center">
        <h2
          :class="titleClass"
        >
          {{ t('vip.bonuses') }} & {{ t('vip.benefits') }}
        </h2>
      </div>

      <VipTreatmentSlider
        v-if="!loading"
        :vip-levels="vipLevels"
      />
    </div>

    <!--  VIP Levels  -->
    <div class="flex flex-col gap-y-4 md:gap-y-5">
      <h2
        :class="titleClass"
        class="text-center"
      >
        {{ t('vip.our-vip-levels') }}
      </h2>

      <VipLevelSlider
        v-if="!loading"
        :vip-levels="vipLevels"
      />
    </div>

    <!--  VIP benefits  -->
    <div class="flex flex-col gap-y-4 md:gap-y-5">
      <div class="text-center">
        <h2
          :class="titleClass"
        >
          {{ t('vip.vip') }} {{ t('vip.dashboard') }}
        </h2>
      </div>
      <div class="w-full overflow-x-auto">
        <ClientOnly>
          <VipBenefitsTable
            v-if="!loading"
            :vip-levels="vipLevels"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
