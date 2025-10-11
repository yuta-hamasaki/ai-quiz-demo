
import { NextResponse } from 'next/server';

export async function POST(request: Request){
  const {searchParams} = new URL(request.url)

  const language = searchParams.get('language')
  const level = searchParams.get('level')
  const userBackground = `${searchParams.get('background')}`
  
    if(!language || !level){
    return NextResponse.json(
      { error: 'Language and level are required' },
      { status: 400 }
    )
  }

  const prompt = `
  ${language}に翻訳する練習をするための日本語のランダムな文章とその正解の文章を10個作成してください。
  文章は以下の条件に合ったものにしてください。

  - 言語: ${language},
  - レベル: ${level} 
  - 分野: ${userBackground}
  - 出力形式: JSON。構造は以下の通りです:

  [
  {
  jpText: string
  correctText: string
  },
  .....
]


  - 必ず守る注意点: 
    - レベル、分野に応じたものを選ぶこと
    -簡単すぎる単語(Apple, Dogなど)は避けること
    - 正解の文章は必ずcorrectTextに入れること
    - jpTextは日本語で書くこと
    - correctTextは指定された言語で書くこと
  `
    
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
  console.error('faild getiing content', data)
  return NextResponse.json(
    { error: 'could not get conntent', raw: data },
    { status: 500 }
  )
}

  
    const cleanContent = content.replace(/```json|```/g, '').trim()

    const quiz = JSON.parse(cleanContent)
    return NextResponse.json(quiz)
  } catch (err){
    console.log(err)
    return NextResponse.json({
      error: 'Failed to generate quiz'
    }, {status: 500})
  }
}

