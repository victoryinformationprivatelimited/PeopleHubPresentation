import type { CountryProfile } from './types'

const contact = { company: 'Victory Information (Pvt) Ltd', email: 'sales@victoryinformation.lk', phone: '+94 117 110 600', web: 'victoryinformation.lk' }
const channels = ['Email', 'SMS', 'WhatsApp', 'In-App', 'Push']

// NOTE: statutory rates and sample amounts are illustrative for demo purposes — confirm current rates before quoting.
export const countries: Record<string, CountryProfile> = {
  lk: {
    id: 'lk', name: 'Sri Lanka', currency: 'Rs.', locale: 'en-LK',
    statutory: [
      { label: 'EPF', rate: 8, who: 'employee' },
      { label: 'EPF', rate: 12, who: 'employer' },
      { label: 'ETF', rate: 3, who: 'employer' },
    ],
    taxName: 'APIT', taxSample: 4800, salary: 185000, loan: 150000, settlement: 486250,
    leaveTypes: [['Annual', 14, 21], ['Casual', 5, 7], ['Medical', 18, 24]],
    complianceReports: ['EPF C-Form', 'ETF Return', 'APIT Monthly Return', 'Shop & Office Act Registers', 'Annual Leave Register'],
    holidaysLabel: 'Poya & statutory holiday calendar',
    sampleNames: ['Nimal Perera', 'Kavindi Silva', 'Ruwan Fernando', 'Ishara Jayawardena', 'Tharindu Wijesinghe', 'Sanduni Gunasekara', 'Dilshan Rajapaksa', 'Chamari Herath'],
    phoneExample: '+94 77 123 4567',
    contact, channels, mapCenter: 'Colombo',
  },
  in: {
    id: 'in', name: 'India', currency: '₹', locale: 'en-IN',
    statutory: [
      { label: 'PF', rate: 12, who: 'employee' },
      { label: 'PF', rate: 12, who: 'employer' },
      { label: 'ESI', rate: 0.75, who: 'employee' },
    ],
    taxName: 'TDS', taxSample: 4200, salary: 85000, loan: 200000, settlement: 215000,
    leaveTypes: [['Earned', 12, 18], ['Casual', 6, 8], ['Sick', 8, 12]],
    complianceReports: ['PF ECR', 'ESI Return', 'TDS 24Q', 'Professional Tax', 'Form 16'],
    holidaysLabel: 'State & national holiday calendar',
    sampleNames: ['Arjun Mehta', 'Priya Nair', 'Rohan Iyer', 'Ananya Rao', 'Vikram Singh', 'Neha Kulkarni', 'Karthik Menon', 'Divya Sharma'],
    phoneExample: '+91 98765 43210',
    contact, channels, mapCenter: 'Bengaluru',
  },
  ae: {
    id: 'ae', name: 'United Arab Emirates', currency: 'AED', locale: 'en-AE',
    statutory: [
      { label: 'GPSSA (nationals)', rate: 5, who: 'employee' },
      { label: 'GPSSA (nationals)', rate: 12.5, who: 'employer' },
    ],
    taxName: 'WPS', taxSample: 0, salary: 9500, loan: 24000, settlement: 38500,
    leaveTypes: [['Annual', 18, 30], ['Sick', 10, 15], ['Compassionate', 3, 5]],
    complianceReports: ['WPS SIF File', 'End-of-Service Gratuity', 'Emiratisation Report', 'Visa & Labour Card Expiry'],
    holidaysLabel: 'UAE public holiday calendar',
    sampleNames: ['Omar Al Mansoori', 'Fatima Khan', 'Rashid Al Nuaimi', 'Sara Thomas', 'Yusuf Ahmed', 'Layla Hassan', 'Ali Raza', 'Maria Santos'],
    phoneExample: '+971 50 123 4567',
    contact, channels, mapCenter: 'Dubai',
  },
  fj: {
    id: 'fj', name: 'Fiji', currency: 'FJ$', locale: 'en-US',
    statutory: [
      { label: 'FNPF', rate: 8, who: 'employee' },
      { label: 'FNPF', rate: 10, who: 'employer' },
    ],
    taxName: 'PAYE', taxSample: 190, salary: 2800, loan: 6000, settlement: 9800,
    leaveTypes: [['Annual', 7, 10], ['Sick', 8, 10], ['Family / Bereavement', 3, 5]],
    complianceReports: ['FNPF Contribution Return', 'PAYE Monthly Return (FRCS)', 'Employment Relations Act Records', 'Annual Leave Register', 'Work Permit Expiry'],
    holidaysLabel: 'Fiji public holiday calendar',
    sampleNames: ['Josefa Naqova', 'Mereoni Vakacegu', 'Rajesh Prasad', 'Sunita Devi', 'Semisi Tuiloma', 'Anita Lal', 'Ilisapeci Rokotuiviwa', 'Vikash Narayan'],
    phoneExample: '+679 701 2345',
    contact, channels, mapCenter: 'Suva',
  },
}
