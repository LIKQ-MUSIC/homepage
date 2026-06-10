import React from 'react'
import StaffCard from '@/components/Team/_components/StaffCard'
import SectionHead from '@/components/home/SectionHead'

interface StaffMember {
  imageUrl: string
  name: string
  description: string
}

// ISR Fetch function
const getTeamMembers = async (): Promise<StaffMember[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002'
  try {
    const res = await fetch(`${apiUrl}/our-team`, {
      next: { revalidate: 3600 }
    })

    if (!res.ok) return []

    const { data } = await res.json()
    return data.map((member: any) => ({
      imageUrl: member.image_url,
      name: member.name,
      description: member.role
    }))
  } catch (error) {
    console.error('Error fetching team members:', error)
    return []
  }
}

const Team = async () => {
  const staffMembers = await getTeamMembers()

  if (staffMembers.length === 0) return null

  return (
    <section id="team" className="bg-ink-deep px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
      <SectionHead th="ทีมงานของเรา" en="Team" />
      {/* Centred wrap keeps the last row balanced for any head-count
          (e.g. 4 members read as 3 + 1 centred, not 3 + 1 stranded left). */}
      <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-12">
        {staffMembers.map((staffMember: StaffMember) => (
          <div key={staffMember.name} className="w-full sm:w-64">
            <StaffCard {...staffMember} />
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}

export default Team
