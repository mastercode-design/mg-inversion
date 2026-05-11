'use client'
import { FaWhatsapp } from 'react-icons/fa';

export default function ProductCard({ product }) {
  // Mensaje prellenado para WhatsApp
  const mensaje = `Hola M.G INVERSIÓN! 👋 Estoy interesado en: *${product.name}* - Precio: $${Number(product.price).toLocaleString('es-CO')}. ¿Sigue disponible?`;
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  // Tus 2 números
  const numero1 = '573151101628';
  const numero2 = '573174811805';

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:scale-105 transition-transform">
      <img 
        src={product.image || '/placeholder.png'} 
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      
      <div className="p-4 text-white">
        <span className="text-xs bg-purple-500 px-2 py-1 rounded-full">{product.category}</span>
        <h3 className="text-lg font-bold mt-2">{product.name}</h3>
        <p className="text-2xl font-bold text-pink-400 mt-1">
          ${Number(product.price).toLocaleString('es-CO')}
        </p>
        
        <div className="flex flex-col gap-2 mt-4">
          <a 
            href={`https://wa.me/${numero1}?text=${mensajeCodificado}`}
            target="_blank"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold"
          >
            <FaWhatsapp /> WhatsApp 315 110 1628
          </a>
          
          <a 
            href={`https://wa.me/${numero2}?text=${mensajeCodificado}`}
            target="_blank"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            <FaWhatsapp /> WhatsApp 317 481 1805
          </a>
        </div>
      </div>
    </div>
  );
}