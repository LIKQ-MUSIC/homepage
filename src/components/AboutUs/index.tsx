import Section from '@/components/Section'
import Button from '@/ui/Button'

const AboutUs = () => {
  return (
    <Section
      id="about-us"
      label="About Us"
      title="เกี่ยวกับเรา"
      dark
      className="bg-[#030827] text-white py-20 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Text Content - Full Width */}
        <div className="space-y-8 text-center text-lg leading-relaxed text-gray-400 max-w-4xl mx-auto">
          <p className="text-xl">
            <strong className="text-white text-2xl">LiKQ Music</strong>{' '}
            คือทีมผลิตดนตรีครบวงจรที่มุ่งเน้นคุณภาพและความคิดสร้างสรรค์
            เราเชี่ยวชาญในงาน{' '}
            <strong className="text-white">Music Production</strong> ทุกขั้นตอน
            ตั้งแต่การเขียนเนื้อร้อง แต่งทำนอง เรียบเรียงดนตรี
            ไปจนถึงการมิกซ์และมาสเตอร์ริ่ง
          </p>
          <p>
            ไม่ว่าจะเป็นเพลง Original สำหรับศิลปิน, เพลงประกอบโฆษณา, แฟนซอง
            หรือโปรเจกต์พิเศษต่าง ๆ เราพร้อมดูแลและให้คำปรึกษาด้วยทีมงานมืออาชีพ
            เพื่อให้ได้ผลงานที่ตรงตามวิสัยทัศน์ของคุณมากที่สุด
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              href="#work"
              variant="onDarkOutline"
              className="h-auto px-8 py-3 rounded-full"
            >
              ดูผลงานของเรา
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default AboutUs
