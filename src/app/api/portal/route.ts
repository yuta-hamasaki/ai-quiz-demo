import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import initStripe from "stripe"

export async function GET(req:NextRequest){
  const supabase = createClient()
  const { data: user } = await (await supabase).auth.getUser()

  if(!user.user){
    return NextResponse.json("unauthorized",{ status: 401})
  }

  const {data: stripe_customer_data} = await (await supabase)
  .from("user_profile")
  .select("stripe_customer_id")
  .eq("id", user.user?.id)
  .single()

  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!)

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_data?.stripe_customer_id!,
    return_url: `${process.env.NEXT_PUBLIC_URL}/`
  })
  return NextResponse.json({url: session.url})
}