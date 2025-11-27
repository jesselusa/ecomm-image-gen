/**
 * Enhanced Vision Analysis Prompts
 * Analyzes uploaded images to extract detailed product information.
 */

export const VISION_PROMPT = `
Analyze the given image and return ONLY a compact JSON object (no markdown formatting, no \`\`\`json wrapper). 
Use this exact schema:
{
  "brand_name": "string",
  "product": "string",
  "product_type": "string (one of: clothing, mug, drinkware, electronics, accessories, general)",
  "product_category": "string (specific category like 't-shirt', 'coffee mug', 'smartphone', etc.)",
  "visual_guide": "string (describe camera angle, lighting, and style clearly)",
  "current_shot_style": "string (lay flat, hanger, product-only, on-model, etc.)",
  "design_elements": {
    "patterns": "string[] (describe any patterns, graphics, prints)",
    "text": "string[] (any visible text, logos, or branding)",
    "graphics": "string[] (any graphics, illustrations, or artwork)"
  },
  "palette": [{ "hex": "string", "name": "string" }],
  "materials": "string[] (fabric types, materials, textures)",
  "reference_image_summary": "string (single objective sentence about the product image)"
}

Rules:
- brand_name: Output exactly as printed if visible; otherwise "Unknown".
- product: Be specific (e.g. "Miracle Balm" not just "cosmetic").
- product_type: Classify into one of: clothing, mug, drinkware, electronics, accessories, general
- product_category: Be very specific (e.g., "cotton t-shirt", "ceramic coffee mug", "wireless earbuds")
- visual_guide: Describe camera angle, lighting, and style clearly.
- current_shot_style: Identify how the product is currently presented (lay flat, hanger, product-only, on-model, etc.)
- design_elements: Capture ALL visible design elements - patterns, text, logos, graphics. Be exhaustive.
- palette: Pick 3-4 dominant colors with exact hex codes.
- materials: List materials, fabrics, textures visible in the image.
- reference_image_summary: Single objective sentence about the product image.
`

