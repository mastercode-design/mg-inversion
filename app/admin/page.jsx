"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'bolsos',
    imagenes: []
  })
  const [previewUrls, setPreviewUrls] = useState([])
  const [editando, setEditando] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('mg_admin_auth')
    if (auth === 'true') {
      setIsAuth(true)
    } else {
      router.push('/login')
    }
    setLoading(false)
  }, [router])

  useEffect(() => {
    if (!isAuth) return
    const productosGuardados = localStorage.getItem('mg_productos')
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados))
    }
  }, [isAuth])

  const handleLogout = () => {
    localStorage.removeItem('mg_admin_auth')
    router.push('/login')
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result])
        setForm(prev => ({
         ...prev,
          imagenes: [...prev.imagenes, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const eliminarImagen = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i!== index))
    setForm(prev => ({
     ...prev,
      imagenes: prev.imagenes.filter((_, i) => i!== index)
    }))
  }

  const guardarProducto = (e) => {
    e.preventDefault()
    if (!form.nombre ||!form.precio || form.imagenes.length === 0) {
      alert('Completa nombre, precio y sube al menos 1 foto')
      return
    }

    if (editando) {
      const nuevosProductos = productos.map(p =>
        p.id === editando? {...form, id: editando, precio: parseFloat(form.precio).toLocaleString('es-CO')} : p
      )
      setProductos(nuevosProductos)
      localStorage.setItem('mg_productos', JSON.stringify(nuevosProductos))
      setEditando(null)
      alert('Producto actualizado ✅')
    } else {
      const nuevoProducto = {
        id: Date.now().toString(),
       ...form,
        precio: parseFloat(form.precio).toLocaleString('es-CO')
      }
      const nuevosProductos = [...productos, nuevoProducto]
      setProductos(nuevosProductos)
      localStorage.setItem('mg_productos', JSON.stringify(nuevosProductos))
      alert('Producto guardado ✅')
    }

    setForm({ nombre: '', descripcion: '', precio: '', categoria: 'bolsos', imagenes: [] })
    setPreviewUrls([])
  }

  const editarProducto = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.replace(/,/g, ''),
      categoria: producto.categoria,
      imagenes: producto.imagenes || [producto.imagen]
    })
    setPreviewUrls(producto.imagenes || [producto.imagen])
    setEditando(producto.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminarProducto = (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    const nuevosProductos = productos.filter(p => p.id!== id)
    setProductos(nuevosProductos)
    localStorage.setItem('mg_productos', JSON.stringify(nuevosProductos))
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setForm({ nombre: '', descripcion: '', precio: '', categoria: 'bolsos', imagenes: [] })
    setPreviewUrls([])
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-2xl">Cargando...</p>
      </div>
    )
  }

  if (!isAuth) return null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Container principal CENTRADO */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <div className="space-y-16">

          {/* Header CENTRADO */}
          <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div className="space-y-3">
              <h1 className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-6xl font-black text-transparent">
                Panel Admin
              </h1>
              <p className="text-2xl text-slate-400">Gestiona tu catálogo de productos</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="rounded-xl border-2 border-slate-700 bg-slate-800 px-10 py-4 text-lg font-semibold transition hover:border-slate-600 hover:bg-slate-700"
              >
                Ver Tienda
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-10 py-4 text-lg font-semibold transition hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Formulario CENTRADO */}
          <div className="mx-auto max-w-5xl rounded-3xl border-2 border-slate-800 bg-slate-900/80 p-12 backdrop-blur">
            <h2 className="mb-12 text-center text-4xl font-bold text-purple-300">
              {editando? 'Editar Producto' : 'Agregar Producto'}
            </h2>

            <form onSubmit={guardarProducto} className="space-y-10">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-slate-300">Nombre del producto *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({...form, nombre: e.target.value})}
                    className="w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-6 py-5 text-xl outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/30"
                    placeholder="Ej: Bolso de cuero artesanal"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-slate-300">Precio *</label>
                  <input
                    type="number"
                    value={form.precio}
                    onChange={(e) => setForm({...form, precio: e.target.value})}
                    className="w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-6 py-5 text-xl outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/30"
                    placeholder="120000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-semibold text-slate-300">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({...form, descripcion: e.target.value})}
                  className="w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-6 py-5 text-xl outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/30"
                  rows={6}
                  placeholder="Describe el producto..."
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-semibold text-slate-300">Categoría *</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({...form, categoria: e.target.value})}
                  className="w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-6 py-5 text-xl outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/30"
                >
                  <option value="maletines">MALETINES</option>
                  <option value="bolsos">BOLSOS</option>
                  <option value="ropa">ROPA</option>
                  <option value="accesorios">ACCESORIOS</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-semibold text-slate-300">Fotos del producto - puedes subir varias *</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-6 py-5 text-lg file:mr-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-amber-500 file:to-orange-500 file:px-10 file:py-4 file:text-xl file:font-bold file:text-black file:transition hover:file:opacity-90"
                />
              </div>

              {previewUrls.length > 0 && (
                <div className="flex flex-wrap justify-center gap-6">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img src={url} className="h-36 w-36 rounded-2xl object-cover border-2 border-slate-700" />
                      <button
                        type="button"
                        onClick={() => eliminarImagen(idx)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-600 p-2.5 text-base transition hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-5 pt-6">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-2xl font-bold text-black shadow-2xl transition hover:scale-105 hover:shadow-orange-500/50"
                >
                  {editando? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
                {editando && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="rounded-xl border-2 border-slate-700 bg-slate-800 px-10 py-6 text-xl font-semibold transition hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* TABLA PROFESIONAL CENTRADA */}
          <div className="rounded-3xl border-2 border-slate-800 bg-slate-900/80 p-12 backdrop-blur">
            <h2 className="mb-12 text-center text-4xl font-bold text-purple-300">
              Productos Registrados: {productos.length}
            </h2>

            {productos.length === 0? (
              <div className="rounded-2xl border-2 border-dashed border-slate-700 p-24 text-center">
                <p className="text-3xl text-slate-500">No hay productos aún</p>
                <p className="mt-4 text-xl text-slate-600">Agrega tu primer producto arriba</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-700">
                      <th className="px-8 py-6 text-left text-base font-bold uppercase tracking-wider text-slate-400">Imagen</th>
                      <th className="px-8 py-6 text-left text-base font-bold uppercase tracking-wider text-slate-400">Nombre</th>
                      <th className="px-8 py-6 text-left text-base font-bold uppercase tracking-wider text-slate-400">Categoría</th>
                      <th className="px-8 py-6 text-left text-base font-bold uppercase tracking-wider text-slate-400">Precio</th>
                      <th className="px-8 py-6 text-center text-base font-bold uppercase tracking-wider text-slate-400">Fotos</th>
                      <th className="px-8 py-6 text-center text-base font-bold uppercase tracking-wider text-slate-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-800">
                    {productos.map((p) => (
                      <tr key={p.id} className="transition hover:bg-slate-800/50">
                        <td className="px-8 py-6">
                          <img
                            src={p.imagenes?.[0] || p.imagen}
                            className="h-24 w-24 rounded-xl object-cover"
                            alt={p.nombre}
                          />
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xl font-bold">{p.nombre}</p>
                          <p className="text-base text-slate-500 line-clamp-1 mt-2">{p.descripcion}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-block rounded-full bg-slate-800 px-6 py-3 text-base font-semibold uppercase">
                            {p.categoria}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-2xl font-bold text-amber-400">${p.precio}</span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-2xl font-semibold text-purple-400">{p.imagenes?.length || 1}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => editarProducto(p)}
                              className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold transition hover:bg-blue-700"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarProducto(p.id)}
                              className="rounded-xl bg-red-600 px-6 py-3 text-base font-semibold transition hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}