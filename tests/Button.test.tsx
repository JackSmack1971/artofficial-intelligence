import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../src/components/ui'

describe('Button variants', () => {
  it('applies ai-primary classes', () => {
    const { getByRole } = render(<Button variant="ai-primary">Test</Button>)
    const btn = getByRole('button') as HTMLButtonElement
    expect(btn.className).toContain('from-ai-primary')
    expect(btn.className).toContain('to-ai-secondary')
  })

  it('applies neural classes', () => {
    const { getByRole } = render(<Button variant="neural">Test</Button>)
    const btn = getByRole('button') as HTMLButtonElement
    expect(btn.className).toContain('from-ai-accent')
    expect(btn.className).toContain('to-ai-primary')
  })
})
