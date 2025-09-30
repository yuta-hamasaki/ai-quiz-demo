"use server"

import { createClient } from '@/utils/supabase/server'

export async function saveMistake(
  user_id: string,
  meaning: string,
  correct: string,
  language: string,
  level: string
) {
  const supabase = await createClient()

  try {
    // 既存の間違いをチェック（複合キーでチェック）
    const { data: existingMistake, error: existingError } = await supabase
      .from('mistakes')
      .select('*')
      .eq('user_id', user_id)
      .eq('correct', correct)
      .eq('language', language)
      .eq('level', level)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      // PGRST116は「行が見つからない」エラーなので無視
      console.error('Error checking existing mistake:', existingError)
      return { status: 'error', message: existingError.message }
    }

    if (existingMistake) {
      // 既存の単語がある場合は更新
      const { data: updatedMistake, error: updateError } = await supabase
        .from('mistakes')
        .update({
          meaning,
          correct,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .eq('correct', correct)
        .eq('language', language)
        .eq('level', level)
        .select()

      if (updateError) {
        console.error('Error updating mistake:', updateError)
        return { status: 'error', message: updateError.message }
      }

      return { status: 'success', data: updatedMistake, action: 'updated' }
    } else {
      // 新しい間違いとして挿入
      const { data: newMistake, error: insertError } = await supabase
        .from('mistakes')
        .insert([{
          user_id,
          meaning,
          correct,
          language,
          level
        }])
        .select()

      if (insertError) {
        console.error('Error inserting mistake:', insertError)
        return { status: 'error', message: insertError.message }
      }

      return { status: 'success', data: newMistake, action: 'inserted' }
    }
  } catch (error) {
    console.error('Unexpected error in saveMistake:', error)
    return { status: 'error', message: 'Unexpected error occurred' }
  }
}