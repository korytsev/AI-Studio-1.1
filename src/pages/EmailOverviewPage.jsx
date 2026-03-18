import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageLoad } from '@/components/layout/AppLayout'
import { ROUTES } from '@/lib/routes'

// Email risk trend (viewBox 0 0 400 100): low Y = low risk (good, top), high Y = high risk (bad, bottom)
// Reflected Y' = 100 - Y. 24% current → Y ≈ 24. Started ~58% → Y ≈ 58. Line trends downward = risk falling = good.
const EMAIL_RISK_PATH = 'M 0 58 L 40 54 L 80 50 L 120 46 L 160 43 L 200 39 L 240 35 L 280 32 L 320 28 L 360 26 L 400 24'

// Submissions over time — 12 months, 4 series
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const CHART_W = 480
const CHART_H = 100
const PAD_L = 0
const PAD_R = 0

function toX(i) { return PAD_L + (i / (MONTHS.length - 1)) * (CHART_W - PAD_L - PAD_R) }
function toY(v, max) { return CHART_H - 8 - ((v / max) * (CHART_H - 16)) }

const SERIES = [
  {
    key: 'malicious',
    label: 'Malicious',
    color: '#ef4444',
    values: [12, 18, 14, 22, 19, 25, 21, 28, 24, 20, 17, 23],
  },
  {
    key: 'benign',
    label: 'Benign',
    color: '#22c55e',
    values: [80, 95, 88, 102, 97, 110, 105, 118, 112, 98, 91, 107],
  },
  {
    key: 'simulation',
    label: 'Simulation',
    color: '#1C84FC',
    values: [30, 28, 35, 32, 40, 38, 42, 36, 44, 39, 33, 41],
  },
  {
    key: 'pending',
    label: 'Pending',
    color: '#f97316',
    values: [8, 12, 10, 15, 11, 14, 13, 16, 12, 18, 24, 20],
  },
]

const ALL_VALUES = SERIES.flatMap((s) => s.values)
const MAX_VAL = Math.max(...ALL_VALUES)

