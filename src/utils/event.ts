export const isInputEvent = (e: KeyboardEvent | MouseEvent): boolean => {
  const target = e.target as HTMLElement
  return ['INPUT', 'TEXTAREA'].includes(target.tagName)
}
