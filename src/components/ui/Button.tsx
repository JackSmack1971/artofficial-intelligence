import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ai-primary' | 'ai-secondary' | 'neural' | 'default'
  aiPowered?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  aiPowered = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'transition-all duration-200 rounded-md px-4 py-2',
        variant === 'ai-primary' &&
          'bg-gradient-to-r from-ai-primary to-ai-secondary text-white hover:from-ai-primary/90 hover:to-ai-secondary/90',
        variant === 'ai-secondary' &&
          'bg-ai-secondary text-white hover:bg-ai-secondary/90',
        variant === 'neural' &&
          'bg-gradient-to-r from-ai-accent to-ai-primary text-white hover:from-ai-accent/90 hover:to-ai-primary/90',
        aiPowered &&
          'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000',
        className
      )}
      {...props}
    >
      {aiPowered && <span className="mr-2 text-xs">🤖</span>}
      {children}
    </button>
  )
}
