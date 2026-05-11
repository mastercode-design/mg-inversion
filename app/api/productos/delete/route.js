import { NextResponse } from 'next/server';
import { deleteProduct } from '@/lib/kv';

export async function POST(request) {
  const { id } = await request.json();
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}