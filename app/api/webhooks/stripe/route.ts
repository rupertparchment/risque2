import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Update user membership status
      const userId = session.metadata?.userId
      if (userId) {
        const membershipStart = new Date()
        const membershipEnd = new Date()
        membershipEnd.setFullYear(membershipEnd.getFullYear() + 1)

        await prisma.user.update({
          where: { id: userId },
          data: {
            membershipStatus: 'active',
            membershipStart,
            membershipEnd,
          },
        })

        // Create payment record
        await prisma.payment.create({
          data: {
            userId,
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || 'usd',
            status: 'completed',
            stripePaymentId: session.payment_intent as string,
            paymentType: 'membership',
          },
        })
      }
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
