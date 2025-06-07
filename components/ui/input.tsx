import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasRing?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  hasRing,
  type,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-md bg-background px-3 py-2 ring-offset-background file:bg-transparent file:text-sm font-medium placeholder:text-black/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-black/10 transition-colors focus:outline-none focus:border-none focus:shadow-none',
        { 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2': hasRing },
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
