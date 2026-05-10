"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // CAMBIA ESTA CONTRASEÑA
  const ADMIN_PASSWORD = 'mg2026'

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('mg_admin_auth', 'true')
      router.push('/admin')
    } else {
      setError('Contraseña incorrecta')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-amber-400">
          M.G Inversion
        </h1>
        <p className="mb-8 text-center text-sm text-slate-400">
          Panel de Administración
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ingresa la contraseña"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-2 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-bold text-black transition hover:opacity-90"
          >
            Entrar
          </button>
        </form>

        <button
          onClick={() => router.push('/')}
          className="mt-4 w-full text-sm text-slate-400 hover:text-white"
        >
          ← Volver a la tienda
        </button>
      </div>
    </div>
  )
}