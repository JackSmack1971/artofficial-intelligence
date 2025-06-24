import { describe, it, expect } from 'vitest'
import { apiClient } from '@/lib/apiClient'

describe('apiClient', () => {
  it('should throw error for invalid endpoint', async () => {
    await expect(apiClient('')).rejects.toThrow()
  })
})
