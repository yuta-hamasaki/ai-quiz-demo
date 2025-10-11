export interface Quiz {
  index: number
  word: string
  meaning: string
  options: string[]
  correct: string
}

export interface Writing {
  index: number
  jpText: string
  correctText: string
  keywords: string[]
}