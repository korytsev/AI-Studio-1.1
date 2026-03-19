import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Upload, ChevronUp, ChevronDown, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Mock AI data ────────────────────────────────────────────────────────────

const MOCK_PLAN = `Phishing in the Age of AI: Understanding the Threat and Protecting the Business

1. Introduction: Why Phishing Still Works
This section sets the stage by explaining why phishing remains one of the most effective cyberattack vectors despite years of awareness training. It introduces the idea that phishing is no longer just about "spot the typo," but about exploiting human trust, urgency, and context—now supercharged by AI.

2. How AI Has Changed Phishing Attacks
Covers how attackers use AI to create more convincing, scalable, and personalized phishing campaigns. This includes AI-generated emails, deepfake voice and video scams, and automated reconnaissance using public data. The goal is to show how today's phishing is faster, cheaper, and harder to detect than before.

3. Modern Phishing Techniques and Attack Types
Provides a high-level breakdown of current phishing methods such as spear phishing, business email compromise (BEC), SMS and messaging app phishing, QR-code phishing, and voice phishing (vishing). Emphasis is on real-world business scenarios rather than technical mechanics.

4. The Human Factor: Why People Are Still the Primary Target
Explains the psychological principles attackers rely on—authority, urgency, fear, curiosity, and social proof. This section reframes phishing as a human risk problem, not an intelligence problem, helping reduce blame while increasing awareness.

5. Business Impact of AI-Driven Phishing
Looks at the consequences of successful phishing attacks: financial loss, data breaches, ransomware entry points, reputational damage, and regulatory exposure. Realistic examples show how a single click can escalate into a major business incident.

6. Red Flags in the Age of AI
Teaches modern warning signs that go beyond spelling mistakes, such as unusual context, changes in tone, unexpected requests, pressure to bypass normal processes, and inconsistencies across communication channels. Focuses on behavioral and situational clues.

7. Technical Controls That Reduce Phishing Risk
Overview: Introduces key security measures businesses should have in place, such as email authentication (DMARC, DKIM, SPF), AI-based email filtering, MFA, endpoint protection, and monitoring. This section stays high level and emphasizes layered defense rather than tools.

8. Organizational Processes and Policies
Overview: Covers non-technical protections: approval workflows, payment verification processes, secure communication standards, and escalation paths. Highlights how clear processes can neutralize even highly convincing AI-powered attacks.

9. Employee Training and Culture as a Defense
Overview: Argues that ongoing, realistic training—including simulated phishing campaigns—is the most effective long-term defense. Covers how to build a reporting culture where employees feel safe flagging suspicious activity without fear of blame.`

const MOCK_SECTIONS = [
  {
    id: 's1',
    title: 'Introduction: Why Phishing Still Works',
    type: 'TEXT',
    content: 'This section sets the stage by explaining why phishing remains one of the most effective cyberattack vectors despite years of awareness training. It introduces the idea that phishing is no longer just about "spot the typo," but about exploiting human trust, urgency, and context—now supercharged by AI.',
  },
  {
    id: 's2',
    title: 'How AI Has Changed Phishing Attacks',
    type: 'VIDEO',
    content: 'Covers how attackers use AI to create more convincing, scalable, and personalized phishing campaigns. This includes AI-generated emails, deepfake voice and video scams, and automated reconnaissance using public data.',
  },
  {
    id: 's3',
    title: 'Modern Phishing Techniques and Attack Types',
    type: 'TEXT',
    content: 'Provides a high-level breakdown of current phishing methods such as spear phishing, business email compromise (BEC), SMS and messaging app phishing, QR-code phishing, and voice phishing (vishing).',
  },
  {
    id: 's4',
    title: 'The Human Factor: Why People Are Still the Primary Target',
    type: 'TEXT',
    content: 'Explains the psychological principles attackers rely on—authority, urgency, fear, curiosity, and social proof. This section reframes phishing as a human risk problem, not an intelligence problem.',
  },
  {
    id: 's5',
    title: 'Business Impact of AI-Driven Phishing',
    type: 'QUIZ',
    content: 'Looks at the consequences of successful phishing attacks: financial loss, data breaches, ransomware entry points, reputational damage, and regulatory exposure.',
  },
  {
    id: 's6',
    title: 'Red Flags in the Age of AI',
    type: 'TEXT',
    content: 'Teaches modern warning signs that go beyond spelling mistakes, such as unusual context, changes in tone, unexpected requests, pressure to bypass normal processes.',
  },
  {
    id: 's7',
    title: 'Technical Controls That Reduce Phishing Risk',
    type: 'TEXT',
    content: 'Introduces key security measures businesses should have in place, such as email authentication (DMARC, DKIM, SPF), AI-based email filtering, MFA, endpoint protection, and monitoring.',
  },
  {
    id: 's8',
    title: 'Organizational Processes and Policies',
    type: 'TEXT',
    content: 'Covers non-technical protections: approval workflows, payment verification processes, secure communication standards, and escalation paths.',
  },
  {
    id: 's9',
    title: 'Employee Training and Culture as a Defense',
    type: 'QUIZ',
    content: 'Argues that ongoing, realistic training—including simulated phishing campaigns—is the most effective long-term defense. Covers how to build a reporting culture.',
  },
]

