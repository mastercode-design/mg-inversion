import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const productos = await kv.get('productos') || [];
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error KV GET:', error);
    return NextResponse.json([], { status: 200 }); // Devuelve array vacío si falla
  }
}