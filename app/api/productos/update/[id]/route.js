import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data/productos.json');

export async function PUT(request, { params }) {
  try {
    // EN NEXT 15+ HAY QUE HACER AWAIT A PARAMS
    const { id } = await params;
    const idNum = Number(id);
    const nuevosDatos = await request.json();
    
    console.log('Actualizando ID:', idNum, 'Datos:', nuevosDatos);

    if (!idNum || isNaN(idNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const data = await readFile(dbPath, 'utf8');
    const productos = JSON.parse(data);
    
    const index = productos.findIndex(p => p.id === idNum);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    // Actualizar solo los campos que llegan
    productos[index] = {
    ...productos[index],
      nombre: nuevosDatos.nombre || productos[index].nombre,
      precio: nuevosDatos.precio? parseFloat(nuevosDatos.precio) : productos[index].precio,
      imagen: nuevosDatos.imagen || productos[index].imagen,
      stock: nuevosDatos.stock!== undefined? parseInt(nuevosDatos.stock) : productos[index].stock,
      categoria: nuevosDatos.categoria || productos[index].categoria || 'BOLSOS'
    };
    
    await writeFile(dbPath, JSON.stringify(productos, null, 2));
    
    console.log('Producto actualizado:', productos[index]);
    return NextResponse.json({ success: true, producto: productos[index] });
    
  } catch (error) {
    console.error('ERROR UPDATE:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}