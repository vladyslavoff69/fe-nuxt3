import type { UseQueryReturn } from '@vue/apollo-composable'
import type { ComputedRef, InjectionKey } from 'vue'
import type {
  ActiveGameOptions,
  Bet,
  BetDetail,
  ChatMessage,
  ChatRoom,
  Currency,
  CurrencyItem,
  DailyFreeSpinRank,
  FreeSpin,
  Game,
  GameActiveOption,
  Notification,
  PaginatorInfo,
  ReloadRank,
  User,
  UserBalance,
  UserModalNotification,
  Vault,
  Vip,
  Wallet,
  WatchList
} from '~/types'
import type { Charity as CharityType } from '~/types/charity'

export const AUTH = Symbol('AUTH') as InjectionKey<{
  authType: Ref<string | undefined>;
  emailOrUsername: Ref<string>;
  password: Ref<string>;
  ipAddress: Ref<string>;
  affiliateCode: Ref<string>;
  freeSpinsCode: ComputedRef<string>;
  modalVisible: Ref<boolean>;
  isLoggedIn: ComputedRef<boolean>;
  isNotVerifiedEmail: ComputedRef<boolean>;
  isUserModalNotify: Ref<boolean>;
  me: ComputedRef<User | null>;
  userKyc: ComputedRef;
  turnstileToken: Ref<string | undefined>;
  hideTurnstile: ComputedRef<boolean>;
  loading: Ref<boolean>;
  userModalNotification: Ref<UserModalNotification | undefined>
  login: (promo?: boolean) => void;
  refetch: () => void;
  openAuthModal: (tab?: string) => void;
  openVerifyModal: () => void;
}>

export const CHAT = Symbol('CHAT') as InjectionKey<{
  isOpen: Ref<boolean>;
  openChat: () => void;
  closeChat: () => void;
  chatRoomId: Ref<number>;
  isScrolledUp: Ref<boolean>;
  isModerator: ComputedRef<boolean>;
  input: Ref<string>;
  chatRoomUsers: ComputedRef<User[]>;
  chatRooms: ComputedRef<ChatRoom[]>;
  userRefOnInput: ComputedRef<{ present: boolean; keyword: string }>;
  replyingTo: Ref<ChatMessage | null>;
  showGifSelect: Ref<boolean>;
  muteConfirmationVisible: Ref<boolean>;
  muteConfirmationUsername: Ref<string>;
  bannedUsersModalVisible: Ref<boolean>;
  isMuted: ComputedRef<boolean>;
  loading: Ref<boolean>;
  mockData: Ref<any[]>
  userIps: Ref<any[]>
  roomUsersRefetch: () => void;
}>

export const SITE_SETTINGS = Symbol('SITE_SETTINGS') as InjectionKey<{
  fingerprintToken: Ref<string>;
  isBodyMounted: Ref<boolean>;
  isSidebarOpen: Ref<boolean>;
  isMobileSidebarOpen: Ref<boolean>;
  isInHousePlaying: Ref<boolean>;
  languages: ComputedRef<any[] | undefined>;
  charities: ComputedRef<CharityType[]>
  selectedMenuPath: Ref<string>;
  selectedNavItem: Ref<string>;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}>

export const THEME = Symbol('THEME') as InjectionKey<{
  breakpoints: {
    [key in 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'lxl' | 'xl' | 'xxl']: number;
  };
  screen: ComputedRef<{
    xxs: boolean;
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    lxl: boolean;
    xl: boolean;
    xxl: boolean;

    width: number;
    height: number;
  }>;
  muteBodyScroll: Ref<number>; // consider multi-overlays
  setMuteBodyScrollValue: (v: number) => void;
}>

export const CONTAINER = Symbol('CONTAINER') as InjectionKey<{
  containerScreen: ComputedRef<{
    sm: boolean;
    md: boolean;
    lg: boolean;
    lxl: boolean;
    xl: boolean;
    width: number;
    height: number;
    top: number;
    left: number;
  }>;
  ready: Ref<boolean>;
}>

export const SITE_LOADING = Symbol('SITE_LOADING') as InjectionKey<{
  initialRendering: Ref<boolean>;
  mounted: Ref<boolean>;
  ready: ComputedRef<boolean>;
  loadings: Ref<string[]>;
  addLoading: (maxTimeout?: number) => () => void;
  useAddLoading: (maxTimeout?: number) => {
    add: () => void;
    remove: (timeout?: number) => void;
    removeAll: (timeout?: number) => void;
  };
  onInitialRendering: (callback: () => void) => void;
}>

