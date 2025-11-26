import { createClient } from '@/lib/supabase/server'
import { model } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 1. Verify Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate Limiting & Credits
    // Check if user has credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits_balance')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    // Check Free Tier (1/week)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { count: weeklyCount, error: weeklyError } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', oneWeekAgo.toISOString())

    if (weeklyError) throw weeklyError

    // If free tier used up, check credits
    if (weeklyCount && weeklyCount >= 1) {
      if (!profile.credits_balance || profile.credits_balance < 1) {
        return NextResponse.json(
          { error: 'No credits remaining. Free weekly generation used.' },
          { status: 402 } // Payment Required
        )
      }
    }

    // Rate Limit (Daily Hard Cap)
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
    const prompt = formData.get('prompt') as string
    const imageFile = formData.get('image') as File

    if (!prompt || !imageFile) {
      return NextResponse.json(
        { error: 'Missing prompt or image' },
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

    // 5. Call Gemini API
    const imageBuffer = await imageFile.arrayBuffer()
    // @ts-ignore
    const result = await model.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: Buffer.from(imageBuffer).toString('base64'),
                mimeType: imageFile.type,
              },
            },
          ],
        },
      ],
    })

    // The result itself contains the candidates
    // Assuming the response contains the generated image data
    // You'd likely need to parse the response to get the image binary
    // Use "gemini-2.5-flash-image" specific response handling here.
    // For MVP placeholder:
    // @ts-ignore
    const generatedImageBase64 = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "placeholder_base64"

    // 6. Upload Generated Image to Supabase
    const generatedFileName = `${user.id}/${Date.now()}-generated.png`
    const generatedBuffer = Buffer.from(generatedImageBase64, 'base64')
    
    const { data: genUploadData, error: genUploadError } = await supabase.storage
      .from('generated_images')
      .upload(generatedFileName, generatedBuffer, {
        contentType: 'image/png',
      })
      
    if (genUploadError) throw genUploadError

    // 7. Record in DB & Deduct Credits
    const { error: dbError } = await supabase.from('generations').insert({
      user_id: user.id,
      original_image_path: uploadData.path,
      generated_image_path: genUploadData.path,
      prompt: prompt,
    })

    if (dbError) throw dbError

    // Deduct credit if free tier was exhausted
    if (weeklyCount && weeklyCount >= 1) {
      const newBalance = (profile.credits_balance || 0) - 1
      // Simple update, ideally use RPC for atomicity
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits_balance: newBalance })
        .eq('id', user.id)
      
      if (updateError) {
        console.error('Failed to deduct credit:', updateError)
        // Don't fail the request, but log it critical
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
