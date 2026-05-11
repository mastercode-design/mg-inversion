'use client'
import { useState, useEffect } from 'react';

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch('/api/productos/create');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const productosFiltrados = filtro === 'TODOS' 
    ? productos 
    : productos.filter(p => p.categoria === filtro);

  const formatoMoneda = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const categorias = ['TODOS', 'BOLSOS', 'JOYAS', 'CADENA', 'ROPA DAMA', 'ROPA HOMBRE', 'MALETINES', 'OTROS'];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#1a1a2e', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', color: 'white', margin: '0 0 10px 0', fontWeight: 'bold' }}>M.G INVERSION</h1>
        <p style={{ color: 'white', fontSize: '18px', margin: '0 0 20px 0' }}>
          Joyas, bolsos y moda exclusiva que define tu estilo único ✨
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://instagram.com/MGINVERSION" target="_blank" style={{ backgroundColor: '#E1306C', color: 'white', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
            @MGINVERSION
          </a>
          <a href="https://wa.me/573151101428" target="_blank" style={{ backgroundColor: '#25D366', color: 'white', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
            Chatea Ahora
          </a>
        </div>
      </div>

      {/* FILTROS */}
      <div style={{ padding: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', backgroundColor: '#0f0f23' }}>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: filtro === cat? '#667eea' : '#16213e',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTOS */}
      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        {productosFiltrados.length === 0 && (
          <p style={{ color: 'white', textAlign: 'center', fontSize: '18px' }}>
            No hay productos aún. Ve a /admin para crear uno.
          </p>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {productosFiltrados.map(prod => (
            <div key={prod.id} style={{ backgroundColor: '#16213e', borderRadius: '12px', overflow: 'hidden', border: '2px solid #667eea' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#667eea', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                  {prod.categoria || 'BOLSOS'}
                </div>
                {prod.precio < 100000 && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                    BARATO
                  </div>
                )}
              </div>
              
              <div style={{ padding: '16px' }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {prod.nombre}
                </h3>
                <p style={{ color: '#667eea', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
                  {formatoMoneda(prod.precio)}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>
                  Stock: {prod.stock} unidades
                </p>
                <a 
                  href={`https://wa.me/573151101428?text=Hola, me interesa ${prod.nombre}`} 
                  target="_blank"
                  style={{ 
                    display: 'block', 
                    backgroundColor: '#25D366', 
                    color: 'white', 
                    textAlign: 'center', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    textDecoration: 'none', 
                    fontWeight: 'bold' 
                  }}
                >
                  Comprar por WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}