function makePath(values) {
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v, MAX_VAL).toFixed(1)}`)
    .join(' ')
}

function TrendChart() {
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
        {SERIES.map((s) => (
          <path
            key={s.key}
            d={makePath(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>
      {/* Month labels */}
      <div className="flex justify-between px-0 mt-1">
        {MONTHS.map((m) => (
          <span key={m} className="text-xs text-muted-foreground/60">{m}</span>
        ))}
      </div>
    </div>
  )
}

function TrendChartLegend() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      {SERIES.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <span className="h-2 w-4 shrink-0 rounded-full" style={{ background: s.color }} />
          <span className="text-xs text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

const CLASS_DATA = [
  { label: 'Malicious',   count: 23,  color: '#ef4444' },
  { label: 'Benign',      count: 107, color: '#22c55e' },
  { label: 'Simulation',  count: 41,  color: '#1C84FC' },
  { label: 'Pending',     count: 25,  color: '#e2f98e' },
  { label: 'Graymail',    count: 18,  color: '#a78bfa' },
]
const CLASS_MAX = Math.max(...CLASS_DATA.map((d) => d.count))

const DEPT_MAX = 142

const DEPT_DATA = [
  { label: 'Engineering', count: 142, level: 'high' },
  { label: 'Marketing',   count: 118, level: 'high' },
  { label: 'Finance',     count: 97,  level: 'elevated' },
  { label: 'Sales',       count: 84,  level: 'elevated' },
  { label: 'HR',          count: 61,  level: 'moderate' },
  { label: 'Legal',       count: 43,  level: 'low' },
]

const DEPT_BAR_COLOR = {
  high:     'bg-[#1C84FC]',
  elevated: 'bg-[#38bdf8]',
  moderate: 'bg-[#6366f1]',
  low:      'bg-[#8b5cf6]',
}

const REPORTERS = [
  { name: 'j.smith@acme.com',    count: 34 },
  { name: 'a.jones@acme.com',    count: 28 },
  { name: 'k.patel@acme.com',    count: 21 },
  { name: 'm.chen@acme.com',     count: 19 },
  { name: 'r.garcia@acme.com',   count: 15 },
]

function EmailOverviewSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Risk score + AI Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Score skeleton */}
        <Card className="flex flex-col">
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
        {/* AI Insights skeleton */}
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
      {/* Stats row */}
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="flex flex-col justify-between p-5">
            <Skeleton className="h-8 w-16 rounded" />
            <div className="mt-auto pt-4 space-y-1.5">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </Card>
        ))}
      </div>
      {/* Chart + By Classification */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-3.5 w-44 rounded" />
            <Skeleton className="h-3 w-56 rounded mt-1" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            <Skeleton className="h-32 w-full rounded" />
            <div className="mt-3 flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-3 w-20 rounded" />)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-3.5 w-32 rounded" /></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full rounded" />)}
          </CardContent>
        </Card>
      </div>
      {/* By Department + Top Reporters */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[6, 5].map((rows, ci) => (
          <Card key={ci}>
            <CardHeader><Skeleton className="h-3.5 w-36 rounded" /></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full rounded" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function EmailOverviewPage() {
  const { skeleton } = usePageLoad()
  const navigate = useNavigate()

  if (skeleton) return <EmailOverviewSkeleton />

  return (
    <div className="p-6 flex flex-col gap-6 animate-[page-enter_0.18s_ease-out_both]">

      {/* Risk Score + AI Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email Risk Score */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <p className="text-base font-semibold text-foreground">Email Risk Score</p>
          </div>
          <div className="mx-5 border-t border-border" />
          <CardContent className="p-0">
            <div className="flex items-end gap-8 px-5 py-4">
              {/* Score block */}
              <div className="shrink-0 flex flex-col items-start">
                <p className="text-xs font-medium leading-tight mb-1 text-[#4ade80]">Low Risk</p>
                <p className="text-[3.6rem] font-semibold leading-none text-[#4ade80]">24%</p>
                <p className="text-[10px] text-muted-foreground/50 leading-tight mt-1">-8% since last month</p>
              </div>
              {/* Graph */}
              <div className="min-w-0 flex-1 flex flex-col gap-1">
                <svg viewBox="0 0 400 100" className="w-full rounded-sm" style={{ height: 64 }} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="email-risk-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${EMAIL_RISK_PATH} L 400 100 L 0 100 Z`} fill="url(#email-risk-grad)" stroke="none" />
                  <path d={EMAIL_RISK_PATH} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex justify-between">
                  {['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'].map((m, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground/50">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-3 pl-1 py-5">
              {[
                'Email threat volume decreased 12% month-over-month — lowest in 6 months.',
                '25 emails pending analyst review; 18 flagged as likely malicious by AI.',
                'Phishing simulation click rate dropped to 4.2%, down from 7.1% last quarter.',
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

      {/* Stats cards */}
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Submissions', value: '1,284', sub: 'Last 30 days' },
          { label: 'Malicious Confirmed', value: '23', sub: 'Requires action', accent: '#ef4444' },
          { label: 'Benign Confirmed', value: '107', sub: 'Auto-resolved', accent: '#22c55e' },
          { label: 'Auto-resolved', value: '41', sub: 'Simulations' },
        ].map(({ label, value, sub, accent }) => (
          <Card key={label} className="flex flex-col justify-between p-5">
            <p className="text-2xl font-bold leading-none" style={{ color: accent ?? 'var(--color-foreground)' }}>{value}</p>
            <div className="mt-auto pt-4">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">{sub}</p>
            </div>
          </Card>
        ))}

        {/* Needs Review — yellow fill */}
        <Card
          className="flex flex-col justify-between p-5 cursor-pointer transition-colors hover:brightness-110"
          style={{ backgroundColor: '#e2f98e' }}
          onClick={() => navigate(ROUTES.EMAIL_PROTECTION.NEEDS_REVIEW)}
        >
          <p className="text-2xl font-bold leading-none" style={{ color: '#1a2a00' }}>25</p>
          <div className="mt-auto pt-4">
            <p className="text-sm font-medium" style={{ color: '#1a2a00' }}>Needs Review</p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: '#3a5500' }}>View queue →</p>
          </div>
        </Card>
      </div>

      {/* Chart + By Classification */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* By classification */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>By Classification</CardTitle>
            <span className="text-sm text-muted-foreground">30d</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {CLASS_DATA.map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm text-card-foreground">{label}</span>
                <div className="relative min-h-6 min-w-0 flex-1">
                  <div
                    className="flex h-6 min-w-[2.5rem] items-center rounded-[0.25rem] pl-2 pr-2 text-sm font-medium text-white"
                    style={{
                      width: `${Math.min(100, (count / CLASS_MAX) * 100)}%`,
                      backgroundColor: color,
                    }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submissions Over Time */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Submissions Over Time</CardTitle>
              <p className="text-sm text-muted-foreground/70">Broken down by classification — last 12 months</p>
            </div>
            <TrendChartLegend />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            <TrendChart />
          </CardContent>
        </Card>
      </div>

      {/* By Department + Top Reporters */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* By department */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Submissions by Department</CardTitle>
            <span className="text-sm text-muted-foreground">Last 30 Days</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEPT_DATA.map(({ label, count, level }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm text-card-foreground">{label}</span>
                <div className="relative min-h-6 min-w-0 flex-1">
                  <div
                    className={`flex h-6 min-w-[2rem] items-center rounded-[0.25rem] pl-2 pr-2 text-sm font-medium text-white ${DEPT_BAR_COLOR[level]}`}
                    style={{ width: `${Math.min(100, (count / DEPT_MAX) * 100)}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top reporters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Reporters</CardTitle>
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wide">Admin only</span>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-card-foreground">Reporter</th>
                  <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-card-foreground">Submissions</th>
                </tr>
              </thead>
              <tbody>
                {REPORTERS.map(({ name, count }, i) => (
                  <tr key={name} className="border-b border-border last:border-0 transition-colors hover:bg-[#e2f98e]/10">
                    <td className="py-2.5 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/50 text-xs font-semibold text-muted-foreground">
                          {i + 1}
                        </span>
                        {name}
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-sm font-semibold text-foreground">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
