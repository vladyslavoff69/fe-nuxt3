export const INPUT_CONFIG = {
  slots: {
    root: 'relative inline-flex items-center',
    base: [
      'w-full rounded-md border-0 placeholder:text-muted placeholder:font-normal focus:outline-none disabled:cursor-not-allowed disabled:opacity-75',
      'transition-colors'
    ],
    leading: 'absolute inset-y-0 start-0 flex items-center',
    leadingIcon: 'shrink-0 text-muted hover:text-white focus-visible:text-white',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    trailing: 'absolute inset-y-0 end-0 flex items-center',
    trailingIcon: 'shrink-0 text-muted hover:text-white focus-visible:text-white'
  },
  variants: {
    buttonGroup: {
      horizontal: {
        root: 'group has-focus-visible:z-[1]',
        base: 'group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none'
      },
      vertical: {
        root: 'group has-focus-visible:z-[1]',
        base: 'group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none'
      }
    },
    size: {
      xs: {
        base: 'px-2 py-1.5 text-xxs gap-x-1.5',
        leading: 'ps-2',
        trailing: 'pe-2',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leading: 'ps-2.5',
        trailing: 'pe-2.5',
        leadingIcon: 'size-5',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'px-3 py-2 text-sm gap-2',
        leading: 'ps-2.5',
        trailing: 'pe-2.5',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      },
      lg: {
        base: 'px-3 md:px-3.5 py-2.5 text-sm gap-2.5',
        leading: 'ps-3',
        trailing: 'pe-3',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'px-3 md:px-4 py-3 text-sm gap-3',
        leading: 'ps-3',
        trailing: 'pe-3',
        leadingIcon: 'size-6',
        leadingAvatarSize: 'xs',
        trailingIcon: 'size-6'
      }
    },
    variant: {
      outline: 'text-white bg-default ring-0 border border-border hover:border-primary',
      soft: 'text-white bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50',
      subtle: 'text-white bg-elevated ring-0 border border-border hover:border-primary',
      ghost: 'text-white bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent',
      none: 'text-white bg-transparent'
    },
    color: {
      primary: '',
      secondary: '',
      success: '',
      info: '',
      warning: '',
      error: '',
      neutral: ''
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    loading: {
      true: ''
    },
    highlight: {
      true: ''
    },
    type: {
      file: 'file:me-1.5 file:font-medium file:text-muted file:outline-none'
    }
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: [
        'outline',
        'subtle'
      ],
      class: 'focus-visible:ring-0 border border-border hover:border-primary'
    },
    {
      color: 'primary',
      highlight: true,
      class: 'ring-0 border border-border hover:border-primary'
    },
    {
      color: 'neutral',
      variant: [
        'outline',
        'subtle'
      ],
      class: 'focus-visible:ring-0 border border-border hover:border-primary'
    },
    {
      color: 'neutral',
      highlight: true,
      class: 'ring-0 border border-border hover:border-primary'
    },
    {
      leading: true,
      size: 'xs',
      class: 'ps-7'
    },
    {
      leading: true,
      size: 'sm',
      class: 'ps-8'
    },
    {
      leading: true,
      size: 'md',
      class: 'ps-9'
    },
    {
      leading: true,
      size: 'lg',
      class: 'ps-10'
    },
    {
      leading: true,
      size: 'xl',
      class: 'ps-11'
    },
    {
      trailing: true,
      size: 'xs',
      class: 'pe-7'
    },
    {
      trailing: true,
      size: 'sm',
      class: 'pe-8'
    },
    {
      trailing: true,
      size: 'md',
      class: 'pe-9'
    },
    {
      trailing: true,
      size: 'lg',
      class: 'pe-10'
    },
    {
      trailing: true,
      size: 'xl',
      class: 'pe-11'
    },
    {
      loading: true,
      leading: true,
      class: {
        leadingIcon: 'animate-spin'
      }
    },
    {
      loading: true,
      leading: false,
      trailing: true,
      class: {
        trailingIcon: 'animate-spin'
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
}
