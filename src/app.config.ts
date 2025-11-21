import {
  CHAT_MESSAGE_CONFIG,
  CHAT_MESSAGES_CONFIG,
  INPUT_CONFIG,
  MODAL_CONFIG,
  POPOVER_CONFIG,
  SELECT_CONFIG,
  SLIDEOVER_CONFIG,
  TAB_CONFIG,
  TOAST_CONFIG,
  TOOLTIP_CONFIG
} from '~/constants/ui'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'white',
      success: 'green',
      warning: 'orange'
    },
    input: INPUT_CONFIG,
    modal: MODAL_CONFIG,
    popover: POPOVER_CONFIG,
    select: SELECT_CONFIG,
    slideover: SLIDEOVER_CONFIG,
    tabs: TAB_CONFIG,
    toast: TOAST_CONFIG,
    tooltip: TOOLTIP_CONFIG
  },
  uiPro: {
    chatMessage: CHAT_MESSAGE_CONFIG,
    chatMessages: CHAT_MESSAGES_CONFIG,
    pageColumns: {
      base: 'relative column-1 columns-3 md:columns-4 lg:columns-8 gap-4 *:break-inside-avoid-column *:will-change-transform grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-y-4.5 gap-x-3 space-y-0'
    }
  }
})
