
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
Generate a set of 10 random Japanese sentences and their corresponding correct translations, designed for a user with a specific background, for the purpose of translation practice into the target language.

The sentences must adhere to the following conditions:

Language: ${language}

Level: ${level}

Field/Topic: ${userBackground}

Output Format: JSON. The structure must be exactly as follows:

[
  {
    "jpText": "string",
    "correctText": "string"
  },
  ...
]


Mandatory Guidelines:

The content must be appropriate for the specified Level and Field/Topic.

Avoid overly simple words (e.g., Apple, Dog).

The correct translation must be placed in the correctText field.

jpText must be written in Japanese.

correctText must be written in the specified target Language.


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

