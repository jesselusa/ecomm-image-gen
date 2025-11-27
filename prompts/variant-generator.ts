/**
 * Variant generation utilities
 * Creates variations with different angles, lighting, and styling per image
 */

export interface VariantSpec {
  camera: string
  lighting: string
  variationGuidance: string
}

/**
 * Predefined camera angles for e-commerce photography
 */
const CAMERA_ANGLES = [
  'top-down flat lay',
  'three-quarter product angle (30°)',
  'angled overhead (15° tilt)',
  'eye-level hero shot',
  'high-angle shot looking down',
  'low-angle perspective',
  'close-up detail shot',
  'wide lifestyle shot',
]

/**
 * Predefined lighting setups for e-commerce photography
 */
const LIGHTING_SETUPS = [
  'soft natural daylight',
  'bright, even daylight',
  'diffused window light',
  'soft studio light with diffuser',
  'hard direct flash (35mm analog style)',
  'three-point softbox setup',
  'natural window light with soft shadows',
  'studio lighting with rim light',
]

/**
 * Generate variant specification for a given image index
 */
export function generateVariantSpec(imageIndex: number, total: number): VariantSpec {
  const angle = CAMERA_ANGLES[imageIndex % CAMERA_ANGLES.length]
  const lighting = LIGHTING_SETUPS[imageIndex % LIGHTING_SETUPS.length]
  
  const variationGuidance = `Product-only composition. Use ${angle}; lighting ${lighting}. Keep product fully legible; do not recolor the product.`
  
  return {
    camera: angle,
    lighting,
    variationGuidance,
  }
}

