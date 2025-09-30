'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, redirect } from 'next/navigation'
import QuizCard from '@/components/QuizCard'
import { saveMistake } from '@/actions/mistakes'
import { createClient } from '@/utils/supabase/client'

interface Quiz {
  index: number
  word: string
  meaning: string
  options: string[]
  correct: string
}

export default function QuizPage() {
  const [quizList, setQuizList] = useState<Quiz[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const searchParams = useSearchParams()
  const router = useRouter()

  const language = searchParams.get('language') || 'english'
  const level = searchParams.get('level') || 'beginner'

  // 認証チェック用useEffect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          redirect('/login')
          return
        }
        
        // user_profileから購読状況を取得
        const { data: profile, error } = await supabase
          .from('user_profile')
          .select('is_subscribed')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Error fetching user profile:', error)
          redirect('/login')
          return
        }
        
        setUser(user)
        setIsSubscribed(profile?.is_subscribed || false)
        setAuthLoading(false)
        
        // 購読していない場合は購読ページにリダイレクト
        if (!profile?.is_subscribed) {
          redirect('/subscription')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        redirect('/login')
      }
    }
    
    checkAuth()
  }, [])

  // クイズデータ取得用useEffect
  useEffect(() => {
    if (!user || !isSubscribed || authLoading) return
    
    if (!language || !level) {
      redirect('/')
      return
    }

    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz?language=${language}&level=${level}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await res.json()
        setQuizList(data)
        setLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [language, level, user, isSubscribed, authLoading])

  const handleNext = () => {
    setTimeout(() => {
      if (currentIndex < quizList.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsAnswered(false)
      } else {
        // クイズ終了時に結果ページに遷移
        // スコア情報をURLパラメータとlocalStorageの両方に保存
        localStorage.setItem('quiz_score', score.toString())
        localStorage.setItem('quiz_total', quizList.length.toString())
        
        router.push(`/quiz/result?score=${score}&total=${quizList.length}&language=${language}&level=${level}`)
      }
    }, 1000)
  }

  const currentQuiz = quizList[currentIndex]

  const handleAnswer = async (selected: string, correct: string) => {
    if (isAnswered) return
    setIsAnswered(true)

    if (selected === correct) {
      setScore(prev => prev + 1)
    } else {
      // 間違えた場合、mistakesテーブルに保存
      if (user) {
        try {
          const result = await saveMistake(
            user.id,
            currentQuiz.meaning,
            correct,
            language,
            level
          )

          if (result.status === 'success') {
            console.log('Mistake saved successfully:', result.data)
          } else {
            console.error('Error saving mistake:', result.message)
          }
        } catch (error) {
          console.error('Error saving mistake:', error)
        }
      } else {
        console.warn('User not authenticated, cannot save mistake')
      }
    }

    handleNext()
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">{authLoading ? '認証を確認中...' : 'クイズを読み込み中...'}</p>
        </div>
      </div>
    )
  }
  
  if (!currentQuiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">クイズデータがありません</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー情報 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">クイズ</h1>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">スコア: {score}</p>
              <p className="text-sm text-gray-600">
                問題 {currentIndex + 1} / {quizList.length}
              </p>
            </div>
          </div>
          
          {/* プログレスバー */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* クイズカード */}
        <QuizCard
          currentIndex={currentIndex}
          word={currentQuiz.word}
          meaning={currentQuiz.meaning}
          options={currentQuiz.options}
          correct={currentQuiz.correct}
          onAnswer={handleAnswer}
          disabled={isAnswered}
        />
      </div>
    </div>
  )
}