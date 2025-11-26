import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    // Calculate credits based on amount/price
    // This is simplified. In real app, lookup price ID to credit amount map
    const creditsToAdd = 50 // Example default

    if (userId) {
      const supabase = createAdminClient()
      
      // Fetch current credits first
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', userId)
        .single()

      if (fetchError) {
        console.error('Error fetching profile:', fetchError)
        return new NextResponse('Error fetching user profile', { status: 500 })
      }

      const newBalance = (profile?.credits_balance || 0) + creditsToAdd

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits_balance: newBalance })
        .eq('id', userId)
        
      if (updateError) {
        console.error('Error updating credits:', updateError)
        return new NextResponse('Error updating user credits', { status: 500 })
      }
    }
  }

  return new NextResponse(null, { status: 200 })
}

