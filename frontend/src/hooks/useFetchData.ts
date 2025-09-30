import { useState, useEffect, useCallback } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseFetchDataReturn<T> extends FetchState<T> {
  refetch: () => Promise<void>
}

const useFetchData = <T>(url: string, dependency?: number): UseFetchDataReturn<T> => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  })

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setState({
        data,
        loading: false,
        error: null
      })
    } catch (err) {
      console.error('Error fetching data:', err)
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch data'
      })
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData, dependency])

  return {
    ...state,
    refetch: fetchData
  }
}

export default useFetchData
