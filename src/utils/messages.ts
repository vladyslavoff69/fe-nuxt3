export function collectSegmentMessages (text: string) {
  if (!text || text === '') {
    return []
  }

  const runtimeConfig = useRuntimeConfig()
  const chatRainConf = runtimeConfig.public?.chatRain

  const segments = [] as any[]

  // Define a regex pattern to match the link format
  const betIdRegex = /\/betid\s+([a-f0-9-]+)/i
  // Use regex to search for the link pattern in the message
  const matches = text?.split(betIdRegex)
  if (matches && matches.length) {
    // Iterate over the matches
    matches?.forEach((match, index) => {
      if (index % 2 === 0) {
        segments.push({ type: 'text', content: match?.replace('rain', chatRainConf) })
      } else {
        segments.push({ type: 'betId', content: match })
      }
    })
  }

  return segments.filter(item => item.content && item.content !== '')
}
