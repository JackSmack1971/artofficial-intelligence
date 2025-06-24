# ArtOfficial Intelligence News Website - Development Guide

## 🎯 Project Overview

**Mission**: Create a cutting-edge AI news platform that aggregates, analyzes, and presents artificial intelligence news, research, and insights in an engaging, accessible format.

**Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
**Deployment**: Optimized for Netlify and Vercel
**Security**: OWASP Top 10 compliant with modern web security practices

## 📁 Repository Structure Guide

### Key Directories
- `src/components/` - Reusable React components organized by domain
- `src/pages/` - Route-level components for main application views
- `src/hooks/` - Custom React hooks for business logic
- `src/lib/` - Utilities, API clients, validation, and security functions
- `src/types/` - TypeScript type definitions
- `server/` - Optional Express.js backend for advanced features
- `tests/` - Comprehensive test suites

### Navigation Tips
- Use `@/` alias for `src/` imports (configured in vite.config.ts)
- Reference component patterns from existing implementations
- Check AGENTS.md files in subdirectories for specific guidelines
- Use file naming convention: PascalCase for components, camelCase for utilities

## 🛠️ Development Environment Setup

### Prerequisites
```bash
# Node.js 18+ required
node --version  # Should be v18.0.0 or higher

# Install pnpm (preferred package manager)
npm install -g pnpm

# Verify pnpm installation
pnpm --version
```

### Quick Start
```bash
# Clone and setup
git clone <repository-url>
cd artofficial-intelligence
pnpm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Required Environment Variables
```env
VITE_APP_NAME=ArtOfficial Intelligence
VITE_API_BASE_URL=https://api.artofficial-intelligence.com
VITE_NEWS_API_KEY=your_news_api_key
VITE_AI_API_KEY=your_openai_api_key
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

## 🎨 Design System & UI Guidelines

### Component Architecture
- **Atomic Design**: Atoms (ui/), Molecules (common/), Organisms (layout/)
- **shadcn/ui Integration**: Use components from `src/components/ui/`
- **Consistent Styling**: Tailwind CSS with custom design tokens
- **Responsive First**: Mobile-first responsive design approach

### Styling Conventions
```tsx
// ✅ Preferred: Use Tailwind classes with consistent spacing
const ArticleCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
      Article Title
    </h2>
    <p className="text-gray-600 dark:text-gray-300 text-sm">
      Article description...
    </p>
  </div>
)

// ❌ Avoid: Inline styles or inconsistent class patterns
```

