import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Generation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
            <Plus className="h-8 w-8" />
            <p>Create your first image</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

