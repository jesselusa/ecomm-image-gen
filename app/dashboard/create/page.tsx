import { GenerationForm } from '@/components/dashboard/generation-form'

export default function CreatePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Image</h1>
        <p className="text-muted-foreground">
          Upload your product and describe the scene you want to place it in.
        </p>
      </div>
      
      <GenerationForm />
    </div>
  )
}

