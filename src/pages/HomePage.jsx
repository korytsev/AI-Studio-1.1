import { useNavigate } from 'react-router-dom'
import { useRef, useCallback } from 'react'
import { Globe, Users, Mail, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePageLoad } from '@/components/layout/AppLayout'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/lib/routes'

// Exact same actions as shown in each product's overview page
const ALL_ACTIONS = [
  {
    status: 'Urgent',
    product: 'Digital Risk Protection',
    icon: Globe,
    action: 'Review 3 Doppel Review detections',
    details: 'New threats flagged for analyst review this week',
    buttonLabel: 'REVIEW NOW',
    path: ROUTES.BRAND_PROTECTION.DOPPEL_REVIEW,
  },
  {
    status: 'Can Wait',
    product: 'Human Risk Management',
    icon: Users,
    action: 'Create Email Phishing Campaign',
    details: 'HR Team 2.1x risk avg · Estimated impact: -18% risk',
    buttonLabel: 'REVIEW CAMPAIGN',
    path: ROUTES.HUMAN_RISK.OVERVIEW,
  },
  {
    status: 'Can Wait',
    product: 'Human Risk Management',
    icon: Users,
    action: 'Create Executive Voice Phishing Campaign',
    details: 'Risk trending upward',
    buttonLabel: 'REVIEW CAMPAIGN',
    path: ROUTES.HUMAN_RISK.OVERVIEW,
  },
  {
    status: 'Urgent',
    product: 'Email Protection',
    icon: Mail,
    action: 'Review 25 pending emails',
    details: '25 submissions awaiting analyst verdict · Est. 15 min',
    buttonLabel: 'REVIEW NOW',
    path: ROUTES.EMAIL_PROTECTION.NEEDS_REVIEW,
  },
]

// ─── Trend paths (viewBox 0 0 200 60) ────────────────────────────────────────
// Y axis: low Y = low risk (good, top), high Y = high risk (bad, bottom) — natural direction
// Reflected: Y' = 60 - Y from previous values
// DRP: ends at 42% moderate, was improving (line trends upward = risk going down)
// HRM: ends at 18% low risk, strong improvement (line rises toward top)
// Email: ends at 24% low risk, good improvement
const PATHS = {
  drp:   'M 0 46 L 25 42 L 50 38 L 75 40 L 100 36 L 125 34 L 150 35 L 175 33 L 200 34',
  hrm:   'M 0 22 L 25 26 L 50 30 L 75 32 L 100 36 L 125 38 L 150 42 L 175 46 L 200 48',
  email: 'M 0 16 L 25 20 L 50 24 L 75 28 L 100 32 L 125 36 L 150 40 L 175 42 L 200 44',
}

// Lower score = lower risk = better (green). Higher score = higher risk = worse (red).
function riskColor(score) {
  if (score <= 30) return '#4ade80'
  if (score <= 60) return '#f97316'
  return '#ef4444'
}
function riskLabel(score) {
  if (score <= 30) return 'Low Risk'
  if (score <= 60) return 'Moderate Risk'
  return 'High Risk'
}

const PRODUCTS = [
  {
    key: 'drp',
    icon: Globe,
    label: 'Digital Risk Protection',
    overviewPath: ROUTES.BRAND_PROTECTION.OVERVIEW,
    score: 42,
    scoreLabel: riskLabel(42),
    scoreColor: riskColor(42),
    trend: '-4% this month',
    insights: [
      '775 active threats detected across web, social, and dark web.',
      '126 assets under continuous monitoring — no action required yet.',
      '3 new detections flagged for Doppel Review this week.',
    ],
    actions: [
      { label: 'Doppel Review', path: ROUTES.BRAND_PROTECTION.DOPPEL_REVIEW },
      { label: 'Needs Review', path: ROUTES.BRAND_PROTECTION.NEEDS_CONFIRMATION },
      { label: 'Monitoring', path: ROUTES.BRAND_PROTECTION.MONITORING },
    ],
  },
  {
    key: 'hrm',
    icon: Users,
    label: 'Human Risk Management',
    overviewPath: ROUTES.HUMAN_RISK.OVERVIEW,
    score: 18,
    scoreLabel: riskLabel(18),
    scoreColor: riskColor(18),
    trend: '-5% since last month',
    insights: [
      'Overall human readiness score improved 5% month-over-month.',
      'HR department shows elevated risk — targeted simulation recommended.',
      '2 active phishing campaigns in progress across 47k employees.',
    ],
    actions: [
      { label: 'Overview', path: ROUTES.HUMAN_RISK.OVERVIEW },
      { label: 'Simulation', path: ROUTES.HUMAN_RISK.TAB2 },
      { label: 'Training', path: ROUTES.HUMAN_RISK.TAB3 },
    ],
  },
  {
    key: 'email',
    icon: Mail,
    label: 'Email Protection',
    overviewPath: ROUTES.EMAIL_PROTECTION.OVERVIEW,
    score: 24,
    scoreLabel: riskLabel(24),
    scoreColor: riskColor(24),
    trend: '-8% since last month',
    insights: [
      '25 emails pending analyst review — action recommended today.',
      'Malicious rate stable at 1.8% of total submissions this month.',
      'Email threat volume down 12% compared to previous month.',
    ],
    actions: [
      { label: 'Overview', path: ROUTES.EMAIL_PROTECTION.OVERVIEW },
      { label: 'Needs Review', path: ROUTES.EMAIL_PROTECTION.NEEDS_REVIEW },
      { label: 'Archive', path: ROUTES.EMAIL_PROTECTION.ARCHIVE },
    ],
  },
]

