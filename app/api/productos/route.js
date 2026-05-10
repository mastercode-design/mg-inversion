import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  try {
    const productos = await kv.get('productos') || []
    return NextResponse.json(productos)
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const nombre = formData.get('nombre')
    const descripcion = formData.get('descripcion')
    const precio = formData.get('precio')
    const imagen = formData.get('imagen')

    if (!nombre || !precio || !imagen) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const bytes = await imagen.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${imagen.type};base64,${buffer.toString('base64')}`

    const productos = await kv.get('productos') || []
    const nuevoProducto = {
      id: Date.now(),
      nombre,
      descripcion,
      precio: Number(precio),
      imagen: base64,
      created_at: new Date().toISOString()
    }

    productos.unshift(nuevoProducto)
    await kv.set('productos', nuevosProducto)

    return NextResponse.json(nuevoProducto, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}