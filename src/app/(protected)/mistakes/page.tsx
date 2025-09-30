'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Trash2, BookOpen, RotateCcw } from 'lucide-react'

interface Mistake {
  id: number
  meaning: string
  selected: string
  correct: string
  language: string
  level: string
  created_at: string
  updated_at: string
}

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    // URLパラメータから初期値を設定
    const language = searchParams.get('language')
    const level = searchParams.get('level')
    if (language) setSelectedLanguage(language)
    if (level) setSelectedLevel(level)
  }, [searchParams])

  const fetchMistakes = async () => {
    if (!user) return

    try {
      const supabase = createClient()
      let query = supabase
        .from('mistakes')
        .select('*')
        .eq('user_id', user.id)

      // フィルタを適用
      if (selectedLanguage !== 'all') {
        query = query.eq('language', selectedLanguage)
      }
      if (selectedLevel !== 'all') {
        query = query.eq('level', selectedLevel)
      }

      const { data, error } = await query

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

  useEffect(() => {
    if (user) {
      fetchMistakes()
    }
  }, [user, selectedLanguage, selectedLevel])

  const deleteMistake = async (id: number) => {
    if (!user) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('mistakes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting mistake:', error)
      } else {
        setMistakes(prev => prev.filter(mistake => mistake.id !== id))
      }
    } catch (err) {
      console.error('Delete mistake error:', err)
    }
  }

  const clearAllMistakes = async () => {
    if (!user || !window.confirm('すべての間違いを削除しますか？この操作は取り消せません。')) return

    try {
      const supabase = createClient()
      let query = supabase
        .from('mistakes')
        .delete()
        .eq('user_id', user.id)

      // フィルタが適用されている場合、そのフィルタに該当するもののみ削除
      if (selectedLanguage !== 'all') {
        query = query.eq('language', selectedLanguage)
      }
      if (selectedLevel !== 'all') {
        query = query.eq('level', selectedLevel)
      }

      const { error } = await query

      if (error) {
        console.error('Error clearing mistakes:', error)
      } else {
        fetchMistakes() // データを再取得
      }
    } catch (err) {
      console.error('Clear mistakes error:', err)
    }
  }

  const getLanguageDisplay = (lang: string) => {
    const languages: { [key: string]: string } = {
      'english': '英語',
      'spanish': 'スペイン語',
      'german': 'ドイツ語',
      'french': 'フランス語',
      'korean': '韓国語',
      'chinese': '中国語',
      'dutch': 'オランダ語'
    }
    return languages[lang] || lang
  }

  const getLevelDisplay = (level: string) => {
    const levels: { [key: string]: string } = {
      'A1': 'A1',
      'A2': 'A2',
      'B1': 'B1',
      'B2': 'B2',
      'C1': 'C1',
      'C2': 'C2'
    }
    return levels[level] || level
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">ログインが必要です</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            ログインする
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">間違いを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">間違いノート</h1>
              <p className="text-gray-600">復習して知識を定着させましょう</p>
            </div>
            
            {/* フィルタ */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">すべての言語</option>
                <option value="english">英語</option>
                <option value="spanish">スペイン語</option>
                <option value="german">ドイツ語</option>
                <option value="french">フランス語</option>
                <option value="korean">韓国語</option>
                <option value="chinese">中国語</option>
                <option value="dutch">オランダ語</option>
              </select>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">すべてのレベル</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>

          {/* 統計とアクション */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-orange-800 font-medium">
                  {mistakes.length}件の間違い
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <BookOpen size={16} />
                ホーム
              </button>
              {mistakes.length > 0 && (
                <button
                  onClick={clearAllMistakes}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  すべて削除
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 間違い一覧 */}
        {mistakes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <BookOpen size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">間違いがありません</h3>
            <p className="text-gray-500 mb-6">素晴らしい！すべて正解できています。</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              新しいクイズに挑戦
            </button>
          </div>
        ) : (
          <div className="grid gap-2">
            {mistakes.map((mistake) => (
              <div key={mistake.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{mistake.correct}</h3>
                      <div className="flex gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getLanguageDisplay(mistake.language)}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getLevelDisplay(mistake.level)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600">{mistake.meaning}</p>
                  </div>
                  
                  <button
                    onClick={() => deleteMistake(mistake.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="削除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}