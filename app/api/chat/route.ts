import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../lib/supabaseServer';

// Hugging Face Inference API (new router endpoint)
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is empty' },
        { status: 400 }
      );
    }

    // Call Hugging Face with FREE TIER model (Llama 3.2 1B)
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-1B-Instruct',  // FREE TIER - Under 10GB
        messages: [
          {
            role: 'system',
            content: 'You are Morpheus, a mystical AI dream interpreter. Analyze dreams and provide: 1) A creative title, 2) Dominant mood/emotion, 3) Key symbols/themes, 4) Brief interpretation. Use emojis and be insightful.'
          },
          {
            role: 'user',
            content: `Analyze this dream: ${message}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API Error:', response.status, errorText);
      
      // If model not supported, try alternative
      if (errorText.includes('not supported') || errorText.includes('not available')) {
        throw new Error('Model not available. Try again or contact support.');
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Could not analyze dream. Please try again.';

    return NextResponse.json({ reply });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: `Error: ${error.message || 'Failed to analyze dream'}` },
      { status: 500 }
    );
  }
}