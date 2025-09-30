'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { standardCalculator } from '@/actions/quiz-limit' 

export default function HomePage() {
  const [language, setLanguage] = useState('english')
  const [background, setBackground] = useState('daily-conversation')
  const [level, setLevel] = useState('A1')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // ユーザー情報を取得
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleStart = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // 利用制限チェック
      const result = await standardCalculator(user.id)
      
      if (result.status === 'error') {
        setError(result.message)
        setIsLoading(false)
        return
      }

      // 制限チェック通過 → クイズページへ
      const params = new URLSearchParams({ language, level, background })
      router.push(`/quiz?${params.toString()}`)
    } catch (err) {
      console.error('Error starting quiz:', err)
      setError('クイズを開始できませんでした。しばらく時間をおいてから再度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-blue-50 flex flex-col items-center justify-center p-4 ">
      {/* Main content */}
      <div className="relative z-[9998] max-w-md w-full my-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            クイズの設定
          </h1>
        </div>

        {/* Form card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 space-y-6">
          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Language selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📚 学習言語を選択
            </label>
            <div className="relative">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="w-full p-4 pr-10 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 font-medium appearance-none cursor-pointer hover:border-gray-200"
                disabled={isLoading}
              >
                <option value="english">🇺🇸 英語</option>
                <option value="german">🇩🇪 ドイツ語</option>
                <option value="spanish">🇪🇸 スペイン語</option>
                <option value="french">🇫🇷 フランス語</option>
                <option value="korean">🇰🇷 韓国語</option>
                <option value="chinese">🇨🇳 中国語</option>
                <option value="dutch">🇳🇱 オランダ語</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* industry selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ✏️分野、シチュエーションを選択
            </label>
            <div className="relative">
              <select 
                value={background} 
                onChange={(e) => setBackground(e.target.value)} 
                className="w-full p-4 pr-10 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 font-medium appearance-none cursor-pointer hover:border-gray-200"
                disabled={isLoading}
              >
                <option value="daily-conversation">日常会話</option>
                <option value="business">ビジネス</option>
                <option value="若者言葉-スラングフレーズ">スラング</option>
                {language === "english" && 
                <>
                  <option value="toefl">TOEFL</option>
                  <option value="英検">英検</option>
                  <option value="toeic">TOEIC</option>
                  <option value="ielts">IELTS</option>
                  <option value="duolingo-english-test">Duolingo English Test</option>
                </>
                }
                {language === "german" && 
                <>
                  <option value="独検">独検</option>
                  <option value="ゲーテ試験">ゲーテ試験</option>
                  <option value="DSH">DSH</option>
                </>
                }
                {language === "spanish" && 
                <>
                  <option value="西検">西検</option>
                  <option value="siele">SIELE</option>
                  <option value="dele">DELE</option>
                </>
                }
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Level selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 学習レベルを選択
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'A1', label: 'A1', desc: '初級' },
                { value: 'A2', label: 'A2', desc: '初中級' },
                { value: 'B1', label: 'B1', desc: '中級' },
                { value: 'B2', label: 'B2', desc: '中上級' },
                { value: 'C1', label: 'C1', desc: '上級' },
                { value: 'C2', label: 'C2', desc: '最上級' }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setLevel(item.value)}
                  disabled={isLoading}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    level === item.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs opacity-75">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button 
            onClick={handleStart} 
            disabled={isLoading}
            className={`w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed transform-none' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>読み込み中...</span>
              </>
            ) : (
              <span>🚀 クイズを始める</span>
            )}
          </button>

          {/* Feature highlights */}
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl">🧠</div>
                <div className="text-xs text-gray-600 font-medium">AI学習</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl">⚡</div>
                <div className="text-xs text-gray-600 font-medium">高速習得</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl">📈</div>
                <div className="text-xs text-gray-600 font-medium">進歩追跡</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}