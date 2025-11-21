<script lang="ts" setup>
import { MOON_PAY_LOGO_ICON } from '~/icons/bases'
import { AUTH, PREFERENCE } from '~/constants'

const { t } = useI18n()
const { isLoggedIn, openAuthModal } = inject(AUTH)!
const { activeCryptoCode } = inject(PREFERENCE)!
const router = useRouter()
const openMoonpayModal = () => {
  if (!isLoggedIn.value) {
    openAuthModal()
  } else {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        modal: 'wallet',
        tab: 'buyCrypto',
        currency: activeCryptoCode.value,
      }
    })
  }
}
</script>

<template>
  <div class="w-full h-full rounded-md overflow-hidden aspect-100/52 sm:aspect-100/45 bg-green-950/60">
    <div class="flex relative w-full h-full ">
      <div class="h-full flex items-center gap-1.5 xl:gap-0.5 bg-transparent py-3 px-4 xl:py-5">
        <div class="w-full uppercase text-xl sm:text-xxl xl:text-3xl font-extrabold text-white flex flex-col gap-2 sm:gap-3">
          <span class="text-white leading-6 lg:leading-7 flex flex-col">
            Purchase
            <span class="text-primary flex items-center gap-0.5">
              Crypto
            </span>
          </span>
          <JButton
            class="w-full min-w-full uppercase"
            button-class="h-11!"
            label-class="font-extrabold! flex items-center justify-center"
            size="lg"
            type="submit"
            variant="bet-gradient"
            @click="openMoonpayModal"
          >
            <span class="flex items-center justify-center font-extrabold gap-0.5 flex-col sm:flex-row">
              <span>
                {{ t('currency.buy') }} with
              </span>
              <svg
                class="h-4 min-h-4 max-w-24 mb-1 sm:mb-0"
              >
                <use :href="MOON_PAY_LOGO_ICON" />
              </svg>
            </span>
          </JButton>
        </div>
      </div>
      <div class="flex-1 h-full flex items-end pt-5 justify-end">
        <NuxtImg
          class="max-h-full max-w-[184px] sm:max-w-[250px] w-full h-auto min-h-1"
          loading="lazy"
          provider="cloudflare"
          alt="Junglebet MoonPay Banner"
          src="6072a9c4-4e6c-40dc-8568-45b826152a00/sm"
        />
      </div>
    </div>
  </div>
</template>
