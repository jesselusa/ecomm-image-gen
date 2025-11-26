'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function GenerationForm() {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !prompt) return

    setLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('prompt', prompt)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to generate')
      }

      toast.success('Image generated successfully!')
      // Trigger refresh or redirect
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-2">
            <Label>Product Image</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition cursor-pointer relative">
              <Input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                {file ? (
                  <p className="font-medium text-foreground">{file.name}</p>
                ) : (
                  <p>Drop your product image here or click to browse</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 grid gap-4">
          <div className="grid gap-2">
            <Label>Prompt</Label>
            <Textarea 
              placeholder="Describe the background (e.g., 'On a rustic wooden table with soft morning light')" 
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <Button size="lg" disabled={loading || !file || !prompt}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Image
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

