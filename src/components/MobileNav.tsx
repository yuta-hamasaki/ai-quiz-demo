"use client"
import PortalBtn from './PortalBtn'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// ユーザー型定義
interface User {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

interface MobileNavProps {
  user: User | null
  signOut: () => Promise<void>
}

export default function MobileNav({ user, signOut }: MobileNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  // メニューが開いている時のボディスクロール制御
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label={isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed top-16 h-screen left-0 right-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 shadow-lg z-50 md:hidden transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="mobile-menu-button"
      >
        <div className="px-4 py-4 space-y-3 max-h-screen overflow-y-auto">
          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center space-x-3 px-3 py-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-white/30 to-white/20 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-semibold text-white">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white/90 font-medium">
                    {user.email?.split('@')[0] || 'ユーザー'}
                  </div>
                  <div className="text-xs text-white/70">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1" role="navigation">
                <Link 
                  href="/" 
                  className="flex items-center px-3 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  <span className="mr-3" aria-hidden="true">🏠</span>
                  ホーム
                </Link>
                <Link 
                  href="/mistakes" 
                  className="flex items-center px-3 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  <span className="mr-3" aria-hidden="true">📚</span>
                  間違いノート
                </Link>
                <div
                  className="flex items-center px-3 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  <PortalBtn/>
                </div>
                {/* <Link 
                  href="/dashboard" 
                  className="flex items-center px-3 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  <span className="mr-3" aria-hidden="true">📊</span>
                  ダッシュボード
                </Link> */}
              </nav>

              {/* Logout button */}
              <form className="pt-2">
                <button 
                  formAction={signOut}
                  className="w-full flex items-center justify-center px-3 py-3 text-white bg-gray-500/80 hover:bg-gray-500 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                  role="menuitem"
                >
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-3">
              <Link 
                href="/login"
                className="block px-3 py-3 text-blue-600 bg-white rounded-lg font-medium hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={closeMobileMenu}
                role="menuitem"
              >
                ログイン
              </Link>
              <Link 
                href="/register"
                className="block px-3 py-3 text-white bg-white/20 rounded-lg font-medium hover:bg-white/30 hover:scale-105 transition-all duration-200 border border-white/30 shadow-sm hover:shadow-md text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={closeMobileMenu}
                role="menuitem"
              >
                新規登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}