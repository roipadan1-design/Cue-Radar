import { BRAND } from '@/lib/brand'

interface MarkProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Mark({ size = 'md', className = '' }: MarkProps) {
  const sizeClasses = {
    sm: 'text-[20px]',
    md: 'text-[40px]',
    lg: 'text-[96px]',
  }

  return (
    <span
      aria-hidden
      style={{
        fontFamily: 'var(--font-mark), sans-serif',
        fontWeight: 700,
        lineHeight: 1,
        color: 'currentColor',
      }}
      className={`inline-block select-none ${sizeClasses[size]} ${className}`.trim()}
    >
      {BRAND.mark}
    </span>
  )
}
