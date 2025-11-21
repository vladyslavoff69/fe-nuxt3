<script lang="ts" setup>
import AffiliateHomeSlider from '~/apps/affiliate/components/home/AffiliateHomeSlider.vue'
import { AUTH } from '~/constants'

const { t } = useI18n()
const { isLoggedIn, openAuthModal } = inject(AUTH)!
const router = useRouter()
const localePath = useLocalePath()

const createAffiliate = () => {
  if (!isLoggedIn.value) {
    openAuthModal()
  } else {
    router.push({ path: localePath('/affiliate/overview') })
  }
}

const { sendFingerprint } = useSendFingerprint()

onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div class="flex flex-col gap-y-4 md:gap-y-5 lg:gap-y-7">
    <!-- Banner -->
    <section class="bg-banner-vip bg-cover bg-bottom py-4 lg:py-20 px-4">
      <div class="w-full flex items-center justify-center">
        <div class="text-center flex flex-col justify-center gap-y-4 col-span-4 lg:col-span-2">
          <h4
            class="text-primary uppercase font-extrabold
            text-sm md:text-base leading-[15px] lg:leading-none tracking-primary"
          >
            {{ t("affiliate.join-earn") }}
          </h4>
          <h1
            class="text-2xl md:text-xxl lg:text-4xl font-extrabold leading-8! tracking-[0.64px] uppercase"
          >
            <span class="leading-1">
              {{ t("affiliate.premier") }}
            </span>
            <span class="block text-primary">
              {{ t("affiliate.affiliate-program") }}
            </span>
          </h1>
          <div class="text-xs lg:text-base text-paragraph leading-5! max-w-96">
            {{ t("affiliate.earn_text") }}
          </div>
          <div class="grid grid-cols-2 gap-3 lg:gap-4 justify-center items-center">
            <JButton
              class="block px-4 col-span-2 lg:col-span-1"
              shape="circle"
              @click="createAffiliate"
            >
              {{ t("affiliate.create-code") }}
            </JButton>
            <JButton
              class="block px-4 py-2.5 col-span-2 lg:col-span-1"
              shape="circle"
              variant="alternative"
              @click="createAffiliate"
            >
              {{ t("affiliate.become_partner") }}
            </JButton>
          </div>
        </div>
      </div>
    </section>
    <!-- Affiliate Home slider -->
    <section class="w-full">
      <AffiliateHomeSlider />
    </section>
  </div>
</template>
