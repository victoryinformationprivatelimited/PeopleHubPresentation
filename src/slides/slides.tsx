import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useDeck, useNav, money, poss, type SlideDef } from '../engine/context'
import { Badge, Counter, Flow, Window, fade } from '../ui/primitives'
import { Hero3D } from '../ui/Hero3D'
import { IndustryArt } from '../ui/IndustryArt'
import { QrCode } from '../ui/QrCode'
import { ModuleSlide, Section } from './layouts'
import { modules, pillars } from './modules'
import * as A from './demosA'
import * as B from './demosB'
import { BeforeAfter, Challenge, PainsSolved, Roi, Versus } from './sales'

const demos: Record<string, () => ReactNode> = {
  org: () => <A.OrgDemo />, employee: () => <A.EmployeeDemo />, lifecycle: () => <A.LifecycleDemo />, termination: () => <A.TerminationDemo />, recruitment: () => <A.RecruitmentDemo />,
  attendance: () => <A.AttendanceDemo />, leave: () => <A.LeaveDemo />, payroll: () => <A.PayrollDemo />, loans: () => <A.LoansDemo />, benefits: () => <A.BenefitsDemo />,
  performance: () => <A.PerformanceDemo />, training: () => <A.TrainingDemo />, succession: () => <A.SuccessionDemo />, tasks: () => <A.TasksDemo />, engagement: () => <B.EngagementDemo />,
  ess: () => <B.EssDemo />, grievance: () => <B.GrievanceDemo />, tickets: () => <B.TicketsDemo />, assets: () => <B.AssetsDemo />, kb: () => <B.KbDemo />, chat: () => <B.ChatDemo />, leisure: () => <B.LeisureDemo />, notifications: () => <B.NotificationsDemo />,
  analytics: () => <B.AnalyticsDemo />, compliance: () => <B.ComplianceDemo />, security: () => <B.SecurityDemo />, integration: () => <B.IntegrationDemo />,
}

/* ================= A. OPEN ================= */
function Opener() {
  const { industry, client, country, logo, print } = useDeck()
  return (
    <div className="absolute inset-0">
      {!print && <Hero3D className="absolute right-[-120px] top-0 w-[1100px] h-[1000px] opacity-40" />}
      <motion.div {...fade(0.3)} className="absolute right-12 top-[150px] w-[820px]"><IndustryArt id={industry.id} className="w-full" /></motion.div>
      <div className="absolute left-20 top-24 w-[1000px]">
        <motion.div {...fade(0)} className="flex items-center gap-6 mb-10"><img src="./logo-black.png" alt="PeopleHub" className="h-28 w-28 rounded-full bg-white p-1" />{logo && <><span className="text-[40px]" style={{ color: 'var(--mute)' }}>×</span><img src={logo} alt={client} className="h-28 max-w-[320px] object-contain rounded-2xl bg-white px-4 py-2" /></>}</motion.div>
        <motion.div {...fade(0.1)} className="text-[16px] tracking-[0.3em] uppercase font-bold mb-5" style={{ color: 'var(--accent)' }}>Intelligent Human Capital Platform</motion.div>
        <motion.h1 {...fade(0.2)} className="serif text-[98px] leading-[1.02] font-bold">{industry.headline}</motion.h1>
        <motion.p {...fade(0.35)} className="text-[28px] mt-8 max-w-[860px]" style={{ color: 'var(--mute)' }}>{industry.subhead}</motion.p>
        <motion.div {...fade(0.5)} className="flex gap-3 mt-10 flex-wrap">
          {client && <Badge tone="ok">Prepared for {client}</Badge>}
          <Badge>{country.name}</Badge><Badge tone="mute">{industry.name}</Badge>
        </motion.div>
      </div>
      <div className="absolute left-20 bottom-24 text-[16px]" style={{ color: 'var(--mute)' }}>A product of {country.contact.company}{!print && <> · Press <b>?</b> for shortcuts · <b>G</b> jump · <b>L</b> pointer</>}</div>
    </div>
  )
}

