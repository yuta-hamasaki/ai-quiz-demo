'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function getUserSession(){
  const supabase = await createClient()
  const {data, error} = await supabase.auth.getSession()
  if(error) {
    console.error("Error getting user session:", error)
    return null
  }
  return {status: "success", user: data?.session?.user}
}

export async function logIn(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error, data } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    redirect('/error')
  }

  const { data: existingUser } = await supabase.from('user_profile').select('*').eq('email', credentials.email).limit(1).single()

  if(!existingUser) {
    const {error: insertError} = await supabase.from('user_profile').insert({
      email: data?.user?.email,
      username: data?.user?.user_metadata?.username,
  })
  if(insertError) {
    return {
      status: 'error',
      message: insertError.message,
      user: null
    }
  }
}

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const credentials = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        username: credentials.username,
      }
    }
  })

  if (error) {
    return{
      status: 'error',
      message: error.message,
      user: null
    }
  }else if(data?.user?.identities?.length === 0){
    return {
      status: 'error',
      message: 'User already exists',
      user: null
    }
  }

  revalidatePath('/', 'layout')
  return {
    status: 'success',
    message: 'User created successfully',
    user: data.user
  }
}

export async function signOut(){
  const supabase = await createClient()

  const {error} = await supabase.auth.signOut()

  if(error){
    redirect('/error')
  }
  

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signInWithGoogle() {
  const origin = (await headers()).get("origin")
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Error signing in with Google:', error)
    return { status: 'error', message: error.message }
  }else if (data?.url) {
    return redirect(data.url)
  }

  // revalidatePath('/', 'layout')
  // redirect('/')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get('email') as string

  const { error, data } = await supabase.auth.resetPasswordForEmail(email,{
    redirectTo: `${origin}/auth/reset-password`,
  })

  if (error) {
    return {
      status: 'error',
      message: error.message,
    }
  }

  return {
    status: 'success',
    message: 'Password reset email sent successfully',
  }
}

export async function resetPassword(formData: FormData, code: string) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const password = formData.get('password') as string

  const { error: CodeError } = await supabase.auth.exchangeCodeForSession(code)

  if (CodeError) {
    return {
      status: 'error',
      message: CodeError.message,
    }
  }

  return {
    status: 'success',
    message: 'Password reset successfully',
  }
}
