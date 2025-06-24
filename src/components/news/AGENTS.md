# News Components Development Guide

## 📋 Purpose
Components specifically for news article display, management, and AI-enhanced features in the ArtOfficial Intelligence platform.

## 🏗️ News Component Architecture

### Article Card Pattern
```typescript
interface NewsArticleCardProps {
  article: NewsArticle
  variant?: 'compact' | 'featured' | 'detailed'
  showAIBadge?: boolean
  onRead?: (articleId: string) => void
  onShare?: (article: NewsArticle) => void
}

export const NewsArticleCard = ({ 
  article, 
  variant = 'compact',
  showAIBadge = true,
  onRead,
  onShare 
}: NewsArticleCardProps) => {
  const readingTime = calculateReadingTime(article.content)
  
  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg cursor-pointer',
      variant === 'featured' && 'md:col-span-2 lg:col-span-3',
      article.aiGenerated && 'border-l-4 border-l-ai-accent'
    )}>
      {article.imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {showAIBadge && article.aiGenerated && (
            <Badge className="absolute top-2 right-2 bg-ai-accent text-white">
              🤖 AI Generated
            </Badge>
          )}
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline">{article.category}</Badge>
          <span className="text-xs text-muted-foreground">{readingTime} min read</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-ai-primary transition-colors">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
          {article.summary || truncateText(article.content, 150)}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={article.author.avatar} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{article.author.name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onShare?.(article)
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRead?.(article.id)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### News List Component
```typescript
interface NewsListProps {
  articles: NewsArticle[]
  loading?: boolean
  layout?: 'grid' | 'list' | 'masonry'
  showFilters?: boolean
  onLoadMore?: () => void
}

export const NewsList = ({ 
  articles, 
  loading = false,
  layout = 'grid',
  showFilters = true,
  onLoadMore 
}: NewsListProps) => {
  const [filters, setFilters] = useState<NewsFilters>({
    category: 'all',
    sortBy: 'publishedAt',
    aiGenerated: 'all'
  })

  const filteredArticles = useMemo(() => 
    filterAndSortArticles(articles, filters), [articles, filters]
  )

  return (
    <div className="space-y-6">
      {showFilters && (
        <NewsFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          resultCount={filteredArticles.length}
        />
      )}
      
      <div className={cn(
        'gap-6',
        layout === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        layout === 'list' && 'flex flex-col',
        layout === 'masonry' && 'columns-1 md:columns-2 lg:columns-3'
      )}>
        {filteredArticles.map((article) => (
          <NewsArticleCard
            key={article.id}
            article={article}
            variant={article.featured ? 'featured' : 'compact'}
          />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <AILoadingSpinner message="Loading more AI news..." />
        </div>
      )}
      
      {onLoadMore && !loading && (
        <div className="flex justify-center">
          <Button onClick={onLoadMore} variant="outline">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  )
}
```

## 🤖 AI-Enhanced Features

### AI Summary Component
```typescript
interface AISummaryProps {
  articleId: string
  content: string
  onSummaryGenerated?: (summary: string) => void
}

export const AISummary = ({ articleId, content, onSummaryGenerated }: AISummaryProps) => {
  const [summary, setSummary] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string>('')

  const generateSummary = async () => {
    setGenerating(true)
    setError('')
    
    try {
      const aiService = new AIContentService()
      const generatedSummary = await aiService.summarizeArticle(content)
      setSummary(generatedSummary)
      onSummaryGenerated?.(generatedSummary)
    } catch (err) {
      setError('Failed to generate AI summary')
      console.error('AI summary generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card className="border-ai-accent/20 bg-gradient-to-r from-ai-primary/5 to-ai-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          🤖 AI Summary
          {!summary && (
            <Button 
              onClick={generateSummary} 
              disabled={generating}
              size="sm"
              variant="outline"
            >
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      {summary && (
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </CardContent>
      )}
      
      {error && (
        <CardContent>
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      )}
    </Card>
  )
}
```

### Related Articles Component
```typescript
export const RelatedArticles = ({ currentArticle }: { currentArticle: NewsArticle }) => {
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const aiService = new AIContentService()
        const related = await aiService.findRelatedArticles(
          currentArticle.id,
          currentArticle.tags,
          currentArticle.category
        )
        setRelatedArticles(related.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch related articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [currentArticle])

  if (loading) {
    return <AILoadingSpinner message="Finding related articles..." />
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        🔗 Related Articles
        <Badge variant="secondary" className="text-xs">AI Curated</Badge>
      </h3>
      
      <div className="grid gap-4">
        {relatedArticles.map((article) => (
          <NewsArticleCard
            key={article.id}
            article={article}
            variant="compact"
            showAIBadge={false}
          />
        ))}
      </div>
    </div>
  )
}
```

## 📊 Analytics Integration

### Reading Analytics
```typescript
export const useReadingAnalytics = () => {
  const trackArticleView = useCallback((articleId: string) => {
    // Track article views for recommendation engine
    analytics.track('Article Viewed', {
      articleId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })
  }, [])

  const trackReadingTime = useCallback((articleId: string, timeSpent: number) => {
    analytics.track('Reading Time', {
      articleId,
      timeSpent,
      engagementLevel: timeSpent > 60 ? 'high' : timeSpent > 30 ? 'medium' : 'low'
    })
  }, [])

  return { trackArticleView, trackReadingTime }
}
```

## 🧪 Testing Patterns

### Component Testing
```typescript
describe('NewsArticleCard', () => {
  const mockArticle: NewsArticle = {
    id: '1',
    title: 'Latest AI Breakthrough',
    content: 'This is test content...',
    summary: 'Test summary',
    author: { name: 'AI Reporter', avatar: '/avatar.jpg' },
    category: 'AI Research',
    tags: ['machine-learning', 'breakthrough'],
    aiGenerated: true,
    publishedAt: '2024-01-01T00:00:00Z'
  }

  it('displays AI badge for AI-generated articles', () => {
    render(<NewsArticleCard article={mockArticle} />)
    expect(screen.getByText('🤖 AI Generated')).toBeInTheDocument()
  })

  it('handles click events correctly', () => {
    const onRead = jest.fn()
    render(<NewsArticleCard article={mockArticle} onRead={onRead} />)
    
    fireEvent.click(screen.getByRole('button', { name: /external link/i }))
    expect(onRead).toHaveBeenCalledWith('1')
  })
})
```

---

**Focus Areas**: AI integration, performance optimization, accessibility, and comprehensive news display features.
