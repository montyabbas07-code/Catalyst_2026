'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Info, LogOut } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { usePortfolio } from '@/components/portfolio-store'
import { useConsole } from '@/components/console-provider'
import { buttonVariants } from '@/components/ui/button'

const nav = [
  { href: '/', label: 'Portfolio' },
  { href: '/handover', label: 'Bread Basket' },
  { href: '/team', label: 'Team' },
  { href: '/archive', label: 'Archive' },
  { href: '/console/manager', label: '⚙️ Console', managerOnly: true },
]

function NavLinks({ pathname }: { pathname: string }) {
  const { projects } = usePortfolio()
  const { userRole } = useConsole()
  const queueCount = projects.filter(
    (p) => p.owner === 'Alex Chen' && !p.handedOver,
  ).length

  const items = nav.filter((item) => !item.managerOnly || userRole === 'manager')

  return (
    <>
      {items.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : item.href.startsWith('/console')
              ? pathname.startsWith('/console')
              : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
            {item.href === '/handover' && queueCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-danger text-[11px] font-semibold text-danger-foreground">
                {queueCount}
              </span>
            )}
          </Link>
        )
      })}
    </>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { displayName, logout } = useConsole()

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            {displayName && (
              <p className="text-xs text-muted-foreground md:hidden">
                Signed in as <span className="font-medium text-foreground">{displayName}</span>
              </p>
            )}
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            <NavLinks pathname={pathname} />
            {displayName && (
              <p className="ml-2 hidden shrink-0 text-xs text-muted-foreground md:block">
                {displayName}
              </p>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'ml-2 h-9 shrink-0 gap-1.5 px-3 text-xs',
              )}
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </nav>
        </div>
        <div className="border-t border-border/60 bg-gold/10">
          <p className="mx-auto w-full max-w-6xl px-4 py-1.5 text-center font-serif text-sm italic text-foreground/80 sm:px-6">
            &ldquo;You kept the model. But did you keep the recipe?&rdquo;
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>

      <footer className="border-t border-border bg-card/60">
        <div className="mx-auto flex w-full max-w-6xl items-start gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <p className="text-pretty">
            Portfolio Bakery supports research handover; it does not validate strategy
            performance. Readiness reflects documentation completeness only — not profitability
            or approval for live trading. Prototype with mock data.
          </p>
        </div>
      </footer>
    </div>
  )
}
