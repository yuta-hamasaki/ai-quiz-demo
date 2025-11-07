import { NextResponse } from 'next/server';

const systemInstruction = `
You are a highly specialized content generator creating translation practice materials. Your task is to generate 10 pairs of Japanese sentences and their correct translations based ONLY on the provided Field/Topic, Level, and Language parameters. 
The output MUST be a single, valid JSON array and strictly follow the defined structure and mandatory guidelines. 
DO NOT include any explanatory text, markdown outside of the JSON block, or numbering in your response.
`;

export async function POST(request: Request){
  const { searchParams } = new URL(request.url)

  const language = searchParams.get('language')
  const level = searchParams.get('level')
  const userBackground = searchParams.get('background')
    
  if(!language || !level || !userBackground){
    return NextResponse.json(
      { error: 'Language and level are required' },
      { status: 400 }
    )
  }

  const userPrompt = `
Generate a set of 10 random Japanese sentences and their corresponding correct translations, designed for a user with a specific background, for the purpose of translation practice into the target language. The content must be **STRICTLY relevant to the FIELD OF: ${userBackground}**.

**Conditions:**
- Language: ${language}
- Level: ${level}
- Field/Topic: ${userBackground}

**Output Format:**
The output must be a single JSON array structured exactly as follows:
[
  { "jpText": "string", "correctText": "string" },
  ...
]

**Mandatory Guidelines:**
1. Relevance: Content must be **STRICTLY** appropriate for the specified Level and Field/Topic.
2. Difficulty: Avoid overly simple words (e.g., Apple, Dog).
3. Language: jpText in Japanese; correctText in the specified target Language (${language}).
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
        messages: [
            { role: 'system', content: systemInstruction }, 
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('Failed getting content', data)
      return NextResponse.json(
        { error: 'Could not get content from AI model', raw: data },
        { status: 500 }
      )
    }

    const quiz = JSON.parse(content) 
    return NextResponse.json(quiz)
    
  } catch (err){
    console.error('Catch block error:', err)
    return NextResponse.json({
      error: 'Failed to communicate with OpenAI API or parse response'
    }, {status: 500})
  }
}