'use client'

import { AppShell } from '@/components/app-shell'
import { useConsole } from '@/components/console-provider'

export default function EmployeeConsolePage() {
  const { projects } = useConsole()

  return (
    <AppShell>
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Employee workspace
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Research Portfolio
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review assigned research and respond to recommendations from the notification center.
        </p>
      </div>
      <div className="mt-8 space-y-3">
        {projects.map((project) => (
          <article key={project.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-foreground">{project.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Owner: <span className="font-medium text-foreground">{project.owner}</span>
            </p>
            {project.sous_chef && (
              <p className="mt-1 text-sm text-muted-foreground">
                Sous-Chef: <span className="font-medium text-foreground">{project.sous_chef}</span>
              </p>
            )}
          </article>
        ))}
      </div>
    </AppShell>
  )
}
