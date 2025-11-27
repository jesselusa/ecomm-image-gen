'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Trash2, User, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function AccountPage() {
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUser()
  }, [supabase])

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and all generated images. This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete account')

      await supabase.auth.signOut()
      toast.success('Account deleted successfully')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and account preferences.
        </p>
      </div>
      
      <Separator />

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="grid gap-6 md:grid-cols-[200px_1fr]">
          <div className="text-sm">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </h3>
            <p className="text-muted-foreground">
              Your personal information and contact details.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your email address serves as your primary identity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="email" value={userEmail || ''} disabled className="pl-9" />
                  </div>
                </div>
                <p className="text-[0.8rem] text-muted-foreground">
                  This is the email address you use to sign in.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Danger Zone */}
        <section className="grid gap-6 md:grid-cols-[200px_1fr]">
          <div className="text-sm text-red-600/80">
            <h3 className="font-medium mb-2 flex items-center gap-2 text-red-600">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </h3>
            <p>
              Irreversible actions regarding your account.
            </p>
          </div>
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
            <CardHeader>
              <CardTitle className="text-red-600">Delete account</CardTitle>
              <CardDescription className="text-red-600/80">
                Permanently delete your account and all generated images.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete account
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
