import { StaffCardProps } from '@/components/Team/_components/StaffCard/types'
import Image from 'next/image'

const StaffCard = ({ imageUrl, name, description }: StaffCardProps) => {
  return (
    <div className="flex flex-col items-center space-y-3 text-center">
      <div className="q-aperture relative h-52 w-52 shadow-[0_16px_40px_-24px_rgba(16,6,159,0.55)]">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 60vw, 13rem"
        />
      </div>

      <p className="copy-th text-lg font-bold text-likq-ink">{name}</p>
      <p className="copy-th whitespace-pre text-sm text-likq-obsidian/80">
        {description}
      </p>
    </div>
  )
}

export default StaffCard
