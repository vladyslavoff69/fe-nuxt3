export const MODAL_CONFIG = {
  slots: {
    overlay: 'fixed inset-0 bg-green-950/40 backdrop-blur-xs z-1002',
    content: 'fixed bg-default divide-y divide-default flex flex-col focus:outline-none z-1002',
    header: 'flex items-center gap-1.5 p-3 sm:px-4 min-h-16',
    wrapper: '',
    body: 'flex-1 p-3 sm:p-4',
    footer: 'flex items-center gap-1.5 p-3 sm:px-4',
    title: 'text-white font-bold',
    description: 'mt-1 text-muted text-sm',
    close: 'absolute text-paragraph top-4 end-4 duration-150 hover:transform! hover:-rotate-90! transition-all hover:ease-in-out! hover:text-white'
  },
  variants: {
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]',
        content: 'data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]'
      }
    },
    fullscreen: {
      true: {
        content: 'inset-0'
      },
      false: {
        content: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-lg shadow-lg ring ring-default'
      }
    }
  }
}
