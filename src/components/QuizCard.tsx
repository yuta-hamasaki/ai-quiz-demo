import { useState, useEffect } from 'react'

const QuizCard = ({
  currentIndex,
  word,
  meaning,
  options,
  correct,
  onAnswer,
  disabled,
}: {
  currentIndex: number
  word: string
  meaning: string
  options: string[]
  correct: string
  onAnswer: (selected: string, correct: string) => void
  disabled: boolean
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

    useEffect(() => {
    setSelectedOption(null)
  }, [currentIndex])

  const handleAnswerCheck = (option: string) => {
    if (selectedOption) return // 二度押し防止
    setSelectedOption(option)
    onAnswer(option, correct)
  }

  return (
    <div className="bg-blue-200 shadow-md rounded-lg p-4 mb-4">
      <h3>{currentIndex + 1}. {meaning}</h3>
      <ul className="p-5 mt-2 space-y-2">
        {options.map((option, index) => {
          const isSelected = option === selectedOption
          const isCorrect = option === correct

          let optionStyle = "text-gray-700 rounded-md p-2 shadow-md cursor-pointer bg-slate-50 hover:bg-gray-100"

          if (selectedOption) {
            if (isCorrect) optionStyle = "bg-green-500 text-white p-2 shadow-md rounded-md"
            else if (isSelected) optionStyle = "bg-red-500 text-white p-2 shadow-md rounded-md"
            else optionStyle = "bg-gray-200 text-gray-500 p-2 shadow-md rounded-md"
          }

          return (
            <div
              key={index}
              className={optionStyle}
              onClick={() => handleAnswerCheck(option)}
            >
              {option}
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default QuizCard
