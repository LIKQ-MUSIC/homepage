import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DonationListTab } from './DonationListTab'
import { useQuery } from '@tanstack/react-query'
import type { Donation, DonationSetting } from '@/services/donation-service'

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn()
}))

jest.mock('../../../../../hooks/use-pagination', () => ({
  usePagination: jest.fn().mockReturnValue({
    page: 1,
    limit: 10,
    nextPage: jest.fn(),
    prevPage: jest.fn()
  })
}))

jest.mock('./DonationsSummary', () => ({
  DonationsSummary: ({ totals }: any) => (
    <div data-testid="donations-summary">Summary Mock</div>
  )
}))

// Mock DataTable since testing it deeply is not the focus of this unit test
jest.mock('../../../../../components/dashboard/DataTable', () => ({
  DataTable: ({ title, data }: any) => (
    <div data-testid="data-table">
      {title} - Rows: {data?.length || 0}
    </div>
  )
}))

const mockSettings: DonationSetting[] = [
  {
    id: 1,
    name: 'VAT',
    type: 'fee',
    percentage: 7,
    payment_method: null as any,
    created_at: '',
    updated_at: '',
    is_active: true
  }
]

const mockDonations: Donation[] = [
  {
    id: '1',
    amount: 100000, // 1000 THB
    currency: 'THB',
    payment_method: 'promptpay',
    status: 'successful',
    metadata: { donorName: 'John Doe', feature: 'homepage_donations' },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
]

describe('DonationListTab', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with donations', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { data: mockDonations, meta: { total: 1 } },
      isLoading: false,
      isError: false
    })

    render(<DonationListTab settings={mockSettings} />)

    expect(
      screen.getByPlaceholderText(/Search donor name or email/i)
    ).toBeInTheDocument()
    // It should render summary when there are donations
    expect(screen.getByTestId('donations-summary')).toBeInTheDocument()
    // It should render data table
    expect(screen.getByTestId('data-table')).toHaveTextContent(
      'Donation List - Rows: 1'
    )
  })

  it('handles search and status filter', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
      isError: false
    })

    render(<DonationListTab settings={mockSettings} />)

    const searchInput = screen.getByPlaceholderText(
      /Search donor name or email/i
    )
    fireEvent.change(searchInput, { target: { value: 'alice' } })
    expect(searchInput).toHaveValue('alice')

    const statusSelect = screen.getByRole('combobox')
    fireEvent.change(statusSelect, { target: { value: 'successful' } })
    expect(statusSelect).toHaveValue('successful')

    expect(useQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(['alice', 'successful'])
      })
    )
  })

  it('does not render DonationsSummary if no donations found', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
      isError: false
    })

    render(<DonationListTab settings={mockSettings} />)

    expect(screen.queryByTestId('donations-summary')).not.toBeInTheDocument()
    expect(screen.getByTestId('data-table')).toHaveTextContent(
      'Donation List - Rows: 0'
    )
  })
})
