export const TOOLTIP_CONFIG = {
  slots: {
    content: 'z-1003 flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-md ring ring-default h-auto min-h-6 px-0! py-0! text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto',
    arrow: 'fill-default',
    text: 'truncate px-1.5! py-1!',
    kbds: 'hidden lg:inline-flex items-center shrink-0 gap-0.5 before:content-[\'·\'] before:me-0.5',
    kbdsSize: 'sm'
  }
}
