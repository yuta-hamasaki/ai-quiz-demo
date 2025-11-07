"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthAndSubscription } from '@/hooks/useAuthAndSubscribed'
import { useQuizData } from '@/hooks/useQuizData'
import { useSearchParams } from 'next/navigation'
import type { Writing } from '@/types/quiz'
interface Feedback {
  grammarCorrections: { original: string; corrected: string; reason: string }[];
  styleSuggestions: string; 
}

export default function Writing() {
    const router = useRouter()
  const searchParams = useSearchParams()

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [translationText, setTranslationText] = useState<string>('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const language = searchParams.get('language') || 'english'
  const level = searchParams.get('level') || 'beginner'
  const background = searchParams.get('background') || ''
  const { user, isSubscribed, authLoading } = useAuthAndSubscription()
  const feature = 'writing' // 💡 機能種別を指定
  const { quizList, loading } = useQuizData({ language,background, level, user,feature, isSubscribed, authLoading })


  const currentQuiz = quizList[currentIndex]
  const totalCount = quizList.length

  const currentPrompt: Writing = quizList[currentIndex]

    const handleNext = () => {
    setTimeout(() => {
      if (currentIndex < totalCount - 1) {
        setCurrentIndex(currentIndex + 1)
        setFeedback(null)
        setTranslationText('')
        setIsOpen(false);
      } else {
        router.push(`/`) 
      }
    }, 1000)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  }

    const handleSubmit = async () => {
    if (!translationText.trim() || !user || !currentPrompt) return

    setIsSubmitting(true)

    try {
        const res = await fetch('/api/quiz/writing/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                language: language,
                level: level,
                background: background,
                originalText: currentPrompt.jpText,
                userTranslation: translationText, 
            }),
        })

        if (!res.ok) {
            throw new Error('添削API呼び出しに失敗しました。')
        }

        const result: Feedback = await res.json()
        setFeedback(result)
        
    } catch (error) {
        console.error('添削エラー:', error)
        // TODO:ユーザー向けのエラー表示処理
    } finally {
        setIsSubmitting(false)
    }
  }

    if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg">{authLoading ? '認証を確認中...' : '課題を読み込み中...'}</p>
        </div>
      </div>
    )
  }

  if (!currentPrompt || totalCount === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">ライティング課題データがありません</p>
      </div>
    )
  }

  return (
<div className="min-h-screen bg-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">AIライティング/翻訳 練習</h1>
            <p className="text-sm text-gray-500">
                問題 {currentIndex + 1} / {totalCount}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
                ></div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
                これを{language.charAt(0).toUpperCase() + language.slice(1)}に翻訳・作文してください
            </h2>
            <p className="text-2xl font-medium text-gray-900 leading-relaxed">
                {currentPrompt.jpText} 
            </p>
        </div>

        <div>
        <hr className="my-6" />
        <button onClick={handleToggle} className='bg-slate-400 text-white py-3 px-2 rounded-md'>模範回答を{isOpen?  "隠す": "みる"}</button>
        {isOpen &&
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6 italic text-gray-800">
            {currentPrompt.correctText} 
        </div>
}
        </div>

        <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
                {language.charAt(0).toUpperCase() + language.slice(1)}に翻訳・作文
            </label>
            <textarea
                value={translationText}
                onChange={(e) => setTranslationText(e.target.value)}
                rows={8}
                placeholder="ここに翻訳または作文を入力してください..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 outline-none transition duration-200 resize-none text-lg"
                disabled={isSubmitting || !!feedback}
            />
        </div>

        {/* 3. アクションボタン */}
        <div className="flex justify-center space-x-4 mb-8">
            <button
                onClick={handleSubmit}
                disabled={isSubmitting || !translationText.trim() || !!feedback}
                className={`py-3 px-8 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                    isSubmitting || !!feedback
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01]'
                }`}
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>AIが添削中...</span>
                    </>
                ) : (
                    <span>添削を依頼する 🧠</span>
                )}
            </button>

                <button
                    onClick={handleNext}
                    className="py-3 px-8 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200"
                    disabled={isSubmitting}
                >
                    次の課題へ →
                </button>
        </div>

        {feedback && (
            <div className="bg-white rounded-xl shadow-2xl p-6 space-y-6">
                <h2 className="text-2xl font-bold text-purple-700 border-b pb-2 mb-4">
                    AI添削結果
                </h2>
                
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">模範解答</h3>
                    <p className="p-3 bg-gray-50 border border-gray-200 rounded-lg italic text-gray-800">
                        {currentPrompt.correctText} 
                    </p>
                </div>

                {feedback.grammarCorrections && feedback.grammarCorrections.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-red-600 mb-2">🚨 文法・語彙の修正点</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {feedback.grammarCorrections.map((correction, index) => (
                                <li key={index} className="text-gray-700">
                                    <span className="font-medium text-red-700">修正:</span> {correction.corrected} （元の表現: {correction.original}）
                                    {correction.reason && <span className="text-sm text-gray-500"> - {correction.reason}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {feedback.styleSuggestions && (
                    <div>
                        <h3 className="text-lg font-semibold text-purple-600 mb-2">💡 より自然な表現の提案</h3>
                        <p className="text-gray-700">{feedback.styleSuggestions}</p>
                    </div>
                )}

            </div>
        )}
      </div>
    </div>
  )
}
