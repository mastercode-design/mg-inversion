import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function DELETE(request, { params }) {
  try {
    const productos = await kv.get('productos') || []
    const nuevosProductos = productos.filter(p => p.id!= params.id)

    await kv.set('productos', nuevosProductos)
    return NextResponse.json({ message: 'Producto eliminado' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}