'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { standardCalculator } from '@/actions/quiz-limit' 

export default function HomeForm() {
  const [language, setLanguage] = useState('english')
  const [background, setBackground] = useState('daily-conversation')
  const [level, setLevel] = useState('A1')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isWordQuiz, setIsWordQuiz] = useState(true) 
  const router = useRouter()


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
      const result = await standardCalculator(user.id)
      
      if (result.status === 'error') {
        setError(result.message)
        setIsLoading(false)
        return
      }

      const params = new URLSearchParams({ language, level, background })
      const destinationPath = isWordQuiz ? '/quiz' : '/quiz/writing'
      
      router.push(`${destinationPath}?${params.toString()}`)
    } catch (err) {
      console.error('Error starting feature:', err)
      setError(`${isWordQuiz ? '単語クイズ' : 'ライティング'}を開始できませんでした。しばらく時間をおいてから再度お試しください。`)
    } finally {
      setIsLoading(false)
    }
  }

  
  const currentTitle = isWordQuiz ? "単語クイズ" : "AIライティング/翻訳"
  const startButtonLabel = isWordQuiz ? "🚀 単語クイズを始める" : "✍️ ライティングを始める"


  const featureCardBaseStyle = "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-center h-full"
  
  return (
    <div className="bg-blue-50 flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="relative z-[9998] max-w-md w-full my-8">
        <div className="text-center mb-8">
          <p className="text-xl text-gray-500 font-medium">学習モードを選択してください</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📚 学習機能を選択
            </label>
            <div className="grid grid-cols-2 gap-4">
              
              <div 
                onClick={() => setIsWordQuiz(true)}
                className={`${featureCardBaseStyle} ${
                  isWordQuiz 
                    ? 'border-blue-500 bg-blue-50 shadow-md text-blue-700' 
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="text-4xl mb-1">🧠</div>
                <div className="font-bold text-base">単語クイズ</div>
                <div className="text-xs opacity-80 mt-0.5">瞬発力と語彙力の強化</div>
              </div>
              
              <div 
                onClick={() => setIsWordQuiz(false)}
                className={`${featureCardBaseStyle} ${
                  !isWordQuiz 
                    ? 'border-purple-500 bg-purple-50 shadow-md text-purple-700' 
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="text-4xl mb-1">✍️</div>
                <div className="font-bold text-base">AIライティング/翻訳練習</div>
                <div className="text-xs opacity-80 mt-0.5">作文力と表現力の強化</div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 pt-4 border-t border-gray-100">
            {currentTitle} の設定
          </h2>


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
                <option value="accademic">アカデミック</option>
                <option value="travel">旅行</option>
                <option value="culture">文化・歴史</option>
                <option value="food">食べ物・料理</option>
                <option value="technology">テクノロジー</option>
                <option value="science">科学</option>
                <option value="sports">スポーツ</option>
                <option value="entertainment">エンタメ</option>
                <option value="health">健康・医療</option>
                <option value="environment">環境・自然</option>
                <option value="politics">政治・社会問題</option>
                <option value="economics">経済・ビジネスニュース</option>
                <option value="literature">文学・小説</option>
                <option value="art">アート・デザイン</option>
                <option value="fashion">ファッション</option>
                <option value="hiphop-rap">Hiphop/rap</option>
                <option value="fishing-industry">漁業</option>
                <option value="history">歴史</option>
                <option value="philosophy">哲学・思想</option>
                <option value="psychology">心理学・人間行動</option>
                <option value="education">教育</option>
                <option value="law">法律・規制</option>
                <option value="real-estate">不動産</option>
                <option value="marketing">マーケティング・広告</option>
                <option value="finance">金融・投資</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

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


          <button 
            onClick={handleStart} 
            disabled={isLoading}
            className={`w-full py-4 bg-gradient-to-r ${isWordQuiz ? 'from-blue-600 to-purple-600' : 'from-purple-600 to-pink-600'} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed transform-none' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>読み込み中...</span>
              </>
            ) : (
              <span>{startButtonLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}