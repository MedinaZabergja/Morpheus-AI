import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mesazhi është i zbrazët' },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: google('gemini-2.5-flash-lite'), 
      system: 'You are a helpful assistant. Reply concisely and clearly in English.',
      prompt: message,
    });

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error('API Error Full Details:', error);
    
    let errorMessage = 'Gabim gjatë komunikimit me AI';
    if (error.message?.includes('404')) {
        errorMessage = 'Modeli AI nuk u gjend ose çelësi API është i kufizuar.';
    } else if (error.message?.includes('401') || error.message?.includes('403')) {
        errorMessage = 'Gabim autentikimi. Kontrolloni API Key.';
    }

    return NextResponse.json(
      { error: `${errorMessage} (${error.message || 'Unknown'})` },
      { status: 500 }
    );
  }
}
