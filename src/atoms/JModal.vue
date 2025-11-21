<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

const {
  isOpen = false,
  className,
  height = 392,
  isModal = false,
  classes = {
    DialogPanel: '',
    DialogWrapper: 'md:items-center',
  },
} = defineProps<{
  isOpen: boolean;
  className?: any;
  height?: number;
  isModal?: boolean;
  classes?: {
    DialogPanel?: string;
    DialogWrapper?: string;
  } | undefined
}>()

const isOpeningStarted = ref<boolean>(false)
watch(
  () => height,
  () => {
    isOpeningStarted.value = true
    setTimeout(() => {
      isOpeningStarted.value = false
    }, 300)
  },
)

const emit =
  defineEmits<{
    (e: 'close:simpleModal'): void;
  }>()

const handleCloseModal = () => {
  emit('close:simpleModal')
}

const onPreventClick = (event: Event) => {
  event.preventDefault()
}

const onClose = () => {
  if (!isModal) {
    handleCloseModal()
  }
}

const onClickBackdrop = () => {
  if (!isModal) {
    handleCloseModal()
  }
}
</script>
<template>
  <TransitionRoot
    :show="isOpen"
    appear
    as="template"
  >
    <Dialog
      as="div"
      class="relative z-1002"
      @close="onClose"
    >
      <TransitionChild
        as="template"
        enter="duration-150 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-150 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-green-950/40 backdrop-blur-xs"
          @click="onClickBackdrop"
        />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          :class="[
            classes.DialogWrapper
          ]"
          class="flex min-h-full justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-150 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-150 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogPanel
              :class="[
                classes.DialogPanel,
                isOpeningStarted ? 'overflow-hidden' : '',
                className
              ]"
              class="
                transform bg-green-1000 flex flex-col rounded-md transition-all duration-150 ease-in-out
                relative min-w-80 text-white mt-4 md:mt-0 ring-1 ring-border
              "
              @click.stop="onPreventClick"
            >
              <div class="w-full relative flex justify-between z-10">
                <slot name="header" />

                <CloseButton
                  class="w-4 h-4 ml-auto text-paragraph"
                  @click="handleCloseModal"
                />
              </div>

              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
