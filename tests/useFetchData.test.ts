import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFetchData } from '../src/hooks/useFetchData'

// Setup a base URL for the apiClient
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve(new Response(JSON.stringify({ message: 'ok' }), { status: 200 }))
  )
  vi.stubEnv('VITE_API_BASE_URL', 'http://local')
})

describe('useFetchData', () => {
  it('returns data without error', async () => {
    const { result } = renderHook(() => useFetchData('/test'))
    await waitFor(() => {
      expect(result.current.error).toBeNull()
      expect(result.current.data).toEqual({ message: 'ok' })
    })
  })

  it('sets error when request fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('fail')))
    const { result } = renderHook(() => useFetchData('/fail'))
    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error)
    })
  })
})
