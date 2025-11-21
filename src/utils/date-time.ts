export const twoNumbers = (n: number): string => {
  if (n >= 10) {
    return `${n}`
  }
  return `0${n}`
}
