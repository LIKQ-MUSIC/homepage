import { Title, Paragraph } from '@/ui/Typography'

const ColorStory = () => {
  return (
    <section id="our-story" className="py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <Paragraph variant="label" className="mb-4">
          Our Story
        </Paragraph>
        <Title className="text-center" level={2}>
          เรื่องเล่าผ่านสีของเรา
        </Title>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Navy */}
          <div className="flex flex-col items-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-[#153051] shadow-lg mb-4" />
            <h3 className="text-lg font-bold text-[#153051] mb-2">Navy</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              สีกรมท่า คือความลึกซึ้งและมั่นคง เหมือนทะเลลึกที่ไม่เคยหยุดนิ่ง —
              สะท้อนถึงความตั้งใจ ความเป็นมืออาชีพ
              และรากฐานที่แข็งแกร่งของพวกเรา
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-32 bg-gray-200" />
          <div className="block md:hidden h-px w-32 bg-gray-200" />

          {/* Lavender */}
          <div className="flex flex-col items-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-[#B4A7D6] shadow-lg mb-4" />
            <h3 className="text-lg font-bold text-[#7B68AE] mb-2">Lavender</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              สีลาเวนเดอร์ คือจินตนาการและความคิดสร้างสรรค์
              เหมือนกลิ่นหอมที่ปลุกแรงบันดาลใจ — สะท้อนถึงความฝัน ความอ่อนโยน
              และเอกลักษณ์ที่ไม่เหมือนใคร
            </p>
          </div>
        </div>

        <p className="mt-10 text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
          เมื่อสองสีนี้มาบรรจบกัน มันคือตัวตนของ LIKQ —
          ความสมดุลระหว่างความมั่นคงกับจินตนาการ
          ระหว่างความเป็นมืออาชีพกับความกล้าที่จะแตกต่าง
          เราเชื่อว่าทุกเสียงเพลงเกิดจากเรื่องราว และนี่คือเรื่องราวของเรา
        </p>
      </div>
    </section>
  )
}

export default ColorStory
