import { model } from './gemini'
import { VISION_PROMPT } from '@/prompts/vision'
import { buildArchitectPrompt, VisionAnalysisInput } from '@/prompts/architect'
import type { ProductType } from '@/prompts/product-contexts'
import { normalizePalette, extractColorHierarchy } from '@/prompts/color-utils'
import { generateVariantSpec } from '@/prompts/variant-generator'

export interface VisionAnalysis {
  brand_name: string
  product: string
  product_type: ProductType
  product_category: string
  visual_guide: string
  current_shot_style: string
  design_elements: {
    patterns: string[]
    text: string[]
    graphics: string[]
  }
  palette: Array<{ hex: string; name: string }>
  materials: string[]
  reference_image_summary: string
}

interface PromptBreakdown {
  subject_parameters?: {
    identity_constraint?: string
    hair?: string
    expression?: string
    gender?: string
    ethnicity?: string
  }
  apparel?: {
    product_details?: string
    style?: string
    fit?: string
  }
  pose_and_action?: {
    body_position?: string
    arms?: string
    action?: string
  }
  environment_and_props?: {
    primary_container?: string
    background?: string
    surfaces?: string
    complementary_items?: string
  }
  technical_specs?: {
    angle?: string
    lighting?: string
    medium?: string
    atmosphere?: string
  }
  product_preservation?: {
    design_elements?: string
    colors?: string
    text_logo?: string
    materials?: string
  }
}

interface ArchitectOutput {
  prompt_breakdown: PromptBreakdown
  image_prompt: string // Generated from structured breakdown
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
  const prompt = VISION_PROMPT

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
    const parsed = JSON.parse(cleanedText) as Partial<VisionAnalysis>
    
    // Normalize and order palette (non-neutral colors first)
    const normalizedPalette = normalizePalette(parsed.palette || [])
    
    // Add defaults for missing fields to ensure compatibility
    return {
      brand_name: parsed.brand_name || 'Unknown',
      product: parsed.product || 'Product',
      product_type: (parsed.product_type || 'general') as ProductType,
      product_category: parsed.product_category || parsed.product || 'Product',
      visual_guide: parsed.visual_guide || 'Product photography',
      current_shot_style: parsed.current_shot_style || 'product-only',
      design_elements: parsed.design_elements || {
        patterns: [],
        text: [],
        graphics: [],
      },
      palette: normalizedPalette,
      materials: parsed.materials || [],
      reference_image_summary: parsed.reference_image_summary || 'Product image',
    } as VisionAnalysis
  } catch (e) {
    console.error('Failed to parse vision output', text)
    throw new Error('Vision analysis failed')
  }
}

/**
 * Step 2: Architect (Prompt Engineering)
 * Construct the perfect prompt for the image generation model.
 * Now accepts imageIndex for diversity across multiple images.
 */
export async function constructPrompt(
  analysis: VisionAnalysis,
  userPrompt: string,
  quantity: number,
  imageIndex: number = 0
): Promise<ArchitectOutput> {
  // Generate variant spec for this image (camera angle, lighting variations)
  const variantSpec = generateVariantSpec(imageIndex, quantity)
  
  // Extract color hierarchy (primary, secondary, tertiary)
  const { primary, secondary, tertiary } = extractColorHierarchy(analysis.palette)
  
  // Convert VisionAnalysis to VisionAnalysisInput format
  const architectAnalysis: VisionAnalysisInput = {
    brand_name: analysis.brand_name,
    product: analysis.product,
    product_type: analysis.product_type,
    product_category: analysis.product_category,
    visual_guide: analysis.visual_guide,
    current_shot_style: analysis.current_shot_style,
    design_elements: analysis.design_elements,
    palette: analysis.palette,
    materials: analysis.materials,
    reference_image_summary: analysis.reference_image_summary,
  }
  
  const systemPrompt = buildArchitectPrompt(
    architectAnalysis, 
    userPrompt, 
    quantity, 
    imageIndex,
    variantSpec,
    { primary, secondary, tertiary }
  )

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
