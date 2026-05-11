'use client'
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch('/api/productos/create');
      if (!res.ok) throw new Error('Error al cargar');
      const data = await res.json();
      setProductos(Array.isArray(data)? data : []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar productos');
      setProductos([]);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/productos/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(data.url);
    } catch (error) {
      alert('Error al subir: ' + error.message);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) return alert('Sube una imagen primero');
    const url = editandoId? `/api/productos/update/${editandoId}` : '/api/productos/create';
    const method = editandoId? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio, stock, imagen: imageUrl })
    });
    const data = await res.json();
    if (res.ok) {
      alert(editandoId? 'Producto actualizado' : 'Producto creado');
      resetForm();
      cargarProductos();
    } else {
      alert('Error: ' + data.error);
    }
  };

  const handleEditar = (producto) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setImageUrl(producto.imagen);
    setImagePreview(producto.imagen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    const res = await fetch(`/api/productos/delete/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Producto eliminado');
      cargarProductos();
    }
  };

  const resetForm = () => {
    setEditandoId(null); setNombre(''); setPrecio(''); setStock(''); setImageUrl(''); setImagePreview(null);
  };

  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '10px', border: '2px solid #000', borderRadius: '4px', fontSize: '16px', marginBottom: '15px', backgroundColor: 'white', color: '#000' };
  const btnStyle = { backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };

  return (
    <div style={{ padding: '32px', fontFamily: 'Arial', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', marginBottom: '20px', borderRadius: '4px' }}>{error}</div>}
      
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#000' }}>
        {editandoId? 'Editar Producto' : 'Crear Producto'}
      </h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '48px', padding: '24px', border: '3px solid #000', borderRadius: '8px', backgroundColor: 'white' }}>
        
        <label style={labelStyle}>Nombre del producto *</label>
        <input 
          type="text" 
          placeholder="Ej: Camiseta Nike" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          required 
          style={inputStyle} 
        />

        <label style={labelStyle}>Precio *</label>
        <input 
          type="number" 
          placeholder="Ej: 50000" 
          value={precio} 
          onChange={e => setPrecio(e.target.value)} 
          required 
          style={inputStyle} 
        />

        <label style={labelStyle}>Stock disponible</label>
        <input 
          type="number" 
          placeholder="Ej: 10" 
          value={stock} 
          onChange={e => setStock(e.target.value)} 
          style={inputStyle} 
        />

        <label style={labelStyle}>Imagen del producto *</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          disabled={uploading} 
          style={{ marginBottom: '10px', color: '#000', fontSize: '14px' }} 
        />
        {uploading && <p style={{ color: '#000', fontWeight: 'bold' }}>Subiendo imagen...</p>}
        {imagePreview && <img src={imagePreview} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px', border: '2px solid #000' }} />}
        
        <div>
          <button type="submit" disabled={uploading ||!imageUrl} style={{...btnStyle, opacity: (uploading ||!imageUrl)? 0.5 : 1, cursor: (uploading ||!imageUrl)? 'not-allowed' : 'pointer'}}>
            {editandoId? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
          {editandoId && <button type="button" onClick={resetForm} style={{...btnStyle, backgroundColor: '#6b7280', marginLeft: '10px'}}>Cancelar Edición</button>}
        </div>
      </form>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>Lista de Productos</h2>
      {productos.length === 0 && <p style={{ color: '#000' }}>No hay productos aún. Crea el primero arriba.</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {productos.map(prod => (
          <div key={prod.id} style={{ border: '3px solid #000', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
            <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px', border: '2px solid #000' }} />
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#000', marginBottom: '5px' }}>{prod.nombre}</h3>
            <p style={{ fontSize: '20px', color: '#2563eb', fontWeight: 'bold', margin: '5px 0' }}>${prod.precio}</p>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>Stock: {prod.stock}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEditar(prod)} style={{...btnStyle, backgroundColor: '#eab308', padding: '8px 16px', fontSize: '14px'}}>Editar</button>
              <button onClick={() => handleEliminar(prod.id)} style={{...btnStyle, backgroundColor: '#dc2626', padding: '8px 16px', fontSize: '14px'}}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}