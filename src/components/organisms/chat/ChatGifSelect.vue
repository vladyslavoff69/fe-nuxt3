<script lang="ts" setup>
const keyword = ref('')

const gifs = [
  {
    id: 1,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 2,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 3,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 4,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 5,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 6,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 7,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 8,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 9,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
  {
    id: 10,
    url: 'https://media.tenor.com/6On54eyPJNkAAAAM/run-forrest-puppet.gif',
  },
]
</script>
<template>
  <div
    class="
      ChatGifSelect
      bg-secondary-gradient
      rounded-t-lg
      border-t border-secondary-color
      shadow-secondary-box
      overflow-hidden
      px-4
      pt-3
    "
  >
    <div class="pb-3 border-b border-[#3D4350] mb-[15px]">
      <JInput
        v-model="keyword"
        placeholder="Search Tenor"
      >
        <template #endIcon>
          <div class="w-[50px] h-full flex items-center justify-center">
            <UIcon
              class="w-5 h-5"
              name="heroicons:magnifying-glass-20-solid"
            />
          </div>
        </template>
      </JInput>
    </div>
    <JScrollBar
      height="278px"
      style-type="content"
    >
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="gif in gifs"
          :key="gif.id"
          :style="{
            backgroundImage: `url(${gif.url})`,
          }"
          class="h-20 overflow-hidden rounded-md"
        />
      </div>
    </JScrollBar>
  </div>
</template>
