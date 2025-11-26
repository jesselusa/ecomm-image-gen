import { LoginButton } from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>E-Comm Gen</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Pricing</Button>
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="flex flex-col items-center text-center gap-8">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
              Generate Professional Product Photos in <span className="text-primary">Seconds</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl">
              Transform boring product shots into high-converting e-commerce imagery using advanced AI. No studio required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Button variant="outline" size="lg">View Examples</Button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container py-24 bg-muted/50 rounded-3xl">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="p-2 w-fit rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Studio Quality</h3>
              <p className="text-muted-foreground">
                Get professional lighting and composition without the expensive equipment.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-2 w-fit rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Instant Backgrounds</h3>
              <p className="text-muted-foreground">
                Place your product in any setting imaginable with a simple text prompt.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-2 w-fit rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Conversion Focused</h3>
              <p className="text-muted-foreground">
                Designed specifically for e-commerce platforms like Shopify and Etsy.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container flex flex-col md:flex-row justify-between gap-8">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>E-Comm Gen</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 E-Comm Gen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
