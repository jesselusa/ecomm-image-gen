import { AuthForm } from '@/components/auth/auth-form'
import Link from 'next/link'
import { FadeIn } from '@/components/marketing/fade-in'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Login - Palette',
  description: 'Sign in or create an account to generate professional product photography with AI.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column - Marketing/Visual */}
      <div className="hidden lg:flex flex-col justify-between bg-muted/30 p-10 lg:p-16 border-r">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="relative h-16 w-48">
            <Image 
              src="/logo.png"  
              alt="Palette" 
              fill 
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <div className="max-w-lg">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Create professional product photography in seconds
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of e-commerce merchants using AI to boost their conversion rates and save on photography costs.
            </p>
          </FadeIn>
        </div>

        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Palette Pics. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-16 bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden mb-8 text-center flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold text-xl">
              <div className="relative h-16 w-48">
                <Image 
                  src="/logo.png" 
                  alt="Palette" 
                  fill 
                  className="object-contain object-center"
                  priority
                />
              </div>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </div>

          <AuthForm />

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
