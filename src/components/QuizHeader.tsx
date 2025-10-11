interface QuizHeaderProps {
  score: number
  currentIndex: number
  totalCount: number
}

export default function QuizHeader({ score, currentIndex, totalCount }: QuizHeaderProps) {
  const progressPercent = (totalCount > 0) ? ((currentIndex + 1) / totalCount) * 100 : 0
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">単語クイズ</h1>
        <div className="text-right">
          <p className="text-lg font-semibold text-blue-600">スコア: {score}</p>
          <p className="text-sm text-gray-600">
            問題 {currentIndex + 1} / {totalCount}
          </p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  )
}