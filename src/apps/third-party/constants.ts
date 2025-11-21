import type { Game, PlayType } from '~/types'

export const THIRD_PARTY_GAME = Symbol('THIRD_PARTY_GAME') as InjectionKey<{
  game: Game;
  currentPlay: Ref<PlayType>;
  fullScreen: Ref<boolean>;
  theatreMode: Ref<boolean>;
  pictureMode: Ref<boolean>;
  currency: Ref<string>;
  hasOnlyRealPlay: Ref<boolean>;
}>

export const ONLY_REAL_PLAY_PROVIDERS = ['live-casino', 'game-shows', 'table-games', 'roulette', 'blackjack', 'baccarat']
