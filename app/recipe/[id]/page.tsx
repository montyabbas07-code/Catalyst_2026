'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  Send,
  GitCommitHorizontal,
  ChevronDown,
  ChevronUp,
  ChefHat,
  MessageSquarePlus,
  Plus,
  Pencil,
  Trash2,
  Save,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { ReadinessBadge, StatusPill } from '@/components/status-badges'
import { Button } from '@/components/ui/button'
import { usePortfolio, type RecipeField, type Faq } from '@/components/portfolio-store'
import { useConsole } from '@/components/console-provider'
import { cn } from '@/lib/utils'
import { ProjectAccess } from '@/components/project-access'

function FieldRow({
  field,
  sousChef,
  onAddComment,
}: {
  field: RecipeField
  sousChef: string | null
  onAddComment: (fieldKey: string, text: string) => void
}) {
  const complete = field.complete
  const danger = field.severity === 'danger'
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentText, setCommentText] = useState('')
  const isLong = field.value && field.value.length > 50

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(field.key, commentText.trim())
      setCommentText('')
      setShowCommentBox(false)
    }
  }

  return (
    <div className="flex gap-3 py-4">
      <span
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
          complete
            ? 'bg-success-muted text-success'
            : danger
              ? 'bg-danger-muted text-danger'
              : 'bg-warning-muted text-warning',
        )}
      >
        {complete ? (
          <Check className="size-3.5" aria-hidden />
        ) : danger ? (
          <CircleAlert className="size-3.5" aria-hidden />
        ) : (
          <TriangleAlert className="size-3.5" aria-hidden />
        )}
      </span>
      <div className="min-w-0 flex-1">
        {/* Field label + expand toggle */}
        <button
          onClick={() => isLong && setIsExpanded(!isExpanded)}
          className={cn(
            'group flex items-center justify-between w-full text-left',
            isLong ? 'cursor-pointer' : 'cursor-default',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {field.label}
          </p>
          {isLong && (
            <span className="text-muted-foreground transition-transform group-hover:text-foreground">
              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </span>
          )}
        </button>

        {/* Field value */}
        <p
          className={cn(
            'mt-1 text-sm text-pretty whitespace-pre-wrap transition-all',
            !isExpanded && isLong && 'line-clamp-1',
            complete
              ? 'text-foreground'
              : danger
                ? 'font-medium text-danger'
                : 'font-medium text-warning',
          )}
        >
          {field.value ??
            (danger ? 'Missing — required for handover' : 'Incomplete — needs detail')}
        </p>

        {/* Existing Sous Chef comment */}
        {field.peerComment && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/30">
            <div className="mb-1 flex items-center gap-1.5">
              <ChefHat className="size-3.5 text-amber-600 dark:text-amber-400" aria-hidden />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Sous Chef · {field.peerComment.author}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              {field.peerComment.text}
            </p>
          </div>
        )}

        {/* Add tip section */}
        {sousChef && (
          <div className="mt-2">
            {!showCommentBox ? (
              <button
                onClick={() => setShowCommentBox(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquarePlus className="size-3.5" />
                {field.peerComment ? 'Update tip' : 'Add Sous Chef tip'}
              </button>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Tip as <span className="font-medium text-foreground">{sousChef}</span>
                </p>
                <textarea
                  className="w-full rounded-md border border-border bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={3}
                  placeholder="Leave a tip or flag for the owner..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitComment}
                    className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Submit tip
                  </button>
                  <button
                    onClick={() => { setShowCommentBox(false); setCommentText('') }}
                    className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ElevatorPitchCard({
  elevatorPitch,
  isOwner,
  onSave,
}: {
  elevatorPitch?: string
  isOwner: boolean
  onSave: (text: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(elevatorPitch ?? '')

  const startEdit = () => {
    setDraft(elevatorPitch ?? '')
    setEditing(true)
  }

  const save = () => {
    onSave(draft.trim())
    setEditing(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Elevator Pitch
        </h2>
        {isOwner && !editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="size-3.5" />
            Edit
          </button>
        )}
      </div>
      {editing ? (
        <div className="space-y-3">
          <textarea
            className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            rows={5}
            placeholder="Describe this project in a sentence or two..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : elevatorPitch ? (
        <p className="text-sm leading-relaxed text-foreground text-pretty">
          {elevatorPitch}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          No elevator pitch yet.
          {isOwner && ' Click “Edit” to add one.'}
        </p>
      )}
    </div>
  )
}

function FaqSection({
  faqs,
  isOwner,
  ownerName,
  onSave,
}: {
  faqs?: Faq[]
  isOwner: boolean
  ownerName: string
  onSave: (faqs: Faq[]) => void
}) {
  const { displayName } = useConsole()
  const items = faqs ?? []
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftQ, setDraftQ] = useState('')
  const [draftA, setDraftA] = useState('')
  const [adding, setAdding] = useState(false)
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [asking, setAsking] = useState(false)
  const [askText, setAskText] = useState('')
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({})

  const setAnswerDraft = (id: string, value: string) =>
    setAnswerDrafts((prev) => ({ ...prev, [id]: value }))

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const startEdit = (faq: Faq) => {
    setDraftQ(faq.question)
    setDraftA(faq.answer)
    setEditingId(faq.id)
  }

  const saveEdit = (id: string) => {
    onSave(
      items.map((f) =>
        f.id === id ? { ...f, question: draftQ.trim(), answer: draftA.trim() } : f,
      ),
    )
    setEditingId(null)
  }

  const deleteFaq = (id: string) => {
    onSave(items.filter((f) => f.id !== id))
  }

  const saveAdd = () => {
    if (!newQ.trim() || !newA.trim()) return
    onSave([
      ...items,
      { id: crypto.randomUUID(), question: newQ.trim(), answer: newA.trim() },
    ])
    setNewQ('')
    setNewA('')
    setAdding(false)
  }

  const saveAsk = () => {
    if (!askText.trim()) return
    onSave([
      ...items,
      {
        id: crypto.randomUUID(),
        question: askText.trim(),
        answer: '',
        askedBy: displayName ?? 'A visitor',
      },
    ])
    setAskText('')
    setAsking(false)
  }

  const answerPending = (id: string, answer: string) => {
    onSave(
      items.map((f) =>
        f.id === id ? { ...f, answer: answer.trim() } : f,
      ),
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          FAQ{items.length > 0 && <span className="text-muted-foreground"> ({items.length})</span>}
        </h2>
        <div className="flex items-center gap-3">
          {!asking && (
            <button
              onClick={() => setAsking(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquarePlus className="size-3.5" />
              Ask a question
            </button>
          )}
          {isOwner && !adding && !asking && (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="size-3.5" />
              Add FAQ
            </button>
          )}
        </div>
      </div>

      {items.length === 0 && !adding && !asking && (
        <p className="text-sm text-muted-foreground">
          No FAQs yet.{isOwner ? ' Click “Add FAQ” to create one.' : ' Ask a question to start the conversation.'}
        </p>
      )}

      <div className="divide-y divide-border">
        {items.map((faq) => {
          const open = openIds.has(faq.id)
          const editing = editingId === faq.id
          return (
            <div key={faq.id} className="py-3">
              {editing ? (
                <div className="space-y-2">
                  <input
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Question"
                    value={draftQ}
                    onChange={(e) => setDraftQ(e.target.value)}
                  />
                  <textarea
                    className="w-full rounded-md border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    rows={3}
                    placeholder="Answer"
                    value={draftA}
                    onChange={(e) => setDraftA(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(faq.id)}
                      className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Save className="size-3.5" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : faq.answer ? (
                <>
                  <button
                    onClick={() => toggle(faq.id)}
                    className="group flex w-full items-center justify-between gap-3 text-left"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {faq.question}
                    </span>
                    <span className="shrink-0 text-muted-foreground transition-transform group-hover:text-foreground">
                      {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </span>
                  </button>
                  {open && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {faq.answer}
                    </p>
                  )}
                  {isOwner && (
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => startEdit(faq)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-danger transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <button
                    onClick={() => toggle(faq.id)}
                    className="group flex w-full items-center justify-between gap-3 text-left"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {faq.question}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full bg-warning-muted px-2 py-0.5 text-[11px] font-medium text-warning">
                        Pending answer
                      </span>
                      <span className="shrink-0 text-muted-foreground transition-transform group-hover:text-foreground">
                        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </span>
                    </span>
                  </button>
                  {faq.askedBy && (
                    <p className="mt-1 text-xs text-muted-foreground">Asked by {faq.askedBy}</p>
                  )}
                  {open && (
                    isOwner ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          className="w-full rounded-md border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          rows={3}
                          placeholder="Write an answer..."
                          value={answerDrafts[faq.id] ?? ''}
                          onChange={(e) => setAnswerDraft(faq.id, e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => answerPending(faq.id, answerDrafts[faq.id] ?? '')}
                            className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            <Save className="size-3.5" />
                            Save answer
                          </button>
                          <button
                            onClick={() => setAnswerDraft(faq.id, '')}
                            className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Awaiting an answer from {ownerName}.
                      </p>
                    )
                  )}
                  {isOwner && (
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => startEdit(faq)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-danger transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {adding && (
        <div className="mt-3 space-y-2 rounded-lg border border-border bg-secondary/40 p-3">
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Question"
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
          />
          <textarea
            className="w-full rounded-md border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3}
            placeholder="Answer"
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={saveAdd}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="size-3.5" />
              Add
            </button>
            <button
              onClick={() => { setAdding(false); setNewQ(''); setNewA('') }}
              className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {asking && (
        <div className="mt-3 space-y-2 rounded-lg border border-border bg-secondary/40 p-3">
          <textarea
            className="w-full rounded-md border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3}
            placeholder="Ask the owner a question about this project..."
            value={askText}
            onChange={(e) => setAskText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={saveAsk}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send className="size-3.5" />
              Submit question
            </button>
            <button
              onClick={() => { setAsking(false); setAskText('') }}
              className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getProject, addPeerComment, updateElevatorPitch, updateFaqs } = usePortfolio()
  const { displayName } = useConsole()
  const project = getProject(id)
  const [requested, setRequested] = useState(false)

  if (!project) notFound()

  const isOwner = displayName === project.owner

  const ready = project.fields.filter((f) => f.complete)
  const missing = project.fields.filter((f) => !f.complete)
  const commit = project.fields.find((f) => f.key === 'code')?.value
  const peerCommentCount = project.fields.filter((f) => f.peerComment).length

  return (
    <AppShell>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to portfolio
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium uppercase tracking-widest">Recipe Card</span>
            {commit && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
                <GitCommitHorizontal className="size-3.5" aria-hidden />
                {commit.replace('commit ', '')}
              </span>
            )}
          </div>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {project.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill status={project.status} />
            <ReadinessBadge project={project} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recipe card */}
        <div className="lg:col-span-2 space-y-6">
          <ElevatorPitchCard
            elevatorPitch={project.elevatorPitch}
            isOwner={isOwner}
            onSave={(text) => updateElevatorPitch(project.id, text)}
          />

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Research Handover Card
              </h2>
              <span className="text-xs text-muted-foreground">
                {ready.length}/{project.fields.length} complete
              </span>
            </div>

            {/* Ownership summary */}
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-secondary/40 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Head Baker / Owner
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{project.owner}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sous Chef
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  {project.sousChef ? (
                    <>
                      <ChefHat className="size-3.5 text-amber-500" />
                      <span className="text-sm font-medium text-foreground">{project.sousChef}</span>
                      {peerCommentCount > 0 && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                          {peerCommentCount} tip{peerCommentCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm font-medium text-warning">Not assigned</span>
                  )}
                </div>
              </div>
            </div>

            <ProjectAccess
              codebaseUrl={project.codebaseUrl}
              owner={project.owner}
              ownerEmail={project.ownerEmail}
            />

            {/* Hypothesis */}
            <div className="mt-4 rounded-lg border border-gold/30 bg-gold/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-foreground/70">
                Strategy hypothesis
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground text-pretty">
                {project.hypothesis}
              </p>
            </div>

            {/* Field rows */}
            <div className="mt-2 divide-y divide-border">
              {project.fields.map((f) => (
                <FieldRow
                  key={f.key}
                  field={f}
                  sousChef={project.sousChef}
                  onAddComment={(fieldKey, text) =>
                    addPeerComment(project.id, fieldKey, {
                      author: project.sousChef ?? 'Sous Chef',
                      text,
                    })
                  }
                />
              ))}
            </div>
          </div>

          <FaqSection
            faqs={project.faqs}
            isOwner={isOwner}
            ownerName={project.owner}
            onSave={(next) => updateFaqs(project.id, next)}
          />
        </div>

        {/* Handover readiness panel */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Handover Readiness
            </h2>
            <div className="mt-3">
              <ReadinessBadge project={project} />
            </div>

            {/* Sous Chef summary */}
            {project.sousChef && (
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                <div className="flex items-center gap-1.5">
                  <ChefHat className="size-4 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Sous Chef: {project.sousChef}
                  </p>
                </div>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                  {peerCommentCount > 0
                    ? `${peerCommentCount} tip${peerCommentCount !== 1 ? 's' : ''} left on this recipe.`
                    : 'No tips left yet.'}
                </p>
              </div>
            )}

            <div className="mt-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
                <CircleCheck className="size-4" aria-hidden />
                Ready ({ready.length})
              </p>
              <ul className="space-y-1.5">
                {ready.map((f) => (
                  <li key={f.key} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="size-3.5 text-success" aria-hidden />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>

            {missing.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-danger">
                  <CircleAlert className="size-4" aria-hidden />
                  Missing ({missing.length})
                </p>
                <ul className="space-y-1.5">
                  {missing.map((f) => (
                    <li
                      key={f.key}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        f.severity === 'danger' ? 'text-danger' : 'text-warning',
                      )}
                    >
                      {f.severity === 'danger' ? (
                        <CircleAlert className="size-3.5" aria-hidden />
                      ) : (
                        <TriangleAlert className="size-3.5" aria-hidden />
                      )}
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 space-y-2 border-t border-border pt-5">
              <Button
                className="h-10 w-full gap-2"
                variant={requested ? 'secondary' : 'default'}
                onClick={() => setRequested(true)}
                disabled={requested}
              >
                {requested ? (
                  <>
                    <CircleCheck className="size-4" aria-hidden />
                    Request sent
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden />
                    Request Missing Context
                  </>
                )}
              </Button>
              {requested && (
                <p className="pt-1 text-center text-xs text-muted-foreground">
                  {project.owner} has been notified to complete the missing fields.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
