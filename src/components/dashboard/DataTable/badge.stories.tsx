import type { Meta, StoryObj } from '@storybook/react'
import { StatusBadge } from '../DataTable'
import '@/app/(backoffice)/dashboard.css'

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/Badge',
  component: StatusBadge,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'text',
      description: 'The status text to display'
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'info'],
      description: 'Predefined badge variants'
    },
    colorMap: {
      control: 'object',
      description: 'Custom color mapping for statuses'
    }
  }
}

export default meta
type Story = StoryObj<typeof StatusBadge>

// Default badge
export const Default: Story = {
  args: {
    status: 'Default'
  }
}

// Predefined variants
export const Success: Story = {
  args: {
    status: 'Success',
    variant: 'success'
  }
}

export const Warning: Story = {
  args: {
    status: 'Warning',
    variant: 'warning'
  }
}

export const Danger: Story = {
  args: {
    status: 'Danger',
    variant: 'danger'
  }
}

export const Info: Story = {
  args: {
    status: 'Info',
    variant: 'info'
  }
}

// Custom color mapping examples
export const CustomColors: Story = {
  args: {
    status: 'Custom',
    colorMap: {
      Custom: 'badge-info'
    }
  }
}

// Contract status badges
export const ContractStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="Draft" colorMap={{ Draft: 'badge-draft' }} />
      <StatusBadge status="Active" colorMap={{ Active: 'badge-approved' }} />
      <StatusBadge status="Expired" colorMap={{ Expired: 'badge-warning' }} />
      <StatusBadge
        status="Terminated"
        colorMap={{ Terminated: 'badge-danger' }}
      />
    </div>
  )
}

// Quotation status badges
export const QuotationStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="draft" colorMap={{ draft: 'badge-default' }} />
      <StatusBadge status="sent" colorMap={{ sent: 'badge-info' }} />
      <StatusBadge status="accepted" colorMap={{ accepted: 'badge-success' }} />
      <StatusBadge status="approved" colorMap={{ approved: 'badge-success' }} />
      <StatusBadge status="rejected" colorMap={{ rejected: 'badge-danger' }} />
    </div>
  )
}

// Dark mode showcase
export const DarkMode: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Light Mode</h3>
        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded">
          <StatusBadge status="Draft" colorMap={{ Draft: 'badge-draft' }} />
          <StatusBadge
            status="Active"
            colorMap={{ Active: 'badge-approved' }}
          />
          <StatusBadge
            status="Expired"
            colorMap={{ Expired: 'badge-warning' }}
          />
          <StatusBadge
            status="Terminated"
            colorMap={{ Terminated: 'badge-danger' }}
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Dark Mode</h3>
        <div className="flex flex-wrap gap-3 p-4 bg-gray-900 rounded">
          <StatusBadge status="Draft" colorMap={{ Draft: 'badge-draft' }} />
          <StatusBadge
            status="Active"
            colorMap={{ Active: 'badge-approved' }}
          />
          <StatusBadge
            status="Expired"
            colorMap={{ Expired: 'badge-warning' }}
          />
          <StatusBadge
            status="Terminated"
            colorMap={{ Terminated: 'badge-danger' }}
          />
        </div>
      </div>
    </div>
  )
}

// All available badge classes
export const AllBadgeClasses: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <StatusBadge status="Default" colorMap={{ Default: 'badge-default' }} />
        <StatusBadge status="Success" colorMap={{ Success: 'badge-success' }} />
        <StatusBadge status="Warning" colorMap={{ Warning: 'badge-warning' }} />
        <StatusBadge status="Danger" colorMap={{ Danger: 'badge-danger' }} />
        <StatusBadge status="Info" colorMap={{ Info: 'badge-info' }} />
        <StatusBadge status="Draft" colorMap={{ Draft: 'badge-draft' }} />
        <StatusBadge
          status="Approved"
          colorMap={{ Approved: 'badge-approved' }}
        />
      </div>
    </div>
  )
}
