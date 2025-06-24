import { apiClient } from '../src/lib/apiClient'

it('should throw error for invalid endpoint', async () => {
  await expect(apiClient('')).rejects.toThrow()
})
