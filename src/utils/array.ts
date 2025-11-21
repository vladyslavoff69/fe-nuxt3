export function chunk (array: any[], chunkSize: number): any[] {
  return Array.from({ length: array.length / chunkSize }, (_, i) =>
    array.slice(i * chunkSize, i * chunkSize + chunkSize)
  )
}

export function range (start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function transpose (array: any[][]): any[][] {
  return array[0].map((_, colIndex) => array.map(row => row[colIndex]))
}

export function base64urlToArrayBuffer (base64url: string) {
  base64url = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64url.length % 4
  if (pad) {
    base64url += new Array(5 - pad).join('=')
  }
  const binary = atob(base64url)
  const len = binary.length
  const buffer = new ArrayBuffer(len)
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return buffer
}

export function arrayBufferToBase64 (buffer: Iterable<number>) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export function arrayBufferToBase64Url (buffer: any) {
  return arrayBufferToBase64(buffer)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
