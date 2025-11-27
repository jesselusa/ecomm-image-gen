/**
 * Product-Type-Specific Context Mappings
 * Defines appropriate e-commerce contexts based on product type.
 */

export type ProductType = 'clothing' | 'mug' | 'drinkware' | 'electronics' | 'accessories' | 'general'

export interface ProductContext {
  contexts: string[]
  defaultTransformation: string
}

export const PRODUCT_CONTEXTS: Record<ProductType, ProductContext> = {
  clothing: {
    contexts: [
      'worn by an attractive model',
      'neatly folded on a table',
      'styled on a hanger',
      'flat lay styled with accessories',
      'worn in a lifestyle setting',
    ],
    defaultTransformation: 'worn by an attractive model',
  },
  mug: {
    contexts: [
      'being held by a person',
      'on a table or countertop',
      'in use with coffee/tea',
      'on a desk with other items',
      'in a cozy home setting',
    ],
    defaultTransformation: 'being held by a person or on a table',
  },
  drinkware: {
    contexts: [
      'being held by a person',
      'on a table or countertop',
      'in use with beverage',
      'on a desk with other items',
      'in a lifestyle setting',
    ],
    defaultTransformation: 'being held by a person or on a table',
  },
  electronics: {
    contexts: [
      'on a desk',
      'in hand',
      'in use',
      'lifestyle context',
      'on a clean surface',
    ],
    defaultTransformation: 'on a desk or in hand',
  },
  accessories: {
    contexts: [
      'worn/styled',
      'on display',
      'lifestyle integration',
      'with complementary items',
      'in a styled setting',
    ],
    defaultTransformation: 'worn/styled or on display',
  },
  general: {
    contexts: [
      'e-commerce appropriate lifestyle/product shot',
      'on a clean background',
      'in a styled setting',
      'with complementary items',
      'professional product photography',
    ],
    defaultTransformation: 'e-commerce appropriate lifestyle/product shot',
  },
}

/**
 * Get appropriate contexts for a product type
 */
export function getProductContexts(productType: ProductType): ProductContext {
  return PRODUCT_CONTEXTS[productType] || PRODUCT_CONTEXTS.general
}

