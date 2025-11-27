import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { FadeIn } from './fade-in'

export function BeforeAfterGallery() {
  const examples = [
    {
      before: '/placeholder-product.jpg', // We'll use a div placeholder if image fails
      after: '/placeholder-generated.jpg',
      label: 'Perfume Bottle',
    },
    {
      before: '/placeholder-shoe.jpg',
      after: '/placeholder-generated-shoe.jpg',
      label: 'Sneakers',
    },
    {
      before: '/placeholder-watch.jpg',
      after: '/placeholder-generated-watch.jpg',
      label: 'Luxury Watch',
    },
  ]

  return (
    <section className="container py-24">
      <FadeIn>
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            See the difference
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            From simple phone photos to professional studio shots.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-8 md:grid-cols-3">
        {examples.map((ex, i) => (
          <FadeIn key={i} delay={i * 0.2}>
            <div className="group relative">
              <div className="aspect-[4/5] relative rounded-xl overflow-hidden border bg-muted">
                {/* We simulate the comparison for now with a split view or just showing the result */}
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground">
                  {/* Placeholder since we don't have actual images yet */}
                  <span className="text-sm">Example Image {i + 1}</span>
                </div>
                
                {/* Overlay label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <p className="font-medium">{ex.label}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

