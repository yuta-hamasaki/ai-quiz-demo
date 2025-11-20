import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveMistake } from '@/actions/mistakes'
import { Quiz } from '@/types/quiz'

interface QuizLogicProps {
  quizList: Quiz[]
  user: any
  language: string
  level: string
}

interface QuizLogicResult {
  currentIndex: number
  score: number
  isAnswered: boolean
  handleAnswer: (selected: string, correct: string) => Promise<void>
}

export const useQuizLogic = ({ quizList, user, language, level}: QuizLogicProps): QuizLogicResult => {
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const router = useRouter()

  const currentQuiz = quizList[currentIndex]

  const handleNext = () => {
    setTimeout(() => {
      if (currentIndex < quizList.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsAnswered(false)
      } else {
        let fixedScore = score +1
        localStorage.setItem('quiz_score', fixedScore.toString())
        localStorage.setItem('quiz_total', quizList.length.toString())
        
        router.push(`/quiz/result?score=${score}&total=${quizList.length}&language=${language}&level=${level}`)
      }
    }, 1000)
  }

  const handleAnswer = async (selected: string, correct: string) => {
    if (isAnswered) return
    setIsAnswered(true)

    if (selected === correct) {
      setScore(prev => prev + 1)
    } else {
      if (user && currentQuiz) {
        try {
          const result = await saveMistake(
            user.id,
            currentQuiz.meaning,
            correct,
            language,
            level
          )
        } catch (error) {
          console.error('Error saving mistake:', error)
        }
      }
    }

    handleNext()
  }

  return { currentIndex, score, isAnswered, handleAnswer }
}