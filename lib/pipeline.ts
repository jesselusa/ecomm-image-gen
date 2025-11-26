import { model } from './gemini'

interface VisionAnalysis {
  brand_name: string
  product: string
  visual_guide: string
  palette: Array<{ hex: string; name: string }>
  reference_image_summary: string
}

interface ArchitectOutput {
  image_prompt: string
  negative_prompt: string
  render_prefs: {
    aspect_ratio: string
    lighting: string
    camera: string
    depth_of_field: string
    output_style: string
  }
}

/**
 * Step 1: Vision Analysis
 * Analyze the uploaded image to understand the product.
 */
export async function analyzeImage(imageBuffer: ArrayBuffer, mimeType: string): Promise<VisionAnalysis> {
  const prompt = `
    Analyze the given image and return ONLY a compact JSON object (no markdown formatting, no \`\`\`json wrapper). 
    Use this exact schema:
    {
      "brand_name": "string",
      "product": "string",
      "visual_guide": "string", 
      "palette": [{ "hex": "string", "name": "string" }],
      "reference_image_summary": "string"
    }

    Rules:
    - brand_name: Output exactly as printed if visible; otherwise "Unknown".
    - product: Be specific (e.g. "Miracle Balm" not just "cosmetic").
    - visual_guide: Describe camera angle, lighting, and style clearly.
    - palette: Pick 3-4 dominant colors.
    - reference_image_summary: Single objective sentence about the product image.
  `

  // @ts-ignore
  const result = await model.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: Buffer.from(imageBuffer).toString('base64'),
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
    },
  })

  // @ts-ignore
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Failed to analyze image')

  try {
    // Sanitize json output to remove markdown if present
    const cleanedText = text.replace(/```json\n?|```/g, '').trim()
    return JSON.parse(cleanedText) as VisionAnalysis
  } catch (e) {
    console.error('Failed to parse vision output', text)
    throw new Error('Vision analysis failed')
  }
}

/**
 * Step 2: Architect (Prompt Engineering)
 * Construct the perfect prompt for the image generation model.
 */
export async function constructPrompt(
  analysis: VisionAnalysis,
  userPrompt: string,
  quantity: number
): Promise<ArchitectOutput> {
  const systemPrompt = `
    Role: You are an ad-creative prompt engineer. 
    Goal: Given structured inputs about a product image and a user's request, generate exactly one polished, production-ready image ad prompt suitable for image generation models.

    Inputs:
    - Product Analysis: ${JSON.stringify(analysis)}
    - User Request: "${userPrompt || 'Create a professional product shot'}"
    - Quantity: ${quantity} (Just for context, you produce ONE prompt)

    PROMPT TEMPLATES (Use these as a guide for style):
    
    1. Photorealistic: "A photorealistic [shot type] of [subject], [action], set in [environment]. The scene is illuminated by [lighting], creating a [mood] atmosphere. Captured with [camera details], emphasizing [textures]. [Aspect Ratio]."
    2. Product Mockup: "A high-resolution, studio-lit product photograph of [product] on [background]. The lighting is [setup] to [purpose]. The camera angle is [angle] to showcase [feature]. Ultra-realistic, sharp focus on [details]. [Aspect Ratio]."
    
    BEST PRACTICES:
    - Be Hyper-Specific: Describe details (textures, materials).
    - Context: Explain the purpose.
    - Lighting/Camera: Explicitly mention these.
    - Negative Prompts: "Avoid clutter, harsh reflections, distorted text, people, hands."

    Output Schema (JSON ONLY):
    {
      "image_prompt": "string (The final detailed paragraph)",
      "negative_prompt": "string (Concise list)",
      "render_prefs": {
        "aspect_ratio": "4:5", 
        "lighting": "string",
        "camera": "string",
        "depth_of_field": "string",
        "output_style": "string"
      }
    }

    Rules:
    1. Grounding: Trust the 'Product Analysis' for the product look. Do not invent new packaging colors.
    2. User Intent: The 'User Request' overrides defaults. If they say "in a forest", put it in a forest.
    3. Brand Safety: Product only. No people/hands unless explicitly requested.
    4. Format: JSON only.
  `

  // @ts-ignore
  const result = await model.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
    ],
    config: {
      responseMimeType: 'application/json',
    },
  })

  // @ts-ignore
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Failed to construct prompt')

  try {
    // Sanitize json output to remove markdown if present
    const cleanedText = text.replace(/```json\n?|```/g, '').trim()
    return JSON.parse(cleanedText) as ArchitectOutput
  } catch (e) {
    console.error('Failed to parse architect output', text)
    throw new Error('Prompt construction failed')
  }
}
