import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

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

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // const profile = await getProfileData(data?.user?.id);
  // console.log('profile', profile);
  // if (!profile?.is_subscribed) {
  //   redirect('/select-plan');
  //   return null;
  // }


  return <>{children}</>;
}