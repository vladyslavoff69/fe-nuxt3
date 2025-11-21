export const TOAST_CONFIG = {
  slots: {
    root: 'relative group overflow-hidden bg-brand shadow-lg rounded-md p-4 flex gap-2.5 focus:outline-none',
    wrapper: 'w-0 flex-1 flex flex-col',
    title: 'text-sm font-bold text-white',
    description: 'mt-1 text-sm leading-4 text-white',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    avatarSize: '2xl',
    actions: 'flex gap-1.5 shrink-0',
    progress: 'absolute inset-x-0 bottom-0 h-1 z-[-1] bg-primary',
    close: 'p-0 hover:text-white duration-150 hover:transform! hover:-rotate-90! transition-all hover:ease-in-out!'
  },
  variants: {
    color: {
      primary: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ring-0 border-0 border-t border-primary ring-primary',
        icon: 'text-primary',
        progress: 'bg-primary'
      },
      secondary: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary ring-0 border-0 border-t border-secondary ring-secondary',
        icon: 'text-secondary',
        progress: 'bg-secondary'
      },
      success: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success ring-0 border-0 border-t border-success ring-success',
        icon: 'text-success',
        progress: 'bg-success'
      },
      info: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info ring-0 border-0 border-t border-info ring-info',
        icon: 'text-info',
        progress: 'bg-info'
      },
      warning: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning ring-0 border-0 border-t border-warning ring-warning',
        icon: 'text-warning',
        progress: 'bg-warning'
      },
      error: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error ring-0 border-0 border-t border-error ring-error',
        icon: 'text-error',
        progress: 'bg-error'
      },
      neutral: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted ring-0 border-0 border-t border-white ring-white',
        icon: 'text-white',
        progress: 'bg-inverted'
      }
    },
    orientation: {
      horizontal: {
        root: 'items-center',
        actions: 'items-center'
      },
      vertical: {
        root: 'items-start',
        actions: 'items-start mt-2.5'
      }
    },
    title: {
      true: {
        description: 'mt-1'
      }
    }
  },
  defaultVariants: {
    color: 'primary'
  }
}
