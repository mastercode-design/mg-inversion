import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
const kv = Redis.fromEnv();

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const productos = await kv.get('productos') || [];
    const producto = productos.find(p => p.id.toString() === id.toString());
    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const productos = await kv.get('productos') || [];
    const index = productos.findIndex(p => p.id.toString() === id.toString());
    if (index === -1) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    productos[index] = {...productos[index],...body, id: id.toString() };
    await kv.set('productos', productos);
    return NextResponse.json(productos[index]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const productos = await kv.get('productos') || [];
    const index = productos.findIndex(p => p.id.toString() === id.toString());
    if (index === -1) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    productos[index].publicado = body.publicado;
    await kv.set('productos', productos);
    return NextResponse.json(productos[index]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    console.log('Eliminando ID:', id);

    const productos = await kv.get('productos') || [];
    console.log('Antes:', productos.length);

    // Comparar como string SIEMPRE
    const productosFiltrados = productos.filter(p => p.id.toString()!== id.toString());

    console.log('Después:', productosFiltrados.length);
    await kv.set('productos', productosFiltrados);

    return NextResponse.json({ message: 'Producto eliminado', eliminados: productos.length - productosFiltrados.length });
  } catch (error) {
    console.error('Error DELETE:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}