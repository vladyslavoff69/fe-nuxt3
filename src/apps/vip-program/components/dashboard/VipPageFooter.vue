<script lang="ts" setup>
const { toggleChat } = useCrisp()
const { t } = useI18n()
const handleChatButtonClick = () => {
  if (import.meta.client) {
    toggleChat()
  }
}

const handleHelpButtonClick = () => {
  if (import.meta.client) {
    window.open('https://junglebet.crisp.help/')
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="bg-green-950 p-4 rounded-md overflow-hidden h-full col-span-1 flex flex-col gap-3">
      <div class="w-full gap-4 flex flex-col">
        <div class="text-center md:text-left text-lg text-white font-bold">
          {{ t('vip.have-ques') }}
        </div>
        <p class="text-center md:text-left text-sm">
          {{ t('vip.have-ques-txt') }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <JButton
          class="w-full px-1!"
          shape="circle"
          variant="outline"
          @click="handleHelpButtonClick"
        >
          {{ t('vip.help-center') }}
        </JButton>
        <JButton
          class="w-full px-1! font-bold"
          shape="circle"
          variant="outline"
          @click="handleChatButtonClick"
        >
          {{ t('vip.chat-us') }}
        </JButton>
      </div>
    </div>
  </div>
</template>
