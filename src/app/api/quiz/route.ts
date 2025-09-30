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
  以下の条件に合った英単語または外国語単語の4択クイズを20問作成してください。

  - 言語: ${language},
  - レベル: ${level} 
  - 分野: ${userBackground}
  - 出力形式: JSON。構造は以下の通りです:

  [
  {
    "meaning": "意味",
    "options": ["選択肢１", "選択肢2", "選択肢3", "選択肢4"],
    "correct": "正解"
  },
  .....
]


  - 必ず守る注意点: 
    - 単語はレベルに応じたものを選ぶこと
    -簡単すぎる単語(Apple, Dogなど)は避けること
    - 選択肢（options）は正解を含めた4つの単語で、順序は必ずランダムにしてください。
    - 正解の単語は options の中のどの位置でも良いですが、必ず含めてください。
    - 正解の単語と意味は必ず含めること
    - meaningは日本語で書くこと
    - meaningを見て選択肢を選ぶ形式にすること
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

