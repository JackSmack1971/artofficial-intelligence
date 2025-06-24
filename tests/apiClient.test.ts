import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient, ApiError } from '../src/lib/apiClient'

declare global {
  // eslint-disable-next-line no-var
  var fetch: typeof fetch
}

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'http://local')
})

describe('apiClient', () => {
  it('throws error for invalid endpoint', async () => {
    await expect(apiClient('')).rejects.toThrow()
  })

  it('returns data on success', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) })
    )
    const res = await apiClient('/path')
    expect(res).toEqual({ ok: true })
    expect(global.fetch).toHaveBeenCalledWith(
      'http://local/path',
      expect.any(Object)
    )
  })

  it('throws ApiError for non-ok response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    )
    await expect(apiClient('/error')).rejects.toBeInstanceOf(ApiError)
  })

  it('retries on failure', async () => {
    const mock = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({ done: true }) })
    global.fetch = mock
    const res = await apiClient('/retry')
    expect(res).toEqual({ done: true })
    expect(mock).toHaveBeenCalledTimes(3)
  })
})
