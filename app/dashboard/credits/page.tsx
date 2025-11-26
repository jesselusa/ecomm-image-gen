'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { toast } from 'sonner'

const PLANS = [
  {
    name: 'Starter',
    price: 10,
    credits: 50,
    priceId: 'price_H5ggYJ...', // Replace with actual Stripe Price ID
  },
  {
    name: 'Pro',
    price: 25,
    credits: 150,
    priceId: 'price_12345...',
  },
]

export default function CreditsPage() {
  const handlePurchase = async (priceId: string) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to start checkout')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Buy Credits</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {PLANS.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold mt-2">
                ${plan.price} <span className="text-base font-normal text-muted-foreground">/ {plan.credits} credits</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Access to Nano Banana Model
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  High Quality Downloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Commercial Usage Rights
                </li>
              </ul>
              <Button onClick={() => handlePurchase(plan.priceId)} className="w-full" size="lg">
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

