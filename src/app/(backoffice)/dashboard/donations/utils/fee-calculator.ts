import { type DonationSetting } from '@/services/donation-service'

export function roundUp2(n: number): number {
  return Math.ceil(n * 100) / 100
}

export function calcFeeBreakdown(
  amountSatang: number,
  paymentMethod: string,
  settings: DonationSetting[]
) {
  const amount = amountSatang / 100

  // Find fee rate for this payment method
  const feeSettings = settings.filter(
    s => s.type === 'fee' && s.payment_method === paymentMethod
  )
  const vatSetting = settings.find(
    s => s.type === 'fee' && s.payment_method === null
  )
  const splitSettings = settings.filter(s => s.type === 'split')

  const feeRate = feeSettings.reduce((sum, s) => sum + Number(s.percentage), 0)
  const vatRate = vatSetting ? Number(vatSetting.percentage) : 0

  const fee = roundUp2(amount * (feeRate / 100))
  const vat = roundUp2(fee * (vatRate / 100))
  const net = roundUp2(amount - fee - vat)

  const splits: Record<string, number> = {}
  for (const s of splitSettings) {
    splits[s.name] = roundUp2(net * (Number(s.percentage) / 100))
  }

  return { fee, vat, net, splits }
}
