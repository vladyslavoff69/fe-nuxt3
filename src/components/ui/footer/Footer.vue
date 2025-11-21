<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import DropdownBox from '~/components/molecules/menu/DropdownBox.vue'
import { CURRENCY, THEME } from '~/constants'
import type { CurrencyItem } from '~/types'
import { numberWithCommas } from '~/utils'

const { cryptoCurrencies } = inject(CURRENCY)!
const runtimeConfig = useRuntimeConfig()
const { t } = useI18n()
const localePath = useLocalePath()
const { screen } = inject(THEME)!
const { toggleChat } = useCrisp()

const socialLinks = runtimeConfig.public?.socialLinks
const casinoSection = computed(() => [
  { label: t('casino.new-releases'), value: '/casino/home/new-releases', openInNew: false },
  { label: t('casino.live-casino'), value: '/casino/home/live-casino', openInNew: false },
  { label: t('casino.originals'), value: '/casino/home/junglebet', openInNew: false },
  { label: t('casino.providers'), value: '/casino/providers', openInNew: false },
])

const supportSection = computed(() => [
  { label: t('games.gamble-aware'), value: 'gambleAware', openInNew: true, link: 'https://www.gambleaware.org' },
  { label: t('footer.live-support'), value: 'livesupport', openInNew: false },
])

const communitySection = computed(() => [
  { label: t('footer.mission-statement'), value: '/about-us', openInNew: false },
  { label: t('base.facebook'), value: 'facebook', openInNew: true, link: socialLinks?.facebook },
  { label: t('base.x'), value: 'twitter', openInNew: true, link: socialLinks?.twitter },
  { label: t('base.instagram'), value: 'instagram', openInNew: true, link: socialLinks?.instagram }
])

const aboutUsSection = computed(() => [
  { label: t('auth.terms-and-conditions'), value: '/tos', openInNew: false },
  { label: t('auth.privacy-policy'), value: '/privacy-policy', openInNew: false },
  { label: t('auth.kyc-policy'), value: '/kyc-policy', openInNew: false },
  { label: t('auth.aml-policy'), value: '/aml-policy', openInNew: false },
  { label: t('footer.responsible-gambling'), value: '/responsible-gaming', openInNew: false },
])

const btc = computed(() => cryptoCurrencies.value?.find((item: CurrencyItem) => item.code === 'BTC'))
const newPrice = computed(() => (btc.value?.current_price || 0))
const formattedYear = useDateFormat(useNow(), 'YYYY')

