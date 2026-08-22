import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center', className)}>
      <img
        src="/portfolio-bakery-horizontal-light.png"
        alt="Portfolio Bakery"
        className="h-12 w-auto max-w-[19rem] object-contain sm:h-14 sm:max-w-[22rem]"
      />
    </Link>
  )
}
