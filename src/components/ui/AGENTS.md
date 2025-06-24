# UI Components Development Guide

## 📋 Purpose
shadcn/ui component implementations and customizations for the ArtOfficial Intelligence platform design system.

## 🎨 Design System Integration

### Component Customization Pattern
```typescript
// Extend shadcn/ui components with platform-specific styling
import { Button as BaseButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AIButtonProps extends React.ComponentProps<typeof BaseButton> {
  variant?: 'ai-primary' | 'ai-secondary' | 'neural' | 'default'
  aiPowered?: boolean
}

export const Button = ({ 
  variant = 'default', 
  aiPowered = false, 
  className, 
  children, 
  ...props 
}: AIButtonProps) => {
  return (
    <BaseButton
      className={cn(
        // Base styling
        'transition-all duration-200',
        // AI-specific variants
        variant === 'ai-primary' && 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
        variant === 'neural' && 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600',
        // AI powered indicator
        aiPowered && 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000',
        className
      )}
      {...props}
    >
      {aiPowered && (
        <span className="mr-2 text-xs">🤖</span>
      )}
      {children}
    </BaseButton>
  )
}
```

### Color System
```css
/* AI-themed color palette for dark/light modes */
:root {
  --ai-primary: 220 100% 60%;         /* Blue */
  --ai-secondary: 270 100% 70%;       /* Purple */
  --ai-accent: 145 100% 60%;          /* Green */
  --ai-neural: 200 100% 50%;          /* Cyan */
  --ai-warning: 35 100% 60%;          /* Orange */
  --ai-surface: 220 15% 95%;          /* Light gray */
  --ai-background: 0 0% 100%;         /* White */
}

[data-theme="dark"] {
  --ai-surface: 220 15% 10%;          /* Dark gray */
  --ai-background: 220 20% 5%;        /* Very dark */
}
```

## 🧩 Component Architecture

### Card Component Pattern
```typescript
// Consistent card styling for AI content
interface AICardProps {
  title: string
  content: string
  aiGenerated?: boolean
  featured?: boolean
  children?: React.ReactNode
}

export const AICard = ({ 
  title, 
  content, 
  aiGenerated = false, 
  featured = false,
  children 
}: AICardProps) => {
  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg',
      featured && 'ring-2 ring-ai-primary/50 bg-gradient-to-br from-ai-primary/5 to-ai-secondary/5',
      aiGenerated && 'border-ai-accent/50'
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {aiGenerated && <span className="text-ai-accent">🤖</span>}
          {title}
          {featured && <Badge variant="secondary">Featured</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{content}</p>
        {children}
      </CardContent>
    </Card>
  )
}
```

## 🔧 Component Guidelines

### Accessibility Requirements
- **Always** include proper ARIA labels
- **Ensure** keyboard navigation support
- **Maintain** color contrast ratios >4.5:1
- **Test** with screen readers

### TypeScript Standards
```typescript
// Comprehensive prop interfaces
interface ComponentProps {
  // Required props first
  id: string
  title: string
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  
  // Event handlers
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void
  
  // Flexible content
  children?: React.ReactNode
  className?: string
}
```

### Performance Optimization
```typescript
// Memoize expensive components
export const AIAnalyticsChart = memo(({ data, config }: ChartProps) => {
  const chartData = useMemo(() => 
    processChartData(data), [data]
  )
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        {/* Chart implementation */}
      </LineChart>
    </ResponsiveContainer>
  )
})
```

## 🎯 Specific Component Requirements

### Form Components
```typescript
// AI-enhanced form inputs with validation
export const AIInput = forwardRef<HTMLInputElement, AIInputProps>(
  ({ aiSuggestions = false, ...props }, ref) => {
    const [suggestions, setSuggestions] = useState<string[]>([])
    
    return (
      <div className="relative">
        <Input ref={ref} {...props} />
        {aiSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => props.onChange?.(suggestion)}
              >
                🤖 {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
```

### Loading Components
```typescript
// AI-themed loading animations
export const AILoadingSpinner = ({ message = 'Processing with AI...' }) => (
  <div className="flex flex-col items-center gap-4 p-8">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-ai-primary/20 rounded-full animate-spin border-t-ai-primary"></div>
      <div className="absolute inset-2 border-2 border-ai-secondary/20 rounded-full animate-spin-reverse border-r-ai-secondary"></div>
    </div>
    <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
  </div>
)
```

---

**Focus Areas**: Consistent AI theming, accessibility compliance, performance optimization, and shadcn/ui integration.
