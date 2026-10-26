import type { CountryProfile, IndustryProfile } from '../profiles/types'

/**
 * The real fields of each Employee Master section — labels taken from the product's own forms
 * (Frontend → modules/EmployeeMasterModule). Values are fictional demo data.
 * t text · s select · d date · n number · a notes · f file upload · y yes/no · p password · c checkbox
 */
export type FType = 't' | 's' | 'd' | 'n' | 'a' | 'f' | 'y' | 'p' | 'c'
export type Field = [label: string, type: FType, value: string]
export interface Group { title?: string; fields: Field[] }

export interface Sample {
  country: CountryProfile; industry: IndustryProfile; company: string
  name: string; first: string; last: string; mail: string; boss: string; mgr: string
}

const doc = 'document.pdf'

export function fieldsFor(id: string, x: Sample): Group[] {
  const { country: c, industry: ind, name, first, last, mail, boss, mgr } = x
  const role = ind.roles[1], dept = ind.departments[1], unit = ind.departments[2] ?? dept
  const cur = c.currency
  const G: Record<string, Group[]> = {
    basic: [
      { title: 'Personal information', fields: [['First Name', 't', first[0].toUpperCase() + first.slice(1)], ['Middle Name', 't', 'Nadeesha'], ['Last Name', 't', last[0].toUpperCase() + last.slice(1)], ['Preferred Name / Nickname', 't', first[0].toUpperCase() + first.slice(1, 4)], ['Employee Number', 't', 'EMP-00421']] },
      { title: 'Demographics', fields: [['Gender', 's', 'Female'], ['Date of Birth', 'd', '14 Mar 1991'], ['Nationality', 's', c.name], ['Ethnicity', 's', 'Prefer not to say'], ['Marital Status', 's', 'Married']] },
      { title: 'Photo, ID & remarks', fields: [['Document Type', 's', 'National ID'], ['Upload Files', 'f', 'id-front.jpg'], ['Remarks', 'a', 'Profile photo uploaded and verified.']] },
    ],
    employment: [{ fields: [['Job Role', 's', role], ['Unit', 's', unit], ['Employee Category', 's', 'Staff'], ['Employee Grade / Level', 's', 'Grade 5'], ['Employment Type', 's', 'Permanent'], ['Work Type', 's', 'Full time'], ['Employment Category', 's', 'Executive'], ['Employment Sub Category', 's', 'Confirmed'], ['Hired Date', 'd', '03 Jan 2021'], ['Work Location / Office', 's', c.mapCenter], ['Employment Status', 's', 'Active'], ['Remarks', 'a', 'Joined through the campus programme.']] }],
    supervisors: [{ fields: [['1. Direct / Immediate Supervisor', 's', boss], ['2. Second-Level Supervisor / Next-Level Manager', 's', mgr], ['3. Department Head', 's', c.sampleNames[3]], ['4. Executive / Ultimate Reporting Officer', 's', c.sampleNames[0]], ['Remarks', 'a', 'Dotted line to the regional manager.']] }],
    contact: [
      { title: 'Address', fields: [['Address', 't', `12, Main Street, ${c.mapCenter}`], ['Country', 's', c.name], ['Province / State', 's', 'Western'], ['District', 's', c.mapCenter], ['City', 't', c.mapCenter], ['ZIP / Postal Code', 't', '00300'], ['Same as current address', 'c', 'Yes']] },
      { title: 'Email, phone & emergency contact', fields: [['Official Email', 't', mail], ['Personal Email', 't', `${first}${last}@mail.com`], ['Phone number', 't', c.phoneExample], ['Name', 't', mgr], ['Relationship', 's', 'Spouse'], ['Email', 't', `${mgr.split(' ')[0].toLowerCase()}@mail.com`]] },
      { title: 'Social media', fields: [['Social Media Platform', 's', 'LinkedIn'], ['Link or Username', 't', `linkedin.com/in/${first}-${last}`]] },
    ],
    'user-account': [{ fields: [['Username', 't', `${first}.${last}`], ['Password', 'p', '••••••••••'], ['Re-Enter Password', 'p', '••••••••••'], ['Access Type', 's', 'Mobile & Portal Both'], ['User Role', 's', 'Employee']] }],
    documents: [{ fields: [['Document Type', 's', 'Appointment Letter'], ['Document Name', 't', 'Appointment letter 2021'], ['Who Can View This Document', 's', 'HR only'], ['Upload Files', 'f', doc], ['Remarks', 'a', 'Signed copy received on day one.']] }],
    attendance: [{ fields: [['Attendance ID', 't', '00421'], ['Remarks', 'a', 'Biometric enrolled on the head-office device.']] }],
    'work-history': [
      { title: 'Role changes inside the company', fields: [['Previous Role', 's', ind.roles[0]], ['New Role', 's', role], ['Type of Change', 's', 'Promotion'], ['Previous Unit', 's', dept], ['New Unit', 's', unit], ['From Date', 'd', '01 Jul 2023'], ['To Date', 'd', 'Present'], ['Document', 'f', 'promotion-letter.pdf'], ['Remarks', 'a', 'Promoted after annual review.']] },
      { title: 'Previous employment', fields: [['Company Name', 't', 'Previous Employer (Pvt) Ltd'], ['Role', 't', 'Trainee Executive'], ['Start Date', 'd', 'Jun 2017'], ['End Date', 'd', 'Dec 2020'], ['Duration', 't', '3 yrs 6 mths']] },
    ],
    qualifications: [{ fields: [['Qualification Type', 's', "Bachelor's degree"], ['Field of Study', 't', 'Business Management'], ['Speciality', 't', 'Human Resources'], ['Start Date', 'd', 'Jan 2012'], ['End Date', 'd', 'Dec 2015'], ['Status', 's', 'Completed'], ['Is Highest Qualification', 'c', 'Yes'], ['Proof of Qualification', 'f', 'degree-certificate.pdf'], ['Remarks', 'a', 'First-class honours.']] }],
    certifications: [{ fields: [['Type', 's', 'Professional certification'], ['Certification / License Name', 't', 'Certified Payroll Practitioner'], ['Holder Name', 't', name], ['Certification / License Identification No', 't', 'CPP-88421'], ['Issuing Authority', 't', 'Professional Institute'], ['Status', 's', 'Active'], ['Issue Date', 'd', '10 Dec 2022'], ['Expiration Date', 'd', '10 Dec 2027'], ['Supporting Document', 'f', 'certificate.pdf'], ['Remarks', 'a', 'Renewal reminder set 90 days before expiry.']] }],
    skills: [{ fields: [['Skill / Competency Category', 's', 'Technical'], ['Skill / Competency Name', 't', 'Data analysis'], ['Level', 's', 'Advanced'], ['Years of Experience', 'n', '6'], ['Application Context', 't', 'Monthly workforce reporting'], ['Remarks', 'a', 'Mentors the new joiners.']] }],
    languages: [{ fields: [['Language', 's', 'English'], ['Proficiency Level', 's', 'Fluent'], ['Remarks', 'a', 'Business-level written and spoken.']] }],
    visa: [{ fields: [['Visa Type', 's', 'Not required (citizen)'], ['Visa Number', 't', '—'], ['Issuing Country', 's', c.name], ['Sponsoring Employer (if applicable)', 't', '—'], ['Issue Date', 'd', '—'], ['Expiry Date', 'd', '—'], ['Visa Status', 's', 'N/A'], ['Renewal Status', 's', 'N/A'], ['Work Authorization Status', 's', 'Authorised'], ['Visa Document', 'f', 'passport-copy.pdf'], ['Remarks', 'a', 'Auto-alerts fire 90 days before any expiry.']] }],
    background: [{ fields: [['Background Check Type', 's', 'Police clearance'], ['Background Check Provider', 't', 'Verification Partner'], ['Status', 's', 'Cleared'], ['Date of Completion', 'd', '12 Dec 2020'], ['Verification Notes', 'a', 'No adverse findings.'], ['Supporting Documents', 'f', 'clearance.pdf'], ['Remarks', 'a', '—']] }],
    agreements: [{ fields: [['Agreement Type', 's', 'Employment contract'], ['Agreement Status', 's', 'Signed'], ['Agreement Date', 'd', '03 Jan 2021'], ['Expiry Date (if applicable)', 'd', 'Not applicable'], ['Agreement Document', 'f', 'contract-signed.pdf'], ['Remarks', 'a', 'Includes the NDA schedule.']] }],
    disciplinary: [{ fields: [['Incident Date', 'd', '—'], ['Incident', 'a', 'No incident on record.'], ['Type of Violation', 's', '—'], ['Reporter Name', 't', '—'], ['Investigation Status', 's', 'Not applicable'], ['Investigator Name', 't', '—'], ['Action Taken', 's', '—'], ['Final Resolution Date', 'd', '—'], ['Supporting Documents', 'f', '—'], ['Remarks', 'a', 'Visible to HR only.']] }],
    policy: [{ fields: [['Policy Name', 's', 'Code of Conduct'], ['Version Number', 't', 'v3.1'], ['Acknowledgement Date', 'd', '03 Jan 2021'], ['Expiry / Renewal Date', 'd', '03 Jan 2026'], ['Acknowledgement Status', 's', 'Acknowledged'], ['Signed Policy Document', 'f', 'signed-policy.pdf'], ['Remarks', 'a', 'Annual re-acknowledgement due.']] }],
    privacy: [{ fields: [['Data Privacy Act', 's', `${c.name} Data Protection`], ['Consent for Data Processing', 'y', 'Yes'], ['Data Sharing Preferences', 's', 'Share with HR and payroll only'], ['Legal Basis for Processing', 's', 'Employment contract'], ['Right to Be Forgotten Requests', 's', 'None'], ['Request Date', 'd', '—'], ['Status', 's', 'Active'], ['Retention Period (Active Employment)', 't', 'Duration of employment'], ['Retention Period (After Termination)', 't', '7 years'], ['Remarks', 'a', 'Consent recorded with timestamp.']] }],
    hobbies: [{ fields: [['Hobby / Interest Category', 's', 'Sports'], ['Hobby / Interest', 't', 'Cricket'], ['Participation Level', 's', 'Regular'], ['Frequency of Participation', 's', 'Weekly'], ['Preferred Group Activities', 't', 'Team sports, outings'], ['Company-Sponsored Clubs / Groups / Societies Joined', 't', 'Company sports club'], ['Society Name', 't', 'Sports Club'], ['Remarks', 'a', '—']] }],
    engagements: [{ fields: [['Program Name', 't', 'Community clean-up drive'], ['Cause Supported', 's', 'Environment'], ['Date of Participation', 'd', '22 Apr 2024'], ['Number of Volunteer Hours', 'n', '8'], ['Role in the Activity', 't', 'Team lead'], ['Feedback / Impact Statement', 'a', 'Organised 40 volunteers.'], ['Supporting Documents / Photos', 'f', 'photos.zip'], ['Remarks', 'a', '—']] }],
    recognition: [{ fields: [['Award Name', 't', 'Employee of the Quarter'], ['Award Type', 's', 'Performance'], ['Award Date', 'd', '30 Jun 2024'], ['Reason for Recognition', 'a', 'Led the payroll automation rollout.'], ['Nominated By', 't', boss], ['Recognition Level', 's', 'Company-wide'], ['Incentives Attached', 't', `${cur} 25,000 voucher`], ['Supporting Documents', 'f', 'award-letter.pdf'], ['Remarks', 'a', '—']] }],
    medical: [
      { title: 'Health information', fields: [['Blood Group', 's', 'O+'], ['Special Medical Conditions', 'a', 'None recorded'], ['Health Report', 'f', 'annual-checkup.pdf'], ['Name', 't', 'Annual health check'], ['Date', 'd', '15 Feb 2024'], ['Result', 's', 'Normal'], ['Next Check Date', 'd', '15 Feb 2025'], ['Description', 'a', 'Routine company health check.']] },
      { title: 'Insurance & claims', fields: [['Provider Name', 't', 'Group Insurance Provider'], ['Policy Number', 't', 'GM-884201'], ['Coverage Type', 's', 'Family medical'], ['Premium Amount', 'n', `${cur} 4,800`], ['Start Date', 'd', '01 Jan 2024'], ['Expiry Date', 'd', '31 Dec 2024'], ['Dependants Covered', 'n', '3'], ['Policy Document', 'f', 'policy.pdf'], ['Amount', 'n', `${cur} 12,500`], ['Claim Document', 'f', 'claim-form.pdf']] },
    ],
    additional: [{ fields: [['Field Label', 't', 'Transport route'], ['Field Type', 's', 'Dropdown'], ['Dropdown Options', 't', 'R10, R12, R14'], ['Default Value', 't', 'R12'], ['Required', 'c', 'No'], ['Remarks', 'a', 'Custom fields are created by HR — no developer needed.']] }],
    'attendance-locations': [{ fields: [['Search master locations', 't', 'Head office'], ['Effective From', 'd', '03 Jan 2021'], ['Effective To', 'd', 'Open-ended']] }],
    exit: [{ fields: [['Resignation / Termination Date', 'd', '—'], ['Reason for Exit', 's', '—'], ['Rehire Eligibility', 's', 'Eligible'], ['Final Settlement Details', 'a', 'Calculated by payroll on exit.'], ['Exit Interview Notes', 'a', '—'], ['Remarks', 'a', '—']] }],
    payroll: [
      { title: 'Payroll & tax', fields: [['Payroll Country', 's', c.name], ['Currency', 's', cur], ['Payroll Frequency', 's', 'Monthly'], ['Payment Method', 's', 'Bank transfer'], ['Tax Country', 's', c.name], ['Tax Residency Status', 's', 'Resident'], ['Tax Identification Number (TIN)', 't', '104 882 417'], ['TIN Name', 't', c.taxName], ['Provident Fund Number', 't', 'PF-221904'], ['Provident Fund Name', 't', c.statutory[0]?.label ?? 'PF']] },
      { title: 'Bank account', fields: [['Bank Name', 's', 'National Bank'], ['Bank Code', 't', '7010'], ['Branch Name', 't', c.mapCenter], ['Branch Code', 't', '001'], ['Account Name', 't', name], ['Account Number', 't', '•••• •••• 7731'], ['SWIFT Code', 't', 'NBANLKLX'], ['IBAN (International)', 't', '—'], ['Set as default account', 'c', 'Yes'], ['Status', 's', 'Active'], ['Remarks', 'a', 'Verified by Finance.']] },
    ],
  }
  return G[id] ?? []
}
