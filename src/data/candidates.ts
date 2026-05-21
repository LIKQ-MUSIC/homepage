export type CandidateTheme = 'pink' | 'mint' | 'yellow'

export type Candidate = {
  slug: string
  nickname: string
  fullName: string
  referenceNumber: string
  theme: CandidateTheme
  /** Path under /public. If missing, profile renders the placeholder block. */
  image?: string
  /** One-line hook on the landing card. */
  tagline: string
  /** Curator note — why they were picked. Shows on profile hero. */
  curatorNote: string
  /** Standout traits — 2 to 4 short bullet labels for the landing card. */
  traits: string[]
  idolMeaning: string
  creativeProject: string
  oneYearVision: string
  demoAnalysis: string
  /** The single pressure-test answer we want to highlight. */
  highlight: {
    question: string
    answer: string
  }
}

export const CANDIDATES: Candidate[] = [
  {
    slug: 'moji',
    nickname: 'โมจิ',
    fullName: 'จันทิมา จิตรนุ่ม',
    referenceNumber: 'LIKQ-5306A44B',
    theme: 'pink',
    tagline: 'จากเด็กที่เคยถูกมองข้าม จะส่องประกายเป็นดาวที่เจิดจ้า',
    curatorNote:
      'Resilience ที่จริงและจับต้องได้ ผ่านการ reject จากหลายค่ายแล้วเอาความเจ็บมาเขียนเป็นเนื้อเพลงของตัวเอง',
    traits: ['Resilient', 'Storyteller', 'Team-first'],
    idolMeaning:
      'การเป็นไอดอลคือคนธรรมดาคนหนึ่ง แต่เป็นคนที่มีความฝัน และใช้การกระทำมากกว่าคำพูด',
    creativeProject:
      'ตอน ม.5 ขอผู้อำนวยการเปิดชมรมเอง พอเปิดห้องฉายหนังสั้นวันนั้น คนวิ่งเข้ามาเต็มห้อง โมเม้นที่ไม่เคยมีมาก่อน',
    oneYearVision:
      'อยากรู้คีย์ของตัวเองในการร้องเพลง เต้นได้ดีขึ้น มีสไตล์ที่ลงตัว แนวเพลงน่ารักแต่มีความเท่ — ทุกคนในวงมีคาแรกเตอร์ของตัวเองชัด',
    demoAnalysis:
      'บีทน่าฟัง อยากต่อยอดให้มีท่อนแร็ป ท่าเต้นน่ารักแต่แอบเซ็กซี่เบาๆ มีความเท่เล็กน้อย',
    highlight: {
      question: 'ถ้าเสียงหาย 4 ชั่วโมงก่อนคอนเสิร์ตใหญ่',
      answer:
        'ยอมลิปซิงค์ค่ะ มันเสียใจมากนะที่ร้องไม่ได้ในงานแรก แต่ในคอนเสิร์ตไม่ได้มีแค่การร้อง มีทั้งเต้นและการแสดงที่ทั้งทีมเตรียมมา ไม่อยากให้งานพังเพราะคนคนเดียว',
    },
  },
  {
    slug: 'muk',
    nickname: 'มุก',
    fullName: 'วาสิตา ทองผล',
    referenceNumber: 'LIKQ-1D80DF1C',
    theme: 'mint',
    tagline: 'แฟนคลับคือกลุ่มลูกค้า คำวิจารณ์คือ market feedback',
    curatorNote:
      'Growth mindset + business sense ที่หาไม่เจอในไอดอลทั่วไป มองทุกอย่างเป็นข้อมูลเพื่อพัฒนา',
    traits: ['Growth Mindset', 'Strategic', 'Self-Aware'],
    idolMeaning:
      'การเป็นศิลปินที่สร้างสรรค์ผลงานเพลง แชร์มายด์เซ็ตที่เป็นแรงในการใช้ชีวิตให้กับแฟนคลับ',
    creativeProject:
      'เข้าประกวด อะคาเดมี่ แฟนเชียร์ — ทั้งที่ทุกคนเคยบอกว่าร้องเพลงไม่เพราะ การได้ใช้เวลาฝึก 30 วินาทีให้กรรมการชม ภูมิใจที่เอาชนะใจตัวเองได้',
    oneYearVision:
      'มีผู้ติดตามระดับหนึ่ง มีคัฟเวอร์เพลงในช่องของตัวเอง อยากหยิบเพลงเก่าเก่ามาเล่าใหม่ เพราะคนปัจจุบันลืมเพลงพวกนั้นไปแล้ว',
    demoAnalysis:
      'แนวสาวน้อยน่ารัก ฟังเรื่อยๆ "บริการหลังการขาย" เป็นคีย์เวิร์ดที่สะดุดหู ถ้าต่อยอดน่าจะเพิ่มความเร็ว เพิ่มความร่าเริง และเน้นน้ำเสียงบางคำ',
    highlight: {
      question: 'ถ้ามีค่ายใหญ่กว่ายื่นข้อเสนอ Solo ให้',
      answer:
        'การย้ายค่ายเหมือนการย้ายบริษัท จะไม่ตัดสินใจแค่เพราะเป็นค่ายใหญ่หรือเป็นโซโล มันคือการเปลี่ยนรูปแบบงานเพื่อพัฒนาศักยภาพในแบบใหม่ ขึ้นกับการตัดสินใจในอนาคต',
    },
  },
  {
    slug: 'satang',
    nickname: 'สตางค์',
    fullName: 'ญดา หงษ์ประภาส',
    referenceNumber: 'LIKQ-382BDE50',
    theme: 'yellow',
    tagline: 'Introvert ที่เลือกก้าวข้าม comfort zone — ด้วยเหตุผลทุกครั้ง',
    curatorNote:
      'Vocabulary ของผู้ใหญ่ คิดเป็นระบบ และมี nuance สูงทุกคำตอบ — ไม่ตอบ binary',
    traits: ['Nuanced', 'Professional', 'Loyal'],
    idolMeaning:
      'วงการไอดอลให้แรงบันดาลใจหลายอย่าง การเป็นศิลปินที่มีคนรัก มาพร้อมความรับผิดชอบทั้งการทำผลงาน การวางตัว และการพัฒนาตัวเองตลอด',
    creativeProject:
      'สมัย ม.ปลาย เคยไปเต้นโคฟเวอร์ busking ที่ฮงแด ทั้งที่เป็น introvert มาก เป็นการก้าวข้าม comfort zone ครั้งใหญ่ที่ปลดล็อคตัวเอง',
    oneYearVision:
      'อยากเป็นเวอร์ชันที่เก่งและมั่นใจกว่านี้ ทั้ง performance การเต้น และเสียงร้อง อยากเป็นเมมเบอร์ที่คนพึ่งพาได้ มีพลังดีๆ ให้ทีม',
    demoAnalysis:
      'mood ของเพลงชัด ฟังง่าย มี element ที่ทำให้ไม่น่าเบื่อ ถ้าต่อยอดอยากเพิ่มท่อนที่เป็นจุดจำของเพลงให้ชัดขึ้น เพื่อให้คนฟังมี moment ที่ติดหัว',
    highlight: {
      question: 'ถ้ามีค่ายใหญ่กว่ายื่นข้อเสนอ Solo ให้',
      answer:
        'มันไม่ใช่แค่เรื่องงาน แต่คือคนที่ผ่านอะไรด้วยกันมา ในหัวตอนนั้นคงสับสนมาก เพราะโอกาสแบบนี้ไม่ได้เข้ามาบ่อย แต่ถ้าการเติบโตของเราทำร้ายความรู้สึกคนที่อยู่ด้วยกันมาตั้งแต่ Day 0 ก็คงไม่ได้รู้สึกดี',
    },
  },
]

export function getCandidateBySlug(slug: string): Candidate | undefined {
  return CANDIDATES.find((c) => c.slug === slug)
}

export const THEME_STYLES: Record<
  CandidateTheme,
  {
    bg: string
    badgeBg: string
    accentText: string
    border: string
    shadow: string
  }
> = {
  pink: {
    bg: 'bg-y2k-pink',
    badgeBg: 'bg-y2k-pink',
    accentText: 'text-y2k-pink',
    border: 'border-y2k-pink',
    shadow: '6px 6px 0 0 #FF3AA5',
  },
  mint: {
    bg: 'bg-y2k-mint',
    badgeBg: 'bg-y2k-mint',
    accentText: 'text-y2k-mint',
    border: 'border-y2k-mint',
    shadow: '6px 6px 0 0 #2DE8C3',
  },
  yellow: {
    bg: 'bg-y2k-yellow',
    badgeBg: 'bg-y2k-yellow',
    accentText: 'text-y2k-yellow',
    border: 'border-y2k-yellow',
    shadow: '6px 6px 0 0 #FFE14C',
  },
}
