import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No se recibió archivo' }, { status: 400 });
    }
    
    // Si Blob no está conectado, esta línea falla
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ success: true, url: blob.url });
    
  } catch (error) {
    console.error('ERROR BLOB:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: `Blob falló: ${error.message}` 
    }, { status: 500 });
  }
}