
import { createClient } from '@/utils/supabase/server'
import HomeForm from '@/components/HomeForm'
import { redirect } from 'next/navigation'

const getProfileData = async (
  userId: string | undefined
) => {
  const supabase = await createClient();
  if (!userId) {
    return null;
  }
  const { data: profile } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userId)
    .single();
  return profile;
};

export default async function HomePage() {


  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()
  const profile = await getProfileData(user?.id);
  const isSubscribed = profile?.is_subscribed || false;

  if (!isSubscribed) {
    redirect('/select-plan');
    return null;
  }
  if (!user) {
    redirect('/login')
  }


  return (
    <>
    {user && isSubscribed ? (
      <HomeForm/>
    ):(
      <>You are not currently in plan</>
    )
  }
    </>
  )
}