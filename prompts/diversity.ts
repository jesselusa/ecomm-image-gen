/**
 * Diversity Guidelines and Variation Strategies
 * Ensures variety across multiple image generations.
 */

export interface DiversityVariations {
  modelCharacteristics: string[]
  cameraAngles: string[]
  backgrounds: string[]
  styling: string[]
}

export const DIVERSITY_VARIATIONS: DiversityVariations = {
  modelCharacteristics: [
    'attractive diverse model',
    'attractive model of varied ethnicity',
    'attractive model with diverse background',
    'attractive professional model',
  ],
  cameraAngles: [
    'close-up shot',
    'medium shot',
    'wide shot',
    'low-angle perspective',
    'high-angle perspective',
    'eye-level shot',
    'three-quarter angle',
  ],
  backgrounds: [
    'clean studio background',
    'natural outdoor setting',
    'modern indoor environment',
    'lifestyle home setting',
    'professional workspace',
    'minimalist background',
    'textured surface',
  ],
  styling: [
    'casual pose',
    'professional pose',
    'lifestyle arrangement',
    'editorial style',
    'commercial product shot',
    'artistic composition',
  ],
}

/**
 * Get variation based on index for diversity across multiple images
 */
export function getVariationForIndex(index: number, total: number): {
  modelChar: string
  angle: string
  background: string
  styling: string
} {
  const variations = DIVERSITY_VARIATIONS
  
  return {
    modelChar: variations.modelCharacteristics[index % variations.modelCharacteristics.length],
    angle: variations.cameraAngles[index % variations.cameraAngles.length],
    background: variations.backgrounds[index % variations.backgrounds.length],
    styling: variations.styling[index % variations.styling.length],
  }
}

/**
 * Check if user prompt specifies model characteristics
 */
export function userSpecifiesModel(userPrompt: string): boolean {
  const modelKeywords = ['man', 'woman', 'male', 'female', 'guy', 'girl', 'person', 'model']
  return modelKeywords.some(keyword => 
    userPrompt.toLowerCase().includes(keyword)
  )
}

