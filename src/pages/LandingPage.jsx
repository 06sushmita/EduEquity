import { motion } from 'framer-motion'

const HERO_POINTS = [
  'Built around UN SDG 10: Reduced Inequalities',
  'Designed for schools that need trust, clarity, and low-friction workflows',
  'Combines evaluation, intervention, and scholarship discovery in one product',
]

const OVERVIEW_FEATURES = [
  {
    id: '01',
    title: 'Fair evaluation',
    desc: 'Answer sheets scored with explainable feedback, confidence cues, and bias-aware review.',
  },
  {
    id: '02',
    title: 'Teacher insights',
    desc: 'Classroom trends, support flags, and scholarship readiness surfaced in one clean dashboard.',
  },
  {
    id: '03',
    title: 'Student pathways',
    desc: 'Students track growth, understand next steps, and discover scholarships based on merit and need.',
  },
]

const STATS = [
  { value: '0', label: 'identity factors used in scoring' },
  { value: '1', label: 'workflow from evaluation to opportunity' },
  { value: '24/7', label: 'accessible digital review experience' },
]

const CAPABILITIES = [
  {
    title: 'Bias-aware scoring',
    desc: 'Evaluate answer sheets with transparent rubrics and confidence signals, never on who the student is.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="6" height="6" rx="2" fill="#84E2BE" />
        <rect x="10" y="2" width="6" height="6" rx="2" fill="rgba(132,226,190,0.4)" />
        <rect x="2" y="10" width="6" height="6" rx="2" fill="rgba(132,226,190,0.4)" />
        <rect x="10" y="10" width="6" height="6" rx="2" fill="rgba(132,226,190,0.6)" />
      </svg>
    ),
  },
  {
    title: 'Live classroom trends',
    desc: 'Teachers see patterns across cohorts the moment evaluations are complete, not weeks later.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M2 14L5 8L8 11L11 5L16 14" stroke="#84E2BE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Student growth tracking',
    desc: 'Each learner gets a clear view of their progress, gaps, and concrete next steps to improve.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="6" r="3.5" stroke="#84E2BE" strokeWidth="1.5" />
        <path d="M3 16C3 12.686 5.686 11 9 11C12.314 11 15 12.686 15 16" stroke="#84E2BE" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Scholarship discovery',
    desc: 'Surfaces relevant scholarships based on merit and need automatically, no manual searching required.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2L10.8 7H16L11.6 10.1L13.4 15L9 12L4.6 15L6.4 10.1L2 7H7.2L9 2Z" stroke="#84E2BE" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Explainable feedback',
    desc: 'Every score comes with a clear rationale students can read, understand, and act on independently.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="#84E2BE" strokeWidth="1.5" />
        <path d="M6 8H12M6 11H10" stroke="#84E2BE" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Offline-first core',
    desc: 'Works without reliable internet and fits the real conditions of under-resourced schools worldwide.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M2 9H5L7 4L10 13L12 9H16" stroke="#84E2BE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const FOOTER_LINKS = ['Privacy', 'Terms', 'Docs']

function GlowOrb({ style }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(80px)',
        background: 'radial-gradient(circle, #1D9E75 0%, transparent 70%)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

export function LandingPage({ onNavigate }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: '#04261F',
        color: '#F6F4EC',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6,
        }}
      />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <GlowOrb style={{ width: 600, height: 600, top: -200, right: -100, opacity: 0.18 }} />
        <GlowOrb style={{ width: 400, height: 400, bottom: 100, left: -100, opacity: 0.12 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <nav
          className="max-w-[1100px] mx-auto px-5 md:px-8 py-[22px] flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[13px] font-semibold"
              style={{
                background: 'linear-gradient(135deg, #1D9E75 0%, #157A5A 100%)',
                color: '#fff',
                letterSpacing: '-0.3px',
                boxShadow: '0 0 0 1px rgba(29,158,117,0.4), 0 4px 12px rgba(29,158,117,0.25)',
              }}
            >
              EA
            </div>
            <div>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, lineHeight: 1.1 }}>
                EduEquity AI
              </div>
              <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Fair evaluation for modern classrooms
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={() => onNavigate('auth')}
              className="px-[18px] py-2 rounded-[10px] text-[13px] font-medium cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.11)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => onNavigate('auth')}
              className="px-5 py-2 rounded-[10px] text-[13px] font-medium border-none cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #1D9E75 0%, #15876A 100%)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(29,158,117,0.35)',
                transition: 'opacity 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Get started
            </button>
          </div>
        </nav>

        <section className="max-w-[1100px] mx-auto px-5 md:px-8 py-10 md:py-[60px] grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-[14px] py-[6px] rounded-full text-xs font-medium mb-6"
              style={{
                background: 'rgba(29,158,117,0.12)',
                border: '1px solid rgba(132,226,190,0.25)',
                color: '#84E2BE',
                backdropFilter: 'blur(8px)',
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#84E2BE', boxShadow: '0 0 6px #84E2BE' }}
              />
              Trusted scoring. Clear feedback. Better access.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: 'clamp(2.4rem, 4.2vw, 4rem)',
                lineHeight: 1.03,
                letterSpacing: '-1.5px',
                color: '#F6F4EC',
              }}
              className="mb-5"
            >
              A simpler way to make
              <br />
              student evaluation
              <br />
              <span style={{ color: '#84E2BE' }}>fair and useful.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="text-base max-w-[520px] mb-8"
              style={{ lineHeight: 1.75, color: 'rgba(255,255,255,0.6)' }}
            >
              EduEquity AI helps teachers review student work with clarity, gives learners actionable
              feedback, and opens scholarship pathways without relying on prestige or background signals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="flex flex-wrap gap-3 items-center mb-9"
            >
              <button
                type="button"
                onClick={() => onNavigate('auth')}
                className="px-7 py-[13px] rounded-xl text-[15px] font-medium border-none cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #1D9E75 0%, #15876A 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(29,158,117,0.4)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(29,158,117,0.45)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,158,117,0.4)' }}
              >
                Launch dashboard
              </button>
              <div
                className="px-4 py-[10px] rounded-[10px] text-[13px]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
              >
                Offline-first scoring core
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-[10px]"
            >
              {HERO_POINTS.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.32 + i * 0.07 }}
                  className="flex items-start gap-[10px] text-[13px]"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <span style={{ color: '#84E2BE', fontSize: 14, marginTop: 1, flexShrink: 0 }}>+</span>
                  <span>{point}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="rounded-[28px] p-[5px]"
            style={{
              background: 'linear-gradient(160deg, rgba(132,226,190,0.15) 0%, rgba(29,158,117,0.05) 100%)',
              border: '1px solid rgba(132,226,190,0.15)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="rounded-[24px] p-6"
              style={{
                background: 'linear-gradient(160deg, #ffffff 0%, #F0F8F4 100%)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-start justify-between mb-5 gap-3">
                <div>
                  <div
                    className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                    style={{ color: '#8A9E97', letterSpacing: '0.8px' }}
                  >
                    Platform overview
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Serif Display',serif",
                      fontSize: 22,
                      color: '#04342C',
                      lineHeight: 1.2,
                    }}
                  >
                    From review
                    <br />
                    to opportunity
                  </div>
                </div>
                <div
                  className="px-3 py-[5px] rounded-full text-[10px] font-semibold whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #D4F0E4 0%, #E8F8F0 100%)',
                    color: '#0A5E45',
                    border: '1px solid rgba(29,158,117,0.2)',
                    letterSpacing: '0.3px',
                  }}
                >
                  Professional demo
                </div>
              </div>

              <div className="flex flex-col gap-[8px] mb-4">
                {OVERVIEW_FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                    className="rounded-[14px] px-4 py-3 flex items-center gap-3"
                    style={{
                      background: '#fff',
                      border: '1px solid #ECEAE0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      className="flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #E8F8F0 0%, #D4F0E4 100%)',
                        color: '#0A5E45',
                        border: '1px solid rgba(29,158,117,0.15)',
                      }}
                    >
                      {feature.id}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="text-[13px] font-semibold mb-[2px]" style={{ color: '#1C3530' }}>
                        {feature.title}
                      </div>
                      <div className="text-[11px] leading-[1.45]" style={{ color: '#7A9089' }}>
                        {feature.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div
                className="rounded-[14px] px-4 py-3"
                style={{
                  background: 'linear-gradient(135deg, #04342C 0%, #062E25 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="text-[9px] font-bold uppercase mb-[5px] tracking-widest"
                  style={{ color: 'rgba(132,226,190,0.5)', letterSpacing: '1px' }}
                >
                  Why it stands out
                </div>
                <div className="text-[12px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Instead of stopping at grading, EduEquity AI helps schools act on outcomes with
                  feedback, support signals, and scholarship discovery.
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <div className="max-w-[1100px] mx-auto px-5 md:px-8 grid md:grid-cols-3">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={[
                  'px-6 py-8 border-b md:border-b-0',
                  index < STATS.length - 1 ? 'md:border-r' : '',
                  index === STATS.length - 1 ? 'border-b-0' : '',
                ].join(' ')}
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 44,
                    lineHeight: 1,
                    marginBottom: 6,
                    color: '#84E2BE',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-[13px] leading-[1.4]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-[1100px] mx-auto px-5 md:px-8 py-16">
          <div
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase mb-[14px]"
            style={{ color: '#84E2BE', letterSpacing: '1.2px' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="0" y="0" width="14" height="14" rx="3" fill="rgba(132,226,190,0.25)" />
              <path d="M3 7L5.5 9.5L11 4.5" stroke="#84E2BE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Core capabilities
          </div>
          <div
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.15,
            }}
            className="mb-[10px]"
          >
            Everything needed to
            <br />
            close the equity gap
          </div>
          <div
            className="text-[15px] max-w-[500px] leading-[1.7] mb-10"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            From the classroom to the scholarship office, one integrated product that removes friction
            at every step.
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {CAPABILITIES.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * index }}
                className="rounded-[20px] p-6"
                style={{
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'border-color 0.25s, background 0.25s, transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(29,158,117,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(132,226,190,0.18)'
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.035)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'rgba(29,158,117,0.12)',
                    border: '1px solid rgba(29,158,117,0.22)',
                    transition: 'background 0.25s',
                  }}
                >
                  {item.icon}
                </div>
                <div className="text-[14px] font-semibold mb-2" style={{ color: '#E8F6EF' }}>
                  {item.title}
                </div>
                <div className="text-[13px] leading-[1.65]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section style={{ background: 'rgba(255,255,255,0.97)' }}>
          <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-[52px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div
                className="text-[11px] font-semibold uppercase mb-[10px]"
                style={{ color: '#0F6E56', letterSpacing: '1.2px' }}
              >
                Ready to explore?
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: 30,
                  color: '#04342C',
                  lineHeight: 1.2,
                }}
                className="mb-[10px]"
              >
                Start with a cleaner, fairer evaluation flow.
              </div>
              <div
                className="text-[14px] max-w-[480px] leading-[1.7]"
                style={{ color: '#5C7A70' }}
              >
                Sign in as a teacher to upload and evaluate answer sheets, or as a student to review
                results and discover scholarship opportunities.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('auth')}
              className="px-[30px] py-[14px] rounded-xl text-[15px] font-medium border-none cursor-pointer whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #04342C 0%, #062E25 100%)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(4,52,44,0.25)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(4,52,44,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(4,52,44,0.25)' }}
            >
              Open EduEquity AI
            </button>
          </div>
        </section>

        <footer
          className="max-w-[1100px] mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
            (c) 2025 EduEquity AI - Built for equity, not prestige.
          </div>
          <div className="flex items-center gap-5">
            {FOOTER_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                className="text-xs border-none p-0 cursor-default"
                style={{ color: 'rgba(255,255,255,0.32)', background: 'transparent', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.32)' }}
              >
                {link}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
