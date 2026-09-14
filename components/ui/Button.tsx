import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  asChild?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  let baseStyles = 'inline-flex items-center justify-center font-semibold rounded-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-fg focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  if (variant === 'primary') {
    baseStyles += ' bg-accent text-bg h-10 px-4 t-body hover:opacity-90'
  } else if (variant === 'secondary') {
    baseStyles += ' border border-line-strong text-fg h-10 px-4 t-body hover:border-fg'
  } else if (variant === 'ghost') {
    baseStyles += ' text-fg t-body p-0 hover:underline hover:underline-offset-4'
  }

  return (
    <button className={`${baseStyles} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
