import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Upload, ChevronUp, ChevronDown, Trash2, GripVertical } from 'lucide-react'

// ─── Design tokens (matches app theme) ───────────────────────────────────────
const C = {
  bg: '#1e1a1c',
  bgDeep: '#161214',
  bgCard: '#262022',
  bgMuted: '#1a1618',
  border: '#3e3a3c',
  borderHover: '#5e5a5c',
  fg: '#fafafa',
  fgMuted: '#a8a6ab',
  accent: '#e2f98e',
  accentFg: '#050505',
  secondary: '#46424a',
  blue: '#1c84fc',
}

// ─── Mock data ────────────────────────────────────────────────────────────────

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
Introduces key security measures businesses should have in place, such as email authentication (DMARC, DKIM, SPF), AI-based email filtering, MFA, endpoint protection, and monitoring. This section stays high level and emphasizes layered defense rather than tools.

8. Organizational Processes and Policies
Covers non-technical protections: approval workflows, payment verification processes, secure communication standards, and escalation paths. Highlights how clear processes can neutralize even highly convincing AI-powered attacks.

9. Employee Training and Culture as a Defense
Argues that ongoing, realistic training—including simulated phishing campaigns—is the most effective long-term defense. Covers how to build a reporting culture where employees feel safe flagging suspicious activity without fear of blame.`

const INITIAL_SECTIONS = [
  { id: 's1', title: 'Introduction: Why Phishing Still Works', type: 'TEXT', content: 'This section sets the stage by explaining why phishing remains one of the most effective cyberattack vectors despite years of awareness training.' },
  { id: 's2', title: 'How AI Has Changed Phishing Attacks', type: 'VIDEO', content: 'Covers how attackers use AI to create more convincing, scalable, and personalized phishing campaigns.' },
  {
    id: 's3', title: 'Key Phishing Techniques', type: 'CARDS',
    content: 'Review each attack type and what makes it dangerous.',
    cards: [
      { id: 'c1', front: 'Spear Phishing', back: 'A targeted attack on a specific individual using personal details to appear legitimate.' },
      { id: 'c2', front: 'Business Email Compromise (BEC)', back: 'Attacker impersonates an executive or vendor to trick employees into transferring money or data.' },
      { id: 'c3', front: 'Vishing', back: 'Voice phishing — attackers call victims pretending to be IT, banks, or government agencies.' },
      { id: 'c4', front: 'QR Code Phishing', back: 'Malicious QR codes redirect victims to fake login pages or trigger malware downloads.' },
    ],
  },
  { id: 's4', title: 'The Human Factor: Why People Are Still the Primary Target', type: 'TEXT', content: 'Explains the psychological principles attackers rely on—authority, urgency, fear, curiosity, and social proof.' },
  {
    id: 's5', title: 'Knowledge Check: Recognizing Phishing', type: 'QUIZ',
    content: 'Test your understanding of the warning signs and correct responses.',
    questions: [
      {
        id: 'q1',
        text: 'During a call claiming to be from IT about suspicious activity on your account, which is the safest initial action?',
        options: [
          'Answer their security questions if the caller sounds legitimate',
          'Hang up and report the incident to IT/security via verified channels',
          'Click on the SMS link provided to resolve the issue quickly',
          'Provide your work email after they share some personal details',
        ],
        correct: 1,
      },
      {
        id: 'q2',
        text: 'Which of the following is a modern red flag that goes beyond spelling mistakes?',
        options: [
          'The email uses formal language',
          'Unusual urgency or pressure to bypass normal processes',
          'The sender\'s name matches a colleague',
          'The email contains a company logo',
        ],
        correct: 1,
      },
      {
        id: 'q3',
        text: 'What is the most reliable way to verify a caller is actually from your IT department?',
        options: [
          'Ask them to provide your employee ID',
          'Check if the phone number looks familiar',
          'Hang up and call IT directly using the official company directory number',
          'Ask them to send a follow-up email',
        ],
        correct: 2,
      },
    ],
  },
  { id: 's6', title: 'Red Flags in the Age of AI', type: 'TEXT', content: 'Teaches modern warning signs that go beyond spelling mistakes, such as unusual context, changes in tone, unexpected requests.' },
  { id: 's7', title: 'Technical Controls That Reduce Phishing Risk', type: 'TEXT', content: 'Introduces key security measures: email authentication (DMARC, DKIM, SPF), AI-based email filtering, MFA, endpoint protection.' },
  { id: 's8', title: 'Organizational Processes and Policies', type: 'TEXT', content: 'Covers non-technical protections: approval workflows, payment verification processes, secure communication standards.' },
  { id: 's9', title: 'Employee Training and Culture as a Defense', type: 'TEXT', content: 'Argues that ongoing, realistic training is the most effective long-term defense. Covers how to build a reporting culture.' },
]

const QUIZ_DATA = {
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

// ─── Shared primitives ────────────────────────────────────────────────────────

function DoppelLogo({ size = 20 }) {
  return (
    <img src="/doppel-logo.svg" alt="Doppel" style={{ height: size, width: 'auto', display: 'block' }} />
  )
}

function Btn({ children, variant = 'primary', disabled, onClick, className = '' }) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded px-3 h-8 text-xs font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap'
  const variants = {
    primary: `bg-[${C.accent}] text-[${C.accentFg}] hover:opacity-90`,
    secondary: `bg-[${C.secondary}] text-[${C.fg}] hover:bg-[#5a5660]`,
    ghost: `bg-transparent text-[${C.fgMuted}] hover:text-[${C.fg}] hover:bg-[#3e3a3c]`,
  }
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${className}`}
      style={
        variant === 'primary'
          ? { background: C.accent, color: C.accentFg }
          : variant === 'secondary'
          ? { background: C.secondary, color: C.fg }
          : { background: 'transparent', color: C.fgMuted }
      }
    >
      {children}
    </button>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <svg
        width="32" height="32"
        viewBox="0 0 24 24" fill="none"
        style={{ animation: 'spin 0.8s linear infinite', color: C.accent }}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
        <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}

// ─── Screen 1: Training Goals ─────────────────────────────────────────────────

function UploadZone({ hint, multiple }) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)

  const addFiles = (incoming) => {
    const arr = Array.from(incoming)
    setFiles((prev) => (multiple ? [...prev, ...arr] : arr))
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
      style={{
        minHeight: 100,
        border: `1px dashed ${dragging ? C.accent : C.border}`,
        borderRadius: 6,
        background: dragging ? 'rgba(226,249,142,0.04)' : C.bgMuted,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        cursor: 'pointer',
        padding: '12px 16px',
        transition: 'border-color 0.15s',
      }}
    >
      <input ref={inputRef} type="file" multiple={multiple} style={{ display: 'none' }} onChange={(e) => addFiles(e.target.files)} />
      {files.length === 0 ? (
        <>
          <Upload size={18} color={C.fgMuted} />
          <span style={{ fontSize: 13, color: C.fg, fontWeight: 500 }}>Drop files here or click to upload.</span>
          {hint && <span style={{ fontSize: 12, color: C.fgMuted }}>{hint}</span>}
        </>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.fg }}>
              <Upload size={13} color={C.accent} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFiles((p) => p.filter((_, j) => j !== i)) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.fgMuted, padding: 0 }}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Screen1({ goal, setGoal }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: C.fg }}>
          Training Goal<span style={{ color: '#f87171' }}>*</span>
        </label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Train employees to identify CEO"
          rows={6}
          style={{
            width: '100%',
            resize: 'none',
            background: C.bgMuted,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: '10px 12px',
            fontSize: 13,
            color: C.fg,
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.target.style.borderColor = C.borderHover)}
          onBlur={(e) => (e.target.style.borderColor = C.border)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: C.fg }}>
          Source Material <span style={{ color: C.fgMuted, fontWeight: 400 }}>(optional)</span>
        </label>
        <UploadZone multiple hint="Policies, incident reports, reference links." />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: C.fg }}>
          Logo <span style={{ color: C.fgMuted, fontWeight: 400 }}>(optional)</span>
        </label>
        <UploadZone hint="SVG, JPG or PNG, no more than 2.5mb." />
      </div>
    </div>
  )
}

// ─── Screen 2: Review Course Plan ────────────────────────────────────────────

function Screen2({ plan, setPlan }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
      <div style={{
        flex: 1, minHeight: 0,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        background: C.bgMuted,
        display: 'flex',
      }}>
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          style={{
            flex: 1,
            resize: 'none',
            background: 'transparent',
            border: 'none',
            padding: '14px 16px',
            fontSize: 13,
            color: C.fg,
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.65,
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        />
      </div>
      <p style={{ fontSize: 12, color: C.fgMuted, flexShrink: 0, marginBottom: 0 }}>You can edit the plan above before proceeding to content editing.</p>
    </div>
  )
}

// ─── Screen 3: Content Editing ────────────────────────────────────────────────

const SECTION_TYPES = ['TEXT', 'VIDEO', 'CARDS', 'QUIZ']
const TYPE_STYLE = {
  TEXT:  { background: '#2e2a2c', color: '#a8a6ab' },
  VIDEO: { background: 'rgba(28,132,252,0.18)', color: '#60a5fa' },
  CARDS: { background: 'rgba(255,157,82,0.18)', color: '#fb923c' },
  QUIZ:  { background: 'rgba(226,249,142,0.12)', color: '#e2f98e' },
}

function TypePill({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          height: 22, padding: '0 8px', borderRadius: 4, border: 'none',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          cursor: 'pointer', ...(TYPE_STYLE[value] ?? TYPE_STYLE.TEXT),
        }}
      >
        {value}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 100, marginTop: 4,
          minWidth: 120, borderRadius: 6, border: `1px solid ${C.border}`,
          background: C.bgCard, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {SECTION_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { onChange(t); setOpen(false) }}
              style={{
                display: 'flex', width: '100%', alignItems: 'center',
                padding: '7px 12px', border: 'none', background: 'none',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                cursor: 'pointer', textAlign: 'left',
                ...(t === value ? { color: C.accent } : { color: C.fg }),
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.border)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Shared field helpers ─────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: C.fgMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: C.bgMuted, border: `1px solid ${C.border}`, borderRadius: 4,
  padding: '7px 10px', fontSize: 13, color: C.fg, outline: 'none', fontFamily: 'inherit', width: '100%',
}

function StyledInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = C.borderHover)}
      onBlur={(e) => (e.target.style.borderColor = C.border)}
    />
  )
}

function StyledTextarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
      onFocus={(e) => (e.target.style.borderColor = C.borderHover)}
      onBlur={(e) => (e.target.style.borderColor = C.border)}
    />
  )
}

function IconBtn({ onClick, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', borderRadius: 4,
        color: C.fgMuted, cursor: 'pointer', flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.15)' : C.border
        e.currentTarget.style.color = danger ? '#f87171' : C.fg
      }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.fgMuted }}
    >
      {children}
    </button>
  )
}

function AddRowBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 32, borderRadius: 5, border: `1px dashed ${C.border}`,
        background: 'none', color: C.fgMuted, fontSize: 12, cursor: 'pointer',
        transition: 'border-color 0.15s, color 0.15s', width: '100%',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.fg }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.fgMuted }}
    >
      {label}
    </button>
  )
}

// ─── Learning Cards editor ────────────────────────────────────────────────────

function LearningCardsEditor({ section, onUpdate }) {
  const cards = section.cards || [{ id: 'c1', front: '', back: '' }]

  const setCards = (next) => onUpdate({ ...section, cards: next })

  const addCard = () => setCards([...cards, { id: `c${Date.now()}`, front: '', back: '' }])
  const removeCard = (id) => setCards(cards.filter((c) => c.id !== id))
  const updateCard = (id, field, val) => setCards(cards.map((c) => c.id === id ? { ...c, [field]: val } : c))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Section Title">
        <StyledInput value={section.title} onChange={(e) => onUpdate({ ...section, title: e.target.value })} />
      </Field>

      <Field label="Introduction">
        <StyledTextarea
          value={section.content || ''}
          onChange={(e) => onUpdate({ ...section, content: e.target.value })}
          placeholder="Brief intro shown before the cards…"
          rows={2}
        />
      </Field>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: C.fgMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Cards <span style={{ color: C.border, fontWeight: 400 }}>({cards.length})</span>
        </label>

        {cards.map((card, ci) => (
          <div
            key={card.id}
            style={{
              borderRadius: 6, border: `1px solid ${C.border}`,
              background: C.bgMuted, padding: '10px 12px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.fgMuted }}>CARD {ci + 1}</span>
              {cards.length > 1 && (
                <IconBtn danger onClick={() => removeCard(card.id)}><Trash2 size={12} /></IconBtn>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Field label="Front (question / term)">
                <StyledTextarea
                  value={card.front}
                  onChange={(e) => updateCard(card.id, 'front', e.target.value)}
                  placeholder="e.g. What is spear phishing?"
                  rows={3}
                />
              </Field>
              <Field label="Back (answer / explanation)">
                <StyledTextarea
                  value={card.back}
                  onChange={(e) => updateCard(card.id, 'back', e.target.value)}
                  placeholder="e.g. A targeted phishing attack…"
                  rows={3}
                />
              </Field>
            </div>
          </div>
        ))}

        <AddRowBtn label="+ Add Card" onClick={addCard} />
      </div>
    </div>
  )
}

// ─── Quiz editor ──────────────────────────────────────────────────────────────

function QuizEditor({ section, onUpdate }) {
  const questions = section.questions || [
    { id: 'q1', text: '', options: ['', '', '', ''], correct: 0 },
  ]

  const setQuestions = (next) => onUpdate({ ...section, questions: next })

  const addQuestion = () => setQuestions([
    ...questions,
    { id: `q${Date.now()}`, text: '', options: ['', '', '', ''], correct: 0 },
  ])

  const removeQuestion = (id) => setQuestions(questions.filter((q) => q.id !== id))

  const updateQuestion = (id, field, val) =>
    setQuestions(questions.map((q) => q.id === id ? { ...q, [field]: val } : q))

  const updateOption = (qid, oi, val) =>
    setQuestions(questions.map((q) =>
      q.id === qid ? { ...q, options: q.options.map((o, i) => i === oi ? val : o) } : q
    ))

  const addOption = (qid) =>
    setQuestions(questions.map((q) =>
      q.id === qid ? { ...q, options: [...q.options, ''] } : q
    ))

  const removeOption = (qid, oi) =>
    setQuestions(questions.map((q) => {
      if (q.id !== qid) return q
      const opts = q.options.filter((_, i) => i !== oi)
      return { ...q, options: opts, correct: q.correct >= opts.length ? 0 : q.correct }
    }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Section Title">
        <StyledInput value={section.title} onChange={(e) => onUpdate({ ...section, title: e.target.value })} />
      </Field>

      <Field label="Introduction">
        <StyledTextarea
          value={section.content || ''}
          onChange={(e) => onUpdate({ ...section, content: e.target.value })}
          placeholder="Brief description shown above the quiz…"
          rows={2}
        />
      </Field>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: C.fgMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Questions <span style={{ color: C.border, fontWeight: 400 }}>({questions.length})</span>
        </label>

        {questions.map((q, qi) => (
          <div
            key={q.id}
            style={{
              borderRadius: 6, border: `1px solid ${C.border}`,
              background: C.bgMuted, padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}
          >
            {/* Question header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.fgMuted }}>QUESTION {qi + 1}</span>
              {questions.length > 1 && (
                <IconBtn danger onClick={() => removeQuestion(q.id)}><Trash2 size={12} /></IconBtn>
              )}
            </div>

            <Field label="Question Text">
              <StyledTextarea
                value={q.text}
                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                placeholder="e.g. Which of the following is a sign of a phishing email?"
                rows={2}
              />
            </Field>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.fgMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Answer Options — <span style={{ color: C.accent, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>click circle to mark correct</span>
              </label>

              {q.options.map((opt, oi) => (
                <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Correct answer radio */}
                  <button
                    type="button"
                    onClick={() => updateQuestion(q.id, 'correct', oi)}
                    title="Mark as correct answer"
                    style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                      border: `2px solid ${q.correct === oi ? C.accent : C.border}`,
                      background: q.correct === oi ? C.accent : 'transparent',
                      transition: 'all 0.15s',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <StyledInput
                      value={opt}
                      onChange={(e) => updateOption(q.id, oi, e.target.value)}
                      placeholder={`Option ${oi + 1}`}
                    />
                  </div>
                  {q.options.length > 2 && (
                    <IconBtn danger onClick={() => removeOption(q.id, oi)}><X size={12} /></IconBtn>
                  )}
                </div>
              ))}

              {q.options.length < 6 && (
                <AddRowBtn label="+ Add Option" onClick={() => addOption(q.id)} />
              )}
            </div>
          </div>
        ))}

        <AddRowBtn label="+ Add Question" onClick={addQuestion} />
      </div>
    </div>
  )
}

// ─── Generic text editor ──────────────────────────────────────────────────────

function GenericEditor({ section, onUpdate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Section Title">
        <StyledInput value={section.title} onChange={(e) => onUpdate({ ...section, title: e.target.value })} />
      </Field>
      <Field label="Content">
        <StyledTextarea
          value={section.content || ''}
          onChange={(e) => onUpdate({ ...section, content: e.target.value })}
          rows={5}
        />
      </Field>
    </div>
  )
}

// ─── Section row ──────────────────────────────────────────────────────────────

function SectionRow({ section, index, onDelete, onUpdate, dragHandlers, dropLine }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {/* Drop line — above */}
      {dropLine === 'above' && (
        <div style={{
          position: 'absolute', top: -4, left: 0, right: 0, zIndex: 10,
          height: 2, borderRadius: 1, background: C.accent,
          boxShadow: `0 0 6px ${C.accent}`,
        }} />
      )}

      <div
        style={{
          borderRadius: 6,
          border: `1px solid ${expanded ? C.borderHover : C.border}`,
          background: C.bg,
          transition: 'border-color 0.15s',
          opacity: dragHandlers.isDragging ? 0.35 : 1,
        }}
        onDragOver={(e) => { e.preventDefault(); dragHandlers.onDragOver(e, index) }}
        onDrop={(e) => { e.preventDefault(); dragHandlers.onDrop(e, index) }}
        onDragLeave={dragHandlers.onDragLeave}
      >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
        {/* Drag handle — disabled for index 0 (Introduction) */}
        <div
          draggable={index > 0}
          onDragStart={(e) => { if (index === 0) { e.preventDefault(); return; } e.dataTransfer.effectAllowed = 'move'; dragHandlers.onDragStart(index) }}
          onDragEnd={dragHandlers.onDragEnd}
          style={{
            display: 'flex', alignItems: 'center', flexShrink: 0, padding: '2px 0',
            cursor: index === 0 ? 'not-allowed' : 'grab',
            opacity: index === 0 ? 0.2 : 0.5,
          }}
          title={index === 0 ? 'Introduction cannot be reordered' : 'Drag to reorder'}
        >
          <GripVertical size={15} color={C.fgMuted} />
        </div>

        <span style={{ fontSize: 12, fontWeight: 600, color: C.fgMuted, width: 18, flexShrink: 0 }}>{index + 1}</span>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          style={{
            flex: 1, textAlign: 'left', background: 'none', border: 'none',
            fontSize: 13, fontWeight: 500, color: C.fg, cursor: 'pointer',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {section.title}
        </button>

        <TypePill value={section.type} onChange={(t) => onUpdate({ ...section, type: t })} />

        <button
          type="button"
          onClick={onDelete}
          style={{
            width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', borderRadius: 4,
            color: C.fgMuted, cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.fgMuted }}
        >
          <Trash2 size={13} />
        </button>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          style={{
            width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', borderRadius: 4,
            color: C.fgMuted, cursor: 'pointer',
          }}
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Expanded editor — type-aware */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '14px 16px' }}>
          {section.type === 'CARDS'
            ? <LearningCardsEditor section={section} onUpdate={onUpdate} />
            : section.type === 'QUIZ'
            ? <QuizEditor section={section} onUpdate={onUpdate} />
            : <GenericEditor section={section} onUpdate={onUpdate} />
          }
        </div>
      )}
      </div>

      {/* Drop line — below */}
      {dropLine === 'below' && (
        <div style={{
          position: 'absolute', bottom: -4, left: 0, right: 0, zIndex: 10,
          height: 2, borderRadius: 1, background: C.accent,
          boxShadow: `0 0 6px ${C.accent}`,
        }} />
      )}
    </div>
  )
}

function Screen3({ sections, setSections }) {
  const dragIndex = useRef(null)
  const [dropTarget, setDropTarget] = useState(null)

  const dragHandlersFor = (i) => ({
    isDragging: dragIndex.current === i,
    onDragStart: (idx) => { dragIndex.current = idx },
    onDragEnd: () => { dragIndex.current = null; setDropTarget(null) },
    onDragOver: (e, idx) => {
      if (dragIndex.current === null) return
      const rect = e.currentTarget.getBoundingClientRect()
      const position = e.clientY < rect.top + rect.height / 2 ? 'above' : 'below'
      setDropTarget({ index: idx, position })
    },
    onDragLeave: () => setDropTarget(null),
    onDrop: (e, idx) => {
      const from = dragIndex.current
      if (from === null) return
      const rect = e.currentTarget.getBoundingClientRect()
      const position = e.clientY < rect.top + rect.height / 2 ? 'above' : 'below'
      let to = position === 'below' ? idx + 1 : idx
      // Adjust for removal of source item
      if (from < to) to -= 1
      if (from === to) { dragIndex.current = null; setDropTarget(null); return }
      setSections((prev) => {
        const next = [...prev]
        const [item] = next.splice(from, 1)
        next.splice(to, 0, item)
        return next
      })
      dragIndex.current = null
      setDropTarget(null)
    },
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {sections.map((s, i) => {
        let dropLine = null
        if (dropTarget && dragIndex.current !== null) {
          if (dropTarget.index === i) dropLine = dropTarget.position
        }
        return (
        <SectionRow
          key={s.id}
          section={s}
          index={i}
          onDelete={() => setSections((prev) => prev.filter((x) => x.id !== s.id))}
          onUpdate={(updated) => setSections((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))}
          dragHandlers={{ ...dragHandlersFor(i), onDrop: i === 0 ? () => {} : dragHandlersFor(i).onDrop }}
          dropLine={i === 0 ? null : dropLine}
        />
        )
      })}
      <button
        type="button"
        onClick={() => setSections((prev) => [...prev, { id: `s${Date.now()}`, title: 'New Section', type: 'TEXT', content: '' }])}
        style={{
          height: 36, borderRadius: 6, border: `1px dashed ${C.border}`,
          background: 'none', color: C.fgMuted, fontSize: 13, cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s', marginTop: 2,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.fg }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.fgMuted }}
      >
        + Add Section
      </button>
    </div>
  )
}

// ─── Screen 4: Preview ────────────────────────────────────────────────────────

function Screen4() {
  return (
    <img
      src="/course-preview.png"
      alt="Course preview"
      style={{ width: '100%', borderRadius: 8, display: 'block' }}
    />
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Set Course Objectives' },
  { label: 'Review Course Plan' },
  { label: 'Edit Content' },
  { label: 'Preview the Course' },
]

export function CourseStudioPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [goal, setGoal] = useState('')
  const [plan, setPlan] = useState(MOCK_PLAN)
  const [sections, setSections] = useState(INITIAL_SECTIONS)

  const canNext = step === 0 ? goal.trim().length > 0 : true
  const isLast = step === STEPS.length - 1

  const goNext = () => {
    if (!canNext || isLast) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep((s) => s + 1) }, 1400)
  }

  const goBack = () => { if (step > 0 && !loading) setStep((s) => s - 1) }

  return (
    <div style={{
      minHeight: '100vh', background: C.bgDeep,
      display: 'flex', flexDirection: 'column',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        html, body { overflow-y: scroll; scrollbar-gutter: stable; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3e3a3c; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #5e5a5c; }
      `}</style>

      {/* ── Full-width top bar ── */}
      <div style={{ flexShrink: 0 }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: '#3e3a3c' }}>
          <div style={{
            height: '100%', background: C.accent,
            width: `${((step + 1) / STEPS.length) * 100}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Header */}
        <div style={{
          height: 56,
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 24px',
          borderBottom: `1px solid ${C.border}`,
          background: C.bgDeep,
        }}>
          <DoppelLogo size={20} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.fg }}>Create Custom Course</span>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Btn variant="secondary" onClick={goBack} disabled={step === 0 || loading}>BACK</Btn>
            <Btn variant="secondary">GET HELP FROM CONTENT TEAM</Btn>
            <Btn
              variant="primary"
              onClick={isLast ? () => alert('Course published!') : goNext}
              disabled={!canNext || loading}
            >
              {isLast ? 'PUBLISH' : 'NEXT'}
            </Btn>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', borderRadius: 4,
              color: C.fgMuted, cursor: 'pointer', transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.border; e.currentTarget.style.color = C.fg }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.fgMuted }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Centered card / spinner ── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex',
        alignItems: loading ? 'center' : 'flex-start',
        justifyContent: 'center',
        padding: loading ? '0 24px' : step === 3 ? '24px 16px' : '40px 24px',
        overflowY: step === 1 ? 'hidden' : 'auto',
      }}>
        {loading ? (
          <Spinner />
        ) : (
          <div style={{
            width: '100%', maxWidth: step === 3 ? 1200 : 820,
            background: C.bg,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            boxShadow: '0 16px 60px rgba(0,0,0,0.5)',
            // On step 1: fixed 600px height so textarea fills it
            ...(step === 1 ? {
              display: 'flex', flexDirection: 'column',
              height: 600,
            } : {}),
          }}>
            <div style={{
              padding: '28px 36px',
              // On step 1: fill card height so Screen2 can stretch
              ...(step === 1 ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } : {}),
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: C.fg, margin: '0 0 20px', flexShrink: 0 }}>
                {STEPS[step].label}
              </h2>
              {step === 0 && <Screen1 goal={goal} setGoal={setGoal} />}
              {step === 1 && <Screen2 plan={plan} setPlan={setPlan} />}
              {step === 2 && <Screen3 sections={sections} setSections={setSections} />}
              {step === 3 && <Screen4 />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
