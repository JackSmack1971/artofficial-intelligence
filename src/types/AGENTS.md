# TypeScript Type Definitions Guide

## 📋 Purpose
Comprehensive type definitions for the ArtOfficial Intelligence platform, ensuring type safety across all components and APIs.

## 🏗️ Core Type Architecture

### News Article Types
```typescript
// Base article interface
export interface NewsArticle {
  id: string
  title: string
  content: string
  summary?: string
  excerpt?: string
  
  // Metadata
  slug: string
  publishedAt: string
  updatedAt: string
  
  // Author information
  author: Author
  
  // Categorization
  category: NewsCategory
  tags: string[]
  
  // AI-specific fields
  aiGenerated: boolean
  aiSummary?: string
  sentimentAnalysis?: SentimentAnalysis
  
  // Media
  imageUrl?: string
  imageAlt?: string
  videoUrl?: string
  
  // Engagement
  readingTime: number
  viewCount: number
  shareCount: number
  featured: boolean
  
  // SEO
  metaDescription?: string
  metaKeywords?: string[]
  
  // Sources
  sources: Source[]
  originalUrl?: string
}

// Author information
export interface Author {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  socialLinks: SocialLinks
  expertise: string[]
  verified: boolean
}

// News categories
export type NewsCategory = 
  | 'AI Research'
  | 'Industry News' 
  | 'Tools & Platforms'
  | 'Analysis & Opinion'
  | 'Regulations & Policy'
  | 'Startups & Funding'
  | 'Ethics & Society'
  | 'Technical Tutorials'

// Article sources
export interface Source {
  id: string
  name: string
  url: string
  reliability: number // 0-100
  type: 'primary' | 'secondary' | 'reference'
}
```

### AI Integration Types
```typescript
// AI service responses
export interface AIAnalysisResult {
  summary: string
  keyPoints: string[]
  sentiment: SentimentAnalysis
  tags: string[]
  relatedTopics: string[]
  confidence: number
  processingTime: number
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  reasoning: string
  emotionalTone?: EmotionalTone[]
}

export interface EmotionalTone {
  emotion: 'joy' | 'anger' | 'fear' | 'surprise' | 'sadness' | 'anticipation'
  intensity: number // 0-1
}

// AI content generation
export interface AIContentRequest {
  type: 'summary' | 'tags' | 'questions' | 'analysis'
  content: string
  options?: {
    maxLength?: number
    style?: 'formal' | 'casual' | 'technical'
    audience?: 'general' | 'technical' | 'academic'
  }
}

export interface AIContentResponse {
  content: string
  metadata: {
    model: string
    tokenCount: number
    processingTime: number
    confidence: number
  }
  error?: string
}
```

### User & Authentication Types
```typescript
export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  
  // Profile
  bio?: string
  location?: string
  website?: string
  socialLinks: SocialLinks
  
  // Preferences
  preferences: UserPreferences
  
  // Subscription
  subscription: SubscriptionTier
  
  // Metadata
  createdAt: string
  lastActiveAt: string
  emailVerified: boolean
  accountStatus: 'active' | 'suspended' | 'pending'
  
  // AI features
  aiUsageLimit: number
  aiUsageCount: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  
  // Content preferences
  categories: NewsCategory[]
  sources: string[]
  aiFeatures: boolean
  
  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  newsletterSubscription: boolean
  
  // Privacy
  profileVisibility: 'public' | 'private'
  dataProcessing: boolean
}

export interface SocialLinks {
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

// Authentication
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  username: string
  password: string
  displayName: string
  acceptTerms: boolean
  subscribeNewsletter?: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresAt: string
}
```

### API Response Types
```typescript
// Generic API response wrapper
export interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: PaginationInfo
  metadata?: ResponseMetadata
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ResponseMetadata {
  timestamp: string
  requestId: string
  processingTime: number
  version: string
  rateLimit?: RateLimitInfo
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  resetTime: string
}

// Error types
export interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
  statusCode: number
  timestamp: string
}

export interface ValidationError {
  field: string
  message: string
  value?: unknown
}
```

### Component Props Types
```typescript
// Generic component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

// Loading states
export interface LoadingProps {
  loading?: boolean
  error?: string | null
  skeleton?: boolean
  fallback?: React.ReactNode
}

// Interactive component props
export interface InteractiveProps {
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
}

// Form component types
export interface FormFieldProps extends BaseComponentProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
}

// News-specific component props
export interface NewsComponentProps extends BaseComponentProps {
  variant?: 'compact' | 'detailed' | 'featured'
  showAuthor?: boolean
  showCategory?: boolean
  showReadingTime?: boolean
  showAIBadge?: boolean
}
```

### Search & Filter Types
```typescript
export interface SearchQuery {
  query: string
  category?: NewsCategory
  tags?: string[]
  author?: string
  dateRange?: DateRange
  sortBy?: SortOption
  aiGenerated?: boolean
}

export interface DateRange {
  start: string
  end: string
}

export type SortOption = 
  | 'publishedAt'
  | 'updatedAt'
  | 'relevance'
  | 'popularity'
  | 'readingTime'

export interface SearchResult {
  articles: NewsArticle[]
  totalCount: number
  facets: SearchFacets
  suggestions?: string[]
  searchTime: number
}

export interface SearchFacets {
  categories: FacetCount[]
  authors: FacetCount[]
  tags: FacetCount[]
  sources: FacetCount[]
}

export interface FacetCount {
  value: string
  count: number
}
```

