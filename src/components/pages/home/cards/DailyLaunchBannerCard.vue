<script lang="ts" setup>
import { AUTH } from '~/constants'

const { t } = useI18n()
const { isLoggedIn, openAuthModal } = inject(AUTH)!
const localePath = useLocalePath()
const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!

const goToDaily = () => {
  if (!isLoggedIn.value) {
    openAuthModal()
  } else {
    router.push({
      path: localePath(redirectHome),
      query: {
        modal: 'vip',
        tab: 'dailySpin'
      }
    })
  }
}
</script>

<template>
  <div
    class="w-full h-full rounded-md overflow-hidden aspect-100/52 sm:aspect-100/45"
    :style="{
      background: 'url(https://imagedelivery.net/PqUPeaOeGAxHB9FZtXllkg/b9741e8b-db48-4cdf-de4f-88a3db54e000/md) no-repeat #112811'
    }"
  >
    <div class="flex relative w-full h-full ">
      <div class="h-full flex items-center gap-1.5 xl:gap-0.5 bg-transparent py-3 px-4 xl:py-5">
        <div class="w-full uppercase text-xl sm:text-xxl xl:text-3xl font-extrabold flex flex-col gap-2 sm:gap-3">
          <span class="leading-6 lg:leading-7 text-primary">
            New!
            <span class="flex flex-col justify-center text-white">
              <span>SPIN THE</span>
              <span>WHEEL AND</span>
              <span>WIN - DAILY!</span>
            </span>
          </span>
          <JButton
            class="w-full min-w-full uppercase"
            button-class="h-9! md:h-11!"
            label-class="font-extrabold! flex items-center justify-center"
            size="lg"
            variant="bet-gradient"
            @click="goToDaily"
          >
            {{ t('base.claim') }} SPIN
          </JButton>
        </div>
      </div>
      <div class="w-full flex-1 h-full flex items-end justify-end sm:min-w-[259px]">
        <NuxtImg
          class="max-h-full w-auto h-auto sm:h-full min-h-1"
          loading="lazy"
          provider="cloudflare"
          alt="Junglebet Daily Launch Banner"
          src="5dda4534-f573-4526-d718-f2b6981e0f00/sm"
        />
      </div>
    </div>
  </div>
</template>
