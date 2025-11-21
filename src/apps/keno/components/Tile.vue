<script lang="ts" setup>
import { COLOR_KENO_HITS } from '~/icons'

const {
  selected = false,
  opened = false,
  instantMode = false,
  disabled = false,
  loading = false,
  inAutoPick = false
} = defineProps<{
  tileNumber?: number;
  selected?: boolean;
  opened: boolean;
  instantMode?: boolean;
  disabled?: boolean;
  loading?: boolean;
  inAutoPick?: boolean;
}>()
</script>

<template>
  <button
    :class="{
      'pointer-events-none': disabled || loading || inAutoPick,
      'opacity-50': disabled && !opened,
      'animate-scale-in': instantMode
    }"
    :disabled="disabled"
    class="KenoTile relative font-bold rounded-md select-none aspect-square w-full hover:text-white"
    style="padding-top: 100%;"
  >
    <template v-if="instantMode">
      <div class="absolute z-10 inset-0 left-0 top-0 rounded-md">
        <div
          :class="{
            'bg-border': !selected && !opened,
            'bg-primary text-white': selected && !opened,
            'bg-bet-gradient text-tile': selected && opened,
          }"
          class="
            absolute inset-0 left-0 top-0 rounded-md place-content-center
            grid md:mouse:hover:brightness-100 md:mouse:hover:-translate-y-1 hover:text-white
          "
        >
          {{ tileNumber }}
        </div>
      </div>
      <div
        v-if="opened"
        :class="{'bg-green-950': !selected, 'bg-tile': selected}"
        class="
          absolute inset-0 left-0 top-0 rounded-md w-full h-full z-11 grid place-content-center duration-0
        "
        style="z-index: 11"
      >
        <span
          v-if="selected"
          class="absolute inset-0 rounded-md bg-bet-gradient overflow-hidden w-full h-full"
        >
          <span class="absolute z-10 inset-0.5 md:inset-1 rounded-md bg-border">
            <span class="absolute inset-1 md:inset-1.5 grid place-content-center">
              <span class="absolute z-20 text-tile w-full h-full flex items-center justify-center">
                {{ tileNumber }}
              </span>
              <NuxtImg
                alt="Junglebet.com Mine stars"
                class="absolute z-10 inset-0 aspect-square object-fill object-center scale-150"
                loading="lazy"
                src="/assets/icons/game/keno/mine-stars.svg"
              />
              <svg class="w-full h-full">
                <use :href="COLOR_KENO_HITS" />
              </svg>
            </span>
          </span>
        </span>
        <span
          v-if="selected"
          class="absolute inset-0 rounded-full bg-bet-gradient w-full h-full opacity-25"
        />
        <span
          v-else
          class="text-border"
          style="z-index: 60"
        >{{ tileNumber }}</span>
      </div>
    </template>
    <template v-else>
      <div class="absolute z-10 inset-0 left-0 top-0 rounded-md">
        <div
          :class="{
            'md:mouse:hover:-translate-y-1 bg-border': !selected && !opened,
            'bg-primary text-white': selected && !opened,
            'bg-bet-gradient text-tile': selected && opened,
            'animate-scale-in': selected && inAutoPick
          }"
          class="
            absolute inset-0 left-0 top-0 rounded-md transition-all duration-150 hover:text-white
            md:active:duration-0 ease-[cubic-bezier(.55,0,.38,1)] md:mouse:hover:brightness-100
            place-content-center grid md:mouse:hover:brightness-100 md:mouse:hover:-translate-y-1
          "
        >
          {{ tileNumber }}
        </div>
      </div>
      <div
        v-if="opened"
        :class="{'bg-green-950': !selected, 'bg-tile': selected}"
        :style="{
          animationDuration: '0.15s',
        }"
        class="
          absolute inset-0 left-0 top-0 rounded-md w-full h-full grid place-content-center duration-0
        "
        style="z-index: 11"
      >
        <span
          v-if="selected"
          class="absolute inset-0 rounded-md bg-bet-gradient overflow-hidden w-full h-full"
        >
          <i
            class="
              absolute z-0 inset-0 bg-size-[300%_auto] animate-home-rays opacity-60 bg-bet-gradient
              bg-no-repeat ease-[cubic-bezier(.75,0,.2,1)] transition-all duration-200 mix-blend-plus-lighter
            "
          />
          <span class="absolute z-10 inset-0.5 md:inset-1 rounded-md bg-border">
            <span class="absolute inset-1 md:inset-1.5 grid place-content-center animate-fire-in">
              <span class="absolute z-20 text-tile w-full h-full flex items-center justify-center">
                {{ tileNumber }}
              </span>
              <NuxtImg
                alt="Junglebet.com"
                class="absolute z-10 inset-0 aspect-square object-fill object-center scale-150"
                loading="lazy"
                src="/assets/icons/game/keno/mine-stars.svg"
              />
              <svg class="w-full h-full">
                <use :href="COLOR_KENO_HITS" />
              </svg>
            </span>
          </span>
        </span>
        <span
          v-if="selected"
          class="absolute inset-0 rounded-full bg-bet-gradient w-full h-full animate-coinflip-impact"
        />
        <span
          v-else
          class="text-error"
          style="z-index: 60"
        >{{ tileNumber }}</span>
      </div>
    </template>
  </button>
</template>

<style lang="scss">
@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fireIn {
  0% {
    opacity: 0;
    transform: scale(2);
    filter: brightness(1000%);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: brightness(100%);
  }
}

@keyframes coinflipImpact {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.75);
    opacity: 0;
  }
}

.KenoTile {
  &.animate-scale-in, .animate-scale-in {
    animation: scaleIn 0.2s cubic-bezier(0.8, 0, 0.2, 1) both;
  }

  .animate-fire-in {
    animation: fireIn 0.9s cubic-bezier(0.8, 0, 0.2, 1) both;
  }

  .animate-coinflip-impact {
    animation: coinflipImpact 1s cubic-bezier(0, 1, .6, 1) both;
  }
}
</style>
