import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePageLoad } from '@/components/layout/AppLayout'
import { Skeleton } from '@/components/ui/skeleton'

function OverviewSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col justify-between p-5">
            <Skeleton className="h-8 w-16 rounded" />
            <div className="mt-auto pt-4 space-y-1.5">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-3 w-48 rounded mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded" />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-3.5 w-28 rounded" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full rounded" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-3.5 w-28 rounded" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full rounded" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const THREAT_CATEGORIES = [
  { label: 'Impersonation', count: 312, pct: 88 },
  { label: 'Fake Domains', count: 198, pct: 56 },
  { label: 'Social Media', count: 134, pct: 38 },
  { label: 'Dark Web Mentions', count: 87, pct: 25 },
  { label: 'Mobile Apps', count: 44, pct: 12 },
]

const CHANNEL_BREAKDOWN = [
  { label: 'Web', count: 421, pct: 76 },
  { label: 'Social', count: 189, pct: 34 },
  { label: 'Dark Web', count: 87, pct: 16 },
  { label: 'Mobile', count: 44, pct: 8 },
  { label: 'Marketplace', count: 34, pct: 6 },
]

export function DigitalRiskOverviewPage() {
  const { skeleton } = usePageLoad()

  if (skeleton) return <OverviewSkeleton />

  return (
    <div className="p-6 flex flex-col gap-6 animate-[page-enter_0.18s_ease-out_both]">
      {/* Top metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Threats', value: '775', sub: '+12% this month' },
          { label: 'Under Monitoring', value: '126', sub: 'Actively tracked' },
          { label: 'Actioned', value: '13', sub: 'Pending response' },
          { label: 'Resolved', value: '521', sub: 'All time' },
        ].map(({ label, value, sub }) => (
          <Card key={label} className="flex flex-col justify-between p-5">
            <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
            <div className="mt-auto pt-4">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">{sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Trend chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Threat Detection Trend</CardTitle>
          <p className="text-xs text-muted-foreground/70">New detections over the last 90 days</p>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground text-sm">
            Chart placeholder
          </div>
        </CardContent>
      </Card>

      {/* Breakdown grids */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>By Threat Type</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {THREAT_CATEGORIES.map(({ label, count, pct }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-36 text-xs text-foreground shrink-0">{label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1C84FC]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Channel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {CHANNEL_BREAKDOWN.map(({ label, count, pct }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-36 text-xs text-foreground shrink-0">{label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1C84FC]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