function Constellation() {
  const { industry } = useDeck()
  const [hover, setHover] = useState<string | null>(null)
  const { jump } = useNav()
  return (
    <Section eyebrow="Meet PeopleHub" title="One platform. 27 modules. Zero silos." sub="Click any module to jump straight to it — Backspace (or the button) brings you back here." zoom={1.4}>
      <div className="grid grid-cols-5 gap-5 mt-2">
        {pillars.map((p, k) => (
          <motion.div key={p.id} {...fade(0.15 * k)} className="card p-5" style={{ borderTop: `4px solid ${p.color}` }}>
            <div className="font-extrabold text-[22px]">{p.name}</div>
            <div className="text-[14px] mb-4" style={{ color: 'var(--mute)' }}>{p.tag}</div>
            <div className="flex flex-col gap-2">
              {modules.filter(m => m.pillar === p.id).map((m, j) => {
                const focus = industry.focusModules.includes(m.id)
                return (
                  <motion.div key={m.id} {...fade(0.4 + 0.04 * j + 0.1 * k)} onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)} onClick={() => jump(m.id)}
                    className="rounded-lg px-3 py-2 text-[15px] flex items-center gap-2 cursor-pointer"
                    style={{ background: focus || hover === m.id ? `color-mix(in srgb, ${p.color} 28%, transparent)` : 'var(--card)', border: `1px solid ${focus ? p.color : 'var(--line)'}` }}>
                    {focus && <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: p.color }} />}{m.name}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function Glance() {
  const stats: [string, number, string][] = [['Modules', modules.length, ''], ['Pillars', 5, ''], ['Channels', 5, ''], ['Platforms', 2, ' (web + mobile)']]
  const tech = ['.NET Core', 'React', 'PostgreSQL', 'Azure Storage', 'Azure Functions', 'Power BI', 'Metabase', 'Docker']
  return (
    <Section eyebrow="Platform at a glance" title="Modern. Multi-tenant. Cloud-native." sub="Built on proven enterprise technology and designed to scale from 100 to 100,000 employees." zoom={1.2}>
      <div className="grid grid-cols-4 gap-6 mt-4">
        {stats.map(([l, v, s], k) => <motion.div key={l} {...fade(0.15 * k)} className="card p-8 text-center"><div className="serif text-[90px] leading-none font-bold grad-text"><Counter to={v} /></div><div className="text-[22px] mt-2">{l}<span style={{ color: 'var(--mute)' }}>{s}</span></div></motion.div>)}
      </div>
      <div className="mt-10 flex flex-wrap gap-4">{tech.map((t, k) => <motion.span key={t} {...fade(0.6 + 0.07 * k)} className="card px-6 py-4 text-[24px] font-bold">{t}</motion.span>)}</div>
      <motion.div {...fade(1.4)} className="mt-8 grid grid-cols-3 gap-6">
        {[['Web + Mobile', 'One experience across browser, iOS and Android'], ['Multi-tenant', 'Isolated data per company, one managed platform'], ['Role-based', 'Every action governed by permissions and audit']].map(([a, b]) => <div key={a} className="card p-6"><div className="font-extrabold text-[24px] mb-1">{a}</div><div className="text-[18px]" style={{ color: 'var(--mute)' }}>{b}</div></div>)}
      </motion.div>
    </Section>
  )
}

/* ================= IT TRACK ================= */
function Layer({ title, items, color, d }: { title: string; items: string[]; color: string; d: number }) {
  return (
    <motion.div {...fade(d)} className="card p-5 flex items-center gap-6" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="w-[230px] font-extrabold text-[20px]">{title}</div>
      <div className="flex flex-wrap gap-2">{items.map(i => <span key={i} className="px-4 py-2 rounded-lg text-[17px]" style={{ background: `color-mix(in srgb, ${color} 18%, transparent)` }}>{i}</span>)}</div>
    </motion.div>
  )
}

function Architecture() {
  return (
    <Section eyebrow="IT deep-dive · Architecture" title="A clean, layered, cloud-ready architecture" sub="Standard enterprise stack your team already knows how to run, secure and support." zoom={1.35}>
      <div className="flex flex-col gap-4 mt-2">
        <Layer d={0.1} color="#22d3ee" title="Clients" items={['React web app', 'Employee mobile app', 'Admin portal', 'Public APIs']} />
        <Layer d={0.25} color="#3b6be0" title="API layer" items={['.NET Core REST API', 'JWT + MFA + SSO', 'Rate limiting', 'Tenant resolution middleware']} />
        <Layer d={0.4} color="#a78bfa" title="Business services" items={['Approval engine', 'Payroll engine', 'Letter generation', 'Notification dispatch', 'Reporting']} />
        <Layer d={0.55} color="#34d399" title="Data" items={['PostgreSQL (tenant-isolated)', 'Platform master database', 'Azure Storage (documents)', 'Backups & point-in-time restore']} />
        <Layer d={0.7} color="#fbbf24" title="Cloud services" items={['Azure Functions (serverless jobs)', 'Email / SMS / WhatsApp gateways', 'Power BI & Metabase analytics']} />
      </div>
    </Section>
  )
}

function Tenancy() {
  const { company } = useDeck()
  return (
    <Section eyebrow="IT deep-dive · Tenancy & deployment" title="Isolated by design. Deployed your way." sub="Each company’s data is isolated; deployment fits your cloud, our cloud or yours-on-demand." zoom={1.2}>
      <div className="grid grid-cols-2 gap-10 mt-2">
        <Window title="Tenant isolation">
          <div className="flex flex-col gap-3">
            {[company, 'Group company', 'Subsidiary'].map((t, k) => <motion.div key={t} {...fade(0.2 * k)} className="card p-4 flex justify-between items-center"><b>{t}</b><span style={{ color: 'var(--mute)' }}>own schema · own users · own config</span><Badge tone="ok">🔒</Badge></motion.div>)}
            <div className="card p-4 text-center" style={{ borderStyle: 'dashed' }}>Shared platform: tenants, roles, permissions master data</div>
          </div>
        </Window>
        <div className="flex flex-col gap-4">
          {[['☁️ Managed cloud (SaaS)', 'We host and operate on Azure — fastest go-live'], ['🏢 Your Azure tenant', 'Deployed into your subscription, you hold the keys'], ['📦 Containerised', 'Docker images, CI/CD ready, horizontally scalable'], ['🛟 Resilience', 'Automated backups, DR plan, monitoring & alerting']].map(([a, b], k) => (
            <motion.div key={a} {...fade(0.2 * k + 0.3)} className="card p-5"><div className="font-extrabold text-[22px]">{a}</div><div className="text-[18px]" style={{ color: 'var(--mute)' }}>{b}</div></motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function ItSecurity() {
  const items = [['Authentication', 'Password policy · MFA · Microsoft SSO · reCAPTCHA · rate-limited login'], ['Authorisation', 'Role- and permission-based access to every function and API'], ['Data protection', 'Encrypted sensitive fields · TLS in transit · encrypted storage'], ['Accountability', 'Immutable audit trail of who changed what, and when'], ['Privacy', 'Data minimisation, audience-targeted content, self-scoped employee APIs'], ['Operations', 'Environment separation, secrets management, monitoring']]
  return (
    <Section eyebrow="IT deep-dive · Security" title="Security built into every layer" sub="Capabilities your security team can review — we’re happy to walk through detail and share documentation under NDA." zoom={1.25}>
      <div className="grid grid-cols-3 gap-6 mt-2">
        {items.map(([a, b], k) => <motion.div key={a} {...fade(0.12 * k)} className="card p-7"><div className="text-[34px] mb-2">{['🔑', '🛂', '🔐', '📜', '🕶️', '🛡️'][k]}</div><div className="font-extrabold text-[24px] mb-1">{a}</div><div className="text-[18px] leading-snug" style={{ color: 'var(--mute)' }}>{b}</div></motion.div>)}
      </div>
    </Section>
  )
}

function ItIntegration() {
  const { country, industry } = useDeck()
  const first = country.sampleNames[1].split(' ')[0]
  return (
    <Section eyebrow="IT deep-dive · Integration & APIs" title="Open, documented, easy to connect" sub="Standard REST APIs, webhooks and scheduled jobs — plus ready connectors for the systems HR depends on." zoom={1.15}>
      <div className="grid grid-cols-2 gap-8 mt-2">
        <Window title="Example: create employee">
          <pre className="text-[17px] leading-relaxed" style={{ color: 'var(--accent)' }}>{`POST /api/v1/employees
Authorization: Bearer <token>
{
  "firstName": "${first}",
  "department": "${industry.departments[2]}",
  "joinDate": "2026-11-01"
}
→ 201 Created  { "id": "EMP-00431" }`}</pre>
        </Window>
        <div className="flex flex-col gap-4">
          {[['ERP & Accounting', 'Journal entries, cost centres, employee master sync'], ['Biometric & time devices', 'Push/pull punches into attendance'], ['Messaging gateways', 'Email, SMS, WhatsApp via configurable providers'], ['BI tools', 'Direct reporting views for Power BI & Metabase'], ['SSO / Directory', 'Microsoft Entra ID sign-in']].map(([a, b], k) => <motion.div key={a} {...fade(0.15 * k + 0.3)} className="card p-4"><b className="text-[20px]">{a}</b><div className="text-[16px]" style={{ color: 'var(--mute)' }}>{b}</div></motion.div>)}
        </div>
      </div>
    </Section>
  )
}

/* ================= CLOSE ================= */
function Story() {
  const { industry } = useDeck()
  return (
    <Section eyebrow="Everything connected" title={industry.story.title} sub="One employee, one record — every module works from the same data, so nothing is re-keyed or lost." zoom={1.3}>
      <div className="flex items-center justify-center h-full -mt-10"><Flow steps={industry.story.steps} /></div>
    </Section>
  )
}

function Why() {
  const { industry, country, client } = useDeck()
  const reasons = [['⚡', 'Complete in one platform', '27 modules — no patchwork of tools'], ['📍', 'Smart attendance', 'Geofencing, biometric, mobile & approvals'], ['🧩', 'Workflow engine', 'Configurable multi-level approvals everywhere'], ['🌍', 'Locally compliant', `${[...new Set(country.statutory.map(s => s.label))].join(' · ')}, ${country.taxName} — built for ${country.name}`], ['📱', 'Employee-first', 'Web + mobile self-service and AI chat'], ['☁️', 'Cloud scale', 'Multi-tenant on Azure, built to grow']]
  return (
    <Section eyebrow="Why PeopleHub" title={client ? `Built for the way ${client} works` : 'Built for the way HR really works'} sub={industry.subhead}>
      <div className="grid grid-cols-3 gap-6 mt-2">
        {reasons.map(([i, a, b], k) => <motion.div key={a} {...fade(0.12 * k)} className="card p-8"><div className="text-[44px]">{i}</div><div className="font-extrabold text-[28px] mt-2">{a}</div><div className="text-[20px]" style={{ color: 'var(--mute)' }}>{b}</div></motion.div>)}
      </div>
    </Section>
  )
}

function Packages() {
  const pk: { n: 'Starter' | 'Professional' | 'Enterprise'; d: string; sup: string }[] = [
    { n: 'Starter', d: 'Digitise the essentials', sup: 'Business-hours support' },
    { n: 'Professional', d: 'Engage and grow your people', sup: 'Priority ticket queue' },
    { n: 'Enterprise', d: 'Insight, control & scale', sup: 'Dedicated support + SLA' },
  ]
  return (
    <Section eyebrow="Packages" title="Start where you are. Grow as you need." sub="Pick a package, or compose your own à la carte from any module. Priced per user — we’ll tailor a proposal for you.">
      <div className="grid grid-cols-4 gap-4 mt-2 items-stretch">
        <div className="pt-[110px] flex flex-col gap-3">
          {pillars.map(p => <div key={p.id} className="h-[88px] flex flex-col justify-center"><b className="text-[19px]" style={{ color: p.color }}>{p.name}</b><span className="text-[13px]" style={{ color: 'var(--mute)' }}>{modules.filter(m => m.pillar === p.id).length} modules</span></div>)}
        </div>
        {pk.map((p, k) => (
          <motion.div key={p.n} {...fade(0.15 * k)} className="card p-5 flex flex-col gap-3" style={p.n === 'Professional' ? { outline: '2px solid var(--brand2)' } : {}}>
            <div className="h-[86px]"><div className="serif font-bold text-[34px]">{p.n}</div><div className="text-[16px]" style={{ color: 'var(--mute)' }}>{p.d}</div></div>
            {pillars.map(pl => <div key={pl.id} className="h-[88px] grid place-items-center text-[34px]">{pl.packages.includes(p.n) ? <span style={{ color: 'var(--ok)' }}>✓</span> : <span style={{ color: 'var(--line)' }}>—</span>}</div>)}
            <Badge tone="mute">{p.sup}</Badge>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function Implementation() {
  const { client } = useDeck()
  const phases = [['Discover', 'Workshops, process mapping, requirement sign-off'], ['Configure', 'Org, policies, leave, payroll rules & workflows'], ['Migrate', 'Employee data load, validation & parallel run'], ['Train', 'HR admins, managers & employee champions'], ['Go-live', 'Hyper-care with on-site & remote support'], ['Optimise', 'Reviews, new modules, continuous improvement']]
  return (
    <Section eyebrow="Implementation" title={client ? `Live at ${client} in weeks, not months` : 'Live in weeks, not months'} sub="A proven six-phase approach with a dedicated team from kick-off to hyper-care." zoom={1.3}>
      <div className="grid grid-cols-6 gap-4 mt-6">
        {phases.map(([a, b], k) => (
          <motion.div key={a} {...fade(0.15 * k)} className="card p-5 relative" style={{ marginTop: k * 22 }}>
            <div className="serif text-[54px] font-bold grad-text">0{k + 1}</div>
            <div className="font-extrabold text-[24px]">{a}</div><div className="text-[16px] mt-1" style={{ color: 'var(--mute)' }}>{b}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function NextSteps() {
  const { client, industry } = useDeck()
  const steps = [['Discovery workshop', 'Understand your processes and priorities'], ['Tailored demo', `On your ${industry.name.toLowerCase()} processes and policies`], ['Proposal & package', 'Modules, users, timeline and support'], ['Pilot & kick-off', 'Start with a department, scale to all']]
  return (
    <Section eyebrow="Next steps" title={client ? `Let’s build ${poss(client)} people platform together.` : 'Let’s build your people platform together.'} sub="Four simple steps from today’s conversation to a live PeopleHub." zoom={1.3}>
      <div className="grid grid-cols-4 gap-6 mt-8">
        {steps.map(([a, b], k) => <motion.div key={a} {...fade(0.15 * k)} className="card p-8"><div className="serif text-[64px] font-bold grad-text">{k + 1}</div><div className="font-extrabold text-[26px]">{a}</div><div className="text-[19px] mt-1" style={{ color: 'var(--mute)' }}>{b}</div></motion.div>)}
      </div>
    </Section>
  )
}

function Contact() {
  const { country, client, logo, qrUrl, print, industry } = useDeck()
  const c = country.contact
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      {print ? <IndustryArt id={industry.id} className="absolute right-10 bottom-16 w-[620px] opacity-20" /> : <Hero3D className="absolute inset-0 opacity-40" />}
      <div className="relative">
        <motion.div {...fade(0)} className="flex items-center justify-center gap-6 mb-8"><img src="./logo-black.png" alt="PeopleHub" className="h-32 w-32 rounded-full bg-white p-1" />{logo && <><span className="text-[44px]" style={{ color: 'var(--mute)' }}>×</span><img src={logo} alt={client} className="h-32 max-w-[360px] object-contain rounded-2xl bg-white px-5 py-2" /></>}</motion.div>
        <motion.h1 {...fade(0.1)} className="serif text-[96px] font-bold leading-tight">Thank you{client ? `, ${client}` : ''}.</motion.h1>
        <motion.div {...fade(0.25)} className="text-[30px] mt-4 grad-text font-semibold">Transforming human capital through intelligent workforce management</motion.div>
        <div className="flex items-stretch justify-center gap-8 mt-10">
          <motion.div {...fade(0.4)} className="card px-12 py-7 text-[24px] leading-loose flex flex-col justify-center">
            <b>{c.company}</b><span>✉ {c.email}</span><span>☎ {c.phone}</span><span>🌐 {c.web}</span>
          </motion.div>
          {qrUrl && (
            <motion.div {...fade(0.6)} className="card flex items-center gap-8 px-8 py-5 text-left">
              <QrCode value={qrUrl} size={190} />
              <div><div className="serif text-[34px] font-bold">{client ? `${poss(client)} team page` : 'Team page'}</div><div className="text-[19px] mt-1" style={{ color: 'var(--mute)' }}>Scan to open the personalised<br />PeopleHub overview on your phone.</div></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================= DECK ================= */
const modSlides = (): SlideDef[] =>
  modules.map(m => ({
    id: m.id, section: pillars.find(p => p.id === m.pillar)!.name, title: m.name, notes: m.notes, secs: 60, tier: ['employee', 'attendance', 'payroll', 'ess'].includes(m.id) ? 2 : 1,
    render: () => <ModuleSlide mod={m} demo={demos[m.id]()} />,
  }))

export function buildSlides(): SlideDef[] {
  const s = (id: string, section: string, title: string, notes: string, C: () => ReactNode): SlideDef => ({ id, section, title, notes, secs: 45, tier: 1, render: () => <C /> })
  const mods = modSlides()
  const part = (pillar: string) => mods.filter(x => modules.find(m => m.id === x.id)!.pillar === pillar)
  const all: SlideDef[] = [
    s('open', 'Open', 'Welcome', 'Greet, thank the audience, set the agenda: challenge → platform → modules → IT view → packages → next steps. Personalise using the client name.', Opener),
    s('challenge', 'Open', 'The challenge', 'Ask the room which of these hurts most. Capture answers — you will come back to them at each module.', Challenge),
    s('beforeafter', 'Open', 'Before & after', 'Walk down the day: left is today, right is with PeopleHub. Ask which row hurts most. The weekly-hours figure is illustrative (assumes ~4 admin hours a day per HR person).', BeforeAfter),
    s('constellation', 'Open', 'One platform', 'Pulsing items are the modules most relevant for this industry. Say you will focus there but cover everything.', Constellation),
    s('glance', 'Open', 'At a glance', 'Keep short for HR/C-level; IT Manager deep-dive follows later.', Glance),
    ...part('core'), ...part('ops'), ...part('talent'), ...part('exp'), ...part('intel'),
    s('it-arch', 'IT Deep-Dive', 'Architecture', 'For the IT Manager: layered architecture. Invite questions on stack, hosting and DR. Confirm the PostgreSQL / Azure Storage positioning before presenting.', Architecture),
    s('it-tenancy', 'IT Deep-Dive', 'Tenancy & deployment', 'SaaS vs deploy-into-your-Azure. Ask about their cloud policy.', Tenancy),
    s('it-sec', 'IT Deep-Dive', 'Security', 'Capabilities only; do not claim certifications unless confirmed. Offer a security questionnaire response under NDA.', ItSecurity),
    s('it-int', 'IT Deep-Dive', 'Integration & APIs', 'Ask which ERP, biometric devices and BI tools they run.', ItIntegration),
    s('story', 'Close', 'Connected journey', 'Walk through the journey and tie it back to modules shown.', Story),
    s('why', 'Close', 'Why PeopleHub', 'Summarise differentiators; link to the pains from slide 2.', Why),
    s('versus', 'Close', 'Why switch', 'Do not bash competitors by name. Frame the comparison as spreadsheets vs patchwork tools vs one connected platform. Partial ticks mean the alternative can do part of it with effort.', Versus),
    s('pains', 'Close', 'Your challenges solved', 'Recap each pain point the client gave us and the modules that solve it. If none were chosen, this shows typical priorities for the industry — ask them to confirm.', PainsSolved),
    s('packages', 'Close', 'Packages', 'No prices on the slide. Recommend a package based on the discussion; mention à la carte option.', Packages),
    s('implementation', 'Close', 'Implementation', 'Typical timeline depends on scope and data quality — avoid committing dates until after discovery.', Implementation),
    s('roi', 'Close', 'Value estimator', 'Use their headcount live. Figures are indicative.', Roi),
    s('next', 'Close', 'Next steps', 'Agree the date for the discovery workshop before leaving the room.', NextSteps),
    s('contact', 'Close', 'Thank you', 'Thank them; leave this slide up during Q&A.', Contact),
  ]
  // [seconds, tier] — tier 3 slides are always kept when an agenda shortens the deck
  const meta: Record<string, [number, number]> = {
    open: [30, 3], challenge: [60, 3], beforeafter: [60, 2], constellation: [45, 3], glance: [30, 1],
    'it-arch': [60, 0], 'it-tenancy': [45, 0], 'it-sec': [45, 0], 'it-int': [45, 0],
    story: [45, 2], why: [45, 2], versus: [60, 2], pains: [45, 3], packages: [60, 3], implementation: [45, 2], roi: [60, 2], next: [30, 3], contact: [20, 3],
  }
  return all.map(sl => (meta[sl.id] ? { ...sl, secs: meta[sl.id][0], tier: meta[sl.id][1] } : sl))
}

export { money }
