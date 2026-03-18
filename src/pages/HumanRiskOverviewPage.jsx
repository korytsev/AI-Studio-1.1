import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageLoad } from '@/components/layout/AppLayout'

const TREND_PATH = 'M 0 55 L 40 52 L 80 48 L 120 45 L 160 42 L 200 38 L 240 34 L 280 30 L 320 25 L 360 21 L 400 18'

const BAR_MAX = 50

const RISK_BY_CHANNEL = [
  { label: 'Email', value: 43, level: 'high' },
  { label: 'SMS', value: 28, level: 'high' },
  { label: 'Telegram', value: 18, level: 'elevated' },
  { label: 'Voice', value: 17, level: 'elevated' },
  { label: 'Teams', value: 7, level: 'low' },
]

const RISK_BY_DEPARTMENT = [
  { label: 'Marketing', value: 28, level: 'high' },
  { label: 'Design', value: 24, level: 'high' },
  { label: 'Engineering', value: 18, level: 'elevated' },
  { label: 'Exec', value: 17, level: 'elevated' },
  { label: 'IT', value: 7, level: 'low' },
]

const RISK_BAR_COLOR = {
  high: 'bg-[#ef4444]',
  elevated: 'bg-[#f97316]',
  low: 'bg-[#22c55e]',
}

// Attack Channel Distribution data
const ATTACK_CHANNELS = [
  { label: 'SMS',           count: 13, pct: 57, color: '#4ade80' },
  { label: 'Email',         count: 7,  pct: 30, color: '#3b82f6' },
  { label: 'Voice',         count: 3,  pct: 13, color: '#ef4444' },
  { label: 'Telegram',      count: 0,  pct: 0,  color: '#eab308' },
  { label: 'Teams Meeting', count: 0,  pct: 0,  color: '#a855f7' },
  { label: 'WhatsApp',      count: 0,  pct: 0,  color: '#94a3b8' },
]
const TOTAL_ATTACKS = 23

// Build SVG donut segments
function buildDonut(channels, r = 40, cx = 50, cy = 50, stroke = 12) {
  const total = channels.reduce((s, c) => s + c.count, 0)
  if (total === 0) return []
  const circumference = 2 * Math.PI * r
  let offset = 0
  return channels
    .filter((c) => c.count > 0)
    .map((c) => {
      const dash = (c.count / total) * circumference
      const seg = { ...c, dash, gap: circumference - dash, offset }
      offset += dash
      return seg
    })
}

