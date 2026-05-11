import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, precio, imagen, stock, categoria } = body;
    
    if (!nombre || !precio) {
      return NextResponse.json({ success: false, error: 'Faltan datos' }, { status: 400 });
    }
    
    const productos = await kv.get('productos') || [];
    
    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio: parseFloat(precio),
      imagen: imagen || '',
      stock: parseInt(stock) || 0,
      categoria: categoria || 'BOLSOS'
    };
    
    productos.push(nuevoProducto);
    await kv.set('productos', productos);
    
    return NextResponse.json({ success: true, producto: nuevoProducto });
    
  } catch (error) {
    console.error('Error create:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}