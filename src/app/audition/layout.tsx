import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ออดิชั่น Idol',
  description:
    'LiKQ Music เปิดรับสมาชิกวง idol หน้าใหม่ · สมัครเลยเพื่อโชว์เสียงร้อง ความคิดสร้างสรรค์ และวิสัยทัศน์ของคุณ',
  openGraph: {
    title: 'ออดิชั่น Idol | LiKQ MUSIC',
    description:
      'สมัครร่วมวง idol หน้าใหม่ของ LiKQ Music · โชว์แพสชั่น เสียงร้อง และวิสัยทัศน์สร้างสรรค์ของคุณ',
    type: 'website',
  },
}

export default function AuditionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
