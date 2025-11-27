# PRD: Image Generation Feature

## Introduction
This PRD defines the core image generation workflow for Palette. It upgrades the basic generation endpoint to a sophisticated multi-step pipeline that analyzes the input image, engineers a high-quality prompt, and generates production-ready product photography using Google's Gemini models.

## Goals
-   Provide users with "High Quality" (Fast) and "Super High Quality" (Pro) generation options.
-   Maximize result quality by using an intermediate "Vision" step to understand the product.
-   Allow users to control the number of variations generated.
-   Optimize costs by using efficient models for the understanding phase.
-   Deliver a simple, intuitive UI for complex generative tasks.

## User Stories
1.  **Upload & Analyze**: As a user, I want to upload my product image and have the system automatically understand what it is (brand, product type, colors).
2.  **Customization**: As a user, I want to describe the scene I'm looking for (e.g., "on a marble table", "in a forest") so the AI knows the context.
3.  **Quality Selection**: As a user, I want to choose between "High Quality" (Standard) and "Super High Quality" (Best) based on my needs.
4.  **Quantity Control**: As a user, I want to use a slider to select how many variations to generate (e.g., 1-4).
5.  **Result Management**: As a user, I want to see my generated images in the dashboard and save/download them.

## Functional Requirements

### 1. User Inputs
-   **Source Image**: File upload (validated for image types).
-   **User Prompt**: Text area for describing the desired scene/outcome.
-   **Quality Selector**:
    -   Option A: "High Quality" (Maps to `gemini-2.5-flash-image`).
    -   Option B: "Super High Quality" (Maps to `gemini-3-pro-image-preview`).
-   **Quantity Slider**:
    -   Range: 1 to 10 images (MVP limit to prevent timeouts/excessive usage).
    -   Default: 1.

### 2. Technical Workflow (The "Nano Banana" Pipeline)
The generation process will follow a multi-step pipeline inspired by the reference `n8n` workflow:

#### Step 1: Image Understanding (Vision)
-   **Model**: `gemini-2.5-flash` (Text-only or Multimodal variant for analysis).
-   **Input**: User's uploaded image.
-   **Task**: Analyze the image to extract structured data:
    -   `brand_name`
    -   `product_description`
    -   `primary_color` / `palette`
    -   `visual_characteristics` (angle, lighting of original)
-   **Output**: JSON object with these attributes.

#### Step 2: Prompt Engineering (Agent)
-   **Model**: `gemini-2.5-flash` (Text).
-   **Input**:
    -   Data from Step 1 (Vision).
    -   User's custom prompt.
    -   Selected Quantity.
-   **Task**: Construct a optimized, detailed prompt for the image generation model.
    -   Combine user intent with product facts.
    -   Ensure brand consistency (colors, logo text if applicable).
    -   Format: "Create a product shot of [Product] by [Brand]... [Scene Description]... [Technical Details like lighting/camera]".
-   **Output**: A final "Production Ready" text prompt.

#### Step 3: Image Generation
-   **Model**: Selected by user (`gemini-2.5-flash-image` or `gemini-3-pro-image-preview`).
-   **Input**:
    -   Final Prompt from Step 2.
    -   Reference Image (Optional: depending on if we use Image-to-Image or Text-to-Image. *Decision: The reference workflow uses the uploaded image as input to the generation model as well to guide structure/identity.*)
-   **Output**: `N` generated images.

### 3. Database & Storage
-   **Storage**:
    -   `user_uploads/`: Original user images.
    -   `generated_images/`: Resulting AI images.
-   **Database (`generations` table)**:
    -   Update to store `model_used` ('flash-2.5' vs 'pro-3').
    -   Store `quantity`.
    -   Store `vision_analysis` (optional, for debugging/refining).

### 4. Usage Limits & Credits
-   **Credit Cost**:
    -   MVP: 1 Credit = 1 Generation Request (regardless of quality/quantity for simplicity, OR scale it).
    -   *Proposal*: 1 Credit per image generated. If user selects 4 images, it costs 4 credits.
-   **Rate Limits**: Enforce the daily limit (20 images/day).

## UI/UX Design
-   **Generation Form**:
    -   Clean, single-column layout.
    -   File uploader with preview.
    -   "Magic" prompt assistant (optional future).
    -   Simple controls (Quality Toggle, Quantity Slider).
    -   "Generate" button with loading state (this process will take 10-30s).
-   **Loading State**: Show progress ("Analyzing image...", "Constructing prompt...", "Rendering...").

## Non-Goals (MVP)
-   Advanced in-painting/masking.
-   Manual fine-tuning of the Vision analysis (user can't edit the extracted brand name yet).
-   Background removal (unless inherent to generation).

## Success Metrics
-   Successful generation of images using both models.
-   Vision step accurately identifying product colors/types.
-   User satisfaction with "Super High Quality" vs "High Quality" distinction.