export const PAGE_LOADING = Symbol('PAGE_LOADING') as InjectionKey<{
  ready: ComputedRef<boolean>;
  loadings: Ref<string[]>;
  addLoading: () => () => void;
  useAddLoading: (maxTimeout?: number) => {
    add: () => void;
    remove: (timeout?: number) => void;
    removeAll: (timeout?: number) => void;
  };
  onPageRendering: (callback: () => void) => void;
}>

export const PREFERENCE = Symbol('PREFERENCE') as InjectionKey<{
  currency: Ref<string>;
  currentCharity: ComputedRef<any>;
  activeCryptoCode: ComputedRef<string>;
  activeFiatCode: ComputedRef<string>;
  orderedCryptoCodes: ComputedRef<string[]>;
  displayInfiatEnabled: ComputedRef<boolean>;
  showVaultBalance: ComputedRef<boolean>;
  hideZeroBalance: ComputedRef<boolean>;
  favoriteCryptoCodes: ComputedRef<CurrencyItem[]>;
  watchCryptoCodesList: ComputedRef<WatchList[]>;
  watchCryptoCodesLoading: Ref<boolean>;
  watchCryptoCodesReFetch: () => void;
  favCryptoLoading: Ref<boolean>;
  favCryptoReFetch: () => void;
  favoriteGames: ComputedRef<Game[]>;
  favGameLoading: Ref<boolean>;
  favGameReFetch: () => void;
  changedActiveCode: Ref<boolean>;
  currentCharityRefetch: () => void;
}>

export const FREE_SPIN = Symbol('FREE_SPIN') as InjectionKey<{
  cancelFreeBets: Ref<boolean>;
  isDailySpin: ComputedRef<boolean>;
  isDailySpinning: Ref<boolean>;
  isFreeSpinning: Ref<boolean>;
  myFreeSpins: ComputedRef<FreeSpin[]>;
  myFreeBets: ComputedRef<number>;
  myPromoSpins: ComputedRef<number>;
  updateIsFreeSpinning: (v: boolean) => void;
  updateIsDailySpinning: (v: boolean) => void;
}>

export const WALLET = Symbol('WALLET') as InjectionKey<{
  currentWallet: ComputedRef<Wallet>;
  selectedAddress: Ref<string>;
  vaults: ComputedRef<Vault[]>;
  fee: Ref<number>;
  wallets: ComputedRef<Wallet[]>;
  loading: Ref<boolean>;
  ready: ComputedRef<boolean>;
  refetchWallets: () => void;
}>

export const CURRENCY = Symbol('CURRENCY') as InjectionKey<{
  ready: ComputedRef<boolean>;
  loading: ComputedRef<boolean>;
  userBalances: ComputedRef<UserBalance[]>;
  cryptoToUsd: ComputedRef<{ [key in string]: number }>;
  usdToFiat: ComputedRef<{ [key in string]: number }>;
  cryptoToFiat: (
    balance: number,
    cryptoCode: string,
    fiatCode: string
  ) => number;
  cryptoCurrencies: ComputedRef<CurrencyItem[]>;
  fiatCurrencies: ComputedRef<CurrencyItem[]>;
  currentCryptoBalance: ComputedRef<number>;
  currentFiatBalance: ComputedRef<number>;
  prevCryptoBalance: Ref<number>;
  prevFiatBalance: Ref<number>;
  currentCryptoCurrency: ComputedRef<CurrencyItem>;
  currentFiatCurrency: ComputedRef<CurrencyItem>;
  currentBalance: ComputedRef<number>;
  refetchBalances: () => void;
  refetchCryptos: () => void;
  currentCryptoToFiat: ComputedRef<number>;
  displayCryptoAmount: (amount: number, code: string) => string;
  displayCurrentCryptoAmount: (amount: number) => string;
  displayFiatAmount: (amount: number) => string;
  displayOtherAmount: (amount: number, fiat?: boolean) => string;
  userBalancesByCode: ComputedRef<{ [key in string]: UserBalance }>;
  asCurrentAmount: (cryptoAmount: number, cryptoCode?: string, fiat?: boolean) => number;
  updateUserBalance: (balance: number, cryptoCode?: string) => void;
  asOtherAmount: (cryptoAmount: number, cryptoCode?: string, fiat?: boolean) => number;
}>

export const META = Symbol('META') as InjectionKey<{
  inGamePage: Ref<boolean>;
  searchVisible: Ref<boolean>;
}>

export const GAME = Symbol('GAME') as InjectionKey<{
  game: Game;
  identifier: string;
  theatreMode: Ref<boolean>;
  paneCss: string;
  instantMode: Ref<boolean>;
  audioVolume: Ref<number>;
}>

