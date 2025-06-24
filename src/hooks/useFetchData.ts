import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/apiClient'

export const useFetchData = (endpoint: string) => {
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const result = await apiClient(endpoint)
        if (isMounted) setData(result)
      } catch (err) {
        if (isMounted) setError(err as Error)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [endpoint])

  return { data, error }
}
