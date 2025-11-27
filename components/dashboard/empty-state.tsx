import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  href?: string
}

export function EmptyState({
  title = 'No images yet',
  description = 'Create your first AI-generated product photo to get started.',
  actionLabel = 'Create first image',
  href = '/dashboard/create'
}: EmptyStateProps) {
  return (
    <Link href={href} className="block group h-full">
      <Card className="bg-muted/30 border-dashed hover:bg-muted/50 hover:border-primary/50 transition-all h-full min-h-[300px] flex flex-col items-center justify-center text-center">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {actionLabel.includes('Create') ? (
              <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {description}
            </p>
          </div>
          <Button variant="secondary" className="mt-4 pointer-events-none group-hover:bg-primary group-hover:text-primary-foreground">
            {actionLabel}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}