export const VIP = Symbol('VIP') as InjectionKey<{
  vip: ComputedRef<Vip>;
  loading: Ref<boolean>;
  wageredAllTime: ComputedRef<number>;
  refetch: () => void;
}>

export const VIP_DRIP = Symbol('VIP_DRIP') as InjectionKey<{
  loading: Ref<boolean>;
  refetch: () => void;
  reload: ComputedRef<ReloadRank>;
}>

export const DAILY_FREE_SPIN = Symbol('DAILY_FREE_SPIN') as InjectionKey<{
  dailyFreeSpin: ComputedRef<DailyFreeSpinRank>;
  loading: Ref<boolean>;
  refetch: () => void;
}>

export const MODALS = Symbol('MODALS') as InjectionKey<{
  chatLockedModalVisible: Ref<boolean>;
  myRecentGames: ComputedRef<Game[]>;
  recentGamesLoading: Ref<boolean>;
  gameList: Ref<Game[]>;
}>

export const NOTIFICATION = Symbol('NOTIFICATION') as InjectionKey<{
  isOpen: Ref<boolean>;
  isOpenMobile: Ref<boolean>;
  openNotification: () => void;
  closeNotification: () => void;
  notificationLoading: Ref<boolean>;
  hasNotifications: Ref<boolean>;
  selectedTab: Ref<string>;
  unreadNotifications: ComputedRef<number>;
  checkHasNotification: () => void;
  fetchMoreSystemNotifications: (page: number) => void;
  fetchMoreUserNotifications: (page: number) => void;
  notifications: ComputedRef<Notification[]>;
  userNotifications: ComputedRef<Notification[]>;
  systemNotifications: ComputedRef<Notification[]>;
  userPaginatorInfo: ComputedRef<PaginatorInfo>;
  systemPaginatorInfo: ComputedRef<PaginatorInfo>;
}>

export const CASINO_GAME = Symbol('CASINO_GAME') as InjectionKey<{
  houseGames: ComputedRef<Game[]>;
  loading: Ref<boolean>;
  ready: ComputedRef<boolean>;
}>

export const GAME_POPUP = Symbol('GAME_POPUP') as InjectionKey<{
  activePopups: Ref<string[]>;
  activeGameOptions: Ref<ActiveGameOptions>;
  topPopupGameSlug: Ref<string>;
  isOpenGameSharePopup: Ref<boolean>;
  isResizingPopup: Ref<boolean>;
  isSpinSharing: Ref<boolean>;
  isStreaming: Ref<boolean>;
  stopLoading: Ref<boolean>;
  openedGameStatsPopup: Ref<boolean>;
  betResults: Ref<Bet[]>;
  roomId: Ref<string>;
  screenStream: Ref<any>;
  whipClient: Ref<any>;
  audioOn: Ref<boolean>;
  audioLoading: Ref<boolean>;
  audioContainer: Ref<any>;
  previewContainer: Ref<any>;
  setActiveGameOption: (game_slug: string, option: GameActiveOption) => void;
  setPictureMode: (game_slug: string) => void;
  closePopup: (game_slug: string) => void;
  setTopPopupGameSlug: (game_slug: string) => void;
  toggleGameSharePopup: () => void;
  toggleGameStatsPopup: () => void;
  resetBetsResult: () => void;
  onStopLive: () => void;
}>

export const BET_DETAIL = Symbol('BET_DETAIL') as InjectionKey<{
  betDetail: ComputedRef<BetDetail>;
  modalType: ComputedRef<string>;
}>

export const APP_QUERIES = Symbol('QUERIES') as InjectionKey<{
  // private
  currentCharityQueryReturn: UseQueryReturn<{ currentCharityByUser: any }, {}>;
  dailySpinQueryReturn: UseQueryReturn<{ dailySpins: DailyFreeSpinRank }, {}>;
  getUserBalancesQueryReturn: UseQueryReturn<{ getUserBalances: UserBalance[] }, {}>;
  meQueryReturn: UseQueryReturn<{ me: User }, {}>;
  userWalletsQueryReturn: UseQueryReturn<{ userWallets: { data: Wallet[] } }, { first: number, type: string }>;
  vipQueryReturn: UseQueryReturn<{ vip: Vip }, {}>;
  // public
  cryptoCurrenciesQueryReturn: UseQueryReturn<{ currencies: Currency[] }, {
    type: string,
    active: boolean;
  }>;
  fiatCurrenciesQueryReturn: UseQueryReturn<{ currencies: Currency[] }, {
    type: string,
    active: boolean;
  }>;
}>

export const VIDEO_STACK = Symbol('VIDEO_STACK') as InjectionKey<{
  pausedTime: Ref<number>
}>
