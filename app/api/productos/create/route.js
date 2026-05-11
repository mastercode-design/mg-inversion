import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data/productos.json');

async function getProductos() {
  try {
    await mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    const data = await readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request) {
  try {
    const { nombre, precio, imagen, stock } = await request.json();
    
    if (!nombre ||!precio ||!imagen) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const productos = await getProductos();
    
    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio: parseFloat(precio),
      imagen,
      stock: parseInt(stock) || 0,
      createdAt: new Date().toISOString()
    };

    productos.push(nuevoProducto);
    await writeFile(dbPath, JSON.stringify(productos, null, 2));

    return NextResponse.json({ success: true, producto: nuevoProducto });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}

export async function GET() {
  const productos = await getProductos();
  return NextResponse.json(productos);
}