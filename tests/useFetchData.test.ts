import { renderHook } from '@testing-library/react'
import { useFetchData } from '../src/hooks/useFetchData'

global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock

describe('useFetchData', () => {
  it('returns data without error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetchData('/test'))
    await waitForNextUpdate()
    expect(result.current.error).toBeNull()
  })
})
