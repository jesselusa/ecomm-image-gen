import { createClient } from '@/lib/supabase/server'
import { model } from '@/lib/gemini'
import { NextResponse } from 'next/server'
import { analyzeImage, constructPrompt } from '@/lib/pipeline'

export const maxDuration = 60 // Set timeout to 60 seconds for long generation

export async function POST(request: Request) {
  try {
    // 1. Verify Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate Limiting (Daily Hard Cap Only - Credits Deferred)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const { count, error: countError } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfDay.toISOString())

    if (countError) throw countError

    if (count && count >= 20) {
      return NextResponse.json(
        { error: 'Daily limit reached (20 images/day)' },
        { status: 429 }
      )
    }

    // 3. Parse Input
    const formData = await request.formData()
    const userPrompt = formData.get('prompt') as string
    const imageFile = formData.get('image') as File
    const quality = formData.get('quality') as string || 'high' // 'high' | 'super-high'
    const quantity = parseInt(formData.get('quantity') as string || '1')

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Missing image' },
        { status: 400 }
      )
    }

    // 4. Upload Original Image to Supabase
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user_uploads')
      .upload(fileName, imageFile)

    if (uploadError) throw uploadError

    // 5. Execute "Nano Banana" Pipeline
    const imageBuffer = await imageFile.arrayBuffer()
    const mimeType = imageFile.type
    
    // Step A: Vision Analysis
    const analysis = await analyzeImage(imageBuffer, mimeType)

    // Step B: Architect (Prompt Engineering)
    const { image_prompt } = await constructPrompt(analysis, userPrompt || '', quantity)

    // Step C: Generation Loop
    // NOTE: We use Text-to-Image here (only passing the prompt). 
    // The Vision step already extracted the visual essence. 
    // Passing the image directly (Image-to-Image) often triggers strict safety filters or edit-mode constraints.
    
    const modelName = quality === 'super-high' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image'
    const generatedImages = []

    for (let i = 0; i < quantity; i++) {
      try {
        // @ts-ignore
        const result = await model.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                { text: image_prompt },
              ],
            },
          ],
        })

        // Find the part with inlineData
        let generatedImageBase64: string | null = null;
        
        // @ts-ignore
        const parts = result.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            generatedImageBase64 = part.inlineData.data;
            break;
          }
        }
        
        if (!generatedImageBase64) {
          console.error(`Failed to generate image ${i + 1}: No inline data found in any part.`)
          console.log('Gemini Response:', JSON.stringify(result, null, 2))
          continue
        }

        // Upload Generated Image
        const genFileName = `${user.id}/${Date.now()}-${i}-generated.png`
        const genBuffer = Buffer.from(generatedImageBase64, 'base64')
        
        const { data: genUploadData, error: genUploadError } = await supabase.storage
          .from('generated_images')
          .upload(genFileName, genBuffer, {
            contentType: 'image/png',
          })
          
        if (genUploadError) throw genUploadError

        // Record in DB
        const { data: insertedGen, error: dbError } = await supabase.from('generations').insert({
          user_id: user.id,
          original_image_path: uploadData.path,
          generated_image_path: genUploadData.path,
          prompt: image_prompt,
          // model: modelName, // TODO: Add column to DB schema later
        }).select().single()

        if (dbError) throw dbError

        // Create signed URL for immediate display
        const { data: urlData } = await supabase.storage
          .from('generated_images')
          .createSignedUrl(genUploadData.path, 3600) // 1 hour expiry

        generatedImages.push({
          id: insertedGen.id,
          imageUrl: urlData?.signedUrl || null,
          prompt: image_prompt,
          createdAt: insertedGen.created_at,
        })
      } catch (genError) {
        console.error(`Generation loop error for image ${i + 1}:`, genError)
      }
    }

    if (generatedImages.length === 0) {
        return NextResponse.json(
            { error: 'Failed to generate any images. Please try again.' },
            { status: 500 }
        )
    }

    return NextResponse.json({ success: true, images: generatedImages })

  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
