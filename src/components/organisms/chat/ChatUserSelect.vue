<script lang="ts" setup>
import { CHAT } from '~/constants'
import type { User } from '~/types'

const { chatRoomUsers, userRefOnInput, input } = inject(CHAT)!
const searchedUsers = computed(() =>
  chatRoomUsers.value.filter(u =>
    u?.username?.toLowerCase()
      .includes(userRefOnInput.value.keyword.toLowerCase())
  )
)

const state = reactive({
  active: 0,
})

const selectUser = (user: User) => {
  input.value = input.value.replace(/@(?<keyword>[^@\s\r]*)$/, `@${user?.username} `)
}

const handleKeypress = (e: KeyboardEvent) => {
  switch (e.key) {
  case 'ArrowDown':
    state.active = Math.min(state.active + 1, searchedUsers.value.length - 1)
    break
  case 'ArrowUp':
    state.active = Math.max(state.active - 1, 0)
    break
  case 'Enter':
    if (searchedUsers.value.length > 0) {
      selectUser(searchedUsers.value[state.active])
    } else {
      selectUser({ username: userRefOnInput.value.keyword } as User)
    }
    break
  default:
    break
  }
}

watch(
  () => searchedUsers.value,
  () => {
    state.active = 0
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeypress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeypress)
})
</script>
<template>
  <div
    class="
      ChatUserSelect
      bg-secondary-gradient
      rounded-t-lg
      border-t border-secondary-color
      shadow-secondary-box
      overflow-hidden
    "
  >
    <JbScrollbar height="400px">
      <ul
        v-if="searchedUsers.length"
        class="cursor-pointer"
      >
        <li
          v-for="(user, index) in searchedUsers"
          :key="user.id"
          class="border-b last:border-b-0"
          style="border-color: #3d4350"
        >
          <button
            :class="{ 'bg-green-950': state.active === index }"
            class="
              py-3
              px-4
              hover:bg-[#3d4350]
              text-white
              block
              w-full
              text-left
              duration-150
            "
            @click="selectUser(user)"
          >
            {{ user?.username }}
          </button>
        </li>
      </ul>
      <div
        v-else
        class="py-3 px-4 text-white text-sm"
      >
        No users matched for <b>{{ userRefOnInput.keyword }}</b>
      </div>
    </JbScrollbar>
  </div>
</template>
