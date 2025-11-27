/**
 * Color normalization and ordering utilities
 * Inspired by n8n workflow color handling
 */

export interface Color {
  hex: string
  name: string
}

/**
 * Normalize hex color (ensure it starts with #)
 */
export function normalizeHex(hex: string | undefined): string {
  if (!hex) return '#000000'
  return hex.startsWith('#') ? hex : `#${hex}`
}

/**
 * Check if color is neutral (white, black, gray, etc.)
 */
export function isNeutralColor(color: Color): boolean {
  const neutralKeywords = ['white', 'black', 'gray', 'grey', 'charcoal', 'ivory', 'off-white', 'off white']
  return neutralKeywords.some(keyword => 
    color.name.toLowerCase().includes(keyword) || 
    color.hex.toLowerCase().includes('fff') ||
    color.hex.toLowerCase().includes('000')
  )
}

/**
 * Normalize and order palette (non-neutral colors first)
 */
export function normalizePalette(palette: Array<{ hex?: string; name?: string }>): Color[] {
  const normalized = palette
    .map(c => ({
      hex: normalizeHex(c.hex),
      name: (c.name || '').trim() || 'Unknown',
    }))
    .filter(c => /^#[0-9a-fA-F]{6}$/.test(c.hex))

  const nonNeutral = normalized.filter(c => !isNeutralColor(c))
  const neutral = normalized.filter(c => isNeutralColor(c))
  
  return [...nonNeutral, ...neutral]
}

/**
 * Extract primary, secondary, tertiary colors from palette
 */
export function extractColorHierarchy(palette: Color[]): {
  primary: Color
  secondary: Color
  tertiary: Color
} {
  const primary = palette[0] || { hex: '#d89c94', name: 'Rosewood' }
  const secondary = palette[1] || { hex: '#f2e9e1', name: 'Pale Ivory' }
  const tertiary = palette[2] || { hex: '#ffffff', name: 'White' }
  
  return { primary, secondary, tertiary }
}



