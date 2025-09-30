import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {data: {user},} = await supabase.auth.getUser()

    // ルートパス（/）での認証状態による分岐
  if (request.nextUrl.pathname === '/') {
    if (user) {
      // ログイン済み：ダッシュボードにリダイレクト
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    } else {
      // 未ログイン：マーケティングページにリダイレクト
      const url = request.nextUrl.clone()
      url.pathname = '/landing'
      return NextResponse.redirect(url)
    }
  }

  if(
    !user &&
    !request.nextUrl.pathname.includes('/landing') &&
    !request.nextUrl.pathname.includes('/login') &&
    !request.nextUrl.pathname.includes('/register') &&
    !request.nextUrl.pathname.includes('/forgot-password') &&
    !request.nextUrl.pathname.includes('/reset-password') &&
    !request.nextUrl.pathname.includes('/auth') 
  ){
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}