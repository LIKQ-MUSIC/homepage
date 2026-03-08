import { calcFeeBreakdown, roundUp2 } from './fee-calculator'
import type { DonationSetting } from '@/services/donation-service'

describe('Fee Calculator', () => {
  describe('roundUp2', () => {
    it('rounds up to 2 decimal places', () => {
      expect(roundUp2(10.123)).toBe(10.13)
      expect(roundUp2(10.121)).toBe(10.13)
      expect(roundUp2(10.1)).toBe(10.1)
      expect(roundUp2(10)).toBe(10.0)
    })
  })

  describe('calcFeeBreakdown', () => {
    it('calculates correct fees for credit card with splits', () => {
      const settings: DonationSetting[] = [
        {
          id: 1,
          name: 'Omise',
          type: 'fee',
          percentage: 3.65,
          payment_method: 'credit_card',
          created_at: '',
          updated_at: '',
          is_active: true
        },
        {
          id: 2,
          name: 'VAT',
          type: 'fee',
          percentage: 7,
          payment_method: null as any,
          created_at: '',
          updated_at: '',
          is_active: true
        },
        {
          id: 3,
          name: 'Maintenance',
          type: 'split',
          percentage: 5,
          payment_method: null as any,
          created_at: '',
          updated_at: '',
          is_active: true
        },
        {
          id: 4,
          name: 'Temple',
          type: 'split',
          percentage: 95,
          payment_method: null as any,
          created_at: '',
          updated_at: '',
          is_active: true
        }
      ]

      // 1000 THB = 100000 satang
      const amountSatang = 100000
      const paymentMethod = 'credit_card'

      const result = calcFeeBreakdown(amountSatang, paymentMethod, settings)

      // Expected calculation:
      // Amount: 1000
      // Fee (3.65%): 36.50
      // VAT (7% of Fee): 36.50 * 0.07 = 2.555 -> 2.56
      // Net: 1000 - 36.50 - 2.56 = 960.94
      // Split Maintenance (5% of Net): 960.94 * 0.05 = 48.047 -> 48.05
      // Split Temple (95% of Net): 960.94 * 0.95 = 912.893 -> 912.90

      expect(result.fee).toBe(36.5)
      expect(result.vat).toBe(2.56)
      expect(result.net).toBe(960.94)
      expect(result.splits['Maintenance']).toBe(48.05)
      expect(result.splits['Temple']).toBe(912.9)
    })
  })
})
