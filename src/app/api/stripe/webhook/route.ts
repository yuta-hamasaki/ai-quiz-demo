// API Route - app/api/webhooks/stripe/route.ts
import initStripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { Stripe } from "stripe";

export async function POST(req: NextRequest) {
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

  try {
    const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string);
    const signature = req.headers.get("stripe-signature");
    const signinSecret = process.env.STRIPE_SIGNIN_SECRET;

    // 環境変数の存在確認
    if (!signature) {
      return NextResponse.json(
        { message: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    if (!signinSecret) {
      return NextResponse.json(
        { message: "Missing STRIPE_SIGNIN_SECRET environment variable" },
        { status: 500 }
      );
    }

    // リクエストのバッファをそのまま取得
    const reqBuffer = Buffer.from(await req.arrayBuffer());

    let event: Stripe.Event;

    // webhookイベントの検証
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature,
      signinSecret
    );

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(supabase, event);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(supabase, event);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(supabase, event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}

// サブスクリプション作成時の処理
async function handleSubscriptionCreated(supabase: any, event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  if (!subscription.items.data[0]?.price) {
    console.error("No price data found in subscription");
    return;
  }

  const { error } = await supabase
    .from("user_profile")
    .update({
      is_subscribed: true,
      plan: subscription.id,
      price: subscription.items.data[0].price.id,
      interval: subscription.items.data[0].price.recurring?.interval,
    })
    .eq("stripe_customer_id", subscription.customer);

  if (error) {
    console.error("Error updating user profile on subscription created:", error);
    throw error;
  }
}

// サブスクリプション更新時の処理
async function handleSubscriptionUpdated(supabase: any, event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  if (subscription.status === "canceled" || subscription.status === "unpaid") {
    // サブスクリプションがキャンセルまたは未払いの場合
    const { error } = await supabase
      .from("user_profile")
      .update({
        is_subscribed: false,
        plan: null,
        price: null,
        interval: null,
      })
      .eq("stripe_customer_id", subscription.customer);

    if (error) {
      console.error("Error updating user profile on subscription canceled:", error);
      throw error;
    }
  } else if (subscription.status === "active") {
    // サブスクリプションがアクティブの場合
    if (!subscription.items.data[0]?.price) {
      console.error("No price data found in subscription");
      return;
    }

    const { error } = await supabase
      .from("user_profile")
      .update({
        is_subscribed: true,
        plan: subscription.id,
        price: subscription.items.data[0].price.id,
        interval: subscription.items.data[0].price.recurring?.interval,
      })
      .eq("stripe_customer_id", subscription.customer);

    if (error) {
      console.error("Error updating user profile on subscription updated:", error);
      throw error;
    }
  }
}

// サブスクリプション削除時の処理
async function handleSubscriptionDeleted(supabase: any, event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  const { error } = await supabase
    .from("user_profile")
    .update({
      is_subscribed: false,
      plan: null,
      interval: null,
      price: null,
    })
    .eq("stripe_customer_id", subscription.customer);

  if (error) {
    console.error("Error updating user profile on subscription deleted:", error);
    throw error;
  }
}