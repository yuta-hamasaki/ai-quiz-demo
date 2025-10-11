import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface AuthState {
  user: any | null
  isSubscribed: boolean
  authLoading: boolean
}

export const useAuthAndSubscription = (): AuthState => {
  const [user, setUser] = useState<any>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [authLoading, setAuthLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          redirect('/login')
          return
        }
        
        const { data: profile, error } = await supabase
          .from('user_profile')
          .select('is_subscribed')
          .eq('id', user.id)
          .single()
        
        if (error || !profile) {
          console.error('Error fetching user profile or profile not found:', error)
          redirect('/login')
          return
        }
        
        setUser(user)
        setIsSubscribed(profile.is_subscribed || false)
        
        if (!profile.is_subscribed) {
          redirect('/subscription')
        }

      } catch (error) {
        console.error('Auth check error:', error)
        redirect('/login')
      } finally {
        setAuthLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  return { user, isSubscribed, authLoading }
}