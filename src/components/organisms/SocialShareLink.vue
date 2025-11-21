<script lang="ts" setup>
import {
  FACEBOOK_ICON,
  GOOGLE_FILL_ICON,
  INSTAGRAM_ICON,
  NP_LINK_ICON,
  TELEGRAM_ICON,
  TWITTER_X_ICON,
} from '~/icons'

const {
  showNp = true,
  showTelegram = true,
  showTwitter = true,
  showInstagram = true,
  showFacebook = true,
  showGoogleFill = true,
} = defineProps<{
  showNp?: boolean;
  showTelegram?: boolean;
  showTwitter?: boolean;
  showInstagram?: boolean;
  showFacebook?: boolean;
  showGoogleFill?: boolean;
}>()

const runtimeConfig = useRuntimeConfig()
const socialLinks = runtimeConfig.public?.socialLinks as any
</script>

<template>
  <div class="flex items-center gap-[9px] w-[275px]">
    <a
      v-if="showNp"
      :href="socialLinks.np"
      class="
        rounded-[6px] p-1 inline-flex justify-center items-center
        w-[31.5px] h-[30px] bg-green-950 backdrop-blur-[7.5px]
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg class="text-white cursor-pointer w-[19px] h-[19px]">
        <use :href="NP_LINK_ICON" />
      </svg>
    </a>

    <a
      v-if="showTelegram"
      :href="socialLinks.telegram"
      class="
        rounded-[6px] p-1 inline-flex justify-center items-center
        w-[31.5px] h-[30px]
        bg-green-950 backdrop-blur-[7.5px]
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg class="text-white cursor-pointer w-[18px] h-[15px]">
        <use :href="TELEGRAM_ICON" />
      </svg>
    </a>

    <a
      v-if="showTwitter"
      :href="socialLinks.twitter"
      class="
        rounded-[6px] p-1 inline-flex justify-center items-center
        w-[31.5px] h-[30px]
        bg-green-950 backdrop-blur-[7.5px]
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg class="text-white cursor-pointer w-[17px] h-[16px]">
        <use :href="TWITTER_X_ICON" />
      </svg>
    </a>

    <a
      v-if="showInstagram"
      :href="socialLinks.instagram"
      class="
        rounded-[6px] p-1 lg:inline-flex justify-center items-center
        w-[31.5px] h-[30px] hidden bg-green-950 backdrop-blur-[7.5px]
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg class="text-white cursor-pointer w-[17px] h-[17px]">
        <use :href="INSTAGRAM_ICON" />
      </svg>
    </a>

    <a
      v-if="showFacebook"
      :href="socialLinks.facebook"
      class="
        rounded-[6px] p-1 lg:inline-flex justify-center items-center
        w-[31.5px] h-[30px] hidden bg-green-950 backdrop-blur-[7.5px]
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg class="text-white cursor-pointer w-[21px] h-[20.25px]">
        <use :href="FACEBOOK_ICON" />
      </svg>
    </a>

    <a
      v-if="showInstagram"
      :href="socialLinks.instagramPage"
      class="
        rounded-[6px] p-1 inline-flex justify-center items-center
        w-[31.5px] h-[30px] lg:hidden bg-green-950 backdrop-blur-[7.5px]
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg class="text-white cursor-pointer w-[17px] h-[17px]">
        <use :href="INSTAGRAM_ICON" />
      </svg>
    </a>

    <a
      v-if="showFacebook"
      :href="socialLinks.facebookPage"
      class="
        rounded-[6px] p-1 inline-flex justify-center items-center
        w-[31.5px] h-[30px] lg:hidden bg-green-950 backdrop-blur-[7.5px]
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg class="text-white cursor-pointer w-[21px] h-[20.25px]">
        <use :href="FACEBOOK_ICON" />
      </svg>
    </a>

    <a
      v-if="showGoogleFill"
      :href="socialLinks.googleFill"
      class="
        rounded-[6px] p-1 inline-flex justify-center items-center
        w-[31.5px] h-[30px] bg-green-950 backdrop-blur-[7.5px]
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg class="text-white cursor-pointer w-[19.5px] h-[19.5px]">
        <use :href="GOOGLE_FILL_ICON" />
      </svg>
    </a>
  </div>
</template>
