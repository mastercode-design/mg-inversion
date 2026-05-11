import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request) {
  const { nombre, precio, imagen, stock, categoria } = await request.json();
  const productos = await kv.get('productos') || [];
  
  const nuevoProducto = {
    id: Date.now(),
    nombre,
    precio: parseFloat(precio),
    imagen,
    stock: parseInt(stock) || 0,
    categoria: categoria || 'BOLSOS'
  };
  
  productos.push(nuevoProducto);
  await kv.set('productos', productos);
  
  return NextResponse.json({ success: true, producto: nuevoProducto });
}