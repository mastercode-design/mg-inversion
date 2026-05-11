import { NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data/productos.json');

export async function DELETE(request, { params }) {
  try {
    // EN NEXT 15+ HAY QUE HACER AWAIT A PARAMS
    const { id } = await params;
    const idNum = Number(id);
    
    console.log('ID recibido:', id, 'Convertido:', idNum);

    if (!idNum || isNaN(idNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const data = await readFile(dbPath, 'utf8');
    let productos = JSON.parse(data);
    
    const producto = productos.find(p => p.id === idNum);
    
    if (!producto) {
      console.log('Producto no encontrado con ID:', idNum);
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (producto.imagen) {
      const imagePath = path.join(process.cwd(), 'public', producto.imagen);
      try {
        await unlink(imagePath);
      } catch (err) {
        console.log('No se pudo borrar imagen:', err.message);
      }
    }
    
    productos = productos.filter(p => p.id!== idNum);
    await writeFile(dbPath, JSON.stringify(productos, null, 2));
    
    console.log('Producto eliminado exitosamente:', idNum);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('ERROR DELETE:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}