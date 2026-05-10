"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const WhatsappIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 0 0012.05 0C5.495 0.16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 0 100 12.324 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 0 100 2.881 1.44 0 000-2.881z"/>
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
  </svg>
)

export default function Home() {
  const [productos, setProductos] = useState([])
  const [imagenZoom, setImagenZoom] = useState(null)
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [fotoActiva, setFotoActiva] = useState(0)

  useEffect(() => {
    const productosGuardados = localStorage.getItem('mg_productos')
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados))
    }
  }, [])

  const cerrarZoom = () => {
    setImagenZoom(null)
    setFotoActiva(0)
  }

  const siguienteFoto = () => {
    if (!imagenZoom) return
    setFotoActiva((prev) => (prev + 1) % imagenZoom.length)
  }

  const anteriorFoto = () => {
    if (!imagenZoom) return
    setFotoActiva((prev) => (prev - 1 + imagenZoom.length) % imagenZoom.length)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imagenZoom) return
      if (e.key === 'Escape') cerrarZoom()
      if (e.key === 'ArrowRight') siguienteFoto()
      if (e.key === 'ArrowLeft') anteriorFoto()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [imagenZoom, fotoActiva])

  const productosFiltrados = categoriaActiva === 'todos'
   ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  const categorias = [
    { id: 'todos', nombre: 'TODO', icon: '✨' },
    { id: 'maletines', nombre: 'MALETINES', icon: '💼' },
    { id: 'bolsos', nombre: 'BOLSOS', icon: '👜' },
    { id: 'ropa', nombre: 'ROPA', icon: '👗' },
    { id: 'accesorios', nombre: 'ACCESORIOS', icon: '💎' },
  ]

  const abrirZoom = (imagenes, index = 0) => {
    setImagenZoom(imagenes)
    setFotoActiva(index)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero CENTRADO */}
      <section className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-6xl text-center space-y-12">
          <div className="space-y-6">
            <h1 className="bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-6xl font-black text-transparent md:text-8xl lg:text-9xl">
              M.G INVERSION
            </h1>
            <p className="text-2xl font-light text-purple-200 md:text-3xl">
              Luxury Jewelry & Fashion
            </p>
          </div>

          <div className="pt-6">
            <button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-14 py-6 text-xl font-bold text-black shadow-2xl transition hover:scale-105">
              EXPLORAR COLECCIÓN ✨
            </button>
          </div>

          <div className="flex justify-center gap-6 pt-8">
            <a href="https://instagram.com" target="_blank"
               className="rounded-2xl border-2 border-purple-500/50 bg-purple-500/10 p-5 backdrop-blur transition hover:scale-110 hover:bg-purple-500/30">
              <InstagramIcon />
            </a>
            <a href="https://wa.me/573151101628" target="_blank"
               className="rounded-2xl border-2 border-green-500/50 bg-green-500/10 p-5 backdrop-blur transition hover:scale-110 hover:bg-green-500/30">
              <WhatsappIcon />
            </a>
            <a href="https://wa.me/573174811805" target="_blank"
               className="rounded-2xl border-2 border-cyan-500/50 bg-cyan-500/10 p-5 backdrop-blur transition hover:scale-110 hover:bg-cyan-500/30">
              <WhatsappIcon />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-5 pt-6">
            <a href="tel:3151101628" className="flex items-center gap-3 rounded-full bg-slate-800/60 px-8 py-4 text-lg backdrop-blur transition hover:bg-slate-700/60">
              <PhoneIcon /> 315 110 1628
            </a>
            <a href="tel:3174811805" className="flex items-center gap-3 rounded-full bg-slate-800/60 px-8 py-4 text-lg backdrop-blur transition hover:bg-slate-700/60">
              <PhoneIcon /> 317 481 1805
            </a>
          </div>
        </div>
      </section>

      {/* Filtros CENTRADOS */}
      <section className="sticky top-0 z-30 border-y-2 border-slate-800 bg-slate-950/98 px-4 py-10 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-5">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`flex items-center gap-3 rounded-full px-10 py-5 text-lg font-bold transition-all hover:scale-105 ${
                categoriaActiva === cat.id
                 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-2xl'
                  : 'border-2 border-slate-700 bg-slate-800/50 text-slate-300 backdrop-blur hover:border-purple-500/50'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span> {cat.nombre}
            </button>
          ))}
        </div>
      </section>

      {/* Productos CENTRADOS */}
      <section className="mx-auto max-w-7xl px-4 py-32">
        <div className="mb-24 text-center space-y-6">
          <h2 className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-6xl font-extrabold text-transparent">
            COLECCIÓN EXCLUSIVA
          </h2>
          <p className="text-2xl text-purple-300">
            {productosFiltrados.length} productos únicos disponibles
          </p>
        </div>

        {productosFiltrados.length === 0? (
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-purple-500/30 bg-slate-900/50 p-24 text-center backdrop-blur">
            <p className="mb-6 text-4xl text-purple-300">No hay productos en esta categoría</p>
            <p className="text-xl text-slate-400">Agrega productos desde el panel de admin</p>
          </div>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="group overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-900/80 backdrop-blur transition hover:border-purple-500/50 hover:shadow-2xl">
                <div
                  className="relative h-96 cursor-zoom-in overflow-hidden bg-slate-800"
                  onClick={() => abrirZoom(producto.imagenes || [producto.imagen])}
                >
                  <Image
                    src={producto.imagenes?.[0] || producto.imagen || '/placeholder.png'}
                    alt={producto.nombre}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  {producto.imagenes?.length > 1 && (
                    <div className="absolute bottom-5 right-5 rounded-full bg-black/80 px-5 py-2 text-base font-bold backdrop-blur">
                      +{producto.imagenes.length} fotos
                    </div>
                  )}
                </div>
                <div className="p-8 space-y-5">
                  <h3 className="text-2xl font-bold text-white">{producto.nombre}</h3>
                  <p className="text-base text-slate-400 line-clamp-2 leading-relaxed">{producto.descripcion}</p>
                  <div className="flex items-center justify-between pt-3">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-4xl font-extrabold text-transparent">
                      ${producto.precio}
                    </span>
                    <span className="rounded-full bg-slate-800 px-6 py-2 text-sm font-semibold uppercase text-slate-300">
                      {producto.categoria}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer CENTRADO */}
      <footer className="mt-40 border-t-2 border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="grid gap-20 text-center md:grid-cols-3 md:text-left">
            <div className="space-y-6">
              <h3 className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent">
                M.G INVERSION
              </h3>
              <p className="text-lg text-slate-400 leading-relaxed">
                Luxury Jewelry & Fashion.<br/>Elegancia y estilo en cada pieza.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-purple-300">Contacto</h4>
              <div className="space-y-5 text-lg text-slate-400">
                <a href="tel:3151101628" className="flex items-center justify-center gap-3 transition hover:text-amber-400 md:justify-start">
                  <PhoneIcon /> 315 110 1628
                </a>
                <a href="tel:3174811805" className="flex items-center justify-center gap-3 transition hover:text-amber-400 md:justify-start">
                  <PhoneIcon /> 317 481 1805
                </a>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-purple-300">Síguenos</h4>
              <div className="flex justify-center gap-6 md:justify-start">
                <a href="https://instagram.com" target="_blank" className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-5 transition hover:scale-110">
                  <InstagramIcon />
                </a>
                <a href="https://wa.me/573151101628" target="_blank" className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 p-5 transition hover:scale-110">
                  <WhatsappIcon />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-20 border-t-2 border-slate-800 pt-12 text-center text-base text-slate-500">
            © 2026 M.G Inversion - Luxury Jewelry. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* MODAL CON X Y FLECHAS */}
      {imagenZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 p-4 backdrop-blur-md"
          onClick={cerrarZoom}
        >
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            
            {/* X PARA CERRAR */}
            <button
              onClick={cerrarZoom}
              className="absolute -top-4 right-0 z-50 rounded-full bg-red-600 p-5 text-white text-3xl font-bold shadow-2xl transition hover:scale-110 hover:bg-red-700 md:-top-6"
            >
              ✕
            </button>

            {/* FLECHA IZQUIERDA */}
            {imagenZoom.length > 1 && (
              <button
                onClick={anteriorFoto}
                className="absolute left-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/20 p-6 text-white text-5xl backdrop-blur-xl transition hover:scale-110 hover:bg-white/30 md:left-4 md:p-8"
              >
                ‹
              </button>
            )}

            {/* IMAGEN */}
            <div className="flex items-center justify-center">
              <img
                src={imagenZoom[fotoActiva]}
                alt="Vista ampliada"
                className="max-h- rounded-3xl object-contain shadow-2xl"
              />
            </div>

            {/* FLECHA DERECHA */}
            {imagenZoom.length > 1 && (
              <button
                onClick={siguienteFoto}
                className="absolute right-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/20 p-6 text-white text-5xl backdrop-blur-xl transition hover:scale-110 hover:bg-white/30 md:right-4 md:p-8"
              >
                ›
              </button>
            )}

            {/* CONTADOR */}
            {imagenZoom.length > 1 && (
              <div className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/90 px-10 py-4 text-2xl font-bold text-white backdrop-blur-xl">
                {fotoActiva + 1} / {imagenZoom.length}
              </div>
            )}

            {/* MINIATURAS */}
            {imagenZoom.length > 1 && (
              <div className="mt-8 flex justify-center gap-4 overflow-x-auto px-4">
                {imagenZoom.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFotoActiva(idx)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-4 transition hover:scale-110 md:h-24 md:w-24 ${
                      fotoActiva === idx
                       ? 'border-amber-400 shadow-xl shadow-amber-400/50'
                        : 'border-slate-600 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="h-full w-full object-cover" alt={`Miniatura ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}