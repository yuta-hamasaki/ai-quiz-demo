import { NextResponse } from 'next/server';

const systemInstruction = `
You are a highly specialized educational content generator. Your task is to generate vocabulary quiz questions based ONLY on the provided Field/Topic, Level, and Language parameters. 
The output MUST be a single, valid JSON array and strictly follow the defined structure and mandatory guidelines. 
DO NOT include any explanatory text, markdown outside of the JSON block (e.g., json), or numbering in your response.
`;

export async function POST(request: Request){
  const {searchParams} = new URL(request.url)

  const language = searchParams.get('language')
  const level = searchParams.get('level')
  const userBackground = searchParams.get('background')
  
    if(!language || !level || !userBackground){
    return NextResponse.json(
      { error: 'Language and level are required' },
      { status: 400 }
    )
  }




const prompt = `
Generate 10 multiple-choice vocabulary questions (4 options per question) in the ${language} related to the **STRICT FIELD OF: ${userBackground}**, adhering to all conditions.

**Conditions:**
- Language: ${language}
- Level: ${level}
- Field/Topic: ${userBackground}
- Quiz Format: Select the correct target word based on the provided Japanese meaning.

**Output Format:**
The output must be a single JSON array structured exactly as follows:
[
  { "meaning": "string (Japanese meaning)", "options": ["string", "string", "string", "string"], "correct": "string (The correct target word)" },
  ...
]

**Mandatory Guidelines:**
1. Relevance: Vocabulary must be **STRICTLY** appropriate for the specified Level and Field/Topic.
2. Difficulty: Avoid overly simple words (e.g., Apple, Dog).
3. Options Array: Must contain exactly 4 words, including the correct answer, in a strictly random order.
4. Correct Answer: Must be present in the options array.
5. Language: Meaning in Japanese; Options/Correct in ${language}.
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
          { role: 'user', content: prompt }
        ],
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


