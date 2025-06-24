import { describe, it, expect } from 'vitest'
import { apiClient } from '../src/lib/apiClient'

describe('apiClient', () => {
  it('throws error for invalid endpoint', async () => {
    await expect(apiClient('')).rejects.toThrow()
  })
})
