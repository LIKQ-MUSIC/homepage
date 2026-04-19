export interface AuditionFormData {
  // Personal Information
  fullName: string
  nickname: string
  dateOfBirth: string
  email: string
  phone: string
  socialMedia: string
  portfolioLink: string

  // Attitude & Mindset Questions
  idolMeaning: string
  creativeProject: string
  handleCriticism: string
  oneYearVision: string

  // Section A: The Demo
  demoAnalysis: string

  // Section B: The Commercial Beat
  commercialResponse: string
}

export interface AuditionFormState {
  data: AuditionFormData
  lastSaved: string | null
  currentStep: number
}

export const STORAGE_KEY = 'likq-audition-draft'

export const INITIAL_FORM_DATA: AuditionFormData = {
  fullName: '',
  nickname: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  socialMedia: '',
  portfolioLink: '',
  idolMeaning: '',
  creativeProject: '',
  handleCriticism: '',
  oneYearVision: '',
  demoAnalysis: '',
  commercialResponse: '',
}

export const STEPS = [
  { id: 1, label: 'Personal Info', labelTh: 'ข้อมูลส่วนตัว' },
  { id: 2, label: 'Your Mindset', labelTh: 'ทัศนคติของคุณ' },
  { id: 3, label: 'Audio Assignments', labelTh: 'โจทย์เสียงเพลง' },
  { id: 4, label: 'Review & Submit', labelTh: 'ตรวจสอบและส่ง' },
] as const
