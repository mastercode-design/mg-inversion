import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  
  const blob = await put(`${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  return NextResponse.json({ success: true, url: blob.url });
}