const navigateToLink = (item: any) => {
  if (item.value === 'livesupport' && import.meta.client) {
    toggleChat()

    return
  }

  if (item.openInNew && item.link) {
    navigateTo(
      localePath(item.link),
      {
        external: true,
        open: { target: '_blank' }
      }
    )
  } else {
    navigateTo(
      localePath(item.value),
      {
        external: false
      }
    )
  }
}
</script>
<template>
  <ClientOnly>
    <div
      class="j-footer relative bg-navbar lg:mt-10 pb-8 md:pb-0 -mx-1 w-[calc(100%+8px)] pr-1 md:mx-0 md:w-full md:pr-0"
    >
      <div
        v-if="screen.md"
        class="w-full h-14 absolute -top-12 left-0 right-0"
        style="background-image: url(https://imagedelivery.net/PqUPeaOeGAxHB9FZtXllkg/3fb89d98-dafc-4843-71a7-9f80a3463f00/public)"
      />

      <UContainer
        class="px-4 w-full flex items-center justify-center"
      >
        <div class="w-full mx-auto xl:max-w-(--breakpoint-xl) relative">
          <div class="py-2 md:py-8 border-b border-b-border">
            <div
              v-if="screen.md"
              class="grid grid-cols-5"
            >
              <div>
                <h4 class="text-heading text-base font-bold">
                  {{ t('games.casino') }}
                </h4>
                <div>
                  <JbBlankButton
                    v-for="(item, idx) in casinoSection"
                    :key="`key-${idx}-hey-a-6`"
                    class="block text-paragraph text-sm leading-normal"
                    @click="navigateToLink(item)"
                  >
                    {{ item?.label || '' }}
                  </JbBlankButton>
                </div>
              </div>
              <div>
                <h4 class="text-heading text-base font-bold">
                  {{ t('footer.support') }}
                </h4>
                <div class="mt-[3px]">
                  <JbBlankButton
                    v-for="(item, idx) in supportSection"
                    :key="`key-${idx}-hey-a-8`"
                    class="flex items-center text-paragraph text-sm leading-[21px] gap-x-2"
                    @click="navigateToLink(item)"
                  >
                    <span>{{ item?.label || '' }}</span>
                    <UIcon
                      v-if="item.openInNew"
                      class="w-4 h-4"
                      name="i-heroicons-arrow-up-right-20-solid"
                    />
                  </JbBlankButton>
                </div>
              </div>
              <div class="">
                <h4 class="text-heading text-base font-bold">
                  {{ t('footer.community') }}
                </h4>
                <div class="mt-[3px]">
                  <JbBlankButton
                    v-for="(item, idx) in communitySection"
                    :key="`key-${idx}-hey-a-10`"
                    class="flex items-center text-paragraph text-sm leading-[21px] gap-x-2"
                    @click="navigateToLink(item)"
                  >
                    <span>{{ item?.label || '' }}</span>
                    <UIcon
                      v-if="item.openInNew"
                      class="w-4 h-4"
                      name="i-heroicons-arrow-up-right-20-solid"
                    />
                  </JbBlankButton>
                </div>
              </div>
              <div class="">
                <h4 class="text-heading text-base font-bold">
                  {{ t('footer.about-junglebet') }}
                </h4>
                <div class="mt-[3px]">
                  <JbBlankButton
                    v-for="(item, idx) in aboutUsSection"
                    :key="`key-${idx}-hey-a-11`"
                    class="flex items-center text-paragraph text-sm leading-[21px] gap-x-2"
                    @click="navigateToLink(item)"
                  >
                    <span>{{ item?.label || '' }}</span>
                    <UIcon
                      v-if="item.openInNew"
                      class="w-4 h-4 min-w-4 min-h-4"
                      name="i-heroicons-arrow-up-right-20-solid"
                    />
                  </JbBlankButton>
                </div>
              </div>
            </div>
            <div v-if="!screen.md">
              <div class="mb-2">
                <DropdownBox
                  :classes="{
                    root: 'px-0 py-0',
                    dropdownLabel: 'text-sm px-0!'
                  }"
                >
                  <template #dropdownLabel>
                    <span class="font-bold text-white">
                      {{ t('games.casino') }}
                    </span>
                  </template>
                  <template #dropdownContent>
                    <div class="pt-1">
                      <div
                        v-for="(item, idx) in casinoSection"
                        :key="`key-${idx}-hey-a-12`"
                        @click="navigateToLink(item)"
                      >
                        <div
                          class="
                          flex flex-row items-center gap-2
                          py-1 cursor-pointer
                          text-paragraph hover:text-white group
                          gap-x-2
                        "
                        >
                          <span class="text-sm">
                            {{ item?.label || '' }}
                          </span>
                          <span v-if="item.openInNew">
                            <UIcon
                              class="w-4 h-4"
                              name="i-heroicons-arrow-up-right-20-solid"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </DropdownBox>
              </div>
              <div class="mb-2">
                <DropdownBox
                  :classes="{
                    root: 'px-0 py-0',
                    dropdownLabel: 'text-sm px-0!'
                  }"
                >
                  <template #dropdownLabel>
                    <span class="font-bold text-white">
                      {{ t('footer.community') }}
                    </span>
                  </template>
                  <template #dropdownContent>
                    <div class="pt-1">
                      <div
                        v-for="(item, idx) in communitySection"
                        :key="`key-${idx}-hey-b-2`"
                        @click="navigateToLink(item)"
                      >
                        <div
                          class="
                          flex flex-row items-center gap-2
                          py-1 cursor-pointer
                          text-paragraph
                          hover:text-white group
                          gap-x-2
                        "
                        >
                          <span class="text-sm">{{ item?.label || '' }}</span>
                          <UIcon
                            v-if="item.openInNew"
                            class="w-4 h-4 min-w-4 min-h-4"
                            name="i-heroicons-arrow-up-right-20-solid"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </DropdownBox>
              </div>
              <div class="mb-2">
                <DropdownBox
                  :classes="{
                    root: 'px-0 py-0',
                    dropdownLabel: 'text-sm px-0!'
                  }"
                >
                  <template #dropdownLabel>
                    <span class="font-bold text-white">
                      {{ t('footer.support') }}
                    </span>
                  </template>
                  <template #dropdownContent>
                    <div class="pt-1">
                      <div
                        v-for="(item, idx) in supportSection"
                        :key="`key-${idx}-hey-b-3`"
                        @click="navigateToLink(item)"
                      >
                        <div
                          class="
                          flex flex-row items-center gap-2
                          cursor-pointer
                          text-paragraph hover:text-white group
                          gap-x-2
                        "
                        >
                          <span class="text-sm">{{ item?.label || '' }}</span>
                          <UIcon
                            v-if="item.openInNew"
                            class="w-4 h-4 min-w-4 min-h-4"
                            name="i-heroicons-arrow-up-right-20-solid"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </DropdownBox>
              </div>
              <div class="mb-2">
                <DropdownBox
                  :classes="{
                    root: 'px-0 py-0',
                    dropdownLabel: 'text-sm px-0! py-0!'
                  }"
                >
                  <template #dropdownLabel>
                    <span class="font-bold text-white">
                      {{ t('footer.about-junglebet') }}
                    </span>
                  </template>
                  <template #dropdownContent>
                    <div class="pt-1">
                      <div
                        v-for="(item, idx) in aboutUsSection"
                        :key="`key-${idx}-hey-b-4`"
                        @click="navigateToLink(item)"
                      >
                        <div
                          class="
                          flex flex-row items-center gap-2
                          cursor-pointer
                          text-paragraph hover:text-white group
                          gap-x-2
                        "
                        >
                          <span class="text-sm">{{ item?.label || '' }}</span>
                          <UIcon
                            v-if="item.openInNew"
                            class="w-4 h-4 min-w-4 min-h-4"
                            name="i-heroicons-arrow-up-right-20-solid"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </DropdownBox>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between py-4 md:py-8 border-b border-b-border">
            <div class="relative w-full overflow-hidden">
              <UPageMarquee :overlay="false">
                <template
                  v-for="(item, idx) in cryptoCurrencies"
                  :key="`key-${idx}-hey-b-6`"
                >
                  <div class="flex items-center gap-x-1">
                    <UIcon
                      v-if="item?.iconType === 'ui'"
                      :name="item.icon"
                      class="w-6 h-6 sm:w-8 sm:h-8"
                    />
                    <svg
                      v-else-if="item?.iconType === 'symbol'"
                      class="w-6 h-6 sm:w-8 sm:h-8"
                    >
                      <use :href="item.icon || ''" />
                    </svg>
                    <UAvatar
                      v-else
                      :alt="item?.name"
                      :src="item?.logo"
                      class="w-6 h-6 sm:w-8 sm:h-8"
                      img-class="w-6 h-6 sm:w-8 sm:h-8"
                      size="sm"
                    />
                    <span class="text-sm text-paragraph text-nowrap font-bold capitalize">{{ item?.name }}</span>
                  </div>
                </template>
              </UPageMarquee>
            </div>
          </div>

          <div class="flex items-center justify-between py-4 md:py-8 border-b border-b-border">
            <div class="flex-1 flex justify-start items-center">
              <span class="w-[57px] sm:w-auto text-xxs md:text-[15px] text-paragraph leading-[120%] font-bold">
                {{ t('footer.responsible-gambling') }}
              </span>
            </div>
            <div class="flex-1">
              <a
                class="w-full flex justify-center items-center"
                href="https://junglebet.com/verify"
                target="_blank"
                rel="noopener noreferrer"
              >
                <NuxtImg
                  alt="Junglebet.com"
                  class="h-9 w-auto"
                  loading="lazy"
                  provider="cloudflare"
                  src="542377dd-d3c6-4bb9-72d9-7fd58cdb7b00/thumb"
                />
              </a>
            </div>
            <div class="flex-1 flex justify-end items-center">
              <NuxtImg
                alt="EllipsePlus"
                class="h-9 w-auto"
                loading="lazy"
                src="/assets/img/footer/EllipsePlus.svg"
              />
            </div>
          </div>

          <div class="flex justify-center flex-col items-center gap-y-2 py-4 md:py-8 mb-0.5 text-xs">
            <div class="flex justify-center flex-col items-center">
              <NuxtLinkLocale
                class="mb-4 sm:mb-3"
                to="/"
              >
                <NuxtImg
                  alt="Logo"
                  class="w-[150px] h-auto"
                  loading="lazy"
                  src="/assets/img/logo.svg"
                />
              </NuxtLinkLocale>
              <p class="text-paragraph leading-normal text-center">
                <span class="font-bold text-primary">Junglebet</span> is owned by Deveron LLC (Reg. No. 3-102-890136,
                Av. Pastor Diaz, Jaco, Costa Rica), licensed/regulated by the Autonomous Island of Anjouan, Union of
                Comoros (Gaming License No. ALSI-062403005-F16), and is legally authorized to conduct gaming operations
                for games of chance and wagering, having passed all regulatory compliance.
              </p>
            </div>
            <div class="grid grid-cols-1 gap-y-0.5 text-center">
              <p class="text-paragrap leading-6">
                © {{ formattedYear }} {{ runtimeConfig.public?.siteName }}.com | {{ t('footer.all-rights-reserved') }}
                | info@junglebet.com
              </p>
              <p class="text-paragraph">
                1 BTC = ${{ numberWithCommas(newPrice) }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </ClientOnly>
</template>
