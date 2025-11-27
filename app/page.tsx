import { HeroSection } from '@/components/marketing/hero-section'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { BeforeAfterGallery } from '@/components/marketing/before-after-gallery'
import { FeaturesSection } from '@/components/marketing/features-section'
import { StatsSection } from '@/components/marketing/stats-section'
import { FAQSection } from '@/components/marketing/faq-section'
import { Footer } from '@/components/marketing/footer'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Palette | AI Product Photography Generator',
  description: 'Generate professional e-commerce product photos in seconds using advanced AI. Transform simple snapshots into studio-quality imagery. No credit card required to start.',
  keywords: ['product image generation', 'e-commerce product photos', 'AI product photography', 'product background generator', 'shopify image generator'],
  openGraph: {
    title: 'Palette | AI Product Photography',
    description: 'Transform your product photos with AI. Create studio-quality images in seconds.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="relative h-12 w-40">
              <Image 
                src="/logo_16x9.jpeg" 
                alt="Palette" 
                fill 
                className="object-cover object-left"
                priority
              />
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <div id="gallery">
          <BeforeAfterGallery />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <FAQSection />
        
        {/* Final CTA Section */}
        <section className="container py-24 text-center">
          <div className="bg-primary/5 rounded-3xl p-12 md:p-24 flex flex-col items-center gap-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to transform your product photos?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Join thousands of e-commerce brands creating professional imagery with AI.
            </p>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-lg">
                Start generating for free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
