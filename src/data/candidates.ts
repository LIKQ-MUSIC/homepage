export type CandidateTheme = 'pink' | 'mint' | 'yellow'

export type Candidate = {
  slug: string
  nickname: string
  fullName: string
  referenceNumber: string
  theme: CandidateTheme
  /** Path under /public. If missing, profile renders the placeholder block. */
  image?: string
  /** YouTube URL or embed URL. If missing, profile renders the video placeholder. */
  danceVideoUrl?: string
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
    slug: 'nuey',
    nickname: 'เนย',
    fullName: 'สิรินทร์ โปร่งศิริวัฒนา',
    referenceNumber: 'LIKQ-786F84AC',
    theme: 'mint',
    tagline: 'ดรัมเมเยอร์ตัวแม่ที่รู้จักตัวเอง เพราะของจริงไม่ต้องการโบว์',
    curatorNote:
      'ความมั่นใจที่ไม่เสแสร้ง รู้ว่าตัวเองดี และรู้ว่าต้องหาคนนอกช่วยประเมินเมื่อต้อง self-check จริงๆ',
    traits: ['Natural Charm', 'Confident', 'Self-Aware'],
    idolMeaning:
      'คือการทำเพลง เต้น ร้อง ทำคอนเสิร์ต ร่วมรายการต่างๆเพื่อให้แฟนคลับที่ชอบเราได้ติดตามชีวิตและรู้สึกเหมือนรู้จักเรา มีเราเป็นเพื่อนค่ะ',
    creativeProject: 'เป็นดรัมเมเยอร์กีฬาสีตอนมัธยม',
    oneYearVision:
      'หากเส้นทางน้ไปรอดจริงๆ ก็คิดว่าคงเหมือนพิมมาวงpixxieค่ะ',
    demoAnalysis:
      'ดนตรีถ้าให้ติดเท่ได้อีกหน่อยก็จะแปลกใหม่ขึ้นค่ะ แต่หนูไม่รู้ว่าจะทำไงนะ5555 อาจจะเป็นการไม่ได้ใช้เสียงเปียโนเลย อาจจะเป็นเครื่องดนตรีอื่นรึป่าว อาจจะมีการฟีดศิลปินชายเป็นเสียงแบบ yeah ah ตรงฮุกอะไรยังงี้ค่ะ หรือท่อนแรปให้มันเท่แบบ เหมือนใส่ชุดสีดำห้อยโซ่ยังงั้นอะ เพราะตอนนี้มันเพลงแบ๊วติดโบว์ค่อนข้างมากแบบหวาน100 รวมๆก็โอเคแล้วค่าา',
    highlight: {
      question:
        'ไลฟ์คอนเสิร์ตคนดู stream หลักแสน คุณลืมเนื้อ bridge เพลง signature คลิปเป็น meme ภายใน 1 ชั่วโมง กลับหอ ปิดไฟ อยากลบทุก social ทิ้ง เขียนมาตรงๆ ว่าในหัวคุณเป็นยังไงคืนนั้น และพรุ่งนี้เช้าคุณจะลุกจากเตียงยังไง?',
      answer:
        'ในหัวคงอยากมุดแผ่นดินหนี ไม่อยากเจอใคร คงต้องให้เพื่อนช่วย มาปลอบใจให้มีสติและเห็นภาพที่กว้างขึ้นว่า มันก็ตลกดีนะ เป็นตำนานไปเลย คนจำได้ อาจจะใช้มากกว่า1วันกว่าจะกล้าสู้หน้าคนอื่น แต่ก็ เดี๋ยวก็หายค่ะ',
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
  {
    slug: 'wawa',
    nickname: 'วาวา',
    fullName: 'วาสิณี ขุนจง',
    referenceNumber: 'LIKQ-4FFB02AB',
    theme: 'pink',
    tagline: 'ไม่ลังเลถ้ามันถูกต้อง ตรงไปตรงมาทุกครั้ง',
    curatorNote:
      'ตอบตรงโดยไม่มีคำเยินยอ ทำให้รู้ว่าเธอตัดสินใจจากหลักการไม่ใช่อารมณ์',
    traits: ['Direct', 'Team-first', 'Decisive'],
    idolMeaning:
      'มองเป็นมนุษย์คนหนึ่งที่มีความสามารถและอยากเอาเป็นแบบอย่าง',
    creativeProject:
      'การแข่งขันร้องเพลงศิลปะหัตถกรรม (ม.ปลาย) การออดิชั่น เต้น TikTok',
    oneYearVision:
      'ถ้าเป็นไปได้อยากลองทำเพลงดูโอ้กับสมาชิกในวงที่มีความคิดเห็นที่ตรงกันหรือแนวเพลงที่ชอบ',
    demoAnalysis:
      'มีความน่ารักทะเล้น ดูขี้เล่น อาจจะเพิ่มความเซ็กซี่เข้าไปได้ด้วย',
    highlight: {
      question:
        'หลังวงเพิ่งติดตลาด 2 ปี ค่ายใหญ่กว่ายื่น solo contract ให้คุณคนเดียวไม่รวมเพื่อน คืนนั้นเพื่อนคนหนึ่งโทรมา เสียงสั่น ถามว่า "จริงไหม?" คุณจะตอบว่าอะไร และภายในหัวคุณจริงๆ คิดอะไร?',
      answer:
        'จริง และดีใจถ้าได้โอกาสก็อยากทำมันให้เต็มที่และจะทำมันอย่างแน่นอน',
    },
  },
  {
    slug: 'caila',
    nickname: 'CaiLa',
    fullName: 'ชิดชนก ยอดน้ำคำ',
    referenceNumber: 'LIKQ-1C07A085',
    theme: 'yellow',
    tagline: 'โชว์ทุกครั้งเพื่อพิสูจน์ว่าตั้งใจจริง ไม่ใช่แค่อยากดัง',
    curatorNote:
      'ตั้งใจแสดงออกถึงความพยายามในทุกงาน มองว่า feedback ทุกข้อมีประโยชน์แม้ไม่เห็นด้วยทั้งหมด',
    traits: ['Hardworking', 'Positive', 'Transparent'],
    idolMeaning:
      'การได้ยืนอยู่บนเวที ได้แสดงให้คนอื่นได้เห็น อยากสร้างแรงบันดาลใจให้กับทุกคน เหมือนไอดอลคนโปรดที่เป็นสิ่งยึดเหนี่ยวในการใช้ชีวิต',
    creativeProject: 'ส่งวิดิโอร้องเพลงออดิชั่น',
    oneYearVision:
      'อยากเห็นตัวเองเก่งมาก ๆ จนได้ไปแสดงโชว์ หรือ แสดงคอนเสิร์ตในต่างประเทศ',
    demoAnalysis:
      'เมโลดี้ทำนองเพลงน่ารัก สดใส เรียบเรียงเนื้อเพลงให้ดูขี้เล่น และติดหูมาก',
    highlight: {
      question:
        'หลังวงเพิ่งติดตลาด 2 ปี ค่ายใหญ่กว่ายื่น solo contract ให้คุณคนเดียวไม่รวมเพื่อน คืนนั้นเพื่อนคนหนึ่งโทรมา เสียงสั่น ถามว่า "จริงไหม?" คุณจะตอบว่าอะไร และภายในหัวคุณจริงๆ คิดอะไร?',
      answer:
        'ในเมื่อค่ายยื่นเรื่องมาก็คงต้องตอบว่าจริง ในจุดนั้นคงดีใจ แต่ก็แอบกังวลว่าเราจะดีพอที่จะทำ Solo ไหม',
    },
  },
  {
    slug: 'myla',
    nickname: 'Myla',
    fullName: 'กัญวรา สัพคง',
    referenceNumber: 'LIKQ-87BB0DDE',
    theme: 'mint',
    tagline: 'ผ่านออดิชั่นมาหลายค่าย แต่ยังไม่เจอที่ใช่จนกระทั่งตอนนี้',
    curatorNote:
      'Portfolio ที่ยาวที่สุดในรุ่น สะท้อนว่าเธอไม่เคยหยุดลองโอกาส ความมุมานะนี้คือทัศนคติที่ค่ายมองหา',
    traits: ['Experienced', 'Driven', 'Versatile'],
    idolMeaning:
      'การทำการแสดงโชว์ให้ดีที่สุดเพื่อแฟนๆ เป็นภาพลักษณ์และตัวอย่างที่ดีในทุกด้าน',
    creativeProject:
      'แสดงหนังสั้น ละครเวทีหลายเรื่อง งาน Extra ซีรีส์และภาพยนตร์ พิธีกรงานหลายงาน เต้นแข่งขัน cover dance ร่วม 13 เวที และเคยติด Audition รอบสุดท้ายหลายค่ายก่อนมาที่ LIKQ',
    oneYearVision:
      'เป็นศิลปินที่มีชื่อเสียง มากความสามารถ เป็นที่พูดถึงในประเทศไทยและส่งออกเพลงไทยให้คนต่างชาติได้ฟัง ไม่หยุดพัฒนา ทักษะร้อง เต้น performance ตำแหน่ง center หรือ visual',
    demoAnalysis:
      'เพลงดี แต่สนุกว่านี้ได้ เพลงเอื่อยไปนิดหน่อย แต่เป็นเพลงที่ดีเพลงหนึ่งเลย',
    highlight: {
      question:
        'ไลฟ์คอนเสิร์ตคนดู stream หลักแสน คุณลืมเนื้อ bridge เพลง signature คลิปเป็น meme ภายใน 1 ชั่วโมง กลับหอ ปิดไฟ อยากลบทุก social ทิ้ง เขียนมาตรงๆ ว่าในหัวคุณเป็นยังไงคืนนั้น และพรุ่งนี้เช้าคุณจะลุกจากเตียงยังไง?',
      answer:
        'อ้าก ฉันทำผิดไปแล้วขอโทษสังคม ฉันไม่ใช่คนไม่มีความสามารถนะ แค่ตอนนั้นสมองมันไม่อยู่กับตัวฉัน เวทีที่ผ่านมาฉันก็ทำได้ดีใช่มั้ยล่ะ เพราะงั้นขอโอกาสให้ฉันอีกสักครั้งเถอะ',
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
