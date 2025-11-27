'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface GeneratedImage {
  id: string
  imageUrl: string | null
  prompt: string
  createdAt: string
}

interface ImageDetailModalProps {
  image: GeneratedImage | null
  isOpen: boolean
  onClose: () => void
}

export function ImageDetailModal({ image, isOpen, onClose }: ImageDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  if (!image || !image.imageUrl) return null

  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl!)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-image-${image.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Image downloaded')
    } catch (error) {
      toast.error('Failed to download image')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this image?')) return

    setIsDeleting(true)
    try {
      // TODO: Implement delete API endpoint
      // const res = await fetch(`/api/generations/${image.id}`, { method: 'DELETE' })
      // if (!res.ok) throw new Error('Failed to delete')
      
      toast.info('Delete functionality coming soon')
      // onClose()
      // router.refresh()
    } catch (error) {
      toast.error('Failed to delete image')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-fit w-full md:w-auto p-0 overflow-hidden bg-background/95 backdrop-blur-sm md:max-h-[90vh] flex flex-col md:flex-row">
        <div className="relative bg-zinc-950 flex items-center justify-center">
           {/* Use standard img to allow intrinsic sizing and container fit */}
           <img
             src={image.imageUrl}
             alt="Generated image"
             className="max-h-[50vh] md:max-h-[90vh] w-auto md:max-w-[calc(90vw-24rem)] object-contain block"
           />
        </div>

        {/* Sidebar Section */}
        <div className="w-full md:w-96 border-l p-6 flex flex-col gap-6 bg-background overflow-y-auto shrink-0 h-full md:h-auto min-h-[300px] md:min-h-0">
          <DialogHeader className="p-0 space-y-0">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-2xl font-bold">Image Details</DialogTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 md:hidden" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Prompt</h4>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{image.prompt}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                <p className="text-sm">{new Date(image.createdAt).toLocaleDateString()} at {new Date(image.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto pt-6 border-t">
            <Button onClick={handleDownload} size="lg" className="w-full gap-2 font-semibold">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="outline" 
              size="lg"
              className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
