import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getProducts } from '@/lib/kv';

export async function POST(request) {
  const updatedProduct = await request.json();
  let products = await getProducts();
  
  products = products.map(p => 
    p.id === updatedProduct.id ? { ...updatedProduct, price: Number(updatedProduct.price) } : p
  );
  
  await kv.set('products', products);
  return NextResponse.json({ success: true });
}