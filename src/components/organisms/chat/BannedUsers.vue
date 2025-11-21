<script lang="ts" setup>
import BannedUserRow from './BannedUserRow.vue'
import type { Ban } from '~/types'
import { BANNED_USERS_QUERY } from '~/graphql'

const { t } = useI18n()
const keyword = ref()
const { table, thead, trs, th } = useTable()

const {
  result: bannedUsersResult,
  loading,
  refetch,
} = useQuery<{
  bannedUsers: { data: Ban[] };
}>(
  BANNED_USERS_QUERY,
  { first: 100 },
  { fetchPolicy: 'no-cache' }
)
const bannedUsers = computed(
  () => bannedUsersResult.value?.bannedUsers?.data || []
)
const bannedUsersFiltered = computed(() =>
  bannedUsers.value.filter(ban =>
    ban.banned?.username?.toLowerCase().includes(keyword.value?.toLowerCase())
  )
)

const handleEndTimeout = () => {
  // cron jobs in backend does not update banned users on time properly, so it needs some re-try refetch
  setTimeout(() => {
    refetch()
  }, 1000)
  setTimeout(() => {
    refetch()
  }, 30 * 1000)
  setTimeout(() => {
    refetch()
  }, 60 * 1000)
}
</script>
<template>
  <div class="grid grid-cols-1 gap-y-2 pb-1">
    <div class="g-mb-md">
      <label class="g-label mb-2.5 block">Search</label>
      <JInput
        v-model="keyword"
        placeholder="Enter username to search muted list"
      />
    </div>
    <div class="">
      <div :class="table">
        <div
          :class="thead"
          class="pb-0!"
        >
          <div class="flex items-center text-left">
            <div
              :class="th"
              :style="{ flex: 1 }"
            >
              {{ t('account.username') }}
            </div>
            <div
              :class="th"
              :style="{ flex: 1 }"
            >
              {{ t('chat.time-left') }}
            </div>
          </div>
        </div>
        <div v-if="!loading">
          <JbScrollbar
            class="w-full"
            height="225px"
            style-type="content"
          >
            <div
              v-for="(row, index) in bannedUsersFiltered"
              :key="index"
              :class="trs[index % 2]"
              class="text-left bg-brand"
            >
              <JHeightTransition
                v-slot="{ state, setState }"
                class="rounded-md"
              >
                <div
                  class="
                    relative
                    min-h-[45px]
                    flex flex-col
                    justify-center
                    cursor-pointer
                  "
                  @click="setState(!state)"
                >
                  <div class="absolute top-1/2 left-2 -translate-y-1/2">
                    <UIcon
                      v-if="state"
                      class="w-5 h-5"
                      name="i-heroicons-chevron-up-20-solid"
                    />
                    <UIcon
                      v-else
                      class="w-5 h-5"
                      name="i-heroicons-chevron-down-20-solid"
                    />
                  </div>
                  <div class="pl-8 pr-3">
                    <BannedUserRow
                      :ban="row"
                      @end-timeout="handleEndTimeout"
                    />
                  </div>
                </div>
                <template v-if="state">
                  <div class="px-5 pt-1 pb-3 text-left text-sm">
                    {{ row.comment }}
                  </div>
                </template>
              </JHeightTransition>
            </div>
          </JbScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
