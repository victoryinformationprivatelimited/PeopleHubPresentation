import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDeck } from '../engine/context'
import { Avatar, Badge, Window } from '../ui/primitives'

/** The tabs of the real Employee Master screen, in the same order as the product's profile sidebar. */
export const MASTER_TABS: { id: string; label: string }[] = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'employment', label: 'Employment Details' },
  { id: 'supervisors', label: 'Supervisors & Reporting' },
  { id: 'contact', label: 'Contact Information' },
  { id: 'user-account', label: 'User Account' },
  { id: 'documents', label: 'Documents' },
  { id: 'attendance', label: 'Attendance Information' },
  { id: 'work-history', label: 'Employment History' },
  { id: 'qualifications', label: 'Qualifications' },
  { id: 'certifications', label: 'Certifications & Licenses' },
  { id: 'skills', label: 'Special Skills' },
  { id: 'languages', label: 'Languages' },
  { id: 'visa', label: 'Work Visa & Permits' },
  { id: 'background', label: 'Background Checks' },
  { id: 'agreements', label: 'Agreements & Contracts' },
  { id: 'disciplinary', label: 'Disciplinary Actions' },
  { id: 'policy', label: 'Policy Acknowledgements' },
  { id: 'privacy', label: 'Data Privacy Preferences' },
  { id: 'hobbies', label: 'Hobbies & Interests' },
  { id: 'engagements', label: 'Engagements' },
  { id: 'recognition', label: 'Recognition & Awards' },
  { id: 'medical', label: 'Medical & Insurance Details' },
  { id: 'additional', label: 'Additional Details' },
  { id: 'attendance-locations', label: 'Attendance Locations' },
  { id: 'exit', label: 'Exit Information' },
  { id: 'payroll', label: 'Employee Accounts & Payroll' },
]

type Rows = [string, string][]

