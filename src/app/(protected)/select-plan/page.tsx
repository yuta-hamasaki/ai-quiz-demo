import { createClient } from '@/utils/supabase/server';
import PriceCards from '@/components/PriceCards';
import { redirect } from 'next/navigation';

export default async function page() {
    const supabase = createClient();
    const { data: { user } } = await (await supabase).auth.getUser()
    if (!user) {
        return null;
    }

    const { data: isSubscribed } = await (await supabase)
        .from("user_profile")
        .select("is_subscribed")
        .eq("id", user.id)
        .single();

        if(isSubscribed?.is_subscribed) {
          redirect('/'); // Redirect to home if already subscribed
        }

  return (
    <div>
      {user && <PriceCards
        user={user}
      />
      }

      {!user && "could not find user"}
    </div>
  )
}




