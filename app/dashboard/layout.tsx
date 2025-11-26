import { CreditDisplay } from '@/components/dashboard/credit-display'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold text-lg">E-Comm Gen</Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">Products</Link>
              <Link href="/dashboard/create" className="hover:text-foreground">Create</Link>
              <Link href="/dashboard/credits" className="hover:text-foreground">Buy Credits</Link>
              <Link href="/dashboard/account" className="hover:text-foreground">Account</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <CreditDisplay />
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  )
}