### Color Palette
- **Primary**: AI-inspired blue (#3B82F6)
- **Secondary**: Neural network purple (#8B5CF6)
- **Accent**: Electric green (#10B981)
- **Dark Mode**: True dark with proper contrast ratios

## 🔒 Security Implementation Requirements

### Input Validation & Sanitization
```typescript
// Always validate user inputs using Zod schemas
import { z } from 'zod'

const ArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum(['AI Research', 'Industry News', 'Tools', 'Analysis']),
  tags: z.array(z.string()).max(10)
})

// Sanitize HTML content
import DOMPurify from 'dompurify'

const sanitizeContent = (content: string) => 
  DOMPurify.sanitize(content, { ALLOWED_TAGS: ['p', 'strong', 'em', 'a'] })
```

### Content Security Policy (CSP)
Implement in `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data: https:;
               connect-src 'self' https://api.artofficial-intelligence.com;">
```

### API Security
```typescript
// Implement rate limiting and request validation
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = getSecureToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 📊 Data Management Patterns

### News Article Data Structure
```typescript
interface NewsArticle {
  id: string
  title: string
  content: string
  summary: string
  author: Author
  publishedAt: string
  updatedAt: string
  category: NewsCategory
  tags: string[]
  aiGenerated: boolean
  sources: Source[]
  readingTime: number
  featured: boolean
}
```

### State Management
```typescript
// Use Zustand for global state management
import { create } from 'zustand'

interface NewsStore {
  articles: NewsArticle[]
  categories: NewsCategory[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchArticles: () => Promise<void>
  addArticle: (article: NewsArticle) => void
  updateArticle: (id: string, updates: Partial<NewsArticle>) => void
}

const useNewsStore = create<NewsStore>((set, get) => ({
  // Implementation details in src/hooks/useNews.ts
}))
```

## 🧪 Testing Strategy

### Test Coverage Requirements
- **Unit Tests**: All utility functions, hooks, and business logic
- **Component Tests**: User interactions and rendering logic
- **Integration Tests**: API endpoints and data flow
- **E2E Tests**: Critical user journeys

### Testing Patterns
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react'
import { ArticleCard } from '../ArticleCard'

describe('ArticleCard', () => {
  const mockArticle = {
    title: 'Test Article',
    summary: 'Test summary',
    // ... other required fields
  }

  it('displays article information correctly', () => {
    render(<ArticleCard article={mockArticle} />)
    
    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('Test summary')).toBeInTheDocument()
  })

  it('handles click events properly', () => {
    const onClickMock = jest.fn()
    render(<ArticleCard article={mockArticle} onClick={onClickMock} />)
    
    fireEvent.click(screen.getByRole('article'))
    expect(onClickMock).toHaveBeenCalledWith(mockArticle.id)
  })
})
```

## 🚀 Deployment Configuration

### Netlify Setup (`netlify.toml`)
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Vercel Setup (`vercel.json`)
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 📈 Performance Optimization

### Bundle Optimization
```typescript
// Implement code splitting with React.lazy
const AITools = lazy(() => import('../pages/AITools'))
const NewsDetail = lazy(() => import('../pages/NewsDetail'))

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/ai-tools" element={<AITools />} />
    <Route path="/news/:id" element={<NewsDetail />} />
  </Routes>
</Suspense>
```

### Image Optimization
```typescript
// Use modern image formats with fallbacks
const OptimizedImage = ({ src, alt, ...props }) => (
  <picture>
    <source srcSet={`${src}.webp`} type="image/webp" />
    <source srcSet={`${src}.avif`} type="image/avif" />
    <img src={`${src}.jpg`} alt={alt} loading="lazy" {...props} />
  </picture>
)
```

## 🔄 CI/CD Pipeline Requirements

### GitHub Actions Workflow
- **Security Audit**: Dependency scanning and vulnerability checks
- **Type Checking**: Strict TypeScript validation
- **Testing**: Comprehensive test suite execution
- **Build Verification**: Production build success
- **Deployment**: Automated deployment to staging/production

### Quality Gates
- All tests must pass
- TypeScript strict mode compliance
- ESLint security rules passing
- No high-severity vulnerabilities
- Lighthouse score >90

## 📝 Pull Request Guidelines

### PR Title Format
```
[Component/Feature]: Brief description of changes

Examples:
[ArticleCard]: Add social sharing functionality
[Security]: Implement CSP headers
[Performance]: Optimize image loading
```

### PR Description Template
```markdown
## Changes Made
- [ ] Describe specific changes
- [ ] Include any breaking changes
- [ ] Note any dependencies

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Security implications reviewed

## Deployment Notes
- [ ] Environment variables updated
- [ ] Database migrations (if applicable)
- [ ] Feature flags configured
```

## 🆘 Troubleshooting Guide

### Common Issues
```bash
# TypeScript errors
pnpm run type-check

# Dependency conflicts
rm -rf node_modules pnpm-lock.yaml && pnpm install

# Build failures
pnpm run build --verbose

# Test failures
pnpm test --reporter=verbose
```

### Development Server Issues
```bash
# Port conflicts
lsof -i :5173
kill -9 <PID>

# Clear Vite cache
rm -rf node_modules/.vite

# Reset environment
cp .env.example .env.local
```

## 📚 Learning Resources

### Documentation
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/
- **shadcn/ui**: https://ui.shadcn.com/

### AI/ML Integration
- **OpenAI API**: https://platform.openai.com/docs
- **Hugging Face**: https://huggingface.co/docs
- **News APIs**: NewsAPI, Guardian API, Reddit API

---

## 🎯 Success Metrics

### Technical Excellence
- Zero critical security vulnerabilities
- 95%+ TypeScript coverage
- <3s page load times
- 100% accessibility compliance

### User Experience
- Intuitive navigation
- Engaging AI-powered features
- Mobile-responsive design
- Fast content discovery

**Remember**: This is an AI news platform - embrace cutting-edge technologies while maintaining security and performance standards. Every feature should showcase the potential of artificial intelligence in news and content creation.
