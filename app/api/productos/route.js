import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  const productos = await kv.get('productos') || [];
  return NextResponse.json(productos);
}