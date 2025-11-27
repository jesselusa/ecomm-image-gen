/**
 * Architect Prompts with Product Preservation Focus
 * Constructs optimized prompts for image generation that preserve product design exactly.
 */

import { ProductType } from './product-contexts'
import { getProductContexts } from './product-contexts'
import { getVariationForIndex, userSpecifiesModel } from './diversity'
import { PROMPT_TEMPLATES, BEST_PRACTICES } from './templates'
import type { VariantSpec } from './variant-generator'
import type { Color } from './color-utils'

export interface VisionAnalysisInput {
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

export function buildArchitectPrompt(
  analysis: VisionAnalysisInput,
  userPrompt: string,
  quantity: number,
  imageIndex: number,
  variantSpec?: VariantSpec,
  colorHierarchy?: { primary: Color; secondary: Color; tertiary: Color }
): string {
  const productType = analysis.product_type || 'general'
  const productContexts = getProductContexts(productType)
  
  // Get diversity variations if generating multiple images
  const variations = quantity > 1 ? getVariationForIndex(imageIndex, quantity) : null
  const userHasModelSpec = userSpecifiesModel(userPrompt)
  
  // Build product preservation section
  const designDetails = [
    ...(analysis.design_elements?.patterns || []).map(p => `pattern: ${p}`),
    ...(analysis.design_elements?.text || []).map(t => `text: "${t}"`),
    ...(analysis.design_elements?.graphics || []).map(g => `graphic: ${g}`),
  ].join(', ')
  
  const colorDetails = (analysis.palette || []).map(c => `${c.name} (#${c.hex})`).join(', ')
  
  // Determine context transformation
  let contextTransformation = productContexts.defaultTransformation
  if (userPrompt) {
    // User prompt takes priority, but we'll still preserve product
    contextTransformation = userPrompt
  } else if (analysis.current_shot_style?.toLowerCase().includes('lay flat')) {
    // Transform lay flat to e-commerce appropriate context
    contextTransformation = productContexts.contexts[0] // Use first context option
  }
  
  // Build the prompt
  return `
Role: You are an expert e-commerce product photography prompt engineer specializing in Image-to-Image generation.
Goal: Create a production-ready prompt that preserves the EXACT product design while transforming the context/scene for e-commerce use.

CRITICAL PRODUCT PRESERVATION REQUIREMENTS:
The product from the reference image MUST match EXACTLY:
- Design: ${designDetails || 'No specific design elements'}
- Colors: ${colorDetails || 'No colors specified'}
- Brand: ${analysis.brand_name}
- Product: ${analysis.product} (${analysis.product_category})
- Materials: ${(analysis.materials || []).join(', ') || 'Unknown materials'}

DO NOT alter, change, or modify:
- Product design, patterns, graphics, or text
- Product colors (must match hex codes: ${(analysis.palette || []).map(c => c.hex).join(', ')})
- Brand name or logo text
- Product shape or structure

CONTEXT TRANSFORMATION:
Current shot style: ${analysis.current_shot_style}
Transform to: ${contextTransformation}
${variantSpec ? `
VARIANT SPECIFICATIONS (Image ${imageIndex + 1} of ${quantity}):
- Camera: ${variantSpec.camera}
- Lighting: ${variantSpec.lighting}
- Variation Guidance: ${variantSpec.variationGuidance}
` : ''}
${variations ? `
DIVERSITY VARIATIONS (Image ${imageIndex + 1} of ${quantity}):
- Model: ${variations.modelChar}${userHasModelSpec ? ' (user specified model characteristics)' : ''}
- Camera Angle: ${variations.angle}
- Background: ${variations.background}
- Styling: ${variations.styling}
` : ''}
${colorHierarchy ? `
COLOR HIERARCHY:
- Primary: ${colorHierarchy.primary.name} (${colorHierarchy.primary.hex}) - use as accent
- Secondary: ${colorHierarchy.secondary.name} (${colorHierarchy.secondary.hex}) - use as accent
- Tertiary: ${colorHierarchy.tertiary.name} (${colorHierarchy.tertiary.hex}) - use for background/negative space
- Do NOT recolor the product itself
` : ''}

PROMPT TEMPLATES TO USE:
${PROMPT_TEMPLATES.productMockup}

BEST PRACTICES:
- ${BEST_PRACTICES.hyperSpecific}
- ${BEST_PRACTICES.contextAndIntent}
- ${BEST_PRACTICES.cameraControl}

OUTPUT FORMAT (JSON ONLY):
{
  "prompt_breakdown": {
    "subject_parameters": {
      "identity_constraint": "string (if model/person: preserve natural features, avoid generic AI look)",
      "expression": "string (natural, authentic expression)",
      "gender": "string (if applicable, varied unless user specifies)",
      "ethnicity": "string (if applicable, varied unless user specifies)"
    },
    "apparel": {
      "product_details": "string (exact product description from reference - design, colors, text)",
      "style": "string (how product is styled/worn)",
      "fit": "string (fit description if clothing)"
    },
    "pose_and_action": {
      "body_position": "string (specific, natural pose - avoid generic)",
      "arms": "string (arm position/hand placement)",
      "action": "string (what person/product is doing)"
    },
    "environment_and_props": {
      "primary_container": "string (main surface/background)",
      "background": "string (specific environment - avoid generic)",
      "surfaces": "string (table, countertop, etc.)",
      "complementary_items": "string (other items in scene if any)"
    },
    "technical_specs": {
      "angle": "string (specific camera angle - e.g., 'high-angle shot looking down', 'eye-level three-quarter view')",
      "lighting": "string (specific lighting setup - e.g., 'hard direct flash 35mm analog style', 'soft natural window light', 'studio three-point softbox')",
      "medium": "string (photography style - e.g., 'flash photography, grainy film texture', 'digital photography, clean and sharp')",
      "atmosphere": "string (mood - e.g., 'edgy, mysterious, candid', 'clean, professional, commercial')"
    },
    "product_preservation": {
      "design_elements": "string (exact patterns, graphics from reference)",
      "colors": "string (exact hex codes and color names)",
      "text_logo": "string (exact text/branding from reference)",
      "materials": "string (exact materials from reference)"
    }
  },
  "image_prompt": "string (Format: Start with a short spec line: 'Shot: [camera]; Lighting: [lighting]; Aspect ratio: [aspect_ratio]; Style: [output_style].' Then convert the structured breakdown above into a detailed, specific paragraph. Use technical photography terms, avoid generic AI language. Be hyper-specific about lighting, camera angles, poses, and environments. Make it sound like a professional photographer's brief.)",
  "negative_prompt": "string (Avoid: lay flat, same angle, product changes, different design, distorted text, clutter, AI-generated, generic, unrealistic, cartoonish, oversaturated)",
  "render_prefs": {
    "aspect_ratio": "4:5",
    "lighting": "string (professional e-commerce lighting)",
    "camera": "string (camera angle and lens details)",
    "depth_of_field": "string",
    "output_style": "string (photorealistic, commercial photography)"
  }
}

RULES:
1. Product Preservation is MANDATORY - the product design, colors, and text must match the reference image exactly
2. Context Transformation - change the scene/background/context, NOT the product itself
3. User Intent Priority - if user specifies model characteristics, use exactly as specified
4. E-commerce Focus - create professional, attractive product photography suitable for online stores
5. Anti-Generic AI: Use specific technical photography terms (e.g., "hard direct flash 35mm analog style", "high-angle shot looking down", "grainy film texture"). Avoid generic terms like "professional", "high quality", "beautiful". Be specific about lighting setups, camera angles, and atmosphere.
6. Natural Authenticity: Poses should be natural and authentic, not posed or stiff. Expressions should be relaxed and real. Environments should feel lived-in and realistic.
7. Format: JSON only, no markdown. The prompt_breakdown should be detailed and specific. The image_prompt should convert this breakdown into a flowing paragraph that reads like a professional photographer's brief.
`
}

