export interface StatutoryLine { label: string; rate: number; who: 'employee' | 'employer' }

export interface CountryProfile {
  id: string
  name: string
  currency: string
  locale: string
  statutory: StatutoryLine[]
  taxName: string
  taxSample: number            // sample monthly income-tax amount for the payslip mock (0 = none shown)
  salary: number               // sample monthly gross salary
  loan: number                 // sample staff loan principal
  settlement: number           // sample final settlement
  leaveTypes: [string, number, number][]   // name, balance, entitlement
  complianceReports: string[]
  holidaysLabel: string
  sampleNames: string[]
  phoneExample: string
  contact: { company: string; email: string; phone: string; web: string }
  channels: string[]
  mapCenter: string
}

export interface IndustryProfile {
  id: string
  name: string
  headline: string
  subhead: string
  pains: { stat: string; label: string }[]
  departments: string[]
  roles: string[]
  shifts: string[]
  focusModules: string[]
  story: { title: string; steps: string[] }
  kpis: { label: string; value: number; suffix: string }[]
  // ---- module-level sample data
  site: string                                   // attendance geofence name
  assets: [string, string][]                     // emoji, name
  courses: [string, number][]                    // name, % complete
  tickets: [string, string, string, number][]    // queue, title, priority, SLA %
  kb: { query: string; results: [string, string, string][] }
  survey: [string, number][]
  tasks: { todo: string[]; doing: string[]; done: string[] }
  benefits: [string, string, string, boolean][]  // emoji, name, detail, enrolled
  goals: [string, number][]
  quiz: { q: string; options: string[] }         // first option is correct
  grievance: string
  allowance: string                              // payroll allowance line
  extraReports: string[]
  dash: { headcount: number; attrition: number; absent: number; open: number; deptCounts: number[]; mix: [number, number, number] }
  chatTip: string
  useCases: Record<string, string>               // module id → industry-specific callout
}
