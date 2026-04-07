import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../lib/supabaseServer';

const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const message = body?.message;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is empty' },
        { status: 400 }
      );
    }

    if (!process.env.HF_TOKEN) {
      return NextResponse.json(
        { error: 'HF_TOKEN is missing in .env.local' },
        { status: 500 }
      );
    }

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-1B-Instruct',
        messages: [
          {
            role: 'system',
            content: `You are Morpheus Sleep Coach, a calm and supportive AI assistant for better sleep habits.

The user is asking for sleep help, not dream interpretation.

Your response must include:
1. A short explanation of what may be affecting their sleep
2. Practical advice for tonight
3. A simple sleep routine
4. 3 to 5 habits for better sleep quality
5. A gentle note that professional help may be useful if symptoms continue or feel severe

Rules:
- Be calm, supportive, and clear
- Do not diagnose medical conditions
- Do not replace a doctor
- Use short sections
- Keep the advice practical and realistic`
          },
          {
            role: 'user',
            content: `The user is having this sleep issue: ${message}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: `Hugging Face error ${response.status}: ${rawText}` },
        { status: 500 }
      );
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: `Invalid JSON from Hugging Face: ${rawText}` },
        { status: 500 }
      );
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      'Could not generate sleep advice. Please try again.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Sleep API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate sleep advice' },
      { status: 500 }
    );
  }
}