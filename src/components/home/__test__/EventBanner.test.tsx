import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import EventBanner from '../EventBanner'

const at = (iso: string) => Date.parse(iso)

describe('EventBanner', () => {
  it('links the whole panel to the ticket page and shows Early Bird before 7 Dec', () => {
    render(<EventBanner now={at('2026-11-20T12:00:00+07:00')} />)
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/merch/th/event/likq-christmas-party-2026'
    )
    expect(screen.getByText(/Early Bird ฿199/)).toBeInTheDocument()
  })

  it('drops the Early Bird line once that price has ended', () => {
    render(<EventBanner now={at('2026-12-08T00:00:01+07:00')} />)
    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.queryByText(/Early Bird/)).not.toBeInTheDocument()
  })

  it('takes itself down after the show', () => {
    const { container } = render(<EventBanner now={at('2026-12-13T21:00:01+07:00')} />)
    expect(container).toBeEmptyDOMElement()
  })
})
