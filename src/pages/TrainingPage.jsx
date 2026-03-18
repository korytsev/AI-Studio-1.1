import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageLoad, useHeaderSlot } from '@/components/layout/AppLayout'

const COURSES = [
  {
    id: 1,
    title: 'PCI',
    audience: 'All Employees',
    duration: '14 minutes',
    type: 'VIDEO',
    tags: ['SECURITY'],
    description:
      'This video course explains the core requirements for handling payment card data securely, including what PCI standards are, who they apply to, and how they…',
    thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 2,
    title: 'Annual Training With Steven',
    audience: 'All Employees',
    duration: '2 minutes',
    type: 'VIDEO',
    tags: ['SECURITY', 'BEST PRACTICES'],
    description:
      'This video-based course explains how to recognize common security threats such as phishing, social engineering, and unsafe data handling, and shows…',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 3,
    title: 'Lawful Process, Consent, And Individual Rights',
    audience: 'All Employees',
    duration: '2 minutes',
    type: 'VIDEO',
    tags: ['SECURITY', 'BEST PRACTICES'],
    description:
      'This course explains how lawful requests for data work, when consent is required, and what rights individuals have over their personal information…',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 4,
    title: 'GDPR',
    audience: 'All Employees',
    duration: '8 minutes',
    type: 'VIDEO',
    tags: ['SECURITY', 'GDPR'],
    description:
      'This course explains the core principles of data protection, including lawful bases for processing, individual rights, and responsibilities when handling…',
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 5,
    title: '8 Deepfake Scams And Fraud What Are They',
    audience: 'All Employees',
    duration: '2 minutes',
    type: 'VIDEO',
    tags: ['SECURITY', 'TRENDING ATTACKS', 'DEEPFAKES'],
    description:
      'This course explains how deepfake scams and fraud work, including common techniques, real-world examples, and the red flags to watch for. Learners…',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 6,
    title: 'Protect Yourselves',
    audience: 'All Employees',
    duration: '1 minute',
    type: 'VIDEO',
    tags: ['SECURITY', 'BEST PRACTICES'],
    description:
      'Learn how to recognize common security threats such as phishing, social engineering, and unsafe browsing, and understand the practical steps you c…',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 7,
    title: 'Maxwell Mindbreaker',
    audience: 'All Employees',
    duration: '4 minutes',
    type: 'VIDEO',
    tags: ['SECURITY', 'BEST PRACTICES'],
    description:
      'This video-based course introduces essential security concepts through realistic scenarios that challenge how you think about risk, access, and tru…',
    thumbnail: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 8,
    title: 'Account Info Attack',
    audience: 'All Employees',
    duration: '1 minute',
    type: 'VIDEO',
    tags: ['SECURITY', 'TRENDING ATTACKS'],
    description:
      'Learn how attackers exploit personal and account information through tactics like phishing, social engineering, and credential misuse. This course…',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 9,
    title: 'Phishing Game Show',
    audience: 'All Employees',
    duration: '2 minutes',
    type: 'VIDEO',
    tags: ['SECURITY', 'BEST PRACTICES', 'PHISHING'],
    description:
      'Learn how to spot and respond to common security risks such as phishing, social engineering, and unsafe online habits through realistic scenarios. This video…',
    thumbnail: 'https://images.unsplash.com/photo-1614064548237-096f735f344f?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 10,
    title: 'Using Zoom Securely',
    audience: 'All Employees',
    duration: '2 minutes',
    type: 'VIDEO',
    tags: ['SECURITY'],
    description:
      'This course provides practical guidance on how to use Zoom in a safe and responsible way. The course covers essential security settings, common risks, a…',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=220&fit=crop&auto=format',
  },
]

const TAG_COLORS = {
  'SECURITY': 'bg-blue-600 text-white',
  'BEST PRACTICES': 'bg-[#3a3538] text-[#a8a6ab]',
  'GDPR': 'bg-[#3a3538] text-[#a8a6ab]',
  'TRENDING ATTACKS': 'bg-[#3a3538] text-[#a8a6ab]',
  'DEEPFAKES': 'bg-[#3a3538] text-[#a8a6ab]',
  'PHISHING': 'bg-[#3a3538] text-[#a8a6ab]',
}

