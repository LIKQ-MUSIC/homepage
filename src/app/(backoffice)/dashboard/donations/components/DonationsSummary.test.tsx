import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DonationsSummary } from './DonationsSummary'

describe('DonationsSummary', () => {
  it('renders correct totals', () => {
    const mockTotals = {
      amount: 1000,
      fee: 20,
      vat: 5,
      net: 975,
      splits: {
        'Split A': 500,
        'Split B': 475
      }
    }

    render(<DonationsSummary totals={mockTotals} />)

    expect(screen.getByText('Page Summary')).toBeInTheDocument()
    expect(screen.getByText('Total Amount')).toBeInTheDocument()
    expect(screen.getByText('1000.00 THB')).toBeInTheDocument()

    expect(screen.getByText('Total Fees')).toBeInTheDocument()
    expect(screen.getByText('20.00 + VAT 5.00')).toBeInTheDocument()

    expect(screen.getByText('Total Net')).toBeInTheDocument()
    expect(screen.getByText('975.00')).toBeInTheDocument()

    expect(screen.getByText('Split A')).toBeInTheDocument()
    expect(screen.getByText('500.00')).toBeInTheDocument()

    expect(screen.getByText('Split B')).toBeInTheDocument()
    expect(screen.getByText('475.00')).toBeInTheDocument()
  })
})
