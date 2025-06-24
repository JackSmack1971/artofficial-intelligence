# Custom Hooks Development Guide

## 📋 Purpose
Reusable React hooks for business logic, state management, and API integration in the ArtOfficial Intelligence platform.

## 🏗️ Hook Architecture Patterns

### News Data Hook
```typescript
interface UseNewsOptions {
  category?: string
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseNewsReturn {
  articles: NewsArticle[]
  loading: boolean
  error: string | null
  hasMore: boolean
  
  // Actions
  fetchMore: () => Promise<void>
  refresh: () => Promise<void>
  addArticle: (article: NewsArticle) => void
  updateArticle: (id: string, updates: Partial<NewsArticle>) => void
}

export const useNews = (options: UseNewsOptions = {}): UseNewsReturn => {
  const {
    category = 'all',
    limit = 20,
    autoRefresh = false,
    refreshInterval = 300000 // 5 minutes
  } = options

  const [state, setState] = useState<{
    articles: NewsArticle[]
    loading: boolean
    error: string | null
    hasMore: boolean
    page: number
  }>({
    articles: [],
    loading: true,
    error: null,
    hasMore: true,
    page: 1
  })

  const apiClient = useMemo(() => new AINewsAPI(), [])

  const fetchArticles = useCallback(async (page: number = 1, append = false) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const params = {
        page,
        limit,
        category: category !== 'all' ? category : undefined
      }
      
      const newArticles = await apiClient.fetchArticles(params)
      
      setState(prev => ({
        ...prev,
        articles: append ? [...prev.articles, ...newArticles] : newArticles,
        loading: false,
        hasMore: newArticles.length === limit,
        page
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch articles'
      }))
    }
  }, [apiClient, category, limit])

  const fetchMore = useCallback(async () => {
    if (!state.hasMore || state.loading) return
    await fetchArticles(state.page + 1, true)
  }, [fetchArticles, state.hasMore, state.loading, state.page])

  const refresh = useCallback(async () => {
    await fetchArticles(1, false)
  }, [fetchArticles])

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refresh, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refresh, refreshInterval])

  // Initial fetch
  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return {
    articles: state.articles,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    fetchMore,
    refresh,
    addArticle: (article) => setState(prev => ({ 
      ...prev, 
      articles: [article, ...prev.articles] 
    })),
    updateArticle: (id, updates) => setState(prev => ({
      ...prev,
      articles: prev.articles.map(article => 
        article.id === id ? { ...article, ...updates } : article
      )
    }))
  }
}
```

### AI Integration Hook
```typescript
interface UseAIOptions {
  model?: 'gpt-3.5-turbo' | 'gpt-4'
  maxTokens?: number
  temperature?: number
}

interface UseAIReturn {
  generating: boolean
  error: string | null
  
  // AI Functions
  generateSummary: (content: string) => Promise<string>
  generateTags: (content: string) => Promise<string[]>
  analyzesentiment: (content: string) => Promise<SentimentAnalysis>
  generateRelatedQuestions: (content: string) => Promise<string[]>
}

export const useAI = (options: UseAIOptions = {}): UseAIReturn => {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const aiService = useMemo(() => new AIContentService(options), [options])

  const executeAITask = useCallback(async <T>(
    task: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> => {
    setGenerating(true)
    setError(null)
    
    try {
      const result = await task()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage
      setError(message)
      console.error(`AI task failed: ${message}`, err)
      return null
    } finally {
      setGenerating(false)
    }
  }, [])

  const generateSummary = useCallback(async (content: string): Promise<string> => {
    const result = await executeAITask(
      () => aiService.summarizeArticle(content),
      'Failed to generate summary'
    )
    return result || 'Summary unavailable'
  }, [executeAITask, aiService])

  const generateTags = useCallback(async (content: string): Promise<string[]> => {
    const result = await executeAITask(
      () => aiService.extractTags(content),
      'Failed to generate tags'
    )
    return result || []
  }, [executeAITask, aiService])

  const analyzesentiment = useCallback(async (content: string): Promise<SentimentAnalysis> => {
    const result = await executeAITask(
      () => aiService.analyzeSentiment(content),
      'Failed to analyze sentiment'
    )
    return result || { sentiment: 'neutral', confidence: 0, reasoning: 'Analysis failed' }
  }, [executeAITask, aiService])

  return {
    generating,
    error,
    generateSummary,
    generateTags,
    analyzesentiment,
    generateRelatedQuestions: useCallback(async (content: string): Promise<string[]> => {
      const result = await executeAITask(
        () => aiService.generateQuestions(content),
        'Failed to generate questions'
      )
      return result || []
    }, [executeAITask, aiService])
  }
}
```

