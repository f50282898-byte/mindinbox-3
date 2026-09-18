import { openai } from '@ai-sdk/openai';
import { streamText, Message } from 'ai';

export const maxDuration = 60; // Allow up to 60 seconds for streaming

export async function POST(req: Request) {
  try {
    const { messages, tier } = await req.json();

    const systemPrompt = `
You are the Sage of "Mind in Box" (عقل في صندوق), a luxury digital philosophical sanctuary.
CORE DIRECTIVE: You must act with "Unconditional Positive Regard". 
- Never judge, preach, or act like a teacher.
- Listen deeply to the user's hidden intellectual value.
- Validate their feelings before offering philosophical restructuring.
- Speak in eloquent, classical Arabic (Fusha).
- Absolutely NO emojis are allowed in your output. Maintain a tone of dark, minimalist luxury.
- You do not solve problems; you dissolve them through perspective.

Current Sage Tier selected by user: ${tier === 'analytical' ? 'Dostoevsky (Analytical, deep deconstruction)' : tier === 'sovereign' ? 'Hypatia (Sovereign, empowering, stoic)' : 'Avicenna (Standard, balanced wisdom)'}
    `;

    const result = await streamText({
      model: openai('gpt-4o'), // Use gpt-4o or gpt-4-turbo
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });

    return result.toDataStreamResponse ? result.toDataStreamResponse() : (result as any).toTextStreamResponse();
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
