'use client'

import { useSearchParams } from 'next/navigation'
import QuizCard from '@/components/QuizCard'
import QuizHeader from '@/components/QuizHeader'
import { useAuthAndSubscription } from '@/hooks/useAuthAndSubscribed'
import { useQuizData } from '@/hooks/useQuizData'
import { useQuizLogic } from '@/hooks/useQuizLogic' 


export default function QuizPage() {
  const searchParams = useSearchParams()
  const language = searchParams.get('language') || 'english'
  const level = searchParams.get('level') || 'beginner'
  const background = searchParams.get('background') || ''

  const { user, isSubscribed, authLoading } = useAuthAndSubscription()
  const feature = 'quiz' // 💡 機能種別を指定

  const { quizList, loading } = useQuizData({ language, level, background, user, feature, isSubscribed, authLoading })
  
  const {
    currentIndex,
    score,
    isAnswered,
    handleAnswer,
  } = useQuizLogic({ quizList, user, language, level})

  const currentQuiz = quizList[currentIndex]
  const totalCount = quizList.length


  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg">{authLoading ? '認証を確認中...' : 'クイズを読み込み中...'}</p>
        </div>
      </div>
    )
  }
  console.log(currentQuiz )
  if (!currentQuiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">クイズデータがありません</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        <QuizHeader score={score} currentIndex={currentIndex} totalCount={totalCount} /> 

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