### Authentication Hook
```typescript
interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => Promise<void>
  register: (userData: RegisterData) => Promise<boolean>
  updateProfile: (updates: Partial<User>) => Promise<boolean>
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<{
    user: User | null
    loading: boolean
    error: string | null
  }>({
    user: null,
    loading: true,
    error: null
  })

  const authService = useMemo(() => new AuthService(), [])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = tokenManager.get()
        if (token) {
          const user = await authService.validateToken(token)
          setState({ user, loading: false, error: null })
        } else {
          setState({ user: null, loading: false, error: null })
        }
      } catch (error) {
        tokenManager.clear()
        setState({ 
          user: null, 
          loading: false, 
          error: 'Authentication failed' 
        })
      }
    }

    initAuth()
  }, [authService])

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { user, token } = await authService.login(credentials)
      tokenManager.set(token)
      setState({ user, loading: false, error: null })
      return true
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }))
      return false
    }
  }, [authService])

  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenManager.clear()
      setState({ user: null, loading: false, error: null })
    }
  }, [authService])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    login,
    logout,
    register: useCallback(async (userData: RegisterData): Promise<boolean> => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const { user, token } = await authService.register(userData)
        tokenManager.set(token)
        setState({ user, loading: false, error: null })
        return true
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Registration failed'
        }))
        return false
      }
    }, [authService]),
    updateProfile: useCallback(async (updates: Partial<User>): Promise<boolean> => {
      if (!state.user) return false
      
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const updatedUser = await authService.updateProfile(state.user.id, updates)
        setState(prev => ({ ...prev, user: updatedUser, loading: false }))
        return true
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Profile update failed'
        }))
        return false
      }
    }, [authService, state.user])
  }
}
```

## 🔄 Real-time Updates Hook

### WebSocket News Updates
```typescript
export const useRealTimeNews = () => {
  const [connected, setConnected] = useState(false)
  const [latestUpdate, setLatestUpdate] = useState<NewsUpdate | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(import.meta.env.VITE_WS_URL)
      
      ws.onopen = () => {
        setConnected(true)
        console.log('WebSocket connected for real-time news')
      }
      
      ws.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data) as NewsUpdate
          if (validateNewsUpdate(update)) {
            setLatestUpdate(update)
          }
        } catch (error) {
          console.error('Invalid WebSocket message:', error)
        }
      }
      
      ws.onclose = () => {
        setConnected(false)
        setTimeout(connectWebSocket, 3000) // Reconnect after 3 seconds
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
      wsRef.current = ws
    }

    connectWebSocket()

    return () => {
      wsRef.current?.close()
    }
  }, [])

  return { connected, latestUpdate }
}
```

## 🧪 Hook Testing Patterns

### Testing Custom Hooks
```typescript
describe('useNews', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches articles on mount', async () => {
    const mockArticles = [
      { id: '1', title: 'Test Article', /* ... */ }
    ]
    
    mockAPIClient.fetchArticles.mockResolvedValue(mockArticles)
    
    const { result } = renderHook(() => useNews())
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.articles).toEqual(mockArticles)
    })
  })

  it('handles API errors gracefully', async () => {
    mockAPIClient.fetchArticles.mockRejectedValue(new Error('API Error'))
    
    const { result } = renderHook(() => useNews())
    
    await waitFor(() => {
      expect(result.current.error).toBe('API Error')
      expect(result.current.articles).toEqual([])
    })
  })
})
```

---

**Focus Areas**: Type safety, error handling, performance optimization, and comprehensive business logic encapsulation.
