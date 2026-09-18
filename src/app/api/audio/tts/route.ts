import OpenAI from 'openai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();
    
    // Map voice IDs to OpenAI TTS voices
    // alloy, echo, fable, onyx, nova, shimmer
    let openaiVoice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'onyx'; // Default to deep male
    if (voiceId === 'Hypatia') openaiVoice = 'nova';
    if (voiceId === 'Dostoevsky') openaiVoice = 'echo';

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: openaiVoice,
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error: any) {
    console.error('TTS Error:', error);
    return new Response(JSON.stringify({ error: 'TTS Generation Failed' }), { status: 500 });
  }
}

