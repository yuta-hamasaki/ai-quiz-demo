'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface Mistake {
  id: number
  word: string
  meaning: string
  correct: string
  language: string
  level: string
  created_at: string
}

export default function QuizResultPage() {
  const [score, setScore] = useState<number>(0)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const language = searchParams.get('language') || 'english'
  const level = searchParams.get('level') || 'beginner'

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    // URLパラメータまたはlocalStorageからスコア情報を取得
    const scoreParam = searchParams.get('score')
    const totalParam = searchParams.get('total')
    
    if (scoreParam && totalParam) {
      setScore(parseInt(scoreParam))
      setTotalQuestions(parseInt(totalParam))
    } else {
      // localStorageから取得（フォールバック）
      const savedScore = localStorage.getItem('quiz_score')
      const savedTotal = localStorage.getItem('quiz_total')
      if (savedScore && savedTotal) {
        setScore(parseInt(savedScore))
        setTotalQuestions(parseInt(savedTotal))
      }
    }
  }, [searchParams])

  useEffect(() => {
    const fetchMistakes = async () => {
      if (!user) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('mistakes')
          .select('*')
          .eq('user_id', user.id)
          .eq('language', language)
          .eq('level', level)

        if (error) {
          console.error('Error fetching mistakes:', error)
        } else {
          setMistakes(data || [])
        }
      } catch (err) {
        console.error('Fetch mistakes error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMistakes()
    } else {
      setLoading(false)
    }
  }, [user, language, level])

  const getScorePercentage = () => {
    if (totalQuestions === 0) return 0
    return Math.round((score / totalQuestions) * 100)
  }

  const getScoreMessage = () => {
    const percentage = getScorePercentage()
    if (percentage >= 90) return { message: '素晴らしい！', color: 'text-green-600' }
    if (percentage >= 70) return { message: 'よくできました！', color: 'text-blue-600' }
    if (percentage >= 50) return { message: 'もう少し頑張りましょう', color: 'text-yellow-600' }
    return { message: '復習が必要です', color: 'text-red-600' }
  }

  const handleRetry = () => {
    router.push(`/`)
  }

  const handleHome = () => {
    router.push('/')
  }

  const handleReviewMistakes = () => {
    router.push(`/mistakes?language=${language}&level=${level}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">結果を読み込み中...</p>
      </div>
    )
  }

  const scoreMessage = getScoreMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* メインの結果カード */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">クイズ結果</h1>
            
            {/* スコア表示 */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
              <div className="text-5xl font-bold mb-2">{score}/{totalQuestions}</div>
              <div className="text-xl mb-2">正答率: {getScorePercentage()}%</div>
              <div className={`text-lg font-semibold ${scoreMessage.color.replace('text-', 'text-white')}`}>
                {scoreMessage.message}
              </div>
            </div>

            {/* 言語・レベル情報 */}
            <div className="flex justify-center gap-4 mb-6">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                言語: {language === 'english' ? '英語' : language === 'japanese' ? '日本語' : language}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                レベル: {level === 'beginner' ? '初級' : level === 'intermediate' ? '中級' : level === 'advanced' ? '上級' : level}
              </span>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              もう一度挑戦
            </button>
            <button
              onClick={handleHome}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ホームに戻る
            </button>
            {mistakes.length > 0 && (
              <button
                onClick={handleReviewMistakes}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                間違いを復習
              </button>
            )}
          </div>
        </div>

        {/* 間違えた問題の概要 */}
        {mistakes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              今回間違えた問題 ({mistakes.length}問)
            </h2>
            <div className="space-y-4">
              {mistakes.slice(0, 5).map((mistake) => (
                <div key={mistake.id} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{mistake.word}</h3>
                      <p className="text-gray-600 mb-2">{mistake.meaning}</p>
                      <div className="text-sm">
                        <span className="text-green-600">{mistake.correct}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {mistakes.length > 5 && (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">
                    他に{mistakes.length - 5}問の間違いがあります
                  </p>
                  <button
                    onClick={handleReviewMistakes}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    すべての間違いを見る →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* パフォーマンス統計 */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-700 mb-2">正解数</h3>
            <p className="text-2xl font-bold text-green-600">{score}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-700 mb-2">間違い数</h3>
            <p className="text-2xl font-bold text-red-600">{totalQuestions - score}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-700 mb-2">正答率</h3>
            <p className="text-2xl font-bold text-blue-600">{getScorePercentage()}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}