<script lang="ts" setup>
import { CHAT } from '~/constants'
// import { GAvatar, GCloseButton } from '@/atoms';
// import { replyIcon } from '@/icons';
import { AUTH } from '~/constants'
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
// import { getModalLinkForUser } from '@/hooks';

const { replyingTo } = inject(CHAT)!
const { me } = inject(AUTH)!

// const href = getModalLinkForUser(replyingTo.value!.user);
const href = '#'
const classes =
  replyingTo.value?.user?.username === me.value?.username
    ? 'g-text-third-gradient'
    : 'g-text-primary-gradient'

</script>
<template>
  <div class="ReplyingTo text-white">
    <div class="flex items-center mb-1.5 gap-x-2">
      <UIcon
        class="w-4 h-4"
        name="ion:reply"
      />
      <span class="text-sm font-medium">Replying to</span>
      <div class="flex items-center">
        <VipRankImg
          :vip-level-name="replyingTo?.user?.vip_level_name"
          class="w-5 h-5 min-w-5 min-h-5"
        />
        <a
          :href="href"
          class="text-primary mr-auto"
        >@{{ replyingTo?.user?.username }}</a>
      </div>
      <JbBlankButton @click="replyingTo = null">
        <UIcon
          class="w-3.5 h-3.5 md:w-4 md:h-4 text-white"
          name="heroicons:x-mark-20-solid"
        />
      </JbBlankButton>
    </div>
    <div
      class="text-sm font-medium"
      v-html="replyingTo?.message"
    />
  </div>
</template>
