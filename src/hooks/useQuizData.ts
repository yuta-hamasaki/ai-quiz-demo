import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { Quiz, Writing } from '@/types/quiz'


interface QuizDataProps {
  language: string
  level: string
  background: string
  user: any | null
  feature: 'quiz' | 'writing' // 機能種別
  isSubscribed: boolean
  authLoading: boolean
}

interface QuizDataState {
  quizList: any[] // Quiz[] | Writing[]
  loading: boolean
}



export const useQuizData = ({ language, level, user, isSubscribed, feature, authLoading, background }: QuizDataProps): QuizDataState => {
  const [quizList, setQuizList] = useState<Quiz[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!user || !isSubscribed || authLoading) return
    
    if (!language || !level || !background) {
      redirect('/')
      return
    }

    const fetchQuiz = async () => {
      setLoading(true)
      try {

        let apiPath = ""
        if(feature === 'quiz') {
          apiPath = `/api/quiz?language=${language}&level=${level}&background=${background}`
        } else if (feature === 'writing') {
          apiPath = `/api/quiz/writing?language=${language}&level=${level}&background=${background}`
        }else{
          setLoading(false)
          return;
        }


        const res = await fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
          throw new Error(`API call failed: ${res.statusText}`);
        }

        const data = await res.json()
        setQuizList(data)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [language, level,background, user, isSubscribed, authLoading])

  return { quizList, loading }
}

