'use client'

import { Progress } from '@/components/ui/progress'
import { useMemo } from 'react'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length > 8) score += 20
    if (password.length > 12) score += 20
    if (/[A-Z]/.test(password)) score += 20
    if (/[0-9]/.test(password)) score += 20
    if (/[^A-Za-z0-9]/.test(password)) score += 20
    return score
  }, [password])

  const color = useMemo(() => {
    if (strength < 40) return 'bg-red-500'
    if (strength < 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }, [strength])

  const label = useMemo(() => {
    if (strength === 0) return ''
    if (strength < 40) return 'Weak'
    if (strength < 80) return 'Medium'
    return 'Strong'
  }, [strength])

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${color}`} 
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  )
}



