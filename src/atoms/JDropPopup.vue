<script lang="ts" setup>
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'

const {
  menuItemsPlacement = '-right-2',
} = defineProps<{
  menuItemsPlacement?: string;
}>()
</script>
<template>
  <ClientOnly>
    <Menu
      as="div"
      class="relative w-full block text-left"
    >
      <div class="flex items-center">
        <MenuButton
          class="w-full"
        >
          <slot name="trigger" />
        </MenuButton>
      </div>

      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          :class="[
            menuItemsPlacement
          ]"
          class="
            j-dropdown-menu-items absolute bg-green-950 mt-0.5 w-56 origin-top-right
            rounded-md shadow-lg ring-1 ring-border focus:outline-hidden z-10
          "
        >
          <slot name="menuItems" />
        </MenuItems>
      </Transition>
    </Menu>
  </ClientOnly>
</template>
