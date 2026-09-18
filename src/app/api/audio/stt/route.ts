import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'ar', // Force Arabic detection since the platform is Arabic
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('STT Error:', error);
    return NextResponse.json({ error: 'STT Transcription Failed' }, { status: 500 });
  }
}

