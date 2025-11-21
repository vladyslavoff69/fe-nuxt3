import { useLocalStorage } from '@vueuse/core'

export const useGameSettingStore = (slug: string = 'dice') => {
  const game = useLocalStorage('JB_GAME', slug)
  const hotKey = useLocalStorage('JB_GAME_HOTKEY', false)
  const animation = useLocalStorage('JB_GAME_ANIMATION', true)
  const audioVolume = useLocalStorage('JB_GAME_AUDIO_VOLUME', 20)
  const instantBet = useLocalStorage('JB_GAME_INSTANT_BET', false)
  const theatreMode = useLocalStorage('JB_GAME_THEATRE_MODE', false)
  const gamePlayable = useLocalStorage('JB_GAME_PLAYABLE', {})

  function setGame (val: string) {
    game.value = val
  }

  function toggleHotKey () {
    hotKey.value = !hotKey.value
  }

  function setAudioVolume (value: number | number[]) {
    audioVolume.value = (typeof value === 'object') ? value[0] : value
  }

  function toggleInstantBet () {
    instantBet.value = !instantBet.value
  }

  function setGamePlayable (val: Object) {
    const key = Object.keys(val)[0]
    const value = Object.values(val)[0]
    gamePlayable.value = { ...gamePlayable.value, [key]: value }
  }

  return {
    game,
    hotKey,
    animation,
    audioVolume,
    instantBet,
    theatreMode,
    gamePlayable,
    toggleHotKey,
    setAudioVolume,
    setGame,
    toggleInstantBet,
    setGamePlayable
  }
}
