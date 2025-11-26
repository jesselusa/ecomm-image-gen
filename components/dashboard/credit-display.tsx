'use client'

import { createClient } from '@/lib/supabase/client'
import { Coins } from 'lucide-react'
import { useEffect, useState } from 'react'

export function CreditDisplay() {
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    const fetchCredits = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', user.id)
        .single()

      if (data) {
        setCredits(data.credits_balance)
      }
    }

    fetchCredits()
  }, [])

  if (credits === null) return null

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
      <Coins className="h-4 w-4 text-yellow-500" />
      <span>{credits} Credits</span>
    </div>
  )
}

