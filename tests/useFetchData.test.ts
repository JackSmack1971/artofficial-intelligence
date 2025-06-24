// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useFetchData } from '@/hooks/useFetchData'

global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }))

describe('useFetchData', () => {
  it('returns data without error', async () => {
    const { result } = renderHook(() => useFetchData('/test'))
    await waitFor(() => {
      expect(result.current.error).toBeNull()
    })
  })
})
