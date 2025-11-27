# Prompt Examples

This document shows what the actual prompts look like at each stage of the pipeline.

## Step 1: Vision Analysis Prompt

**Sent to:** `gemini-2.5-flash` (with the uploaded image)

```text
Analyze the given image and return ONLY a compact JSON object (no markdown formatting, no ```json wrapper). 
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
```

**Example Output:**

```json
{
  "brand_name": "Nike",
  "product": "Cotton T-Shirt",
  "product_type": "clothing",
  "product_category": "cotton t-shirt",
  "visual_guide": "Top-down flat lay, natural daylight, minimal styling",
  "current_shot_style": "lay flat",
  "design_elements": {
    "patterns": ["swoosh logo on chest"],
    "text": ["NIKE"],
    "graphics": ["swoosh logo"]
  },
  "palette": [
    { "hex": "#000000", "name": "Black" },
    { "hex": "#ffffff", "name": "White" }
  ],
  "materials": ["cotton"],
  "reference_image_summary": "Black Nike t-shirt laid flat on white background"
}
```

---

## Step 2: Architect Prompt (Prompt Engineering)

**Sent to:** `gemini-2.5-flash` (text-only, generates the structured prompt)

This is a large system prompt that instructs the model to create a structured JSON output. Key sections include:

- **Product Preservation Requirements** - Exact design, colors, brand must match
- **Context Transformation** - Transform scene/context, not the product
- **Variant Specifications** - Camera angle and lighting for this specific image
- **Diversity Variations** - Model characteristics, backgrounds, styling (if quantity > 1)
- **Color Hierarchy** - Primary/secondary/tertiary colors for accents/backgrounds
- **Output Format** - Structured JSON with `prompt_breakdown` and `image_prompt`

**System Prompt Structure:**

```text
Role: You are an expert e-commerce product photography prompt engineer specializing in Image-to-Image generation.
Goal: Create a production-ready prompt that preserves the EXACT product design while transforming the context/scene for e-commerce use.

CRITICAL PRODUCT PRESERVATION REQUIREMENTS:
The product from the reference image MUST match EXACTLY:
- Design: [patterns, text, graphics]
- Colors: [color names and hex codes]
- Brand: [brand name]
- Product: [product name] ([category])
- Materials: [material list]

DO NOT alter, change, or modify:
- Product design, patterns, graphics, or text
- Product colors (must match hex codes)
- Brand name or logo text
- Product shape or structure

CONTEXT TRANSFORMATION:
Current shot style: [current style]
Transform to: [context]

[VARIANT SPECIFICATIONS if applicable]
[DIVERSITY VARIATIONS if applicable]
[COLOR HIERARCHY if applicable]

PROMPT TEMPLATES TO USE:
A high-resolution, studio-lit product photograph of a [product description] on a [background surface/description]. The lighting is a [lighting setup, e.g., three-point softbox setup] to [lighting purpose]. The camera angle is a [angle type] to showcase [specific feature]. Ultra-realistic, with sharp focus on [key detail]. [Aspect ratio].

