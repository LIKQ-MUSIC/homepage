import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Paragraph from './index'

describe('Paragraph Component', () => {
  it('should render correctly', () => {
    render(<Paragraph>Test</Paragraph>)

    const paragraph = screen.getByText('Test')
    expect(paragraph).toBeInTheDocument()
  })

  it('should apply custom class', () => {
    render(<Paragraph className="text-red-500">Test</Paragraph>)

    const paragraph = screen.getByText('Test')
    expect(paragraph).toHaveClass('text-red-500')
  })

  it('should render with default variant without extra classes', () => {
    render(<Paragraph>Default</Paragraph>)

    const paragraph = screen.getByText('Default')
    expect(paragraph).not.toHaveClass('tracking-[0.3em]')
  })

  it('should apply label variant classes', () => {
    render(<Paragraph variant="label">Our Story</Paragraph>)

    const paragraph = screen.getByText('Our Story')
    expect(paragraph).toHaveClass('text-sm')
    expect(paragraph).toHaveClass('tracking-[0.3em]')
    expect(paragraph).toHaveClass('uppercase')
    expect(paragraph).toHaveClass('text-primary/70')
  })

  it('should merge custom class with label variant', () => {
    render(
      <Paragraph variant="label" className="mb-4">
        Label
      </Paragraph>
    )

    const paragraph = screen.getByText('Label')
    expect(paragraph).toHaveClass('tracking-[0.3em]')
    expect(paragraph).toHaveClass('mb-4')
  })
})
