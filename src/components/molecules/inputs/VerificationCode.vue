<script lang="ts" setup>
const {
  width = 'w-12 h-12 md:w-16 md:h-16',
  inputClass
} = defineProps<{
  width?: string;
  inputClass?: string;
}>()

const emit = defineEmits<{ (e: 'update:code', value: string): void }>()

const code = ref<string[]>(new Array(6))

const inputRefs = ref([])
let dataFromPaste: string[] | undefined = []
const keysAllowed: string[] = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
]

const codesAllowed: string[] = ['KeyV']

const isNumber = (event: Event) => {
  (event.currentTarget as HTMLInputElement).value = ''
  const keyPressed: string = (event as KeyboardEvent).key
  const codePressed: string = (event as KeyboardEvent).code
  if (!(keysAllowed.includes(keyPressed) || codesAllowed.includes(codePressed))) {
    event.preventDefault()
  }
}
const handleInput = async (event: Event, index: number) => {
  const inputType = (event as InputEvent).inputType
  let currentActiveElement = event.target as HTMLInputElement
  if (inputType === 'insertText') {
    const nextInput = inputRefs.value[index + 1]
    code.value[index] = currentActiveElement.value
    if (nextInput) {
      // @ts-ignore
      nextInput?.focus()
    } else {
      // @ts-ignore
      inputRefs.value[index]?.blur()
    }
    emit('update:code', code.value.join(''))
  }

  if (inputType === 'insertFromPaste' && dataFromPaste) {
    for (const num of dataFromPaste) {
      const id: number = parseInt(currentActiveElement.id.split('_')[1])
      code.value[id] = num
      const nextInput = inputRefs.value[id + 1]
      if (nextInput) {
        currentActiveElement = nextInput as HTMLInputElement
        // @ts-ignore
        nextInput?.focus()
      } else {
        // @ts-ignore
        nextInput?.blur()
      }
      emit('update:code', code.value.join(''))
    }
  }
}

const onPaste = (event: Event) => {
  dataFromPaste = (event as ClipboardEvent).clipboardData
    ?.getData('text')
    .trim()
    .split('')
  if (dataFromPaste) {
    for (const num of dataFromPaste) {
      if (!keysAllowed.includes(num)) {
        event.preventDefault()
      }
    }
  }
}

const onDelete = async (index: number) => {
  code.value[index] = ''
  const prevInput = inputRefs.value[index - 1]
  // @ts-ignore
  prevInput?.focus()
  emit('update:code', code.value.join(''))
}

onMounted(() => {
  if (inputRefs.value && inputRefs.value.length) {
    // @ts-ignore
    inputRefs.value[0]?.focus()
  }
})
</script>
<template>
  <div
    class="
      flex w-full lg:grid lg:grid-cols-6
      gap-x-2 sm:gap-x-3
      overflow-hidden
      justify-between"
  >
    <input
      v-for="(n, index) in code"
      :id="`input_${index}`"
      :key="`vc-3-${index}`"
      ref="inputRefs"
      v-model="code[index]"
      :class="[`code_input_${n}`, width, inputClass]"
      :autofocus="index === 0"
      class="
        block text-center text-white font-inter outline-hidden
        ring-0 transition duration-150 ease-in-out focus:outline-hidden
        focus:shadow-none focus:ring-0 focus:border-highlights hover:border-highlights
        disabled:cursor-not-allowed disabled:opacity-75
        bg-green-950 border border-transparent
        rounded-md text-sm sm:text-base
      "
      maxlength="1"
      pattern="\d*"
      type="text"
      @input="(e) => handleInput(e, index)"
      @keydown="isNumber"
      @paste="onPaste"
      @keydown.delete="onDelete(index)"
    >
  </div>
</template>
