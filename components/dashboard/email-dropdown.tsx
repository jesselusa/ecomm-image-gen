'use client'

import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface EmailDropdownProps {
  email: string
}

export function EmailDropdown({ email }: EmailDropdownProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {email}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-1"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        align="end"
      >
        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard/account"
            className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left font-medium"
            onClick={() => setOpen(false)}
          >
            Account settings
          </Link>
          <div className="h-[1px] bg-border my-1" />
          <button
            onClick={handleSignOut}
            className="block w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
