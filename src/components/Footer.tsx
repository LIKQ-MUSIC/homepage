'use client'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Title } from '@/ui/Typography'
import Button from '@/ui/Button'
import Youtube from '@/ui/Icons/YouTube'
import Mailbox from '@/ui/Icons/Mailbox'
import SoundCloud from '@/ui/Icons/SoundCloud'
import { useSendContactEmail } from '@/hooks/api'

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const { mutate, isPending, isSuccess, isError } = useSendContactEmail()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', phone: '', email: '', message: '' })
      }
    })
  }
  return (
    <footer id="contact" className="bg-[#153051] text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info & Socials */}
          <div className="footer-info flex flex-col space-y-8">
            <div className="contact-list space-y-4">
              <Title level={3} className="text-white mb-6">
                ติดต่อเรา
              </Title>
              <p className="text-white/90 text-lg">
                โทรศัพท์: 092-409-0388 (คุณนพ Producer)
              </p>
              <p className="text-white/90 text-lg">
                อีเมล:{' '}
                <a
                  href="mailto:contact@likqmusic.com"
                  className="hover:underline"
                >
                  contact@likqmusic.com
                </a>
              </p>
            </div>

            <div className="social-links">
              <Title level={4} className="text-white mb-4 text-xl">
                ติดตามเราได้ที่
              </Title>
              <div className="flex space-x-4 items-center">
                <Youtube
                  className="youtube-icon"
                  href="https://youtube.com/@likqmusic"
                />
                <a
                  href="https://soundcloud.com/prod-lightz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 p-2 transition-all rounded-full flex items-center justify-center bg-white text-primary hover:bg-primary-hover hover:text-white"
                >
                  <SoundCloud />
                </a>
                <Mailbox
                  href="mailto:contact@likqmusic.com"
                  className="mailbox-icon"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="footer-form bg-white/5 p-6 md:p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-primary/20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 transition-all duration-700 group-hover:bg-blue-500/20 pointer-events-none"></div>

            <Title level={4} className="text-white mb-6 text-xl relative z-10">
              กรอกข้อมูลให้เราติดต่อกลับ
            </Title>
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="ชื่อ-นามสกุล"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="เบอร์โทรศัพท์"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="อีเมล"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
              <textarea
                name="message"
                id="message"
                placeholder="ข้อความ"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors resize-none"
              ></textarea>

              {isSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm text-center">
                  ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด
                </div>
              )}
              {isError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                  เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง
                </div>
              )}

              <Button
                type="submit"
                variant="onDark"
                disabled={isPending}
                className="w-full h-auto py-3 rounded-lg font-bold"
              >
                {isPending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-[#153051]/30 border-t-[#153051] rounded-full animate-spin mr-2"></span>
                    กำลังส่ง...
                  </>
                ) : (
                  'ส่งข้อความ'
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p id="copyright" className="text-white/60 text-sm">
            &copy; {dayjs().format('YYYY')} LiKQ Music Production.
            สงวนลิขสิทธิ์.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
