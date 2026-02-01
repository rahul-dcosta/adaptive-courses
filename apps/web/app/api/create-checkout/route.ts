import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, situation, timeline, goal } = await request.json();

    // TODO: Initialize Stripe
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // TODO: Create checkout session
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: `Custom Course: ${topic}`,
    //           description: 'AI-generated personalized learning course',
    //         },
    //         unit_amount: 500, // $5.00
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${request.headers.get('origin')}/?canceled=true`,
    //   metadata: {
    //     topic,
    //     situation,
    //     timeline,
    //     goal,
    //   },
    // });

    // return NextResponse.json({ sessionId: session.id, url: session.url });

    // For now, return mock response
    return NextResponse.json({
      error: 'Stripe not configured yet',
      message: 'Payment integration coming soon'
    }, { status: 501 });

  } catch (error: any) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
