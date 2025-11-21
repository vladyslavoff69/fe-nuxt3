<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import RegisterPasskeyModal from '~/components/pages/account/contents/RegisterPasskeyModal.vue'
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import type { ID, PasskeyItem } from '~/types'

const { listKeys, deleteKey, updateKeyName, loading } = usePasskeys()

const { table, thead, tbody, tr, td, th } = useTable()
const { t } = useI18n()

const registerModalVisible = ref<boolean>(false)
const selectedId = ref<ID>(0)
const editModalVisible = ref<boolean>(false)
const deleteModalVisible = ref<boolean>(false)
const deviceName = ref<string>('')
const rows = ref<PasskeyItem[]>([])
const trs = ['bg-transparent', 'bg-green-950']
const columns = [
  { label: `${t('base.device')} ${t('base.name')}`, id: 'name', class: '' },
  { label: t('base.created_at'), id: 'created_at', class: 'w-2/5 sm:w-1/3' },
  { label: t('base.action'), id: 'actions', class: 'w-1/6' },
]

const loadKeys = async () => {
  rows.value = await listKeys()
}

const onCloseModal = () => {
  registerModalVisible.value = false

  loadKeys()
}

const handleDeleteConfirmation = (id: ID) => {
  selectedId.value = id
  deleteModalVisible.value = true
}

const handleEditModal = (id: ID, name: string) => {
  selectedId.value = id
  deviceName.value = name
  editModalVisible.value = true
}

const onUpdateKey = async () => {
  await updateKeyName(selectedId.value, deviceName.value)

  selectedId.value = 0
  deviceName.value = ''
  editModalVisible.value = false

  await loadKeys()
}

const onDeleteKey = async () => {
  await deleteKey(selectedId.value)

  selectedId.value = 0
  deleteModalVisible.value = false

  await loadKeys()
}

onMounted(() => {
  loadKeys()
})
</script>

