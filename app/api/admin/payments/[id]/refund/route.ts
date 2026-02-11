import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/admin-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const body = await request.json().catch(() => ({}))
    const email = request.headers.get('x-admin-email') || body.email
    
    // Check if it's env var login
    const adminEmail = process.env.ADMIN_EMAIL
    const isEnvVarLogin = email === adminEmail
    
    // If not env var login, verify via AdminUser table
    if (!isEnvVarLogin) {
      const adminUser = await verifyAdminAccess(email)
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Unauthorized. Administrator access required.' },
          { status: 403 }
        )
      }
    }

    // Fetch the payment record
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    if (payment.status === 'refunded') {
      return NextResponse.json(
        { error: 'This payment has already been refunded' },
        { status: 400 }
      )
    }

    if (!payment.stripePaymentId) {
      return NextResponse.json(
        { error: 'No Stripe payment ID found. Cannot process refund.' },
        { status: 400 }
      )
    }

    // Process refund via Stripe
    let refund
    try {
      // For Payment Intents, create a refund
      refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentId,
        reason: 'requested_by_customer',
      })
    } catch (stripeError: any) {
      console.error('Stripe refund error:', stripeError)
      return NextResponse.json(
        { error: `Stripe refund failed: ${stripeError.message}` },
        { status: 500 }
      )
    }

    // Update payment status in database
    await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: 'refunded',
      },
    })

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      message: `Refund of $${payment.amount.toFixed(2)} processed successfully`,
    })
  } catch (error: any) {
    console.error('Failed to process refund:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process refund' },
      { status: 500 }
    )
  }
}
