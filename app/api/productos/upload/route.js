import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file' }, { status: 400 });
    }
    
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ success: true, url: blob.url });
    
  } catch (error) {
    console.error('Error upload:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}