<template>
  <div class="w-full">
    <div class="w-full flex items-center justify-end">
      <JButton
        class="h-8 py-1"
        @click="registerModalVisible = true"
      >
        {{ t('account.register-key') }}
      </JButton>
    </div>
    <ClientOnly>
      <table
        class="w-full table-fixed"
        :class="[table]"
      >
        <thead :class="thead">
          <tr :class="tr">
            <td
              v-for="(column, colIdx) in columns"
              :key="colIdx"
              class="leading-normal"
              :class="[th, column?.class || '']"
            >
              {{ column?.label || '' }}
            </td>
          </tr>
        </thead>

        <!--TBody-->
        <tbody :class="tbody">
          <template v-if="loading">
            <tr
              v-for="index in 5"
              :key="index"
              :class="[tr, trs[index % 2]]"
            >
              <template
                v-for="(col, colIdx) in columns"
                :key="`r_${index}_${col.id}`"
              >
                <td
                  v-if="col.id === 'actions'"
                  class="py-3"
                  :class="[td, col?.class || '']"
                >
                  <div class="w-full flex items-center gap-1">
                    <USkeleton
                      class="w-8 h-5"
                      :class="{
                        'bg-green-950': index % 2 === 0,
                        'bg-brand': index % 2 !== 0
                      }"
                    />
                    <USkeleton
                      class="w-8 h-5"
                      :class="{
                        'bg-green-950': index % 2 === 0,
                        'bg-brand': index % 2 !== 0
                      }"
                    />
                  </div>
                </td>
                <td
                  v-else
                  class="py-3"
                  :class="[
                    td, col?.class || ''
                  ]"
                >
                  <div class="w-full flex-1">
                    <USkeleton
                      class="w-20 h-5"
                      :class="{
                        'bg-green-950': index % 2 === 0,
                        'bg-brand': index % 2 !== 0
                      }"
                    />
                  </div>
                </td>
              </template>
            </tr>
          </template>
          <template v-else>
            <template v-if="rows && rows.length > 0">
              <tr
                v-for="(row, index) in rows"
                :key="index"
                :class="[tr, trs[index % 2]]"
              >
                <template
                  v-for="col in columns"
                  :key="`r_${index}_${col.id}`"
                >
                  <td
                    v-if="col.id === 'actions'"
                    class="py-3"
                    :class="[
                      td, col?.class || ''
                    ]"
                  >
                    <div class="flex items-center gap-1 sm:gap-2">
                      <UIcon
                        class="w-4 h-4 cursor-pointer text-red-600"
                        name="heroicons:trash"
                        @click="handleDeleteConfirmation(row?.id)"
                      />
                      <UIcon
                        class="w-4 h-4 cursor-pointer text-paragraph hover:text-white"
                        name="heroicons:pencil-square-20-solid"
                        @click="handleEditModal(row?.id, row?.name)"
                      />
                    </div>
                  </td>
                  <td
                    v-else-if="col.id === 'created_at'"
                    class="py-3"
                    :class="[
                      td, col?.class || ''
                    ]"
                  >
                    {{ useDateFormat(new Date(row.created_at), "MM/DD/YY, hh:mm A").value }}
                  </td>
                  <td
                    v-else
                    class="py-3"
                    :class="[
                      td, col?.class || ''
                    ]"
                  >
                    <span class="leading-normal truncate">
                      {{ row[col.id] }}
                    </span>
                  </td>
                </template>
              </tr>
            </template>
            <template v-else>
              <tr :class="tr">
                <td
                  class="py-3 text-center text-paragraph bg-green-950 italic"
                  :class="[
                    td
                  ]"
                  :colspan="columns.length"
                >
                  {{ t('base.no-data') }}
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </ClientOnly>

    <RegisterPasskeyModal
      v-if="registerModalVisible"
      :modal-visible="registerModalVisible"
      @close:register-modal="onCloseModal"
    />

    <ClientOnly>
      <UModal
        v-model:open="editModalVisible"
        class="w-11/12 sm:max-w-sm p-2 sm:p-4"
        :default-open="editModalVisible"
        @update:open="(v) => {
        if (!v) {
          editModalVisible = false
        }
      }"
      >
        <template #content>
          <div class="flex flex-col gap-3 sm:gap-4 w-full">
            <div class="flex justify-between items-center w-full">
              <div class="text-white font-bold text-xl leading-none!">
                {{ t('account.update-device-name') }}
              </div>
              <CloseButton
                class="w-3 h-3 min-w-3 min-h-3"
                @click="editModalVisible = false"
              />
            </div>
            <hr class="h-px w-full border border-border -mt-1 lg:-mt-2">
            <UInput
              v-model="deviceName"
              class="flex-1"
              color="neutral"
              placeholder="Device Name(Optional)"
              size="lg"
              type="text"
            />
            <JButton
              class="h-10 py-1"
              @click="onUpdateKey"
            >
              {{ t('base.submit') }}
            </JButton>
          </div>
        </template>
      </UModal>
    </ClientOnly>

    <ClientOnly>
      <UModal
        v-model:open="deleteModalVisible"
        :default-open="deleteModalVisible"
        class="w-11/12 sm:max-w-sm p-2 sm:p-4"
        @update:open="(v) => {
        if (!v) {
          editModalVisible = false
        }
      }"
      >
        <template #content>
          <div class="flex flex-col gap-3 sm:gap-4 w-full">
            <div class="flex justify-between items-center w-full">
              <div class="text-white font-bold text-xl leading-none!">
                {{ t('base.delete') }} {{ t('base.key') }}
              </div>
              <CloseButton
                class="w-3 h-3 min-w-3 min-h-3"
                @click="deleteModalVisible = false"
              />
            </div>
            <hr class="h-px w-full border border-border -mt-1 lg:-mt-2">
            <p>
              {{ t('notifications.delete-confirmation') }}
            </p>
            <div class="flex items-center gap-1 sm:gap-2 w-full justify-end">
              <JButton
                button-class="border-0 ring-0"
                class="h-9 py-1 w-full"
                size="md"
                @click="onDeleteKey"
              >
                {{ t('base.delete') }}
              </JButton>
            </div>
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
