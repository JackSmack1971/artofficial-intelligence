# Library Functions Development Guide

## 📋 Purpose
This directory contains core utility functions, API clients, validation schemas, and security implementations for the ArtOfficial Intelligence platform.

## 🏗️ Architecture Patterns

### API Client Structure (`api.ts`)
```typescript
// Follow this pattern for all API integrations
class AINewsAPI {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    })
    
    this.setupInterceptors()
  }

  // Always include error handling and type safety
  async fetchArticles(params: FetchArticlesParams): Promise<NewsArticle[]> {
    try {
      const response = await this.client.get<APIResponse<NewsArticle[]>>('/articles', { params })
      return response.data.data
    } catch (error) {
      throw new APIError('Failed to fetch articles', error)
    }
  }
}
```

### Validation Schema Pattern (`validators.ts`)
```typescript
// Use Zod for all input validation
export const CreateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.enum(['AI Research', 'Industry News', 'Tools', 'Analysis']),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  aiGenerated: z.boolean().optional().default(false)
})

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>
```

### Security Functions (`security.ts`)
```typescript
// Implement comprehensive sanitization
export const sanitizeHTML = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false
  })
}

// Secure token management
export const tokenManager = {
  set: (token: string) => {
    sessionStorage.setItem('auth_token', btoa(token))
  },
  get: (): string | null => {
    const encoded = sessionStorage.getItem('auth_token')
    return encoded ? atob(encoded) : null
  },
  clear: () => {
    sessionStorage.removeItem('auth_token')
  }
}
```

## 🔒 Security Requirements

### Input Sanitization
- **Always** sanitize user-generated content
- **Always** validate API responses
- **Never** trust external data sources
- **Use** TypeScript for compile-time safety

### Error Handling
```typescript
// Standard error handling pattern
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Usage in components
const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    toast.error(error.message)
    console.error('API Error:', error.originalError)
  } else {
    toast.error('An unexpected error occurred')
    console.error('Unexpected error:', error)
  }
}
```

## 📊 Utility Function Standards

### Type-Safe Utilities (`utils.ts`)
```typescript
// Always include proper TypeScript types
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
```

## 🧪 Testing Requirements

### Test Coverage
- **100%** coverage for security functions
- **95%+** coverage for utility functions
- **90%+** coverage for API clients

### Test Patterns
```typescript
describe('sanitizeHTML', () => {
  it('removes malicious scripts', () => {
    const maliciousContent = '<script>alert("xss")</script><p>Safe content</p>'
    const result = sanitizeHTML(maliciousContent)
    
    expect(result).not.toContain('<script>')
    expect(result).toContain('<p>Safe content</p>')
  })

  it('preserves allowed tags', () => {
    const content = '<p>Text with <strong>emphasis</strong> and <a href="/">link</a></p>'
    const result = sanitizeHTML(content)
    
    expect(result).toBe(content)
  })
})
```

## 📝 Documentation Standards

### Function Documentation
```typescript
/**
 * Generates AI-powered article summary
 * @param content - The full article content
 * @param maxLength - Maximum summary length (default: 200)
 * @returns Promise resolving to generated summary
 * @throws APIError when AI service is unavailable
 */
export async function generateAISummary(
  content: string, 
  maxLength: number = 200
): Promise<string> {
  // Implementation...
}
```

## 🔄 Integration Patterns

### AI Service Integration
```typescript
// OpenAI integration pattern
export class AIContentService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Only for client-side demo
    })
  }

  async summarizeArticle(content: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'Summarize this AI news article in 2-3 sentences.'
      }, {
        role: 'user',
        content
      }],
      max_tokens: 100
    })

    return response.choices[0]?.message?.content || 'Summary unavailable'
  }
}
```

---

**Focus Areas**: Type safety, security validation, comprehensive error handling, and AI service integration.