function DonutChart() {
  const segments = buildDonut(ATTACK_CHANNELS)
  const r = 40
  const circumference = 2 * Math.PI * r

  return (
    <div className="flex flex-col gap-4">
      {/* Donut + legend side by side */}
      <div className="flex items-center gap-6">
        {/* SVG donut */}
        <div className="relative shrink-0" style={{ width: 220, height: 220 }}>
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="12" />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="50" cy="50" r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${seg.dash} ${seg.gap}`}
                strokeDashoffset={-seg.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground leading-none">TOTAL:</span>
            <span className="text-3xl font-bold text-foreground leading-tight">{TOTAL_ATTACKS}</span>
          </div>
        </div>

        {/* Legend — horizontal wrap */}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {ATTACK_CHANNELS.map(({ label, count, pct, color }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
              <span className="text-muted-foreground whitespace-nowrap">
                {label}: {count} ({pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskBarCard({ title, items }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <span className="text-xs text-muted-foreground">Last 30 Days</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(({ label, value, level }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-card-foreground">{label}</span>
            <div className="relative min-h-6 min-w-0 flex-1">
              <div
                className={`flex h-6 min-w-[2.5rem] items-center rounded-[0.25rem] pl-2 pr-2 text-sm font-medium text-white ${RISK_BAR_COLOR[level]}`}
                style={{ width: `${Math.min(100, (value / BAR_MAX) * 100)}%` }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function HumanRiskSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Top row: Risk Score + AI Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><Skeleton className="h-[14px] w-36" /></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="min-w-0 shrink-0 space-y-1 sm:max-w-[50%]">
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-[14px] w-28" />
                </div>
                <Skeleton className="h-[14px] w-36" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-32 w-full p-2"><Skeleton className="h-full w-full rounded" /></div>
                <div className="mt-1 flex w-full justify-between">
                  {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-3 w-5" />)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader><Skeleton className="h-[14px] w-28" /></CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            <div className="flex flex-col gap-3 pl-1 py-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-[14px] w-full" />
                    <Skeleton className="h-[14px] w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attack stats row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2].map((i) => (
          <Card key={i} className="p-5 flex flex-col gap-3">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-[14px] w-40" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
        <Card>
          <CardHeader><Skeleton className="h-[14px] w-48" /></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Skeleton className="h-[120px] w-[120px] shrink-0 rounded-full" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-3 w-32" />)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk bar cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-[14px] w-32" />
              <Skeleton className="h-3 w-20" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-[14px] w-20 shrink-0" />
                  <Skeleton className="h-6 rounded-[0.25rem]" style={{ width: `${86 - j * 14}%` }} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function HumanRiskOverviewPage() {
  const { skeleton } = usePageLoad()
  if (skeleton) return <HumanRiskSkeleton />

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Row 1: Risk Exposure Score + AI Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col">
          {/* Header row: title left, Open-style label right */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <p className="text-base font-semibold text-foreground">Risk Exposure Score</p>
          </div>
          <div className="mx-5 border-t border-border" />
          <CardContent className="p-0">
            <div className="flex items-end gap-8 px-5 py-4">
              {/* Score block */}
              <div className="shrink-0 flex flex-col items-start">
                <p className="text-xs font-medium leading-tight mb-1 text-[#4ade80]">Low Risk</p>
                <p className="text-[3.6rem] font-semibold leading-none text-[#4ade80]">18%</p>
                <p className="text-[10px] text-muted-foreground/50 leading-tight mt-1">-5% since last month</p>
              </div>
              {/* Graph */}
              <div className="min-w-0 flex-1 flex flex-col gap-1">
                <svg viewBox="0 0 400 100" className="w-full rounded-sm" style={{ height: 64 }} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hrm-risk-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${TREND_PATH} L 400 100 L 0 100 Z`} fill="url(#hrm-risk-grad)" stroke="none" />
                  <path d={TREND_PATH} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex justify-between">
                  {['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground/50">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-3 pl-1 py-5">
              {[
                'Your organization shows strong resilience to social engineering attacks.',
                'Elevated risk detected in HR department via Email and SMS vectors.',
                'Targeted phishing simulation recommended — estimated -18% risk reduction.',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  {text}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: [Attack Channel Distribution] | [2×3 KPI grid] */}
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        {/* Left: Attack Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Attack Channel Distribution (Past 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart />
          </CardContent>
        </Card>

        {/* Right: 2×3 KPI grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '6',     label: 'Total Link Clicks (Past 12 Months)',      sub: 'Past 12 Months' },
            { value: '4',     label: 'Total Data Submissions (Past 12 Months)', sub: 'Past 12 Months' },
            { value: '0',     label: 'Emails Reported (Past 12 Months)',        sub: 'Past 12 Months' },
            { value: '26.1%', label: 'Link Click Rate (Past 12 Months)',        sub: 'Overall link click rate across all campaigns' },
            { value: '25.0%', label: 'Data Submission Rate (Past 12 Months)',   sub: 'Overall data submission rate across all campaigns' },
            { value: '0.0%',  label: 'Report Rate (Past 12 Months)',            sub: 'Share of emails reported as phishing' },
          ].map(({ value, label, sub }) => (
            <Card key={label} className="flex flex-col justify-between p-4">
              <p className="text-3xl font-semibold text-foreground leading-none">{value}</p>
              <div className="mt-auto pt-4">
                <p className="text-sm font-medium text-foreground leading-snug">{label}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5 leading-snug">{sub}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Row 3: Risk by Channel + Risk by Department */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RiskBarCard title="Risk by Channel" items={RISK_BY_CHANNEL} />
        <RiskBarCard title="Risk by Department" items={RISK_BY_DEPARTMENT} />
      </div>
    </div>
  )
}
