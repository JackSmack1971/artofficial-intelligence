import { z } from 'zod'

const endpointSchema = z.string().min(1)

export class ApiError extends Error {}

export async function apiClient(endpoint: string, options?: RequestInit) {
  const path = endpointSchema.parse(endpoint)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  let lastError: unknown = null
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!res.ok) throw new ApiError(`Status ${res.status}`)
      return await res.json()
    } catch (err) {
      lastError = err
    }
  }
  throw new ApiError(String(lastError))
}
