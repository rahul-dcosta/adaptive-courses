import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getErrorMessage } from '@/lib/types';
import { PRICING } from '@/lib/constants';

// Initialize Stripe (will fail gracefully if key not set)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-01-28.clover' })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.warn('Stripe not configured - STRIPE_SECRET_KEY missing');
      return NextResponse.json(
        {
          error: 'Payment system not configured',
          message: 'Please contact support or try again later'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      courseId,
      topic,
      email,
      // Learner fingerprint data for metadata
      fingerprint
    } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Get the origin for redirect URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: PRICING.CURRENCY.toLowerCase(),
            product_data: {
              name: `Course: ${topic}`,
              description: 'AI-generated personalized learning course from Adaptive Courses',
              images: [`${origin}/og-image.png`],
            },
            unit_amount: Math.round(PRICING.COURSE_PRICE * 100), // $3.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId || 'pending'}`,
      cancel_url: `${origin}/?canceled=true`,
      customer_email: email || undefined,
      metadata: {
        course_id: courseId || '',
        topic,
        fingerprint: fingerprint || '',
        source: 'adaptive_courses',
      },
      // Allow promotion codes for marketing
      allow_promotion_codes: true,
      // Collect billing address for tax purposes
      billing_address_collection: 'auto',
      // Submit type for better UX
      submit_type: 'pay',
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: unknown) {
    console.error('Checkout creation error:', error);

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: 'Payment error',
          message: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: getErrorMessage(error) || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve session status (for success page)
export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      metadata: session.metadata,
      amountTotal: session.amount_total,
    });

  } catch (error: unknown) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
