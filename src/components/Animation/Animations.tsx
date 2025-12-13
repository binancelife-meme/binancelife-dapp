'use client'

import { useEffect, useState } from 'react'

interface FloatingCoinProps {
  delay?: number
  duration?: number
  size?: 'sm' | 'md' | 'lg'
}

export function FloatingCoin({ delay = 0, duration = 3, size = 'md' }: FloatingCoinProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ left: 50, top: 50 })

  useEffect(() => {
    // Set random position on client side only
    setPosition({
      left: Math.random() * 100,
      top: Math.random() * 100
    })
    
    const timer = setTimeout(() => setIsVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div 
      className={`absolute pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 animate-float`}
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        animationDuration: `${duration}s`
      }}
    >
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-400/50 animate-spin`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  )
}

interface GlowEffectProps {
  children: React.ReactNode
  color?: 'yellow' | 'orange' | 'red' | 'purple' | 'blue'
  intensity?: 'subtle' | 'normal' | 'strong'
}

export function GlowEffect({ children, color = 'yellow', intensity = 'normal' }: GlowEffectProps) {
  const colorMap = {
    yellow: 'shadow-yellow-400/50',
    orange: 'shadow-orange-400/50',
    red: 'shadow-red-400/50',
    purple: 'shadow-purple-400/50',
    blue: 'shadow-blue-400/50'
  }

  const intensityMap = {
    subtle: 'shadow-lg',
    normal: 'shadow-xl',
    strong: 'shadow-2xl'
  }

  return (
    <div className={`${intensityMap[intensity]} ${colorMap[color]} transition-all duration-300 hover:scale-105`}>
      {children}
    </div>
  )
}

interface ShimmerEffectProps {
  children: React.ReactNode
  className?: string
}

export function ShimmerEffect({ children, className = '' }: ShimmerEffectProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
      {children}
    </div>
  )
}

interface PulseBadgeProps {
  children: React.ReactNode
  color?: 'yellow' | 'orange' | 'red' | 'green' | 'blue'
  speed?: 'slow' | 'normal' | 'fast'
}

export function PulseBadge({ children, color = 'yellow', speed = 'normal' }: PulseBadgeProps) {
  const colorMap = {
    yellow: 'bg-yellow-400 text-black',
    orange: 'bg-orange-400 text-black',
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white'
  }

  const speedMap = {
    slow: 'animate-pulse',
    normal: 'animate-pulse',
    fast: 'animate-bounce'
  }

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${colorMap[color]} ${speedMap[speed]}`}>
      {children}
    </div>
  )
}

// CSS animations defined in global styles or a separate CSS file