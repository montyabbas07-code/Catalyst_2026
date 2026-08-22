'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useConsole } from '@/components/console-provider'
import { LoginForm } from '@/components/login-form'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, userRole } = useConsole()

  const isLoginPath = pathname === '/login'
  const isConsolePath = pathname.startsWith('/console')

  useEffect(() => {
    if (!isLoggedIn && !isLoginPath) {
      router.replace('/login')
      return
    }

    if (isLoggedIn && isLoginPath) {
      router.replace(userRole === 'employee' ? '/console/employee' : '/')
      return
    }

    if (
      isLoggedIn &&
      isConsolePath &&
      !pathname.startsWith('/console/employee') &&
      userRole !== 'manager'
    ) {
      router.replace('/')
    }
  }, [isLoggedIn, isLoginPath, isConsolePath, userRole, router])

  if (!isLoggedIn) {
    return <LoginForm />
  }

  if (isLoginPath) {
    return <LoginForm />
  }

  if (
    isConsolePath &&
    !pathname.startsWith('/console/employee') &&
    userRole !== 'manager'
  ) {
    return null
  }

  return <>{children}</>
}
