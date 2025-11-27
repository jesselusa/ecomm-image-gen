/**
 * Prompt Templates from prompt_examples.md
 * These templates guide the prompt engineering process for image generation.
 */

export const PROMPT_TEMPLATES = {
  /**
   * Photorealistic scenes template
   * For realistic images, use photography terms. Mention camera angles, lens types, lighting, and fine details.
   */
  photorealistic: `A photorealistic [shot type] of [subject], [action or expression], set in [environment]. The scene is illuminated by [lighting description], creating a [mood] atmosphere. Captured with a [camera/lens details], emphasizing [key textures and details]. The image should be in a [aspect ratio] format.`,

  /**
   * Product mockups & commercial photography
   * Perfect for creating clean, professional product shots for e-commerce, advertising, or branding.
   */
  productMockup: `A high-resolution, studio-lit product photograph of a [product description] on a [background surface/description]. The lighting is a [lighting setup, e.g., three-point softbox setup] to [lighting purpose]. The camera angle is a [angle type] to showcase [specific feature]. Ultra-realistic, with sharp focus on [key detail]. [Aspect ratio].`,

  /**
   * High-fidelity detail preservation
   * To ensure critical details (like a face or logo) are preserved during an edit, describe them in great detail.
   */
  detailPreservation: `Using the provided images, place [element from image 2] onto [element from image 1]. Ensure that the features of [element from image 1] remain completely unchanged. The added element should [description of how the element should integrate].`,
}

export const BEST_PRACTICES = {
  hyperSpecific: 'Be Hyper-Specific: The more detail you provide, the more control you have.',
  contextAndIntent: 'Provide Context and Intent: Explain the purpose of the image.',
  iterateAndRefine: 'Iterate and Refine: Use the conversational nature of the model to make small changes.',
  stepByStep: 'Use Step-by-Step Instructions: For complex scenes with many elements, break your prompt into steps.',
  semanticNegative: 'Use "Semantic Negative Prompts": Instead of saying "no cars," describe the desired scene positively.',
  cameraControl: 'Control the Camera: Use photographic and cinematic language to control the composition. Terms like wide-angle shot, macro shot, low-angle perspective.',
}