export function EmployeeMasterDemo({ auto = true }: { auto?: boolean }) {
  const { country, industry, company } = useDeck()
  const [active, setActive] = useState(0)
  const [touched, setTouched] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const name = country.sampleNames[1]
  const [first, last] = name.toLowerCase().split(' ')
  const co = company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'
  const role = industry.roles[1]
  const dept = industry.departments[1]
  const boss = country.sampleNames[0]
  const mgr = country.sampleNames[2]

  useEffect(() => {
    if (!auto || touched) return
    const t = setInterval(() => setActive(a => (a + 1) % MASTER_TABS.length), 2600)
    return () => clearInterval(t)
  }, [auto, touched])

  // keep the active tab visible inside the scrolling sidebar
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined
    const box = listRef.current
    if (el && box) box.scrollTo({ top: Math.max(0, el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2), behavior: 'smooth' })
  }, [active])

  const content: Record<string, Rows> = {
    basic: [['Full name', name], ['Date of birth', '14 Mar 1991'], ['Gender', 'Female'], ['Marital status', 'Married'], ['Nationality', country.name], ['Blood group', 'O+'], ['National ID', '•••• •••• 421 (encrypted)']],
    employment: [['Employee number', 'EMP-00421'], ['Job role', role], ['Department', dept], ['Employment type', 'Permanent'], ['Date joined', '03 Jan 2021'], ['Confirmation', 'Confirmed · 03 Jul 2021'], ['Status', 'Active']],
    supervisors: [['Reports to', boss], ['Second-level', mgr], ['Leave approver', boss], ['Attendance approver', boss], ['Direct reports', '4 employees']],
    contact: [['Work email', `${first}.${last}@${co}.com`], ['Mobile', country.phoneExample], ['Personal email', `${first}${last}@mail.com`], ['Permanent address', `12, Main Street, ${country.name}`], ['Emergency contact', `${mgr} · Spouse`]],
    'user-account': [['Username', `${first}.${last}`], ['Portal access', 'Web + mobile app'], ['Role', 'Employee'], ['Last sign-in', 'Today, 08:42'], ['Two-step sign-in', 'Enabled']],
    documents: [['NIC / ID copy', 'Uploaded · verified'], ['Appointment letter', 'Uploaded'], ['Birth certificate', 'Uploaded'], ['Police report', 'Expires in 41 days'], ['Storage', 'Encrypted cloud storage']],
    attendance: [['Shift', 'General · 08:30–17:30'], ['Attendance method', 'Mobile + geofence'], ['Biometric ID', '00421'], ['Overtime eligible', 'Yes'], ['Weekly off', 'Sat, Sun']],
    'work-history': [['Current', `${role} · ${company}`], ['Previous', `Executive · ${industry.departments[2]}`], ['Earlier', 'Trainee · 2017–2019'], ['Total experience', '9 yrs 4 mths']],
    qualifications: [['Degree', 'BSc (Hons) Business Management'], ['Institute', 'University of Colombo'], ['Year', '2016'], ['Professional', 'Diploma in HR Management']],
    certifications: [['Certification', 'Certified Payroll Practitioner'], ['Issued by', 'Professional body'], ['Valid until', 'Dec 2027'], ['Reminder', '90 days before expiry']],
    skills: [['Primary', 'Negotiation, analytics'], ['Tools', 'Excel, Power BI'], ['Interests', 'Mentoring'], ['Skill level', 'Advanced']],
    languages: [['Language 1', 'English · Fluent'], ['Language 2', 'Local language · Native'], ['Language 3', 'Basic']],
    visa: [['Permit type', 'Not required'], ['Passport no.', '•••• 4412'], ['Passport expiry', '2031'], ['Alerts', 'Auto-reminders on expiry']],
    background: [['Police clearance', 'Cleared'], ['Employment reference', 'Verified'], ['Education check', 'Verified'], ['Checked on', '12 Dec 2020']],
    agreements: [['Employment contract', 'Signed · 03 Jan 2021'], ['NDA', 'Signed'], ['Probation letter', 'Signed'], ['Renewal', 'Not applicable (permanent)']],
    disciplinary: [['Open cases', 'None'], ['Warnings (last 3 yrs)', '0'], ['Commendations', '2'], ['Visibility', 'HR only']],
    policy: [['Code of conduct', 'Acknowledged · 03 Jan 2021'], ['IT & data policy', 'Acknowledged'], ['Leave policy v3', 'Pending acknowledgement'], ['Compliance', '94%']],
    privacy: [['Share directory phone', 'No'], ['Share birthday with team', 'Yes'], ['Marketing messages', 'Opted out'], ['Consent recorded', 'Yes · with timestamp']],
    hobbies: [['Sports', 'Cricket, running'], ['Interests', 'Photography'], ['Clubs', 'Company sports club']],
    engagements: [['Events attended', '6 this year'], ['Volunteer days', '2'], ['Committees', 'Welfare society'], ['Pulse score', '8.4 / 10']],
    recognition: [['Employee of the quarter', 'Q2 · 2024'], ['Service award', '3 years'], ['Peer kudos', '17 received']],
    medical: [['Insurance plan', 'Group medical · family'], ['Policy no.', 'GM-884201'], ['Dependants covered', '3'], ['Allergies', 'None recorded'], ['Medical data', 'Restricted to HR']],
    additional: [['Notes', 'Prefers email communication'], ['Custom field 1', 'Transport route · R12'], ['Custom field 2', 'Locker 214']],
    'attendance-locations': [['Head office', 'Allowed · 150 m radius'], ['Factory / branch', 'Allowed · 200 m radius'], ['Remote punch', 'Not allowed'], ['Check method', 'GPS geofence']],
    exit: [['Status', 'Not resigned'], ['Notice period', '1 month'], ['Exit checklist', 'Created on resignation'], ['Final settlement', 'Auto-calculated by payroll']],
    payroll: [['Basic salary', `${country.currency} 185,000`], ['Bank', 'Primary account · verified'], ['Salary account', '•••• 7731'], ['Statutory', [...new Set(country.statutory.map(s => s.label))].slice(0, 3).join(' · ')], ['Pay group', 'Monthly']],
  }

  const tab = MASTER_TABS[active]
  const rows = content[tab.id] ?? []

  return (
    <Window title={`${company} · Employee Master · ${name}`}>
      <div className="flex gap-5" style={{ height: 600 }}>
        {/* profile sidebar — same tabs as the product */}
        <div className="w-[270px] flex-none flex flex-col card p-3" style={{ background: 'var(--bg)' }}>
          <div className="flex flex-col items-center text-center pb-3">
            <Avatar name={name} size={56} />
            <div className="font-bold mt-2 text-[17px] leading-tight">{name}</div>
            <div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>{role}</div>
            <div className="text-[12px]" style={{ color: 'var(--mute)' }}>EMP-00421</div>
            <div className="mt-1.5"><Badge tone="ok">Active</Badge></div>
          </div>
          <div ref={listRef} className="relative flex-1 min-h-0 overflow-y-auto -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {MASTER_TABS.map((t, k) => (
              <button key={t.id} onClick={() => { setTouched(true); setActive(k) }}
                className="w-full flex items-center gap-2.5 text-left px-2.5 py-[7px] rounded-lg text-[13.5px] transition-colors"
                style={k === active ? { background: 'var(--brand)', color: '#fff', fontWeight: 700 } : { color: 'var(--text)', opacity: 0.82 }}>
                <span className="w-[22px] h-[22px] rounded-md grid place-items-center text-[10.5px] font-bold flex-none"
                  style={{ background: k === active ? 'rgba(255,255,255,.22)' : 'var(--line)' }}>{k + 1}</span>
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* section content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div key={tab.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }} className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[12px] tracking-widest uppercase" style={{ color: 'var(--mute)' }}>Section {active + 1} of {MASTER_TABS.length}</div>
                  <div className="text-[26px] font-bold" style={{ fontFamily: 'var(--serif, inherit)' }}>{tab.label}</div>
                </div>
                <Badge tone="brand">Editable · change history kept</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {rows.map(([k, v], i) => (
                  <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="card px-4 py-3">
                    <div className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>{k}</div>
                    <div className="text-[16.5px] font-semibold mt-0.5">{v}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="text-[12.5px] mt-3" style={{ color: 'var(--mute)' }}>
            {touched ? 'Pick any section on the left' : 'Walking through every section — or pick one on the left'} · sensitive fields encrypted · every edit is audited
          </div>
        </div>
      </div>
    </Window>
  )
}
