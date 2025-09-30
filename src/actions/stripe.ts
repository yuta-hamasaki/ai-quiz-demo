"use server"
import { createClient } from '@/utils/supabase/server';
import initStripe from "stripe";

type Props = {
  userId: string;
  priceId?: string;
};

export const subscribeAction = async ({ userId, priceId }: Props) => {
  const supabase = createClient()
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string);

  const {data: user} = await (await supabase)
  .from("user_profile")
  .select("*")
  .eq("id", userId)
  .single()

  let customerId = user?.stripe_customer_id;

  if(!customerId){
    const newCustomer = await stripe.customers.create({
      email: user?.email,
      metadata: {
        userId: userId,
        username: user?.username,
      },
    });

    customerId = newCustomer.id;

    await (await supabase)
      .from("user_profile")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId);
  }

  const { url } = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      email: user?.email,
      username: user?.username,
    },
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_URL}/`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/select-plan`,
    allow_promotion_codes: true,
  }
);

  return url;
};