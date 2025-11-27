import { GenerationForm } from '@/components/dashboard/generation-form'

export default function CreatePage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Create new image</h1>
        <p className="text-muted-foreground">
          Upload your product and describe the scene you want to place it in.
        </p>
      </div>
      
      <div className="flex-1 min-h-0">
        <GenerationForm />
      </div>
    </div>
  )
}
