<script lang="ts" setup>
defineProps<{
  isActive: boolean
}>()
</script>

<template>
  <JbBlankButton
    :class="{
      'is-active text-white': isActive,
      'text-brand': !isActive
    }"
    class="like-button w-5 h-5 rounded-full bg-white transition duration-300 transform hover:scale-[1.1] hover:text-black"
  >
    <UIcon
      class="w-3 h-3 min-h-3 min-w-3 heart-icon not-liked relative top-px"
      name="i-heroicons-heart"
    />
    <UIcon
      class="w-3 h-3 min-h-3 min-w-3 heart-icon is-liked bg-red-400 relative top-px text-white"
      name="i-heroicons-heart-20-solid"
    />
    <span class="like-overlay" />
  </JbBlankButton>
</template>

<style lang="scss" scoped>
$fade-grey: #ededed;
$grey: #ccc;
$muted-grey: #999;
$heart: #ff4f8f;

.like-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  overflow: hidden;

  .like-overlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $heart;
    transform: scale(0);
    transition: all .4s;
    z-index: 0;
  }

  .heart-icon {
    &.not-liked {
      display: block;
      position: relative;
      z-index: 1;
    }

    &.is-liked {
      display: none;
      position: relative;
      z-index: 1;
    }
  }

  &.is-active {
    .like-overlay {
      transform: scale(1);
    }

    i {
      &.not-liked {
        display: none;
      }

      &.is-liked {
        display: block;
      }
    }
  }
}

//Watch me get bouncy
@-webkit-keyframes bouncy {
  from, to {
    -webkit-transform: scale(1, 1);
  }
  25% {
    -webkit-transform: scale(0.9, 1.1);
  }
  50% {
    -webkit-transform: scale(1.1, 0.9);
  }
  75% {
    -webkit-transform: scale(0.95, 1.05);
  }
}

@keyframes bouncy {
  from, to {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(0.9, 1.1);
  }
  50% {
    transform: scale(1.1, 0.9);
  }
  75% {
    transform: scale(0.95, 1.05);
  }
}
</style>
