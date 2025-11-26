'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Chrome } from 'lucide-react'

export function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Button onClick={handleLogin} size="lg" className="gap-2">
      <Chrome className="h-5 w-5" />
      Sign in with Google
    </Button>
  )
}

