'use client'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ nombre: '', precio: '', stock: '', categoria: 'BOLSOS' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const cargarProductos = async () => {
    const res = await fetch('/api/productos')
    const data = await res.json()
    setProductos(data)
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imagenUrl = ''
      
      // 1. Subir imagen a Vercel Blob
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        
        const resUpload = await fetch('/api/productos/upload', {
          method: 'POST',
          body: formData
        })
        
        const dataUpload = await resUpload.json()
        if (!dataUpload.success) throw new Error('Error subiendo imagen')
        imagenUrl = dataUpload.url
      }

      // 2. Crear producto en Vercel KV
      const resCreate = await fetch('/api/productos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          precio: form.precio,
          stock: form.stock,
          categoria: form.categoria,
          imagen: imagenUrl
        })
      })

      const dataCreate = await resCreate.json()
      if (!dataCreate.success) throw new Error('Error creando producto')

      // 3. Limpiar y recargar
      setForm({ nombre: '', precio: '', stock: '', categoria: 'BOLSOS' })
      setFile(null)
      setPreview('')
      await cargarProductos()
      alert('Producto guardado!')

    } catch (error) {
      console.error(error)
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const eliminarProducto = async (id) => {
    if (!confirm('¿Eliminar producto?')) return
    
    await fetch(`/api/productos/delete/${id}`, { method: 'DELETE' })
    await cargarProductos()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin - Crear Producto</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input 
          type="text" 
          placeholder="Nombre del producto"
          value={form.nombre}
          onChange={e => setForm({...form, nombre: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        
        <input 
          type="number" 
          placeholder="Precio"
          value={form.precio}
          onChange={e => setForm({...form, precio: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        
        <input 
          type="number" 
          placeholder="Stock disponible"
          value={form.stock}
          onChange={e => setForm({...form, stock: e.target.value})}
          className="w-full border p-2 rounded"
        />
        
        <select 
          value={form.categoria}
          onChange={e => setForm({...form, categoria: e.target.value})}
          className="w-full border p-2 rounded"
        >
          <option>BOLSOS</option>
          <option>CADENAS</option>
          <option>GORRAS</option>
        </select>

        <div>
          <label className="block mb-2">Imagen del producto *</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
            required
          />
          {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
        >
          {loading? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
      {productos.length === 0? (
        <p>No hay productos aún. Crea el primero arriba</p>
      ) : (
        <div className="space-y-2">
          {productos.map(p => (
            <div key={p.id} className="border p-4 rounded flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover" />
                <div>
                  <p className="font-bold">{p.nombre}</p>
                  <p>${p.precio} - Stock: {p.stock} - {p.categoria}</p>
                </div>
              </div>
              <button 
                onClick={() => eliminarProducto(p.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}