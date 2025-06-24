import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useFetchData } from '../src/hooks/useFetchData'

global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
) as unknown as typeof fetch

describe('useFetchData', () => {
  it('returns data without error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetchData('/test'))
    await waitForNextUpdate()
    expect(result.current.error).toBeNull()
  })
})
