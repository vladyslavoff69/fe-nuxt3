<template>
  <div class="dice w-5 h-5 lg:w-7 lg:h-7 relative">
    <div
      v-for="i in 6"
      :key="`di-1-${i}`"
      class="
        absolute w-full h-full bg-accent-gradient border-2 border-gold
        before:bg-amber-400 flex items-center justify-center opacity-75 side
      "
      :class="[`side-${i}`]"
    />
  </div>
</template>

<style lang="scss" scoped src="~/assets/css/pages/dice.scss"></style>