const MINI_MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

function MiniGraph({ pathKey, color }) {
  const linePath = PATHS[pathKey]
  // Close the line path into a filled area by dropping to the bottom corners
  const fillPath = `${linePath} L 200 60 L 0 60 Z`
  const gradId = `mg-grad-${pathKey}`

  return (
    <div className="flex flex-col gap-1">
      <svg
        viewBox="0 0 200 60"
        className="w-full rounded-sm"
        style={{ height: 48 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Filled area */}
        <path d={fillPath} fill={`url(#${gradId})`} stroke="none" />
        {/* Line on top */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex justify-between">
        {MINI_MONTHS.map((m) => (
          <span key={m} className="text-[10px] text-muted-foreground/50">{m}</span>
        ))}
      </div>
    </div>
  )
}

function HomePageSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-[14px] w-40 rounded" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <Skeleton className="h-10 w-16 rounded" />
                  <Skeleton className="h-[13px] w-28 rounded" />
                  <Skeleton className="h-[13px] w-24 rounded" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-14 w-full rounded" />
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-1">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Skeleton className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-[13px] w-full rounded" />
                      <Skeleton className="h-[13px] w-3/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Actions table skeleton */}
      <Card>
        <CardHeader><Skeleton className="h-[14px] w-44 rounded" /></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[1, 2, 3, 4].map((i) => (
                  <th key={i} className="py-3 pl-4 text-left"><Skeleton className="h-[13px] w-20 rounded" /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 pl-4"><Skeleton className="h-[13px] w-36 rounded" /></td>
                  <td className="py-3 pl-4"><Skeleton className="h-[13px] w-48 rounded" /></td>
                  <td className="py-3 pl-4"><Skeleton className="h-[13px] w-56 rounded" /></td>
                  <td className="py-3 pl-4"><Skeleton className="h-8 w-28 rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

const MAX_TILT = 1.2 // degrees

function ProductCard({ label, overviewPath, scoreColor, children }) {
  const cardRef = useRef(null)
  const rafRef = useRef(null)
  const navigate = useNavigate()

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // Normalise to -1…+1
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      // Tilt: moving right tilts right (rotateY+), moving up tilts back (rotateX-)
      const rotY = nx * MAX_TILT
      const rotX = -ny * MAX_TILT
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
      el.style.background = `radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, ${scoreColor} 9%, var(--color-card)) 0%, var(--color-card) 120%)`
    })
  }, [scoreColor])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const el = cardRef.current
    if (!el) return
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    el.style.background = `linear-gradient(135deg, color-mix(in srgb, ${scoreColor} 6%, var(--color-card)) 0%, var(--color-card) 100%)`
  }, [scoreColor])

  return (
    <Card
      ref={cardRef}
      className="flex flex-col cursor-pointer overflow-hidden"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${scoreColor} 6%, var(--color-card)) 0%, var(--color-card) 100%)`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(overviewPath)}
    >
      {children}
    </Card>
  )
}

export function HomePage() {
  const { skeleton } = usePageLoad()
  const navigate = useNavigate()

  if (skeleton) return <HomePageSkeleton />

  return (
    <div className="p-6 flex flex-col gap-6 animate-[page-enter_0.18s_ease-out_both]">
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {PRODUCTS.map(({ key, icon: Icon, label, overviewPath, score, scoreLabel, scoreColor, trend, insights, actions }) => (
          <ProductCard
            key={key}
            label={label}
            overviewPath={overviewPath}
            scoreColor={scoreColor}
          >
            {/* Header row: title left, Open button right */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <p className="text-base font-semibold text-foreground">{label}</p>
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigate(overviewPath) }}
                >
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Separator below header */}
            <div className="mx-5 border-t border-border" />

            <CardContent className="flex flex-1 flex-col p-0">
              {/* Score + graph */}
              <div className="flex items-end gap-8 px-5 py-4">
                <div className="shrink-0 flex flex-col items-start">
                  <p className="text-xs font-medium leading-tight mb-1" style={{ color: scoreColor }}>
                    {scoreLabel}
                  </p>
                  <p className="text-[3.6rem] font-semibold leading-none" style={{ color: scoreColor }}>
                    {score}%
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 leading-tight mt-1">{trend}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <MiniGraph pathKey={key} color={scoreColor} />
                </div>
              </div>

              {/* Separator with margin */}
              <div className="mx-5 border-t border-border" />

              {/* AI insight bullets */}
              <ul className="flex flex-1 flex-col gap-2 px-5 pt-4 pb-8">
                {insights.map((text, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    {text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </ProductCard>
        ))}
      </div>

      {/* Combined Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
              <col style={{ width: '12%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '18%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pl-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Status</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Product</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Action</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Details</th>
                <th className="py-3 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/60"></th>
              </tr>
            </thead>
            <tbody>
              {ALL_ACTIONS.map(({ status, product, icon: Icon, action, details, buttonLabel, path }, i) => (
                <tr key={i} className="border-b border-border last:border-b-0 transition-colors hover:bg-[#e2f98e]/10">
                  <td className="py-3 pl-4">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
                      status === 'Urgent'
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-muted/40 text-muted-foreground'
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-sm">{product}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-card-foreground">{action}</td>
                  <td className="py-3 px-4 text-muted-foreground">{details}</td>
                  <td className="py-3 pr-4 text-right">
                    <Button size="sm" onClick={() => navigate(path)}>{buttonLabel}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
