import React from 'react'
import Section from '@/components/Section'
import StaffCard from '@/components/Team/_components/StaffCard'

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

  return (
    <Section id="team" className="" label="Our Team" title="ทีมงานของเรา">
      {/* Centred wrap keeps the last row balanced for any head-count
          (e.g. 4 members read as 3 + 1 centred, not 3 + 1 stranded left). */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-12">
        {staffMembers.map((staffMember: StaffMember) => (
          <div key={staffMember.name} className="w-full sm:w-64">
            <StaffCard {...staffMember} />
          </div>
        ))}
      </div>
    </Section>
  )
}

export default Team
