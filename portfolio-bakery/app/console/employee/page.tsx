'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Home } from 'lucide-react'
import { useConsole } from '@/components/console-provider'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function EmployeeConsolePage() {
  const router = useRouter()
  const { isLoggedIn, userRole, username, logout, projects } = useConsole()

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'employee') {
      router.push('/console/login')
    }
  }, [isLoggedIn, userRole, router])

  const handleLogout = () => {
    logout()
    router.push('/console/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Employee Console
            </h1>
            <p className="text-sm text-muted-foreground">
              Research Projects Overview
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <Home className="mr-2 size-4" />
              Home
            </button>
            <button
              onClick={handleLogout}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              All Projects
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground">
              Research Portfolio
            </h2>
            <p className="mt-2 max-w-xl text-pretty text-sm text-muted-foreground">
              View all research projects with their owners and leading sous-chefs
            </p>
          </div>

          {/* Project Grid */}
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Owner:</span> {project.owner}
                    </p>
                    {project.sous_chef && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Sous-Chef:</span> {project.sous_chef}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-8 rounded-lg border border-border/50 bg-secondary/20 p-4">
            <p className="text-sm text-muted-foreground">
              💡 View all research projects and their team structure. For project assignments
              or role changes, please contact a manager.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
