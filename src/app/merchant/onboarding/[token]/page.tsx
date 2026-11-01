import type { Metadata } from 'next'
import OnboardingView from '@/components/MerchantOnboarding/OnboardingView'

export const metadata: Metadata = {
  title: 'เชื่อมบัญชี Stripe',
  robots: { index: false, follow: false }
}

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <OnboardingView token={token} mode="landing" />
}
