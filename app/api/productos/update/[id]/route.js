import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function PUT(request, { params }) {
  const { id } = await params;
  const idNum = Number(id);
  const nuevosDatos = await request.json();
  
  let productos = await kv.get('productos') || [];
  const index = productos.findIndex(p => p.id === idNum);
  
  if (index === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  
  productos[index] = {
 ...productos[index],
    nombre: nuevosDatos.nombre || productos[index].nombre,
    precio: nuevosDatos.precio? parseFloat(nuevosDatos.precio) : productos[index].precio,
    imagen: nuevosDatos.imagen || productos[index].imagen,
    stock: nuevosDatos.stock!== undefined? parseInt(nuevosDatos.stock) : productos[index].stock,
    categoria: nuevosDatos.categoria || productos[index].categoria
  };
  
  await kv.set('productos', productos);
  return NextResponse.json({ success: true, producto: productos[index] });
}