### Real-time & WebSocket Types
```typescript
export interface NewsUpdate {
  type: 'new_article' | 'article_updated' | 'breaking_news'
  article: NewsArticle
  timestamp: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface WebSocketMessage {
  id: string
  type: string
  payload: unknown
  timestamp: string
}

export interface ConnectionStatus {
  connected: boolean
  reconnecting: boolean
  lastConnected?: string
  retryCount: number
}
```

### Analytics & Tracking Types
```typescript
export interface AnalyticsEvent {
  name: string
  properties: Record<string, unknown>
  userId?: string
  sessionId: string
  timestamp: string
}

export interface UserInteraction {
  type: 'view' | 'click' | 'share' | 'bookmark' | 'comment'
  targetId: string
  targetType: 'article' | 'author' | 'category'
  metadata?: Record<string, unknown>
}

export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}
```

## 🛡️ Type Validation & Guards

### Type Guards
```typescript
// Article validation
export const isNewsArticle = (obj: unknown): obj is NewsArticle => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'content' in obj &&
    'author' in obj &&
    'publishedAt' in obj &&
    typeof (obj as NewsArticle).id === 'string' &&
    typeof (obj as NewsArticle).title === 'string'
  )
}

// User validation
export const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'username' in obj &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).email === 'string'
  )
}

// API response validation
export const isAPIResponse = <T>(obj: unknown): obj is APIResponse<T> => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    'data' in obj &&
    typeof (obj as APIResponse<T>).success === 'boolean'
  )
}
```

### Zod Schemas for Runtime Validation
```typescript
import { z } from 'zod'

// Article schema
export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(50),
  summary: z.string().optional(),
  slug: z.string().min(1),
  publishedAt: z.string().datetime(),
  author: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email()
  }),
  category: z.enum([
    'AI Research',
    'Industry News',
    'Tools & Platforms',
    'Analysis & Opinion',
    'Regulations & Policy',
    'Startups & Funding',
    'Ethics & Society',
    'Technical Tutorials'
  ]),
  tags: z.array(z.string()).max(10),
  aiGenerated: z.boolean(),
  readingTime: z.number().positive(),
  featured: z.boolean()
})

// User registration schema
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  displayName: z.string().min(1).max(50),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
  subscribeNewsletter: z.boolean().optional()
})

// Search query schema
export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(100),
  category: z.enum([
    'AI Research',
    'Industry News',
    'Tools & Platforms',
    'Analysis & Opinion',
    'Regulations & Policy',
    'Startups & Funding',
    'Ethics & Society',
    'Technical Tutorials'
  ]).optional(),
  tags: z.array(z.string()).max(5).optional(),
  author: z.string().optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  }).optional(),
  sortBy: z.enum(['publishedAt', 'updatedAt', 'relevance', 'popularity']).optional(),
  aiGenerated: z.boolean().optional()
})
```

## 🎯 Type Utilities

### Generic Utility Types
```typescript
// Make specific fields optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Make specific fields required
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>

// Extract function parameters
export type FunctionParams<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never

// Create variants of base types
export type ArticlePreview = Pick<NewsArticle, 'id' | 'title' | 'summary' | 'author' | 'publishedAt' | 'category' | 'readingTime'>
export type ArticleMetadata = Pick<NewsArticle, 'id' | 'title' | 'slug' | 'publishedAt' | 'updatedAt'>

// API endpoint types
export type CreateArticleRequest = Omit<NewsArticle, 'id' | 'publishedAt' | 'updatedAt' | 'viewCount' | 'shareCount'>
export type UpdateArticleRequest = PartialBy<NewsArticle, 'id' | 'publishedAt' | 'author'>

// Form types
export type LoginFormData = Pick<LoginCredentials, 'email' | 'password' | 'rememberMe'>
export type ProfileFormData = Pick<User, 'displayName' | 'bio' | 'location' | 'website'>
```

### Component Type Helpers
```typescript
// Extract component props
export type ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> = 
  T extends React.JSXElementConstructor<infer P> ? P : 
  T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : never

// Create polymorphic component types
export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref']

export type PolymorphicComponentProps<C extends React.ElementType, Props = {}> = React.PropsWithChildren<Props & {
  as?: C
}> & Omit<React.ComponentPropsWithoutRef<C>, keyof Props>

export type PolymorphicComponentPropsWithRef<C extends React.ElementType, Props = {}> = PolymorphicComponentProps<C, Props> & {
  ref?: PolymorphicRef<C>
}
```

## 🧪 Testing Type Helpers

### Mock Types
```typescript
// Create mock data types
export type MockArticle = Partial<NewsArticle> & Pick<NewsArticle, 'id' | 'title'>
export type MockUser = Partial<User> & Pick<User, 'id' | 'email'>

// Test utilities
export interface TestComponentProps {
  mockData?: unknown
  mockFunctions?: Record<string, jest.Mock>
  testId?: string
}

export interface MockAPIResponse<T> {
  success: boolean
  data: T
  delay?: number
  shouldFail?: boolean
}
```

---

**Focus Areas**: Type safety, runtime validation, comprehensive coverage, and developer experience optimization.
