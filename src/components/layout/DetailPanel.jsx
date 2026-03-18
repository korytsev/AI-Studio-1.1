import { FileText, Hash, Tag, Clock, AlertCircle, ChevronRight } from 'lucide-react'

const TYPE_META = {
  detection: { label: 'Detection', color: '#e2f98e' },
  email: { label: 'Email Alert', color: '#60a5fa' },
  campaign: { label: 'Campaign', color: '#a78bfa' },
  default: { label: 'Item', color: '#94a3b8' },
}

function Field({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">{label}</span>
      <span className={`text-sm text-foreground/90 ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">{title}</span>
        <div className="h-px flex-1 bg-border/40" />
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">{children}</div>
    </div>
  )
}

function SkeletonBlock({ w = 'w-full', h = 'h-4' }) {
  return <div className={`${w} ${h} animate-pulse rounded bg-muted/40`} />
}

export function DetailPanel({ tab }) {
  const meta = TYPE_META[tab?.type] ?? TYPE_META.default
  const item = tab?.data ?? {}

  return (
    <div className="detail-panel-enter flex h-full flex-col overflow-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground/50">
        <span>{meta.label}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground/70">{item.title ?? item.subject ?? item.name ?? 'Detail'}</span>
      </div>

      {/* Hero row */}
      <div className="mb-8 flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: meta.color + '22', border: `1px solid ${meta.color}44` }}
        >
          <FileText className="h-5 w-5" style={{ color: meta.color }} />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">
            {item.title ?? item.subject ?? item.name ?? 'Untitled'}
          </h2>
          {item.status && (
            <span
              className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: meta.color + '22', color: meta.color }}
            >
              {item.status}
            </span>
          )}
        </div>
      </div>

      {/* Placeholder content sections */}
      <div className="flex flex-col gap-10">
        <Section title="Overview">
          {item.type && <Field label="Type" value={item.type} />}
          {item.channel && <Field label="Channel" value={item.channel} />}
          {item.severity && <Field label="Severity" value={item.severity} />}
          {item.brand && <Field label="Brand" value={item.brand} />}
          {item.date && <Field label="Date" value={item.date} />}
          {item.source && <Field label="Source" value={item.source} />}
          {/* Pad with skeleton placeholders to fill the grid */}
          {Array.from({ length: Math.max(0, 4 - Object.keys(item).filter(k => ['type','channel','severity','brand','date','source'].includes(k)).length) }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <SkeletonBlock w="w-20" h="h-2.5" />
              <SkeletonBlock w="w-32" h="h-4" />
            </div>
          ))}
        </Section>

        <Section title="Details">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <SkeletonBlock w="w-16" h="h-2.5" />
              <SkeletonBlock w={i % 3 === 0 ? 'w-40' : i % 3 === 1 ? 'w-28' : 'w-36'} h="h-4" />
            </div>
          ))}
        </Section>

        <Section title="Activity">
          <div className="col-span-2 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-muted/50" />
                <div className="flex flex-1 flex-col gap-1">
                  <SkeletonBlock w={i % 2 === 0 ? 'w-3/4' : 'w-1/2'} h="h-3.5" />
                  <SkeletonBlock w="w-20" h="h-2.5" />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
