import { NextResponse } from 'next/server';

export async function POST(request: Request){

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  

  const { originalText, userTranslation, language, level } = body; 
  
  if(!originalText || !userTranslation || !language || !level){
    return NextResponse.json(
      { error: 'originalText, userTranslation, language, and level are required' },
      { status: 400 }
    )
  }

  const prompt = `
  あなたは${language}の作文添削に特化したプロの語学教師です。${level}レベルの学習者に対して、明確で建設的なフィードバックを、以下のJSONスキーマに厳密に従って提供してください。JSON以外の余計なテキストは一切出力しないでください。

  【元の日本語の文章】: "${originalText}"
  【${language}での翻訳】: "${userTranslation}"
  
  フィードバックを以下のJSON形式で提供してください:
  {
    "grammarCorrections": [
      {
        "original": "The exact incorrect or unnatural phrase from the user's translation.",
        "corrected": "The suggested correction for the phrase.",
        "reason": "A brief explanation (in Japanese) of why the correction was made (e.g., '過去形の間違い', '不自然なイディオム')."
      }
    ],
    "styleSuggestions": "A single paragraph (in Japanese) providing high-level feedback on the user's style, flow, tone, and suggestions for improvement to sound more natural and fluent."
  }
  `;
    
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
        response_format: { type: "json_object" } 
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('Failed getting content from OpenAI:', data)
      return NextResponse.json(
        { error: 'Could not get content from AI model', raw: data },
        { status: 500 }
      )
    }

    const feedback = JSON.parse(content.trim()) 
    return NextResponse.json(feedback) 
    
  } catch (err){
    console.error(err)
    return NextResponse.json({
      error: 'Failed to generate writing feedback'
    }, {status: 500})
  }
}