function CourseCard({ course }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-border hover:bg-card/80">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-36 w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        {/* Fallback gradient thumbnail */}
        <div
          className="hidden h-36 w-full items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1a1020 0%, #0d1a3a 100%)' }}
        />
        {/* Type badge */}
        <span className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white bg-black/60 backdrop-blur-sm">
          {course.type}
        </span>
        {/* Security badge overlay */}
        {course.tags.includes('SECURITY') && (
          <span className="absolute bottom-2 right-2 rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white bg-blue-600">
            SECURITY
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold text-foreground leading-snug">{course.title}</h3>
        <p className="text-sm text-muted-foreground">{course.audience}</p>
        <p className="text-sm text-muted-foreground">{course.duration}</p>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        {/* Non-security tags */}
        {course.tags.filter((t) => t !== 'SECURITY').length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {course.tags.filter((t) => t !== 'SECURITY').map((tag) => (
              <span
                key={tag}
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${TAG_COLORS[tag] ?? 'bg-[#3a3538] text-[#a8a6ab]'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const FILTERS = [
  { key: 'topic',    label: 'All Topics',    options: ['All Topics', 'Security', 'Compliance', 'Privacy'] },
  { key: 'audience', label: 'All Audiences', options: ['All Audiences', 'All Employees', 'Managers', 'IT'] },
  { key: 'format',   label: 'All Formats',   options: ['All Formats', 'Video', 'Interactive', 'Quiz'] },
  { key: 'source',   label: 'All Sources',   options: ['All Sources', 'Internal', 'External'] },
]

const MAX_DURATIONS = ['Any Duration', '1 min', '2 min', '5 min', '10 min', '15 min']

// Tag → topic mapping for filter
const TAG_TOPIC = {
  'SECURITY': 'Security',
  'GDPR': 'Compliance',
  'BEST PRACTICES': 'Security',
  'TRENDING ATTACKS': 'Security',
  'DEEPFAKES': 'Security',
  'PHISHING': 'Security',
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const active = value !== options[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-8 items-center gap-1.5 rounded border px-3 text-sm transition-colors cursor-pointer ${
          active
            ? 'border-[#1C84FC] bg-[#1C84FC]/10 text-[#1C84FC]'
            : 'border-border bg-card text-muted-foreground hover:text-foreground'
        }`}
      >
        {active ? value : label}
        <svg className="h-3 w-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-md border border-border bg-card shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`flex w-full items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-[#e2f98e]/10 ${
                value === opt ? 'text-[#1C84FC] font-medium' : 'text-foreground'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TrainingSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Top bar — same justify-between px-6 py-3 as real */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Search: h-8 w-64 */}
          <Skeleton className="h-8 w-64 rounded border border-border" />
          {/* 4 filter dropdowns: h-8 */}
          {[140, 112, 100, 96, 96].map((w, i) => (
            <Skeleton key={i} className="h-8 rounded border border-border" style={{ width: w }} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Button size="sm" h-8 */}
          <Skeleton className="h-8 w-44 rounded-[0.25rem]" />
          <Skeleton className="h-8 w-36 rounded-[0.25rem]" />
        </div>
      </div>

      {/* Result count: text-xs py-2 px-6 */}
      <div className="px-6 py-2">
        <Skeleton className="h-3 w-14" />
      </div>

      {/* Course card grid — exact same grid classes as real */}
      <div className="grid grid-cols-2 gap-4 px-6 pb-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
            {/* Thumbnail: h-36 same as real <img> */}
            <Skeleton className="h-36 w-full rounded-none" />
            {/* Body: p-3 gap-1.5 — mirrors CourseCard body exactly */}
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              {/* title: text-sm font-semibold leading-snug — 2 lines */}
              <Skeleton className="h-[14px] w-5/6" />
              <Skeleton className="h-[14px] w-3/4" />
              {/* audience: text-xs */}
              <Skeleton className="h-3 w-24 mt-0.5" />
              {/* duration: text-xs */}
              <Skeleton className="h-3 w-16" />
              {/* description: text-xs line-clamp-3, leading-relaxed ≈ 16px/line */}
              <div className="mt-1 space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              {/* tag pill: text-[10px] px-1.5 py-0.5 ≈ h-4 */}
              <div className="mt-auto flex gap-1 pt-2">
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DURATION_MINUTES = { 'Any Duration': Infinity, '1 min': 1, '2 min': 2, '5 min': 5, '10 min': 10, '15 min': 15 }

const TRAINING_TABS = ['All', 'Interactive Courses', 'Videos', 'Deep Fakes']

export function TrainingPage() {
  const { skeleton } = usePageLoad()
  const { setTabs, setActions } = useHeaderSlot()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [filterVals, setFilterVals] = useState({
    topic: 'All Topics', audience: 'All Audiences', format: 'All Formats', source: 'All Sources',
  })
  const [maxDuration, setMaxDuration] = useState('Any Duration')

  useEffect(() => {
    setTabs(
      <div className="flex items-center gap-1 rounded-lg bg-[#1a1719] p-1">
        {TRAINING_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#2e2a2e] text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    )
    setActions(
      <div className="flex items-center gap-2">
        <Button size="sm" className="font-semibold tracking-wide">+ New Training Campaign</Button>
        <Button size="sm" variant="secondary" className="font-semibold tracking-wide">+ AI Content Studio</Button>
      </div>
    )
    return () => { setTabs(null); setActions(null) }
  }, [activeTab])

  if (skeleton) return <TrainingSkeleton />

  const setFilter = (key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))

  const maxMins = DURATION_MINUTES[maxDuration] ?? Infinity

  const filtered = COURSES.filter((c) => {
    const q = search.toLowerCase()
    if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false
    if (filterVals.topic !== 'All Topics') {
      const courseTopic = c.tags.map((t) => TAG_TOPIC[t]).find(Boolean) ?? 'Other'
      if (courseTopic !== filterVals.topic) return false
    }
    if (filterVals.audience !== 'All Audiences' && c.audience !== filterVals.audience) return false
    if (filterVals.format !== 'All Formats') {
      const fmt = filterVals.format.toUpperCase()
      if (!c.type.toUpperCase().includes(fmt)) return false
    }
    if (maxDuration !== 'Any Duration') {
      const mins = parseInt(c.duration) || 0
      if (mins > maxMins) return false
    }
    return true
  })

  const hasFilters = search || Object.values(filterVals).some((v, i) => v !== FILTERS[i]?.options[0]) || maxDuration !== 'Any Duration'

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        {/* Search */}
        <div className="flex h-8 w-64 items-center gap-2 rounded border border-border bg-card px-3 text-sm text-muted-foreground focus-within:border-[#1C84FC]/60">
          <svg className="h-3.5 w-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="opacity-50 hover:opacity-100 cursor-pointer text-foreground">✕</button>
          )}
        </div>

        {FILTERS.map((f) => (
          <FilterDropdown
            key={f.key}
            label={f.label}
            options={f.options}
            value={filterVals[f.key]}
            onChange={(v) => setFilter(f.key, v)}
          />
        ))}

        <FilterDropdown
          label="Max Duration"
          options={MAX_DURATIONS}
          value={maxDuration}
          onChange={setMaxDuration}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={() => { setSearch(''); setFilterVals({ topic: 'All Topics', audience: 'All Audiences', format: 'All Formats', source: 'All Sources' }); setMaxDuration('Any Duration') }}
            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="px-6 py-2">
        <p className="text-sm text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 pb-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.length === 0 ? (
          <div className="col-span-full flex h-48 items-center justify-center text-sm text-muted-foreground">
            No courses match your filters.
          </div>
        ) : (
          filtered.map((course) => <CourseCard key={course.id} course={course} />)
        )}
      </div>
    </div>
  )
}
