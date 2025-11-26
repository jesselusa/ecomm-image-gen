'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Loader2, Upload, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'

interface GeneratedImage {
  id: string
  imageUrl: string | null
  prompt: string
  createdAt: string
}

export function GenerationForm() {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [quality, setQuality] = useState('high')
  const [quantity, setQuantity] = useState([1])
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    // Cleanup preview URL to avoid memory leaks
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview)
      }
    }
  }, [filePreview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setFilePreview(objectUrl)
    } else {
      setFilePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setGeneratedImages([]) // Clear previous results
    const formData = new FormData()
    formData.append('image', file)
    formData.append('prompt', prompt) // Optional prompt
    formData.append('quality', quality)
    formData.append('quantity', quantity[0].toString())

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to generate')
      }

      const data = await res.json()
      toast.success(`Success! Generated ${data.images.length} image${data.images.length > 1 ? 's' : ''}.`)
      
      // Set generated images and open modal
      setGeneratedImages(data.images || [])
      setModalOpen(true)
      
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    // Optionally reset form after closing modal
    // setPrompt('')
    // setFile(null)
    // setFilePreview(null)
  }

  return (
    <>
      <div className="grid gap-8 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="grid gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-2">
                <Label className="text-lg">Product Image</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition cursor-pointer relative h-64 flex flex-col items-center justify-center overflow-hidden">
                  <Input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10"
                    onChange={handleFileChange}
                  />
                  {filePreview ? (
                     <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-background">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="max-h-full max-w-full object-contain" 
                        />
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-20 pointer-events-none">
                          Click to change
                        </div>
                     </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="h-8 w-8" />
                      <p>Drop your product image here or click to browse</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 grid gap-6">
              <div className="grid gap-2">
                <Label className="text-lg">Describe the image you want to make (optional)</Label>
                <Textarea 
                  placeholder="Describe the background (e.g., 'On a rustic wooden table with soft morning light')" 
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Quality (Fast)</SelectItem>
                      <SelectItem value="super-high">Super High Quality (Pro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Quantity</Label>
                    <span className="text-sm text-muted-foreground">{quantity[0]} Image{quantity[0] > 1 ? 's' : ''}</span>
                  </div>
                  <Slider 
                    value={quantity} 
                    onValueChange={setQuantity}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>
              </div>

              <Button size="lg" className="w-full mt-4" disabled={loading || !file}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Generating...' : 'Generate Images'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <DialogTitle>Generated Images</DialogTitle>
            </div>
            <DialogDescription>
              Successfully generated {generatedImages.length} image{generatedImages.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {generatedImages.map((img, idx) => (
              <div key={img.id || idx} className="relative aspect-square rounded-lg overflow-hidden border">
                {img.imageUrl ? (
                  <Image
                    src={img.imageUrl}
                    alt={`Generated image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    Image unavailable
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={handleModalClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'} className="flex-1">
              View All in Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
