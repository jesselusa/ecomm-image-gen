import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in</div>
  }

  // Fetch user's generations
  const { data: generations, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get signed URLs for generated images
  const generationsWithUrls = await Promise.all(
    (generations || []).map(async (gen) => {
      const { data: urlData } = await supabase.storage
        .from('generated_images')
        .createSignedUrl(gen.generated_image_path, 3600) // 1 hour expiry

      return {
        ...gen,
        imageUrl: urlData?.signedUrl || null,
      }
    })
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
        <Link href="/dashboard/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Generation
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {generationsWithUrls.length === 0 ? (
          <Link href="/dashboard/create" className="block">
            <Card className="bg-muted/50 border-dashed hover:bg-muted/70 transition-colors h-full">
              <CardContent className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                <Plus className="h-8 w-8" />
                <p>Create your first image</p>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <>
            {generationsWithUrls.map((gen) => (
              <Card key={gen.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {gen.imageUrl ? (
                    <div className="relative aspect-square w-full">
                      <Image
                        src={gen.imageUrl}
                        alt="Generated image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square w-full bg-muted flex items-center justify-center text-muted-foreground">
                      Image unavailable
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <Link href="/dashboard/create" className="block">
              <Card className="bg-muted/50 border-dashed hover:bg-muted/70 transition-colors h-full">
                <CardContent className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                  <Plus className="h-8 w-8" />
                  <p>Create another image</p>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