BEST PRACTICES:
- Be Hyper-Specific: The more detail you provide, the more control you have.
- Provide Context and Intent: Explain the purpose of the image.
- Control the Camera: Use photographic and cinematic language to control the composition. Terms like wide-angle shot, macro shot, low-angle perspective.

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
```

**Example Architect Output:**

```json
{
  "prompt_breakdown": {
    "subject_parameters": {
      "identity_constraint": "preserve natural features, avoid generic AI look",
      "expression": "relaxed, confident",
      "gender": "varied",
      "ethnicity": "varied"
    },
    "apparel": {
      "product_details": "Black Nike cotton t-shirt with white swoosh logo on chest, exact text 'NIKE'",
      "style": "worn by attractive model",
      "fit": "relaxed fit"
    },
    "pose_and_action": {
      "body_position": "standing naturally, slight lean",
      "arms": "one arm relaxed at side, other hand on hip",
      "action": "casual lifestyle pose"
    },
    "environment_and_props": {
      "primary_container": "urban street setting",
      "background": "modern cityscape with soft bokeh",
      "surfaces": "concrete sidewalk",
      "complementary_items": "none"
    },
    "technical_specs": {
      "angle": "eye-level three-quarter view",
      "lighting": "soft natural daylight with gentle rim lighting",
      "medium": "digital photography, clean and sharp",
      "atmosphere": "clean, professional, commercial"
    },
    "product_preservation": {
      "design_elements": "swoosh logo on chest, exact text 'NIKE'",
      "colors": "Black (#000000), White (#ffffff)",
      "text_logo": "NIKE",
      "materials": "cotton"
    }
  },
  "image_prompt": "Shot: eye-level three-quarter view; Lighting: soft natural daylight with gentle rim lighting; Aspect ratio: 4:5; Style: photorealistic commercial photography. A high-resolution product photograph of a black Nike cotton t-shirt with white swoosh logo, worn by an attractive diverse model in a relaxed standing pose. The model stands naturally with one arm relaxed at side and the other hand on hip, positioned in an urban street setting with modern cityscape background showing soft bokeh. The scene is illuminated by soft natural daylight creating gentle rim lighting that highlights the product details. Captured with eye-level three-quarter view camera angle, emphasizing the t-shirt's fit and logo visibility. Ultra-realistic, with sharp focus on the product. The t-shirt must match exactly: black color (#000000), white swoosh logo, exact text 'NIKE' on chest. Digital photography style, clean and sharp, professional commercial atmosphere.",
  "negative_prompt": "Avoid: lay flat, same angle, product changes, different design, distorted text, clutter, AI-generated, generic, unrealistic, cartoonish, oversaturated",
  "render_prefs": {
    "aspect_ratio": "4:5",
    "lighting": "soft natural daylight with gentle rim lighting",
    "camera": "eye-level three-quarter view",
    "depth_of_field": "shallow depth of field, product in sharp focus",
    "output_style": "photorealistic commercial photography"
  }
}
```

---

## Step 3: Final Image Generation Prompt

**Sent to:** `gemini-2.5-flash-image` or `gemini-3-pro-image-preview` (with the original image)

The final prompt is formatted as:

```text
Shot: [camera]; Lighting: [lighting]; Aspect ratio: [aspect_ratio]; Style: [output_style]. [image_prompt]
```

**Example Final Prompt:**

```text
Shot: eye-level three-quarter view; Lighting: soft natural daylight with gentle rim lighting; Aspect ratio: 4:5; Style: photorealistic commercial photography. A high-resolution product photograph of a black Nike cotton t-shirt with white swoosh logo, worn by an attractive diverse model in a relaxed standing pose. The model stands naturally with one arm relaxed at side and the other hand on hip, positioned in an urban street setting with modern cityscape background showing soft bokeh. The scene is illuminated by soft natural daylight creating gentle rim lighting that highlights the product details. Captured with eye-level three-quarter view camera angle, emphasizing the t-shirt's fit and logo visibility. Ultra-realistic, with sharp focus on the product. The t-shirt must match exactly: black color (#000000), white swoosh logo, exact text 'NIKE' on chest. Digital photography style, clean and sharp, professional commercial atmosphere.
```

**What gets sent to the API:**

```javascript
{
  model: "gemini-2.5-flash-image",
  contents: [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType: "image/png",
            data: "[base64 encoded original image]"
          }
        },
        {
          text: "Shot: eye-level three-quarter view; Lighting: soft natural daylight with gentle rim lighting; Aspect ratio: 4:5; Style: photorealistic commercial photography. A high-resolution product photograph..."
        }
      ]
    }
  ],
  config: {
    temperature: 0.7,
    topP: 0.9
  }
}
```

---

## Key Features

1. **Short Spec First**: The prompt starts with a concise spec line that Gemini favors
2. **Structured Breakdown**: The architect creates a detailed JSON breakdown before generating the final prompt
3. **Product Preservation**: Explicit instructions to preserve exact design, colors, and text
4. **Technical Specificity**: Uses specific photography terms (camera angles, lighting setups, etc.)
5. **Anti-Generic AI**: Avoids generic terms, focuses on technical details
6. **Variety**: Each image gets unique camera angle and lighting when generating multiple images