const MOCK_QUIZ = {
  title: 'Phishing Simulation Quiz',
  subtitle: 'Please answer the following questions to test your awareness about the phishing attack.',
  questions: [
    {
      id: 'q1',
      text: 'During a call claiming to be from IT about suspicious activity on your account, which is the safest initial action?',
      options: [
        'Answer their security questions if the caller sounds legitimate',
        'Hang up and report the incident to IT/security via verified channels',
        'Click on the SMS link provided to resolve the issue quickly',
        'Provide your work email to the caller after they provide some personal details',
      ],
      correct: 1,
    },
    {
      id: 'q2',
      text: 'Why is it risky to provide your home ZIP code or work email over the phone, even if the caller claims to be from IT?',
      options: [
        'It violates company policy on personal data sharing',
        'This information can be used to build a more convincing follow-up attack',
        'IT already has this information and would never ask for it',
        'Both B and C are correct',
      ],
      correct: 3,
    },
    {
      id: 'q3',
      text: 'What is the most reliable way to verify that a caller is actually from your IT department?',
      options: [
        'Ask them to provide your employee ID number',
        'Check if the phone number matches the IT department listing',
        'Hang up and call IT directly using the number from the official company directory',
        'Ask them to send a follow-up email to confirm their identity',
      ],
      correct: 2,
    },
  ],
}

// ─── Section type badge colors ────────────────────────────────────────────────

const TYPE_COLORS = {
  TEXT: 'bg-[#2e2a2c] text-[#a8a6ab]',
  VIDEO: 'bg-blue-600/20 text-blue-400',
  QUIZ: 'bg-[#e2f98e]/10 text-[#e2f98e]',
  INTERACTIVE: 'bg-purple-600/20 text-purple-400',
}

