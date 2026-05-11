import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { del } from '@vercel/blob';

export async function DELETE(request, { params }) {
  const { id } = await params;
  const idNum = Number(id);
  
  let productos = await kv.get('productos') || [];
  const prod = productos.find(p => p.id === idNum);
  
  // Borra imagen de Blob si existe
  if (prod?.imagen?.includes('vercel-storage.com')) {
    try {
      await del(prod.imagen);
    } catch (e) { console.log('No se pudo borrar imagen:', e) }
  }
  
  productos = productos.filter(p => p.id!== idNum);
  await kv.set('productos', productos);
  
  return NextResponse.json({ success: true });
}