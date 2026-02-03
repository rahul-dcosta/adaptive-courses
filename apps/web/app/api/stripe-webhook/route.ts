import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getErrorMessage } from '@/lib/types';
import { supabaseAdmin } from '@/lib/supabase';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-01-28.clover' })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      console.error('Stripe not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature provided');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;

    try {
      if (!webhookSecret) {
        // In development without webhook secret, parse the body directly
        // WARNING: This is insecure and should only be used in development
        console.warn('STRIPE_WEBHOOK_SECRET not set - skipping signature verification');
        event = JSON.parse(body) as Stripe.Event;
      } else {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);
  console.log('Metadata:', session.metadata);

  const courseId = session.metadata?.course_id;
  const topic = session.metadata?.topic;
  const customerEmail = session.customer_email;

  // Mark course as paid in database
  if (courseId && courseId !== 'pending') {
    try {
      const { error } = await supabaseAdmin
        .from('courses')
        .update({
          paid: true,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          customer_email: customerEmail,
        })
        .eq('id', courseId);

      if (error) {
        console.error('Failed to update course:', error);
      } else {
        console.log(`Course ${courseId} marked as paid`);
      }
    } catch (err) {
      console.error('Database error:', err);
    }
  }

  // Log the purchase for analytics
  try {
    await supabaseAdmin.from('purchases').insert({
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent as string,
      customer_email: customerEmail,
      amount_total: session.amount_total,
      currency: session.currency,
      course_id: courseId || null,
      topic: topic || null,
      metadata: session.metadata,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    // Table might not exist yet, that's OK
    console.log('Purchase logging skipped (table may not exist):', err);
  }

  // TODO: Send confirmation email via Resend
  // if (customerEmail) {
  //   await sendPurchaseConfirmation(customerEmail, topic, courseId);
  // }
}

