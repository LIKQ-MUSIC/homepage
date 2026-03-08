import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SettingsTab } from './SettingsTab'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DonationSetting } from '@/services/donation-service'

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn()
}))

const mockSettings: DonationSetting[] = [
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
    name: 'Temple',
    type: 'split',
    percentage: 95,
    payment_method: null as any,
    created_at: '',
    updated_at: '',
    is_active: true
  }
]

describe('SettingsTab', () => {
  const mockMutate = jest.fn()
  const mockInvalidateQueries = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries
    })
    ;(useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false
    })
  })

  it('renders read-only fee settings and editable split settings', () => {
    render(<SettingsTab settings={mockSettings} />)

    expect(screen.getByText('Payment Gateway Fees')).toBeInTheDocument()
    expect(screen.getByText('Omise')).toBeInTheDocument()
    expect(screen.getByText('3.65%')).toBeInTheDocument()

    expect(screen.getByText('Revenue Splits')).toBeInTheDocument()
    expect(screen.getByText('Temple')).toBeInTheDocument()
    expect(screen.getByText('95.00%')).toBeInTheDocument()
  })

  it('opens create modal when Add Split button is clicked', () => {
    render(<SettingsTab settings={mockSettings} />)

    const addBtn = screen.getByRole('button', { name: /Add Split/i })
    fireEvent.click(addBtn)

    expect(
      screen.getByText('Add Split', { selector: 'h2' })
    ).toBeInTheDocument()
  })

  it('handles create mutation successfully', () => {
    render(<SettingsTab settings={mockSettings} />)

    fireEvent.click(screen.getByRole('button', { name: /Add Split/i }))

    // Fill out form
    const nameInput = screen.getByPlaceholderText(/e.g. Maintenance Fund/i)
    fireEvent.change(nameInput, { target: { value: 'New Test Split' } })

    // No placeholder for percentage, let's use role
    const percentageInput = screen.getByRole('spinbutton')
    fireEvent.change(percentageInput, { target: { value: '50' } })

    const submitBtn = screen.getByRole('button', { name: 'Create' })
    fireEvent.click(submitBtn)

    expect(mockMutate).toHaveBeenCalledWith({
      name: 'New Test Split',
      percentage: 50,
      type: 'split',
      payment_method: null
    })
  })

  it('triggers delete mutation when trash icon clicked', () => {
    // window.confirm mock
    jest.spyOn(window, 'confirm').mockImplementation(() => true)

    render(<SettingsTab settings={mockSettings} />)

    // There are two buttons for "Temple" row: Edit and Delete
    // The trash icon handles deletion, find it or just mock it. We have a generic button but we can find it via role and looking for the one that calls delete.
    const buttons = screen.getAllByRole('button')
    // Filter to find delete button for the 'Temple' row. Usually it's the second button in the row or we can use generic test id, but for now we click the last button (Trash2).
    const deleteBtn = buttons[buttons.length - 1] // Trash2 is the last one
    fireEvent.click(deleteBtn)

    expect(window.confirm).toHaveBeenCalledWith('Delete "Temple"?')
    expect(mockMutate).toHaveBeenCalledWith(2) // 2 is id of Temple

    jest.restoreAllMocks()
  })
})
