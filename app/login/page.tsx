import { AuthForm } from '@/components/auth/auth-form'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 font-semibold text-lg">
        <Sparkles className="h-6 w-6 text-primary" />
        <span>E-Comm Gen</span>
      </Link>
      <AuthForm />
    </div>
  )
}