const SECTION_TYPES = ['TEXT', 'VIDEO', 'QUIZ', 'INTERACTIVE']

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        className="h-8 w-8 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{ color: '#e2f98e' }}
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }) {
  return (
    <div className="h-[3px] w-full bg-[#3e3a3c]">
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${(step / total) * 100}%`, background: '#e2f98e' }}
      />
    </div>
  )
}

// ─── File Upload Zone ─────────────────────────────────────────────────────────

function UploadZone({ label, hint, multiple = false, onFiles }) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)

  const handleFiles = (incoming) => {
    const arr = Array.from(incoming)
    setFiles((prev) => (multiple ? [...prev, ...arr] : arr))
    onFiles?.(arr)
  }

  return (
    <div
      className={`relative flex min-h-[100px] flex-col items-center justify-center gap-2 rounded border border-dashed transition-colors cursor-pointer ${
        dragging ? 'border-[#e2f98e]/60 bg-[#e2f98e]/5' : 'border-[#3e3a3c] bg-[#1a1618] hover:border-[#5e5a5c]'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {files.length === 0 ? (
        <>
          <Upload className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Drop files here or click to upload.</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </>
      ) : (
        <div className="flex w-full flex-col gap-1 px-4 py-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-foreground">
              <Upload className="h-3.5 w-3.5 shrink-0 text-[#e2f98e]" />
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => { e.stopPropagation(); setFiles((prev) => prev.filter((_, j) => j !== i)) }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-1 text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline self-start"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
          >
            + Add more
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Screen 1: Training Goals ─────────────────────────────────────────────────

function Screen1({ goal, setGoal, onNext }) {
  const canNext = goal.trim().length > 0
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Training Goal<span className="text-red-400">*</span>
        </label>
        <textarea
          className="min-h-[140px] w-full resize-none rounded border border-[#3e3a3c] bg-[#1a1618] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#5e5a5c] focus:outline-none"
          placeholder="e.g. Train employees to identify CEO"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Source Material <span className="text-muted-foreground font-normal">(optional)</span></label>
        <UploadZone
          multiple
          hint="Policies, incident reports, reference links."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Logo <span className="text-muted-foreground font-normal">(optional)</span></label>
        <UploadZone
          hint="SVG, JPG or PNG, no more than 2.5mb."
        />
      </div>
    </div>
  )
}

// ─── Screen 2: Review Course Plan ────────────────────────────────────────────

function Screen2({ plan, setPlan }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex-1 overflow-y-auto rounded border border-[#3e3a3c] bg-[#1a1618] p-4"
        style={{ minHeight: 380, maxHeight: 420 }}
      >
        <textarea
          className="w-full resize-none bg-transparent text-sm text-foreground leading-relaxed focus:outline-none"
          style={{ minHeight: 380 }}
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        />
      </div>
      <p className="text-xs text-muted-foreground">You can edit the plan above before proceeding to content editing.</p>
    </div>
  )
}

// ─── Screen 3: Content Editing ────────────────────────────────────────────────

function TypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const handleClick = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false)
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [handleClick])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-6 items-center gap-1 rounded px-2 text-[11px] font-semibold tracking-wide transition-colors ${TYPE_COLORS[value] ?? 'bg-[#2e2a2c] text-[#a8a6ab]'}`}
      >
        {value}
        <svg className="h-2.5 w-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[110px] rounded border border-[#3e3a3c] bg-[#262022] shadow-xl">
          {SECTION_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { onChange(t); setOpen(false) }}
              className={`flex w-full items-center px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-colors hover:bg-[#3e3a3c] ${
                t === value ? 'text-[#e2f98e]' : 'text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionCard({ section, index, total, onMoveUp, onMoveDown, onDelete, onUpdate, isExpanded, onToggle }) {
  return (
    <div className="rounded border border-[#3e3a3c] bg-[#1e1a1c] transition-colors hover:border-[#5e5a5c]">
      {/* Header row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
        <span className="text-xs font-semibold text-muted-foreground w-5 shrink-0">{index + 1}</span>

        {/* Title */}
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 text-left text-sm font-medium text-foreground hover:text-foreground/80 truncate"
        >
          {section.title}
        </button>

        <TypeDropdown
          value={section.type}
          onChange={(t) => onUpdate({ ...section, type: t })}
        />

        {/* Move up/down */}
        <div className="flex items-center">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-[#3e3a3c] hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-[#3e3a3c] hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-red-900/30 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-[#3e3a3c] hover:text-foreground"
        >
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Expanded edit area */}
      {isExpanded && (
        <div className="border-t border-[#3e3a3c] px-3 pb-3 pt-2.5 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Section Title</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdate({ ...section, title: e.target.value })}
              className="w-full rounded border border-[#3e3a3c] bg-[#1a1618] px-2.5 py-1.5 text-sm text-foreground focus:border-[#5e5a5c] focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Content</label>
            <textarea
              value={section.content}
              onChange={(e) => onUpdate({ ...section, content: e.target.value })}
              rows={3}
              className="w-full resize-none rounded border border-[#3e3a3c] bg-[#1a1618] px-2.5 py-1.5 text-sm text-foreground leading-relaxed focus:border-[#5e5a5c] focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Screen3({ sections, setSections }) {
  const [expandedId, setExpandedId] = useState(null)

  const moveUp = (i) => {
    if (i === 0) return
    setSections((prev) => {
      const next = [...prev]
      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next
    })
  }

  const moveDown = (i) => {
    setSections((prev) => {
      if (i === prev.length - 1) return prev
      const next = [...prev]
      ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next
    })
  }

  const deleteSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const updateSection = (updated) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
  }

  const addSection = () => {
    const id = `s${Date.now()}`
    setSections((prev) => [...prev, { id, title: 'New Section', type: 'TEXT', content: '' }])
    setExpandedId(id)
  }

  return (
    <div className="flex flex-col gap-2" style={{ maxHeight: 440, overflowY: 'auto' }}>
      {sections.map((section, i) => (
        <SectionCard
          key={section.id}
          section={section}
          index={i}
          total={sections.length}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
          onDelete={() => deleteSection(section.id)}
          onUpdate={updateSection}
          isExpanded={expandedId === section.id}
          onToggle={() => setExpandedId((prev) => (prev === section.id ? null : section.id))}
        />
      ))}
      <button
        type="button"
        onClick={addSection}
        className="mt-1 flex h-9 items-center justify-center gap-2 rounded border border-dashed border-[#3e3a3c] text-sm text-muted-foreground transition-colors hover:border-[#5e5a5c] hover:text-foreground"
      >
        + Add Section
      </button>
    </div>
  )
}

// ─── Screen 4: Preview ────────────────────────────────────────────────────────

function QuizQuestion({ question, index, selected, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#3e3a3c] text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-foreground leading-snug">{question.text}</p>
      </div>
      <div className="flex flex-col gap-2 pl-9">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={`w-full rounded border px-4 py-2.5 text-left text-sm transition-colors ${
              selected === i
                ? 'border-[#e2f98e]/60 bg-[#e2f98e]/10 text-foreground'
                : 'border-[#3e3a3c] bg-[#1e1a1c] text-muted-foreground hover:border-[#5e5a5c] hover:text-foreground'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function Screen4({ quiz }) {
  const [answers, setAnswers] = useState({})

  return (
    <div
      className="overflow-y-auto rounded border border-[#3e3a3c]"
      style={{ maxHeight: 460 }}
    >
      {/* Course preview card — matches screenshot exactly */}
      <div
        className="relative flex flex-col"
        style={{ background: '#0d0d14' }}
      >
        {/* Logo bar */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#e2f98e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-base font-semibold text-foreground">Doppel</span>
        </div>

        {/* Glow blob */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ width: 360, height: 200, background: 'radial-gradient(ellipse, rgba(59,130,246,0.35) 0%, rgba(139,92,246,0.2) 50%, transparent 80%)' }}
        />

        {/* Title block */}
        <div className="relative z-10 flex flex-col items-center gap-3 px-8 pb-6 pt-2 text-center">
          <h2 className="text-2xl font-bold text-foreground">{quiz.title}</h2>
          <p className="max-w-sm text-sm text-muted-foreground">{quiz.subtitle}</p>
        </div>

        {/* Questions */}
        <div className="relative z-10 flex flex-col gap-6 px-8 pb-8">
          {quiz.questions.map((q, i) => (
            <QuizQuestion
              key={q.id}
              question={q}
              index={i}
              selected={answers[q.id]}
              onSelect={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Set Course Objectives' },
  { label: 'Review Course Plan' },
  { label: 'Edit Content' },
  { label: 'Preview the Course' },
]

export function CourseStudio({ onClose }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Screen 1 state
  const [goal, setGoal] = useState('')

  // Screen 2 state
  const [plan, setPlan] = useState(MOCK_PLAN)

  // Screen 3 state
  const [sections, setSections] = useState(MOCK_SECTIONS)

  // Screen 4 state
  const [quiz] = useState(MOCK_QUIZ)

  const canNext = step === 0 ? goal.trim().length > 0 : true

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setStep((s) => s + 1)
      }, 1400)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const isLastStep = step === STEPS.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 1024,
          maxWidth: '95vw',
          maxHeight: '90vh',
          background: '#1e1a1c',
          borderRadius: 12,
          border: '1px solid #3e3a3c',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Progress bar */}
        <ProgressBar step={step + 1} total={STEPS.length} />

        {/* Header */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[#3e3a3c] px-6">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#e2f98e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold text-foreground">Create Custom Course</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleBack}
              disabled={step === 0 || loading}
              className="font-semibold tracking-wide"
            >
              BACK
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="font-semibold tracking-wide"
            >
              GET HELP FROM CONTENT TEAM
            </Button>
            <Button
              size="sm"
              onClick={isLastStep ? onClose : handleNext}
              disabled={!canNext || loading}
              className="font-semibold tracking-wide"
            >
              {isLastStep ? 'PUBLISH' : 'NEXT'}
            </Button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-[#3e3a3c] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {loading ? (
            <Spinner />
          ) : (
            <div className="flex flex-1 flex-col overflow-hidden px-8 py-6">
              <h2 className="mb-5 text-lg font-semibold text-foreground">{STEPS[step].label}</h2>
              <div className="flex-1 overflow-y-auto">
                {step === 0 && <Screen1 goal={goal} setGoal={setGoal} onNext={handleNext} />}
                {step === 1 && <Screen2 plan={plan} setPlan={setPlan} />}
                {step === 2 && <Screen3 sections={sections} setSections={setSections} />}
                {step === 3 && <Screen4 quiz={quiz} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
