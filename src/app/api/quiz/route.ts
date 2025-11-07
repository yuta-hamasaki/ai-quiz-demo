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
Generate 10 multiple-choice vocabulary questions (4 options per question) in the ${language} related to the ${userBackground}, adhering strictly to the following conditions and output format.

Conditions

Language: ${language}

Level: ${level}

Field/Topic: ${userBackground}

Quiz Format: Select the correct target word based on the provided Japanese meaning.

📦 Output Format

The output must be a single JSON array structured exactly as follows:

[
  {
    "meaning": "string (Japanese meaning)",
    "options": ["string", "string", "string", "string"],
    "correct": "string (The correct target word)"
  },
  ...
]


⚠️ Mandatory Guidelines

Relevance: Select vocabulary appropriate for the specified Level and Field/Topic.

Difficulty: Avoid overly simple words (e.g., Apple, Dog).

Options Array:

The options array must contain exactly 4 vocabulary words, including the correct answer.

The order of the options must be strictly random.

Correct Answer:

The word specified in the correct field must be present in the options array.

Language Specification:

The meaning field must be written in Japanese.

The words in options and correct must be written in the specified target Language (${language}).
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


