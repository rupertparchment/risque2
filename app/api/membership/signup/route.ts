import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      receiveEmails,
      digitalSignature,
      referralSourceId,
    } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Helper function to parse date strings
    const parseLocalDate = (dateString: string): Date => {
      if (!dateString || dateString.trim() === '') {
        throw new Error('Empty date string')
      }
      const [year, month, day] = dateString.split('-').map(Number)
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date format')
      }
      return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    }

    // Clean phone number
    const cleanPhone = phone ? phone.replace(/\D/g, '') : null
    const phoneToStore = cleanPhone && cleanPhone.length === 10 ? cleanPhone : null

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      metadata: {
        firstName,
        lastName,
      },
    })

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phoneToStore,
        dateOfBirth: dateOfBirth && dateOfBirth.trim() ? parseLocalDate(dateOfBirth) : null,
        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        receiveEmails: receiveEmails !== undefined ? receiveEmails : true,
        digitalSignature: digitalSignature || null,
        referralSourceId: referralSourceId || null,
        stripeCustomerId: customer.id,
        membershipStatus: 'pending',
      },
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Risqué Annual Membership',
              description: 'Annual membership to Risqué lifestyle club',
            },
            unit_amount: 50000, // $500.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/membership`,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Membership signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create membership' },
      { status: 500 }
    )
  }
}
